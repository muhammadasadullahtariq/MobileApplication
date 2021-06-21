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


export default class Splashscreen extends Component<Props> {
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
      <ImageBackground source={require('.././img/background.png')} style={{width: '100%', height: '100%'}} > 
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('.././img/logo.png')}
        />
         <Text style={styles.appname} >SpotnEat</Text>
        <Text style={styles.subtext} >Online Restaurant Booking</Text>
        <View style={[{ width: "65%", marginTop: 100 }]}>
          <TouchableHighlight
            style={styles.submit_signup}
            onPress={this.register}
            >
              <Text style={styles.btntext}>SIGN UP</Text>
          </TouchableHighlight>
        </View>
        <View style={[{ width: "65%" }]}>
          <TouchableHighlight
            style={styles.submit_login}
            onPress={this.signIn}
            underlayColor="#9D3C2E"
            >
              <Text style={styles.btntext}>LOGIN</Text>
          </TouchableHighlight>
        </View>
      </View>
      </ImageBackground>
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
