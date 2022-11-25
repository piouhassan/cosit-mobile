import React from 'react'
import { StyleSheet, Text, View,StatusBar,Image } from 'react-native'
import {Colors} from '../../constants'
import {useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Splash = ({navigation}) => {

    setTimeout(async ()=>{
        const token =  await AsyncStorage.getItem("token");
        if (token != null){navigation.navigate('Home')}else{navigation.navigate('Onboarding')}
    },3000)


    return (
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:Colors.white}} >
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#fff" />
            <Image source={require('../../assets/images/logo.png')} style={{width:200,height:75}}  />
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({})
