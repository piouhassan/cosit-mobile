import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, View, StatusBar, Image, SafeAreaView, ScrollView, ActivityIndicator} from 'react-native'
import HeaderBar from "../../components/HeaderBar";
import {COLORS, FONTS, images} from "../../constants";
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
} from 'react-native-paper'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import BottomSheet from "../../components/BottomSheet";
import UpdatePassword from "./UpdatePassword";
import UpdateInfo from "./UpdateInfo";
import MyHistoric from "./MyHistoric";

const Profil = ({navigation}) => {
    const [user,setUser] = useState(null)
    const [show,setShow] = useState(false)
    const [gloading,setGloading] = useState(false)
    const [title,setTitle] = useState("")
    const [renderContent,setRenderContent] = useState()
    const [size,setSize] = useState("medium")
    const [token,setToken] = useState("")


    useEffect(() => {
      getProfil()
    },[])

    const getProfil = async () =>{
        const ktoken = await  AsyncStorage.getItem('token')
        const userData = await  AsyncStorage.getItem('user')
        setUser(JSON.parse(userData))
        setToken(ktoken)
    }

    const reload = async (data) =>{
        setGloading(true)
        await  AsyncStorage.setItem('user',JSON.stringify(data))
       setTimeout(()=>{
           getProfil()
           setGloading(false)
       },2000)
    }


    const updateinfo = () => {
        setRenderContent(<UpdateInfo data={user} token={token} setVisible={setShow} reload={reload} />)
        setShow(true)
        setSize("large")
        setTitle("Modifier mes informations")
    }
    const updatepassword = () => {
        setRenderContent(<UpdatePassword token={token} setVisible={setShow} />)
        setShow(true)
        setSize("large")
        setTitle("Modifier mon mot de passe")
    }
    const seeMyHistoric = () => {
        setRenderContent(<MyHistoric token={token} />)
        setShow(true)
        setSize("extra-large")
        setTitle("Mon Historique")
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <HeaderBar navigation={navigation}  title="Mon Profil" />

            {
                gloading ? <ActivityIndicator color={COLORS.primary} size={45} style={{paddingTop: 75}}/>

                    :

                    <View>
                        <View style={styles.userInfoSection}>
                            <View style={{flexDirection : "row", marginTop : 15}}>
                                <Avatar.Image
                                    source={images.blank_user}
                                    size={60}
                                />
                                <View style={{marginLeft : 20}}>
                                    <Title style={[
                                        styles.title,
                                        {marginTop: 7, marginBottom: 5}
                                    ]}>{user?.lastname} {user?.firstname}</Title>
                                    <Caption style={styles.caption}>{user?.role_name}</Caption>
                                </View>
                            </View>

                        </View>

                        <View style={styles.infoBoxWrapper}>
                            <View  style={[styles.infoBox,{borderRightColor : "#ddd",borderRightWidth : 1}]}>
                                <Feather name="phone" size={20} color={COLORS.primary} />
                                <Text style={{color : "#777",marginLeft : 20,marginTop : 10,...FONTS.body5}}>{user?.telephone}</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <Feather name="mail" size={20} color={COLORS.primary} />
                                <Text style={{color : "#777",marginLeft : 20,marginTop : 10,...FONTS.body5}}>{user?.email}</Text>
                            </View>
                        </View>

                        <View style={styles.menuWrapper}>
                            <TouchableRipple  onPress={() => updateinfo()}>
                                <View style={styles.menuItem}>
                                    <Feather name="user"  size={20} color={COLORS.primary}/>
                                    <Text style={[
                                        styles.menuItemText,
                                        FONTS.body3
                                    ]}>Modifier mes informations</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple  onPress={()=> updatepassword()}>
                                <View style={styles.menuItem}>
                                    <Feather name="lock"  size={20} color={COLORS.primary}/>
                                    <Text style={[
                                        styles.menuItemText,
                                        FONTS.body3
                                    ]}>Modifier mot de passe</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple  onPress={()=>seeMyHistoric()}>
                                <View style={styles.menuItem}>
                                    <Feather name="list"  size={20} color={COLORS.primary}/>
                                    <Text style={[
                                        styles.menuItemText,
                                        FONTS.body3
                                    ]}>Historique de mes actions</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
            }

            <BottomSheet
                title={title}
                onTouchOutside={()=>setShow(false)}
                 setShow={setShow}
                 show={show}
                size={size}
                renderContent={renderContent}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : COLORS.white
    },
    userInfoSection : {
     paddingHorizontal: 30,
     marginBottom : 25
    },

    title : {
       fontSize : 24,
       fontWeight : 'bold'
    },
    caption : {
     fontSize : 14,
     lineHeight : 14,
     fontWeight : '500',
        color : COLORS.primary
    },
    row : {
      flexDirection : "row",
        marginBottom : 10
    }
    ,
    infoBoxWrapper : {
        borderBottomColor : '#ddd',
        borderBottomWidth : 1,
        borderTopWidth : 1,
        borderTopColor : '#ddd',
        flexDirection : 'row',
        height : 100,
        marginTop : 10
    },
    infoBox : {
        width : "50%",
        alignItems : 'center',
        justifyContent : "center"
    },
    menuWrapper : {
        marginTop : 10
    },
    menuItem : {
        flexDirection: 'row',
        paddingVertical : 15,
        paddingHorizontal : 10,
        borderBottomColor : "#ddd",
        borderBottomWidth : 1
    },

    menuItemText : {
        color : "#777",
        marginLeft : 15,
        fontWeight : '600',
        fontSize : 16,
        lineHeight : 26,
    }
})




export default Profil

