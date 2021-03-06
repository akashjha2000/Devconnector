const express=require('express')

const router=express.Router()
const auth=require('../../middleware/auth')
const Profile=require('../../models/Profile')
const User=require('../../models/User')
const {check,validationResult}=require('express-validator')
const { updateOne } = require('../../models/Profile')
const request=require('request')

//@route  GET api/profile/me
//@description Get current users profile
//@acess private
router.get('/me',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])

        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'})
        }

        res.json(profile)
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

//@route  POST api/profile/
//@description create or update a user profile
//@acess private

router.post('/',[
    auth,[
        check('status','Status is required').not().isEmpty(),
        check('skills','Skills is required').not().isEmpty()
    ]
],
    async (req,res)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        }=req.body

        //Build profile object

        const profileFields={}
        profileFields.user=req.user.id
        if(company) profileFields.company=company
        if(website) profileFields.website=website
        if(location) profileFields.location=location
        if(bio) profileFields.bio=bio
        if(status) profileFields.status=status
        if(githubusername) profileFields.githubusername=githubusername
        if(skills)
        {
            profileFields.skills=skills.split(',').map(skill=>skill.trim())
        }
        // console.log(profileFields.skills);
        // res.send('hello')

        //Build social object

        profileFields.social={}
        if(youtube) profileFields.social.youtube=youtube
        if(twitter) profileFields.social.twitter=twitter
        if(facebook) profileFields.social.facebook=facebook
        if(linkedin) profileFields.social.linkedin=linkedin
        if(instagram) profileFields.social.instagram=instagram


        try{
            let profile=await Profile.findOne({user:req.user.id})
            if(profile){
                // if profile exists do Update
                profile=await Profile.findOneAndUpdate(
                    {user:req.user.id },
                    {$set:profileFields},
                    {new:true}
                    )
                    return res.json(profile)
            }

            //if profile not exist Create
            profile=new Profile(profileFields)
            await profile.save()
            res.json(profile)
        }catch(err){
            console.error(err.message);
            res.status(500).send('Server Error')
        }
})


//@route  GET api/profile/
//@description get all profles
//@acess public

router.get('/',async (req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route  GET api/profile/user/:user_id
//@description get profile by user id
//@acess public

router.get('/user/:user_id',async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
        if(!profile)
        return res.status(400).json({msg:'Profile not found'})
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if(err.kind=='ObjectId')
            return res.status(400).json({msg:'Profile not found'})
        res.status(500).send('Server Error')
    }
})


//@route  DELETE api/profile/
//@description Delete profle,user and posts
//@acess private

router.delete('/',auth,async (req,res)=>{
    try {
        //Remove profile
        await Profile.findOneAndRemove({user:req.user.id})

        //Remove user
        await User.findOneAndRemove({_id:req.user.id})

        res.json({msg:'User removed'})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


//@route  PUT api/profile/experience
//@description Add profile experience
//@acess private

router.put('/experience',[auth,[
    check('title','Title is required')
    .not()
    .isEmpty(),
    check('company','Company is required')
    .not()
    .isEmpty(),
    check('from','From date is required')
    .not()
    .isEmpty()
]],async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body

    //Creates an object with the data that user submits
    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description 
    }

    try {
        const profile=await Profile.findOne({user:req.user.id})

        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})


//@route  DELETE api/profile/experience/:exp_id
//@description Delete experience from profile
//@acess private

router.delete('/experience/:exp_id',auth,async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id})

        //Get remove index
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex,1)

        await profile.save()

        res.json(profile)

    } catch (err) {
        
    }
})


//@route  PUT api/profile/education
//@description Add profile education
//@acess private

router.put('/education',[auth,[
    check('school','School is required')
    .not()
    .isEmpty(),
    check('degree','Degree is required')
    .not()
    .isEmpty(),
    check('fieldofstudy','Field of study is required')
    .not()
    .isEmpty(),
    check('from','From date is required')
    .not()
    .isEmpty()
]],async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body

    //Creates an object with the data that user submits
    const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description 
    }

    try {
        const profile=await Profile.findOne({user:req.user.id})

        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})


//@route  DELETE api/profile/education/:edu_id
//@description Delete education from profile
//@acess private

router.delete('/education/:edu_id',auth,async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id})

        //Get remove index
        const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex,1)

        await profile.save()

        res.json(profile)

    } catch (err) {
        
    }
})

//@route  GET api/profile/github/:username
//@description Get user repoes from github
//@acess public

router.get('/github/:username',(req,res)=>{
    try {
        const options={
            uri:`http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
            method:'GET',
            headers:{ 'user-agent':'node.js' }
        }

        request(options,(error,response,body)=>{
            if(error)
            return console.error(error)

            if(response.statusCode!==200)
            {
                return res.status(404).json({msg:'No github profile found'})
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports=router