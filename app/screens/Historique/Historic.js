import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator, Dimensions,
    FlatList, ScrollView,
    StatusBar, StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native'
import {COLORS, FONTS, SIZES} from "../../constants";
import HeaderBar from "../../components/HeaderBar";
import axios from "axios";
import {ErrorHandler, formatDate, getStoreToken, Server_link} from "../../constants/api";
import  {attachTokenToHeaders} from "../../store/actions/LoginAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import EmptyList from "../../components/EmptyList";
import Disconnected from "../../components/Disconnected";
import CustomToast from "../../components/CustomToast";



const  Historic =  ({navigation})  => {

    const [historicList,setHistoricList] = useState([])
    const [loading,setLoading] = useState(true)
    const [disconnected,setDisconnected] = useState(false)

    useEffect(()=>{
        getHistoric()
    },[])

    const getHistoric =  async () =>{

     const token =  await AsyncStorage.getItem("token");

        if (token != null){
            try{
                axios.get(Server_link+'historic',attachTokenToHeaders(token))
                    .then((response)=>{
                        setHistoricList(response.data.historics)
                        setLoading(false)
                        setDisconnected(false)
                    })
                    .catch(function(error) {
                        setLoading(false)
                        setDisconnected(true)
                        return <CustomToast visible={true} message={ErrorHandler(error.message)} />

                    });
            }
            catch (e) {
                setLoading(false)
                setDisconnected(true)
                return <CustomToast visible={true} message={ErrorHandler(e.message)} />
            }
        }
    }


    const renderIdem = ({item}) => {

        return(
            <TouchableOpacity
                style={{
                    flex : 1,
                    flexDirection : 'row',
                    paddingVertical : SIZES.radius,
                }}
            >

               <View
                   style={{
                       width : 40,
                       height : 40,
                       marginTop : SIZES.padding,
                       marginRight : SIZES.padding,
                       backgroundColor : COLORS.white,
                       borderRadius : SIZES.radius,
                       justifyContent : "center",
                       alignItems : "center",
                       ...styles.shadow
                   }}
               >
                   {item.type == "info" &&  <Feather name="flag" size={22}  color={COLORS.blue} />}
                   {item.type == "success" &&  <Feather name="flag" size={22}  color={COLORS.green} />}
                   {item.type == "danger" &&  <Feather name="flag" size={22}  color={COLORS.red} />}
               </View>


                <View  style={{
                    width: 0,
                    flexGrow: 1,
                    flex: 1,

                }}>

                        <Text style={FONTS.body4}>{item.lastname} {item.firstname}</Text>
                        <Text style={{flexShrink : 1,fontFamily : "Poppins-Regular",fontSize : 12,marginBottom : 10}}>
                            {item.action}
                        </Text>

                    <View style={{flexDirection : "row",flex : 1,justifyContent : "space-between"}}>
                        <Text style={{fontSize : 10,opacity : 0.7}}>{formatDate(item.date_on)}</Text>
                        <Text style={{fontSize : 10,opacity : 0.7, justifyContent : "flex-end"}}>Role : {item.name}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        )
    }



    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <HeaderBar navigation={navigation} title="Historique" />



            {
                loading ?
                        <View style={{marginTop : 75}}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    :

                    <View
                        style={{
                            marginTop : SIZES.font,
                            marginHorizontal : 5,
                            padding : 10,
                        }}
                    >

                        {
                            disconnected ?
                                <Disconnected />
                                :

                                <View>
                                    {
                                        historicList.length > 0 ?
                                            <ScrollView>
                                                <FlatList
                                                    contentContainerStyle = {{marginTop : SIZES.base}}
                                                    data={historicList}
                                                    renderItem = {renderIdem}
                                                    keyExtractor={item => `${item.id}`}
                                                    scrollEnabled={false}
                                                    showsHorizontalScrollIndicator = {false}
                                                    ItemSeparatorComponent={()=>{
                                                        return (
                                                            <View style={{width : "100%",height : 1, backgroundColor : COLORS.lightGray}}></View>
                                                        )
                                                    }}
                                                />
                                            </ScrollView>

                                            : <EmptyList />
                                    }
                                </View>
                        }
                    </View>
            }
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container : {
        backgroundColor : COLORS.white,
        height : "100%"
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
    }
})


export default Historic;