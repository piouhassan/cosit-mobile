import React,{useState} from 'react'
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    ImageBackground
} from 'react-native'
import {COLORS, FONTS, SIZES} from '../../constants'
import {Formik} from "formik";
import * as yup from 'yup'
import Feather from "react-native-vector-icons/Feather";
import Buttons from "../../components/Buttons";
import {useDispatch, useSelector} from "react-redux";
import {LoginAction} from "../../store/actions/LoginAction";
import {ErrorHandler} from "../../constants/api";
import CustomToast from "../../components/CustomToast";
import AnimedButton from "../../components/AnimedButton";


const Login = ({navigation}) => {
    const [showpassword,setShowpassword] = useState(false)

    let {loading,error} =  useSelector(state => state.LoginReducer)


    const dispatch = useDispatch()

    const HandleSubmitLogin = (values) => {
        dispatch(LoginAction(values))}



        const validationSchema = yup.object().shape({
            email: yup.string()
                .email("Le format de l'email n'est pas valide")
                .required("L'email est obligatoire"),
            password: yup.string()
                .min(8,({min}) => `Le mot de passe doit contenir ${min} caractères`)
                .required("Le mot de passe est obligatoire"),
        });

    return (
        <ScrollView style={{flex:1,backgroundColor:'#fff',flexDirection:'column'}}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {error && <CustomToast visible={true} message={ErrorHandler(error)} /> }

            <View style={{flex:1,flexDirection:"column",backgroundColor:'#ddd',justifyContent : "center", justifyItems : "center",marginTop : 20}} >
                <ImageBackground source={require('../../assets/images/login.png')} style={{flex:2,height : 300,backgroundColor:'#fff'}}  />
            </View>

            {/* login form section */}
            <Formik
                initialValues={{ email: '',password : '' }}
                validateOnMount={true}
                validationSchema={validationSchema}
                onSubmit={HandleSubmitLogin}
            >
                {({ handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      isValid,
                      touched,
                      errors
                }) => (
                 <View style={{flex:2,flexDirection:'column',backgroundColor:'#fff',paddingTop:10,paddingHorizontal:'3%',borderTopLeftRadius : 50}} >
                <View style={{flexDirection:'row',opacity : 0.7}} >
                    <Text style={{color:COLORS.black,fontFamily : "Poppins-Regular",fontSize : 30}} >CONNEXION</Text>
                </View>

                     <View style={{marginTop : 10}}>
                         <Text style={{ fontsize : 8,opacity : 0.8}} >Si vous ne pocceder pas de compte, veuillez contacter un administrateur</Text>
                     </View>




                     <View style={{flexDirection:'column',paddingTop:20,justifyContent : "center",justifyItems : 'center'}} >
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'100%',borderRadius:SIZES.smallRadius,height:60}} >
                        <Feather  name='mail' size={22}  color={COLORS.primary} />
                        <TextInput
                            mode="outlined"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#818181"
                        />
                        <Feather name={!errors.email ? "check" : "x"} size={15} color={!errors.email ? COLORS.green : COLORS.primary} />
                    </View>

                    <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                        {(touched.email && errors.email) && <Text style={styles.errors}>{errors.email}</Text>}
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'100%',borderRadius:SIZES.smallRadius,height:60,marginTop:20}} >
                        <Feather  name='lock' size={22}  color={COLORS.primary} />
                        <TextInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={styles.input}
                            placeholder="Mot de passe"
                            secureTextEntry={!showpassword}
                            placeholderTextColor="#818181"
                        />
                        <TouchableOpacity onPress={()=> setShowpassword(!showpassword)}>
                            <Feather name={showpassword ? 'eye-off' : 'eye' } size={15} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={{alignContent : "flex-start", alignItems : "flex-start",marginTop : 10, paddingLeft: 10}}>
                        {(touched.password && errors.password) &&  <Text style={styles.errors}>{errors.password}</Text>}
                    </View>


                    <View style={{flex : 1, flexDirection: 'column',alignContent : "center",alignItems: "center", marginTop : 30}}>
                        {
                          loading ? <AnimedButton  loading={loading} btn_text={"Chargement..."} />
                              : <Buttons  btn_text={"Se Connecter"}  on_press={handleSubmit} loading={loading} />

                        }
                    </View>


                </View>
            </View>
                )}
            </Formik>
           
        </ScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    input:{
        position:'relative',
        height:'100%',
        width:'85%',
        fontFamily:'Poppins-Medium',
        paddingLeft:30,
    },

    errors : {
        color : COLORS.red,
        textAlign : 'center'
    }
})