import axios from 'axios';
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'

import { 
    REGISTER_SUCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types'

//LOAD USER
export const loadUser = () =>async dispatch =>{
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }

    try {
        const res=await axios.get('/api/auth')

        dispatch({
            type:USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}



//REGISTER USER
export const register =({name,email,password})=> async dispatch=>{
    const config={
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body=JSON.stringify({name,email,password})

    try {
        const res=await axios.post('/api/users',body,config)
        //if we don't get any error simply dispatch

        dispatch({
            type: REGISTER_SUCESS,
            payload:res.data
        })
        dispatch(loadUser())
    } catch (err) {
        //if like email is not valid or password is of not minimum required length then show alert message
        const errors=err.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:REGISTER_FAIL
        })
    }
}



//LOGIN USER
export const login =(email,password)=> async dispatch=>{
    const config={
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body=JSON.stringify({email,password})

    try {
        const res=await axios.post('/api/auth',body,config)
        //if we don't get any error simply dispatch

        dispatch({
            type: LOGIN_SUCESS,
            payload:res.data
        })
        dispatch(loadUser())
    } catch (err) {
        //if like email is not valid or password is of not minimum required length then show alert message
        const errors=err.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type:LOGIN_FAIL
        })
    }
}

//LOGOUT / CLEAR PROFILE
export const logout=()=>dispatch=>{
    dispatch({
        type:LOGOUT
    })
    dispatch({
        type:CLEAR_PROFILE
    })
}