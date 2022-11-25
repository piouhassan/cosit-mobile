import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View, Modal, Text, Image} from "react-native";
import {COLORS, FONTS, icons, SIZES} from "../constants";
import Feather from "react-native-vector-icons/Feather";
import {Title} from "react-native-paper";



const CrudModal = ({ children, title, visible = false,setVisible}) =>  {

    return (
        <Modal
            transparent={true}
            visible={visible}
            nRequestClose={!visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                     <View style={{
                         flexDirection : 'row',
                         justifyContent : "space-between"
                     }}>
                         <Title style={styles.modalText}>{title}</Title>
                         <TouchableOpacity onPress={()=>setVisible(false)}>
                             <Feather name="x" size={22}  style={{
                                 justifySelf : ""
                             }} />
                         </TouchableOpacity>
                     </View>
                    <View>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // marginHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 7,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 1,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: COLORS.primary,
        marginLeft: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 8,
    }
});
export default CrudModal;