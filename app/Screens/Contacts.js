import React, { Component } from 'react';
import {Button,ListItem } from 'react-native-elements';
import {
    StyleSheet,
    Text,
    View,
    BackHandler,
    Platform,
    Linking,
    Image
  } from "react-native";
import { Container, Header, Content, Left, Body, Right, Switch } from 'native-base';
import Autolink from 'react-native-autolink';
import { COLOR_GREEN,COLOR_WHITE,FONT_REGULAR, FONT_BOLD } from '../Helpers/Helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Contacts extends Component{
    constructor(props){
        super(props)
    }
    static navigationOptions = {
        title: 'Contacts',
        headerStyle: { backgroundColor:COLOR_GREEN },
        headerTintColor: COLOR_WHITE,
        headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
        
    };
    UNSAFE_componentWillMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            this.goBack();
            return true;
        })
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
                        routeName: 'Aide'
                    })
                }),
                ],
            }))
      }



    render () {
        return (
            <View>
                <ListItem
                    title='Pour toutes questions ou aides supplémentaires vous pouvez nous contacter via:'
                    titleStyle={{fontFamily:FONT_REGULAR,}}
                    bottomDivider
                />
                <ListItem
                    title='Téléphone :'
                    subtitle={
                        <Text
                        style={{fontFamily:FONT_REGULAR}}
                         onPress={()=>{
                            Platform.OS ==='android' ? Linking.openURL('tel:0184606035') : Linking.openURL('telprompt:0184606035');
                            }}>01 84 60 60 35</Text>
                    }
                    titleStyle={styles.title}
                    leftElement={<Image source={require('../assets/img/call.png')} style={styles.img}/>}
                    bottomDivider
                />
                <ListItem
                    title={
                        <View>
                            <Text style={styles.title}>Pour des informations :</Text>
                            <Text>
                                <Autolink
                                style={{fontFamily:FONT_REGULAR}}
                                text="contacts@moovingreen.fr"
                                />
                            </Text>
                            <Text style={styles.title}>Pour la facturation :</Text>
                            <Text>
                                <Autolink
                                style={{fontFamily:FONT_REGULAR}}
                                text="comptabilite@moovingreen.fr"
                                />
                            </Text>

                        </View>
                    }
                    leftElement={<Image source={require('../assets/img/at-sign.png')} style={styles.img}/>}
                    bottomDivider
                />
                <ListItem
                    title={
                        <View>
                            <Text style={styles.title}>Courrier :</Text>
                            <Text style={{fontFamily:FONT_REGULAR}}>42 rue des ponts</Text>
                            <Text style={{fontFamily:FONT_REGULAR}}>78290 Croissy-sur-Seine</Text>

                        </View>
                    }
                    leftElement={<Image source={require('../assets/img/mail.png')} style={styles.img}/>}
                    bottomDivider
                />
                
            </View>
          
        )
    }
   
      
}
 styles = StyleSheet.create({
        subtitleView: {
          flexDirection: 'row',
          paddingLeft: 10,
          paddingTop: 5
        },
        img: {
          resizeMode:'contain',
          width:35,
          height:35
        },
        title:{
            fontFamily:FONT_BOLD,
            fontWeight:Platform.OS==='ios'?'bold':null,
            fontSize:15
        }
      })