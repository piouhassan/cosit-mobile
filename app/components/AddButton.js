import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {COLORS} from "../constants";
import Feather from "react-native-vector-icons/Feather";

const AddButton = ({on_press}) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection :"row",
                borderWidth : 1,
                borderColor : COLORS.gray,
                borderRadius : 4,
                justifyContent : "center",
                alignItems : "center",
                padding : 5,
                fontFamily: "Poppins-Regular"
            }}
            onPress={on_press}
        >
            <Feather  name="plus" size={15} color={COLORS.gray}/>
            <Text style={{color : COLORS.gray}}>Nouveau</Text>
        </TouchableOpacity>
    );
}


export default AddButton;