import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Image,
    Text,
    View,
    Alert,
    TouchableOpacity,

} from 'react-native';

import {
    DrawerItems,
    NavigationActions, StackActions,
    SafeAreaView
} from 'react-navigation';

import {
    COLOR_GREEN,FONT_REGULAR,COLOR_WHITE
} from '../Helpers/Helper';
import HeaderDrawer from './HeaderDrawer';
import Logout from './Logout';



const CustomDrawer = props => (
    
        
        <SafeAreaView 
            style = {styles.container}
            forceInset = {{ top : 'always' , horizontal:'never'}}
        >
            <View style={{flex: 1,justifyContent: 'space-between',}}>
                <View style = {styles.header}>
                    <HeaderDrawer />
                </View>
                <View >
                    <ScrollView>
                        <DrawerItems  {...props}  
                            
                            onItemPress={({route, focused}) => {
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'App' })],
                                })
                                props.navigation.dispatch(resetAction)
                                props.navigation.navigate(NavigationActions.navigate({
                                    routeName: 'App',
                                    action: NavigationActions.navigate({ 
                                        routeName: route.routeName
                                    })
                                }))
                            }}
                        labelStyle={{color: '#ffffff',fontFamily:FONT_REGULAR}}/>
                    </ScrollView>
                </View>
                    
                <Logout/>
            </View>    
        </SafeAreaView> 
    
);
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLOR_GREEN
    },
    header:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        marginTop:50,
    },
    footer:{
        backgroundColor:COLOR_WHITE,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
    },
      
});

export default CustomDrawer;
