import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {COLORS} from "../constants";
import Feather from "react-native-vector-icons/Feather";

const Badge = ({text}) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection : 'row',
                borderWidth : 1,
                borderRadius : 50,
                borderColor : "#ccc",
                justifyContent : "center",
                alignItems : "center",
                padding : 8,
                backgroundColor : "#ccc",
            }}
        >
            <Feather name="search" size={15} />
            <Text style={{color : COLORS.black,fontSize : 12,marginLeft : 10}}>{text}</Text>
        </TouchableOpacity>
    );
}


export default Badge;