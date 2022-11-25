import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View,StyleSheet} from 'react-native'
import Feather from "react-native-vector-icons/Feather";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {COLORS} from "../../constants";
import LinearGradient from "react-native-linear-gradient";
import {Transactions, Customers, Users, Dashboard, Projects, Incoming, Outcoming} from "../index";
import {Provider} from "react-native-paper";
const Tab = createBottomTabNavigator();
import { LogBox } from 'react-native';
import LockView from "../Security/LockView";
import {hasUserSetPinCode} from "@haskkor/react-native-pincode";
import Loading from "../../components/Loading";
import FullScreenLoading from "../../components/FullScreenLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {permission_autorisation, Server_link} from "../../constants/api";
import axios from "axios";
import {attachTokenToHeaders} from "../../store/actions/LoginAction";


const  HomeTab =  ()  => {

    const [permissions,setPermissions] = useState(null)
    useEffect(()=>{
        LogBox.ignoreLogs(['Warning: ...']);
        LogBox.ignoreAllLogs();
    },[])

    useEffect(()=>{
      checkifPin()
    },[])



    const [unlock,setUnlock] = useState(true)
    const [loading,setLoading] = useState(true)

    const checkifPin = async () =>{
        setLoading(true)
        checkRoleOnline()
        const hasPin = await hasUserSetPinCode();
            if (hasPin) {
                setUnlock(false)
            }
    }

    const checkRoleOnline = async () =>{
        const token = await  AsyncStorage.getItem('token')

        if (token != null){
            try{
                axios.get(Server_link+'user/role',attachTokenToHeaders(token))
                    .then(async (response)=>{
                        setPermissions(response.data.permission)
                        await  AsyncStorage.setItem('permissions',response.data.permission)
                        setLoading(false)
                    })
                    .catch(function(error) {
                        setLoading(false)
                        console.log('There has been a problem with your fetch operation: ' + error.message);
                    });
            }
            catch (e) {
                setLoading(false)
                console.log('There has been a problem with your fetch operation: ' + e.message);
            }
        }


    }

    const lockScreen = useRef(true)

    return (
       <>
           {
               loading ?
                   <FullScreenLoading />
                   :

                   <>
                       {
                           unlock ?
                               <Tab.Navigator
                                   tabBarOptions={{
                                       showLabel: false,
                                       style : {
                                           position : "absolute",
                                           bottom : 0,
                                           left : 0,
                                           right : 0,
                                           elevation : 20,
                                           backgroundColor : COLORS.white,
                                           borderTopColor : "transparent",
                                           height : 60,
                                           borderTopWidth : 1,
                                       },
                                       activeTintColor: COLORS.primary,
                                       inactiveTintColor: COLORS.black
                                   }}
                               >
                                   <Tab.Screen
                                       name="Dashboard"
                                       component={Dashboard}
                                       style={{fontFamily : "Poppins-Medium"}}
                                       options={{
                                           tabBarIcon: ({ color, size }) => (
                                               <Feather name="home" color={color} size={size} />
                                           )
                                       }}

                                   />

                                   {permission_autorisation("Clients", permissions)?.show &&
                                       < Tab.Screen
                                       name="Clients"
                                       component={Customers}
                                       options={{
                                       tabBarIcon: ({color, size}) => (
                                       <Feather name="users" color={color} size={size} />
                                       )
                                   }}
                                       />
                                   }

                                   {permission_autorisation("Projets", permissions)?.show &&
                                       <Tab.Screen
                                           name="Projets"
                                           component={Projects}
                                           options={{

                                               tabBarIcon: ({color, size}) => (
                                                   <Feather name="grid" color={color} size={size}/>
                                               )
                                           }}
                                       />
                                   }

                                   {permission_autorisation("Incoming", permissions)?.show &&
                                   <Tab.Screen
                                       name="Incoming"
                                       component={Incoming}
                                       options={{
                                           tabBarIcon: ({ color, size }) => (
                                               <Feather name="chevrons-up" color={color} size={size} />
                                           )
                                       }}
                                   />}


                                   {permission_autorisation("Outcoming", permissions)?.show &&
                                       <Tab.Screen
                                           name="Outcoming"
                                           component={Outcoming}
                                           options={{
                                               tabBarIcon: ({color, size}) => (
                                                   <Feather name="chevrons-down" color={color} size={size}/>
                                               )
                                           }}
                                       />
                                   }

                                   {permission_autorisation("Utilisateurs", permissions)?.show &&
                                       <Tab.Screen
                                           name="Users"
                                           component={Users}
                                           options={{

                                               tabBarIcon: ({color, size}) => (
                                                   <Feather name="user-plus" color={color} size={size}/>
                                               )
                                           }}

                                       />
                                   }
                               </Tab.Navigator>

                               :
                               <LockView  lockScreen={lockScreen} setUnlock={setUnlock} />
                       }
                   </>
           }
       </>
    );
}


const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
    }
})

export default HomeTab;