/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, TextInput, ScrollView, BackHandler, Keyboar } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';

export default class Forgot extends Component<Props> {
  static navigationOptions = {
    header:null
  }

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  otp = () => {
    this.props.navigation.navigate('Otp');
  }

  render() {

    return (
      <ImageBackground source={require('.././img/login_background.png')} style={{ width: '100%', height: '100%' }} >
      <Header style={{backgroundColor:'transparent'}} >
        <Left style={{flex: 1, color:'#FD4431'}}>
            <Button onPress={()=> this.handleBackButtonClick()} transparent>
              <Icon style={{color:'#FD4431'}} name='arrow-back' />
            </Button>
        </Left>
        <Body style={{flex: 3,justifyContent: 'center'}}>
          
        </Body>
        <Right>
          
        </Right>
      </Header>
      <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.burger}
          source={require('.././img/burger.png')}
        />
        <Text style={styles.blacktext}>FORGOT YOUR PASSWORD?</Text>
        <Text style={styles.forgotdesc}>Enter your email below to receive</Text>
        <Text style={styles.forgotdesc}>the instructions to reset your</Text>
        <Text style={styles.forgotdesc}>password</Text>
        <TextInput 
          style={styles.emailaddress}
          placeholder="EMAIL ADDRESS"
          keyboardType="email-address"
        />
        
        <View style={[{ width: "70%", marginTop: 30 }]}>
          <TouchableHighlight
            style={styles.submit_login}
            onPress={this.otp}

            >
              <Text style={styles.btntext}>SEND PASSWORD</Text>
          </TouchableHighlight>
        </View>
      </View>
      </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  burger:{
    marginTop:'10%',
  },
  blacktext:{
    color:'#636D70',
    fontSize:17,
    marginTop:'10%',
    marginBottom:'5%',
  },
  forgotdesc:{
    color:'#D3B8B3',
    fontSize:14,
  },
  submit_login:{
    padding:10,
    backgroundColor:'#FF6149',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#FF6149',
  },
  btntext:{
    textAlign: 'center',
    color:'#fff'
  },
  emailaddress:{
    height:40,
    width:250,
    marginTop:30,
    borderColor: '#FD4431',
    borderWidth: 1,
    padding:10,
    borderRadius:5,
    textAlign:'center'
  },
  

});
