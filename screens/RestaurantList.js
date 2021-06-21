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
  ActivityIndicator,
  AsyncStorage,
  Platform,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  RefreshControl,
  StatusBar,
  PermissionsAndroid,
  Animated,
  TouchableOpacity,
  Alert,
  Modal,
  AppState,
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBox from "react-native-search-box";
import { Div } from "react-native-div";
import Snackbar from "react-native-snackbar";
import {
  NavigationActions,
  StackActions,
  withNavigationFocus,
} from "react-navigation";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { RadioButton, shadow } from "react-native-paper";
import * as colors from "../assets/css/Colors";
import GlobalFont from "react-native-global-font";
import { BASE_URL, img_url, GOOGLE_KEY } from "../config/Constants";
import strings from "./stringsoflanguages";
import RNRestart from "react-native-restart";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

let { width, height } = Dimensions.get("window");

export default class RestaurantList extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    //this.props.navigation.closeDrawer();
    this.state = {
      showIndicator: false,
      location_type: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").location_type
        : "restaurant",
      lat: "",
      lng: "",
      dlat: "",
      dlng: "",
      page: 0,
      rating: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").rating
        : 0,
      price: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").price
        : "",
      language: "english",
      distance: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").distance
        : "nearest",
      keyword: "",
      responses: [],
      user_id: "0",
      favourite: this.props.navigation.getParam("favourite")
        ? this.props.navigation.getParam("favourite")
        : 0,
      type: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").type
        : "both",
      result_count: 0,
      loading: false, // user list loading
      isRefreshing: false, //for pull to refresh
      Connected: false,
      backClickCount: 0,
      translate_modalVisible: false,
      checked: "",
      language: "",
      headerName: "",
      appState: AppState.currentState,
    };
  }

  componentDidMount = async () => {
    // this.props.navigation.addListener("didFocus", this.componentDidFocus);
    AppState.addEventListener("change", this._handleAppStateChange);
    this.setState({ showIndicator: true });
    let fontName = colors.font_family;
    GlobalFont.applyGlobal(fontName);
    await this.retrieveData();
    if (Platform.OS === "android") {
      await this.check_location();
    }
    await this.language();
    await this.location_access();
    await this.headerName();
    if (global.currency == undefined) {
      await this.settings();
    }
    await this.List();
  };
  // async componentDidFocus() {
  //   await this.retrieveData();
  // }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.regetData();
    }
    this.setState({ appState: nextAppState });
  };
  language = async () => {
    await AsyncStorage.setItem("language", this.state.checked);
  };
  // _retrive_Language=async()=>{

  // }
  /*componentDidFocus= async ()=>{
    
   
    
   }*/

  headerName = () => {
    if (this.state.location_type === "restaurant") {
      this.state.headerName = "Meals";
    } else if (this.state.location_type === "alcohol") {
      this.state.headerName = "Drinks";
    } else if (this.state.location_type === "groceries") {
      this.state.headerName = "Groceries";
    } else if (this.state.location_type === "supplies") {
      this.state.headerName = "Supplies";
    }
  };

  menu = (location_id) => {
    this.state.details = this.state.responses[location_id];

    if (this.state.details.categories.length > 0) {
      //this.props.navigation.navigate('Menu');
      if (this.state.user_id == 0) {
        // this.props.navigation.dispatch(
        //   StackActions.reset({
        //     index: 0,
        //     actions: [
        //       NavigationActions.navigate({
        //         routeName: "Login",
        //         params: { details: this.state.details },
        //       }),
        //     ],
        //   })
        // );
        this.props.navigation.navigate("Login", {
          details: this.state.details,
        });
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
      this.showSnackbar("This outlet has no menu avaliable right now!");
    }
  };

  settings = async () => {
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
        global.currency = res.result.currency_symbol;
        this.setState({ showIndicator: false });
      })
      .catch((error) => {
        this.setState({ showIndicator: false });
      });
  };
  moveLogin = () => {
    this.props.navigation.navigate("Login");
  };
  movefilter = () => {
    this.props.navigation.navigate("Filter", { filters: this.state });
  };
  moveTranslate = (visible) => {
    this.setState({ translate_modalVisible: visible });
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
          this.showSnackbar(msg);

          this.List(false, "fav");
        })
        .catch((error) => {
          //this.setState({showIndicator:false});
          //this.loadingButton.showLoading(false);
          this.showSnackbar("Something went wrong");
        });
    }
    //this.props.navigation.navigate('Filter',{ filters: this.state });
  };

  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      await AsyncStorage.getItem("language").then((value) =>
        this.setState({ language: value })
      );
      if (user_id !== null && this.state.language !== null) {
        //alert("hi")
        this.setState({ user_id: user_id, checked: this.state.language });
      } else {
        this.setState({ checked: this.state.language });
      }
    } catch (error) {}
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.theme_fg,
    });
  }

  hotelDetail = (location_id) => {
    this.props.navigation.navigate("RestaurantDetail", {
      details: this.state.responses[location_id],
    });
  };

  /*async componentDidMount()
  {
    this.mounted = true;
    console.log("hai")
   
  }*/
  gotoaddress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "ManageAddress",
    });
    this.props.navigation.dispatch(navigateAction);
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
      .catch(async (err) => {
        await this.setState({ showIndicator: false });
        //this.showSnackbar(err.message);
      });
  }
  async location_access() {
    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        //await this.setState({ lat: -22.55941 /*position.coords.latitude*/ });
        //await this.setState({ lng: 17.08323 /*position.coords.longitude*/ });
        await this.setState({lat: position.coords.latitude });
        await this.setState({lng: position.coords.longitude });
        await this.List();
      },
      async (error) => {
        await this.regetData()
        await this.setState({ showIndicator: false });
        this.showSnackbar(error.message);
        navigator.geolocation.requestAuthorization();
        if (error.message == "Location request timed out") {
          this.regetData();
        }
      },
      { enableHighAccuracy: false, timeout: 30000 }
    );
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
    this.watchID != null && navigator.geolocation.clearWatch(this.watchID);
  }

  _spring() {
    var cnt = this.state.backClickCount + 1;
    this.setState({ backClickCount: cnt });
  }

  handleBackButtonClick = () => {
    if (this.state.backClickCount == 2) {
      Alert.alert(
        strings.exit_app,
        strings.exit,
        [
          {
            text: strings.no,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: strings.yes, onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
    } else {
      this._spring();
    }

    return true;
  };

  default_address = async () => {
    fetch(
      BASE_URL +
        "user/getdefaultAddress?customer_id=" +
        this.state.user_id +
        "&address_id=" +
        0,
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
        } else {
          await this.setState({ lat: res.result.clatitude});
          await this.setState({ lng: res.result.clongitude});
          //console.log("AdressssssssSASASASASsss", this.state.lng)
          await this.reList();
        }
      })
      .catch((error) => {
        //alert(JSON.stringify(error));
      });
  };
  regetData = async () => {
    // this.setState({ showIndicator: true });
    // let fontName = colors.font_family;
    // GlobalFont.applyGlobal(fontName);
    // await this.retrieveData();
    // if (Platform.OS === "android") {
    //   await this.check_location();
    // }
    // await this.language();
    // await this.location_access();
    // await this.headerName();
    // if (global.currency == undefined) {
    //   await this.settings();
    // }
    this.List(true,'fav');
  };
  reload = async () => {
    await AsyncStorage.getItem("language").then((value) =>
      this.setState({ language: value })
    );
    await strings.setLanguage(this.state.language);
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

  reList = async (load = true, from = "", loc_type = "") => {

    if (this.state.lat == '') {
      await this.setState({ lat: -22.55941 /*position.coords.latitude*/ });
      await this.setState({ lng: 17.08323 /*position.coords.longitude*/ });
    }

    if (loc_type != "") {
      await this.setState({ location_type: loc_type });
      await this.headerName();
    }
    if (load) {
      this.setState({ showIndicator: false, loading: false });
    }
    //console.log(this.state.location_type, from)
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
        //console.log("RES",res);
        let listData = this.state.responses;
        if (from == "fav") {
          var data = res.result;
        } else {
          //var data = listData.concat(res.result);
          var data = res.result;
        }
        //console.log("responses data====> ", data);
        this.setState({
          responses: data,
          page: res.next_offset,
          next_offset: res.next_offset,
          result_count: res.result.length,
        });
        this.setState({ loading: false, showIndicator: false });
      })
      .catch((error) => {
        this.setState({ loading: false, showIndicator: false });
        this.showSnackbar("Something went wrong");
      });
  };

  List = async (load = true, from = "", loc_type = "") => {

    if (this.state.lat == '') {

      // Alert.alert(
      //   "Did you give access to your location?",
      //   "We could not determine your location. We will show you a list based off of the center of Windhoek",
      //   [
      //     { text: "OK" },
      //   ],
      //   { cancelable: false }
      // );
      this.showSnackbar("Here's a list while we wait for your location :)");

      await this.setState({ lat: -22.55941 /*position.coords.latitude*/ });
      await this.setState({ lng: 17.08323 /*position.coords.longitude*/ });

    }

    console.log("YESSSSSSSSSSSSSSSZSSSSSSSSSSSSASSSSASASASSASASASASASDASAS",this.state.lat ,this.state.lng)


    if (loc_type != "") {
      await this.setState({ location_type: loc_type });
      await this.headerName();
    }
    if (load) {
      this.setState({ showIndicator: true, loading: true });
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
        //console.log("RES",res);
        let listData = this.state.responses;
        if (from == "fav") {
          var data = res.result;
        } else {
          //var data = listData.concat(res.result);
          var data = res.result;
        }
        //console.log("responses data====> ", data);
        this.setState({
          responses: data,
          page: res.next_offset,
          next_offset: res.next_offset,
          result_count: res.result.length,
        });
        this.setState({ loading: false, showIndicator: false });
      })
      .catch((error) => {
        this.setState({ loading: false, showIndicator: false });
        this.showSnackbar("Something went wrong");
      });
  };
  handleRefresh = () => {
    this.List();
  };
  handleLoadMore = () => {
    if (!this.state.showIndicator && this.state.page !== 0) {
      this.state.page = this.state.page;
      this.List(false);
    }
  };
  /*renderFooter = () => {
    return(
      <View>
      <ActivityIndicator size="large" color="#FF6149" />
      </View>
    )
  }*/

  closeModal = async () => {
    await this.setState({ translate_modalVisible: false });
    await this.language();
    //await this.retrieveData();
    await this.reload();

    //RNRestart.Restart();
    //this.props.navigation.addListener('didFocus', this.componentDidFocus);
  };

  render() {
    const { checked } = this.state;
    if (this.state.showIndicator) {
      return (
        <Container>
          <Header
            style={{
              backgroundColor: colors.header,
              //height: Platform.OS === "ios" ? 35 : 0,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            }}
            androidStatusBarColor={colors.header}
          >
            <StatusBar barStyle="light-content" />

            <Left style={{ flex: 3 }}>
              <Title style={{ color: colors.theme_button_fg }}>
                <Text style={{ textAlign: "left" }}>
                  {this.state.headerName}
                </Text>
              </Title>
            </Left>
            <Right>
              {this.state.user_id == 0 ? (
                <Button onPress={this.moveLogin} transparent>
                  <Icon
                    style={{ color: colors.theme_button_fg, fontSize: 24 }}
                    name="person"
                  />
                </Button>
              ) : null}
              {/* <Button onPress={() => { this.moveTranslate(!this.state.translate_modalVisible) }} style={{ paddingRight: 20 }} transparent>
                <MaterialCommunityIcons style={{ color: colors.theme_button_fg, fontSize: 24, paddingLeft: 0 }} name='google-translate' />
              </Button> */}
              <Button
                onPress={this.movefilter}
                style={{ paddingLeft: 2, paddingRight: 10 }}
                transparent
              >
                <MaterialCommunityIcons
                  style={{
                    color: colors.theme_button_fg,
                    fontSize: 24,
                    paddingLeft: 0,
                  }}
                  name="tune"
                />
              </Button>
            </Right>
          </Header>
          <SearchBox
            ref="search_box"
            placeholder={strings.search_for_restaurants_and_foods}
            searchIconExpandedMargin={20}
            searchIconCollapsedMargin={
              Dimensions.get("window").width / 2 - (15 + 20)
            }
            placeholderExpandedMargin={40}
            placeholderCollapsedMargin={
              Dimensions.get("window").width / 2 - (15 + 40)
            }
            onChangeText={(keyword) =>
              this.setState({ keyword: keyword, responses: [], page: 0 })
            }
            onSearch={(val) => (val != "" ? this.List() : null)}
            onCancel={() => this.List()}
            value={this.state.keyword}
            style={{ textAlign: "left" }}
            backgroundColor={colors.header}
          />
                    <View
                        style={styles.cat_bar}
                      >
                        <Button
                          small
                          style={
                            this.state.location_type == "restaurant"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "restaurant" ? this.List(true, "fav", "restaurant") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "restaurant"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Meals
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "groceries"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "groceries" ? this.List(true, "fav", "groceries") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "groceries"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Groceries
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "supplies"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "supplies" ? this.List(true, "fav", "supplies") : null}
                          
                        >
                    <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "supplies"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Supplies
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "alcohol"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "alcohol" ? this.List(true, "fav", "alcohol") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "alcohol"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Drinks
                          </Text>
                        </Button>

                      </View>

          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.theme_fg} />
          </View>
          <Modal
            visible={this.state.translate_modalVisible}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.moveTranslate(!this.state.translate_modalVisible);
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ translate_modalVisible: false });
              }}
            >
              <View style={styles.model_view}>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={colors.status_bar}
                  networkActivityIndicatorVisible={true}
                />
                <View style={styles.model_view1}>
                  <Container
                    style={{
                      width: "80%",
                      borderRadius: Dimensions.get("screen").height * 0.01,
                    }}
                  >
                    <Header
                      style={{
                        height: Dimensions.get("screen").height * 0.07,
                        backgroundColor: colors.header,
                        borderBottomColor: colors.header,
                        borderTopLeftRadius:
                          Dimensions.get("screen").height * 0.01,
                        borderTopRightRadius:
                          Dimensions.get("screen").height * 0.01,
                      }}
                    >
                      <StatusBar
                        barStyle="light-content"
                        backgroundColor={colors.status_bar}
                        networkActivityIndicatorVisible={true}
                      />
                      <Row
                        style={{
                          backgroundColor: "transparent",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{ width: "85%", alignItems: "flex-start" }}
                        >
                          <Text style={{ fontSize: 20, color: "white" }}>
                            Select Language
                          </Text>
                        </View>
                        <View style={{ width: "15%", alignItems: "flex-end" }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.closeModal();
                            }}
                          >
                            <Icon
                              name="close"
                              style={{
                                color: "#fff",
                                fontSize:
                                  Dimensions.get("screen").height * 0.024,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </Row>
                    </Header>
                    <SearchBox
                          ref="search_box"
                          placeholder={strings.search_for_restaurants_and_foods}
                          searchIconExpandedMargin={20}
                          searchIconCollapsedMargin={
                            Dimensions.get("window").width / 2 - (15 + 20)
                          }
                          placeholderExpandedMargin={40}
                          placeholderCollapsedMargin={
                            Dimensions.get("window").width / 2 - (15 + 40)
                          }
                          onChangeText={(keyword) =>
                            this.setState({ keyword: keyword, responses: [], page: 0 })
                          }
                          onSearch={(val) => (val != "" ? this.List() : null)}
                          onCancel={() => this.List()}
                          value={this.state.keyword}
                          style={{ textAlign: "left" }}
                          backgroundColor={colors.header}
                        />
                    <View
                        style={styles.cat_bar}
                        >
                        <Button
                          small
                          style={
                            this.state.location_type == "restaurant"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "restaurant" ? this.List(true, "fav", "restaurant") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "restaurant"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Meals
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "groceries"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "groceries" ? this.List(true, "fav", "groceries") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "groceries"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Groceries
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "supplies"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "supplies" ? this.List(true, "fav", "supplies") : null}                          
                        >
                    <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "supplies"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Supplies
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "alcohol"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "alcohol" ? this.List(true, "fav", "alcohol") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "alcohol"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Drinks
                          </Text>
                        </Button>

                      </View>
                    <Content showsVerticalScrollIndicator={false}>
                      <TouchableWithoutFeedback>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ checked: "es" }, this.closeModal);
                            }}
                          >
                            <Row
                              style={{
                                height: Dimensions.get("screen").height * 0.07,
                              }}
                            >
                              <Left>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    marginLeft:
                                      Dimensions.get("screen").width * 0.01,
                                  }}
                                >
                                  Spanish
                                </Text>
                              </Left>
                              <Right>
                                <RadioButton
                                  color={colors.theme_fg}
                                  uncheckedColor={colors.theme_fg}
                                  value="Spanish"
                                  status={
                                    checked === "es" ? "checked" : "unchecked"
                                  }
                                  onPress={() => {
                                    this.setState({ checked: "es" }),
                                      this.closeModal;
                                  }}
                                />
                              </Right>
                            </Row>
                          </TouchableOpacity>
                          <Divider style={{ backgroundColor: "#a3a3a3" }} />
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ checked: "en" }, this.closeModal);
                            }}
                          >
                            <Row
                              style={{
                                height: Dimensions.get("screen").height * 0.065,
                              }}
                            >
                              <Left>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    marginLeft:
                                      Dimensions.get("screen").width * 0.01,
                                  }}
                                >
                                  English
                                </Text>
                              </Left>
                              <Right>
                                <RadioButton
                                  color={colors.theme_fg}
                                  uncheckedColor={colors.theme_fg}
                                  value="English"
                                  status={
                                    checked === "en" ? "checked" : "unchecked"
                                  }
                                  onPress={() => {
                                    this.setState(
                                      { checked: "en" },
                                      this.closeModal
                                    );
                                  }}
                                />
                              </Right>
                            </Row>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </Content>
                  </Container>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </Container>
      );
    } else {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            style={{
              backgroundColor: colors.header,
              borderBottomColor: colors.header,
              borderBottomWidth: 0,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0,
              elevation: 0,
            }}
            androidStatusBarColor={colors.header}
          >
            <StatusBar barStyle="light-content" />

            <Left style={{ flex: 3 }}>
              <Title style={{ color: colors.theme_button_fg }}>
                <Text style={{ textAlign: "left" }}>
                  {this.state.headerName}
                </Text>
              </Title>
            </Left>
            <Right>
              {this.state.user_id == 0 ? (
                <Button onPress={this.moveLogin} transparent>
                  <Icon
                    style={{ color: colors.theme_button_fg, fontSize: 24 }}
                    name="person"
                  />
                </Button>
              ) : null}
              {/* <Button onPress={() => { this.moveTranslate(!this.state.translate_modalVisible) }} style={{ paddingRight: 20 }} transparent>
                <MaterialCommunityIcons style={{ color: colors.theme_button_fg, fontSize: 24, paddingLeft: 0 }} name='google-translate' />
              </Button> */}
              <Button
                onPress={this.movefilter}
                style={{ paddingLeft: 2, paddingRight: 10 }}
                transparent
              >
                <MaterialCommunityIcons
                  style={{
                    color: colors.theme_button_fg,
                    fontSize: 24,
                    paddingLeft: 0,
                  }}
                  name="tune"
                />
              </Button>
            </Right>
          </Header>
          <Modal
            visible={this.state.translate_modalVisible}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.moveTranslate(!this.state.translate_modalVisible);
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ translate_modalVisible: false });
              }}
            >
              <View style={styles.model_view}>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={colors.status_bar}
                  networkActivityIndicatorVisible={true}
                />
                <View style={styles.model_view1}>
                  <Container
                    style={{
                      width: "80%",
                      borderRadius: Dimensions.get("screen").height * 0.01,
                    }}
                  >
                    <Header
                      style={{
                        height: Dimensions.get("screen").height * 0.07,
                        backgroundColor: colors.header,
                        borderBottomColor: colors.header,

                        borderTopLeftRadius:
                          Dimensions.get("screen").height * 0.01,
                        borderTopRightRadius:
                          Dimensions.get("screen").height * 0.01,
                      }}
                    >
                      <StatusBar
                        barStyle="light-content"
                        backgroundColor={colors.status_bar}
                        networkActivityIndicatorVisible={true}
                      />
                      <Row
                        style={{
                          backgroundColor: "transparent",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{ width: "85%", alignItems: "flex-start" }}
                        >
                          <Text
                            style={{
                              fontSize: Dimensions.get("screen").height * 0.024,
                              color: "white",
                            }}
                          >
                            Select Language
                          </Text>
                        </View>
                        <View style={{ width: "15%", alignItems: "flex-end" }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.closeModal();
                            }}
                          >
                            <Icon
                              name="close"
                              style={{
                                color: "#fff",
                                fontSize:
                                  Dimensions.get("screen").height * 0.024,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </Row>
                    </Header>
                    <Content showsVerticalScrollIndicator={false}>
                      <TouchableWithoutFeedback>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ checked: "es" }, this.closeModal);
                            }}
                          >
                            <Row
                              style={{
                                height: Dimensions.get("screen").height * 0.07,
                              }}
                            >
                              <Left>
                                <Text
                                  style={{
                                    fontSize:
                                      Dimensions.get("screen").height * 0.02,
                                    marginLeft:
                                      Dimensions.get("screen").width * 0.01,
                                  }}
                                >
                                  Spanish
                                </Text>
                              </Left>
                              <Right>
                                <RadioButton
                                  color={colors.theme_fg}
                                  uncheckedColor={colors.theme_fg}
                                  value="Spanish"
                                  status={
                                    checked === "es" ? "checked" : "unchecked"
                                  }
                                  onPress={() => {
                                    this.setState({ checked: "es" }),
                                      this.closeModal;
                                  }}
                                />
                              </Right>
                            </Row>
                          </TouchableOpacity>
                          <Divider style={{ backgroundColor: "#a3a3a3" }} />
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ checked: "en" }, this.closeModal);
                            }}
                          >
                            <Row
                              style={{
                                height: Dimensions.get("screen").height * 0.065,
                              }}
                            >
                              <Left>
                                <Text
                                  style={{
                                    fontSize:
                                      Dimensions.get("screen").height * 0.02,
                                    marginLeft:
                                      Dimensions.get("screen").width * 0.01,
                                  }}
                                >
                                  English
                                </Text>
                              </Left>
                              <Right>
                                <RadioButton
                                  color={colors.theme_fg}
                                  uncheckedColor={colors.theme_fg}
                                  value="English"
                                  status={
                                    checked === "en" ? "checked" : "unchecked"
                                  }
                                  onPress={() => {
                                    this.setState(
                                      { checked: "en" },
                                      this.closeModal
                                    );
                                  }}
                                />
                              </Right>
                            </Row>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </Content>
                  </Container>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <SearchBox
            ref="search_box"
            placeholder={strings.search_for_restaurants_and_foods}
            searchIconExpandedMargin={20}
            searchIconCollapsedMargin={
              Dimensions.get("window").width / 2 - (15 + 20)
            }
            placeholderExpandedMargin={40}
            placeholderCollapsedMargin={
              Dimensions.get("window").width / 2 - (15 + 40)
            }
            onChangeText={(keyword) =>
              this.setState({ keyword: keyword, responses: [], page: 0 })
            }
            onSearch={(val) => (val != "" ? this.List() : null)}
            onCancel={() => this.List()}
            value={this.state.keyword}
            style={{ textAlign: "left" }}
            backgroundColor={colors.header}
          />
                    <View
                        style={styles.cat_bar}
                        >
                        <Button
                          small
                          style={
                            this.state.location_type == "restaurant"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "restaurant" ? this.List(true, "fav", "restaurant") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "restaurant"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Meals
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "groceries"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "groceries" ? this.List(true, "fav", "groceries") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "groceries"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Groceries
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "supplies"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "supplies" ? this.List(true, "fav", "supplies") : null}
                          
                        >
                    <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "supplies"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Supplies
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "alcohol"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.state.location_type != "alcohol" ? this.List(true, "fav", "alcohol") : null}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "alcohol"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Drinks
                          </Text>
                        </Button>

                      </View>

          {this.state.responses.length == 0 ? (
            <Container
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.status_bar,
                  //height: Platform.OS === "ios" ? 35 : 0,
                  borderBottomWidth: 0,
                }}
              >
                <StatusBar
                  translucent
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
          style={{ elevation: 0, backgroundColor: "white", width: "100%", shadowOpacity: 0, height: 0}}
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
                <Text style={{ marginTop: 15, marginBottom: 15 }}>
                  Sorry, there appears to be nothing here
                </Text>
                <Button
                  small
                  style={{ backgroundColor: colors.theme_fg }}
                  onPress={() => this.List(true, "fav")}
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
                    {this.state.keyword != ""
                      ? strings.show_all
                      : strings.retry}
                  </Text>
                </Button>
              </Body>
            </Container>
          ) : (
            <>
              {this.state.keyword != "" && this.state.result_count > 0 ? (
                <View>
                  <Row style={styles.show_all}>
                    <Right style={{ width: "100%" }}>
                      <Text
                        onPress={() => this.List(true, "fav")}
                        style={{ color: colors.theme_fg }}
                      >
                        Show All
                      </Text>
                    </Right>
                  </Row>
                </View>
              ) : null}
              <FlatList
                data={this.state.responses}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  marginHorizontal: 10,
                }}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={this.menu.bind(this, index)}
                  >
                    <View
                      style={{ marginTop: 10 }}
                      pointerEvents={item.open_status == 0 ? "none" : "auto"}
                    >
                      <Grid
                        style={{ opacity: item.open_status == 0 ? 0.5 : 1 }}
                      >
                        <Col style={{ width: 100 }}>
                          <TouchableHighlight
                            onPress={this.menu.bind(this, index)}
                          >
                            <Thumbnail
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: 5,
                              }}
                              square
                              source={{ uri: img_url + item.profile_image }}
                            />
                          </TouchableHighlight>
                        </Col>
                        <Col>
                          <Row>
                            <Col style={{ width: "80%" }}>
                              <Text
                                onPress={this.menu.bind(this, index)}
                                style={styles.name}
                              >
                                {item.location_name}
                              </Text>
                            </Col>

                            {/* {item.veg_type == "veg" ? (
                            <Right>
                              <Row>
                                <Text
                                  style={{
                                    color: "green",
                                    marginTop: 0,
                                    paddingRight: 5,
                                  }}
                                >
                                  Pure Veg
                                </Text>
                                <Thumbnail
                                  square
                                  style={{ width: 15, height: 15 }}
                                  source={require(".././assets/img/veg.png")}
                                ></Thumbnail>
                              </Row>
                            </Right>
                          ) : null} */}
                            <Col
                              style={{ alignItems: "flex-end", width: "20%" }}
                            >
                              <TouchableOpacity
                                //style={{ width: "20%" }}
                                onPress={() =>
                                  this.addfavourite(
                                    item.location_id,
                                    item.favorite,
                                    index
                                  )
                                }
                              >
                                <Text>
                                  {" "}
                                  <MaterialCommunityIcons
                                    style={{
                                      width: "100%",
                                      color: colors.fav,
                                      fontSize: 20,
                                    }}
                                    name={
                                      item.favorite > 0
                                        ? "heart"
                                        : "heart-outline"
                                    }
                                  />
                                </Text>
                              </TouchableOpacity>
                            </Col>
                          </Row>

                          <Text
                            onPress={this.menu.bind(this, index)}
                            style={styles.description}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                          <Row style={styles.contentrow1}>
                            {item.open_status == 0 ? (
                              <Right style={{ paddingRight: 10 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: colors.theme_fg,
                                    fontFamily: colors.font_family,
                                  }}
                                >
                                  {strings.closed}
                                </Text>
                              </Right>
                            ) : null}
                          </Row>
                          <Row
                            style={styles.contentrow}
                            onPress={this.menu.bind(this, index)}
                          >
                            <Left style={{ paddingRight: 10 }}>
                              <Div
                                style={{
                                  borderRadius: 2,
                                  // borderColor: colors.divider,
                                  // borderWidth: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: 5,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: colors.text_dec,
                                  }}
                                  key={index}
                                >
                                  <Icon
                                    style={{
                                      fontSize: 12,
                                      color: colors.location,
                                    }}
                                    name="ios-pin"
                                  />{" "}
                                  {parseInt(item.distance) > 1
                                    ? parseInt(item.distance) + "KMs"
                                    : parseInt(item.distance) + "KM"}
                                </Text>
                              </Div>
                            </Left>
                            {item.veg_type == "veg" ? (
                              <Div
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <MaterialCommunityIcons
                                  style={{
                                    color: "green",
                                    fontSize: 14,
                                  }}
                                  name="fruit-grapes"
                                />
                                <Text
                                  style={{
                                    color: "green",
                                    fontSize: 12,
                                    padding: 3,
                                  }}
                                >
                                  Veg
                                </Text>
                              </Div>
                            ) : null}

                            {item.review_count != 0 ? (
                              <Right>
                                <Div
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      padding: 5,
                                      color: colors.star_icons,
                                    }}
                                  >
                                    <Icon
                                      style={{
                                        fontSize: 14,
                                        color: colors.star_icons,
                                      }}
                                      name="star"
                                    />{" "}
                                    {parseFloat(item.location_ratings).toFixed(
                                      1
                                    )}{" "}
                                    ({item.review_count})
                                  </Text>
                                </Div>
                              </Right>
                            ) : (
                              <Right>
                                <Div
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      padding: 5,
                                      color: colors.star_iconss,
                                    }}
                                  >
                                    <Icon
                                      style={{
                                        fontSize: 14,
                                        color: colors.star_icons,
                                        fontFamily: colors.font_family,
                                      }}
                                      name="star"
                                    />{" "}
                                    (NA)
                                  </Text>
                                </Div>
                              </Right>
                            )}
                          </Row>
                        </Col>
                      </Grid>
                      <Divider
                        style={{
                          backgroundColor: colors.divider,
                          //marginBottom: 10,
                          marginTop: 10,
                          paddingHorizontal: 80,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
                onEndReachedThreshold={0.8}
                bounces={false}
                onEndReached={this.handleLoadMore}
                // ListFooterComponent={() =>
                //   Platform.OS === "ios" ? (
                //     <View style={{ height: 0, marginBottom: Dimensions.get('window').height *(8/100) }}></View>
                //   ) : null
                // }
                /*refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}s
                        onRefresh={this.handleRefresh}
                        title="Pull to refresh"
                        tintColor={colors.theme_fg}
                        titleColor={colors.theme_fg}
                        colors={["red", "green", "blue"]}
                     />
                  }*/
                // ListFooterComponent={this.renderFooter}
              />
            </>
          )}
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
    margin: 10,
    marginTop: 0,
    paddingBottom: verticalScale(70),
  },
  show_all: {
    width: "100%",
    marginTop: 5,
    marginBottom: 10,
  },
  name: {
    color: colors.header,
    fontSize: 16,
    textAlign: "left",
    marginLeft: 10,
    fontWeight: "400",
  },
  description: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 12,
    color: colors.sub_font,
  },
  overlay: {
    opacity: 0.5,
    backgroundColor: "#000000",
  },
  logo: {
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentrow: {
    marginLeft: 5,
    marginTop: 2,
  },
  contentrow1: {
    marginLeft: 5,
    marginTop: 2,
  },
  list: {
    //borderRadius:5,
    //borderWidth: 1,
    //borderColor: '#FD4431',
    marginBottom: 10,
    opacity: 0.5,
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
    borderRadius: 2,
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
  foodbtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.header,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.header,
    elevation: 0

  },
  foodbtn_active: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.header,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.header,
    borderBottomColor: colors.star_icons,
    borderBottomWidth: 2,
    elevation: 0

  },
  cat_bar: {
    paddingTop: 0,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: colors.header,
    flexDirection: 'row',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius:10,
    alignItems:'center',
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
  model_view: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg_one,
    height: Dimensions.get("screen").height * 1,
  },
  model_view1: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get("screen").height * 0.21,
    backgroundColor: colors.bg_one,
  },
});
