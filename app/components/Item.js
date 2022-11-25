import {Text, TouchableOpacity, View} from "react-native";
import {COLORS, FONTS, SIZES} from "../constants";
import Feather from "react-native-vector-icons/Feather";
import React from "react";


const Item = ({item,navigation,children,destination = null}) => {
    return(
        <TouchableOpacity
            style={{
                flex : 1,
                flexDirection : 'row',
                alignItems : 'center',
                paddingVertical : SIZES.radius
            }}
            onPress={()=> {
                if (destination !== null){
                    navigation.navigate(destination,{id  : item.id})
                }
            }}
        >
            <Feather name={item.icon} size={22}  color={item.type == 1 ? COLORS.green : COLORS.red} />

            <View  style={{
                flex : 1,
                flexDirection : 'row',
                justifyContent: "space-between",
                marginLeft : SIZES.padding
            }}>
                {children}
            </View>

        </TouchableOpacity>
    )
}

export default Item