import React from 'react';
import {ActivityIndicator, Text, View} from "react-native";
import {COLORS} from "../constants";

const OperationLoading = ({visible}) => {
    return visible && <View style={{flexDirection : "row", justifyContent : "flex-end",marginRight : 10, marginTop : 10}}>
        <ActivityIndicator size="small" color={COLORS.red}/>
        <Text style={{color : COLORS.red}}>Opération en cours...</Text>
    </View>
}

export default OperationLoading;