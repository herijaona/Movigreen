import React, { Component } from 'react';
import { StyleSheet, 
    View, 
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    BackHandler
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Container,  Grid, Row,Col } from 'native-base';
import HeaderCut from '../Components/HeaderCut';
import {
    COLOR_GREEN,
    COLOR_WHITE,
    COLOR_BLACK,
    FONT_REGULAR,
    FONT_BOLD,
    DIRECTION_URL,
    API_KEY,
    BASE_URL
} from '../Helpers/Helper';
import {
    convertDistance,
    calculPrix,
    calculCO2
} from '../Helpers/Functions';
import { NavigationActions, StackActions } from 'react-navigation';
import Moment from 'moment';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker';
import Loader from '../Components/Loader';
import FlashMessage ,{ showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import { getItemLocal } from '../Store/StoreLocal';
import ErrorConnexion from '../Components/errorConnexion';
import AsyncStorage from '@react-native-community/async-storage';


export default class Reservez extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            currentDate: Moment(new Date).format('DD-MM-YYYY HH:mm:ss') ,
            now: new Date(),
            maxDate: Moment(new Date).add(20, 'days'),
            depart:{},
            arriver:{},
            prix:'',
            carbon:'',
            adress_start:'',
            start:'',
            adress_end:'',
            end:'',
            distance:'',
            isVisible:false,
            hideList: false,
            hideList1: false,
            isConnect:true,
            isVisibleLoad:false,
            client_id:'',
        }
        AsyncStorage.getItem('id')
        .then((value) => {
            console.log("id "+value);
            this.setState({client_id:value});
        })
        .catch((err)=>{
            console.log(err);
        });
    }

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

    _getCoordsFromNameDepart(name,loc){
        this._updateStateDepart(name,{
            latitude: loc.lat,
            longitude: loc.lng
        });
    }

    _updateStateDepart(name,location){
        this.setState({
            depart:{
                latitude:location.latitude,
                longitude: location.longitude,
                status:true,
                name:name
            }
        });
        this._getDistance();
    }

    _getCoordsFromNameArriver(name,loc){
        console.log(loc);
        this._updateStateArriver(name,{
            latitude: loc.lat,
            longitude: loc.lng
        });
    }

    _updateStateArriver(name,location){
        this.setState({
            arriver:{
                latitude:location.latitude,
                longitude: location.longitude,
                status:true,
                name:name
            }
        });
        this._getDistance();
    }

    _getDistance(){
        if(this.state.depart.status && this.state.arriver.status){
            
            this.setState({
                start : this.state.depart.latitude+','+this.state.depart.longitude,
                end : this.state.arriver.latitude+','+this.state.arriver.longitude
            });
            console.log(this.state.start+' et '+this.state.end);
            this._getDirection(this.state.start,this.state.end);
        }
    }
    
    _getDirection(start, end){
        fetch(DIRECTION_URL+'origin='+start+'&destination='+end+'&key='+API_KEY)
            .then((response) => response.json())
            .then((resJson) =>{
                console.log(resJson);
                if(resJson.status == 'OK'){

                    var adress_start = resJson.routes['0'].legs['0'].start_address;
                    var adress_end = resJson.routes['0'].legs['0'].end_address;
                    var distance = convertDistance(resJson.routes['0'].legs['0'].distance.value);
                    var carbone = calculCO2(distance);
                    var prix = calculPrix(distance);

                    this.setState({
                        adress_start: adress_start,
                        adress_end : adress_end,
                        prix: prix,
                        carbon : carbone,
                        distance : distance,
                        isVisible : true,
                    });
                    
                }else{
                    showMessage({
                        message: "Attention",
                        description: "On ne peut pas calculer la distance de ce trajet",
                        type: "warning",
                        icon: "warning"
                    });
                    this.setState({
                        isVisible:false,
                        depart:{},
                        arriver:{}
                    })

                    this.googlePlacesAutocompletedepart._handleChangeText('') 
                    this.googlePlacesAutocompletedestination._handleChangeText('') 
                }
                
            })
            .catch((err)=>{
                console.error(err);
            })
        
    };

    _saveReservation = () => {
        this.expire();
       
        const {
            depart,
            currentDate,
            arriver,
            prix,
            carbon,
            start,
            end,
            distance,
            client_id
        } = this.state;

        NetInfo.isConnected.fetch().then( isConnected => {
            if(isConnected){
                this.setState({isConnect:true});

                this.setState({isVisibleLoad:true});
                fetch(BASE_URL+'reservation',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                                action: 'reservation',
                                lieu_depart: depart.name,
                                latlng_depart: start,
                                lieu_destination: arriver.name,
                                latlng_destination: end,
                                date_depart: currentDate,
                                client_id: client_id,
                                distance: distance,
                                prix: prix,
                                carbone: carbon,
                            }),
                })
                .then((response)=>response.json())
                    .then((responseJson)=>{
                        console.log(responseJson);
                        if(responseJson.Error == "no"){
                            
                            this.props
                                .navigation
                                .dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                    NavigationActions.navigate({
                                        routeName: 'Detail',
                                        params:{reservation_id: responseJson.Data.id,}
                                    }),
                                    ],
                                }))
                            
                            
                        }else {
                            showMessage({
                                message: "Erreur",
                                description: responseJson.msg,
                                type: responseJson.type,
                                icon: responseJson.type
                            });
                        }
                        this.setState({isVisibleLoad:false});
                    })
                    .catch((error)=>{
                        console.log(error);
                        this.setState({isVisibleLoad:false});
                        showMessage({
                            message: "Erreur",
                            description: "Il y a des erreur au serveur",
                            type: "danger",
                            icon: "danger"
                        });
                    });
            }else{
                this.setState({isConnect:false});
                showMessage({
                    message: "Aucun Connexion",
                    type: "danger",
                    icon: "danger"
                });
            }
        });
            
    };

    render(){
        return(
            <Container style={styles.container}>
                <HeaderCut navigation={this.props.navigation} title="Bilan" />
               
                <ScrollView  
                >
                <TouchableOpacity style={styles.content}
                    onPress={()=> {
                        this.setState({ 
                            hideList : false ,
                            hideList1 : false 
                        });
                        console.log('vieee'+ this.state.hideList1)
                    }}
                    activeOpacity = {1}
                >
                    <View style={{flex:1,justifyContent:'center',
                    marginVertical:10}}>
                        <Text style={styles.texttop}>Réservation</Text>
                    </View>
                    <View style={styles.blockInput}>
                        <View style={styles.inputTake}>
                            <Text style={styles.label}>Adresse de départ</Text>
                            
                            <GooglePlacesAutocomplete
                                ref={c => this.googlePlacesAutocompletedepart = c}
                                placeholder="Entrez l'emplacement"
                                minLength={2}
                                autoFocus={false}
                                returnKeyType={'search'}
                                fetchDetails={true}
                                listViewDisplayed={this.state.hideList1} 
                                onPress ={(data , details = null)=>{
                                    console.log(details);
                                    console.log(data);
                                    this._getCoordsFromNameDepart(details.name,details.geometry.location);
                                    this.setState({hideList1:false})
                                    console.log('vieee'+ this.state.hideList1)
                                    // this.props.notifyChange(details.geometry.location);
                                }}
                                textInputProps={{
                                    onFocus: () => this.setState({ hideList1 : true })
                                    
                                }}
                                
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderTopWidth: 0,
                                        borderBottomWidth:0,
                                        width:300,
                                    },
                                    loader:{
                                        position:'absolute',
                                        left:1,
                                        backgroundColor:COLOR_GREEN
                                    },
                                    textInput: {
                                        width:400,
                                        backgroundColor:'rgba(255, 255,255,0.01)',
                                        borderRadius: 5,
                                        fontSize:16,
                                        borderColor:COLOR_BLACK,
                                        borderWidth:1,
                                        fontFamily:FONT_REGULAR,
                                        marginBottom:10,
                                        height:42,
                                    },
                                    container:{
                                        position:'relative'
                                    },
                                    listView:{
                                        backgroundColor:COLOR_WHITE,
                                        position:Platform.OS === 'ios' ? 'relative' : 'absolute',
                                        zIndex:55,
                                        top:Platform.OS === 'ios' ? 0 : 50,
                                        borderRadius: 5,
                                        borderColor:COLOR_BLACK,
                                        borderWidth:1,

                                    },
                                    poweredContainer:{
                                        backgroundColor:COLOR_GREEN,

                                    },
                                    separator:{
                                        backgroundColor:COLOR_GREEN,
                            
                                    }
                                }}
                                query={
                                    {
                                        key:'AIzaSyDFu-A8m91udoLDgFwv8mt2wSuLjemxepY',
                                        language:'fr',
                                    }
                                }
                                nearbyPlacesAPI='GooglePlacesSearch'
                                debounce = {0}
                            />

                            <Text style={[styles.label]}>Adresse d'arrivée</Text>
                            
                            <GooglePlacesAutocomplete
                                ref={c => this.googlePlacesAutocompletedestination = c}
                                placeholder="Entrez l'emplacement"
                                minLength={2}
                                autoFocus={false}
                                returnKeyType={'search'}
                                fetchDetails={true}
                                listViewDisplayed={this.state.hideList} 
                                onPress ={(data , details = null)=>{
                                    console.log(details);
                                    this._getCoordsFromNameArriver(details.name,details.geometry.location);
                                    this.setState({hideList:false})
                                    // this.props.notifyChange(details.geometry.location);
                                }}
                                
                                textInputProps={{
                                    onFocus: () => this.setState({ hideList : true }),
                                }}
                                styles={{
                                    
                                    textInputContainer: {
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderTopWidth: 0,
                                        borderBottomWidth:0,
                                        width:300,
                                    },
                                    loader:{
                                        position:'absolute',
                                        left:1,
                                        backgroundColor:COLOR_GREEN
                                    },
                                    textInput: {
                                        width:400,
                                        backgroundColor:'rgba(255, 255,255,0.01)',
                                        borderRadius: 5,
                                        fontSize:16,
                                        borderColor:COLOR_BLACK,
                                        borderWidth:1,
                                        fontFamily:FONT_REGULAR,
                                        marginBottom:10,
                                        height:42,
                                    },
                                    container:{
                                        position:'relative'
                                    },
                                    listView:{
                                        backgroundColor:COLOR_WHITE,
                                        position:Platform.OS === 'ios' ? 'relative' : 'absolute',
                                        zIndex:55,
                                        top:Platform.OS === 'ios' ? 0 : 50,
                                        borderRadius: 5,
                                        borderColor:COLOR_BLACK,
                                        borderWidth:1,

                                    },
                                    poweredContainer:{
                                        backgroundColor:COLOR_GREEN,

                                    },
                                    separator:{
                                        backgroundColor:COLOR_GREEN,
                            
                                    }
                                }}
                                query={
                                    {
                                        key:'AIzaSyDFu-A8m91udoLDgFwv8mt2wSuLjemxepY',
                                        language:'fr',
                                    }
                                }
                                nearbyPlacesAPI='GooglePlacesSearch'
                                debounce = {0}
                            />

                            <Text style={[styles.label]}>Horaire de prise en charge</Text>
                            <DatePicker
                                style={styles.inputBox}
                                date={this.state.currentDate}  //it was dateMes=..., wich just meant nothing
                                mode="datetime"
                                format="DD-MM-YYYY HH:mm"
                                // // minDate={this.state.now}
                                
                                minDate={new Date().getDate()}
                                maxDate={this.state.maxDate}
                                customStyles={{
                                btnTextText: {
                                    color: COLOR_GREEN,
                                    fontSize:40,
                                },
                                dateInput: {
                                    borderWidth: 0,
                                },
                                btnTextConfirm: {
                                    color: COLOR_GREEN 
                                },
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                }}
                                locale={'fr'}
                                onDateChange={(datetime) => { this.setState({ currentDate: datetime }); console.log(this.state.currentDate) }}
                            />
                        </View>
                    </View>
                    <View style={styles.blockResultat}>
                        <View style={{height:70,alignItems:'center',alignContent:'center'}}>
                            
                            <View style={{flex: 1, flexDirection:'row',
                                opacity : this.state.isVisible? 1 : 0
                            }}>
                                <View style={{flex: 1, flexDirection:'column',marginLeft:50}}>
                                    <View style={{flex: 1,}}>
                                        <Text style={styles.textt}>Votre trajet est de </Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.textt}>Votre tarif s'élève à </Text>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection:'column'}}>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.textt,styles.green]}> { this.state.distance } km </Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.textt,styles.green]}> { this.state.prix } € </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.textt,styles.green ,
                            {
                                opacity : this.state.isVisible? 1 : 0
                            }
                            ]}>
                                Votre impact carbone est de { this.state.carbon } g C02
                            </Text>
                            <TouchableOpacity style={[styles.button,{backgroundColor: this.state.isVisible ?  COLOR_GREEN : '#afafaf' }]}
                                disabled={ !this.state.isVisible }
                                onPress={this._saveReservation}
                            >
                                <Text style={styles.buttonText}>Réservez</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                    </TouchableOpacity>
                </ScrollView>
                <FlashMessage position="bottom" />
                {this.state.isVisibleLoad ? <Loader style="ChasingDots"/> : null}
                
            </Container>
        );
    }
}

