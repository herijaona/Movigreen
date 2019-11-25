import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    BackHandler,
    Platform
    
  } from "react-native";
import HeaderCut from '../Components/HeaderCut';
import { Container,  Tab, Tabs } from 'native-base';
import {
  COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,BASE_URL
} from '../Helpers/Helper';
import { NavigationActions, StackActions } from 'react-navigation';
import { getItemLocal } from '../Store/StoreLocal';
import Spinner from 'react-native-spinkit';

export default class Bilan extends Component{
    static navigationOptions = {
        header : null
    }
    constructor(props) {
      super(props);
      this.state = {
          total:0,
          id:0,
          isVisible:false,
          testt:"",
      };
      getItemLocal('id')
      .then(res => {
          this.setState({isVisible:true});
          console.log('id '+res);
          this.setState({id: res},()=>{
            this._getBilan();
          });
      });
      console.log('constructor')
      
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
    testt = (event) =>{
      this.setState({testt:"rzerezr"});
    }

    _getBilan(){
        fetch(BASE_URL+'bilan',{
            method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  action: 'bilan',
                  id: this.state.id,
              }),
        })
        .then((response)=>response.json())
            .then((responseJson)=>{
                console.log(responseJson);
                this.setState({total:responseJson.bilan});
                this.setState({isVisible:false});

            })
            .catch((err)=>{
                console.log(err);
                this.setState({isVisible:false});
            })  
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
                

                <View style={styles.content} >
                  
                    <Text style={styles.texttop}>Votre bilan carbone</Text>

                    <Text style={styles.texttop}>Félicitations! Vous avez émis</Text>

                    <Text style={[
                        styles.texttop,
                        styles.green
                        ]}
                      >
                      { this.state.isVisible 
                        ? (
                            <Spinner 
                              type = "FadingCircleAlt"
                              isVisible={true} 
                              size={20} 
                              color={COLOR_GREEN}
                            />
                          ) 
                        : (this.state.total)
                      } kg de C02
                    </Text>

                    <Text style={styles.texttop}>sur tous vos trajets avec nous</Text>

                    <Text style={styles.textto}>
                        Avec une voiture à moteur thermique équivalente (diesel) vous auriez émis 5x plus.
                    </Text>

                    <Text style={[
                        styles.green,
                        styles.textto  
                      ]}
                        onPress={this.testt}
                      >
                      La planète et nous, vous remercions.
                      
                    </Text>

                </View>
                
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

  });