import React from 'react'
import { StyleSheet, Text, View,Pressable } from 'react-native'
import {Colors} from "../constants";

const BtnSmall = ({on_press,btn_text,disabled,loading}) => {

    return (
        <Pressable  disabled={disabled} style={disabled ? styles.disabled : styles.button} onPress={on_press}
        >
            <Text style={{fontSize:15,textAlign:'center',position:'relative',fontFamily:'Roboto-Black',color:Colors.white}} >{btn_text}</Text>


        </Pressable>
    )
}

export default BtnSmall

const styles = StyleSheet.create({
    button : {
        justifyContent:'center',
        width:'50%',
        backgroundColor:Colors.primary,
        height:50,
        marginBottom:30,
        borderRadius:50
    },

    disabled : {
        justifyContent:'center',
        width:'50%',
        backgroundColor:Colors.black,
        opacity : 0.5,
        height:50,
        marginBottom:30,
        borderRadius:50
    }

})
