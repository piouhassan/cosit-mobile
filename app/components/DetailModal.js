import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View, Modal, Text} from "react-native";
import {COLORS, FONTS, SIZES} from "../constants";


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const DetailModal = ({visible,title,children,setShowModal,size}) =>  {


    return (
       <Modal
        transparent={true}
        visible={visible}
        nRequestClose={!visible}
       >
           <TouchableOpacity
               disabled={true}
               style={styles.container}
           >
               <View style={[styles.modal,{height : "50%"}]}>
                  <View  style={styles.textview}>
                      <Text style={[FONTS.h3,styles.title]}>{title}</Text>

                      {children}
                  </View>


                       <View style={styles.buttonview}>
                           <TouchableOpacity
                               style={styles.btn}
                               onPress={()=> setShowModal(false)}
                           >
                               <Text style={[styles.message,{color : COLORS.blue}]}>
                                   Fermer
                               </Text>
                           </TouchableOpacity>
                       </View>

               </View>
           </TouchableOpacity>
       </Modal>
    );
}

const styles = StyleSheet.create({
    container : {
       flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modal : {
        width : WIDTH  - 80,
        paddingTop : 10,
        backgroundColor : COLORS.white,
        borderRadius : SIZES.radius
    },

    textview : {
       flex: 1,
        padding : 20
    },
    title : {
        margin : 5,
        alignSelf : "center",
        borderBottomColor : COLORS.black,
        borderBottomWidth : 1,
        marginBottom : 30
    },
    message : {
        margin : 5,
        fontsize : 16,
        fontWeight : 'bold'
    },

    buttonview : {
      width : "100%",
      flexDirection : 'row',
        borderTopWidth : 1,
        borderTopColor : COLORS.lightGray
    },
    btn : {
     flex : 1,
     paddingVertical : 10,
        alignItems : 'center'
    },
    right : {
        borderLeftWidth : 1,
        borderLeftColor : COLORS.lightGray
    }

})

export default DetailModal;