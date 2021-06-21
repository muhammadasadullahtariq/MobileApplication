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
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  View,
  Dimensions,
  Alert,
  StatusBar,
} from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Icon,
  Content,
  Row,
  Col,
  Thumbnail,
} from "native-base";
import AnimateLoadingButton from "react-native-animate-loading-button";
import Snackbar from "react-native-snackbar";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL } from "../config/Constants";

import { Divider } from "react-native-elements";

import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";

export default class ManageAddress extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      showIndicator: true,
      from_add: this.props.navigation.getParam("from_add"),
      customer_id: this.props.navigation.getParam("customer_id"),
      validation: true,
      details: this.props.navigation.getParam("details"),
      address: [],
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
    };
  }

  async componentDidMount() {
    this.setState({ showIndicator: true });
    this.subs = [
      this.props.navigation.addListener("didFocus", (payload) =>
        this.componentDidFocus(payload)
      ),
    ];
    await this.get_address();
  }
  async componentDidFocus() {
    if (this.props.navigation.getParam("from_add") > 0) {
      this.setState({ showIndicator: true });
      await this.get_address();
    }
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

  onBackButtonPressed() {
    Snackbar.show({
      title: "Please press back above",
      duration: Snackbar.LENGTH_SHORT,
    });
    return true;
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
    /*this.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Cart',
          params: {details:this.state.details },
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

  get_address = async () => {
    this.setState({ showIndicator: true });
    if (this.state.validation) {
      fetch(
        BASE_URL + "user/viewAddress?customer_id=" + this.state.customer_id,
        {
          method: "get",
          headers: {
            Authorization: "Basic YWRtaW46MTIzNA==",
            "Content-Type": "application/json",
            "X-API-KEY": "RfTjWnZr4u7x!A-D",
          },
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          if (res.message != "Address List") {
            this.setState({ showIndicator: false });
            this.showSnackbar(res.message.error);
          } else {
            await this.setState({ address: res.result });
            this.setState({ showIndicator: false });
          }
        })
        .catch((error) => {
          this.setState({ showIndicator: false });
          this.showSnackbar(strings.manage_something_went_wrong);
        });
    }
  };
  addaddress = () => {
    this.props.navigation.navigate("Address");
    this.props.navigation.navigate("Address", {
      customer_id: this.state.user_id,
      details: this.state.details,
    });
  };
  choose_address = (val) => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "Cart",
            params: { default_id: val, details: this.state.details },
          }),
        ],
      })
    );
    //this.props.navigation.navigate('Cart',{default_id : val });
  };
  setdefault = (id) => {
    Alert.alert(
      "Confirm",
      "Are you sure want to change Default Address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            fetch(BASE_URL + "user/defaultAddress", {
              method: "post",
              headers: {
                Authorization: "Basic YWRtaW46MTIzNA==",
                "Content-Type": "application/json",
                "X-API-KEY": "RfTjWnZr4u7x!A-D",
              },
              body: JSON.stringify({
                id: id,
                customer_id: this.state.customer_id,
              }),
            })
              .then((response) => response.json())
              .then(async (res) => {
                if (res.message != "Address updated Successfully") {
                  this.showSnackbar(res.message);
                } else {
                  this.showSnackbar("Default Address changed Successfully");
                  this.get_address();
                }
              })
              .catch((error) => {
                this.setState({ showIndicator: false });
                this.showSnackbar(strings.manage_something_went_wrong);
              }),
        },
      ],
      { cancelable: true }
    );
  };
  remove_confirm = (id, defaultadd) => {
    if (defaultadd == "on") {
      Alert.alert("Error", "Default address cannot be deleted!!", [
        { text: "OK" },
      ]);
    } else {
      Alert.alert(
        "Confirm",
        "Are you sure want to Remove Address?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => this.remove_address(id) },
        ],
        { cancelable: true }
      );
    }
  };
  remove_address = (id) => {
    this.setState({ showIndicator: true });

    fetch(BASE_URL + "user/removeAddress", {
      method: "post",
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "Content-Type": "application/json",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then(async (res) => {
        if (res.message != strings.address_deleted_successfully) {
          this.showSnackbar(res.message);
        } else {
          fetch(
            BASE_URL + "user/viewAddress?customer_id=" + this.state.customer_id,
            {
              method: "get",
              headers: {
                Authorization: "Basic YWRtaW46MTIzNA==",
                "Content-Type": "application/json",
                "X-API-KEY": "RfTjWnZr4u7x!A-D",
              },
            }
          )
            .then((response) => response.json())
            .then(async (res) => {
              if (res.message != "Address List") {
                await this.setState({ address: [] });
                this.setState({ showIndicator: false });
                this.showSnackbar(res.message.error);
              } else {
                await this.setState({ address: res.result });
                this.setState({ showIndicator: false });
                this.showSnackbar(strings.removed_successfully);
              }
            })
            .catch((error) => {
              //alert(JSON.stringify(error));
              this.setState({ showIndicator: false });
              this.showSnackbar(strings.manage_something_went_wrong);
            });
        }
      })
      .catch((error) => {
        this.setState({ showIndicator: false });
        this.showSnackbar(strings.manage_something_went_wrong);
      });
  };

  render() {
    let addresses = this.state.address.map((val, key) => {
      return (
        <View style={styles.firstblock}>
          <TouchableOpacity onPress={() => this.choose_address(val.address_id)}>
            <Row
              style={{
                // width: "100%",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {/* <FontAwesome5 style={styles.icon} name="building" /> */}
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 10,
                    fontFamily: colors.font_family_bold,
                    color: colors.theme_fg,
                  }}
                >
                  {" "}
                  {val.specification == "" ? "Home" : val.specification}
                </Text>
              </View>
            </Row>
          </TouchableOpacity>
          <Divider style={{ marginTop: 2.5, marginHorizontal: 5, backgroundColor: colors.tint_col }} />
          <Row style={{ marginBottom: 5, marginHorizontal: 5 }}>
            <Col style={{ width: "70%" }}>
              <Text style={styles.address}>{val.address_1}</Text>
              {val.address_2 ? (
                <Text style={styles.address}>
                  {strings.plot_no3} {val.address_2}
                </Text>
              ) : null}
            </Col>
            <Col style={{ width: "30%", height: "100%", alignItems: "flex-end"}}>
            <TouchableOpacity
                style={
                  val.default_address == "on"
                    ? styles.ratingbtn_default
                    : styles.ratingbtn
                }
                onPress={
                  val.default_address == "off"
                    ? () => this.setdefault(val.address_id)
                    : ""
                }
              >
                <Text
                  style={{
                    fontSize: 12,
                    color:
                      val.default_address == "on"
                        ? colors.theme_button_fg
                        : colors.theme_fg,
                    textAlign: "center",
                    alignSelf:'center',
                    justifyContent:'center',
                    alignItems:'center'
                  }}
                >
                  {val.default_address == "on"
                    ? strings.default
                    : strings.set_us_default}
                </Text>
              </TouchableOpacity>

              <Text
                onPress={() =>
                  this.remove_confirm(val.address_id, val.default_address)
                }
                style={{
                  fontSize: 14,
                  color: colors.theme_fg,
                  marginTop: 15,
                  marginBottom: 5,
                  alignSelf: "flex-end",
                }}
              >
                {strings.remove}
              </Text>
            </Col>
          </Row>
        </View>
      );
    });
    if (this.state.showIndicator) {
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
            <Left style={{ flex: 1, color: colors.theme_button_fg }}>
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
                <Text>{strings.manage_address}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.theme_button_fg} />
          </View>
          {/* <Row
            style={
              {
                marginTop: 20,
                marginBottom: 20,
                marginRight: 20,
                marginLeft: 20,
              }
            }
          >
            <AnimateLoadingButton
              width={this.state.screenWidth - 20}
              height={40}
              title={strings.add_new_address}
              titleFontSize={15}
              titleColor={colors.theme_button_fg}
              backgroundColor={colors.theme_fg}
              borderRadius={10}
              onPress={this.addaddress}
              titleFontFamily={colors.font_family}
            />
          </Row> */}
        </Container>
      );
    } else {
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
            <Left style={{ flex: 1, color: colors.theme_button_fg }}>
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
                <Text>{strings.manage_address}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>

          <ScrollView style={{ padding: 10 }}>
            {/* {addresses != "" && (
              <Row style={{ marginTop: 10, marginLeft: 5, marginBottom: 10 }}>
                <Text
                  style={{
                    color: colors.theme_fg,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {strings.saved_address}
                </Text>
              </Row>
            )} */}
            {addresses == "" && (
              <Body style={{ marginTop: 50,  }}>
                <Thumbnail
                  style={{
                    height: 150,
                    width: 150,
                    marginBottom: 15,
                  }}
                  square
                  source={require(".././assets/img/no_data.png")}
                ></Thumbnail>
                <Text>{strings.sorry_no_data_available}</Text>
              </Body>
            )}
            {addresses}
            <Row
              style={{
                marginTop: 10,
                marginBottom: 20,
                // marginRight: 20,
                // marginLeft: 20,
              }}
            >
              <AnimateLoadingButton
                width={this.state.screenWidth - 20}
                height={40}
                title={strings.add_new_address_btn}
                titleFontSize={15}
                titleColor={colors.theme_button_fg}
                backgroundColor={colors.theme_fg}
                borderRadius={5}
                onPress={this.addaddress}
                titleFontFamily={colors.font_family}
                // fontWeight={"bold"}
              />
            </Row>
          </ScrollView>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  ratingbtn_default: {
    marginTop: 12,
    fontSize: 10,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: colors.theme_fg,
    marginLeft: 10,
    borderRadius: 5,
    padding:5,
    textAlign: "center",
    elevation: 1
  },
  ratingbtn: {
    marginTop: 12,
    fontSize: 10,
    backgroundColor: colors.theme_button_fg,
    marginLeft: 10,
    borderRadius: 5,
    padding:5,
    alignItems:'center',
    justifyContent:'center',
    textAlign: 'center',
    elevation: 1
  },
  icon: {
    color: colors.theme_fg,
    fontSize: 20,
    marginTop: 10,
    // marginLeft: 20,
    textAlign: "center",
  },
  address: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 15,
    // marginLeft: 20,
    color: colors.sub_font,
  },
  firstblock: {
    backgroundColor: colors.bg_two,
    // width: "90%",
    // marginLeft: "5%",
    // marginRight: "5%",
    marginBottom: 10,
    borderRadius: 5,
    padding: 5,
    // elevation: 5,
    // shadowOffset: { height: 2, width: 0 },
    // shadowOpacity: 1.8,
    // shadowColor: colors.shadow,
    // borderColor: colors.divider,
  },
});
