import React ,{Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions 
} from 'react-native';
import {
    COLOR_GREEN,
} from '../Helpers/Helper';
import { string } from 'prop-types';
import Spinner from 'react-native-spinkit';

export default class Loader extends Component {
    static propTypes = {
        style: string.isRequired,
    }
    render(){
        return(
            <View style={styles.content}>
                <Spinner 
                    type = {this.props.style}
                    isVisible={true} 
                    size={100} 
                    color={COLOR_GREEN}
                />
            </View>
        )
    }
}

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
    
const styles = StyleSheet.create({
    content:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        position:'absolute',
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        width: screenWidth,
        height: screenHeight,
    }
})