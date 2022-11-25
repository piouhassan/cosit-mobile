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

const  CustomerAdd =  ({updateData = null,countries = [],token,setVisible,onCreated})  => {

     const [loading,setLoading] = useState(false)
     const [gloading,setGloading] = useState(true)

    const validationSchema = yup.object().shape({
        email: yup.string().email("Le format de l'email n'est pas valide").required("L'email est obligatoire"),
        fullname: yup.string().required("Le nom complet est obligatoire"),
        phone: yup.string().min(8).required("Le numéro de téléphone est obligatoire"),
        country: yup.string().required("Le pays est obligatoire"),
        address: yup.string().required("L'adresse est obligatoire"),
    });

     setTimeout(()=>{
         setGloading(false)
     },2000)

    const initialValues = {
        fullname : updateData != null ? updateData.fullname : "",
        email : updateData != null ? updateData.email : "",
        phone : updateData != null ? updateData.phone : "",
        country : updateData != null ? updateData.country : "",
        address : updateData != null ? updateData.address : "",
    }

    const HandleCustomer = async (values) => {
         setLoading(true)
        values.country = countries.filter((item)=> values.country == item.title)[0].id


        if (updateData != null){
            try {
                await axios.post(Server_link+'customer/edit/'+updateData.id, values,attachTokenToHeaders(token))
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
                await axios.post(Server_link+'customer/add', values,attachTokenToHeaders(token))
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


    return (
        <View style={{
            marginTop : 60
        }}>
            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75 }} /> :

                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleCustomer}>
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
                                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 25}} >{updateData == null ? "Nouveau client" : "Modifier client"}</Text>
                                </View>
                                    <View style={{width : "100%",flexDirection : "row"}}>
                                        <View style={{width : "49%",marginRight : "1%"}}>
                                            <TextInput
                                                mode="outlined"
                                                label="Nom & Prénom(s)"
                                                onChangeText={handleChange('fullname')}
                                                onBlur={handleBlur('fullname')}
                                                value={values.fullname}
                                                style={styles.input}
                                            />
                                            <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                                {(touched.fullname && errors.fullname) &&  <Text style={styles.errors}>{errors.fullname}</Text>}
                                            </View>
                                        </View>
                                        <View style={{width : "49%",marginLeft : "1%"}}>
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
                                    </View>

                                <View style={{width : "100%",flexDirection : "row"}}>
                                    <View style={{width : "49%",marginRight : "1%"}}>
                                        <AutocompleteDropdown
                                            clearOnFocus={false}
                                            closeOnBlur={true}
                                            closeOnSubmit={false}
                                            inputHeight={40}
                                            initialValue={{ id: (updateData != null ? updateData.country : 138) }}
                                            textInputProps={{
                                                placeholder: '--Pays--',
                                                autoCorrect: false,
                                                autoCapitalize: 'none'
                                            }}
                                            onChangeText={handleChange('country')}
                                            onBlur={handleBlur('country')}
                                            inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                            dataSet={countries}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.country && errors.country) &&  <Text style={styles.errors}>{errors.country}</Text>}
                                        </View>
                                    </View>

                                    <View style={{width : "49%",marginLeft : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Numéro de téléphone"
                                            style={styles.input}
                                            onChangeText={handleChange('phone')}
                                            keyboardType = 'number-pad'
                                            onBlur={handleBlur('phone')}
                                            value={values.phone}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.phone && errors.phone) &&  <Text style={styles.errors}>{errors.phone}</Text>}
                                        </View>

                                    </View>
                                </View>


                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label="Adresse"
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        value={values.address}
                                        style={styles.input}
                                    />
                                    <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                        {(touched.address && errors.address) &&  <Text style={styles.errors}>{errors.address}</Text>}
                                    </View>
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

export default CustomerAdd;