import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Platform,
    Keyboard,
} from 'react-native';
import {Button } from 'react-native-elements';
import {
    CreditCardInput,
    LiteCreditCardInput
} from 'react-native-credit-card-input';
import {
    COLOR_GREEN,
    COLOR_WHITE,
    COLOR_BLACK,
    FONT_REGULAR,
    FONT_BOLD,
    STRIPE_KEY,
    BASE_URL,
    COLOR_RED
  } from '../Helpers/Helper';
import NetInfo from "@react-native-community/netinfo";
import Stripe from 'react-native-stripe-api';
import Toast, {DURATION} from 'react-native-easy-toast';
import Loader from '../Components/Loader';
import FlashMessage,{ showMessage } from 'react-native-flash-message';
import { NavigationActions, StackActions } from 'react-navigation';
import Modal from 'react-native-modal';
import {EventEmitter} from 'events';
import ListCarte from '../Components/ListCarte';
import { searchArr } from '../Helpers/Functions';
import AsyncStorage from '@react-native-community/async-storage';
import { getItemLocal } from '../Store/StoreLocal';

export default class Paiement extends Component<Props>{

    constructor(props: Props){
        super(props);
        this.state={
          isVisible: false,
          disabled : true,
          token:'',
          backgroundColor: COLOR_GREEN,
          connection_Status:'',
          reservation_id:'',
          visibleModalId: null,
          carte:[],
          disabled:true,
          newCarte:{},
          cartes:[],
          newCarte1:{}
        }
        this.event = new EventEmitter();
    }

    static navigationOptions = {
        title: 'Paiement',
        headerStyle: { backgroundColor: COLOR_GREEN },
        headerTintColor: COLOR_WHITE,
        headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
        headerLeft: null,
    };

    componentWillMount(){
      this.initListCarte();
      this.event.addListener('onAddCard',()=>this.initListCarte());
      this.event.addListener('onDeleteCard',()=>this.initListCarte());
      this.props.navigation.addListener(
          "willFocus",
          () => {
              const reservation_id = this.props.navigation.getParam("reservation_id");
              this.setState({reservation_id:reservation_id})
          }
      );
      
    }
    

    initListCarte = () =>{
      getItemLocal('cartes')
      .then(res => {
        if(res)
          this.setState({cartes: JSON.parse(res)});
      });
      
    }
    _onChange = (formData) => {

        if(formData.valid==true){

            const data = formData.values;
            const exp = data.expiry.split("/");
            console.log(data.number.replace(/\s/g,'')+' '+exp[0]+' '+exp[1]+' '+data.cvc+' '+data.postalCode);
            
            NetInfo.isConnected.fetch().then( isConnected => {
                if(isConnected == true){
                  this._createToken(data.number.replace(/\s/g,''),exp[0],exp[1],data.cvc,data.postalCode);
                  this.setState({
                    newCarte1:[{
                      number:data.number.replace(/\s/g,''),
                      mm:exp[0],
                      yy:exp[1],
                      cvc:data.cvc
                    }]
                  })
                }else{
                  this.setState({backgroundColor:'red'});
                  this.refs.toast.show("Aucun connexion internet",1000);
                }
            });
            Keyboard.dismiss();
            
        } else {
            this.setState({ disabled : true })
        }
        // console.log(formData);
    }
    _onChangeAdd = (formData)=>{
      if(formData.valid == true){
            this.setState({disabled:false});
            const data = formData.values;
            const exp = data.expiry.split("/");
            console.log(data.number.replace(/\s/g,'')+' '+exp[0]+' '+exp[1]+' '+data.cvc);
            this.setState({
              newCarte:[{
                number:data.number.replace(/\s/g,''),
                mm:exp[0],
                yy:exp[1],
                cvc:data.cvc
              }]
            })
      }else{
        this.setState({disabled:true});
      }
    }
    _onFocus = (field) => console.log("focusing", field);

