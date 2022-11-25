import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import {Colors, SIZES} from "../constants";

const Buttons = ({on_press,btn_text,color = null}) => {
    return (
        <TouchableOpacity style={{justifyContent:'center',width:'100%',backgroundColor:color == null ? Colors.primary : color,height:50,marginBottom:30,borderRadius:SIZES.smallRadius}}
        onPress={on_press}
        >

            <Text style={{fontSize:15,textAlign:'center',position:'relative',fontFamily:'Roboto-Black',color:Colors.white}} >{btn_text}</Text>
        </TouchableOpacity>
    )
}

export default Buttons

const styles = StyleSheet.create({})
