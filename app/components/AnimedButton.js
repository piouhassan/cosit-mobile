import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity ,ActivityIndicator} from 'react-native'
import {COLORS, Colors, SIZES} from "../constants";

const AnimedButton = ({on_press,btn_text,loading}) => {
    return (
        <TouchableOpacity disabled={loading}
                          style={{
                              flexDirection :"row",
                              justifyContent:'space-between',
                              width:'100%',
                              backgroundColor:COLORS.primary,
                              padding:15,
                              marginBottom:30,
                              borderRadius:SIZES.smallRadius,
                              opacity : 0.7
                          }}
                          onPress={on_press}
        >
            <Text style={{fontSize:15,position:'relative',fontFamily:'Roboto-Black',color:Colors.white}} >{btn_text}</Text>
            {loading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
    )
}

export default AnimedButton

const styles = StyleSheet.create({})
