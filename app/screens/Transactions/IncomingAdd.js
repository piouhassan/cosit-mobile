import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import * as yup from "yup";
import {COLORS} from "../../constants";
import AnimedButton from "../../components/AnimedButton";
import Buttons from "../../components/Buttons";
import {Formik} from "formik";
import {AutocompleteDropdown} from "react-native-autocomplete-dropdown";
import {TextInput} from "react-native-paper";
import DocumentPicker, { types } from 'react-native-document-picker';
import axios from "axios";
import {ErrorHandler, Server_link, toastAlert} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import Feather from "react-native-vector-icons/Feather";
import Platform from "react-native/Libraries/Utilities/Platform";

const  IncomingAdd = ({updateData = null,projets = [],token,setVisible,onCreated}) => {
    const [loading,setLoading] = useState(false)
    const [Floading,setFLoading] = useState(false)
    const [gloading,setGloading] = useState(true)
    const [fileResponse,setFileResponse] = useState([])

    const [projet_id,setProjetId] = useState(updateData != null ? updateData.projet_id : "")
    const [empty_projet_id,setEmptyProjetIdError] = useState(false)


    const [fileshow,setFileShow] = useState(updateData?.invoice ? true : false)

    const validationSchema = yup.object().shape({
        amount : yup.string().required("Le montant est obligatoire"),
    });

    setTimeout(()=>{
        setGloading(false)
    },2000)


    const initialValues = {
         amount : updateData != null ? updateData.amount : "",
        projet_id : updateData != null ? updateData.projet_id : "",
        invoice : updateData != null ? updateData.invoice : "",
    }


    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'formSheet',
                copyToCacheDirectory: false,
                type: [types.pdf, types.docx,types.xlsx,types.xls,types.doc,types.csv]
            });
            setFileResponse(response);
        } catch (err) {
            console.warn(err);
        }
    }, []);


    const deleteFile = () =>{
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer le fichier ${updateData.invoice}`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () => deletefilefromServer()}
            ]
        )
    }


    const deletefilefromServer = () => {
        setFLoading(true)
        if (token != null){
            try{
                axios.delete(Server_link+"incoming/file/"+updateData.id,attachTokenToHeaders(token))
                    .then((response)=>{
                        setFLoading(false)
                        setFileShow(false)
                       toastAlert(response.data.message)
                    })
                    .catch(function(error) {
                        setFLoading(false)
                         toastAlert(ErrorHandler(err.message))
                    });
            }
            catch (e) {
                setFLoading(false)
               toastAlert(e.message)

            }
        }
    }

    const HandleIncoming = async (values) =>{
        setLoading(true)

        if (projet_id == ""){
            setEmptyProjetIdError(true)
        }else{
            setEmptyProjetIdError(false)
            const formData = new FormData();

            const fileInfo = {
                uri :fileResponse[0]?.uri,
                name : fileResponse[0]?.name,
                type : fileResponse[0]?.type
            }



            formData.append('amount',values.amount)
            formData.append('projet_id',projet_id)
            formData.append('invoice',fileInfo)

            if (updateData != null){


                try {
                    await axios.post(Server_link+'incoming/edit/'+updateData.id,formData,attachTokenToHeaders(token,true))
                        .then(async (response)=>{
                            if (response.data.succeed){
                                setLoading(false)
                                setVisible(false)
                                onCreated()
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
                    console.log(err)
                }
            }
            else{

                try {
                    await axios.post(Server_link+'incoming/add',formData,attachTokenToHeaders(token,true))
                        .then(async (response)=>{
                            if (response.data.succeed){
                                setLoading(false)
                                setVisible(false)
                                onCreated()
                                toastAlert(response.data.message)
                            }
                            else{
                                setLoading(false)
                                toastAlert(response.data.message)
                            }
                        }).catch((err) =>{
                            setLoading(false)
                            console.log(err)
                        })

                }
                catch (err) {
                    setLoading(false)
                    toastAlert(err.message)
                }
            }
        }

    }


    return (
        <View style={{
            marginTop : 60
        }}>
            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75}}/> :
                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleIncoming}>
                        {({ handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              isValid,
                              touched,
                              errors
                          }) => (
                            <View style={{padding : 10}}>
                                <View style={{flexDirection:'row',opacity : 0.7,justifyContent : 'center', alignItems : "center",marginBottom : 20}} >
                                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 25}} >{updateData == null ? "Nouvelle recette" : "Modifier recette"}</Text>
                                </View>

                                <View style={{width : "100%",flexDirection : "row"}}>
                                    <View style={{width : "49%",marginRight : "1%"}}>
                                        <TextInput
                                            mode="outlined"
                                            label="Amount"
                                            style={styles.input}
                                            onChangeText={handleChange('amount')}
                                            keyboardType = 'number-pad'
                                            onBlur={handleBlur('amount')}
                                            value={values.amount}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.amount && errors.amount) &&  <Text style={styles.errors}>{errors.amount}</Text>}
                                        </View>

                                    </View>
                                    <View style={{width : "49%",marginLeft : "1%"}}>
                                        <AutocompleteDropdown
                                            clearOnFocus={false}
                                            closeOnBlur={true}
                                            closeOnSubmit={false}
                                            inputHeight={40}
                                            initialValue={{ id: (updateData != null && updateData.projet_id) }}
                                            textInputProps={{
                                                placeholder: '--Projet--',
                                                autoCorrect: false,
                                                autoCapitalize: 'none'
                                            }}
                                            onChangeText={handleChange('projet_id')}
                                            onBlur={handleBlur('projet_id')}
                                            onSelectItem={(item)=> {item && setProjetId(item.id)}}
                                            inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                            dataSet={projets}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(empty_projet_id && empty_projet_id) &&  <Text style={styles.errors}>Le choix du projet est obligatoire</Text>}
                                        </View>
                                    </View>
                                </View>


                                {
                                    fileshow &&
                                <View  style={{
                                    borderColor : COLORS.secondary,
                                    borderRadius : 7,
                                    borderWidth : 1,
                                    flexDirection : "row",
                                    padding : 15,
                                    justifyContent : "space-between",
                                    backgroundColor : COLORS.green
                                }}>
                                        <Text style={{color : COLORS.white}}>{updateData.invoice}</Text>

                                        <TouchableOpacity style={{}} onPress={()=>{deleteFile()}} >
                                            {
                                                Floading ? <ActivityIndicator color={COLORS.white} size={16} />
                                                    : <Feather name="x" size={17} color={COLORS.white} />
                                            }

                                        </TouchableOpacity>
                                </View>
                                }

                                <TouchableOpacity onPress={handleDocumentSelection}
                                    style={{
                                        marginTop : 10,
                                        width : "100%",
                                        borderWidth : 1,
                                        borderColor : "#101010",
                                        backgroundColor : "#f1f1f1",
                                        borderStyle : "dashed",
                                        height : 120,
                                        borderRadius : 7,
                                        justifyContent : "center",
                                        alignItems : "center"
                                    }}>



                                    {
                                        fileResponse?.length > 0 ?
                                            <View>
                                                {fileResponse.map((file, index) => (
                                                    <Text
                                                        key={index.toString()}
                                                        style={styles.uri}
                                                        numberOfLines={1}
                                                        ellipsizeMode={'middle'}>
                                                        {file?.uri}
                                                    </Text>
                                                ))}
                                            </View>
                                            :

                                            <Text>Choisir un fichier</Text>
                                    }
                                </TouchableOpacity>




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

export default IncomingAdd;