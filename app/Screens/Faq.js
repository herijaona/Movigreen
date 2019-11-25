import React, { Component } from 'react'
import { View,Text,StyleSheet,Platform,Linking, BackHandler,ScrollView} from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from "accordion-collapse-react-native";
import { COLOR_GREEN,COLOR_WHITE,FONT_REGULAR, FONT_BOLD, URL_FORGOT } from '../Helpers/Helper';
import { getItemLocal } from '../Store/StoreLocal';
import Autolink from 'react-native-autolink';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Faq extends Component{
    static navigationOptions = {
        title: 'FAQ',
        headerStyle: { backgroundColor:COLOR_GREEN },
        headerTintColor: COLOR_WHITE,
        headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
        
    };
    UNSAFE_componentWillMount(){
        this.expire();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            this.goBack();
            return true;
        })
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
    render(){
        return(
                <View>
                    <ScrollView>
                    <Collapse style={{borderBottomWidth:0.7}}>
                        <CollapseHeader style={{flexDirection:'row',padding:20}}>
                                <Text style={styles.head}>Je ne parviens pas à commander une course : </Text>                       
                        </CollapseHeader>
                        <CollapseBody style={{padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row',borderTopWidth:0.4}}>
                            <View>
                                <Text style={styles.text}>Si vous ne parvenez pas à commander une course, c'est peut-être parce que : </Text>
                                <Text style={[styles.liste,styles.text] }>
                                    - Il n'y a aucun chauffeur disponible pour le moment. Veuillez patienter et réessayez de commander.
                                </Text>
                                <Text style={[styles.liste,styles.text] }>
                                    - Vous n'avez pas confirmé votre adresse e-mail ou votre numéro de téléphone. Vérifiez que vous avez reçu les messages de confirmation de notre part.
                                </Text>
                            </View>
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{borderBottomWidth:0.7}}>
                        <CollapseHeader style={{flexDirection:'row',padding:20}}>
                                <Text style={styles.head}>J'ai oublié mon mot de passe :</Text>                       
                        </CollapseHeader>
                        <CollapseBody style={{padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row',borderTopWidth:0.4}}>
                            <View>
                                <Text style={styles.text}>Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur le lien ci-dessous. Vous devrez saisir l'adresse e-mail ou le numéro de téléphone mobile associé à votre compte.</Text>
                                <Text style={[styles.liste,styles.text,styles.lien] } 
                                    onPress={
                                        ()=>{
                                            Linking.openURL(URL_FORGOT)
                                        }
                                    }
                                >
                                    J'ai oublié mon mot de passe 
                                </Text>
                            </View>
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{borderBottomWidth:0.7}}>
                        <CollapseHeader style={{flexDirection:'row',padding:20}}>
                                <Text style={styles.head}>Le lien de réinitialisation du mot de passe n'est pas bon :</Text>                       
                        </CollapseHeader>
                        <CollapseBody style={{padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row',borderTopWidth:0.4}}>
                            <View>
                                <Text style={styles.text}>Assurez-vous d'avoir renseigner le bon e-mail, sinon vous pouvez nous contacter par mail à <Autolink
                                style={[styles.lien,{fontFamily:FONT_REGULAR}]}
                                text="contacts@moovingreen.fr"
                                /></Text>
                                
                            </View>
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{borderBottomWidth:0.7}}>
                        <CollapseHeader style={{flexDirection:'row',padding:20}}>
                                <Text style={styles.head}>Pourquoi mon paiement a-t-il été refusé? </Text>                       
                        </CollapseHeader>
                        <CollapseBody style={{padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row',borderTopWidth:0.4}}>
                            <View>
                                <Text style={styles.text}>Mettez à jour votre moyen de paiement ou ajoutez-en un nouveau, sinon c'est peut-être car : </Text>
                                <Text style={[styles.liste,styles.text] }>
                                    - Le numéro de carte saisi n'est pas le bon
                                </Text>
                                <Text style={[styles.liste,styles.text] }>
                                    - La carte de credit ou de débit a expiré
                                </Text>
                                <Text style={[styles.liste,styles.text] }>
                                    - Le compte n'est pas suffisamment approvisionné
                                </Text>
                            </View>
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{borderBottomWidth:0.7}}>
                        <CollapseHeader style={{flexDirection:'row',padding:20}}>
                                <Text style={styles.head}>Comment mettre mes informations personnelles à jour ?  </Text>                       
                        </CollapseHeader>
                        <CollapseBody style={{padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row',borderTopWidth:0.4}}>
                            <View>
                                <Text style={[styles.text] }>
                                    Pour mettre à jour, votre adresse e-mail, votre numéro de téléphone ou votre mot de passe, il vous suffit d'ouvrir le menu sur "paramètres", puis "modifier vos informations" et de sélectionner ce que vous voulez modifiez, puis d'appuyer sur enregistrer.
                                </Text>
                            </View>
                        </CollapseBody>
                    </Collapse>
                    </ScrollView>
                </View>
        ) 
    }
}
const styles = StyleSheet.create({
    head:{
        fontFamily:FONT_BOLD,
        fontWeight:Platform.OS==='ios'?'bold':null,
        fontSize:15,
    },
    text:{
        color:'#8d8d8d',
        fontFamily:FONT_REGULAR,
        fontStyle:'italic',
    },
    liste:{
        marginLeft:20,
        marginTop:5,
        
    },
    lien:{
        color:COLOR_GREEN,
        
    }
});