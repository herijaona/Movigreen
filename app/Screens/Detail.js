import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity,
    Platform,
    ScrollView
  } from "react-native";
import { Container, Content } from 'native-base';
import Loader from '../Components/Loader';
import NetInfo from "@react-native-community/netinfo";
import {
  COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,FONT_BOLD,BASE_URL, COLOR_RED
} from '../Helpers/Helper';
import Toast, {DURATION} from 'react-native-easy-toast';
import { getItemLocal } from '../Store/StoreLocal';
import FlashMessage ,{ showMessage } from "react-native-flash-message";
import { NavigationActions, StackActions } from 'react-navigation';
import {FloatingLabelInput} from '../Components/FloatingLabelInput';

export default class Detail extends Component{

    static navigationOptions = {
      title: 'Détails de votre trajet',
      headerStyle: { backgroundColor: COLOR_GREEN },
      headerTintColor: COLOR_WHITE,
      headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
      headerLeft: null,
    };

    constructor(props){
      super(props);
      this.state = {
          isVisible: false,
          backgroundColor: COLOR_GREEN,
          showPass: true,
          press: false,
          nomUtilisateur:'',
          reservation_id:' ',
          nom:' ',
          prenom:' ',
          email:' ',
          phone:' ',
          num_vol:'',
          description:'',
          enable:true,
      };
      getItemLocal('nom')
        .then(res => {
            this.setState({nom: res});
        });
      getItemLocal('email')
        .then(res => {
            this.setState({email: res});
        });
      getItemLocal('prenom')
        .then(res => {
            this.setState({prenom: res});
        });
      getItemLocal('phone')
        .then(res => {
            this.setState({phone: res});
        });

    }
    

