import {StyleSheet, Text, View, StatusBar, Image, ImageBackground, PermissionsAndroid, Alert} from 'react-native'
import {Colors} from '../../constants'
import Buttons from '../../components/Buttons'


const Onboarding = ({navigation}) => {

    return (
        <View style={{flex:1,backgroundColor:Colors.white}} >
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />


            {/* handshake image */}
            <View style={{flex:2,flexDirection:"column",backgroundColor:'#fff',paddingHorizontal : 10}} >
                <ImageBackground source={require('../../assets/images/welcome.png')}
                style={{flex:1,width:'100%',backgroundColor:'#fff'}}  />
            </View>


            {/* button and text */}
            <View style={{flex:1,backgroundColor:'#fff'}} >
                {/* Text part */}
                <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff'}} >
                    <Text style={{fontFamily:'Poppins-Regular',color:Colors.black,fontSize:50}} >COSIT-DEPENSE</Text>
                    <Text style={{maxWidth:'70%', fontFamily:'Poppins-Medium',color:"#999",fontSize:14, textAlign:'center',paddingTop:10}} >
                      Gestion des entrées et des sorties de fonds.
                    </Text>
                </View>


                {/* Button */}
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width : "50%",marginLeft : "25%"}} >
                    <Buttons btn_text={"Commencer"} on_press={()=>navigation.navigate("Login")} />
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({})


export default Onboarding;

