/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, TextInput, ScrollView, Alert, BackHandler, Keyboard, StatusBar,Dimensions } from 'react-native';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import Snackbar from 'react-native-snackbar';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
import { NavigationActions, StackActions } from 'react-navigation';
import { BASE_URL } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import strings from './stringsoflanguages';
export default class ResetPassword extends Component<Props> {
  /*static navigationOptions = {
    title: 'SIGN IN',
    headerTintColor: '#FD4431'
  };*/
  
  static navigationOptions = {
    header:null
  }

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  state = {
    //user_id: this.params.user_id,
    user_id: this.props.navigation.getParam('customer_id'),
    password: '',
    confirmpassword: '',
    validation:true,
    screenWidth: Math.round(Dimensions.get('window').width), 
    screenHeight: Math.round(Dimensions.get('window').height),
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
  later = async () => {
    
    const navigateAction = NavigationActions.navigate({
      routeName: 'RestaurantList'
    });
    this.props.navigation.dispatch(navigateAction);
  }
  Reset = async () => {
    Keyboard.dismiss()
    this.loadingButton.showLoading(true);
    //this.showSnackbar(this.state.user_id);
    //this.loadingButton.showLoading(false);
    this.checkValidate();
    if(this.state.validation){
        fetch(BASE_URL+'user/setpass', {
            method: 'post',
            headers: {
              'Authorization': 'Basic YWRtaW46MTIzNA==',
              'Content-Type': 'application/json',
              'X-API-KEY': 'RfTjWnZr4u7x!A-D'
            },
            body: JSON.stringify({
              "user_id": this.state.user_id,
              "password": this.state.password,
              "deviceid" : '1234567'
            })
          }).then((response) => response.json())
          .then((res) => {
        if(res.message != "Success"){
           this.loadingButton.showLoading(false);
           this.showSnackbar(res.message);
        }else{
            this.loadingButton.showLoading(false);
            //this.props.navigation.navigate('Menu');
            this.resetMenu();
        }
       }).catch((error) => {
           this.loadingButton.showLoading(false);
           //this.showSnackbar("Something went wrong");
       });
    }
  }

  resetMenu() {
   this.props
     .navigation
     .dispatch(StackActions.reset({
       index: 0,
       actions: [
         NavigationActions.navigate({
           routeName: 'RestaurantList',
           params: { customer_id: this.state.customer_id },
         }),
       ],
     }))
  }

  checkValidate(){
    if(this.state.confirmpassword == '' || this.state.password == '')
    {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("password can't be empty");
      return true;
    }
    else
    {
      if(this.state.password != this.state.confirmpassword)
      {
        this.loadingButton.showLoading(false);
        this.state.validation = false;
        this.showSnackbar("Password mismatch! ");
        return true;
      }
      else
      {
        this.state.validation = true;
      }
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
   
   <Header
          style={{ backgroundColor: colors.header }}
          androidStatusBarColor={colors.header}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.header}
            networkActivityIndicatorVisible={true}
          />
          <Left style={{ flex: 1, color: colors.theme_fg }}>
          </Left>
          <Body style={{ flex: 3, justifyContent: "center" }}>
            <Title
              style={{ alignSelf: "center", color: colors.theme_button_fg }}
            >
              <Text>Reset Password</Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
      <ScrollView keyboardShouldPersistTaps='always'>
      <View style={styles.container}>
      <Body
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 15,
                  paddingBottom: 0,              
                }}
              >

              {/* <Text style={styles.successname}>{strings.success}</Text> */}
              <Text
                style={{
                  color: colors.theme_fg,
                  fontSize: 30,
                  fontFamily: colors.font_family_bold,
                  marginTop: 10,
                }}
              >
                Reset
              </Text>
              <Text
                style={{
                  color: colors.theme_fg,
                  fontSize: 12,
                  fontFamily: colors.font_family_bold,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                Enter new password.
              </Text>
              </Body>
       
        <TextInput 
          style={[styles.password, {width: this.state.screenWidth - 20}]}
          onChangeText={ TextInputValue =>
           this.setState({password : TextInputValue }) }
          placeholder={strings.new_pass_placeholder}
          secureTextEntry={true}
        />
        
        <TextInput 
          style={[styles.password, {width: this.state.screenWidth - 20}]}
          onChangeText={ TextInputValue =>
           this.setState({confirmpassword: TextInputValue }) }
          placeholder={strings.confirm_pass_placeholder}
         
          secureTextEntry={true}
        />
        <View style={[{ marginTop: 30 }]} >
          <AnimateLoadingButton
            ref={c => (this.loadingButton = c)}
            width={this.state.screenWidth - 20}
            height={40}
            title={strings.reset}
            titleFontSize={15}
            titleColor={colors.theme_button_fg}
            titleFontFamily={colors.font_family}
            backgroundColor={colors.theme_fg}
            borderRadius={5}
            onPress={this.Reset.bind(this)}
          />
        </View>
        <View style={[{ marginTop: 20 }]} >
  <Text style={{color:colors.theme_fg,fontSize:18,fontFamily:colors.font_family,justifyContent:'center',alignItems:'center'}} onPress={this.later}>{strings.close}</Text>
            {/*<AnimateLoadingButton
                  width={this.state.screenWidth-40}
                  height={40}
                  title="Close"
                  titleFontSize={15}
                  titleColor={colors.sp_subtext_fg}
                  backgroundColor={colors.theme_button_fg}
                  borderRadius={2}
                  onPress={this.later}
                  titleFontFamily={colors.font_family}
            />*/}
        </View> 
      </View>
      </ScrollView>
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
  
  loginuser:{
     marginTop:30,
  },
  
  password:{
    height:40,
    width:250,
    marginTop:20,
    borderColor: colors.border,
    borderWidth: 1,
    padding:10,
    borderRadius:5,
    fontFamily:colors.font_family
   
  },
  
});
