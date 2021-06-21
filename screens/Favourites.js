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
  Text,
  View,
  TouchableHighlight,
  BackHandler,
  ScrollView,
  TextInput,
  ActivityIndicator,
  AsyncStorage,
  Keyboard,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
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
  Thumbnail,
  Row,
  Col,
  Grid,
} from "native-base";
import { Divider } from "react-native-elements";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBox from "react-native-search-box";

import { Div } from "react-native-div";
import Snackbar from "react-native-snackbar";
import { NavigationActions, StackActions } from "react-navigation";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import * as colors from "../assets/css/Colors";
import GlobalFont from "react-native-global-font";
import { BASE_URL, img_url } from "../config/Constants";
import strings from "./stringsoflanguages";

let { width, height } = Dimensions.get("window");

export default class Favourites extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    //this.props.navigation.closeDrawer();
    this.state = {
      showIndicator: false,
      location_type: "restaurant",
      lat: "",
      lng: "",
      page: 0,
      rating: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").rating
        : 0,
      price: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").price
        : "low",
      language: "english",
      distance: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").distance
        : "nearest",
      keyword: "",
      responses: [],
      user_id: "0",
      favourite: 1,
      type: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").type
        : "restaurant",
    };
  }

  async componentDidMount() {
    this.setState({ showIndicator: true });
    let fontName = colors.font_family;
    GlobalFont.applyGlobal(fontName);
    await this.retrieveData();
    if (Platform.OS === "android") {
      await this.check_location();
    }
    await this.location_access();
  }

  moveLogin = () => {
    this.props.navigation.navigate("Login");
  };
  movefilter = () => {
    this.props.navigation.navigate("Filter", { filters: this.state });
  };

  addfavourite = (val, fav, key) => {
    if (this.state.user_id == 0) {
      this.moveLogin();
    } else {
      if (fav == 0) {
        fav = 1;
        var msg = "Added to favourites";
        this.state.responses[key].favorite = 1;
      } else {
        fav = 0;
        var msg = "Removed from favourites";
        this.state.responses[key].favorite = 0;
      }

      //this.setState({showIndicator:true});
      fetch(BASE_URL + "restaurantsList/favorite", {
        method: "post",
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "Content-Type": "application/json",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
        },
        body: JSON.stringify({
          location_id: val,
          customer_id: this.state.user_id,
          favorite: fav,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          //this.setState({showIndicator:false});

          this.showSnackbar(msg);

          this.List(false);
        })
        .catch((error) => {
          //this.setState({showIndicator:false});
          //this.loadingButton.showLoading(false);
          this.showSnackbar(strings.fav_something_went_wrong);
        });
    }
    //this.props.navigation.navigate('Filter',{ filters: this.state });
  };

  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      if (user_id !== null) {
        this.setState({ user_id: user_id });
      }
    } catch (error) {}
  };
  async check_location() {
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10,
      fastInterval: 50,
    })
      .then((data) => {
        if (data != "already-enabled") {
          this.List();
        }
      })
      .catch((err) => {
        this.setState({ showIndicator: false });
        this.showSnackbar(err.message);
      });
  }
  async location_access() {
    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        await this.setState({ lat: position.coords.latitude });
        await this.setState({ lng: position.coords.longitude });
        await this.List();
      },
      (error) => {
        this.setState({ showIndicator: false });
        this.showSnackbar(error.message);
      }
    );
  }
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  hotelDetail = (location_id) => {
    this.props.navigation.navigate("RestaurantDetail", {
      details: this.state.responses[location_id],
    });
  };

  menu = (location_id) => {

    this.state.details = this.state.responses[location_id]

    if (this.state.details.categories.length > 0) {
      //this.props.navigation.navigate('Menu');
      if (this.state.user_id == 0) {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Login",
                params: { details: this.state.details },
              }),
            ],
          })
        );
      } else {
        /*this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Menu',
            params: { details: this.state.details,from:'restaurant_details' },
          }),
        ],
      }))*/
        this.props.navigation.navigate("Menu", {
          details: this.state.details,
          from: "RestaurantList",
        });
      }
    } else {
      this.showSnackbar("This outlet has no menu available right now!");
    }
  };

  /*async componentDidMount()
  {
    this.mounted = true;
    console.log("hai")
   
  }*/

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    this.watchID != null && navigator.geolocation.clearWatch(this.watchID);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  reload = () => {
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
  };

  List = async (load = true) => {
    if (load) {
      this.setState({ showIndicator: true });
    }
    fetch(BASE_URL + "restaurantsList/getNearByRestaurants", {
      method: "post",
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "Content-Type": "application/json",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
      },
      body: JSON.stringify({
        location_type: this.state.location_type,
        c_lat: this.state.lat,
        c_lng: this.state.lng,
        page: this.state.page,
        rating: this.state.rating,
        price: this.state.price,
        language: this.state.language,
        distance: this.state.distance,
        keyword: this.state.keyword,
        customer_id: this.state.user_id,
        favorite: this.state.favourite,
        food_type: this.state.type,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          responses: res.result,
        });
        this.setState({ showIndicator: false });
      })
      .catch((error) => {
        this.setState({ showIndicator: false });
        this.showSnackbar(strings.fav_something_went_wrong);
      });
  };
  handleKeyDown = (e) => {
    console.log(e);
    if (e.nativeEvent.key == "Done") {
      dismissKeyboard();
      this.List();
    }
  };

  render() {
    /*RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
        if (granted) {
          this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
            alert(JSON.stringify(locations));
          })
        }
      });*/
    let name = this.state.responses.map((val, key) => {
      return (
        <View>
          <Grid style={{ opacity: val.open_status == 0 ? 0.5 : 1, marginBottom: 5, }}>
            <Col style={{ width: 100 }}>
              <TouchableHighlight onPress={this.menu.bind(this, key)}>
                <Thumbnail
                  style={{ width: 100, height: 100, borderRadius: 5 }}
                  square
                  source={{ uri: img_url + val.profile_image }}
                />
              </TouchableHighlight>
            </Col>
            <Col>
              <Row>
                <Left style={{ width: "80%" }}>
                  <Text
                    onPress={this.menu.bind(this, key)}
                    style={styles.name}
                    numberOfLines={1}
                  >
                    {val.location_name}
                  </Text>
                </Left>
                <Right style={{ width: "20%" }}>
                <Text
                    onPress={() =>
                      this.addfavourite(val.location_id, val.favorite, key)
                    }
                  >
                    <MaterialCommunityIcons
                      style={{ color: colors.theme_fg, fontSize: 18 }}
                      name={val.favorite > 0 ? "heart" : "heart-outline"}
                    />
                  </Text>
                </Right>
              </Row>
              <Text
                onPress={this.menu.bind(this, key)}
                style={styles.description}
                numberOfLines={1}
              >
                {val.description}
              </Text>
              <Row
                style={styles.contentrow}
                onPress={this.menu.bind(this, key)}
              >
                <Left>
                  {val.open_status == 0 ? (
                    <View style={{ zIndex: 2 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.theme_fg,
                          fontFamily: colors.font_family,
                        }}
                      >
                        {strings.closed}
                      </Text>
                    </View>
                  ) : null}
                </Left>
                {val.minimum_price > 0 ? (
                  <Right style={{ width: 120 }}>
                    {/* <Button
                      bordered
                      warning
                      style={styles.choosebtn}
                      onPress={this.hotelDetail.bind(this, key)}
                    >
                      <Text
                        style={{
                          color: colors.theme_button_fg,
                          fontSize: 11,
                          paddingLeft: 5,
                          paddingRight: 5,
                        }}
                      >
                        Starts from {global.currency} {val.minimum_price}
                      </Text>
                    </Button> */}
                  </Right>
                ) : null}
              </Row>
              <Row
                style={styles.contentrow}
                onPress={this.menu.bind(this, key)}
              >
                {/*<Left><Button bordered warning style={styles.ratingbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='star' />{parseFloat(val.location_ratings).toFixed(1)}</Text></Button></Left>*/}
                <Left>
                  <Div
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={{ fontSize: 12, padding: 0 }}>
                      <Icon
                        style={{ fontSize: 14, color: colors.star_icons }}
                        name="star"
                      />{" "}
                      {parseFloat(val.location_ratings).toFixed(1)}
                    </Text>
                  </Div>
                </Left>
                {/*<Right style={{ marginRight:10 }} ><Button bordered warning style={styles.locationbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='pin' /> {parseInt(val.distance)} KMS</Text></Button></Right>*/}
                <Right>
                  <Div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      <Icon
                        style={{ fontSize: 14, color: colors.location }}
                        name="pin"
                      />{" "}
                      {parseInt(val.distance) > 1
                        ? parseInt(val.distance) + "KMS"
                        : parseInt(val.distance) + "KM"}
                    </Text>
                  </Div>
                </Right>
              </Row>

            </Col>
          </Grid>
          <Divider
            style={{ backgroundColor: colors.divider, marginBottom: 10 }}
          />
        </View>
      );
    });
    if (this.state.showIndicator) {
      return (
        <Container>
          <Header
            style={{
              backgroundColor: colors.header,
              borderBottomColor: colors.header,
            }}
            androidStatusBarColor={colors.header}
          >
           <StatusBar
              barStyle="light-content"
              backgroundColor={colors.status_bar}
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
              <Title style={{ alignSelf: "center", color: colors.theme_button_fg }}>
                <Text>
                  {strings.my_favourites}
                </Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.theme_fg} />
          </View>
        </Container>
      );
    } else {
      return (
        <Container>
          <Header
            style={{
              backgroundColor: colors.header,
              borderBottomColor: colors.header,
            }}
            androidStatusBarColor={colors.header}
          >
                        <StatusBar
              barStyle="light-content"
              backgroundColor={colors.status_bar}
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
                <Text>{strings.my_favourites}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>

          <Content style={styles.rows}>
            <ScrollView>
              {name == "" && (
                <Body
                  style={{
                    marginTop: height / 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Row>
                    <Thumbnail
                      style={{
                        height: 150,
                        width: 150,
                      }}
                      square
                      source={require(".././assets/img/no_data.png")}
                    ></Thumbnail>
                  </Row>
                  <Row>
                    <Text
                      style={{
                        marginTop: 15,
                      }}
                    >
                      {strings.sorry_no_data_available}
                    </Text>
                  </Row>
                  <Row>
                    <Button
                      small
                      onPress={this.reload}
                      style={{
                        marginTop: 15,
                        backgroundColor: colors.theme_fg,
                        borderRadius: 4,
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
                        {strings.show_all}
                      </Text>
                    </Button>
                  </Row>
                </Body>
              )}
              {name}
            </ScrollView>
          </Content>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg_one,
  },

  rows: {
    padding: 10,
  },
  show_all: {
    width: "100%",
  },
  name: {
    color: colors.theme_fg,
    fontSize: 16,
    textAlign: "left",
    marginLeft: 10,
  },
  description: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 10,
    color: colors.sub_font,
  },
  contentrow: {
    marginLeft: 5,
  },
  list: {
    //borderRadius:5,
    //borderWidth: 1,
    //borderColor: '#FD4431',
    marginBottom: 10,
  },

  choosebtn: {
    backgroundColor: colors.theme_fg,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    height: 27,
    color: colors.theme_button_fg,
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.theme_button_fg,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  searchIcon: {
    padding: 5,
    color: "#817C7B",
  },
  filterIcon: {
    padding: 5,
    color: colors.theme_button_fg,
    backgroundColor: colors.theme_fg,
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: colors.theme_button_fg,
    color: colors.sub_font,
    fontFamily: colors.font_family,
  },
});
