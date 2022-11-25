import React, {useState} from "react"
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {COLORS} from "../../constants";
import AnimedButton from "../../components/AnimedButton";
import Buttons from "../../components/Buttons";
import {Formik} from "formik";
import axios from "axios";
import {ErrorHandler, Server_link, toastAlert} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import * as yup from "yup";
import {TextInput} from "react-native-paper";
import {AutocompleteDropdown} from "react-native-autocomplete-dropdown";

const  OutcomingAdd = ({setVisible, updateData, onCreated,motifs,token,projets})  => {


    const [loading,setLoading] = useState(false)
    const [gloading,setGloading] = useState(true)
    const [motif,setMotif] = useState("")
    const [projet,setProjet] = useState("")
    const [empty_projet_id,setEmptyProjetIdError] = useState(false)
    const [empty_motif_id,setEmptyMotifIdError] = useState(false)


    const validationSchema = yup.object().shape({
        amount : yup.string().required("Le montant est obligatoire"),
    });

    setTimeout(()=>{
        setGloading(false)
    },2000)


    const initialValues = {
        amount : updateData != null ? updateData.amount : "",
        motif : updateData != null ? updateData.motif : "",
        projet_id : updateData != null ? updateData.projet_id : "",
        commentaire : updateData != null ? updateData.commentaire : "",
    }


    const HandleOutcoming = async (values) =>{
        setLoading(true)

        if (motif == ""){
            setEmptyMotifIdError(true)
        }
        if (projet == ""){
            setEmptyProjetIdError(true)
        }
        else{
            setEmptyMotifIdError(false)
            setEmptyProjetIdError(false)

            values.motif  = motif
            values.projet_id  = projet

            console.log(values)

            if (updateData != null){
                try {
                    await axios.post(Server_link+'outcoming/edit/'+updateData.id, values,attachTokenToHeaders(token))
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
                    toastAlert(ErrorHandler(err.message))
                }
            }
            else{
                try {
                    await axios.post(Server_link+'outcoming/add', values,attachTokenToHeaders(token))
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
        }

    }



    return (
        <View style={{
            marginTop : 60
        }}>
            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75}}/> :
                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleOutcoming}>
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
                                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 25}} >{updateData == null ? "Nouvelle dépense" : "Modifier dépense"}</Text>
                                </View>


                                    <View>
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

                                    <View style={{width : "100%",flexDirection : "row"}}>
                                        <View style={{marginTop : 10,width : "49%",marginLeft : "1%"}} >
                                            <AutocompleteDropdown
                                                clearOnFocus={false}
                                                closeOnBlur={true}
                                                closeOnSubmit={false}
                                                inputHeight={40}
                                                initialValue={{ id: (updateData != null ? updateData.projet : null) }}
                                                textInputProps={{
                                                    placeholder: '--Projet--',
                                                    autoCorrect: false,
                                                    autoCapitalize: 'none'
                                                }}
                                                onChangeText={handleChange('projet')}
                                                onBlur={handleBlur('projet')}
                                                onSelectItem={(item)=> {item && setProjet(item.id)}}
                                                inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                                dataSet={projets}
                                            />
                                            <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                                {(empty_projet_id) &&  <Text style={styles.errors}>Le choix du projet est obligatoire</Text>}
                                            </View>
                                        </View>
                                        <View style={{marginTop : 10,width : "49%",marginLeft : "1%"}}>
                                            <AutocompleteDropdown
                                                clearOnFocus={false}
                                                closeOnBlur={true}
                                                closeOnSubmit={false}
                                                inputHeight={40}
                                                initialValue={{ id: (updateData != null ? updateData.motif : null) }}
                                                textInputProps={{
                                                    placeholder: '--Motif--',
                                                    autoCorrect: false,
                                                    autoCapitalize: 'none'
                                                }}
                                                onChangeText={handleChange('motif')}
                                                onBlur={handleBlur('motif')}
                                                onSelectItem={(item)=> {item && setMotif(item.id)}}
                                                inputContainerStyle={{padding  : 8,backgroundColor : COLORS.white,borderColor : COLORS.black,borderWidth : 1,marginTop : 5}}
                                                dataSet={motifs}
                                            />
                                            <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                                {(empty_motif_id) &&  <Text style={styles.errors}>Le choix du motif est obligatoire</Text>}
                                            </View>
                                        </View>
                                    </View>

                                   <View style={{marginTop : 15}}>
                                       <TextInput
                                           mode="outlined"
                                           label="Commentaire (facultatif)"
                                           onChangeText={handleChange('commentaire')}
                                           onBlur={handleBlur('commentaire')}
                                           multiline = {true}
                                           numberOfLines = {4}
                                           value={values.commentaire}
                                           style={styles.input}
                                       />
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
    )
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

export default OutcomingAdd