import React, { Component } from 'react';
import {View} from 'react-native'
import MainNavigation from './Navigations/MainNavigation';
import FlashMessage from "react-native-flash-message";

type Props = {};

export default class App extends Component{
    constructor(props) {
        super(props);
        
    }
    render(){
        return(
        	<View style={{flex:1}}>
            <MainNavigation />
            <FlashMessage position="bottom" />
            </View>
        );
    }
}
