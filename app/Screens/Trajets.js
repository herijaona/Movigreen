import React, { Component } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Linking,
    Text,
    View,
    TouchableOpacity,
    Platform,
    BackHandler
  } from "react-native";
import HeaderCut from '../Components/HeaderCut';
import { Container,  Tab, Tabs } from 'native-base';
import {
  COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,FONT_BOLD
} from '../Helpers/Helper';
import { NavigationActions, StackActions } from 'react-navigation';
import Ancien from '../Components/Ancien';
import { getItemLocal } from '../Store/StoreLocal';
import Prochain from '../Components/Prochain';

export default class Trajets extends Component{
    static navigationOptions = {
        header : null
    }
    componentDidMount() {
      this.expire();
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.goBack(); // works best when the goBack is async
        return true;
      });
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
    render(){
        return(
            <Container style={styles.container}>
                <HeaderCut navigation={this.props.navigation} title="Bilan" />
                <Tabs tabStyle={{backgroundColor:"red"}}>
                  <Tab heading="Anciens trajets" tabStyle={{backgroundColor: COLOR_GREEN }} textStyle={{color: COLOR_WHITE,fontFamily:FONT_REGULAR}} activeTabStyle={{backgroundColor:COLOR_WHITE}} activeTextStyle={{color: COLOR_GREEN, fontFamily:FONT_BOLD}} >
                    <Ancien />
                  </Tab>
                  <Tab heading="Prochains trajets" tabStyle={{backgroundColor: COLOR_GREEN}} textStyle={{color:  COLOR_WHITE,fontFamily:FONT_REGULAR}} activeTabStyle={{backgroundColor:  COLOR_WHITE}} activeTextStyle={{color:COLOR_GREEN, fontFamily:FONT_BOLD}}>
                    <Prochain />
                  </Tab>
                </Tabs>
                
            </Container>
        ) 
    }
}
const styles = StyleSheet.create({

  container: {
    marginTop:Platform.OS === 'ios' ? 0 : -25,
  },
});