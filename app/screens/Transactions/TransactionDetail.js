import React, {useState} from 'react';
import {
    ActivityIndicator,
    Dimensions, Platform,
    SafeAreaView, ScrollView,
    StatusBar, StyleSheet, Text, TouchableOpacity,
    View,
} from 'react-native'

import {COLORS, FONTS, SIZES} from "../../constants";
import HeaderBar from "../../components/HeaderBar";
import {useRoute} from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import {formatDate, Server_Img} from "../../constants/api";
import RNFetchBlob from "rn-fetch-blob";
import FileViewer from "react-native-file-viewer";
const  HEIGHT = Dimensions.get("window").height

const  TransactionDetail =  ({navigation})  => {

    const route = useRoute()
    const [loading,setLoading] =  useState(false)



 const  showFile = (fileUrl) => {
        setLoading(true)
        const ext = fileUrl.split(/[#?]/)[0].split('.').pop().trim()
        return new Promise((resolve, reject) => {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: ext
            })
                .fetch('GET', fileUrl)
                .then(res => {
                    setLoading(false)
                    console.log('The file saved to ', res.path())
                    const downloadFile =
                        Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path()
                    setTimeout(() => {
                        FileViewer.open(downloadFile, { showOpenWithDialog: true, onDismiss: () => RNFetchBlob.fs.unlink(res.path()) })
                    }, 350)
                    resolve(true)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    return (
        <SafeAreaView
          style={{
              flex : 1,
              backgroundColor : COLORS.white
          }}
        >
           <ScrollView>
               <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
               <HeaderBar navigation={navigation}  title={route.params.transaction?.motif ? "Dépense" : "Recette"} right={false} />
               {! route.params.transaction?.motif ?
                   <View>

                       <View style={{marginTop : 40,height : HEIGHT * 0.5,backgroundColor : COLORS.white,marginHorizontal : 5, borderRadius : 7,paddingTop : 10, paddingBottom : 10,...styles.shadow}}>

                           <View style={{flexDirection : "row",justifyContent : "space-between"}}>
                               <View style={{
                                   padding: 10,
                                   backgroundColor : route.params.transaction?.statut == 1 && COLORS.primary || route.params.transaction?.statut == 2 && COLORS.green,
                                   paddingRight : 30,
                                   borderTopRightRadius : 150,
                                   borderBottomRightRadius : 150,
                                   borderTopLeftRadius : 7,
                                   borderBottomLeftRadius : 7,
                               }}>
                                   <Text style={{color :  COLORS.white,fontFamily : "Poppins-Light"}}>{route.params.transaction?.statut == 2 ? "Payer" : "Impayé"}</Text>
                               </View>
                           </View>

                           <View  style={{justifyContent : "center",alignItems : "center",marginTop : HEIGHT *0.08}}>
                               <Text style={{fontSize : 45,color : COLORS.primary,fontWeight : "bold"}}>{String(route.params.transaction?.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')+ " Frcs"}</Text>
                           </View>
                           <View style={{width : "100%",height : 1, backgroundColor : COLORS.lightGray,marginTop : 20, marginBottom : 10}}></View>
                           <View style={{paddingHorizontal : 10}}>
                               <View style={{flexDirection : "row",marginTop : 10}}>
                                   <Text style={FONTS.h4}>Client  : </Text>
                                   <Text >{route.params.transaction?.fullname}</Text>
                               </View>

                               <View style={{flexDirection : "row",marginTop : 10}}>
                                   <Text style={FONTS.h4}>Projet : </Text>
                                   <Text >{route.params.transaction?.nom}</Text>
                               </View>

                               <View style={{flexDirection : "row",marginTop : 10}}>
                                   <Text style={FONTS.h4}>Utilisateur : </Text>
                                   <Text >{route.params.transaction?.firstname} {route.params.transaction?.lastname}</Text>
                               </View>

                               <View style={{flexDirection : "row",marginTop : 10}}>
                                   <Text style={FONTS.h4}>Créer le : </Text>
                                   <Text >{formatDate(route.params.transaction?.created_at)}</Text>
                               </View>

                           </View>

                       </View>

                       <View style={{justifyContent : "center", alignSelf : 'center',marginTop : 50,padding : 10,borderWidth : 1, borderColor : COLORS.gray,borderRadius : 6}}>
                          <TouchableOpacity  onPress={() => showFile(Server_Img+route.params.transaction?.invoice)  }>
                              {
                                  loading ?

                                  <View style={{justifyContent : "center",alignItems : "center"}}>
                                      <ActivityIndicator size="small" color={COLORS.gray}/>
                                  </View>
                                      :
                                      <Feather name="download" size={30} />
                              }

                          </TouchableOpacity>
                       </View>



                   </View>
                   :
                   <View >
                       <View style={{paddingHorizontal : 10,flexDirection : "row", justifyContent : "space-between"}}>
                           <Text style={{color : COLORS.black,fontFamily : "Poppins-Black",fontSize : 30}}>{String(route.params.transaction?.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')+ " Frcs"}</Text>
                       </View>
                       <View style={{marginLeft : 10,marginRight : 10,marginTop : 20, backgroundColor : "#E9E9E9", borderRadius : 7, height : 100, flexDirection : "row",justifyContent : "center", alignItems : "center"}}>

                           <View style={{backgroundColor : COLORS.white,width:  50, height: 50, borderRadius : 50,justifyContent :  "center", alignItems : "center"}}>
                               <Feather color={COLORS.black} size={20} name="info"  />
                           </View>

                           <Text  style={{color : COLORS.black, marginLeft : 10, width: "78%", marginRight : 10}}>
                               {route.params.transaction?.designation}
                           </Text>
                       </View>
                       <View style={{backgroundColor : "#E9E9E9", width: "100%", height: 7, marginTop : "10%"}}></View>
                       <View style={{
                           padding: 10,
                           backgroundColor : route.params.transaction?.statut == 1 && COLORS.blue  || route.params.transaction?.statut == 2 && COLORS.secondary  || route.params.transaction?.statut == 3 && COLORS.primary|| route.params.transaction?.statut == 4 && COLORS.green,
                           paddingRight : 30,
                           borderTopRightRadius : 150,
                           borderBottomRightRadius : 150,
                           borderTopLeftRadius : 7,
                           borderBottomLeftRadius : 7,
                           width: "35%",
                           marginTop : 30
                       }}>
                           {route.params.transaction?.statut  ==  1 &&  <Text style={{color :  COLORS.white,fontFamily : "Poppins-Light"}}>En attente de validation</Text>}
                           {route.params.transaction?.statut  ==  2 &&  <Text style={{color :  COLORS.white,fontFamily : "Poppins-Light"}}>Vérifié et validé</Text>}
                           {route.params.transaction?.statut == 3 &&  <Text style={{color :  COLORS.white,fontFamily : "Poppins-Light"}}>Rejetté</Text>}
                           {route.params.transaction?.statut == 4 &&  <Text style={{color :  COLORS.white,fontFamily : "Poppins-Light"}}>Dépense effectué</Text>}
                       </View>

                       {route.params.transaction?.rejet_motif != null &&
                           <View style={{marginLeft: 10, marginRight: 10, marginTop: 30}}>
                               <Text style={{fontFamily: "Poppins-Black", fontSize: 25, color: COLORS.black}}>Motif du
                                   rejet</Text>
                               <Text style={{color: COLORS.black}}>
                                   {route.params.transaction?.rejet_motif}
                               </Text>
                           </View>
                       }


                       <View style={{backgroundColor : "#E9E9E9", width: "100%", height: 7, marginTop : "10%"}}></View>

                       <View style={{marginTop : 20,flexDirection : "row",marginLeft : 10}}>
                           <Text style={{color : COLORS.black,fontFamily : "Poppins-Black",fontSize : 15}}>Utilisateur : </Text>
                           <Text style={{color : COLORS.black,paddingTop : 2,paddingLeft : 10}}>{route.params.transaction?.firstname} {route.params.transaction?.lastname}</Text>
                       </View>

                       <View style={{marginTop : 10,flexDirection : "row",marginLeft : 10}}>
                           <Text style={{color : COLORS.black,fontFamily : "Poppins-Black",fontSize : 15}}>Crée le : </Text>
                           <Text style={{color : COLORS.black,paddingTop : 2,paddingLeft : 10}}>{formatDate(route.params.transaction?.created_at)}</Text>
                       </View>

                       <View style={{backgroundColor : "#E9E9E9", width: "100%", height: 7, marginTop : "10%"}}></View>

                       <View style={{justifyContent : "center",alignItems : "center",marginTop : 30}}>
                           <Text style={{...FONTS.h2}}>Commentaire</Text>
                       </View>

                       {route.params.transaction?.commentaire &&
                       <View style={{justifyContent : "center",alignItems : "center",marginTop : 30,marginLeft : 20,marginRight : 20,marginBottom : 100}}>
                           <Text>
                               {route.params.transaction?.commentaire}
                           </Text>
                       </View>

                           }



                       {
                           loading &&

                           <View style={{justifyContent : "center",alignItems : "center"}}>
                               <ActivityIndicator size="large" color={COLORS.primary}/>
                           </View>
                       }

                   </View>
               }
           </ScrollView>
        </SafeAreaView>
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

        elevation: 1,
    }
})

export default TransactionDetail;