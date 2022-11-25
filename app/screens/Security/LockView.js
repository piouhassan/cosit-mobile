import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, View} from "react-native";
import PINCode, {deleteUserPinCode, hasUserSetPinCode, resetPinCodeInternalStates} from "@haskkor/react-native-pincode";
import {COLORS} from "../../constants";
import HeaderBar from "../../components/HeaderBar";
import {useRoute} from "@react-navigation/native";
import {toastAlert} from "../../constants/api";

const  LockView = ({navigation,setUnlock,lockScreen}) => {
    const route = useRoute()
    const [PinStatus,setPinStatus] = useState("choose")


    useEffect(()=>{
        if (lockScreen) setPinStatus("enter")
        if (route.params?.security){
            if(route.params?.security && route.params?.status == "enter") setPinStatus("enter")
        }
    },[])

    const setCodePin = async () =>{
        if (lockScreen){
            {
                setUnlock(true)
            }
        }else{
            if (PinStatus == "choose"){
                const hasPin = await hasUserSetPinCode();
                if (hasPin) {
                    navigation.goBack()
                    toastAlert("Code PIN ajouter avec succes")
                }
            }
            else{
                deleteCodePin()
                toastAlert("Code PIN supprimé avec succès")
            }
        }

    }

    const deleteCodePin = async () =>{
        await deleteUserPinCode();
        await resetPinCodeInternalStates();
        navigation.goBack()
    }


    return (
        <SafeAreaView style={{flex : 1, backgroundColor : COLORS.white}}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {
                !lockScreen && <HeaderBar navigation={navigation} title={PinStatus == "choose" ? "Ajouter un code Pin" : "Supprimer le code Pin"} />
            }
            <PINCode
                timeLocked={300000}
                colorCircleButtons={COLORS.black}
                colorPassword={COLORS.black}
                touchIDDisabled={true}
                numbersButtonOverlayColor={COLORS.gray}
                stylePinCodeColorTitle={COLORS.black}
                stylePinCodeColorSubtitleError={COLORS.black}
                stylePinCodeColorSubtitle={COLORS.black}
                stylePinCodeButtonNumber={COLORS.white}
                stylePinCodeDeleteButtonColorShowUnderlay={COLORS.black}
                stylePinCodeDeleteButtonColorHideUnderlay={COLORS.black}
                colorPasswordError={COLORS.red}
                subtitleChoose="Pour garder vos données en sécurité"
                titleChoose="1 - Saisir le code PIN"
                titleConfirm="2 - Confirmer le code PIN"
                titleEnter="Saisir le code Pin"
                titleAttemptFailed="Code Pin incorrect"
                textTitleLockedPage="Nombre de tentative dépassé"
                textDescriptionLockedPage="Pour protéger vos données, l'acces a été bloqué."
                textSubDescriptionLockedPage="Réessayer plus tard"
                buttonDeleteText="Effacer"
                textButtonLockedPage="Fermer"
                onClickButtonLockedPage={()=> alert('Code PIN obligatoire')}
                status={PinStatus}
                pinCodeVisible={true}
                finishProcess={()=>setCodePin()}
            />
        </SafeAreaView>
    );
}

export default LockView;