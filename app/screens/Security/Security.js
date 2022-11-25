import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS, FONTS, SIZES} from "../../constants";
import HeaderBar from "../../components/HeaderBar";
import Feather from "react-native-vector-icons/Feather";
import {hasUserSetPinCode} from "@haskkor/react-native-pincode";

const  Security = ({navigation}) => {

    const [hasCodePin,setHasCodePin] = useState(false)

    useEffect( ()=>{
        checkIfHasCode()
    },[])

    const checkIfHasCode = async () => {
        const hasPin = await hasUserSetPinCode();
        if (hasPin) setHasCodePin(true)
    }

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <HeaderBar navigation={navigation} title="Sécurité" />



            <View style={styles.container}>
                <View style={styles.box}>
                    <TouchableOpacity style={styles.btn} onPress={()=> {navigation.navigate('LockView',{
                        status : "choose",
                         security : true
                    })}} >
                        <Feather name="lock" size={20} />
                        <Text style={styles.txt}> {!hasCodePin ? "Ajouter" : "Modifier"} Code Pin</Text>
                    </TouchableOpacity>
                </View>


                {
                    hasCodePin &&
                    <View style={styles.box}>
                        <TouchableOpacity style={styles.btn} onPress={()=> {navigation.navigate('LockView',{
                            status : "enter",
                            security : true
                        })}} >
                            <Feather name="unlock" size={20} />
                            <Text style={styles.txt}>Retirer le Code Pin</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom : 70
    },
    shadow: {
        shadowColor: "rgba(0,0,0,0.92)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 2,
    },

    box :{
        padding : 20,
        borderBottomWidth : 1,
        borderBottomColor : COLORS.lightGray
    },
    btn : {
        flexDirection : "row",
    },

    txt : {
    paddingLeft : 20,
        paddingTop : 2,
        fontFamily : "Poppins-Medium"
}
})
export default Security;