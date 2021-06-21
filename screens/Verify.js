import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  Keyboard,
  Image,
  StatusBar,
  AsyncStorage,
  Alert,
  BackHandler,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  Row,
  Container,
  Header,
  Content,
  Col,
  Input,
  View,
  Button,
  Card,
  Icon,
} from "native-base";
import { NavigationActions, StackActions } from "react-navigation";
import * as colors from "../assets/css/Colors";
import { BASE_URL, img_url } from "../config/Constants";
import AnimateLoadingButton from "react-native-animate-loading-button";
import strings from "./stringsoflanguages";
import { Form } from "react-native-form-validation";
import { Divider } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import CountDown from "react-native-countdown-component";
import Snackbar from "react-native-snackbar";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("screen").width;
export default class Verify extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    super(props);
    this.state = {
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input: [],
      validation: false,
      cc_code: this.props.navigation.getParam("code"),
      F_name: this.props.navigation.getParam("first_name"),
      L_name: this.props.navigation.getParam("last_name"),
      mobile: this.props.navigation.getParam("mobile"),
      password: this.props.navigation.getParam("password"),
      confirm_pass: this.props.navigation.getParam("confirm_password"),
      email: this.props.navigation.getParam("email"),
      code: this.props.navigation.getParam("otp"),
      timertime: 60 * 5,
      screenHeight: Dimensions.get("window").height,
      screenWidth: Dimensions.get("screen").width,
    };
    this.split_no();
  }
  // componentWillMount() {
  //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  // componentWillUnmount() {
  //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  split_no = async () => {
    for (let i = 0; i < this.state.code.length; i++) {
      // this.setState({input[i]:this.state.code.charAt(i)})
      this.state.input.push(this.state.code.charAt(i));
    }
    //console.log(this.state.input[0])
    // await this.setState({
    //     input1:await this.state.input[0],
    //     input2:await this.state.input[1],
    //     input3:await this.state.input[2],
    //     input4:await this.state.input[3]
    // })
    //console.log("code",this.state.code,this.state.F_name,this.state.L_name,this.state.email,this.state.password,this.state.mobile)
  };
  checkValidate() {
    if (
      this.state.email == "" ||
      this.state.mobile == "" ||
      this.state.password == "" ||
      this.state.F_name == "" ||
      this.state.L_name == "" ||
      this.state.confirm_pass == ""
    ) {
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Please fill all mandatory fields.");
    }

    if (
      this.state.password != this.state.confirm_pass &&
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
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  handleBackButtonClick() {
    this.props.navigation.navigate("Register");
    return true;
  }
  send_otp = () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    this.checkValidate();
    if (this.state.validation) {
      var details = {
        email: this.state.email,
        telephone: this.state.mobile,
        country_code: this.state.cc_code,
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
          console.log(res);
          if (res.message != "Success") {
            await this.loadingButton.showLoading(false);
            await this.showSnackbar(res.message);
          } else {
            var otp = res.otp.toString();
            await this.loadingButton.showLoading(false);
            await this.setState({ code: otp, timertime: 60 * 10, input: [] });
            await this.split_no();
            //await this.props.navigation.navigate("Verify",{otp:otp,email:this.state.email,mobile:this.state.mobile,first_name:this.state.first_name,last_name:this.state.last_name,password:this.state.password,confirm_password:this.state.confirm_password,code:this.state.telephone_code})
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          this.showSnackbar("Something went wrong");
        });
    }
  };
  timesUp = async () => {
    await Alert.alert("", "Do you want to resend otp ?", [
      {
        text: "Cancel",
        onPress: () => this.props.navigation.navigate("Register"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await this.send_otp();
        },
      },
    ]);
  };
  Register = async () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    await this.checkValidate();
    if (this.state.validation) {
      fetch(BASE_URL + "user/register", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: JSON.stringify({
          first_name: this.state.F_name,
          last_name: this.state.L_name,
          telephone: this.state.mobile,
          email: this.state.email,
          password: this.state.password,
          user_name: this.state.user_name,
          country_code: this.state.cc_code,
          //"otp":this.state.code,
          deviceid: "1234567",
        }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          console.log("res", res);
          if (res.message != "Registered Successfully") {
            await this.loadingButton.showLoading(false);
            await this.showSnackbar(res.message);
            //this.resetMenu();
          } else {
            await this.loadingButton.showLoading(false);
            await this.showSnackbar(res.message);
            await this.props.navigation.navigate("RestaurantList");
            //this.props.navigation.navigate('Login');
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          //alert(JSON.stringify(error));
          this.showSnackbar("Something went wrong");
        });
    }
  };

  checkotp = async () => {
    Keyboard.dismiss();
    if (
      this.state.input1 == this.state.input[0] &&
      this.state.input2 == this.state.input[1] &&
      this.state.input3 == this.state.input[2] &&
      this.state.input4 == this.state.input[3]
    ) {
      await this.Register();
    } else {
      this.showSnackbar("Invalid Otp");
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
  render() {
    return (
      <Container style={Styles.container}>
        <Header style={{ backgroundColor: colors.header }}>
          <StatusBar
            barStyle="light-content"
            // dark-content, light-content and default
            hidden={false}
            //To hide statusBar
            backgroundColor={colors.header}
            //Background color of statusBar only works for Android
            translucent={false}
            //allowing light, but not detailed shapes
            networkActivityIndicatorVisible={true}
          />
          <Row style={{ alignItems: "center" }}>
            <Col style={{ width: "10%", alignItems: "center" }}>
              <Icon
                onPress={() => {
                  this.handleBackButtonClick();
                }}
                style={{
                  color: colors.theme_button_fg,
                  fontSize: 25,
                  marginLeft: 15,
                }}
                name="arrow-back"
              />
            </Col>

            <Col style={{ width: "90%", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: colors.font_family_bold,
                  fontSize: 18,
                  color: colors.theme_button_fg,
                  marginRight: "7%",
                }}
              >
                Verification
              </Text>
            </Col>
          </Row>
        </Header>
        <ScrollView keyboardShouldPersistTaps="always">
            {/* <ImageBackground
              // source={require("../../assets/images/header.jpg")}
              source={require(".././img/headery.png")}
              style={{
                flexDirection: "column",
                height: screenHeight * 0.3,
                width: screenWidth * 1,
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
            </ImageBackground> */}
              <Row
                style={{
                  margin: 20,
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
              <Text
                style={{
                  color: colors.theme_fg,
                  fontSize: 30,
                  marginTop: 5,
                  fontFamily: colors.font_family_bold,
                  alignItems: "center"
                }}
              >
               OTP
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
                We have sent a 4 digit number to your given phone number. Enter it below to continue.
              </Text>
              </Row>
              <Divider
                style={{
                  backgroundColor: colors.divider,
                  marginTop: screenHeight * 0.01,
                  marginHorizontal: 20,
                  marginBottom: screenHeight * 0.05,
                }}
              />
              <View style={{ alignItems: "center" }}>
                <Row style={{ justifyContent: "space-between", width: "80%" }}>
                  <TextInput
                    style={{
                      width: "12%",
                      borderBottomWidth: 1,
                      textAlign: "center",
                      borderBottomColor: colors.theme_fg,
                    }}
                    onChangeText={(TextInputValue) => {
                      this.setState({ input1: TextInputValue });
                      if (TextInputValue) this.refs.input_2.focus();
                    }}
                    maxLength={1}
                    ref="input_1"
                    value={this.state.input1}
                    keyboardType={"decimal-pad"}
                  />
                  <TextInput
                    style={{
                      width: "12%",
                      borderBottomWidth: 1,
                      textAlign: "center",
                      borderBottomColor: colors.theme_fg,
                    }}
                    onChangeText={(TextInputValue) => {
                      this.setState({ input2: TextInputValue });
                      if (TextInputValue) this.refs.input_3.focus();
                      else this.refs.input_1.focus();
                    }}
                    value={this.state.input2}
                    maxLength={1}
                    ref="input_2"
                    keyboardType={"decimal-pad"}
                  />
                  <TextInput
                    style={{
                      width: "12%",
                      borderBottomWidth: 1,
                      textAlign: "center",
                      borderBottomColor: colors.theme_fg,
                    }}
                    onChangeText={(TextInputValue) => {
                      this.setState({ input3: TextInputValue });
                      if (TextInputValue) this.refs.input_4.focus();
                      else this.refs.input_2.focus();
                    }}
                    value={this.state.input3}
                    maxLength={1}
                    ref="input_3"
                    keyboardType={"decimal-pad"}
                  />
                  <TextInput
                    style={{
                      width: "12%",
                      borderBottomWidth: 1,
                      textAlign: "center",
                      borderBottomColor: colors.theme_fg,
                    }}
                    onChangeText={(TextInputValue) => {
                      this.setState({ input4: TextInputValue });
                      if (!TextInputValue) this.refs.input_3.focus();
                    }}
                    value={this.state.input4}
                    maxLength={1}
                    ref="input_4"
                    keyboardType={"decimal-pad"}
                  />
                  {/* <TextInput style={{width:"12%",borderBottomWidth:1,borderBottomColor:colors.theme_fg}}>
                            </TextInput>
                            <TextInput style={{width:"12%",borderBottomWidth:1,borderBottomColor:colors.theme_fg}}>
                            </TextInput> */}
                </Row>
              </View>
              <View
                style={{ marginTop: screenHeight * 0.06, alignItems: "center" }}
              >
                <AnimateLoadingButton
                  ref={(c) => (this.loadingButton = c)}
                  width={this.state.screenWidth - 20}
                  height={40}
                  title={"VERIFY"}
                  titleFontSize={15}
                  titleFontFamily={colors.font_family}
                  titleColor={colors.theme_button_fg}
                  backgroundColor={colors.theme_fg}
                  borderRadius={10}
                  onPress={this.checkotp.bind(this)}
                />
                <Text
                  style={{
                    marginTop: 10,
                    color: colors.theme_fg,
                    fontFamily: colors.font_family_bold,
                  }}
                >
                  Resend in
                </Text>
                <CountDown
                  until={this.state.timertime}
                  size={13}
                  onFinish={() => this.timesUp()}
                  digitStyle={{ backgroundColor: "#FFF" }}
                  timeToShow={["M", "S"]}
                  timeLabels={{ m: "MM", s: "SS" }}
                />
              </View>
        </ScrollView>
      </Container>
    );
  }
}

const Styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});