const styles = StyleSheet.create({

    container: {
      marginTop:Platform.OS === 'ios' ? 0 : -25,
    },
    content: {
        flex: 1,
        justifyContent:'center',
        flexDirection:'column',
    
        
      },
    texttop:{
        alignSelf:'center',
        fontSize:20,
        color:COLOR_BLACK,
        fontFamily:FONT_REGULAR,
      

    },
    textt:{
        fontSize:16,
        fontFamily:FONT_REGULAR,
        textAlign:'center',

    },
    green:{
        color:COLOR_GREEN,
        fontFamily:FONT_BOLD,
    },
    blockInput:{
        margin:10,
        flex:4,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',

    },
    blockResultat:{
        margin:10,
        flex:4,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
   

    },
    inputBox: {
        width:285,
        backgroundColor:'rgba(255, 255,255,0.01)',
        borderRadius: 5,
        fontSize:16,
        borderColor:COLOR_BLACK,
        borderWidth:1,
        fontFamily:FONT_REGULAR,
        marginBottom:10,
        height:42,
        marginHorizontal:8,
        marginTop:10,

      },
    label:{
        color:COLOR_BLACK,
        fontFamily:FONT_BOLD,
        fontSize:16,
        marginTop:10,
    },
    buttonText: {
      fontSize:20,
      color:COLOR_WHITE,
      textAlign:'center',
      fontFamily:FONT_BOLD
    },
    button: {
        marginTop:20,
        width:200,
        borderRadius: 5,
        marginVertical: 10,
        paddingVertical: 13,
        alignSelf:'center'
    },
    coll:{
        height: 50,
    }

  });
