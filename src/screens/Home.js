/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground,TextInput, ScrollView, BackHandler, Keyboard } from 'react-native';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { Icon } from 'native-base';
export default class Home extends Component<Props> {
  static navigationOptions = {
    header:null
  }
  
  searchRestaurant = async () => {
    Keyboard.dismiss()
    this.loadingButton.showLoading(false);
    this.props.navigation.navigate('RestaurantList');
  }

  render() {
    return (
      <ImageBackground source={require('.././img/background.png')} style={{width: '100%', height: '100%'}} > 
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('.././img/logo.png')}
        />
        <Text style={styles.appname} >SpotnEat</Text>

        <View style={styles.searchcontent}>
            <TextInput 
              style={styles.textbox}
              placeholder="SEARCH RESTAURANTS"
            />
            <View style={[{ width: "70%", marginTop: 20, marginBottom: 20 }]} >
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={250}
                height={40}
                title="GET STARTED"
                titleFontSize={15}
                titleColor="rgb(255,255,255)"
                backgroundColor="#FF6149"
                borderRadius={5}
                onPress={this.searchRestaurant.bind(this)}
              />
            </View>
        </View>
        <Icon style={{ color:'#FD4431', marginTop:60, marginBottom : 10}} name='pin' />
        <Text style={styles.subtext} >San Antonio, Texas - USA</Text>
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
  searchcontent:{
     backgroundColor:'#FFE9E5',
     width:'80%',
     alignItems: 'center',
     marginTop:30,
     borderRadius:5,
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
  },
  textbox:{
    height:40,
    width:250,
    marginTop:20,
    borderColor: '#FD4431',
    borderWidth: 1,
    padding:10,
    borderRadius:5,
  },
  subtext:{
    color:'#4D595D',
    fontSize:20,
  },
});
