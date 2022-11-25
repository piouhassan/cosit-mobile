import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {COLORS} from "../../constants";
import {Formik} from "formik";
import {TextInput} from "react-native-paper";
import AnimedButton from "../../components/AnimedButton";
import Buttons from "../../components/Buttons";
import * as yup from "yup";
import axios from "axios";
import {Server_link, toastAlert} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";

const  UpdateInfo = ({data,token,setVisible,reload}) => {

    const [gloading,setGloading] = useState(true)
    const [loading,setLoading] = useState(false)

    setTimeout(()=>{
        setGloading(false)
    },1000)


    const HandleProfil = async (values) =>{
        setLoading(true)

        try {
            await axios.post(Server_link+'user/update/information', values,attachTokenToHeaders(token))
                .then(async (response)=>{
                    if (response.data.succeed){
                        setLoading(false)
                        setVisible(false)
                        reload(response.data.user)
                        toastAlert(response.data.message)

                    }
                    else{
                        setLoading(false)
                        toastAlert(response.data.message)
                    }
                })

        }
        catch (err) {
            setLoading(false)
            toastAlert(err.message)
        }
    }

    const validationSchema = yup.object().shape({
        firstname: yup.string().required("Le prénom est obligatoire"),
        lastname: yup.string().required("Le nom est obligatoire"),
        email: yup.string().email("Le format de l'email n'est pas valide").required("L'email est obligatoire"),
        telephone: yup.string().min(8).required("Le numéro de téléphone est obligatoire"),
    });


    const initialValues = {
        lastname : data?.lastname,
        firstname :data?.firstname,
        telephone :data?.telephone,
        email : data?.email,
    }

    return (
        <View style={{
            marginTop : 10
        }}>
            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75}}/>
                         :
                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleProfil}>
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

                                    <View >
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

                                    <View>
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



                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width : "50%",marginLeft : "25%",marginTop : 50}} >


                                    {
                                        loading ? <ActivityIndicator color={COLORS.primary} size={20} style={{paddingTop: 10 }} />
                                            :  <Buttons on_press={handleSubmit} btn_text="Modifier"  color={COLORS.primary} />
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

export default UpdateInfo;