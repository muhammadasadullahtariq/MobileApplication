/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, TextInput, Alert, BackHandler, Keyboar } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
export default class Otp extends Component<Props> {
  static navigationOptions = {
    header:null
  }

   _onFinishCheckingCode2(isValid, code) {
    console.log(isValid);
    if (!isValid) {
      Alert.alert(
        'Confirmation Code',
        'Code not match!',
        [{text: 'OK'}],
        { cancelable: false }
      );
    } else {
      this.setState({ code });
      Alert.alert(
        'Confirmation Code',
        'Successful!',
        [{text: 'OK'}],
        { cancelable: false }
      );
    }
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
          <Title style={{alignSelf:'center', color:'#FD4431'}} >Enter OTP</Title>
        </Body>
        <Right>
          
        </Right>
      </Header>
      <View style={styles.container}>
        <View style={[{ marginTop: "15%" }]} ></View>
        <Text style={styles.forgotdesc}>Enter the code you have received by</Text>
        <Text style={styles.forgotdesc}>sms in order to verify account</Text>
        <View style={[{ height: "20%",marginTop: "5%", textAlign: 'center' }]}>
          <CodeInput
              ref="codeInputRef2"
              keyboardType="numeric"
              codeLength={4}
              className='border-circle'
              compareWithCode='1234'
              autoFocus={false}
              codeInputStyle={{ fontWeight: '800' }}
              activeColor='#B33A2B'
              inactiveColor='#B33A2B'
              onFulfill={(isValid, code) => this._onFinishCheckingCode2(isValid, code)}
            />
        </View>
        <View style={[{ width: "70%", marginTop: "5%" }]}>
          <TouchableHighlight
            style={styles.submit_login}

            >
              <Text style={styles.btntext}>SUBMIT</Text>
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
    alignItems: 'center',
  },
  appname:{
    color:'#FD4431',
    marginTop:10,
    fontSize:24,
    marginTop:20,
    marginBottom:20,
    textAlign: 'center'
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
