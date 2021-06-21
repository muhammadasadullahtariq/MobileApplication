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
  ScrollView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  Modal,
  BackHandler,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import {
  Container,
  Content,
  Header,
  Left,
  Row,
  Col,
  Body,
  Right,
  Button,
  Title,
  Icon,
  CheckBox,
  Card,
} from "native-base";
import AnimateLoadingButton from "react-native-animate-loading-button";
import Snackbar from "react-native-snackbar";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL } from "../config/Constants";
import * as colors from "../assets/css/Colors";
import country_phone_code from "./country_phone_code.json";
import CountrycodeModal from "react-native-modalbox";
import strings from "./stringsoflanguages";
import { Checkbox } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import HTML from "react-native-render-html";
var { height, width } = Dimensions.get("window");
import { Divider } from "react-native-elements";
import WebView from "react-native-webview";
const TermsAndConditions =
  Platform.OS === "ios"
    ? require("../assets/TermsandConditionsandPrivacyPolicy.html")
    : { uri: "file:///android_asset/TermsandConditionsandPrivacyPolicy.html" };
export default class Register extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    dataSource1: country_phone_code,
    dataSource: [],
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    confirm_password: "",
    validation: true,
    mobile: "",
    CC_list: false,
    telephone_code: "+264",
    modalVisible: false,
    //pickerData: this.phone.getPickerData()
    screenWidth: Math.round(Dimensions.get("window").width),
    screenHeight: Math.round(Dimensions.get("screen").height),
    isSelected: false,
  };
  // contentWidth = useWindowDimensions().width;
  login = () => {
    this.props.navigation.navigate("Login");
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.telephonecode_array = country_phone_code;
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
    if (this.state.CC_list == true) {
      this.setState({ CC_list: false });
      return true;
    } else {
      this.props.navigation.goBack(null);
      return true;
    }
  }

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: 3000,
    });
  }
  SearchFilterFunction(text) {
    // console.log(this.telephonecode_array)
    const newData = this.telephonecode_array.filter(function (item) {
      const itemData = item.dial_code
        ? item.name.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      console.log(itemData.indexOf(textData) > -1);
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
    });
  }
  termsAndCond = () => {
    Keyboard.dismiss();
    this.checkValidate();
    if(this.state.validation)
    {
      this.setState({
        modalVisible: true,
      });
    }
  };
  send_otp = () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    this.checkValidate();
    if (this.state.validation) {
      var details = {
        email: this.state.email,
        telephone: this.state.mobile,
        country_code: this.state.telephone_code,
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      fetch(BASE_URL + "user/registerotp", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: formBody,
      })
        .then((response) => response.json())
        .then(async (res) => {
          //console.log(typeof(res.otp))
          if (res.message != "Success") {
            await this.loadingButton.showLoading(false);
            await this.showSnackbar(res.message);
            if (res.message != "Email or Mobile Already Exist") {
              this.props.navigation.navigate("Verify", {
                email: this.state.email,
                mobile: this.state.mobile,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                password: this.state.password,
                confirm_password: this.state.confirm_password,
                code: this.state.telephone_code,
              });
            }
          } else {
            var otp = res.otp.toString();
            await this.loadingButton.showLoading(false);
            await this.props.navigation.navigate("Verify", {
              otp: otp,
              email: this.state.email,
              mobile: this.state.mobile,
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              password: this.state.password,
              confirm_password: this.state.confirm_password,
              code: this.state.telephone_code,
            });
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          this.showSnackbar("Something went wrong");
        });
    }
  };
  Register = async () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    this.checkValidate();
    if (this.state.validation) {
      fetch(BASE_URL + "user/register", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          telephone: this.state.mobile,
          email: this.state.email,
          password: this.state.password,
          user_name: this.state.user_name,
          deviceid: "1234567",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.message != "Registered Successfully") {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message);
          } else {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message);
            //this.props.navigation.navigate('Login');
            this.resetMenu();
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          //alert(JSON.stringify(error));
          this.showSnackbar("Something went wrong");
        });
    }
  };

  resetMenu() {
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
  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: "100%",
          backgroundColor: "#080808",
        }}
      />
    );
  };
  GetListViewItem = (data) => {
    this.setState({
      CC_list: false,
      telephone_code: data,
      err_telephone: false,
    });
  };
  /*moveToLogin(){
    return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Login'})
                    ]
                  }));
  }*/

  checkValidate() {
    if (
      this.state.email == "" ||
      this.state.mobile == "" ||
      this.state.password == "" ||
      this.state.first_name == "" ||
      this.state.last_name == "" ||
      this.state.confirm_password == ""
    ) {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Please fill all mandatory fields.");
      return true;
    }

    if (
      this.state.password != this.state.confirm_password &&
      this.state.password != ""
    ) {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Password mismatch! ");
    } else {
      if (this.checkPassword(this.state.password)) {
        this.state.validation = true;
      } else {
        this.state.validation = false;
        this.loadingButton.showLoading(false);
        this.showSnackbar(
          "Password must be atleast six characters with one number, one lowercase and one uppercase letter! "
        );
      }
    }
  }
  checkPassword(str) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(str);
  }
  onPressFlag() {
    return false;
  }

  selectCountry(country) {
    this.phone.selectCountry(country.iso2);
  }

  render() {
    return (
      <Container style={{ width: "100%", height: "100%" }}>
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
              style={{
                alignSelf: "center",
                color: colors.theme_button_fg,
                fontFamily: colors.font_family,
              }}
            >
              Sign Up
            </Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Content style={{ marginBottom: 0, marginTop: 20 }}>
              <View style={styles.container}>
                {/*             <ImageBackground
              // source={require("../../assets/images/header.jpg")}
              source={require(".././img/header.jpg")}
              style={{
                flexDirection: "column",
                height: height * 0.30,
                width: width * 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                  fontFamily: colors.font_family,
                }}
              >
                Hey Delicious!
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  textAlign: "center",
                  fontFamily: colors.font_family,
                  paddingHorizontal: 50,
                }}
              >
                It means this is delicious food you can enjoy everday from
                vibrant and healthy slalads.
              </Text>
            </ImageBackground>
 */}
                <Text
                  style={{
                    color: colors.theme_fg,
                    fontSize: 30,
                    fontFamily: colors.font_family_bold,
                    marginTop: 5,
                    alignItems: "flex-start",
                  }}
                >
                  Create Account
                </Text>
                <Text
                  style={{
                    color: colors.theme_fg,
                    fontSize: 12,
                    marginTop: 10,
                    //marginBottom: 10,
                    fontFamily: colors.font_family_bold,
                  }}
                >
                  Enter your name, email and phone number to sign up.
                </Text>

                <TextInput
                  style={[
                    styles.password,
                    { width: this.state.screenWidth - 20 },
                  ]}
                  placeholder={strings.register_firstname}
                  placeholderTextColor="#a6a6a6"
                  onChangeText={(TextInputValue) =>
                    this.setState({ first_name: TextInputValue })
                  }
                />
                <TextInput
                  style={[
                    styles.password,
                    { width: this.state.screenWidth - 20 },
                  ]}
                  placeholder={strings.register_lastname}
                  placeholderTextColor="#a6a6a6"
                  onChangeText={(TextInputValue) =>
                    this.setState({ last_name: TextInputValue })
                  }
                />
                <TextInput
                  style={[
                    styles.password,
                    { width: this.state.screenWidth - 20 },
                  ]}
                  placeholder={strings.register_email_address}
                  placeholderTextColor="#a6a6a6"
                  keyboardType="email-address"
                  onChangeText={(TextInputValue) =>
                    this.setState({ email: TextInputValue })
                  }
                />
                {/* <TextInput 
          style={styles.password}
          placeholder={strings.register_phone}
          keyboardType="numeric"
          onChangeText={ TextInputValue =>
           this.setState({mobile : TextInputValue }) }
        /> */}
                <Row
                  style={[
                    styles.password,
                    { width: this.state.screenWidth - 20 },
                  ]}
                >
                  <Col style={{ width: "23%" }}>
                    <Col
                      style={{
                        padding: 0,
                        paddingTop: 10,
                        backgroundColor: "transparent",
                        alignItems: "center",
                      }}
                    >
                      {
                        <Text
                          numberOfLines={1}
                          activeOpacity={0.5}
                          onPress={() => this.setState({ CC_list: true })}
                          style={{
                            fontFamily: colors.font_family_light,
                            fontSize: 13,
                            textAlign: "center",
                          }}
                        >
                          {this.state.telephone_code}{" "}
                          <Feather size={12} name="chevron-down" />
                        </Text>
                      }
                    </Col>
                  </Col>
                  <Col
                    style={{
                      width: 1,
                      marginTop: 4,
                      marginBottom: 4,
                      backgroundColor: colors.icons,
                    }}
                  ></Col>
                  <Col
                    style={{
                      width: "76%",
                      backgroundColor: "transparent",
                      justifyContent: "center",
                    }}
                  >
                    <TextInput
                      style={{
                        fontFamily: colors.font_family,
                        paddingLeft: Platform.OS == "ios" ? 10 : 5,
                        justifyContent: "center",
                      }}
                      placeholder={strings.register_phone}
                      placeholderTextColor="#a6a6a6"
                      underlineColorAndroid="transparent"
                      onChangeText={(TextInputValue) =>
                        this.setState({ mobile: TextInputValue })
                      }
                      value={this.state.mobile}
                      keyboardType={"decimal-pad"}
                    />
                  </Col>
                </Row>
                {/*} <TextInputMask
        style={styles.password}
        type={'cel-phone'}style={{ height: screenHeight * 0.065, borderRadius: 5, borderColor: colors.divider, borderWidth: 0.5, alignItems: "center", justifyContent: "center", paddingLeft: 4, paddingRight: 2, width: "30%" }}
        options={{style={{ height: screenHeight * 0.065, borderRadius: 5, borderColor: colors.divider, borderWidth: 0.5, alignItems: "center", paddingLeft: 10, width: "68%" }}
          maskType: 'INTERNATIONAL',
          withDDD: true,
          dddMask: '(99) '
        }}
        value={this.state.mobile}
        onChangeText={text => {
          this.setState({mobile : text })
        }}
        placeholder="MOBILE NUMBER"
      />*/}

                <TextInput
                  style={[
                    styles.password,
                    { width: this.state.screenWidth - 20 },
                  ]}
                  placeholder={strings.register_password}
                  placeholderTextColor="#a6a6a6"
                  secureTextEntry={true}
                  onChangeText={(TextInputValue) =>
                    this.setState({ password: TextInputValue })
                  }
                />
                <TextInput
                  style={[
                    styles.password,
                    { width: this.state.screenWidth - 20 },
                  ]}
                  placeholder={strings.register_confirm_password}
                  placeholderTextColor="#a6a6a6"
                  secureTextEntry={true}
                  onChangeText={(TextInputValue) =>
                    this.setState({ confirm_password: TextInputValue })
                  }
                />
                <View style={[{ width: "70%", marginTop: 35 }]}>
                  <AnimateLoadingButton
                    ref={(c) => (this.loadingButton = c)}
                    width={this.state.screenWidth - 20}
                    height={40}
                    title={strings.register}
                    titleFontSize={15}
                    titleFontFamily={colors.font_family}
                    titleColor={colors.theme_button_fg}
                    backgroundColor={colors.theme_fg}
                    borderRadius={5}
                    onPress={this.termsAndCond.bind(this)}
                  />
                </View>
                <View style={styles.forgotsec}>
                  <Text style={styles.forgotpassword}>
                    Already have an account?
                    <Text style={styles.clickhere} onPress={this.login}>
                      {" "}
                      Login
                    </Text>
                  </Text>
                </View>
                <View
                  style={[
                    { width: "90%", marginTop: 25, justifyContent: "center" },
                  ]}
                >
                  <Text style={[{ alignSelf: "center", fontSize: 12 }]}>
                    We use your information to offer you a personalised
                    experience and to better understand and improve our
                    services. No data is sold to third parties.
                  </Text>
                </View>
              </View>
            </Content>
          </KeyboardAvoidingView>
        </ScrollView>
        <CountrycodeModal
          style={{
            position: "absolute",
            width: "80%",
            height: "90%",
            borderRadius: 5,
            padding: 10,
          }}
          isOpen={this.state.CC_list}
          position={"center"}
          ref={"modal4"}
          onClosed={() => this.setState({ CC_list: false })}
        >
          <Row style={{ height: 65, backgroundColor: "transparent" }}>
            <Col style={{ justifyContent: "center", width: "90%" }}>
              <Text
                style={{
                  fontSize: 18,
                  color: "#a3a3a3",
                  fontFamily: colors.font_family_light,
                }}
              >
                {" "}
                Select your Country code
              </Text>
            </Col>
            <Col
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                width: "10%",
              }}
            >
              <Icon
                name="close"
                style={{ color: colors.icons, fontSize: 22 }}
                onPress={() => this.setState({ CC_list: false })}
              />
            </Col>
          </Row>
          <Col style={{ height: 50 }}>
            <TextInput
              style={styles.textInputStyle}
              onChangeText={(text) => this.SearchFilterFunction(text)}
              value={this.state.text}
              underlineColorAndroid="transparent"
              placeholder="Search Here"
            />
            <FlatList
              contentContainerStyle={{ marginTop: 10 }}
              data={
                this.state.dataSource.length > 0
                  ? this.state.dataSource
                  : this.state.dataSource1
              }
              //ItemSeparatorComponent={this.ListViewItemSeparator}
              renderItem={({ item }) => (
                <View style={{ height: 40 }}>
                  <TouchableOpacity
                    onPress={() => this.GetListViewItem(item.dial_code)}
                  >
                    <Text style={styles.listtextstyle}>
                      {item.name} {"(" + item.dial_code + ")"}
                    </Text>
                  </TouchableOpacity>
                  <Divider style={{ backgroundColor: "#e1e3e2" }} />
                </View>
              )}
              enableEmptySections={true}
              style={{ marginTop: 10 }}
              keyExtractor={(item, index) => index.toString()}
            />
          </Col>
        </CountrycodeModal>
        <CountrycodeModal
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 5,
            // padding: 10,
          }}
          isOpen={this.state.modalVisible}
          position={"center"}
          ref={"modal4"}
          swipeToClose={false}
          onClosed={() => this.setState({ modalVisible: false })}
          backdrop={false}
        >
          <WebView
            source={TermsAndConditions}
            style={{
              overflow: "scroll",
              height: Dimensions.get("window").height + 15,
              width: "120%",
              padding: 0,
              // flex:1
            }}
            textZoom={150}
            scalesPageToFit={true}
            originWhitelist={["*"]}
            mixedContentMode={"always"}
            useWebKit={Platform.OS == "ios"}
            // scrollEnabled={true}
            domStorageEnabled={true}
          />
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ isSelected: !this.state.isSelected });
              }}
              style={styles.checkboxContainer}
            >
              <Checkbox
                color={colors.theme_fg}
                status={this.state.isSelected ? "checked" : "unchecked"}
                onPress={() =>
                  this.setState({ isSelected: !this.state.isSelected })
                }
              />
              <Text style={styles.label}>I agree</Text>
            </TouchableOpacity>
            <Button
              onPress={() => this.setState({ modalVisible: false })}
              light
              style={{
                width: 70,
                height: 40,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "black" }}>Decline</Text>
            </Button>
            <Button
              onPress={() => {
                this.setState({
                  modalVisible: false,
                });
                this.send_otp();
              }}
              style={{
                width: 70,
                height: 40,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: this.state.isSelected
                  ? colors.theme_fg
                  : colors.tint_col,
              }}
              disabled={!this.state.isSelected}
            >
              <Text style={{ color: "#ffff" }}>Accept</Text>
            </Button>
          </View>
        </CountrycodeModal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  password: {
    height: 40,
    //width: 340,
    marginTop: 20,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: Platform.OS == "ios" ? 10 : 5,
  },
  forgotpassword: {
    color: colors.sp_subtext_fg,
    fontSize: 15,
  },
  clickhere: {
    color: colors.theme_fg,
    fontSize: 16,
  },
  forgotsec: {
    flex: 2,
    flexDirection: "row",
    marginTop: 25,
  },
  textInputStyle: {
    height: 40,
    fontFamily: colors.font_family_light,
    fontSize: 14,
    borderBottomColor: colors.theme_fg,
    borderBottomWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  listtextstyle: {
    fontSize: 14,
    fontFamily: colors.font_family,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    borderRadius: 5,
    borderColor: colors.header,
    borderWidth:1,
    // padding:3
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
