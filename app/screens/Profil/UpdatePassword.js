import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {COLORS} from "../../constants";
import {Formik} from "formik";
import {TextInput} from "react-native-paper";
import AnimedButton from "../../components/AnimedButton";
import Buttons from "../../components/Buttons";
import * as yup from "yup";
import axios from "axios";
import {Server_link, toastAlert} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";

const  UpdatePassword = ({token,setVisible}) => {
    const [loading,setLoading] = useState(false)
    const [gloading,setGloading] = useState(true)

    setTimeout(()=>{
        setGloading(false)
    },1000)


    const validationSchema = yup.object().shape({
        old_pass: yup.string().required("Le mot de passe actuel est obligatoire"),
        new_pass: yup.string().required("Le nouveau mot de passe est obligatoire"),
        conf_pass: yup.string()
            .required("confirmer le mot de passe").min(8,({min}) => `Le mot de passe doit contenir ${min} caractères`)
            .oneOf([yup.ref('new_pass'),null],"Les mots de passe ne sont pas conformes")
        ,
    });


    const initialValues = {
        old_pass : "",
        new_pass : "",
        conf_pass : "",
    }

    const handleUpdatePass = async (values) => {
        setLoading(true)
        try {
            await axios.post(Server_link+'user/update/password', values,attachTokenToHeaders(token))
                .then(async (response)=>{
                    if (response.data.succeed){
                        setLoading(false)
                        setVisible(false)
                        toastAlert(response.data.message)
                    }
                    else{
                        setLoading(false)
                        toastAlert(response.data.message)
                    }
                })

        }
        catch (err) {
            toastAlert(err.message)
        }
    }


    return (
        <View style={{
            marginTop : 10
        }}>
            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75 }} /> :

                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={handleUpdatePass}>
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

                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label="Mot de passe actuel"
                                        onChangeText={handleChange('old_pass')}
                                        onBlur={handleBlur('old_pass')}
                                        value={values.old_pass}
                                        secureTextEntry={true}
                                        style={styles.input}
                                    />
                                    <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                        {(touched.old_pass && errors.old_pass) &&  <Text style={styles.errors}>{errors.old_pass}</Text>}
                                    </View>
                                </View>
                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label="Nouveau mot de passe"
                                        onChangeText={handleChange('new_pass')}
                                        onBlur={handleBlur('new_pass')}
                                        value={values.new_pass}
                                        secureTextEntry={true}
                                        style={styles.input}
                                    />
                                    <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                        {(touched.new_pass && errors.new_pass) &&  <Text style={styles.errors}>{errors.new_pass}</Text>}
                                    </View>

                                </View>
                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label="Confirmer nouveau mot de passe"
                                        onChangeText={handleChange('conf_pass')}
                                        onBlur={handleBlur('conf_pass')}
                                        value={values.conf_pass}
                                        secureTextEntry={true}
                                        style={styles.input}
                                    />
                                    <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                        {(touched.conf_pass && errors.conf_pass) &&  <Text style={styles.errors}>{errors.conf_pass}</Text>}
                                    </View>
                                </View>


                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width : "50%",marginLeft : "25%",marginTop : 50}} >


                                    {
                                        loading ? <ActivityIndicator color={COLORS.primary} size={20} style={{paddingTop: 10 }} />
                                            :  <Buttons on_press={handleSubmit} btn_text={"Modifier"}  color={COLORS.primary} />
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

export default UpdatePassword;