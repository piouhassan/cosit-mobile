import axios from "axios";
import {attachTokenToHeaders} from "../store/actions/LoginAction";
import { ToastAndroid} from "react-native";

// export const Server = "http://depense.compta-cosit.com/"
export const Server = "http://192.168.43.173/"
export const Server_link = Server+"api/v1/"
export const Server_Img = Server+"/uploads/invoices/"
export const ErrorHandler = (error) => {
    if (error === "Network Error") {
        return "Veuillez vérifié votre connexion internet"
    }
    else{
        return error
    }

}
export const deletefromServer = (token,type,id,setloading,onCreated) => {
    setloading(true)

    if (token != null){
        try{
            axios.delete(Server_link+type+"/delete/"+id,attachTokenToHeaders(token))
                .then((response)=>{
                    setloading(false)
                    toastAlert(response.data.message)
                    onCreated()
                })
                .catch(function(error) {
                    setloading(false)
                    toastAlert(error.message)
                });
        }
        catch (e) {
            toastAlert(e.message)
        }
    }
}
export const togglefromServer = (token,Module,id,setloading,type,onCreated) => {
    setloading(true)

    if (token != null){
        try{
            axios.get(Server_link+Module+"/toggle/"+type+"/"+id,attachTokenToHeaders(token))
                .then((response)=>{
                    setloading(false)

                    toastAlert(response.data.message)

                    onCreated()

                })
                .catch(function(error) {
                    setloading(false)
                     toastAlert(JSON.stringify(error))
                });
        }
        catch (e) {
            setloading(false)
             toastAlert(e.message)
        }
    }
}
export const toastAlert = (message) =>{
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
    );
}
const  padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}
export const formatDate = (date) =>{
    const dat = new Date(date)
    return [
        padTo2Digits(dat.getDate()),
        padTo2Digits(dat.getMonth() + 1),
        dat.getFullYear(),
    ].join('/');

}
export const formatSimpleDate = (date) =>{
    const dat = new Date(date)
    return [
        padTo2Digits(dat.getDate()),
        padTo2Digits(dat.getMonth() + 1),
        dat.getFullYear(),
    ].join('/');

}
export const permission_autorisation = (moduleName,permission) => {
    if ( typeof permission == "string"){
        const permissions = JSON.parse(permission)
        for(var k = 0; k < permissions?.length;k++){
            const key = Object.keys(permissions[k]).toString()
             if (moduleName == key){
                return permissions[k][key]
             }
        }

    }
    else{
        console.log("erreur type")
    }
}


