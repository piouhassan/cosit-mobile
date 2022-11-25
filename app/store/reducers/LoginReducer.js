import {LOGIN_FAILED, LOGIN_LOADING, LOGIN_SUCCESS, LOGOUT} from "../type";

const initialState = {
     loading : false,
     authToken : null,
     userData : {},
     error : null,
     isLogged : false,
}

export default (state = initialState,action) =>{
    switch (action.type){
        case LOGIN_LOADING:
            return {
                ...state,
                loading : true,
                error: null
            }

        case LOGIN_SUCCESS:
            return {
                ...state,
                loading : false,
                authToken: action.payload.token,
                userData: action.payload.userData,
                isLogged : true
            }

        case LOGIN_FAILED:
            return {
                ...state,
                 loading : false,
                error: action.payload.error,
                isLogged : false

            }

        case LOGOUT:
            return {
                ...initialState
            }
        default :
            return state
    }
}