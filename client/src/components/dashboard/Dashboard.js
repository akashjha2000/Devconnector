import React,{ useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import { Fragment } from 'react'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dashboard = ({getCurrentProfile,auth:{user},profile:{profile,loading}}) => {
    useEffect(() =>{
        getCurrentProfile()
    },[])
    return loading && profile===null ? <Spinner/>:<Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <FontAwesomeIcon icon={faUser}/>{' '}Welcome {user && user.name}
        </p>
        { profile !== null ? <Fragment>has</Fragment> : <Fragment>has not</Fragment>}
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps= state =>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps,{getCurrentProfile})(Dashboard)
