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
    Image
  } from "react-native";
import { Container,  Tab, Tabs } from 'native-base';
import {
  COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,FONT_BOLD
} from '../Helpers/Helper';
import Autolink from 'react-native-autolink';
import { NavigationActions, StackActions } from 'react-navigation';
import { getItemLocal } from '../Store/StoreLocal';

export default class Confirmation extends Component{
	constructor(props){
        super(props);
        this.state={
            chauffeur:"",
            email:"",
            numero:"",
            voiture:"",
            telephone:"",
            nomUtilisateur:""
        }
        getItemLocal('nom')
        .then(res => {
            console.log('nom '+res);
            this.setState({nomUtilisateur: res});
        });
    }
    
    
    componentWillMount(){
        console.log("mounting");
        this.props.navigation.addListener(
            "willFocus",
            () => {
                const chauffeur = this.props.navigation.getParam("chauffeur");
                this.setState({chauffeur:chauffeur})
                const email = this.props.navigation.getParam("email");
                this.setState({email:email})
                const numero = this.props.navigation.getParam("numero");
                this.setState({numero:numero})
                const voiture = this.props.navigation.getParam("voiture");
                this.setState({voiture:voiture})
                const telephone = this.props.navigation.getParam("telephone");
                this.setState({telephone:telephone})
            }
        );
      
    }
    static navigationOptions = {
        title: 'Confirmation',
        headerStyle: { backgroundColor: COLOR_GREEN },
        headerTintColor: COLOR_WHITE,
        headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
        headerLeft: null,
    };
    render(){
        return(
            <Container style={styles.container}>
                
                <View style={styles.content} >
                  
                    <Text style={styles.texttop}>Confirmation</Text>

                    <Image
                        source={require('../assets/img/cart.png')}
                        style ={styles.img}
                    />
                    <Text style={[
                        styles.texttop,
                        {fontFamily:FONT_BOLD}
                        ]}
                      >
                      Merci
                    </Text>

                    <Text style={styles.texttop}>Trajet confirmé, à bientôt à bord!</Text>

                    <View style={{flex:1,	flexDirection:'row',}}>
                        <View style={{flex: 1, flexDirection:'column'}}>
                            <View style={{flex: 1, borderWidth:1,justifyContent: 'center',}}>
                                <Text style={styles.textt}>Votre chauffeur </Text>
                            </View>
                            <View style={{flex: 2, borderWidth:1, flexDirection: 'column',justifyContent: 'center',}}>
                                <Text style={styles.textt}>{this.state.chauffeur}</Text>
                                <Text style={styles.textt}>{this.state.telephone}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection:'column'}}>
                            <View style={{flex: 1,borderWidth:1, justifyContent: 'center',}} >
                                <Text style={[styles.textt]}>Votre voiture</Text>
                            </View>
                            <View style={{flex: 2, borderWidth:1, flexDirection: 'column',justifyContent: 'center',}}>
                                <Text style={[styles.textt]}> {this.state.voiture} </Text>
                                <Text style={styles.textt}>{this.state.numero}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <Text style={[
                        styles.textto,{fontSize:14}
                      ]}
                      >
                      Un e-mail de confirmation a été envoyé à {this.state.email} {"\n"} Des questions ? Contactez-nous à {"\n"}
                      <Autolink
                      text=" contact@moovingreen.com"
                       />
                    </Text>
                    <TouchableOpacity 
                    onPress={() => {
                        this.props
                                .navigation
                                .dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                    NavigationActions.navigate({
                                        routeName: 'App',
                                        params:{
                                            nomUtilisateur:this.state.nomUtilisateur
                                        }
                                    }),
                                    ],
                                }))}
                            }
    		            style={[styles.button]} >
    		                <Text style={styles.buttonText}>Revenir au menu principal</Text>
    		        </TouchableOpacity> 

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
      paddingHorizontal:10,
      paddingVertical: 50,
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
      fontFamily:FONT_REGULAR,
      marginBottom: 10,
    },
    textto:{
      alignSelf:'center',
      fontSize:15,
      fontStyle: 'italic', 
      fontFamily:FONT_REGULAR,
      textAlign: 'center',
      marginVertical: 20,
    },
    green:{
        color:COLOR_GREEN
    },
	  button: {
        marginTop:10,
        width:300,
        borderRadius: 5,
        marginVertical: 10,
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
    textt:{
    	alignSelf: 'center',
    	textAlign: 'center',
    }
  });