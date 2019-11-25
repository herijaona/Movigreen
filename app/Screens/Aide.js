
import React, { Component } from 'react';
import {Button,ListItem } from 'react-native-elements';
import {
    StyleSheet,
    Text,
    View,
    BackHandler,
    Platform,
    Image
  } from "react-native";
import HeaderCut from '../Components/HeaderCut';
import { Container, Header, Content, Icon, Left, Body, Right, Switch } from 'native-base';
import {
  COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,BASE_URL, FONT_BOLD
} from '../Helpers/Helper';
import { getItemLocal } from '../Store/StoreLocal';
import { NavigationActions, StackActions } from 'react-navigation';
import Spinner from 'react-native-spinkit';

export default class Aide extends Component{
    static navigationOptions = {
        header : null
    }
    constructor(props) {
      super(props);
      this.state = {
        name: null,
        mobile: null,
        email:null,
        msg: null,
        isSubmited: false, 
      };
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
    
    componentDidMount() {
      this.expire();
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
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProp "+nextProps);
    }


    render(){
        return(
            <Container style={styles.container}>
                <HeaderCut navigation={this.props.navigation} title="Acceuil" />
                
                <Content>
                  
                <ListItem
                    title='Contacts'
                    titleStyle={styles.title}
                    leftElement={<Image source={require('../assets/img/contact.png')} style={styles.img}/>}
                    onPress={()=>{this.props.navigation.navigate('Contacts')}}
                />
                <ListItem
                    title='FAQ'
                    titleStyle={styles.title}
                    leftElement={<Image source={require('../assets/img/fq.png')} style={styles.img}/>}
                    onPress={()=>{this.props.navigation.navigate('Faq')}}
                />
                </Content>
                
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
    txt:{
      fontFamily:FONT_REGULAR,
      fontSize:18
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