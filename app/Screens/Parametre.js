import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    BackHandler
  } from "react-native";
import HeaderCut from '../Components/HeaderCut';
import { Container,  Tab, Tabs } from 'native-base';
import {
  COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,BASE_URL, FONT_BOLD
} from '../Helpers/Helper';
import {Button,ListItem } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
import Spinner from 'react-native-spinkit';

import SettingsList from 'react-native-settings-list';

export default class Parametre extends Component{
    static navigationOptions = {
        header : null
    }
    constructor(props) {
      super(props);
      this.state = {
        check: false,
        switch: false,
        value: 40
      }
    }
    
    componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.goBack(); // works best when the goBack is async
        return true;
      });
    }

    componentWillUnmount() {
      this.backHandler.remove();
    }
    handleBackPress = () => {
      this.goBack(); // works best when the goBack is async
      return true;
    }
    goBack(){
      this.props
          .navigation
          .dispatch(StackActions.reset({
              index: 0,
              actions: [
              NavigationActions.navigate({
                  routeName: 'App'
              }),
              ],
          }))
    }

    componentDidCatch(){
        console.log("componentDidCatch");
    }
    componentDidUpdate(){
        console.log("componentDidUpdate");
    }

    componentWillUnmount(){
        console.log("componentWillUnmount");
    }
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProp "+nextProps);
    }
    componentWillUpdate(){
        console.log("componentWillUpdate");
    }

    render(){
        return(
            <Container style={styles.container}>
                <HeaderCut navigation={this.props.navigation} title="Acceuil" />
                
                <ListItem
                    title='À propos'
                    titleStyle={styles.title}
                    leftElement={<Image source={require('../assets/img/prop.png')} style={styles.img}/>}
                    onPress={()=>{this.props.navigation.navigate('Apropos')}}
                    bottomDivider

                />
                <ListItem
                    title='Modifier vos informations'
                    titleStyle={styles.title}
                    leftElement={<Image source={require('../assets/img/edit.png')} style={styles.img}/>}
                    onPress={()=>{this.props.navigation.navigate('Modifier')}}
                    bottomDivider
                />
            
            </Container>
        ) 
    }
}
const styles = StyleSheet.create({

    container: {
      marginTop:Platform.OS === 'ios' ? 0 : -25,
    },
    content: {
      flex: 10,
      justifyContent:'space-between',
      flexDirection:'column',
      padding:50,
      alignItems:  'center',
      textAlign: 'center'
    },
    textStyle: {
      textAlign: "center"
    },
    buttonCenter: {
        width:200,
        backgroundColor: COLOR_GREEN,
        borderRadius: 5,
        paddingVertical: 10,
        alignSelf:'center',
        margin:20,
    },
    buttonText: {
        fontSize:20,
        fontWeight:'bold',
        color:COLOR_WHITE,
        textAlign:'center',
        fontFamily:FONT_REGULAR
    },
    texttop:{
      alignSelf:'center',
      textAlign: 'center',
      fontSize:22,
      color:COLOR_BLACK,
      fontFamily:FONT_REGULAR
    },
    textto:{
      alignSelf:'center',
      fontSize:15,
      fontStyle: 'italic', 
      fontFamily:FONT_REGULAR,
      textAlign: 'center',
    },
    green:{
        color:COLOR_GREEN
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
  });