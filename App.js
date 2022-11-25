import React, {Fragment, useEffect} from 'react';
import {View,Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Splash, Onboarding, Login, Settings, TransactionDetail, Profil, Historic, Motif, Security} from './app/screens'
import HomeTab from "./app/screens/Home/HomeTab";
import {Provider as StoreProvider, useDispatch, useSelector} from "react-redux";
import {store} from "./app/store";
import {Init} from "./app/store/actions/LoginAction";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import LockView from "./app/screens/Security/LockView";
import Closed from "./app/screens/Projects/Closed";

const Stack = createNativeStackNavigator();




const RootNavigation = () =>{
    const token = useSelector(state => state.LoginReducer.authToken)
    const dispatch = useDispatch()
    const init = () => {
        dispatch(Init())
    }

    useEffect(()=>{
        init()
    },[])


    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}} >
                {token == null ?
                    <>
                        <Stack.Screen name="Splash" component={Splash} initialRouteName='Splash' />
                        <Stack.Screen name="Onboarding" component={Onboarding} />
                        <Stack.Screen name="Login" component={Login} />
                    </>
                    :
                  <>
                      <Stack.Screen name="Home" component={HomeTab}  />
                      <Stack.Screen name="Settings" component={Settings} />
                      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
                      <Stack.Screen name="Historic" component={Historic}  />
                      <Stack.Screen name="Profil" component={Profil}/>
                      <Stack.Screen name="Motif" component={Motif}/>
                      <Stack.Screen name="Security" component={Security}/>
                      <Stack.Screen name="LockView" component={LockView}/>
                      <Stack.Screen name="Closed" component={Closed}/>

                  </>

                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const App = () =>{

    return (
              <StoreProvider store={store} >
                  <GestureHandlerRootView style={{ flex: 1 }}>
                     <RootNavigation />
                  </GestureHandlerRootView>
              </StoreProvider>
    );
}

export default App