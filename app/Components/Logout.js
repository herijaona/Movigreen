
import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from './Loader';
import {
    COLOR_GREEN,FONT_REGULAR,COLOR_WHITE,BASE_URL, COLOR_RED
} from '../Helpers/Helper';
import { getItemLocal } from '../Store/StoreLocal';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-spinkit';
import { NavigationActions, StackActions,withNavigation  } from 'react-navigation';
class Logout extends Component{
    constructor(props) {
      super(props);
    
      this.state = {
      	isVisible: false,
      	id:''};
      getItemLocal('id')
      .then(res => {
          console.log('isLoggedIn '+res);
          this.setState({id: res});
      });

    }

    render(){
        return(
            <View style={{borderWidth: 1,
                borderColor:COLOR_WHITE,
                borderStyle: 'solid',
                }}>
                    
                    <TouchableOpacity onPress={()=>
                          Alert.alert(
                            'Déconnecter',
                            'Voulez-vous vous déconnecter?',
                            [
                              {text: 'Annuler', onPress: () => {return null}},
                              {text: 'Ok', onPress: () => {
                                this.setState({isVisible: true});
						    	fetch(BASE_URL+'logout',{
						            method: 'POST',
						              headers: {
						                  Accept: 'application/json',
						                  'Content-Type': 'application/json',
						              },
						              body: JSON.stringify({
						                  action: 'logout',
						                  id: this.state.id,
						              }),
						        })
						        .then((response)=>response.json())
						            .then((responseJson)=>{
						                console.log(responseJson);
						                if (responseJson.Error =='no') {
						                	//AsyncStorage.clear();
                                            AsyncStorage.removeItem('isLoggedIn');
						                	this.props
						                      .navigation
						                      .dispatch(StackActions.reset({
						                          index: 0,
						                          actions: [
						                          NavigationActions.navigate({
						                              routeName: 'Auth'
						                          }),
						                          ],
						                      }))
						                 // props.navigation.navigate('Auth');
						                }else{
						                	
						                }
						                this.setState({isVisible: false});
						                
						            })
						            .catch((err)=>{
						                console.log(err);
						                this.setState({isVisible: false});
						            }) 
                                
                              }},
                            ],
                            { cancelable: false }
                          ) 
                        }
                        disabled={this.state.isVisible}
                    >
                    	{ this.state.isVisible 
                              ? (<View style={[styles.btnContainer,{height: 50}]}>
                                  <Spinner 
                                    type = "FadingCircleAlt"
                                    isVisible={true} 
                                    size={25} 
                                    color={COLOR_WHITE}
                                  />
                                  </View>
                                ) 
                              : (
                              	<View style={styles.btnContainer}>
		                            <Text style={{margin: 16,fontWeight: 'bold',color: COLOR_WHITE,fontFamily:FONT_REGULAR}}>Déconnecter</Text>
		                            <Icon name="sign-out" size={20} color={COLOR_WHITE} />
		                        </View>
		                        )
                        }
                        
                    </TouchableOpacity>
                    
            </View>
        )
    }
}
const styles = StyleSheet.create({
    header:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
    },
    img:{
        resizeMode:'contain',
        width:150,
    },
    textName:{
        margin:10,
        fontSize:15,
        color:"#fff",
        fontFamily:FONT_REGULAR,
        fontStyle: 'italic',
        
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
      }

})
export default withNavigation(Logout);