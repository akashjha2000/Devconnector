
import React from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { logout } from '../../actions/auth'
import { Fragment } from 'react'

import { faSignOutAlt,faUser,faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Navbar = ({ auth:{isAuthenticated,loading},logout}) => {

    const authLinks=(
        <ul>
            <li><Link to="/dashboard">
            <FontAwesomeIcon icon={faUser}/>{' '}
            <span className="hide-sm">Dashboard</span>
            </Link>
        </li>
        <li>
            <a onClick={logout} href="!#">
            <FontAwesomeIcon icon={faSignOutAlt}/>{' '}
            <span className="hide-sm">Logout</span></a>
        </li>
        </ul>
    )

    const guestLinks=(
        <ul>
        <li><a href="!#">Developers</a></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        </ul>
    )

    return (
        <nav className="navbar bg-dark">
        <h1>
        <Link to='/'><FontAwesomeIcon icon={faCode}></FontAwesomeIcon> DevConnector</Link>
        </h1>
        {/* <ul>
        <li><a href="!#">Developers</a></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        </ul> */}
        {!loading && (<Fragment>{isAuthenticated ? authLinks:guestLinks}</Fragment>)}
    </nav>
    )
}

Navbar.propTypes={
    logout:propTypes.func.isRequired,
    auth:propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps,{logout})(Navbar)
