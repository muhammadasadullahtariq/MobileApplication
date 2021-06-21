/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,ScrollView, Text, View, Image, TouchableHighlight, ImageBackground, TextInput, BackHandler, Keyboard } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';

export default class Register extends Component<Props> {
  static navigationOptions = {
    header:null
  }

  login = () => {
    this.props.navigation.navigate('Login');
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
          <Title style={{alignSelf:'center', color:'#FD4431'}} >SIGN UP</Title>
        </Body>
        <Right>
          
        </Right>
      </Header>
      <ScrollView>
      <View style={styles.container}>
        <TextInput 
          style={styles.password}
          placeholder="USER NAME"
        />
        <TextInput 
          style={styles.password}
          placeholder="EMAIL ADDRESS"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.password}
          placeholder="PASSWORD"
          secureTextEntry={true}
        />
        <TextInput 
          style={styles.password}
          placeholder="CONFIRM PASSWORD"
          secureTextEntry={true}
        />
        <View style={[{ width: "70%", marginTop: 20 }]}>
          <TouchableHighlight
            style={styles.submit_login}

            >
              <Text style={styles.btntext}>REGISTER</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.forgotsec}>
            <Text style={styles.forgotpassword} >Already have an account?<Text  style={styles.clickhere} onPress={this.login} > Login</Text></Text>
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
  appname:{
    color:'#FD4431',
    marginTop:10,
    fontSize:24,
    marginTop:20,
    marginBottom:20,
    textAlign: 'center'
  },
  subtext:{
    color:'#CCA59D',
    fontSize:20,
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
    marginTop:50,
    borderColor: '#FD4431',
    borderWidth: 1,
    padding:10,
    borderRadius:5,
    textAlign:'center'
  },
  password:{
    height:40,
    width:250,
    marginTop:20,
    borderColor: '#FD4431',
    borderWidth: 1,
    padding:10,
    borderRadius:5,
    textAlign:'center'
  },
  orconnectwith:{
    color:'#CCA59D',
    fontSize:15,
    marginTop:30,
  },
  socialicons: { 
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center',
    width: '70%',
    marginTop:20
  },
  iconmargin: {
    marginLeft:10
  },
  forgotpassword:{
    color:'#CCA59D',
    fontSize:15,
  },
  clickhere:{
    color:'#FD4431',
    fontSize:16,
  },
  forgotsec: { 
    flex: 2, 
    flexDirection: 'row',
    marginTop:20
  },

});
