import React, {useEffect, useState} from 'react';
import
{
    View,
    Modal,
    TouchableWithoutFeedback,
    StyleSheet,
    Text, Dimensions, TouchableOpacity

} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const DeviceHeight = Dimensions.get('window').height

const BottomSheet = ({title,show,setShow,onTouchOutside,size,renderContent}) => {

    const [sizes,setSizes] = useState("medium")

    useEffect(()=>{
        if (size == "small") setSizes(0.2)
        if (size == "medium") setSizes(0.4)
        if (size == "large") setSizes(0.6)
        if (size == "extra-large") setSizes(0.8)
    },[size])


    const renderOutsideTouchable = ({onTouch}) => {
        const view = <View style={{flex : 1, width : "100%"}} />

        if (!onTouch) return view

        return (
            <TouchableWithoutFeedback onPress={onTouch} style={{flex : 1,width : "100%"}}>
                {view}
            </TouchableWithoutFeedback>
        )
    }


    return (
       <Modal
         animationType='slide'
         transparent={true}
         visible={show}
         onRequestClose={()=>setShow(false)}
       >
           <View style={{
               flex : 1,
               backgroundColor : "#000000AA",
               justifyContent : 'flex-end'
           }}>
               {renderOutsideTouchable(onTouchOutside)}

               <View style={{
                   backgroundColor : "#fff",
                   width : "100%",
                    borderTopRightRadius : 20,
                   borderTopLeftRadius : 20,
                   paddingHorizontal : 10,
                   height : DeviceHeight * sizes
               }}>
               <View style={{flexDirection : "row",justifyContent : "space-between"}}>
                   <Text style={{
                       color : "#182E44",
                       fontSize : 20,
                       fontWeight : '500',
                       margin : 15,
                   }}>
                       {title}
                   </Text>
                   <TouchableOpacity onPress={()=> setShow(false)} style={{
                       justifyContent  : "flex-end",
                       opacity : 0.5,
                       paddingTop : 10
                   }}>
                       <Feather name="x" size={25} />
                   </TouchableOpacity>
               </View>
                   {renderContent}
               </View>

           </View>
       </Modal>
    );
}

export default BottomSheet