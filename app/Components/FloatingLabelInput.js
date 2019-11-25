import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput } from 'react-native';
import { string, func, bool } from 'prop-types';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,FONT_BOLD,BASE_URL
} from '../Helpers/Helper';


export class FloatingLabelInput extends Component {
  static propTypes = {
    attrName: string.isRequired,
    title: string.isRequired,
    value: string.isRequired,
    updateMasterState: func.isRequired,
    type: string.isRequired,
  }
	constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.state = {
      isFieldActive: false,
    }
  }

  _handleFocus = () => {
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
      }).start();
    }
  }

  _handleBlur = () => {
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
      }).start();
    }
  }

  _onChangeText = (updatedValue) => {
    const { attrName, updateMasterState } = this.props; 
    updateMasterState(attrName, updatedValue);
  }

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? 11.5 : 15,
      color: isFieldActive ? 'black' : 'dimgrey',
    }
  }

  render() {
    return (
      <View style = {Styles.container}>
        <Animated.Text
          style = {[Styles.titleStyles, this._returnAnimatedTitleStyles()]}
        >
          {this.props.title}
        </Animated.Text>
        <TextInput {...this.props}
          value = {this.props.value}
          style = {Styles.textInput}
          underlineColorAndroid = 'transparent'
          onFocus = {this._handleFocus}
          onBlur = {this._handleBlur}
          onChangeText = {this._onChangeText}
          keyboardType = {this.props.type}
           
        />
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    marginVertical: 4,
    borderColor:COLOR_BLACK,
    borderWidth: 1,
    fontFamily:FONT_REGULAR
  },
  textInput: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    fontSize: 15,
    marginTop: 7,
    marginHorizontal:5,
    fontFamily: FONT_REGULAR,
    color: 'black',
    height:40
  },
  titleStyles: {
    position: 'absolute',
    fontFamily: FONT_REGULAR,
    left: 3,
    left: 4,
  }
})