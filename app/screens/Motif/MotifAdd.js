import React, {useState} from 'react';
import {
    ActivityIndicator,
    StyleSheet, Text, ToastAndroid,
    View
} from 'react-native'
import {TextInput} from 'react-native-paper'
import {COLORS} from "../../constants";
import Buttons from "../../components/Buttons";
import * as yup from "yup";
import {Formik} from "formik";
import AnimedButton from "../../components/AnimedButton";
import axios from "axios";
import {Server_link} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";

const  MotifAdd =  ({updateData = null,token,setVisible,onCreated})  => {

    const [loading,setLoading] = useState(false)
    const [gloading,setGloading] = useState(true)


    const validationSchema = yup.object().shape({
        motif: yup.string().required("Le motif est obligatoire"),
    });

    setTimeout(()=>{
        setGloading(false)
    },2000)

    const initialValues = {
        motif : updateData != null ? updateData.motif : "",
    }

    const HandleMotif = async (values) => {
        setLoading(true)
                 if (updateData != null){
                     try {
                         await axios.post(Server_link+'motif/edit/'+updateData.id, values,attachTokenToHeaders(token))
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
                         await axios.post(Server_link+'motif/add', values,attachTokenToHeaders(token))
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

                    <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema} onSubmit={HandleMotif}>
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
                                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 25}} >{updateData == null ? "Nouveau motif" : "Modifier motif"}</Text>
                                </View>


                              <View>
                                        <TextInput
                                            mode="outlined"
                                            label="Motif"
                                            onChangeText={handleChange('motif')}
                                            onBlur={handleBlur('motif')}
                                            value={values.motif}
                                            style={styles.input}
                                        />
                                        <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                                            {(touched.motif && errors.motif) &&  <Text style={styles.errors}>{errors.motif}</Text>}
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

export default MotifAdd;