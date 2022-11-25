import React from "react";
import {

    View,
    Text,
    TouchableOpacity,
} from 'react-native'


import {COLORS,SIZES,FONTS,icons} from "../constants"
import Feather from "react-native-vector-icons/Feather";



const HeaderBar = ({navigation,right,title}) => {

    return(
        <View style={{paddingHorizontal : SIZES.base,paddingVertical : SIZES.padding ,flexDirection : "row"}}>
         <View style={{flex : 1,alignItems : 'flex-start'}}>
             <TouchableOpacity
               style={{
                   flexDirection : 'row',
                   alignItems : 'center'
               }}
               onPress={() => navigation.goBack()}
             >
                 <Feather name="arrow-left" size={22} color={COLORS.gray}  />
                  <Text style={{marginLeft : SIZES.base,...FONTS.h3}}>Retour</Text>
             </TouchableOpacity>
         </View>

            {
                title &&
                <View style={{flex : 1,alignItems : 'flex-end',flexDirection : "row",justifyContent : "flex-end",marginRight : 10}}>
                    <Text style={{marginLeft : SIZES.base,...FONTS.h3}}>{title}</Text>
                </View>
            }

            {
                right &&
                <View style={{flex : 1,alignItems : 'flex-end',flexDirection : "row",justifyContent : "flex-end"}}>

                    <TouchableOpacity
                        style={{
                            flexDirection : 'row',
                            alignItems : 'center',
                            marginRight : SIZES.padding
                        }}
                        onPress={() => alert('Checked')}
                    >
                        <Feather name="check" size={22}  color={COLORS.green}   />

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection : 'row',
                            alignItems : 'center',
                            marginRight : SIZES.padding
                        }}
                        onPress={() => alert('Modifier')}
                    >
                        <Feather name="feather" size={22}  color={COLORS.blue}   />

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{
                            flexDirection : 'row',
                            alignItems : 'center'
                        }}
                        onPress={() => alert('Supprimer')}
                    >

                        <Feather name="trash" size={22} color={COLORS.primary}   />
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default HeaderBar