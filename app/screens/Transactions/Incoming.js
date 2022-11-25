import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert, FlatList, Pressable,
    RefreshControl,
    ScrollView,
    StatusBar, StyleSheet,
    Text, TextInput,
    View
} from 'react-native'
import {COLORS, FONTS, SIZES} from "../../constants";
import axios from "axios";
import {
    deletefromServer,
    formatSimpleDate,
    permission_autorisation,
    Server_link,
    togglefromServer
} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import AddButton from "../../components/AddButton";
import Badge from "../../components/Badge";
import Feather from "react-native-vector-icons/Feather";
import OperationLoading from "../../components/OperationLoading";
import Loading from "../../components/Loading";
import Disconnected from "../../components/Disconnected";
import EmptyList from "../../components/EmptyList";
import IncomingAdd from "./IncomingAdd";
import OptionsMenu from "react-native-option-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";


const  Incoming =  ({navigation})  => {


    const [show,setShow] = useState(false)
    const [filterText,setFilterText] = useState("")
    const [projets,setProjets] = useState([])
    const [incoming,setIncoming] = useState([])
    const [allincoming,setAllincoming] = useState([])
    const [loading,setLoading] = useState(true)
    const [opLoading,setOpLoading] = useState(false)
    const [disconnected,setDisconnected] = useState(false)
    const [detailShow,setDetailShow] = useState(false)
    const [detail,setDetail] = useState("")
    const [token,setToken] = useState(null)
    const [permissions,setpermissions] = useState([])

    useEffect(()=>{
        getIncoming()
    },[])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getIncoming()
            setRefreshing(false)
        },2000)
    }, []);

    const getIncoming =  async () =>{
        setpermissions(await AsyncStorage.getItem('permissions'))

        const ktoken =  await AsyncStorage.getItem("token");
        setLoading(true)
        if (ktoken != null){
            try{
                axios.get(Server_link+'incoming',attachTokenToHeaders(ktoken))
                    .then((response)=>{
                        setIncoming(response.data.incoming)
                        setAllincoming(response.data.incoming)
                        setToken(ktoken)
                        setProjets(response.data.projets)
                        setLoading(false)
                        setDisconnected(false)
                    })
                    .catch(function(error) {
                        setLoading(false)
                        setDisconnected(true)
                        console.log('There has been a problem with your fetch operation: ' + error.message);
                    });
            }
            catch (e) {
                setLoading(false)
                setDisconnected(true)
                console.log('There has been a problem with your fetch operation: ' + e.message);
            }
        }
    }
    const SearchContent = (value) =>{
        setFilterText(value)
        if (value === "" && allincoming.length > 0){
            setIncoming(allincoming)
        }
        else if (value !== ""){
            const filter = incoming.filter((item)=> item.amount.includes(value))
            setIncoming(filter)
        }
    }
    const viewIncoming = (item) => {
        navigation.navigate('TransactionDetail',{"transaction" : item})
    }
    const editIncoming = (item) => {
        setShow(true)
        setDetail(item)
    }
    const deleteIncoming = (item) => {
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer cette recette`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () =>
                        deletefromServer(token,"incoming",item.id,setOpLoading,getIncoming)
                }
            ]
        )
    }


    const OptionName = (item) =>{
        const array = ["detail"]
        if (item.statut == 1){
            if(permission_autorisation("Incoming",permissions)?.action) array.push("Valider")
            if (permission_autorisation("Incoming",permissions)?.update)array.push("Modifier")
            if (permission_autorisation("Incoming",permissions)?.delete) array.push("Supprimer")
        }
        array.push("Annuler")

        return array
    }

    const OptionFunction = (item) =>{
        const array = [()=> viewIncoming(item)]
        if (item.statut == 1) {
            if (permission_autorisation("Incoming", permissions)?.action) array.push(() => toggleIncoming(item))
            if (permission_autorisation("Incoming", permissions)?.update) array.push(() => editIncoming(item))
            if (permission_autorisation("Incoming", permissions)?.delete) array.push(() => deleteIncoming(item))
        }
        return array
    }

    const toggleIncoming = (item) => {
        Alert.alert(
             "Validation paiement ",
            `Êtes vous sûre de vouloir valider le paiement de cette recette` ,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Valider", onPress: () =>
                        togglefromServer(token,"incoming",item.id,setOpLoading, 2 ,getIncoming)
                }
            ]
        )
    }



    const renderItem = ({item}) => {
        return(
            <View
                style={{flex : 1, flexDirection : 'row', paddingVertical : SIZES.radius, padding : 10}}
            >
                <Feather name="chevrons-up" size={22}  color={item.statut == 1 ? COLORS.blue : COLORS.secondary} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : 10,
                    paddingVertical : 7
                }}>
                    <Text>{item.nom.toUpperCase()}</Text>
                    <Text style={{fontWeight : "bold"}}>{String(item.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')} Frcs</Text>
                    <Text>{formatSimpleDate(item.created_at)}</Text>

                    <OptionsMenu
                        customButton={(<Feather  name="more-vertical" size={22} />)}
                        buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
                        destructiveIndex={1}
                        options={OptionName(item)}
                        actions={OptionFunction(item)}/>

                </View>

            </View>
        )
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <ScrollView  showsVerticalScrollIndicator={false} style={{marginBottom : 60}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View style={{flexDirection:'row', opacity : 0.7, justifyContent : "space-between", paddingHorizontal : SIZES.base, marginTop : 30}} >
                    <Text style={{color:COLORS.black,...FONTS.h1}} >Recette</Text>
                    {
                        permission_autorisation("Incoming", permissions)?.create &&

                        <View>
                            {!show ?
                                <AddButton on_press={() => {
                                    setShow(true)
                                    setDetail(null)
                                }
                                }/>
                                :
                                <Pressable onPress={() => setShow(false)}>
                                    <Feather name="x" size={30} style={{opacity: 0.6, fontWeight: "100"}}/>
                                </Pressable>
                            }
                        </View>
                    }
                </View>

                {
                    !show  &&

                    <>

                        {/*    Search */}
                        <View style={{width: "100%", paddingHorizontal : 10, marginTop : 15, padding : 10, paddingTop : 20,}}>
                            <TextInput style={[styles.inputsearch]} placeholder="Rechercher..." onChangeText={value => SearchContent(value)} value={filterText} />
                        </View>

                        {/*    Badge Show */}
                        {filterText  !== "" && <View style={{paddingHorizontal : 10, flexDirection : "row"}}>
                            <Badge text={filterText} />
                        </View>}
                    </>
                }

                <OperationLoading visible={opLoading} />

                {
                    !show ?
                        <>
                            {loading ? <Loading  /> :
                                <View style={{marginTop : 10, padding : 5,}}>
                                    {disconnected ?
                                        <Disconnected /> :
                                        <View style={{marginTop : SIZES.font, borderRadius : SIZES.smallRadius}}>
                                            {
                                                incoming.length > 0 ?
                                                    <FlatList
                                                        contentContainerStyle = {{marginTop : SIZES.base}}
                                                        data={incoming}
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

                                                    : <EmptyList />
                                            }
                                        </View>
                                    }
                                </View>}
                        </>
                        :
                        <IncomingAdd  token={token}  updateData={detail} projets={projets} onCreated={getIncoming} setVisible={setShow} />
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
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 2,
    },

    input:{
        position:'relative',
        height:'100%',
        width:'85%',
        fontFamily:'Poppins-Medium',
        paddingLeft:30,
    },

    errors : {
        color : COLORS.primary,
        textAlign : 'center'
    },

    inputsearch : {
        borderWidth : 1,
        borderColor : COLORS.lightGray,
        borderRadius : 5,
        paddingLeft: 10,
        fontFamily: "Poppins-Regular"
    },


})

export default Incoming;