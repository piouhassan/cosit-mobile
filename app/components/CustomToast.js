import React, { useState, useEffect } from "react";
import { View, StyleSheet, ToastAndroid, Button, StatusBar } from "react-native";

const CustomToast = ({ visible, message }) => {
    if (visible) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
        );
        return null;
    }
    return null;
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#888888",
        padding: 8
    }
});

export default CustomToast;