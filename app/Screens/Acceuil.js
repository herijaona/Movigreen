import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    BackHandler,
    Platform
} from 'react-native';
import HeaderCut from '../Components/HeaderCut';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR
} from '../Helpers/Helper';
import { YellowBox } from 'react-native';
import { getItemLocal } from '../Store/StoreLocal';
import { NavigationActions, StackActions,withNavigation  } from 'react-navigation';
import Toast, {DURATION} from 'react-native-easy-toast'
import AsyncStorage from '@react-native-community/async-storage';
YellowBox.ignoreWarnings(['Remote debugger']);

export default class Home extends Component<{}>{
    static navigationOptions = {
        header : null
    }
    constructor(props) {
        super(props);
        this.state = {
            backClickcount:0,
        }
        
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
    render(){
        return(
           <View style={styles.container}>
                <HeaderCut navigation={this.props.navigation} title="Acceuil" />
                    <View style={styles.TopBlock} >

                        <View style={styles.path} >
                            <Image
                                source={require('../assets/img/path.png')}
                                style = {styles.image}
                            />
                            <TouchableOpacity style={styles.button}
                                onPress={() => {this.props.navigation.navigate('Trajets')}}
                            >
                                <Text style={styles.buttonText}>Vos trajets</Text>
                            </TouchableOpacity> 
                        </View>
                        <View style={styles.path} >
                            <Image
                                source={require('../assets/img/co2.png')}
                                style = {styles.image}
                            />
                            <TouchableOpacity style={styles.button}
                                onPress={() => {this.props.navigation.navigate('Bilan')}}
                            >
                                <Text style={styles.buttonText}>Votre bilan </Text>
                            </TouchableOpacity> 
                        </View>

                    </View>
                    <View style={styles.CenterBlock} >
                            <Image
                                source={require('../assets/img/car.png')}
                                style = {styles.imageCenter}
                            />
                            <TouchableOpacity style={styles.buttonCenter}
                                onPress={() => {this.props.navigation.navigate('Reservez',{
                                    id:1,
                                })}}
                            >
                                <Text style={styles.buttonText}>Réservez</Text>
                            </TouchableOpacity> 
                    </View>
                    <View style={styles.BottomBlock} >
                        <View style={styles.path} >
                            <Image
                                source={require('../assets/img/setting.png')}
                                style = {styles.image}
                            />
                            <TouchableOpacity style={styles.button}
                                onPress={() => {this.props.navigation.navigate('Parametre')}}
                            >
                                <Text style={styles.buttonText}>Paramètres</Text>
                            </TouchableOpacity> 
                        </View>
                        <View style={styles.path} >
                            <Image
                                source={require('../assets/img/aide.png')}
                                style = {styles.image}
                            />
                            <TouchableOpacity style={styles.button}
                                onPress={() => {this.props.navigation.navigate('Aide')}}
                            >
                                <Text style={styles.buttonText}>Aide & Contact</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>

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
        flex: 1,
        justifyContent: 'center',
        marginTop:Platform.OS === 'ios' ? 0 : -25,
    },
    TopBlock :{
        flex : 3,
        flexDirection : 'row',
    },
    path:{
        flex : 1,
        borderColor:'#000000',
        borderWidth:1,
        borderRadius:5,
        margin:5,
        justifyContent:'center',
        padding:5,
        flexDirection:'column',
    },
    CenterBlock : {
        flex : 4,
        borderColor:'#000000',
        borderWidth:1,
        borderRadius:5,
        margin:5,
        justifyContent:'center',
        flexDirection:'column',
    },
    BottomBlock : {
        flex : 3,
        flexDirection : 'row',
    },
    image:{
        alignSelf:'center',
        resizeMode:'contain',
        width:50,
        marginBottom:10
    },
    imageCenter:{
        alignSelf:'center',
        resizeMode:'contain',
        width:200,
        height:100
    },
    button: {
        backgroundColor: COLOR_GREEN,
        borderRadius: 5,
        paddingVertical: 10
    },
    buttonCenter: {
        width:200,
        backgroundColor: COLOR_GREEN,
        borderRadius: 5,
        paddingVertical: 10,
        alignSelf:'center',
    },
    buttonText: {
        fontSize:18,
        color:COLOR_WHITE,
        textAlign:'center',
        fontFamily:FONT_REGULAR
    }
})
