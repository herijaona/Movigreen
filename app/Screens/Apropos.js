import React, { Component } from 'react'
import { 
    View,
    Image,
    Text,
    StyleSheet,
    BackHandler,
    Platform
} from 'react-native';
import { COLOR_GREEN, COLOR_WHITE, FONT_REGULAR, FONT_BOLD } from '../Helpers/Helper';
import { NavigationActions, StackActions } from 'react-navigation';
import { getItemLocal } from '../Store/StoreLocal';

export default class Apropos extends Component{
    static navigationOptions = {
        title: 'Apropos',
        headerStyle: { backgroundColor:COLOR_GREEN },
        headerTintColor: COLOR_WHITE,
        headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
         
    }
    UNSAFE_componentWillMount(){
        this.expire();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            this.goBack();
            return true;
        })
    }
    expire(){
        var date = new Date();
        console.log(date);

        getItemLocal('debut')
        .then(res => {
            console.log('debut '+res);
            var res = JSON.parse(res);
            if(res){
                var last = new Date(res);
                const diffTime = Math.abs(date - last);
                const diffMin = Math.ceil(diffTime / (1000 * 60 )); 
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                console.log(diffMin);
                if(diffDays>2){
                    this.props
                    .navigation
                    .dispatch(StackActions.reset({
                        index: 0,
                        actions: [
                        NavigationActions.navigate({
                            routeName: 'Splash'
                        }),
                        ],
                    }))
                    return false;
                }
                console.log(last+"  eto  "+date);
            }
            console.log(date);
        });
    }
    handleBackPress = () => {
        this.goBack(); // works best when the goBack is async
        return true;
    }

    componentWillUnmount(){
        this.backHandler.remove();
    }

    goBack(){
        this.props
            .navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({
                    routeName: 'App',
                    action: NavigationActions.navigate({ 
                        routeName: 'Parametre'
                    })
                }),
                ],
            }))
      }
    render(){
        return(
            <View style={styles.content}>
                
                <Image source={require('../assets/img/green.png')} style={styles.img}/>
                <Text style={styles.span}>
                    Version 1.0.0
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        backgroundColor:COLOR_GREEN
    },
    h1:{
        fontFamily:FONT_BOLD,
        fontWeight:Platform.OS==='ios'?'bold':null,
        fontSize:30,
        color:COLOR_WHITE
    },
    img:{
        marginBottom:20
    },
    span:{
        fontFamily:FONT_REGULAR,
        fontStyle:'italic'
    }
});