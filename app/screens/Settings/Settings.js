import React, {useEffect, useState} from 'react';
import {
    ScrollView,
    StatusBar, StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native'
import {COLORS} from "../../constants";
import HeaderBar from "../../components/HeaderBar";
import Feather from "react-native-vector-icons/Feather";
import LogoutModal from "../../components/LogoutModal";
import {LogoutAction} from "../../store/actions/LoginAction";
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {permission_autorisation} from "../../constants/api";

const  Settings =  ({navigation})  => {

    const [showModal,setShowModal] = useState(false)


    const dispatch = useDispatch()
    const logout = () => {
        dispatch(LogoutAction())
    }

    const [permissions,setpermissions] = useState([])

    useEffect(()=>{
        loadRole()
    },[])

    const loadRole = async () =>{
        let permissions = await  AsyncStorage.getItem('permissions')
         setpermissions(permissions)
    }


    return (
        <ScrollView>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <HeaderBar navigation={navigation} right={false} />

            <View style={styles.container}>

                {/*   Motif */}
                {permission_autorisation('Outcoming',permissions)?.show &&
                <View style={styles.box}>
                    <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Motif')} >
                        <Feather name="list" size={20} />
                        <Text style={styles.txt}>Motif de dépense</Text>
                    </TouchableOpacity>
                </View>
                }

                {/*   Projet Terminer */}
                {permission_autorisation('CLose_projet',permissions)?.show &&
                <View style={styles.box}>
                    <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Closed')} >
                        <Feather name="grid" size={20} />
                        <Text style={styles.txt}>Projets Cloturés</Text>
                    </TouchableOpacity>
                </View>
                }

                {/*   Historique*/}
                {permission_autorisation('Historique', permissions)?.show &&
                    <View style={styles.box}>
                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Historic')}>
                            <Feather name="list" size={20}/>
                            <Text style={styles.txt}>Historique</Text>
                        </TouchableOpacity>
                    </View>
                }


                {/* profil */}
               <View style={styles.box}>
                   <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Profil')}>
                       <Feather name="user" size={20} />
                       <Text style={styles.txt}>Mon Profil</Text>
                   </TouchableOpacity>
               </View>


                {/* securité */}
                <View style={styles.box}>
                    <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Security')}>
                        <Feather name="lock" size={20} />
                        <Text style={styles.txt}>Sécurité</Text>
                    </TouchableOpacity>
                </View>



            {/*    Deconnexion */}

                <View style={styles.box}>
                    <TouchableOpacity style={styles.btn} onPress={()=>setShowModal(true)}>
                        <Feather name="power" size={20} color={COLORS.red} />
                        <Text style={{color : COLORS.red,...styles.txt}}>Deconnexion</Text>
                    </TouchableOpacity>
                </View>

                <LogoutModal visible={showModal} setShowModal={setShowModal} confirmAction={logout}/>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container : {
       marginTop : 20,
    },

    box :{
        padding : 20,
        borderBottomWidth : 1,
        borderBottomColor : COLORS.lightGray
    }
    ,

    btn : {
       flexDirection : "row",
    },

    txt : {
        paddingLeft : 20,
        paddingTop : 2,
        fontFamily : "Poppins-Medium"
    }
})


export default Settings;