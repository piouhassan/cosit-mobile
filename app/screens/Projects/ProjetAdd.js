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

const  ProjetAdd =  ({updateData = null,users = [],customers = [],token,setVisible,onCreated})  => {

    const [loading,setLoading] = useState(false)
    const [gloading,setGloading] = useState(true)
    const [user,setUser] = useState("")
    const [empty_country_error,setEmptyCountryError] = useState(false)
    const [customer,setCustomer] = useState("")
    const [empty_customer_error,setEmptyCustomerError] = useState(false)

    const validationSchema = yup.object().shape({
        amount: yup.string().required("Le montant est obligatoire"),
        nom: yup.string().required("Le nom complet est obligatoire"),
    });

    setTimeout(()=>{
        setGloading(false)
    },2000)

    const initialValues = {
        nom : updateData != null ? updateData.nom : "",
        amount : updateData != null ? updateData.amount : "",
        responsable : updateData != null ? updateData.responsable : "",
        customer_id : updateData != null ? updateData.customer_id : "",
    }

    const HandleProject = async (values) => {
        setLoading(true)
        values.responsable = user
        values.customer_id = customer


        if (user == ""){
            setEmptyCountryError(true)
        }else {
            setEmptyCountryError(false)
             if (customer == ""){
                 setEmptyCustomerError(true)
             }else{
                 setEmptyCustomerError(false)
                 if (updateData != null){
                     try {
                         await axios.post(Server_link+'project/edit/'+updateData.id, values,attachTokenToHeaders(token))
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

                     console.log(values)
                     try {
                         await axios.post(Server_link+'project/add', values,attachTokenToHeaders(token))
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

                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleProject}>
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
                                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 25}} >{updateData == null ? "Nouveau projet" : "Modifier projet"}</Text>
                                </View>
                                <View style={{width : "100%",flexDirection : "row"}}>
                                    <View style={{width : "49%",marginRight : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Nom du projet"
                                            onChangeText={handleChange('nom')}
                                            onBlur={handleBlur('nom')}
                                            value={values.nom}
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.nom && errors.nom) &&  <Text style={styles.errors}>{errors.nom}</Text>}
                                        </View>
                                    </View>
                                    <View style={{width : "49%",marginLeft : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Montant"
                                            keyboardType = 'number-pad'
                                            onChangeText={handleChange('amount')}
                                            onBlur={handleBlur('amount')}
                                            value={values.amount}
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.amount && errors.amount) &&  <Text style={styles.errors}>{errors.amount}</Text>}
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
                                            initialValue={{ id: (updateData != null && updateData.user) }}
                                            textInputProps={{
                                                placeholder: '--Responsable--',
                                                autoCorrect: false,
                                                autoCapitalize: 'none'
                                            }}
                                            onChangeText={(item)=> setUser(item)}
                                            onBlur={(item)=> setUser(item)}
                                            onSelectItem={(item)=> {item && setUser(item.id)}}
                                            inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                            dataSet={users}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {empty_country_error &&  <Text style={styles.errors}>Le choix du  responsable est obligatoire</Text>}
                                        </View>
                                    </View>

                                    <View style={{width : "49%",marginLeft : "1%"}}>
                                        <AutocompleteDropdown
                                            clearOnFocus={false}
                                            closeOnBlur={true}
                                            closeOnSubmit={false}
                                            inputHeight={40}
                                            initialValue={{ id: (updateData != null && updateData.customer_id) }}
                                            textInputProps={{
                                                placeholder: '--Client--',
                                                autoCorrect: false,
                                                autoCapitalize: 'none'
                                            }}
                                            onChangeText={(item)=> setCustomer(item)}
                                            onBlur={(item)=> setCustomer(item)}
                                            onSelectItem={(item)=> {item && setCustomer(item.id)}}
                                            inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                            dataSet={customers}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {empty_customer_error &&  <Text style={styles.errors}>Le choix du client est obligatoire</Text>}
                                        </View>

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

export default ProjetAdd;