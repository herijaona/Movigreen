import React ,{Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    BackHandler,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {
  DrawerItems,
  NavigationActions, StackActions,
  SafeAreaView
} from 'react-navigation';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,FONT_BOLD,BASE_URL, COLOR_RED
} from '../Helpers/Helper';
import Loader from '../Components/Loader';
import Toast, {DURATION} from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { getItemLocal } from '../Store/StoreLocal';
import {FloatingLabelInput} from '../Components/FloatingLabelInput';
import FlashMessage ,{ showMessage } from "react-native-flash-message";
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert';
import Spinner from 'react-native-spinkit';





export default class Login extends Component {
    static navigationOptions = {
        header : null
    }
    constructor(props){
        super(props);
        this.state = {
            isVisible: false,
            backgroundColor: COLOR_GREEN,
            showPass: true,
            press: false,
            username:'',
            password:'',
            npassword:'',
            cpassword:'',
            mail:'',
            nomUtilisateur:'',
            show:false,
            recovery:false,
            isVisibleSpiner:false,
            idclient:'',
            succes:false
        };
        this.showPass = this.showPass.bind(this);
    }
    componentWillMount() {
      this.expire();
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    handleBackButton = () => {
        this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

        return true;
    };
    _spring() {

        this.setState({backClickCount: 1}, () => {
            this.refs.toast.show('Appuyer de nouveau pour quitter',DURATION.LENGTH_LONG)
            setTimeout(() => {
                    this.setState({backClickCount: 0});
                    
            }, 2000);
            
        });

    }
    _saveLoggedIn = async (key)=>{
        await AsyncStorage.setItem('isLoggedIn',key)
    }
    

    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
    }   

    showPass() {
        this.state.press === false
          ? this.setState({showPass: false, press: true})
          : this.setState({showPass: true, press: false});
    }

    handleAlert(value){
      console.log("eto"+value);
        this.setState({show:value});
    }
    _showMesage(msg,description,type){
      showMessage({
        message: msg,
        description: description,
        type: type,
        icon: type
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
    

    login = () =>{
        this.setState({isVisible: true});
        const {username,password} = this.state;
        if(username==""){
            this._showMesage("Attention",'Pseudo ou adresse email vide',"warning");
            this.setState({isVisible: false});
        }
        else if(password==""){
            this._showMesage("Attention",'Mot de passe vide',"warning");
            this.setState({isVisible: false});
        }
        else{
            fetch(BASE_URL+'login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    username: username,
                    password: password
                }),
            })
            .then((response) => response.json())
                .then((responseJson)=>{
                    console.log(responseJson);
                    if(responseJson.Error == "no"){
                           
                        
                            AsyncStorage.multiSet([
                                ["email", responseJson.Data.email],
                                ["id", responseJson.Data.id],
                                ["nom",' '+responseJson.Data.nom],
                                ["prenom",' '+responseJson.Data.prenom],
                                ["pseudo",responseJson.Data.pseudo],
                                ["phone",responseJson.Data.phone],
                            ],()=>{
                              AsyncStorage.getItem('nom',(err,res)=>{
                                console.log("mety "+res);
                                this._saveLoggedIn('ok');
                                this.props.navigation.navigate(NavigationActions.navigate({
                                    routeName: 'App',
                                    action: NavigationActions.navigate({ 
                                        routeName: 'Reservez'
                                    })
                                }))
                                //this.props.navigation.navigate('App');
                              })
                            });

                            
                    }else{
                        this._showMesage("Attention",responseJson.Msg,"danger");                    }
                    this.setState({isVisible: false});
                })
                .catch((error)=>{
                    console.error(error);
                });
        }
        
        Keyboard.dismiss();
    }