    componentWillMount(){
        console.log("mounting");
        this.props.navigation.addListener(
            "willFocus",
            () => {
                console.debug("willFocus");
                const reservation_id = this.props.navigation.getParam("reservation_id");
                this.setState({reservation_id:reservation_id})
                console.log('eto ny res '+reservation_id);
            }
        );
        
      
    }
    _saveDetail= () => {

      NetInfo.isConnected.fetch().then( isConnected => {

        if(isConnected){
          
          const {
            nom,
            prenom,
            email,
            num_vol,
            phone,
            description,
            reservation_id
          } = this.state;

          const data = JSON.stringify({
            action: 'detail',
            nom : nom,
            prenom : prenom,
            email : email,
            num_vol : num_vol,
            phone : phone,
            description : description,
            reservation_id : reservation_id
          })
          let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
          if(regex.test(email)===false){
            this._showMesage('Attention',"Adresse e-mail invalid","danger");
          }else{
            this.setState({isVisible:true});
            fetch(BASE_URL+'detail',{
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body:data,
            })
            .then((res) => res.json())
              .then((resJson)=>{
                console.log(resJson);
                if(resJson.Error=="no"){
                  this.props
                      .navigation
                      .dispatch(StackActions.reset({
                          index: 0,
                          actions: [
                          NavigationActions.navigate({
                              routeName: 'Paiement',
                              params:{reservation_id: this.state.reservation_id,}
                          }),
                          ],
                      }));
                  
                }else{
                  this._showMesage('Attention',"Il y a des erreur au serveur","danger")
                }
                this.setState({isVisible:false});
              })
              .catch((err)=>{
                console.log(err);
                this.setState({isVisible:false});
                this._showMesage('Attention',"Il y a des erreur au serveur","danger")
              });
          }
            

        }else{
          this._showMesage('Attention',"Aucun Connexion internet","danger");
        }
      })
      
    }
    _showMesage(msg,description,type){
      showMessage({
        message: msg,
        description: description,
        type: type,
        icon: type
      });
    }
    quite = ()=>{
      this.props
      .navigation
      .dispatch(StackActions.reset({
          index: 0,
          actions: [
          NavigationActions.navigate({
              routeName: 'App',
              action: NavigationActions.navigate({ 
                routeName: 'Reservez'
            })
          }),
          ],
      }));
    }
    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value },()=>{
          if(this.state.nom =="" || this.state.prenom =="" || this.state.phone =="" || this.state.email==""){
            this.setState({enable:false})
          }else{
            this.setState({enable:true})
          }
        });
    }
   

    render(){
        return(
            <Container style={styles.container}>
               
                <ScrollView>
                    <View style={styles.content} >
                        <Text style={styles.texttop}>Détails de votre trajet</Text>

                        <View style={styles.blockBottom}>

                            <FloatingLabelInput
                              attrName = 'nom'
                              title = 'Nom'
                              value = {this.state.nom}
                              type="default"
                              updateMasterState = {this._updateMasterState}

                            />
                            <FloatingLabelInput
                              attrName = 'prenom'
                              title = 'Prénom'
                              value = {this.state.prenom}
                              type="default"
                              updateMasterState = {this._updateMasterState}

                            />
                            <FloatingLabelInput
                              attrName = 'phone'
                              title = 'Numéro de téléphone'
                              value = {this.state.phone}
                              type="numeric"
                              updateMasterState = {this._updateMasterState}

                            />
                            <FloatingLabelInput
                              attrName = 'email'
                              title = 'Adresse e-mail'
                              value = {this.state.email}
                              type="email-address"
                              updateMasterState = {this._updateMasterState}

                            />
                            <FloatingLabelInput
                              attrName = 'num_vol'
                              title = 'Numéro de vol'
                              value = {this.state.num_vol}
                              type="email-address"
                              updateMasterState = {this._updateMasterState}

                            />
                            <FloatingLabelInput
                              attrName = 'description'
                              title = 'Détail spécifiques ...'
                              value = {this.state.description}
                              type="default"
                              updateMasterState = {this._updateMasterState}
                              multiline={true}
                              numberOfLines={3}
                              textAlignVertical = "top"
                            />
                            
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                          <TouchableOpacity 
                            onPress={this.quite}
                            style={[styles.button, {backgroundColor:COLOR_RED}]}
                            >
                                <Text style={styles.buttonText}>Annulez</Text>
                          </TouchableOpacity> 
                          <TouchableOpacity style={[styles.button,{backgroundColor: !this.state.enable ? '#afafaf' : COLOR_GREEN }]}
                            onPress={this._saveDetail}
                            disabled={!this.state.enable}
                            >
                            <Text style={styles.buttonText}>Paiement</Text>
                            </TouchableOpacity> 
                        </View>
                            

                    </View>
                </ScrollView>
                {this.state.isVisible ? <Loader style="ChasingDots"/> : null}
                <FlashMessage position="bottom" />
                <Toast
                    ref="toast"
                    style={{backgroundColor:this.state.backgroundColor}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:COLOR_WHITE}}
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
      justifyContent:'center',
      flexDirection:'column',
      alignItems: 'center',
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
        fontSize:18,
        fontWeight:'bold',
        color:COLOR_WHITE,
        textAlign:'center',
        fontFamily:FONT_REGULAR
    },
    texttop:{
      marginBottom:30,
      top:10,
      alignSelf:'center',
      fontSize:18,
      color:COLOR_BLACK,
      fontFamily:FONT_REGULAR
    },
    inputBox: {
      width:300,
      backgroundColor:'rgba(255, 255,255,0.2)',
      borderRadius: 1,
      paddingHorizontal:16,
      fontSize:16,
      marginVertical: 5,
      borderColor:COLOR_BLACK,
      borderWidth: 1,
      fontFamily:FONT_REGULAR
    },
    button: {
        marginTop:60,
        width:'40%',
        borderRadius: 5,
        margin: 10,
        paddingVertical: 13,
        alignSelf:'center',
        backgroundColor: COLOR_GREEN
    },
    buttonText: {
      fontSize:20,
      color:COLOR_WHITE,
      textAlign:'center',
      fontFamily:FONT_BOLD
    },
  });