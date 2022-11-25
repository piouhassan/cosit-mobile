import React, {useCallback, useEffect, useState} from 'react';
import {
    ScrollView,
    StatusBar, StyleSheet,
    Text, TouchableOpacity,
    View,
    FlatList, ImageBackground,
    LogBox, Alert, BackHandler, Dimensions, SafeAreaView, RefreshControl
} from 'react-native'
import {COLORS, FONTS, images, SIZES} from "../../constants";
import Feather from "react-native-vector-icons/Feather";
import TransactionHistory from "../../components/TransactionHistory";
import { Avatar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {Server_link, toastAlert} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import {LineChart} from "react-native-chart-kit";
import EmptyList from "../../components/EmptyList";
import Loading from "../../components/Loading";


const  Dashboard =  ({navigation})  => {

    const [loading,setLoading] = useState(true)
    const [user,setUser] = useState(null)
    const [token,setToken] = useState(null)
    const [trending,setTrending] = useState(null)
    const [projets,setProjets] = useState(null)
    const [incomingData,setIncomingData] = useState([])
    const [outcomingData,setOutcomingData] = useState([])
    const [historyData,setHistoryData] = useState([])

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
        getDashboard()
    },[])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getDashboard()
            setRefreshing(false)
        },2000)
    }, []);

    const backAction = () => {
        if (navigation.isFocused()){
            Alert.alert("Cosit-Dépense", "Fermer l'application ?", [
                {
                    text: "Annuler",
                    onPress: () => null,
                    style: "annulé"
                },
                { text: "Fermer", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        }
    };


    // const label = ["Jan","Fev","Mar","Avr","Mai","Jun","Jui","Aou","Sept","Oct","Nov","Dec"];


    const getDashboard = async () =>{
        const ktoken = await  AsyncStorage.getItem('token')
        const userData = await  AsyncStorage.getItem('user')
        setUser(JSON.parse(userData))
        setLoading(true)
        if (ktoken != null){
            try{
                axios.get(Server_link+'trending',attachTokenToHeaders(ktoken))
                    .then((response)=>{
                        // setTrending(response.data.trending)
                        // setIncomingData(response.data.incomingGraph)
                        setProjets(response.data.projets)
                        setHistoryData(response.data.transactions)
                        setToken(ktoken)
                        setLoading(false)
                        console.log(response.data.projets)
                    })
                    .catch(function(error) {
                        setLoading(false)
                        toastAlert(error.message)
                    });
            }
            catch (e) {
                setLoading(false)
                 toastAlert("Impossible de se connecter au serveur")
            }
        }

    }



    const renderItem = ({item}) => {
        return(
            <View
                style={{
                    flex : 1,
                    flexDirection : 'row',
                    marginHorizontal : 5,
                    paddingHorizontal : 5,
                    paddingVertical : SIZES.radius,
                    borderRadius : SIZES.smallRadius,
                    marginBottom : SIZES.radius,

                }}
            >
                <Feather name="grid" size={25}  color={item.statut == 1 ? COLORS.primary : COLORS.red} />

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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View style={{
                        width : "100%",
                        height : 170,
                        ...styles.shadow
                    }}
                >
                    <ImageBackground
                        source={images.banner}
                        resizeMode="cover"
                        style={{
                            flex : 1,
                        }}
                    >

                        <View style={{flex: 2,flexDirection : "row",justifyContent: "space-between",marginTop : SIZES.padding, paddingHorizontal : SIZES.base}}>
                            <Text style={{
                                color : COLORS.white,
                                justifySelf : "flex-end",
                                fontFamily : "Poppins-Black",
                                fontsize : 30
                            }}>Cosit-Depense</Text>

                            <TouchableOpacity
                                style={{
                                    width: 35,
                                    height: 35,
                                    alignItems : 'center',
                                    justifyContent : 'center',
                                }}
                                onPress={()=> navigation.navigate('Settings')}
                            >
                                <Avatar.Text size={40} label={
                                    user != null && `${user?.firstname?.substring(0,1).toUpperCase()} ${user?.lastname?.substring(0,1).toUpperCase()}`
                                } style={{
                                    backgroundColor : COLORS.white,
                                    marginRight : 10,
                                    shadowColor: "rgba(0,0,0,0.92)",
                                    shadowOffset: {
                                        width: 0,
                                        height: 4,
                                    },
                                    shadowOpacity: 0.80,
                                    shadowRadius: 4.65,

                                    elevation: 8,
                                }}   />
                            </TouchableOpacity>
                        </View>

                    </ImageBackground>
                </View>
                <View style={{marginTop : SIZES.padding - 100}}>
                    <View
                        style={{
                            marginTop : SIZES.font,
                            marginHorizontal : 5,
                            padding : 14,
                            borderRadius : SIZES.smallRadius,
                            backgroundColor : COLORS.white,
                        }}
                    >
                        <Text>Projets En cours</Text>

                        {
                            loading ?
                                <Loading />
                                :
                                <>
                                    {
                                        projets?.length > 0
                                            ?
                                            <FlatList
                                                contentContainerStyle = {{marginTop : SIZES.base}}
                                                data={projets}
                                                renderItem = {renderItem}
                                                keyExtractor={item => `${item.id}`}
                                                scrollEnabled={false}
                                                showsHorizontalScrollIndicator = {false}
                                                ItemSeparatorComponent={()=>{
                                                    return (
                                                        <View style={{width : "100%",height : 1, backgroundColor : COLORS.lightGray}}></View>
                                                    )
                                                }}
                                            />
                                            :
                                            <EmptyList />
                                    }
                                </>
                        }
                    </View>
                 </View>



                 <TransactionHistory customContainerStyle={styles.shadow}  loading={loading} setLoading={setLoading} history={historyData} navigation={navigation}  />

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

        elevation: 2,
    }
})


export default Dashboard;