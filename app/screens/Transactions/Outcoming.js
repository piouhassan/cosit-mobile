import React, {useCallback, useEffect, useState} from 'react';
import {
    ActivityIndicator,
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
    ErrorHandler,
    formatSimpleDate, permission_autorisation,
    Server_link,
    toastAlert,
    togglefromServer
} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import AddButton from "../../components/AddButton";
import Badge from "../../components/Badge";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import OptionsMenu from "react-native-option-menu";
import OperationLoading from "../../components/OperationLoading";
import Loading from "../../components/Loading";
import Disconnected from "../../components/Disconnected";
import EmptyList from "../../components/EmptyList";
import OutcomingAdd from "./OutcomingAdd";
import CrudModal from "../../components/CrudModal";
import {TextInput as INput} from "react-native-paper"
import AnimedButton from "../../components/AnimedButton";
import Buttons from "../../components/Buttons";

const  Outcoming =  ({navigation})  => {

    const [show,setShow] = useState(false)
    const [filterText,setFilterText] = useState("")
    const [loading,setLoading] = useState(true)
    const [opLoading,setOpLoading] = useState(false)
    const [Mloading,setMloading] = useState(false)
    const [disconnected,setDisconnected] = useState(false)
    const [detailShow,setDetailShow] = useState(false)
    const [detail,setDetail] = useState("")
    const [token,setToken] = useState(null)
    const [motifs,setMotifs] = useState([])
    const [projets,setProjets] = useState([])
    const [outcoming,setoutcoming] = useState([])
    const [alloutcoming,setAlloutcoming] = useState([])
    const [rejetMotif,setRejetMotif] = useState("")
    const [permissions,setpermissions] = useState([])


    useEffect(()=>{
        getOutcoming()
    },[])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getOutcoming()
            setRefreshing(false)
        },2000)
    }, []);

    const getOutcoming =  async () =>{
        setpermissions(await AsyncStorage.getItem('permissions'))
        const ktoken =  await AsyncStorage.getItem("token");
        setLoading(true)
        if (ktoken != null){
            try{
                axios.get(Server_link+'outcoming',attachTokenToHeaders(ktoken))
                    .then((response)=>{
                        setoutcoming(response.data.outcoming)
                        setAlloutcoming(response.data.outcoming)
                        setMotifs(response.data.motifs)
                        setProjets(response.data.projets)
                        setToken(ktoken)
                        setLoading(false)
                        setDisconnected(false)
                    })
                    .catch(function(error) {
                        setLoading(false)
                        setDisconnected(true)
                        toastAlert(error.message)
                    });
            }
            catch (e) {
                setLoading(false)
                setDisconnected(true)
                toastAlert(e.message)
            }
        }
    }

    const SearchContent = (value) =>{
        setFilterText(value)
        if (value === "" && alloutcoming.length > 0){
            setoutcoming(alloutcoming)
        }
        else if (value !== ""){
            const filter = outcoming.filter((item)=> item.amount.includes(value))
            setoutcoming(filter)
        }
    }

    const viewOutcoming = (item) => {
        navigation.navigate('TransactionDetail',{"transaction" : item,"token" : token})
    }
    const editOutcoming = (item) => {
        setShow(true)
        setDetail(item)
    }
    const deleteOutcoming = (item) => {
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer la dépense ?`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () =>
                        deletefromServer(token,"outcoming",item.id,setOpLoading,getOutcoming)
                }
            ]
        )
    }
    const toggleOutcoming = (item) => {
         if (item.statut == 1){
             Alert.alert(
                 "Valider de la dépense ",
                 `Êtes vous sûre de vouloir  valider la dépense ?` ,
                 [
                     {
                         text: "Annuler",
                         onPress: () => console.log("Cancel Pressed"),
                         style: "cancel"
                     },
                     { text: "Valider", onPress: () =>
                             togglefromServer(token,"outcoming",item.id,setOpLoading,2 ,getOutcoming)
                     }
                 ]
             )
         }else if (item.statut == 2){
             Alert.alert(
                 "Dépense éffectué ",
                 `Êtes vous sûre de vouloir  définir cette dépense comme éffectué ?` ,
                 [
                     {
                         text: "Annuler",
                         onPress: () => console.log("Cancel Pressed"),
                         style: "cancel"
                     },
                     { text: "Valider", onPress: () =>
                             togglefromServer(token,"outcoming",item.id,setOpLoading,4 ,getOutcoming)
                     }
                 ]
             )
         }
    }
    const rejetOutcoming = (item) => {
          setDetailShow(true)
        setDetail(item)
    }
    const submitRejet  = async () => {
        const id = detail.id
        setMloading(true)
        try {
            await axios.post(Server_link+'outcoming/rejet/'+id,{motif : rejetMotif},attachTokenToHeaders(token,true))
                .then(async (response)=>{
                    if (response.data.succeed){
                        setMloading(false)
                        toastAlert(response.data.message)
                        setDetailShow(false)
                        setRejetMotif("")
                        getOutcoming()
                    }
                    else{
                        setMloading(false)
                        toastAlert(response.data.message)
                    }
                })

        }
        catch (err) {
            setMloading(false)
            toastAlert(ErrorHandler(err.message))
        }
    }


    const OptionName = (item) =>{
        const array = ["detail"]
        if(permission_autorisation("Outcoming",permissions)?.action){
            if(item.statut == 1){
                array.push("Valider")
                array.push("Rejetter")
            } else if (item.statut == 2){
                array.push("Effectuer")
            }

        }

        if(item.statut == 1 || item.statut == 2){
            if (permission_autorisation("Outcoming",permissions)?.update)array.push("Modifier")
            if (permission_autorisation("Outcoming",permissions)?.delete) array.push("Supprimer")
        }
        array.push("Annuler")

        return array
    }

    const OptionFunction = (item) =>{
        const array = [()=> viewOutcoming(item)]
        if(permission_autorisation("Outcoming",permissions)?.action) {
            array.push(()=> toggleOutcoming(item))
            array.push(()=> rejetOutcoming(item))
        }
        if (permission_autorisation("Outcoming",permissions)?.update)array.push(()=> editOutcoming(item))
        if (permission_autorisation("Outcoming",permissions)?.delete) array.push(()=>deleteOutcoming(item))

        return array
    }



    const renderItem = ({item}) => {
        return(
            <View
                style={{flex : 1, flexDirection : 'row', paddingVertical : SIZES.radius, padding : 10}}
            >
                <Feather name="chevrons-down" size={22}  color={COLORS.red} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : 10,
                    paddingVertical : 7
                }}>
                    <Text style={{fontWeight : "bold"}}>{String(item.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')} Frcs</Text>
                    <Text>{item.designation.substring(0,20)}...</Text>
                    {item.statut  == 2 &&

                        <Feather name="check" size={17} color={COLORS.secondary} />

                    }

                    {item.statut  == 3 &&

                        <Feather name="x" size={17} color={COLORS.red} />

                    }

                    {item.statut  == 4 &&

                        <Feather name="check-circle" size={17} color={COLORS.green} />

                    }

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
                    <Text style={{color:COLORS.black,...FONTS.h1}} >Dépense</Text>
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
                    !show &&

                    <View style={{flexDirection : "row",marginLeft : 10,marginTop : 10, justifyContent : "space-between",marginRight : 17}}>
                        <View style={{flexDirection : "row"}}>
                            <Feather name="check" size={17} color={COLORS.secondary} />
                            <Text style={{marginLeft : 10}}>Dépense validé</Text>
                        </View>

                        <View style={{flexDirection : "row"}}>
                            <Feather name="check-circle" size={17} color={COLORS.green} />
                            <Text style={{marginLeft : 10}}>Dépense effectué</Text>
                        </View>

                        <View style={{flexDirection : "row"}}>
                            <Feather name="x" size={17} color={COLORS.red} />
                            <Text style={{marginLeft : 10}}>Dépense rejetté</Text>
                        </View>
                    </View>

                }

                {
                    !show ?
                        <>
                            {loading ? <Loading/> :
                                <View style={{marginTop: 10, padding: 5,}}>
                                    {disconnected ?
                                        <Disconnected/> :
                                        <View style={{marginTop: SIZES.font, borderRadius: SIZES.smallRadius}}>
                                            {
                                                outcoming.length > 0 ?
                                                    <FlatList
                                                        contentContainerStyle={{marginTop: SIZES.base}}
                                                        data={outcoming}
                                                        renderItem={renderItem}
                                                        keyExtractor={item => `${item.id}`}
                                                        scrollEnabled={false}
                                                        showsHorizontalScrollIndicator={false}
                                                        ItemSeparatorComponent={() => {
                                                            return (
                                                                <View style={{
                                                                    width: "100%",
                                                                    height: 1,
                                                                    backgroundColor: COLORS.lightGray
                                                                }}></View>
                                                            )
                                                        }}
                                                    />

                                                    : <EmptyList/>
                                            }
                                        </View>
                                    }
                                </View>}
                        </>
                        :

                   <OutcomingAdd  token={token}  updateData={detail}  projets={projets} onCreated={getOutcoming} motifs={motifs} setVisible={setShow} />
                }

                      <CrudModal
                          title="Rejetter cet outcoming"
                       visible={detailShow}
                       setVisible={setDetailShow}

                      >
                          <View>
                              <INput
                                  mode="outlined"
                                  label="Motif du rejet"
                                   onChangeText={setRejetMotif}
                                   value={rejetMotif}
                                  numberOfLines = {7}
                                  multiline={true}
                              />

                              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width : "50%",marginLeft : "25%",marginTop : 60}} >


                                  {
                                      Mloading ? <ActivityIndicator size="small" color={COLORS.secondary} />
                                          :  <Buttons on_press={()=>{submitRejet()}} btn_text="Envoyé"  color={COLORS.primary} />
                                  }
                              </View>

                          </View>

                      </CrudModal>
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

export default Outcoming;