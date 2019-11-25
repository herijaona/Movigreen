import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';

export default class HeaderImage extends Component{
    render(){
        return(
            <View style={styles.header}>
                    <Image
                        source={require('../assets/img/green.png')}
                        style ={styles.img}
                    />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    header:{
        flex:1,
        justifyContent:'center'
    },
    img:{
        resizeMode:'contain',
        width:150,
    }

})