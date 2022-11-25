import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {COLORS, FONTS, SIZES} from "../constants";
import Feather from "react-native-vector-icons/Feather";
import {formatSimpleDate} from "../constants/api";
import EmptyList from "./EmptyList";
import Loading from "./Loading";

const TransactionHistory = ({customContainerStyle,history,navigation,loading}) => {

    const renderIdem = ({item}) => {
        return(
            <TouchableOpacity
             style={{
                 flex : 1,
                 flexDirection : 'row',
                 alignItems : 'center',
                paddingVertical : SIZES.radius
             }}
             onPress={()=> navigation.navigate('TransactionDetail',
                 {
                     "transaction"  : item
                 }
             )}
            >
                <Feather name={item?.motif ? "trending-down" : "trending-up"} size={22}  color={item?.motif  ? COLORS.red : COLORS.green} />

                <View  style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent: "space-between",
                    marginLeft : SIZES.padding
                }}>
                  <Text style={{color : COLORS.black,...FONTS.h4}}>{item?.motif ? "OUT" : "INC"}</Text>
                  <Text style={{color : COLORS.black}}>{formatSimpleDate(item.created_at)}</Text>
                  <Text style={{color : COLORS.black,...FONTS.h4}}>{String(item.amount).replace(/(.)(?=(\d{3})+$)/g,'$1,')} Frcs</Text>
                    <Feather  name="chevron-right" size={22} color={COLORS.black} />
                </View>

            </TouchableOpacity>
        )
    }


    return (
        <View
         style={{
             marginTop : SIZES.font,
             marginHorizontal : 5,
             padding : 14,
             borderRadius : SIZES.smallRadius,
             backgroundColor : COLORS.white,
             ...customContainerStyle
         }}
        >
            <Text>Historique des transactions</Text>

             <>
                 {
                     loading ? <Loading />
                          :
                         <>
                             {
                                 history?.length > 0
                                     ?
                                     <FlatList
                                         contentContainerStyle = {{marginTop : SIZES.base}}
                                         data={history}
                                         renderItem = {renderIdem}
                                         keyExtractor={item => `${item.id}`}
                                         scrollEnabled={false}
                                         showsHorizontalScrollIndicator = {false}
                                         ItemSeparatorComponent={()=>{
                                             return (
                                                 <View style={{width : "100%",height : 1, backgroundColor : COLORS.lightGray}}></View>
                                             )
                                         }}
                                     />
                                     :
                                     <EmptyList />
                             }
                         </>
                 }
             </>
        </View>
    );
}

export default TransactionHistory;