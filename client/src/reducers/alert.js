import { SET_ALERT,REMOVE_ALERT } from '../actions/types'

const initialState =[]

export default function(state=initialState,action) {
    const {type,payload}=action
    switch (type) {
        case SET_ALERT: //dispatch the type
            return [...state,payload]  //return array with new state i.e payload
        case REMOVE_ALERT: 
            return state.filter(alert=>alert.id!==payload)  //returns all alert except payload
        default:  
            return state    
    }
}