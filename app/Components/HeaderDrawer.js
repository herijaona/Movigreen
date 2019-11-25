import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text
} from 'react-native';
import {
    COLOR_GREEN,FONT_REGULAR,COLOR_WHITE
} from '../Helpers/Helper';
import { getItemLocal } from '../Store/StoreLocal';

export default class HeaderDrawer extends Component{
    constructor(props) {
      super(props);
    
      this.state = {nom:''};
      getItemLocal('nom')
      .then(res => {
          console.log('isLoggedIniii '+res);
          this.setState({nom: res});
      });

    }
    render(){
        return(
            <View style={styles.header}>

                    <Image
                        source={require('../assets/img/green.png')}
                        style ={styles.img}
                    />
                    <Text h1 style={styles.textName}>Bienvenue 
                     {this.state.nom}
                    </Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    header:{
        //flex:1,
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
        
    }

})