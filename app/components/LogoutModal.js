import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View, Modal, Text} from "react-native";
import {COLORS, FONTS, SIZES} from "../constants";


const WIDTH = Dimensions.get('window').width
const HEIGHT_MODAL_SMALL = 150

const LogoutModal = ({visible,title,message,setShowModal,confirmAction}) =>  {


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
               <View style={[styles.modal,{height : HEIGHT_MODAL_SMALL}]}>
                  <View  style={styles.textview}>
                      <Text style={[FONTS.h3,styles.title]}> Déconnexion</Text>
                      <Text style={styles.message}> Êtes vous sûre de vouloir vous déconnecter ?</Text>
                  </View>


                       <View style={styles.buttonview}>
                           <TouchableOpacity
                               style={styles.btn}
                               onPress={()=> setShowModal(false)}
                           >
                               <Text style={[styles.message,{color : COLORS.blue}]}>
                                   Annuler
                               </Text>
                           </TouchableOpacity>

                           <TouchableOpacity
                               style={[styles.btn,styles.right]}
                               onPress={()=>confirmAction()}
                           >
                               <Text style={[styles.message,{color : COLORS.red}]}>
                                   Déconnecter
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
        alignItems: 'center'
    },
    title : {
      margin : 5,
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

export default LogoutModal;