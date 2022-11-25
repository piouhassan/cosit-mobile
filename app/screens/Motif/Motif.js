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
import AddButton from "../../components/AddButton";
import Badge from "../../components/Badge";
import axios from "axios";
import {
    deletefromServer,
    formatDate,
    permission_autorisation,
    Server_link,
    togglefromServer
} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import HeaderBar from "../../components/HeaderBar";
import Feather from "react-native-vector-icons/Feather";
import OptionsMenu from "react-native-option-menu";
import OperationLoading from "../../components/OperationLoading";
import Loading from "../../components/Loading";
import Disconnected from "../../components/Disconnected";
import EmptyList from "../../components/EmptyList";
import MotifAdd from "./MotifAdd";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetailModal from "../../components/DetailModal";

const  Motif =  ({navigation})  => {


    const [show,setShow] = useState(false)
    const [filterText,setFilterText] = useState("")
    const [motifs,setMotifs] = useState([])
    const [allmotifs,setAllmotifs] = useState([])
    const [loading,setLoading] = useState(true)
    const [opLoading,setOpLoading] = useState(false)
    const [disconnected,setDisconnected] = useState(false)
    const [token,setToken] = useState(null)
    const [detail,setDetail] = useState("")
    const [detailShow, setDetailShow] = React.useState(false);
    const [permissions,setpermissions] = useState([])

    useEffect(()=>{
        getMotifs()
    },[])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getMotifs()
            setRefreshing(false)
        },2000)
    }, []);

    const getMotifs =  async () =>{
        setpermissions(await AsyncStorage.getItem('permissions'))
        const ktoken =  await AsyncStorage.getItem("token");
        setLoading(true)
        if (ktoken != null){
            try{
                axios.get(Server_link+'motifs',attachTokenToHeaders(ktoken))
                    .then((response)=>{
                        console.log(response.data)

                        setMotifs(response.data.motifs)
                        setAllmotifs(response.data.motifs)
                        setToken(ktoken)
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
        if (value === "" && allmotifs.length > 0){
            setMotifs(allmotifs)
        }
        else if (value !== ""){
            const filter = motifs.filter((item)=> item.motif.includes(value))
            setMotifs(filter)
        }
    }

    const viewMotif = (item) => {
        setDetailShow(true)
        setDetail(item)
    }
    const editMotif = (item) => {
        setShow(true)
        setDetail(item)
    }
    const deleteMotif = (item) => {
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer  ce motif de dépense ?`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () =>
                        deletefromServer(token,"motif",item.id,setOpLoading,getMotifs)
                }
            ]
        )
    }
    const toggleMotif = (item) => {
        Alert.alert(
            item.statut == 1 ? "Desactiver " : "Réactiver ",
            `Êtes vous sûre de vouloir ${item.statut == 1 ? " desactiver  ce motif  de dépense ?" : " réactiver ce motif  de dépense ?"}` ,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: item.statut == 1 ? "Desactiver " : "Réactiver ", onPress: () =>
                        togglefromServer(token,"motif",item.id,setOpLoading,item.statut == 1 ? 2 : 1 ,getMotifs)
                }
            ]
        )
    }


    const OptionName = (item) =>{
        const array = ["detail"]
        if(permission_autorisation("Outcoming",permissions)?.action){
            if(item.statut == 1){
                array.push("Desactiver")
            } else{
                array.push("Réactiver")
            }
        }
        if (permission_autorisation("Outcoming",permissions)?.update)array.push("Modifier")
        if (permission_autorisation("Outcoming",permissions)?.delete) array.push("Supprimer")
        array.push("Annuler")

        return array
    }

    const OptionFunction = (item) =>{
        const array = [()=> viewMotif(item)]
        if(permission_autorisation("Outcoming",permissions)?.action) array.push(()=> toggleMotif(item))
        if (permission_autorisation("Outcoming",permissions)?.update)array.push(()=> editMotif(item))
        if (permission_autorisation("Outcoming",permissions)?.delete) array.push(()=>deleteMotif(item))

        return array
    }


    const renderItem = ({item}) => {
        return(
            <View
                style={{flex : 1, flexDirection : 'row', paddingVertical : SIZES.radius, padding : 10}}
            >
                <Feather name="info" size={22}  color={item.statut == 1 ? COLORS.green : COLORS.red} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : 10
                }}>
                    <Text>{item.motif.substring(0,40)}...</Text>

                    <OptionsMenu
                        customButton={(<Feather  name="more-vertical" size={22} />)}
                        buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
                        destructiveIndex={1}
                        options={OptionName(item)}
                        actions={OptionFunction(item)}
                    />

                </View>

            </View>
        )
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <HeaderBar navigation={navigation} title="Motifs" />
            <ScrollView  showsVerticalScrollIndicator={false} style={{marginBottom : 60}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View style={{flexDirection:'row', opacity : 0.7, justifyContent : "flex-end", paddingHorizontal : SIZES.base, marginTop : 10}} >
                    {
                        permission_autorisation("Outcoming", permissions)?.create &&

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
                                                motifs.length > 0 ?
                                                    <FlatList
                                                        contentContainerStyle = {{marginTop : SIZES.base}}
                                                        data={motifs}
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
                        <MotifAdd  token={token}  updateData={detail} onCreated={getMotifs} setVisible={setShow} />
                }



                <DetailModal
                    title="Detail du motif"
                    visible={detailShow}
                    setShowModal={setDetailShow}
                >
                    <View >
                        <View  style={{flexDirection : "row",marginBottom : 10,justifyContent :"center",alignItems : "center"}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Motif : </Text>
                        </View>
                        <View  style={{flexDirection : "row",marginBottom : 30}}>
                            <Text>{detail?.motif}</Text>
                        </View>

                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Statut : </Text>
                            <Text style={{backgroundColor : detail?.statut == 1 ? COLORS.secondary : COLORS.primary, color : COLORS.white,paddingHorizontal : 10, borderRadius : 50}}>{detail?.statut == 1 ? "Actif" : "Désactivé"}</Text>
                        </View>
                    </View>
                </DetailModal>

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

export default Motif;