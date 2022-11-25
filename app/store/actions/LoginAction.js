import {LOGIN_FAILED, LOGIN_LOADING, LOGIN_SUCCESS, LOGOUT} from "../type";
import {Server_link} from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export const Init =  () => async (dispatch) =>{
     let token = await  AsyncStorage.getItem('token')
     let user = await  AsyncStorage.getItem('user')
     let permissions = await  AsyncStorage.getItem('permissions')

     console.log(permissions)

      if(token != null){
          console.log("token fetched")
          dispatch({
              type: LOGIN_SUCCESS,
              payload: {token:  token, userData: user},
          });
          // return {token : token, user : user}

      }
}


export const LoginAction =  (formData) => async (dispatch) =>{

    dispatch({ type: LOGIN_LOADING });
    try {

    await axios.post(Server_link+'login', formData)
         .then(async (response)=>{
             if (!response.data.succeed){
                 dispatch({
                     type: LOGIN_FAILED,
                     payload: { error : response.data.message },
                 });

             }
             else{
                 await  AsyncStorage.setItem('token',response.data.token)
                 await  AsyncStorage.setItem('user',JSON.stringify(response.data.user))
                 await  AsyncStorage.setItem('permissions',response.data.permission)


                 console.log("token store")

                 dispatch({
                     type: LOGIN_SUCCESS,
                     payload: {token: response.data.token, userData: response.data.user},
                 });


             }
         })

    } catch (err) {
        console.log(err)
        dispatch ({
            type: LOGIN_FAILED,
            payload: { error: err.message },
        });
    }
}

export const LogoutAction =  () => async (dispatch) =>{
   await AsyncStorage.clear();
    dispatch ({
        type : LOGOUT,
        payload : null
    })
}

export const attachTokenToHeaders = (token = null,file) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (file) {

        config.headers['Accept'] = "application/json"
        config.headers['Content-Type'] = "multipart/form-data"
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
};