import React ,{Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Platform,
    TouchableOpacity ,
    Keyboard,
    ScrollView
} from 'react-native';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR, FONT_BOLD, BASE_URL
} from '../Helpers/Helper';
import Loader from '../Components/Loader';
import FlashMessage ,{ showMessage } from "react-native-flash-message";
import Toast, {DURATION} from 'react-native-easy-toast';
import {FloatingLabelInput} from '../Components/FloatingLabelInput';
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert';

export default class Singup extends Component<{}> {
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
            nom:'',
            prenom:'',
            pseudo:'',
            password:'',
            cpassword:'',
            email:'',
            phone:'',
            show: false
        };
    }

    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
    }
    _showMesage(msg,description,type){
      showMessage({
        message: msg,
        description: description,
        type: type,
        icon: type
      });
    } 
    _signup =()=>{
        
        this.setState({isVisible:true});

        const {
          nom,
          prenom,
          pseudo,
          email,
          password,
          cpassword,
          phone
        } = this.state;
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if(nom=="" || prenom =="" || pseudo =="" || email=="" || password=="" || cpassword =="" || phone =="" ){
            this._showMesage("Attention",'Remplisez tous les champs','warning');
            this.setState({backgroundColor:'red'});
            this.setState({isVisible: false});
        }else  if(regex.test(email)===false){
            this._showMesage('Attention',"Adresse e-mail invalid","danger");
            this.setState({isVisible: false});
        }
        else if(password != cpassword){
            this._showMesage("Attention",'Les mot de passe sont differents','warning');
            this.setState({backgroundColor:'red'});
            this.setState({isVisible: false});
        }else{
          fetch(BASE_URL+'signup',{
              method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'signup',
                    nom: nom,
                    prenom: prenom,
                    pseudo: pseudo,
                    password: password,
                    email: email,
                    phone: phone
                }),
          })
          .then((response)=>response.json())
              .then((responseJson)=>{
                    console.log(responseJson);
                    if(responseJson.Error == "no"){
                        this._showMesage("Succès",responseJson.Msg,"success");
                        this.setState({isVisible: false});
                        this.handleAlert(true);
                        
                    }else{
                        this._showMesage("Attention",responseJson.Msg,"danger");
                        this.setState({isVisible: false});
                    }
                    
              })
              .catch((error)=>{
                    console.log(error);
                    this.setState({isVisible: false});
              });

        }
        Keyboard.dismiss();
    };

    handleAlert(value){
      console.log("eto"+value);
        this.setState({show:value});
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
                        <Text onPress={() => {this.props.navigation.navigate('Login')}} >Connexion</Text>
                        <Text>  |  </Text>
                        <Text 
                            style={{color:COLOR_GREEN}} 
                        >
                            Inscription
                        </Text>
                    </Text>
                </View>
                <View style={styles.blockBottom}>
                  <ScrollView>

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
                      attrName = 'pseudo'
                      title = 'Pseudo'
                      value = {this.state.pseudo}
                      type="email-address"
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
                      attrName = 'phone'
                      title = 'Numéro de téléphone'
                      value = {this.state.phone}
                      type="numeric"
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
                    <FloatingLabelInput
                      attrName = 'cpassword'
                      title = 'Confirmation mot de passe'
                      value = {this.state.cpassword}
                      type="default"
                      updateMasterState = {this._updateMasterState}
                      secureTextEntry
                    />
                    <TouchableOpacity 
                      onPress={this._signup}
                     style={styles.button}>
                    <Text style={styles.buttonText}>Inscription</Text>
                    </TouchableOpacity> 
                
                    
                    
                    </ScrollView>
                </View>
                {this.state.isVisible ? <Loader style="ChasingDots"/> : null}
                <SCLAlert
                  onRequestClose={()=>{this.props.navigation.navigate('Login');}}
                  theme="success"
                  show={this.state.show}
                  title="Félicitations"
                  subtitle="Veuillez consulter votre boîte email pour confirmer votre inscription"
                >
                  <SCLAlertButton theme="success" onPress={()=>{
                    this.handleAlert(false);
                    this.props.navigation.navigate('Login');
                  }
                  }
                  >OK</SCLAlertButton>
                </SCLAlert>
                <FlashMessage position="bottom" />
            </View>
            
        )
      }
}

const styles = StyleSheet.create({
     container : {
      flexGrow: 1,
      justifyContent:'center',
      alignItems: 'center',
      
    },
    blockTop:{
        flex:2,
        flexDirection:'row',
        justifyContent:'center',
    },
    blockBottom:{
        flex:8,
        height: 200,
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
      paddingVertical: 13,
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
    img:{
      marginTop:30
    }

});