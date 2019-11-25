import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Platform,
    Alert,
    BackHandler
} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {
    COLOR_GREEN,COLOR_WHITE,FONT_BOLD,FONT_REGULAR
} from '../Helpers/Helper';
import { getItemLocal } from '../Store/StoreLocal';
import AsyncStorage from '@react-native-community/async-storage';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);


class Splash extends Component{
    static navigationOptions = {
        header : null
    }
    constructor(props) {
        super(props);
        this.state = {
            logoOpacityCenter: new Animated.Value(1),
            logoOpacitytop: new Animated.Value(0),
            textOpacity:  new Animated.Value(0),
            isLogIn:'',
            nomUtilisateur: "",
        };

      getItemLocal('email')
      .then(res => {
          console.log('email '+res);
          this.setState({nomUtilisateur: res});
      });
      console.log('nom 1 '+this.state.nomUtilisateur);
    }
    startView(){
        
        Animated.sequence([
            Animated.timing(this.state.logoOpacityCenter,{
                toValue:0,
                duration:2000,
            })
        ]).start(()=>{
            Animated.sequence([
                Animated.timing(this.state.logoOpacitytop,{
                    toValue:1,
                    duration:1000,
                })
            ]).start(()=>{
                
            })

            Animated.sequence([
                Animated.timing(this.state.textOpacity,{
                    toValue:1,
                    duration:1000,
                })
            ]).start(()=>{
                setTimeout(() => {
                    getItemLocal('isLoggedIn')
                       .then(res => {
                           console.log(res);
                           if(res){
                                this.props.navigation.navigate('App',{nomUtilisateur:this.state.nomUtilisateur});
                           }else{
                                this.props.navigation.navigate('Auth');
                           }
                    });
                    
                }, 2000);
            })
        })
    }
    async componentWillMount(){
        var date = new Date();
        console.log(date);

        getItemLocal('debut')
        .then(res => {
            console.log('debut '+JSON.parse(res));
            var res = JSON.parse(res);
            if(res){
                var last = new Date(res);
                const diffTime = Math.abs(date - last);
                const diffMin = Math.ceil(diffTime / (1000 * 60 )); 
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
               
                if(diffDays>2){
                    Alert.alert(
                        'Votre application est expirée',
                        'Merci de contacter le développeur',
                        [
                    
                          {text: 'Fermer', onPress: () => console.log('fefsfs')//BackHandler.exitApp() 
                        },
                        ],
                        {cancelable: false},
                      );
                }else{
                    this.startView();
                }
            }else{
                AsyncStorage.setItem('debut',JSON.stringify(date))
                this.startView();
            }
            console.log(date);
        });
        
        //await AsyncStorage.setItem('debut',date); 
        BackHandler.addEventListener('hardwareBackPress', function(){
            return true;
        });
    }
    storeData = async (value) => {
        try {
          await AsyncStorage.setItem('debut', value)
        } catch (e) {
          console.log("etetoetoeote");
        }
      }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.logotop}>
                    <Animated.Image
                        source={require('../assets/img/green.png')}
                        style ={{
                            ...styles.img,
                            opacity: this.state.logoOpacitytop
                            }}
                    />
                </View>
                <View style={styles.textIm}>
                    <Animated.Text 
                    style={{
                        ...styles.text,
                        opacity: this.state.textOpacity,
                        }}
                    >Bienvenue</Animated.Text>
                </View>
                <Animated.Image
                    source={require('../assets/img/green.png')}
                    style={{
                        ...styles.logo,
                        opacity: this.state.logoOpacityCenter
                    }}
                />

            </View>
        ) 
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor:COLOR_GREEN,
    },
    logo:{
        alignSelf:'center',
    },
    textIm:{
        position:'absolute',
        justifyContent:'center',
        alignSelf:'center',
    },
    logotop:{
        alignSelf:'center',
        position:'absolute',
        justifyContent:'center',
        top:10,
    },
    text:{
        color:COLOR_WHITE,
        alignSelf:'center',
        marginTop:0,
        fontSize:40,
        fontFamily:FONT_BOLD,
        fontWeight:Platform.OS==='ios'?'bold':null
    },
    img:{
        alignSelf:'center',
        resizeMode:'contain',
        width:150,
        marginTop:20,
    },
})
export default Splash;