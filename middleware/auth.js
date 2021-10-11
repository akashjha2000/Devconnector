const jwt=require('jsonwebtoken')

const config=require('config')

const jwtCheck=(req,res,next)=>{
    //Get token from Header

    const token=req.header('x-auth-token')
   // res.json(token)
    //Check if no token

    if(!token){
        return res.status(401).json({msg:'No token,authorization denied'})
    }

    //Verify the token if there is
    try{
        const decoded=jwt.verify(token,config.get('jwtSecret'))

        req.user=decoded.user
        next()

    }catch(err){
        res.status(401).json({msg:'Token is not valid'})
    }
}
module.exports=jwtCheck