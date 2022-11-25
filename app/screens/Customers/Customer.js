import React, {useCallback, useEffect, useState} from 'react';
import {
    Dimensions, FlatList,
    ScrollView,
    StatusBar, StyleSheet,
    Text, TextInput, TouchableOpacity, RefreshControl, Alert,
    View, Pressable, SafeAreaView
} from 'react-native'
import {COLORS, FONTS, SIZES} from "../../constants";
import AddButton from "../../components/AddButton";
import Badge from "../../components/Badge";
import Disconnected from "../../components/Disconnected";
import EmptyList from "../../components/EmptyList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {deletefromServer, permission_autorisation, Server_link, togglefromServer} from "../../constants/api";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";
import Feather from "react-native-vector-icons/Feather";
import CustomerAdd from "./CustomerAdd";
import Loading from "../../components/Loading";
import OptionsMenu from "react-native-option-menu";
import OperationLoading from "../../components/OperationLoading";
import DetailModal from "../../components/DetailModal";


const  Customer =  ()  => {

    const [show,setShow] = useState(false)
    const [detailShow,setDetailShow] = useState(false)
    const [filterText,setFilterText] = useState("")
    const [loading,setLoading] = useState(true)
    const [deleteloading,setDeleteloading] = useState(false)
    const [disconnected,setDisconnected] = useState(false)
    const [customers,setCustomers] = useState([])
    const [allcustomers,setAllcustomers] = useState([])
    const [viewDetail,setViewDetail] = useState(null)
    const [countries,setCountries] = useState(null)
    const [permissions,setpermissions] = useState([])
    const [token,setToken] = useState(null)

    useEffect(()=>{
       getCustomers()
    },[])

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(()=>{
            getCustomers()
            setRefreshing(false)
        },2000)
    }, []);

    const SearchContent = (value) =>{
          setFilterText(value)
          if (value === "" && allcustomers.length > 0){
              setCustomers(allcustomers)
          }
          else if (value !== ""){
              const filter = customers.filter((item)=> item.fullname.includes(value))
              setCustomers(filter)
          }
      }

    const getCustomers =  async () =>{
        setpermissions(await AsyncStorage.getItem('permissions'))

        const token =  await AsyncStorage.getItem("token");
        setLoading(true)

        if (token != null){
            try{
                axios.get(Server_link+'customers',attachTokenToHeaders(token))
                    .then((response)=>{
                        setCustomers(response.data.customers)
                        setAllcustomers(response.data.customers)
                        setToken(token)
                        setCountries(response.data.countries)
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

    const viewCustomer = (item) => {
       setDetailShow(true)
       setViewDetail(item)
    }
    const editCustomer = (item) => {
        setShow(true)
        setViewDetail(item)
    }
    const deleteCustomer = (item) => {
        Alert.alert(
            "Suppression",
            `Êtes vous sûre de vouloir supprimer ${item.fullname}`,
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () =>
                        deletefromServer(token,"customer",item.id,setDeleteloading,getCustomers)
                }
            ]
        )
    }
    const toggleCustomer = (item) => {
          Alert.alert(
              item.statut == 1 ? "Desactiver " : "Réactiver ",
              `Êtes vous sûre de vouloir ${item.statut == 1 ? " desactiver "+item.fullname : " réactiver "+item.fullname}` ,
              [
                  {
                      text: "Annuler",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                  },
                  { text: item.statut == 1 ? "Desactiver " : "Réactiver ", onPress: () =>
                          togglefromServer(token,"customer",item.id,setDeleteloading,item.statut == 1 ? 2 : 1 ,getCustomers)
                  }
              ]
          )
    }

    const OptionName = (item) =>{
        const array = ["detail"]
        if(permission_autorisation("Clients",permissions)?.action){
                if(item.statut == 1){
                    array.push("Desactiver")
                } else{
                    array.push("Réactiver")
                }
        }
        if (permission_autorisation("Clients",permissions)?.update)array.push("Modifier")
        if (permission_autorisation("Clients",permissions)?.delete) array.push("Supprimer")
        array.push("Annuler")

        return array
    }
    const OptionFunction = (item) =>{
        const array = [()=> viewCustomer(item)]
        if(permission_autorisation("Clients",permissions)?.action) array.push(()=> toggleCustomer(item))
        if (permission_autorisation("Clients",permissions)?.update)array.push(()=> editCustomer(item))
        if (permission_autorisation("Clients",permissions)?.delete) array.push(()=>deleteCustomer(item))

        return array
    }


    const renderItem = ({item}) => {
        return(
            <View
                style={{flex : 1, flexDirection : 'row', paddingVertical : SIZES.radius, padding : 10}}
            >
                <Feather name="user" size={22}  color={item.statut == 1 ? COLORS.green : COLORS.red} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : 10
                }}>
                    <Text>{item.fullname}</Text>
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
       <SafeAreaView style={styles.container}>
           <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />


                   <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom : 60}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                       <View style={{flexDirection:'row', opacity : 0.7, justifyContent : "space-between", paddingHorizontal : SIZES.base, marginTop : 30}} >
                           <Text style={{color:COLORS.black,...FONTS.h1}} >Clients</Text>
                           {
                            permission_autorisation("Clients",permissions)?.create &&

                               <View>
                                   {!show ?
                                       <AddButton  on_press={()=> {
                                           setShow(true)
                                           setViewDetail(null)
                                       }
                                       }  />
                                       :
                                       <Pressable onPress={()=> setShow(false)}>
                                           <Feather name="x" size={30} style={{opacity : 0.6,fontWeight : "100"}} />
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

                       <OperationLoading visible={deleteloading} />


                   {
                     !show ?
                     <>{loading ? <Loading  /> : <View style={{marginTop : 10, padding : 5,}}>
                                     {disconnected ?
                                         <Disconnected /> : <View style={{marginTop : SIZES.font, padding : 5, borderRadius : SIZES.smallRadius,}}>
                                             {
                                                 customers.length > 0 ?
                                                     <FlatList
                                                         contentContainerStyle = {{marginTop : SIZES.base}}
                                                         data={customers}
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
                                 </View>}</>
                     :
                     <CustomerAdd countries={countries} token={token} updateData={viewDetail} onCreated={getCustomers} setVisible={setShow} />
                   }


                   <DetailModal
                       title="Detail Client"
                     visible={detailShow}
                      setShowModal={setDetailShow}
                   >
                       <View >
                           <View  style={{flexDirection : "row",marginBottom : 10}}>
                               <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Nom : </Text>
                               <Text>{viewDetail?.fullname}</Text>
                           </View>
                           <View  style={{flexDirection : "row",marginBottom : 10}}>
                               <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Email : </Text>
                               <Text>{viewDetail?.email}</Text>
                           </View>
                           <View  style={{flexDirection : "row",marginBottom : 10}}>
                               <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Téléphone : </Text>
                               <Text>{viewDetail?.fullname}</Text>
                           </View>
                           <View  style={{flexDirection : "row",marginBottom : 10}}>
                               <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Pays : </Text>
                               <Text>{viewDetail?.designation}</Text>
                           </View>
                           <View  style={{flexDirection : "row",marginBottom : 10}}>
                               <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium"}}>Adresse : </Text>
                               <Text>{viewDetail?.address}</Text>
                           </View>
                           <View  style={{flexDirection : "row",marginBottom : 10}}>
                               <Text style={{fontWeight : "bold", fontFamily : "Poppins-Medium",}}>Statut : </Text>
                               <Text style={{backgroundColor : viewDetail?.statut == 1 ? COLORS.secondary : COLORS.primary, color : COLORS.white,paddingHorizontal : 10, borderRadius : 50}}>{viewDetail?.statut == 1 ? "Actif" : "Désactivé"}</Text>
                           </View>
                       </View>
                   </DetailModal>

                   </ScrollView>



       </SafeAreaView>
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

export default Customer;