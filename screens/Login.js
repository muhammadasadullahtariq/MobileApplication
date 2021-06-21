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
  Dimensions,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  Keyboard,
  StatusBar,
  AsyncStorage,
  KeyboardAvoidingView,
} from "react-native";
import AnimateLoadingButton from "react-native-animate-loading-button";
import Snackbar from "react-native-snackbar";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Icon,
  Card,
  Thumbnail,
} from "native-base";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL } from "../config/Constants";
import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
var { height, width } = Dimensions.get("window");

export default class Login extends Component {
  /*static navigationOptions = {
    title: 'SIGN IN',
    headerTintColor: '#FD4431'
  };*/

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      email: "",
      password: "",
      validation: true,
      details: this.props.navigation.getParam("details"),
      screenWidth: Math.round(Dimensions.get("window").width),
    };
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
    if (this.state.details) {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "RestaurantList",
              //params: { details: this.state.details },
            }),
          ],
        })
      );
      // this.props.navigation.navigate('RestaurantDetail',{ details: this.state.details });
    } else {
      // this.props.navigation.navigate("RestaurantList");
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "RestaurantList",
              //params: { details: this.state.details },
            }),
          ],
        })
      );
      return true;
    }
  }

  storeData = async (id, name, phone, default_address, email) => {
    try {
      await AsyncStorage.setItem("user_id", id);
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("phone", phone);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("default_address", default_address);
    } catch (error) {
      this.showSnackbar("Something went wrong");
    }
  };

  forgotPassword = () => {
    this.props.navigation.navigate("Forgot");
  };

  register = () => {
    this.props.navigation.navigate("Register");
  };

  Login = async () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    this.checkValidate();
    if (this.state.validation) {
      fetch(BASE_URL + "user/login", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          deviceid: "1234567",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.message != "Login Successfull") {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message);
          } else {
            this.storeData(
              res.result.customer_id,
              res.result.first_name,
              res.result.telephone,
              res.result.default_address,
              this.state.email
            );

            this.loadingButton.showLoading(false);
            //this.props.navigation.navigate('Home');
            this.resetMenu();
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          //this.showSnackbar("Something went wrong");
        });
    }
  };

  resetMenu() {
    if (this.state.details) {
      this.props.navigation.navigate("Menu", {
        details: this.state.details,
        from: "Login",
      });
      // alert('1')
      // this.props.navigation.dispatch(
      //   StackActions.reset({
      //     index: 0,
      //     actions: [
      //       NavigationActions.navigate({
      //         routeName: "Menu",
      //         params: { details: this.state.details},
      //       }),
      //     ],
      //   })
      // );
      /*this.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Menu',
          params: { details: this.state.details },
        }),
      ],
    }))*/
    } else {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "RestaurantList",
              params: { someParams: "parameters goes here..." },
            }),
          ],
        })
      );
    }
  }

  checkValidate() {
    if (this.state.email == "" || this.state.password == "") {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Email and password can't be empty");
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
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render() {
    return (
      <Container>
        <Header
          style={{
            backgroundColor: colors.header,
            borderBottomWidth: 0,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0,
            elevation: 0,
          }}
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
              <Text>{strings.sign_in}</Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          // contentContainerStyle={{ flex: 1 }}
          extraScrollHeight={20}
        >
          {/* <ScrollView contentContainerStyle={styles.container} > */}
          <View style={styles.container}>
            {/* <ImageBackground
              //source={require(".././assets/header.jpg")}
              source={require(".././img/cooker.png")}
              style={{
                flexDirection: "column",
                height: height * 0.47,
                width: width * 0.95,
                //alignItems: "center",
                //justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#2C786C",
                  fontSize: 30,
                  fontWeight: "bold",
                  marginTop: 0,
                  fontFamily: colors.font_family,
                }}
              >
                Welcome
              </Text>
              <Text
                style={{
                  color: "#2C786C",
                  fontSize: 14,
                  //fontWeight: "bold",
                  marginTop: 0,
                  fontFamily: colors.font_family,
                }}
              >
                Ready to cook for you.
              </Text> */}

            {/* </ImageBackground> */}
            <Body
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 15,
                paddingBottom: 0,
              }}
            >
              <Thumbnail
                style={{
                  height: 270,
                  width: 350,
                }}
                square
                source={require(".././assets/img/cooker.png")}
              ></Thumbnail>
              {/* <Text style={styles.successname}>{strings.success}</Text> */}
              <Text
                style={{
                  color: colors.theme_fg,
                  fontSize: 30,
                  fontFamily: colors.font_family_bold,
                  marginTop: 10,
                }}
              >
                Welcome
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
                Enter your email to login. Enjoy your food!
              </Text>
            </Body>
            <View
              style={{
                marginTop: 0,
                width: "100%",
                //borderTopLeftRadius: 40,
                //borderTopRightRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                shadowOpacity: 0,
                borderColor: "#fff",
                paddingTop: 0,
              }}
            >
              <TextInput
                style={[styles.emailaddress, {width: this.state.screenWidth - 20}]}
                placeholderTextColor="#a6a6a6"
                onChangeText={(TextInputValue) =>
                  this.setState({ email: TextInputValue })
                }
                placeholder={strings.email_placeholder}
                keyboardType="email-address"
              />
              <TextInput
                style={[styles.password, {width: this.state.screenWidth - 20}]}
                placeholderTextColor="#a6a6a6"
                onChangeText={(TextInputValue) =>
                  this.setState({ password: TextInputValue })
                }
                placeholder={strings.password_placeholder}
                secureTextEntry={true}
              />
              <View style={[{ width: "70%", marginTop: 20 }]}>
                <AnimateLoadingButton
                  ref={(c) => (this.loadingButton = c)}
                  width={this.state.screenWidth - 20}
                  height={40}
                  title={strings.Login_btn_text}
                  titleFontSize={15}
                  titleFontFamily={colors.font_family}
                  titleColor={colors.theme_button_fg}
                  backgroundColor={colors.theme_fg}
                  borderRadius={5}
                  onPress={this.Login.bind(this)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.forgot} onPress={this.forgotPassword}>
                  {strings.Forgot_password_text}
                </Text>
              </View>
              <View style={styles.registersec}>
                <Text style={styles.register}>
                  {strings.sorry_text}
                  <Text style={styles.clickhere} onPress={this.register}>
                    {" "}
                    {strings.sorry_reg_text}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
  subtext: {
    color: colors.sub_font,
    fontSize: 20,
  },
  loginuser: {
    marginTop: 30,
  },
  submit_login: {
    padding: 10,
    backgroundColor: colors.theme_fg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.theme_fg,
  },
  btntext: {
    textAlign: "center",
    color: colors.sub_font,
  },
  emailaddress: {
    height: 40,
    width: 340,
    marginTop: 15,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    paddingLeft: Platform.OS == "ios" ? 10 : 5,
    fontFamily: colors.font_family,
  },
  password: {
    height: 40,
    width: 340,
    marginTop: 20,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontFamily: colors.font_family,
    paddingLeft: Platform.OS == "ios" ? 10 : 5,
  },
  orconnectwith: {
    color: "#CCA59D",
    fontSize: 15,
    marginTop: 50,
  },
  socialicons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    width: "70%",
    marginTop: 20,
  },
  iconmargin: {
    marginLeft: 10,
  },

  register: {
    color: colors.sp_subtext_fg,
    fontSize: 15,
  },
  clickhere: {
    color: colors.theme_fg,
    fontSize: 16,
  },
  forgot: {
    color: colors.theme_fg,
    fontSize: 14,
    textAlign: "right",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  registersec: {
    flex: 2,
    flexDirection: "row",
    marginTop: 20,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
