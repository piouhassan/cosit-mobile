import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    StyleSheet, Text, ToastAndroid,
    View
} from 'react-native'
import {Button, TextInput} from 'react-native-paper'
import {COLORS} from "../../constants";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Buttons from "../../components/Buttons";
import * as yup from "yup";
import {Formik} from "formik";
import AnimedButton from "../../components/AnimedButton";
import axios from "axios";
import {Server_link} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";

const  UserAdd =  ({updateData = null,roles = [],token,setVisible,onCreated})  => {

    const [loading,setLoading] = useState(false)
    const [gloading,setGloading] = useState(true)
    const [role_id,setRoleId] = useState("")
    const [empty_role_error,setEmptyRoleError] = useState(false)
    const [empty_password_error,setEmptyPasswordError] = useState(false)

    const validationSchema = yup.object().shape({
        firstname: yup.string().required("Le prénom est obligatoire"),
        lastname: yup.string().required("Le nom est obligatoire"),
        email: yup.string().email("Le format de l'email n'est pas valide").required("L'email est obligatoire"),
        telephone: yup.string().min(8).required("Le numéro de téléphone est obligatoire"),
    });

    setTimeout(()=>{
        setGloading(false)
    },2000)

    const initialValues = {
        lastname :"",
        firstname : "",
        telephone :"",
        email : "",
        password :  "",
    }

    const updateValues = {
        lastname : updateData != null ? updateData.lastname : "",
        firstname : updateData != null ? updateData.firstname : "",
        telephone : updateData != null ? updateData.telephone : "",
        email : updateData != null ? updateData.email : "",
    }



    const HandleUser = async (values) => {
        if (role_id == ""){
            setEmptyRoleError(true)
        }else{
            setEmptyRoleError(false)
           if (updateData == null && values.password == ""){
            setEmptyPasswordError(true)
           }else{
               setEmptyPasswordError(false)
               values.role_id = role_id
               setLoading(true)
               if (updateData != null){
                   try {
                       await axios.post(Server_link+'user/edit/'+updateData.id, values,attachTokenToHeaders(token))
                           .then(async (response)=>{
                               if (response.data.succeed){
                                   setLoading(false)
                                   setVisible(false)
                                   onCreated()
                                   ToastAndroid.showWithGravityAndOffset(
                                       response.data.message,
                                       ToastAndroid.LONG,
                                       ToastAndroid.TOP,
                                       25,
                                       50
                                   );

                               }
                               else{
                                   setLoading(false)
                                   ToastAndroid.showWithGravityAndOffset(
                                       response.data.message,
                                       ToastAndroid.LONG,
                                       ToastAndroid.TOP,
                                       25,
                                       50
                                   );

                               }
                           })

                   }
                   catch (err) {

                       ToastAndroid.showWithGravityAndOffset(
                           err.message,
                           ToastAndroid.LONG,
                           ToastAndroid.TOP,
                           25,
                           50
                       );
                   }
               }
               else{
                   try {
                       await axios.post(Server_link+'user/add', values,attachTokenToHeaders(token))
                           .then(async (response)=>{
                               if (response.data.succeed){
                                   setLoading(false)
                                   setVisible(false)
                                   onCreated()
                                   ToastAndroid.showWithGravityAndOffset(
                                       response.data.message,
                                       ToastAndroid.LONG,
                                       ToastAndroid.TOP,
                                       25,
                                       50
                                   );

                               }
                               else{
                                   setLoading(false)
                                   ToastAndroid.showWithGravityAndOffset(
                                       response.data.message,
                                       ToastAndroid.LONG,
                                       ToastAndroid.TOP,
                                       25,
                                       50
                                   );

                               }
                           })

                   }
                   catch (err) {
                       ToastAndroid.showWithGravityAndOffset(
                           err.message,
                           ToastAndroid.LONG,
                           ToastAndroid.TOP,
                           25,
                           50
                       );

                   }
               }
           }

        }
    }


    return (
        <View style={{
            marginTop : 60
        }}>
            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75 }} /> :

                    <Formik initialValues={updateData == null ? initialValues : updateValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleUser}>
                        {({ handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              isValid,
                              touched,
                              errors,
                              setFieldValue
                          }) => (
                            <View style={{padding : 10}}>
                                <View style={{flexDirection:'row',opacity : 0.7,justifyContent : 'center', alignItems : "center",marginBottom : 20}} >
                                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 25}} >{updateData == null ? "Nouvel utilisateur" : "Modifier utilisateur"}</Text>
                                </View>
                                <View style={{width : "100%",flexDirection : "row"}}>
                                    <View style={{width : "49%",marginRight : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Nom"
                                            onChangeText={handleChange('lastname')}
                                            onBlur={handleBlur('lastname')}
                                            value={values.lastname}
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.lastname && errors.lastname) &&  <Text style={styles.errors}>{errors.lastname}</Text>}
                                        </View>
                                    </View>
                                    <View style={{width : "49%",marginLeft : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Prénom(s)"
                                            onChangeText={handleChange('firstname')}
                                            onBlur={handleBlur('firstname')}
                                            value={values.firstname}
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.firstname && errors.firstname) &&  <Text style={styles.errors}>{errors.firstname}</Text>}
                                        </View>

                                    </View>
                                </View>

                                <View style={{width : "100%",flexDirection : "row"}}>
                                    <View style={{width : "49%",marginRight : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Email"
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.email && errors.email) &&  <Text style={styles.errors}>{errors.email}</Text>}
                                        </View>
                                    </View>

                                    <View style={{width : "49%",marginLeft : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Numéro de téléphone"
                                            onChangeText={handleChange('telephone')}
                                            onBlur={handleBlur('telephone')}
                                            value={values.telephone}
                                            keyboardType = 'number-pad'
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.telephone && errors.telephone) &&  <Text style={styles.errors}>{errors.telephone}</Text>}
                                        </View>
                                    </View>
                                </View>

                                <View style={{width : "100%",flexDirection : "row"}}>
                                    <View style={{width : updateData ==null ? "49%" : "100%",marginRight : updateData !=null ? 0 : "1%"}}>
                                        <AutocompleteDropdown
                                            clearOnFocus={false}
                                            closeOnBlur={true}
                                            closeOnSubmit={false}
                                            inputHeight={40}
                                            initialValue={{ id: (updateData != null && updateData.role_id ) }}
                                            textInputProps={{
                                                placeholder: '--Role--',
                                                autoCorrect: false,
                                                autoCapitalize: 'none'
                                            }}
                                            onChangeText={(item)=> setRoleId(item)}
                                            onBlur={(item)=> setRoleId(item)}
                                            onSelectItem={(item)=> {item && setRoleId(item.id)}}
                                            inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                            dataSet={roles}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(empty_role_error) &&  <Text style={styles.errors}>Le role est Obligatoire</Text>}
                                        </View>
                                    </View>
                                    {updateData ==null &&
                                        <View style={{width : "49%",marginLeft : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Mot de passe"
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                            style={styles.input}
                                            secureTextEntry={true}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(empty_password_error) &&  <Text style={styles.errors}>Le mot de passe est obligatoire</Text>}
                                        </View>
                                    </View>}
                                </View>



                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width : "50%",marginLeft : "25%",marginTop : 20}} >


                                    {
                                        loading ? <AnimedButton  loading={loading} btn_text={"Chargement..."} />
                                            :  <Buttons on_press={handleSubmit} btn_text={updateData != null ? "Modifier" : "Enregister"}  color={COLORS.primary} />
                                    }
                                </View>

                            </View>
                        )}
                    </Formik>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    input :  {
        backgroundColor : COLORS.white
    },
    errors : {
        color : COLORS.red,
        textAlign : 'center',
        marginBottom : 10
    }
})

export default UserAdd;