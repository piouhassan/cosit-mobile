import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
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
import {
    deletefromServer,
    formatDate,
    permission_autorisation,
    Server_link,
    togglefromServer
} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import Loading from "../../components/Loading";
import Feather from "react-native-vector-icons/Feather";
import OperationLoading from "../../components/OperationLoading";
import Disconnected from "../../components/Disconnected";
import EmptyList from "../../components/EmptyList";
import ProjetAdd from "./ProjetAdd";
import OptionsMenu from "react-native-option-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetailModal from "../../components/DetailModal";

const  Projects =  ()  => {


    const [show,setShow] = useState(false)
    const [filterText,setFilterText] = useState("")
    const [detail,setDetail] = useState("")
    const [projects,setprojects] = useState([])
    const [allprojects,setAllprojects] = useState([])
    const [loading,setLoading] = useState(true)
    const [opLoading,setOpLoading] = useState(false)
    const [disconnected,setDisconnected] = useState(false)
    const [token,setToken] = useState(null)
    const [refreshing, setRefreshing] = React.useState(false);
    const [detailShow, setDetailShow] = React.useState(false);
    const [users,setUsers] = useState(null)
    const [customers,setCustomers] = useState(null)
    const [permissions,setpermissions] = useState([])


    useEffect(()=>{
        getProjects()
    },[])


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getProjects()
            setRefreshing(false)
        },2000)
    }, []);



    const getProjects =  async () =>{
        setpermissions(await AsyncStorage.getItem('permissions'))

        const ktoken =  await AsyncStorage.getItem("token");
        setLoading(true)

        console.log(ktoken)

        if (ktoken != null){
            try {
                axios.get(Server_link+'projects',attachTokenToHeaders(ktoken))
                    .then((response)=>{
                        setprojects(response.data.projects)
                        setAllprojects(response.data.projects)
                        setUsers(response.data.users)

                        setCustomers(response.data.customers)
                        setLoading(false)
                        setDisconnected(false)
                        setToken(ktoken)
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
        if (value === "" && allprojects.length > 0){
            setprojects(allprojects)
        }
        else if (value !== ""){
            const filter = projects.filter((item)=> item.nom.includes(value))
            setprojects(filter)
        }
    }
    const viewProjects = (item) => {
        setDetailShow(true)
        setDetail(item)
    }
    const editProjects = (item) => {
        setShow(true)
        setDetail(item)
    }
    const deleteProjects = (item) => {
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer ${item.nom}`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () =>
                        deletefromServer(token,"project",item.id,setOpLoading,getProjects)
                }
            ]
        )
    }
    const toggleProjects = (item) => {
        Alert.alert(
            item.statut == 1 ? "Desactiver " : "Réactiver ",
            `Êtes vous sûre de vouloir ${item.statut == 1 ? " desactiver "+item.nom : " réactiver "+item.nom}` ,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: item.statut == 1 ? "Desactiver " : "Réactiver ", onPress: () =>
                        togglefromServer(token,"project",item.id,setOpLoading,item.statut == 1 ? 2 : 1 ,getProjects)
                }
            ]
        )
    }


    const OptionName = (item) =>{
        const array = ["detail"]
        if(permission_autorisation("Projets",permissions)?.action){
            if(item.statut == 1){
                array.push("Desactiver")
            } else{
                array.push("Réactiver")
            }
        }
        if (permission_autorisation("Projets",permissions)?.update)array.push("Modifier")
        if (permission_autorisation("Projets",permissions)?.delete) array.push("Supprimer")
        array.push("Annuler")

        return array
    }

    const OptionFunction = (item) =>{
        const array = [()=> viewProjects(item)]
        if(permission_autorisation("Projets",permissions)?.action) array.push(()=> toggleProjects(item))
        if (permission_autorisation("Projets",permissions)?.update)array.push(()=> editProjects(item))
        if (permission_autorisation("Projets",permissions)?.delete) array.push(()=>deleteProjects(item))

        return array
    }




    const renderItem = ({item}) => {
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
                <Feather name="grid" size={50}  color={item.statut == 1 ? COLORS.primary : COLORS.red} />

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
                    <Text style={{color:COLORS.black,...FONTS.h1}} >Projets</Text>
                    {
                        permission_autorisation("Projets", permissions)?.create &&

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
                                        projects.length > 0 ?
                                            <FlatList
                                                contentContainerStyle = {{marginTop : SIZES.base}}
                                                data={projects}
                                                renderItem = {renderItem}
                                                keyExtractor={item => `${item.id}`}
                                                scrollEnabled={false}
                                                showsHorizontalScrollIndicator = {false}
                                            />

                                            : <EmptyList />
                                    }
                                </View>
                            }
                        </View>}
                        </>
                        :
                        <ProjetAdd  token={token} users={users} customers={customers} updateData={detail} onCreated={getProjects} setVisible={setShow} />
                }



                <DetailModal
                    title="Detail du projet"
                    visible={detailShow}
                    setShowModal={setDetailShow}
                    size="medium"
                >
                    <View >

                        <View  style={{flexDirection : "row",marginBottom : 20,justifyContent : "center",alignItems : "center"}}>
                            <Text style={{fontSize : 35,color : COLORS.secondary,fontWeight : "bold"}}>{String(detail?.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')+ " Frcs"}</Text>
                        </View>

                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Projet : </Text>
                            <Text>{detail?.nom}</Text>
                        </View>

                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Client : </Text>
                            <Text>{detail?.fullname}</Text>
                        </View>
                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Responsable : </Text>
                            <Text>{detail?.lastname} {detail?.firstname}</Text>
                        </View>
                        <View  style={{flexDirection : "row",marginBottom : 10}}>
                            <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Ajouter le : </Text>
                            <Text>{formatDate(detail?.created_at)}</Text>
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
        shadowColor: "rgba(0,0,0,0.92)",
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

 badge : {
     marginTop : 10,
     fontSize : 13,
     fontWeight : "bold"
 }
})

export default Projects;