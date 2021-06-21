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
  StyleSheet,
  ScrollView,
  Text,
  View,
  BackHandler,
  Image,
  ImageBackground,
  AsyncStorage,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  StatusBar,
} from "react-native";
import { Form } from "react-native-form-validation";
import { NavigationActions, StackActions } from "react-navigation";
import {
  Container,
  Content,
  Left,
  Row,
  Col,
  Tabs,
  Tab,
  Item,
  Label,
  Input,
  Body,
  Thumbnail,
  Header,
  Button,
} from "native-base";
import Snackbar from "react-native-snackbar";
//import PhotoUpload from 'react-native-photo-upload';
import { BASE_URL, img_url } from "../config/Constants";
import AnimateLoadingButton from "react-native-animate-loading-button";
import ImagePicker from "react-native-image-picker";
/* Include color file */
import * as colors from "../assets/css/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import RNFetchBlob from "react-native-fetch-blob";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import Dialog from "react-native-dialog";
import PhoneInput from "react-native-phone-input";
import strings from "./stringsoflanguages";
let { width, height } = Dimensions.get("window");

const options = {
  title: "Select a photo",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose from gallery",
};

export default class Profile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.scrollView = null;
    //this.props.navigation.closeDrawer();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      showIndicator: false,
      customer_id: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      profile_picture: "",
      data: null,
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
      validation: false,
      profile_validation: false,
      old_password: "",
      new_password: "",
      confirm_password: "",
      dialogVisible: false,
      spinner: true,
    };
  }
  select_photo() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          profile_picture: source,
          data: response.data,
        });
        this.profileimageupdate();
      }
    });
  }

  async componentDidMount() {
    this.setState({ showIndicator: true });
    await this.retrieveData();
    if (this.state.customer_id != 0) {
      await this.get_profile();
    }
    //await this.default_address();
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

    //this.props.navigation.navigate('RestaurantList');
    //this.props.navigation.goBack(null);
    //  return true;
  }
  navigateToScreen = () => {
    //this.props.navigation.closeDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: "RestaurantList",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");

      if (user_id > 0) {
        await this.setState({ customer_id: user_id });
      } else {
        this.setState({ showIndicator: false });
      }
    } catch (error) {}
  };

  login = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Login",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  get_profile = async () => {
    fetch(BASE_URL + "user/viewProfile", {
      method: "POST",
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "Content-Type": "application/json",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
      },
      body: JSON.stringify({
        id: this.state.customer_id,
      }),
    })
      .then((response) => response.json())
      .then(async (res) => {
        if (res.message != "Success") {
          this.setState({ showIndicator: false });
          this.showSnackbar(res.message);
        } else {
          var source = "";
          if (res.result.profile_picture) {
            source = { uri: img_url + "/" + res.result.profile_picture };
          } else {
            source = { uri: img_url + "/profile_images/no-pic.png" };
          }
          await this.setState({
            first_name: res.result.first_name,
            last_name: res.result.last_name,
            phone: res.result.telephone,
            email: res.result.email,
            profile_picture: source,
          });
          this.setState({ showIndicator: false });
          //this.setState({showIndicator:false});
          //this.props.navigation.navigate('Login');
          //this.resetMenu();
        }
      })
      .catch((error) => {
        //alert(JSON.stringify(error));
        this.setState({ showIndicator: false });
        this.showSnackbar(strings.profile_something_went_wrong);
      });
  };
  profileupdate = async () => {
    Keyboard.dismiss();
    this.loadingButton.showLoading(true);
    this.checkProfileValidate();

    if (this.state.profile_validation) {
      var add_details = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        telephone: this.state.phone,
        id: this.state.customer_id,
      };
      var formBody = [];
      for (var property in add_details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(add_details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      fetch(BASE_URL + "user/editProfile", {
        method: "POST",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: formBody,
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.message != "User Profile Updated Successfully") {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message);
          } else {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message);
            this.setState({
              first_name: res.result.first_name,
              last_name: res.result.last_name,
              phone: res.result.telephone,
              email: res.result.email,
              //profile_picture : res.result.profile_picture
            });
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          this.showSnackbar(strings.profile_something_went_wrong);
        });
    }
  };

  profileimageupdate = async () => {
    RNFetchBlob.fetch(
      "POST",
      BASE_URL + "user/profileImageUpdate",
      {
        Authorization: "Bearer access-token",
        otherHeader: "foo",
        Authorization: "Basic YWRtaW46MTIzNA==",
        "Content-Type": "multipart/form-data",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
      },
      [
        {
          name: "profile_picture",
          filename: "image.png",
          type: "image/png",
          data: this.state.data,
        },
        {
          name: "user_id",
          data: this.state.customer_id,
        },
      ]
    )
      .then((resp) => {
        this.showSnackbar(strings.updated_successfully);
      })
      .catch((err) => {
        this.showSnackbar(strings.error_on_while_uploading);
      });
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  passwordupdate = async () => {
    this.loadingButtonPwd.showLoading(true);
    this.checkValidate();
    if (this.state.validation) {
      fetch(BASE_URL + "user/passwordupdate", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: JSON.stringify({
          user_id: this.state.customer_id,
          old_pass: this.state.old_password,
          new_pass: this.state.new_password,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.message != "Success") {
            this.loadingButtonPwd.showLoading(false);
            this.showSnackbar(res.message);
          } else {
            this.setState({
              new_password: "",
              old_password: "",
              confirm_password: "",
            });
            this.loadingButtonPwd.showLoading(false);
            this.showSnackbar(res.content);
          }
        })
        .catch((error) => {
          this.loadingButtonPwd.showLoading(false);
          //this.showSnackbar("Something went wrong");
        });
    }
  };
  checkValidate() {
    if (
      this.state.confirm_password == "" ||
      this.state.new_password == "" ||
      this.state.old_password == ""
    ) {
      this.loadingButtonPwd.showLoading(false);
      this.state.validation = false;
      this.showSnackbar(strings.password_cannote_be_empty);
      return true;
    } else {
      if (this.state.new_password != this.state.confirm_password) {
        this.loadingButtonPwd.showLoading(false);
        this.state.validation = false;
        this.showSnackbar(strings.password_mismatch);
        return true;
      } else {
        if (this.checkPassword(this.state.new_password)) {
          this.state.validation = true;
          this.loadingButtonPwd.showLoading(false);
        } else {
          this.loadingButtonPwd.showLoading(false);
          this.state.validation = false;
          this.showSnackbar(strings.password_must_be);
          return true;
        }
      }
    }
  }
  checkProfileValidate() {
    if (
      this.state.email == "" ||
      this.state.phone == "" ||
      this.state.first_name == "" ||
      this.state.last_name == ""
    ) {
      this.loadingButton.showLoading(false);
      this.state.profile_validation = false;
      this.showSnackbar(strings.please_fill_all_mandatory_fields);
      return true;
    } else {
      if (this.checkphone(this.state.phone)) {
        this.loadingButton.showLoading(false);
        this.state.profile_validation = true;
      } else {
        this.showSnackbar(strings.enter_a_valid_phone_number);
        this.loadingButton.showLoading(false);
        this.state.profile_validation = false;
      }
    }
  }
  checkphone(inputtxt) {
    var phoneno = /^\+?([0-9]{1,2})\)?[-.]?([0-9]{8,12})$/;
    return phoneno.test(inputtxt);
  }
  checkPassword(str) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(str);
  }
  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    this.storeData();
    const navigateAction = NavigationActions.navigate({
      routeName: "Logout",
    });
    this.props.navigation.dispatch(navigateAction);
    this.setState({ dialogVisible: false });
  };

  showfavourites = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    const navigateAction = NavigationActions.navigate({
      routeName: "Favourites",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  storeData = async () => {
    try {
      await AsyncStorage.setItem("user_id", "0");
      await AsyncStorage.setItem("name", "");
      await AsyncStorage.setItem("phone", "");
      await AsyncStorage.setItem("email", "");
      await AsyncStorage.setItem("default_address", "0");
    } catch (error) {
      this.showSnackbar(strings.profile_something_went_wrong);
    }
  };

  render() {
    if (this.state.showIndicator) {
      return (
        <Container>
          <View>
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
          </View>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.theme_fg} />
          </View>
        </Container>
      );
    } else {
      if (this.state.customer_id == 0) {
        return (
          <Container style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ borderBottomWidth: 0 }}>
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
            </View>
            {
              //for making all empty icons center as cart page looks like
            }
            {/* <Header
              style={{ elevation: 0, backgroundColor: "white", width: "100%", shadowOpacity: 0, }}
            ></Header> */}
            <Body style={{ justifyContent: "center", alignItems: "center" }}>
              <Thumbnail
                style={{
                  height: 150,
                  width: 150,
                }}
                square
                source={require(".././assets/img/no_data.png")}
              ></Thumbnail>
              <Text style={{ marginTop: 15 }}>
                {strings.you_must_login_to_view_this_page}
              </Text>

              <Button
                small
                onPress={this.login}
                style={{
                  marginTop: 15,
                  backgroundColor: colors.theme_fg,
                  borderRadius: 2,
                }}
              >
                <Text
                  style={{
                    paddingRight: 20,
                    paddingLeft: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    color: colors.theme_button_fg,
                  }}
                >
                  Login
                </Text>
              </Button>
            </Body>
          </Container>
        );
      } else {
        return (
          <Container androidStatusBarColor={colors.header}>
            <View>
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
            </View>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>{strings.logout}</Dialog.Title>
              <Dialog.Description>
                {strings.do_you_want_to_logout}
              </Dialog.Description>
              <Dialog.Button label={strings.yes} onPress={this.handleDelete} />
              <Dialog.Button label={strings.no} onPress={this.handleCancel} />
            </Dialog.Container>
            <ImageBackground
              source={require(".././img/BG_profle.png")}
              style={{ height: height * 0.3, width: "100%" }}
            >
              <Row
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                  marginTop: 20,
                }}
              >
                <Col style={{ width: "30%" }}>
                  <TouchableOpacity onPress={this.select_photo.bind(this)}>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: colors.divider,
                      }}
                      resizeMode="cover"
                      source={this.state.profile_picture}
                    />
                  </TouchableOpacity>
                </Col>
                <Col style={{ width: "60%" }}>
                  <Left style={{ justifyContent: "center" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: colors.header,
                        textAlign: "left",
                      }}
                    >
                      {this.state.first_name} {this.state.last_name}
                    </Text>
                    <Text
                      style={{
                        color: colors.header,
                      }}
                    >
                      {this.state.email}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        textDecorationLine: "underline",
                        color: colors.header,
                      }}
                      onPress={this.showfavourites}
                    >
                      {strings.myfavourites_txt}
                    </Text>
                  </Left>
                </Col>
                <Col style={{ width: "10%" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: colors.header,
                      textAlign: "center",
                    }}
                    onPress={this.showDialog}
                  >
                    <MaterialCommunityIcons
                      style={{ color: colors.header, fontSize: 26 }}
                      name="logout"
                    />
                  </Text>
                </Col>
              </Row>
            </ImageBackground>

            <Tabs tabBarUnderlineStyle={{ backgroundColor: colors.theme_fg }}>
              <Tab
                heading={strings.general}
                tabStyle={{ backgroundColor: colors.bg_one }}
                activeTabStyle={{ backgroundColor: colors.bg_one }}
                textStyle={{
                  color: colors.sp_subtext_fg,
                  fontFamily: colors.font_family,
                }}
                activeTextStyle={{
                  color: colors.theme_fg,
                  fontFamily: colors.font_family,
                  fontWeight: "normal",
                }}
              >
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
                  <Content style={{ marginBottom: 20, marginTop: 20 }}>
                    <Form style={{ marginRight: 20, marginLeft: 10 }}>
                      <Item
                        stackedLabel
                        style={{ borderColor: colors.divider }}
                      >
                        <Label style={{ color: colors.theme_fg }}>
                          {strings.first_name}
                        </Label>
                        <Input
                          ref="first_name"
                          style={{
                            color: colors.sub_font,
                            fontFamily: colors.font_family,
                          }}
                          onChangeText={(TextInputValue) =>
                            this.setState({ first_name: TextInputValue })
                          }
                          value={this.state.first_name}
                        />
                      </Item>
                      <Item
                        stackedLabel
                        style={{ borderColor: colors.divider }}
                      >
                        <Label style={{ color: colors.theme_fg }}>
                          {strings.last_name}
                        </Label>
                        <Input
                          ref="last_name"
                          style={{
                            color: colors.sub_font,
                            fontFamily: colors.font_family,
                          }}
                          onChangeText={(TextInputValue) =>
                            this.setState({ last_name: TextInputValue })
                          }
                          value={this.state.last_name}
                        />
                      </Item>

                      <Item
                        stackedLabel
                        style={{ borderColor: colors.divider }}
                      >
                        <Label style={{ color: colors.theme_fg }}>
                          {strings.phone}
                        </Label>
                        <Input
                          ref="phone"
                          keyboardType="numeric"
                          style={{
                            color: colors.sub_font,
                            fontFamily: colors.font_family,
                          }}
                          disabled={true}
                          onChangeText={(TextInputValue) =>
                            this.setState({ phone: TextInputValue })
                          }
                          value={this.state.phone}
                        />
                        {/*<PhoneInput 
                  style={{marginTop:15,marginBottom:15,paddingLeft:5}}
                  textStyle={{color: colors.sub_font,fontFamily: colors.font_family}}
                  ref='phone'
                  isValidNumber={false}
                  onChangePhoneNumber={ (Value) =>
                    this.setState({phone : Value }) }
                  value={this.state.phone}
                  autoFormat={false}
                  />*/}
                      </Item>

                      {/*} <Item stackedLabel style={{ borderColor: colors.divider }}>
                <Label style={{ color: colors.theme_fg }}>E-mail</Label>
                <Input ref="email" style={{ color: colors.sub_font,fontFamily: colors.font_family  }} onChangeText={TextInputValue => this.setState({ email: TextInputValue })} value={this.state.email} />
                  </Item>*/}

                      <Row
                        style={{
                          // justifyContent: "center",
                          // alignItems: "center",
                          marginTop: 10,
                          // marginRight: 10,
                          // marginLeft: 10,
                        }}
                      >
                        <AnimateLoadingButton
                          ref={(c) => (this.loadingButton = c)}
                          width={this.state.screenWidth - 20}
                          height={40}
                          title={strings.update_profile}
                          titleFontSize={15}
                          titleColor={colors.theme_button_fg}
                          backgroundColor={colors.theme_fg}
                          borderRadius={5}
                          onPress={this.profileupdate}
                          titleFontFamily={colors.font_family}
                        />
                      </Row>
                    </Form>
                  </Content>
                </KeyboardAwareScrollView>
              </Tab>
              <Tab
                heading={strings.reset_password}
                tabStyle={{ backgroundColor: colors.bg_one }}
                activeTabStyle={{ backgroundColor: colors.bg_one }}
                textStyle={{
                  color: colors.sp_subtext_fg,
                  fontFamily: colors.font_family,
                }}
                activeTextStyle={{
                  color: colors.theme_fg,
                  fontFamily: colors.font_family,
                  fontWeight: "normal",
                }}
              >
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
                  <Content style={{ marginBottom: 20, marginTop: 20 }}>
                    <Form style={{ marginRight: 20, marginLeft: 10 }}>
                      <Item
                        stackedLabel
                        style={{ borderColor: colors.divider }}
                      >
                        <Label style={{ color: colors.theme_fg }}>
                          {strings.old_password}
                        </Label>
                        <Input
                          ref="old_password"
                          secureTextEntry={true}
                          style={{
                            color: colors.sub_font,
                            fontFamily: colors.font_family,
                          }}
                          onChangeText={(TextInputValue) =>
                            this.setState({ old_password: TextInputValue })
                          }
                          value={this.state.old_password}
                        />
                      </Item>
                      <Item
                        stackedLabel
                        style={{ borderColor: colors.divider }}
                      >
                        <Label style={{ color: colors.theme_fg }}>
                          {strings.new_password}
                        </Label>
                        <Input
                          ref="new_password"
                          secureTextEntry={true}
                          style={{
                            color: colors.sub_font,
                            fontFamily: colors.font_family,
                          }}
                          onChangeText={(TextInputValue) =>
                            this.setState({ new_password: TextInputValue })
                          }
                          value={this.state.new_password}
                        />
                      </Item>
                      <Item
                        stackedLabel
                        style={{ borderColor: colors.divider }}
                      >
                        <Label style={{ color: colors.theme_fg }}>
                          {strings.confirm_password}
                        </Label>
                        <Input
                          ref="confirm_password"
                          secureTextEntry={true}
                          style={{
                            color: colors.sub_font,
                            fontFamily: colors.font_family,
                          }}
                          onChangeText={(TextInputValue) =>
                            this.setState({ confirm_password: TextInputValue })
                          }
                          value={this.state.confirm_password}
                        />
                      </Item>

                      <Row
                        style={{
                          // justifyContent: "center",
                          // alignItems: "center",
                          marginTop: 10,
                          // marginRight: 10,
                          // marginLeft: 10,
                        }}
                      >
                        <AnimateLoadingButton
                          ref={(c) => (this.loadingButtonPwd = c)}
                          width={this.state.screenWidth - 20}
                          height={40}
                          title={strings.update_password}
                          titleFontSize={15}
                          titleColor={colors.theme_button_fg}
                          backgroundColor={colors.theme_fg}
                          borderRadius={5}
                          onPress={this.passwordupdate}
                          titleFontFamily={colors.font_family}
                        />
                      </Row>
                    </Form>
                  </Content>
                </KeyboardAwareScrollView>
              </Tab>
            </Tabs>
          </Container>
        );
      }
    } // Loader
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultFontFamily: {
    fontFamily: "",
  },
});
