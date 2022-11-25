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
import OptionsMenu from "react-native-option-menu";



const  Closed =  ({navigation})  => {

    const [closed,setClosed] = useState([])
    const [loading,setLoading] = useState(true)
    const [disconnected,setDisconnected] = useState(false)

    useEffect(()=>{
        getClosed()
    },[])

    const getClosed =  async () =>{

     const token =  await AsyncStorage.getItem("token");

        if (token != null){
            try{
                axios.get(Server_link+'closed',attachTokenToHeaders(token))
                    .then((response)=>{
                        setClosed(response.data.projects)
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
            <View
                style={{
                    flex : 1,
                    flexDirection : 'row',
                    marginHorizontal : 5,
                    paddingHorizontal : 5,
                    paddingVertical : SIZES.padding,
                    backgroundColor : COLORS.lightGray1,
                    borderRadius : SIZES.smallRadius,
                    marginBottom : SIZES.radius,
                    ...styles.shadow

                }}
            >
                <Feather name="grid" size={50}  color={item.statut == 2 ? COLORS.secondary : COLORS.red} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : 10
                }}>

                    <View >
                        <Text style={{fontFamily : "Poppins-Bold"}}>{item.nom}</Text>
                        <Text style={styles.badge}>{String(item.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')+ " Frcs"}</Text>

                    </View>

                    <View  style={{marginTop : 30,flexDirection : 'row'}}>
                        <Text style={{fontWeight : "bold"}}>Client  : </Text>
                        <Text>{item.fullname}</Text>
                    </View>


                </View>

            </View>
        )
    }



    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <HeaderBar navigation={navigation} title="Projets cloturés" />



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
                                        closed.length > 0 ?
                                            <ScrollView>
                                                <FlatList
                                                    contentContainerStyle = {{marginTop : SIZES.base}}
                                                    data={closed}
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


export default Closed;