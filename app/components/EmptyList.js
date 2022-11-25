import React from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {COLORS, images} from "../constants";
import Feather from "react-native-vector-icons/Feather";

const HEIGHT = Dimensions.get('window').height
const EmptyList = () => {
    return (
        <View
            style={{
                flex : 1,
                flexDirection : "column",
                justifyContent : "center",
                alignItems : "center",
                marginTop : 100,
            }}
        >
            <Feather name="folder" size={100}  />
            <Text style={{
                marginTop : 20,
                fontSize : 25,
            }}>Liste vide</Text>
        </View>
    );
}

export default EmptyList;