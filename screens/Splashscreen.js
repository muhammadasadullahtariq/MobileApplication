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
  StatusBar,
  AsyncStorage,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import SplashScreen from 'react-native-splash-screen'
import * as colors from "../assets/css/Colors";
import { BASE_URL, img_url } from "../config/Constants";
import strings from "./stringsoflanguages";

export default class Splashscreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      tax_percent: false, //for pull to refresh
      currency: false,
      stripe_details: false,
      default_language: "",
      // val:""
    };
  }
  async componentDidMount() {
    
    SplashScreen.hide();

    await AsyncStorage.getItem("language").then((value) =>
      this.setState({ default_language: value })
    );
    // const val=AsyncStorage.getItem('language')
    if (this.state.default_language == null) {
      await AsyncStorage.setItem("language", "en");
      await strings.setLanguage("en");
    } else {
      await AsyncStorage.getItem("language").then((value) =>
        this.setState({ default_language: value })
      );
      await strings.setLanguage(this.state.default_language);
    }
    await this.settings();
    //setTimeout(() => {
    this.resetMenu();
    //}, 3000);
  }
  settings = async () => {
    this.setState({ showIndicator: true });
    await fetch(BASE_URL + "settings/app_settings", {
      method: "post",
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "Content-Type": "application/json",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
      },
    })
      .then((response) => response.json())
      .then(async (res) => {
        global.tax_percent = res.result.tax_details.tax_percentage;
        global.currency = "N$ ";
        global.stripe_details = res.result.stripe_details;
        global.standard_delivery_fee = res.result.standard_fee;
        global.premium_delivery_fee = res.result.premium_fee;
        await AsyncStorage.setItem(
          "tax_delivery_charge",
          res.result.tax_details.tax_delivery_charge
        );
      })
      .catch((error) => {});
  };
  resetMenu() {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "RestaurantList",
          }),
        ],
      })
    );
  }
  render() {
    let greetings = "SplashScreen";
    return (
      <ImageBackground
        source={require(".././img/background.png")}
        style={{ width: "100%", height: "100%" ,flex:1}}
      >
        <View>
          <StatusBar
            barStyle="light-content"
            // dark-content, light-content and default
            hidden={false}
            //To hide statusBar
            backgroundColor={colors.status_bar}
            //Background color of statusBar only works for Android
            translucent={false}
            //allowing light, but not detailed shapes
            networkActivityIndicatorVisible={true}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require(".././img/dely_logo.png")}
          />
          {/*} <Text style={styles.appname} >Take Away</Text>*/}
        </View>
        <View style={styles.textcontainer}> 
        <Text style={styles.subtext}>From Ergo Analytics</Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textcontainer: {
    alignItems: "center",
  },
  appname: {
    color: colors.theme_fg,
    fontSize: 35,
    marginTop: 20,
    fontFamily: colors.font_family,
  },
  subtext: {
    marginBottom: 20,
    color: colors.sp_subtext_fg,
    fontSize: 14,
    fontFamily: colors.font_family,
  },
  logo: {
    width: 180,
    height: 140,
  },
});
