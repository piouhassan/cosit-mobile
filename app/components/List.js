import React from 'react';
import {View, StyleSheet, TouchableOpacity} from "react-native";

const List = ({style,children,on_press})  =>{

    return (
        <TouchableOpacity onPress={on_press} style={{ ...styles.card, ...style }}>{children}</TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,

        backgroundColor: 'white',
        padding: 25,
        borderWidth : 1,
        borderColor : "#ccc",
        marginBottom : 5,
    }
});

export default List;