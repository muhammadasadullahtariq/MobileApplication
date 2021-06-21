/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, TextInput, ScrollView, Alert, BackHandler, Keyboard } from 'react-native';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import Snackbar from 'react-native-snackbar';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
export default class Login extends Component<Props> {
  /*static navigationOptions = {
    title: 'SIGN IN',
    headerTintColor: '#FD4431'
  };*/

  static navigationOptions = {
    header:null
  }

  state = {
    email: 'jahangir.uplogic@gmail.com',
    password: 'password',
    validation:true
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

  forgotPassword = () => {
    this.props.navigation.navigate('Forgot');
  }

  Login = async () => {
    Keyboard.dismiss()
    this.loadingButton.showLoading(true);
    this.checkValidate();
    if(this.state.validation){
        fetch('http://demo.uplogictech.com/trabezah-backend/api/user/login', {
            method: 'post',
            headers: {
              'Authorization': 'Basic YWRtaW46MTIzNA==',
              'Content-Type': 'application/json',
              'X-API-KEY': 'RfTjWnZr4u7x!A-D'
            },
            body: JSON.stringify({
              "email": this.state.email,
              "password": this.state.password,
              "deviceid" : '1234567'
            })
          }).then((response) => response.json())
          .then((res) => {
        if(res.message != "Login Successfull"){
           this.loadingButton.showLoading(false);
           this.showSnackbar(res.message);
        }else{
            this.loadingButton.showLoading(false);
            this.props.navigation.navigate('Home');
        }
       }).catch((error) => {
           this.loadingButton.showLoading(false);
           this.showSnackbar("Something went wrong");
       });
    }
  }

  checkValidate(){
    if(this.state.email == '' || this.state.password == ''){
       
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Email and password can't be empty");
      return true;
    }else{
      this.state.validation = true;
    }

    this.checkValidEmail();
  }

  checkValidEmail(){
    let text = this.state.email; 
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 
    if(reg.test(text) === false) 
    { 
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Invalid email"); 
    }else{
      this.state.validation = true;
    } 
  }
  showSnackbar(msg){
    Snackbar.show({
      title:msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render() {
    return (
      <Container>
        <ImageBackground source={require('.././img/login_background.png')} style={{ width: '100%', height: '100%' }} >
        <Header style={{backgroundColor:'transparent'}} >
          <Left style={{flex: 1, color:'#FD4431'}}>
              <Button onPress={()=> this.handleBackButtonClick()} transparent>
                <Icon style={{color:'#FD4431'}} name='arrow-back' />
              </Button>
          </Left>
          <Body style={{flex: 3,justifyContent: 'center'}}>
            <Title style={{alignSelf:'center', color:'#FD4431'}} >SIGN IN</Title>
          </Body>
          <Right>
            
          </Right>
        </Header>
      <ScrollView keyboardShouldPersistTaps='always'>
      <View style={styles.container}>
        <Image
          style={styles.loginuser}
          source={require('.././img/login_user.png')}
        />
        <TextInput 
          style={styles.emailaddress}
          onChangeText={ TextInputValue =>
           this.setState({email : TextInputValue }) }
          placeholder="EMAIL ADDRESS"
          value="jahangir.uplogic@gmail.com"
          keyboardType="email-address"

        />
        <TextInput 
          style={styles.password}
          onChangeText={ TextInputValue =>
           this.setState({password: TextInputValue }) }
          placeholder="PASSWORD"
          value="password"
          secureTextEntry={true}
        />
        <View style={[{ width: "70%", marginTop: 30 }]} >
          <AnimateLoadingButton
            ref={c => (this.loadingButton = c)}
            width={250}
            height={40}
            title="LOGIN"
            titleFontSize={15}
            titleColor="rgb(255,255,255)"
            backgroundColor="#FF6149"
            borderRadius={5}
            onPress={this.Login.bind(this)}
          />
        </View>
        
        <View style={styles.forgotsec}>
            <Text style={styles.forgotpassword} >Forgot your Password?<Text  style={styles.clickhere}  onPress={this.forgotPassword} > Click Here</Text></Text>
        </View>
      </View>
      </ScrollView>
      </ImageBackground>
       </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  subtext:{
    color:'#CCA59D',
    fontSize:20,
  },
  loginuser:{
     marginTop:30,
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
  },
  password:{
    height:40,
    width:250,
    marginTop:20,
    borderColor: '#FD4431',
    borderWidth: 1,
    padding:10,
    borderRadius:5,
  },
  orconnectwith:{
    color:'#CCA59D',
    fontSize:15,
    marginTop:50,
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
  spinnerTextStyle: {
    color: '#FFF'
  },

});
