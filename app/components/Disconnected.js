import React from 'react';
import {Image, Text, View} from "react-native";
import {COLORS, images} from "../constants";
import Feather from "react-native-vector-icons/Feather";

const Disconnected = () => {
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
           <Feather name="cloud-off" size={100} />
           <Text style={{
               marginTop : 20,
               fontSize : 25,
           }}>Vous êtes hors ligne</Text>
       </View>
    );
}

export default Disconnected;