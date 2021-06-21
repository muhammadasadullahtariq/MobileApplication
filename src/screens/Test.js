/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground } from 'react-native';


export default class Test extends Component<Props> {
  static navigationOptions = {
  	header:null
	}
  
  signIn = () => {
    this.props.navigation.navigate('Login');
  }

  register = () => {
    this.props.navigation.navigate('Register');
  }

  render() {
  	let greetings = 'SplashScreen';
    return (
      <Text>Test</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appname:{
    color:'#FD4431',
    marginTop:10,
    fontWeight:'bold',
    fontSize:35,
    marginTop:20,
  },
  subtext:{
    color:'#CCA59D',
    fontSize:20,
  },
  submit_signup:{
    padding:10,
    backgroundColor:'#FF6149',
    borderRadius:3,
    borderWidth: 1,
    borderColor: '#FF6149',
  },
  submit_login:{
    padding:10,
    backgroundColor:'#9D3C2E',
    borderRadius:3,
    borderWidth: 1,
    borderColor: '#9D3C2E',
    marginTop:20
  },
  btntext:{
    textAlign: 'center',
    color:'#fff'
  }
});
