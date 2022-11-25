import React from 'react';
import {ActivityIndicator, Dimensions, Image, StatusBar, Text, View} from "react-native";
import {Colors, COLORS, images} from "../constants";

const HEIGHT = Dimensions.get('window').height
const FullScreenLoading = () => {
    return (

        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:Colors.white}} >
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" />
            <Image source={images.logo} style={{width:200,height:75}}  />
            <View style={{justifyContent : "center",alignItems : "center",marginTop : HEIGHT * 0.4}}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
                <Text style={{fontSize : 15, fontFamily : "Poppins-Medium",marginTop : 20}}>Chargement...</Text>
            </View>
        </View>
    );
}

export default FullScreenLoading;