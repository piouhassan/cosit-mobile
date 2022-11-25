import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {COLORS, FONTS, SIZES} from "../../constants";
import Feather from "react-native-vector-icons/Feather";
import {ErrorHandler, formatDate, Server_link, toastAlert} from "../../constants/api";
import EmptyList from "../../components/EmptyList";
import axios from "axios";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import CustomToast from "../../components/CustomToast";

const  MyHistoric = ({token}) => {
    const [loading,setLoading] = useState(true)
    const [historicList,setHistoricList] = useState([])

    useEffect(()=>{
       loadFromServer()
    },[])


    const loadFromServer = () =>{
        if (token != null){
            try{
                axios.get(Server_link+'profil/historic',attachTokenToHeaders(token))
                    .then((response)=>{
                        setHistoricList(response.data.historique)
                        setLoading(false)
                    })
                    .catch(function(error) {
                        setLoading(false)
                        toastAlert(ErrorHandler(error.message))
                    });
            }
            catch (e) {
                setLoading(false)
                toastAlert(ErrorHandler(e.message))
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

                    <Text style={{flexShrink : 1,fontFamily : "Poppins-Regular",fontSize : 12,marginBottom : 10}}>
                        {item.action}
                    </Text>

                    <View style={{flexDirection : "row",flex : 1,justifyContent : "space-between"}}>
                        <Text style={{fontSize : 10,opacity : 0.7}}>{formatDate(item.date_on)}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        )
    }

    return (
        <View>
            <SafeAreaView >

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

                            <View>
                                {
                                    historicList?.length > 0 ?
                                        <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom : 60}}>
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


                        </View>
                }

            </SafeAreaView>
        </View>
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
    }
})

export default MyHistoric;