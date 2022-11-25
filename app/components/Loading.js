import React from 'react';
import {ActivityIndicator, Text, View} from "react-native";
import {COLORS} from "../constants";

const Loading = () => {
    return (
        <View style={{marginTop: 180,justifyContent : "center",alignItems : "center"}}><ActivityIndicator size="large" color={COLORS.primary}/>
            <Text style={{fontSize : 15, fontFamily : "Poppins-Medium",marginTop : 20}}>Chargement de la liste en cours</Text>
        </View>
    );
}

export default Loading;