    recovery= () =>{
        this.setState({isVisibleSpiner: true});
        const {mail} = this.state;
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(mail==""){
            this._showMesage("Attention",'Adresse email vide',"warning");
            this.setState({isVisibleSpiner: false});
        }
        else if(regex.test(mail)===false){
            this._showMesage('Attention',"Adresse email invalid","warning");
            this.setState({isVisibleSpiner: false});
        }
        else{
            fetch(BASE_URL+'oublier', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'oublier',
                    mail: mail
                }),
            })
            .then((response) => response.json())
                .then((responseJson)=>{
                    console.log(responseJson);
                    if(responseJson.Error == "no"){
                      this.setState({idclient:responseJson.Data.id},()=>{
                        this.setState({
                          npassword:'',
                          cpassword:'',
                          recovery:true
                        });
                      });
                    }else{
                        this._showMesage("Attention",responseJson.Msg,"danger");                    
                    }
                    this.setState({isVisibleSpiner: false});
                })
                .catch((error)=>{
                    console.log(error);
                    this._showMesage("Attention","Une erreur se produit!!!","danger");  
                    this.setState({isVisibleSpiner: false});
                });
        }
        
        Keyboard.dismiss();
    }
    changeMdp = () =>{
        this.setState({isVisibleSpiner: true});
        const {npassword,cpassword,idclient} = this.state;
        if(npassword=="" || cpassword==""){
            this._showMesage("Attention",'Completez tous les champs vide',"warning");
            this.setState({isVisibleSpiner: false});
        }
        else if(npassword !=cpassword){
            this._showMesage('Attention',"Les deux mot de passe sont differents","warning");
            this.setState({isVisibleSpiner: false});
        }
        else{
            fetch(BASE_URL+'changermdp', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'changermdp',
                    idclient: idclient,
                    password: npassword
                }),
            })
            .then((response) => response.json())
                .then((responseJson)=>{
                    console.log(responseJson);
                    if(responseJson.Error == "no"){
                      this.setState({
                        recovery: false,
                        succes:true,
                        show:false
                      });
                    }else{
                        this._showMesage("Attention",responseJson.Msg,"danger");                    
                    }
                    this.setState({isVisibleSpiner: false});
                })
                .catch((error)=>{
                    console.log(error);
                    this._showMesage("Attention","Une erreur se produit!!!","danger");  
                    this.setState({isVisibleSpiner: false});
                });
        }
        
        Keyboard.dismiss();
    }
    reset= () =>{
      this.setState({
        mail:'',
        npassword:'',
        cpassword:'',
        idclient:'',
        recovery:false
      });
      this.handleAlert(false)
    }
    displayAlertinput(){
      if (this.state.recovery) {
        return(
            <View>
                <FloatingLabelInput
                  attrName = 'npassword'
                  title = 'Nouveau mot de passe'
                  value = {this.state.npassword}
                  type="default"
                  updateMasterState = {this._updateMasterState}
                  secureTextEntry
                />
                <FloatingLabelInput
                  attrName = 'cpassword'
                  title = 'Confirmation mot de passe'
                  value = {this.state.cpassword}
                  type="default"
                  updateMasterState = {this._updateMasterState}
                  secureTextEntry
                />
                <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                    <TouchableOpacity style={[styles.button1,{backgroundColor:COLOR_RED}]}
                      onPress={this.reset}
                    >
                        <Text style={styles.buttonText}>Annulez</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button1,{backgroundColor: this.state.isVisibleSpiner ? '#afafaf' : COLOR_GREEN }]}
                      onPress={
                        this.changeMdp
                      }
                      disabled={this.state.isVisibleSpiner}
                    >
                        
                        { this.state.isVisibleSpiner 
                              ? (
                                  <Spinner 
                                    type = "FadingCircleAlt"
                                    isVisible={true} 
                                    size={25} 
                                    color={COLOR_GREEN}
                                  />
                                ) 
                              : (<Text style={styles.buttonText}>Validez</Text>)
                          }
                    </TouchableOpacity>
                </View>
                 

            </View>
        )
      }else{
          return(
            <View>
                <FloatingLabelInput
                  attrName = 'mail'
                  title = 'Adresse email'
                  value = {this.state.mail}
                  type="email-address"
                  updateMasterState = {this._updateMasterState} 
                />
                <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                    <TouchableOpacity style={[styles.button1,{backgroundColor:COLOR_RED}]}
                      onPress={this.reset}
                    >
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button1,{backgroundColor: this.state.isVisibleSpiner ? '#afafaf' : COLOR_GREEN }]}
                      onPress={
                        this.recovery
                      }
                      disabled={this.state.isVisibleSpiner}
                    >
                          { this.state.isVisibleSpiner 
                              ? (
                                  <Spinner 
                                    type = "FadingCircleAlt"
                                    isVisible={true} 
                                    size={25} 
                                    color={COLOR_GREEN}
                                  />
                                ) 
                              : (<Text style={styles.buttonText}>Verifiez</Text>)
                          }
                        
                    </TouchableOpacity> 
                </View>

            </View>
          );
      }
    }
    render(){
          return(
            
            <View style={styles.container}>
                <View style={styles.blockTop}>
                    <Image
                        source={require('../assets/img/logo.png')}
                        style ={styles.img}
                    />
                    <Text style={styles.texttop}>
                        <Text 
                            style={{color:COLOR_GREEN}} 
                        >
                            Connexion
                        </Text>
                        <Text>  |  </Text>
                        <Text  onPress={() => {this.props.navigation.navigate('Singup')}} >Inscription</Text>
                    </Text>
                </View>
                <View style={styles.blockBottom}>

                    <FloatingLabelInput
                      attrName = 'username'
                      title = 'Adresse email ou Pseudo'
                      value = {this.state.username}
                      type="email-address"
                      updateMasterState = {this._updateMasterState}
                    />
                    <FloatingLabelInput
                      attrName = 'password'
                      title = 'Mot de passe'
                      value = {this.state.password}
                      type="default"
                      updateMasterState = {this._updateMasterState}
                      secureTextEntry
                    />
                    <TouchableOpacity style={styles.button}
                       onPress={this.login}
                    >
                        <Text style={styles.buttonText}>Connexion</Text>
                    </TouchableOpacity> 
                    <Text style={styles.textForget} 
                      onPress={()=>{
                    this.handleAlert(true);}}
                    >Mot de passe oublié?</Text>
                </View>

                {this.state.isVisible ? <Loader style="ChasingDots"/> : null}
                <SCLAlert
                  onRequestClose={()=>{console.log("miala")}}
                  theme="default"
                  show={this.state.show}
                  title="Mot de passe oublié"
                  subtitle={
                        this.state.recovery
                        ? ("Veuillez entrer votre nouveau mot de passe")
                        : ("Veuillez entrer votre adresse email")
                      }

                  children={ this.displayAlertinput()}
                >
                  
                </SCLAlert>
                <SCLAlert
                  onRequestClose={()=>{this.props.navigation.navigate('Login');}}
                  theme="success"
                  show={this.state.succes}
                  title="Félicitations"
                  subtitle="Changement de mot de passe avec succès!!!"
                >
                  <SCLAlertButton theme="success" onPress={()=>{
                    this.setState({succes:false});
                  }
                  }
                  >OK</SCLAlertButton>
                </SCLAlert>
                <FlashMessage position="bottom" />
                <Toast
                        ref="toast"
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                    />
            </View>
        )
    }
}
    
const styles = StyleSheet.create({
    container : {
      flexGrow: 1,
      justifyContent:'center',
      alignItems: 'center',
      fontFamily:FONT_REGULAR
    },
    blockTop:{
        flex:3,
        flexDirection:'row',
        justifyContent:'center',
    },
    blockBottom:{
        flex:7,
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
      width:300,
      backgroundColor: COLOR_GREEN,
      borderRadius: 5,
      marginVertical: 10,
      paddingVertical: 13
    },
    button1: {
      width:120,
      backgroundColor: COLOR_GREEN,
      borderRadius: 5,
      marginVertical: 10,
      paddingVertical: 10,
      alignSelf: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize:20,
      color:COLOR_WHITE,
      textAlign:'center',
      fontFamily:FONT_BOLD
    },
    texttop:{
        fontSize:20,
        fontWeight:Platform.OS==='ios'?'bold':null,
        position:'absolute',
        bottom:10,
        fontFamily:FONT_BOLD
    },
    textForget:{
        marginTop:20,
        alignSelf:'center',
        fontFamily:FONT_REGULAR
    },
    img:{
        top: 30,
    }
});
