import React, { Component } from 'react';
import { Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,FONT_BOLD
} from '../Helpers/Helper';

export default class MapInput extends Component{

    render(){
        return (

            <GooglePlacesAutocomplete
                placeholder="Entrez l'emplacement"
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                fetchDetails={true}
                listViewDisplayed={false}
                onPress ={(data , details = null)=>{
                    this.props.notifyChange(details.geometry.location);
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
                        position:'absolute',
                        zIndex:55,
                        top:50,
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
            
        );
    }
}
