import React, { Component } from 'react';
import { 
    Text,
    Image,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
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
export default class ErrorConnexion extends Component{

    render (){
        return(
            <View style={styles.content}>
                <Image
                        source={require('../assets/img/danger.png')}
                        style ={styles.img}
                    />
                <Text style={styles.text}>
                    Une Connexion est requise pour accéder au contenu
                </Text>
            </View>
        );
    }
};
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
    
const styles = StyleSheet.create({
    content:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding:50,
        position:'absolute',
        bottom:0,
        top:120,
        width: screenWidth,
    },
    text:{
        fontSize:18,
        fontFamily:FONT_REGULAR,
        textAlign:'center'
    }
})