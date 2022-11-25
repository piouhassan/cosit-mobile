import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert, FlatList,
    Pressable,
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
import {deletefromServer, permission_autorisation, Server_link, togglefromServer} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import Feather from "react-native-vector-icons/Feather";
import OperationLoading from "../../components/OperationLoading";
import Loading from "../../components/Loading";
import Disconnected from "../../components/Disconnected";
import EmptyList from "../../components/EmptyList";
import DetailModal from "../../components/DetailModal";
import UserAdd from "./UserAdd";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OptionsMenu from "react-native-option-menu";

const  Users =  ()  => {

    const [show,setShow] = useState(false)
    const [filterText,setFilterText] = useState("")
    const [users,setUsers] = useState([])
    const [allusers,setAllusers] = useState([])
    const [loading,setLoading] = useState(true)
    const [disconnected,setDisconnected] = useState(false)
    const [detail,setDetail] = useState("")
    const [opLoading,setOpLoading] = useState(false)
    const [token,setToken] = useState(null)
    const [detailShow, setDetailShow] = React.useState(false);
    const [roles, setRoles] = React.useState(null);
    const [permissions,setpermissions] = useState([])


    useEffect(()=>{
        getUsers()
    },[])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getUsers()
            setRefreshing(false)
        },2000)
    }, []);

    const getUsers =  async () =>{
        setpermissions(await AsyncStorage.getItem('permissions'))
        const ktoken =  await AsyncStorage.getItem("token");
        setLoading(true)
        if (ktoken != null){
            try{
                axios.get(Server_link+'users',attachTokenToHeaders(ktoken))
                    .then((response)=>{
                        setUsers(response.data.users)
                        setAllusers(response.data.users)
                        setRoles(response.data.roles)
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
        if (value === "" && allusers.length > 0){
            setUsers(allusers)
        }
        else if (value !== ""){
            const filter = users.filter((item)=> item.firstname.includes(value))
            setUsers(filter)
        }
    }

    const viewUsers = (item) => {
        setDetailShow(true)
        setDetail(item)
    }
    const editUsers = (item) => {
        setShow(true)
        setDetail(item)
    }
    const deleteUsers = (item) => {
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer ${item.firstname} ${item.lastname}`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () =>
                        deletefromServer(token,"user",item.id,setOpLoading,getUsers)
                }
            ]
        )
    }
    const toggleUsers = (item) => {
        Alert.alert(
            item.statut == 1 ? "Desactiver " : "Réactiver ",
            `Êtes vous sûre de vouloir ${item.statut == 1 ? " desactiver "+item.firstname+" "+item.lastname : " réactiver "+item.firstname+" "+item.lastname}` ,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: item.statut == 1 ? "Desactiver " : "Réactiver ", onPress: () =>
                        togglefromServer(token,"user",item.id,setOpLoading,item.statut == 1 ? 2 : 1 ,getUsers)
                }
            ]
        )
    }

    const OptionName = (item) =>{
        const array = ["detail"]
        if(permission_autorisation("Utilisateurs",permissions)?.action){
            if(item.statut == 1){
                array.push("Desactiver")
            } else{
                array.push("Réactiver")
            }
        }
        if (permission_autorisation("Utilisateurs",permissions)?.update)array.push("Modifier")
        if (permission_autorisation("Utilisateurs",permissions)?.delete) array.push("Supprimer")
        array.push("Annuler")

        return array
    }

    const OptionFunction = (item) =>{
        const array = [()=> viewUsers(item)]
        if(permission_autorisation("Utilisateurs",permissions)?.action) array.push(()=> toggleUsers(item))
        if (permission_autorisation("Utilisateurs",permissions)?.update)array.push(()=> editUsers(item))
        if (permission_autorisation("Utilisateurs",permissions)?.delete) array.push(()=>deleteUsers(item))

        return array
    }

    const renderItem = ({item}) => {
        return(
            <View
                style={{flex : 1, flexDirection : 'row', paddingVertical : SIZES.radius, padding : 10}}
            >
                <Feather name="user" size={22}  color={item.statut == 1 ? COLORS.secondary : COLORS.red} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : 10
                }}>
                   <View>
                       <Text style={{fontSize : 17}}>{item.firstname} {item.lastname}</Text>
                       <Text style={{fontSize : 10,color : COLORS.primary}}>Role : {item.name}</Text>
                   </View>
                    <Text>{item.email}</Text>

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
                <Text style={{color:COLORS.black,...FONTS.h1}} >Utilisateurs</Text>

                {!show ?
                    <AddButton  on_press={()=> {
                        setShow(true)
                        setDetail(null)
                    }
                    }  />
                    :
                    <Pressable onPress={()=> setShow(false)}>
                        <Feather name="x" size={30} style={{opacity : 0.6,fontWeight : "100"}} />
                    </Pressable>
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
                                                users.length > 0 ?
                                                    <FlatList
                                                        contentContainerStyle = {{marginTop : SIZES.base}}
                                                        data={users}
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
                        <UserAdd  token={token} roles={roles}  updateData={detail} onCreated={getUsers} setVisible={setShow} />
                }



                <DetailModal
                    title="Detail de l'utilisateur"
                    visible={detailShow}
                    setShowModal={setDetailShow}
                >
                    <View >
                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>utilisateur : </Text>
                            <Text>{detail?.firstname} {detail?.lastname}</Text>
                        </View>
                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Email : </Text>
                            <Text>{detail?.email}</Text>
                        </View>
                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Numéro de téléphone : </Text>
                            <Text>{detail?.telephone}</Text>
                        </View>
                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Role : </Text>
                            <Text>{detail?.name}</Text>
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
export default Users;