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
  Alert,
  BackHandler,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import CodeInput from "react-native-confirmation-code-input";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Icon,
} from "native-base";
import { NavigationActions, StackActions } from "react-navigation";
import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";
let { width, height } = Dimensions.get("window");

export default class Otp extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  _onFinishCheckingCode2(isValid, code) {
    //console.log(isValid);
    if (!isValid) {
      Alert.alert("Unsuccessful", "Code does not match!", [{ text: "OK" }], {
        cancelable: false,
      });
    } else {
      this.setState({ code });
      /*Alert.alert(
        'Confirmation Code',
        'Successfully verified',
        [{text: 'OK'}],
        { cancelable: false }
      );*/
      this.resetMenu();
    }
  }

  resetMenu() {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "ResetPassword",
            params: { customer_id: this.state.customer_id },
          }),
        ],
      })
    );
  }

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  state = {
    otp: this.props.navigation.getParam("otp"),
    customer_id: this.props.navigation.getParam("customer_id"),
  };

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
              <Text>{strings.enter_otp}</Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
        {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled={Platform.OS === "android"} keyboardVerticalOffset={-60}> */}

        <View style={styles.container}>
          
          <View style={[{ marginTop: "15%" }]}></View>
          <Text style={styles.forgotdesc}>
            {strings.enter_the_code_you_have_received_by}
          </Text>
          <Text style={styles.forgotdesc}>
            {strings.email_in_order_to_verify_account}
          </Text>
          <View
            style={[{ height: "20%", marginTop: "5%", textAlign: "center" }]}
          >
            <CodeInput
              ref="codeInputRef2"
              keyboardType="numeric"
              codeLength={4}
              className="border-circle"
              compareWithCode={this.state.otp}
              autoFocus={false}
              codeInputStyle={{
                fontWeight: "800",
                fontFamily: colors.font_family,
              }}
              activeColor={colors.theme_fg}
              inactiveColor={colors.theme_fg}
              onFulfill={(isValid, code) =>
                this._onFinishCheckingCode2(isValid, code)
              }
            />
          </View>
        </View>
        {/* </KeyboardAvoidingView> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  forgotdesc: {
    color: colors.sp_subtext_fg,
    fontSize: 14,
  },
});
