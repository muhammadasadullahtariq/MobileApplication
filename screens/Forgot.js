/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ImageBackground,
  TextInput,
  ScrollView,
  BackHandler,
  Keyboard,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import Snackbar from "react-native-snackbar";
import AnimateLoadingButton from "react-native-animate-loading-button";
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Icon,
  Row,
  Card,
} from "native-base";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL } from "../config/Constants";
import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";
var { height, width } = Dimensions.get("window");

export default class Forgot extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: "",
    user_id: "",
    otp: "",
    validation: true,
    screenWidth: Math.round(Dimensions.get("window").width),
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  forgot = async () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    this.checkValidate();
    console.log(this.state.validation);
    if (this.state.validation) {
      fetch(BASE_URL + "user/passwordreset", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: JSON.stringify({
          email: this.state.email,
          language: "english",
          deviceid: "1234567",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.message != "Success") {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message);
          } else {
            //this.loadingButton.showLoading(false);
            //this.props.navigation.navigate('Otp');
            this.loadingButton.showLoading(false);
            this.resetMenu(res.result.otp, res.result.customer_id);
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          this.showSnackbar("Something went wrong");
        });
    }
  };

  resetMenu(otp, customer_id) {
    this.props.navigation.navigate("Otp", {
      otp: otp,
      customer_id: customer_id,
    });
    /*this.props
     .navigation
     .dispatch(StackActions.reset({
       index: 0,
       actions: [
         NavigationActions.navigate({
           routeName: 'Otp',
           params: { otp: otp, customer_id: customer_id },
         }),
       ],
     }))*/
  }

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  checkValidate() {
    if (this.state.email == "") {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Email can't be empty");
      return true;
    } else {
      this.state.validation = true;
    }

    this.checkValidEmail();
  }

  checkValidEmail() {
    let text = this.state.email;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Invalid email");
    } else {
      this.state.validation = true;
    }
  }
  render() {
    return (
      <Container style={{ width: "100%", height: "100%" }}>
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
            <Button onPress={() => this.handleBackButtonClick()} transparent>
              <Icon
                style={{
                  color: colors.theme_button_fg,
                  fontSize: 25,
                  marginLeft: 15,
                }}
                name="arrow-back"
              />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: "center" }}>
            <Title
              style={{ alignSelf: "center", color: colors.theme_button_fg }}
            >
              <Text>{strings.Forgot_password_text}</Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled={Platform.OS === "android"} keyboardVerticalOffset={-60}>

          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  color: colors.theme_fg,
                  fontSize: 30,
                  fontFamily: colors.font_family_bold,
                  marginTop: 10,
                  marginBottom:10,
                }}
              >
                Reset Password
              </Text>

              <Text style={styles.forgotdesc}>
                {strings.enter_your_email_below_to_receive}
              </Text>
              <Text style={styles.forgotdesc}>
                {strings.the_instructions_to_reset_your}
              </Text>
              <Text style={styles.forgotdesc}>{strings.forgot_password}</Text>
              <TextInput
                style={[styles.emailaddress, {width: this.state.screenWidth - 20}]}
                placeholderTextColor="#a6a6a6"
                onChangeText={(TextInputValue) =>
                  this.setState({ email: TextInputValue })
                }
                placeholder={strings.email_placeholder}
                keyboardType="email-address"
              />
              <View style={[{ width: "70%", marginTop: 30 }]}>
                <AnimateLoadingButton
                  ref={(c) => (this.loadingButton = c)}
                  width={this.state.screenWidth - 20}
                  height={40}
                  title={strings.send_otp}
                  titleFontSize={15}
                  titleFontFamily={colors.font_family}
                  titleColor={colors.theme_button_fg}
                  backgroundColor={colors.theme_fg}
                  borderRadius={5}
                  onPress={this.forgot.bind(this)}
                />
              </View>
            </View>
          </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  burger: {
    marginTop: "10%",
  },
  blacktext: {
    color: colors.sub_font,
    fontSize: 17,
    marginTop: "10%",
    marginBottom: "5%",
  },
  forgotdesc: {
    color: colors.sp_subtext_fg,
    fontSize: 14,
  },
  emailaddress: {
    height: 40,
    //width: 250,
    marginTop: 30,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    paddingLeft: Platform.OS == "ios" ? 10 : 5,
    fontFamily: colors.font_family,
  },
});