    payement =  () => {
        this.setState({isVisible: true});
        fetch(BASE_URL+'payement', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              action: 'payement',
              token: this.state.token,
              reservation_id:this.state.reservation_id,
          })

        }).then((response) => response.json())
            .then((responseJson)=>{

                console.log(responseJson);
                if(responseJson.Error == "no"){
                  const a = this.state.cartes;
                  const b = this.state.newCarte1;
                  console.log(a.length);
                  if(b && b.length>0 && a.length<2){
                    if(!searchArr(b[0]['number'],a)){
                      const result = a.concat(b);
                      this.setState({cartes:result});
                      AsyncStorage.setItem('cartes',JSON.stringify(result));
                      
                    }
                  }
                      
                  this.props
                      .navigation
                      .dispatch(StackActions.reset({
                          index: 0,
                          actions: [
                          NavigationActions.navigate({
                              routeName: 'Confirmation',
                              params:{
                                email: responseJson.Data.email,
                                numero: responseJson.Data.numero,
                                voiture: responseJson.Data.voiture,
                                chauffeur: responseJson.Data.chauffeur,
                                telephone: responseJson.Data.telephone,
                              }
                          }),
                          ],
                      }));
                }else{
                  showMessage({
                    message: "Erreur",
                    description: "Il y a un erreur avec votre carte de credit",
                    type: "danger",
                    icon: "danger"
                  });
                }
                this.setState({isVisible: false});
            })
            .catch((error)=>{

              console.log(error);
              showMessage({
                message: "Erreur",
                description: "Il y a un erreur avec votre carte de credit",
                type: "danger",
                icon: "danger"
              });
              this.setState({ isVisible: false});
              this.setState({ disabled : true })
            });
    
        // console.log(token);
    }

    _createToken = (nbCard,ex_m,ex_y,cvc,zip) =>{
        Keyboard.dismiss();
        this.setState({isVisible: true});
        const  client  =  new Stripe(STRIPE_KEY);
        
        client.createToken({
            number: nbCard,
            exp_month: ex_m, 
            exp_year: ex_y, 
            cvc: cvc,
            address_zip: zip
        })
        .then((resp)=>{
          console.log(resp);
            if(resp.error){
              this.setState({backgroundColor:'red'});
              showMessage({
                message: "Erreur",
                description: resp.error.message,
                type: "danger",
                icon: "danger"
              });
            }else{
              this.setState({
                token:resp.id,
              },()=>{
                this.setState({ disabled : false })
              });
              
            }
            this.setState({isVisible: false});
        })
        .catch((err)=>{
            showMessage({
              message: "Erreur",
              description: "Il y a un erreur sur la carte",
              type: "danger",
              icon: "danger"
            });
            this.setState({isVisible: false});
            console.log(err);
        });
    }

    AddCard = async ()=>{
        const a = this.state.cartes;
        const b =this.state.newCarte;
        if(!searchArr(this.state.newCarte[0]['number'],a)){
          const result = a.concat(b);
          this.setState({cartes:result});
          await AsyncStorage.setItem('cartes',JSON.stringify(result));
          console.log(result);
          this.setState({ visibleModal: null,disabled:true })
        }else{
          showMessage({
            message: "Erreur",
            description: "Ce numéro de carte existe déjà",
            type: "warning",
            icon: "warning"
          });
        }

    }
    callOther = (n,m,y,c)=>{
      console.log(n+' '+m+' '+y+' '+c);
      this._createToken(n,m,y,c,'');
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
    renderModalContent = () => (
      <View style={s.content}>
        
        <LiteCreditCardInput
            autoFocus
            inputStyle={s.input}
            validColor={COLOR_GREEN}
            invalidColor={"red"}
            placeholderColor={"darkgray"}

            onFocus={this._onFocus}
            onChange={this._onChangeAdd} />
        <View style={{flexDirection:'row-reverse'}}>
            <Button
              color={COLOR_GREEN}
              title='Ajouter'
              type="clear"
              titleStyle={{color:COLOR_GREEN,fontFamily:FONT_REGULAR}}
              disabled={this.state.disabled}
              onPress={() => this.AddCard()}
            />
            <Button
              onPress={() => this.setState({ visibleModal: null,disabled:true })}
              title="Fermer"
              type="clear"
              titleStyle={{color:COLOR_RED,fontFamily:FONT_REGULAR}}
            />      
        </View>
        
      </View>
    );
    render() {
    let text = null;
      
    if (this.state.cartes && this.state.cartes.length>0) {
      text =  <View style={s.blocktop}>
                <Text style={s.textTop}>Vos cartes</Text>
                <ListCarte carte={this.state.cartes} onPress={this.callOther} event={this.event}/>
                
                <Button
                  onPress={() => this.setState({ visibleModal: 'bottom',disabled:true })}
                  title="Ajouter d'autre carte"
                  type="clear"
                  titleStyle={{color:COLOR_GREEN,fontFamily:FONT_REGULAR,opacity:this.state.cartes.length == 2 ? 0 : 1}}
                />
              </View>
    }
    return (
      <View style={{flex:1,justifyContent:'center'}}>
            <ScrollView>
            {text}
            <View style={[s.blockBottom,{borderBottomWidth:this.state.cartes.length>0 ? 1 : 0}]}>

              <Text style={[s.textTop,{opacity:this.state.cartes.length>0 ? 1 : 0,alignSelf:'center'}]}>Autre carte</Text>
              <CreditCardInput
                style={s.container}
                autoFocus
                requiresCVC
                requiresPostalCode
                labelStyle={s.label}
                inputStyle={s.input}
                validColor={COLOR_GREEN}
                invalidColor={"red"}
                placeholderColor={"darkgray"}

                onFocus={this._onFocus}
                onChange={this._onChange} />
              
              
              
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                <TouchableOpacity 
                  onPress={this.quite}
                  style={[s.button,{backgroundColor:COLOR_RED} ]}
                  >
                      <Text style={s.buttonText}>Annulez</Text>
                </TouchableOpacity> 
                <TouchableOpacity 
                onPress={this.payement}
                style={[s.button,{backgroundColor: this.state.disabled ? '#afafaf' : COLOR_GREEN }]} 
                disabled={this.state.disabled}
                >
                    <Text style={s.buttonText}>Confirmez</Text>
                </TouchableOpacity> 
            </View>
            
            
            </ScrollView>
            {this.state.isVisible ? <Loader style="ThreeBounce"/> : null}
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
            <FlashMessage position="bottom" />
            <Modal
              isVisible={this.state.visibleModal === 'bottom'}
              animationInTiming={1000}
              animationOutTiming={1000}
              backdropTransitionInTiming={800}
              backdropTransitionOutTiming={800}
            >
              {this.renderModalContent()}
            </Modal>
      </View>
    );
  }

}
const s = StyleSheet.create({

    container: {
      marginTop:Platform.OS === 'ios' ? 0 : -25,
    },
    label: {
      color: "black",
      fontSize: 12,
    },
    input: {
      fontSize: 16,
      color: "black",
    },
    button: {
        marginTop:20,
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
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    content: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
      fontSize: 20,
      marginBottom: 12,
    },
    blocktop:{
      flex:1,
      justifyContent:'space-between',
      borderBottomWidth:1,
      marginTop:10,
      marginBottom:12,
      borderColor:'#afafaf',
      alignItems:'center'
    },
    blockBottom:{
      paddingBottom:20,
      borderColor:'#afafaf',
    },
    textTop:{
      marginBottom:10,
      fontSize:15,
      fontFamily:FONT_REGULAR,
      fontWeight:'bold'
    }
  
  });