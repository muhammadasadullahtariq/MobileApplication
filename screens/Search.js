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
  FlatList,
  Button as ReactButton,
  Image,
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

export default class Search extends Component {
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
      favourite: this.props.navigation.getParam("favourite")
        ? this.props.navigation.getParam("favourite")
        : 0,
      type: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").type
        : "restaurant",
      result_count: 0,
      loading: false, // user list loading
      isRefreshing: false, //for pull to refresh
      Connected: false,
    };
  }

  async componentDidMount() {
    this.setState({ showIndicator: true });
    let fontName = colors.font_family;
    GlobalFont.applyGlobal(fontName);
    await this.retrieveData();
    await this.check_location();
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
          this.showSnackbar(strings.something_went_wrong);
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

  /*async componentDidMount()
  {
    this.mounted = true;
    console.log("hai")
   
  }*/
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
      async (error) => {
        this.setState({ showIndicator: false });
        this.showSnackbar(error.message);
        if (error.message == "Location request timed out") {
          const navigateAction = NavigationActions.navigate({
            routeName: "RestaurantList",
          });
          this.props.navigation.dispatch(navigateAction);
        }
      }
    );
  }

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
            routeName: "Search",
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
        let listData = this.state.responses;
        console.log(res.result);
        let data = listData.concat(res.result);
        console.log(data);
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
  handleLoadMore = () => {
    if (!this.state.showIndicator && this.state.page !== 0) {
      this.state.page = this.state.page;
      this.List(false);
    }
  };
  renderFooter = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#FF6149" />
      </View>
    );
  };

  render() {
    if (this.state.showIndicator) {
      return (
        <Container>
          <Header
            style={{ backgroundColor: colors.theme_fg }}
            androidStatusBarColor={colors.header}
          >
          <StatusBar barStyle="light-content" />

            <Body style={{ flex: 3, justifyContent: "center" }}>
              <Title style={{ color: colors.theme_button_fg }}>
                <Text style={{ textAlign: "left" }}>
                  {strings.search_restaurants}
                </Text>
              </Title>
            </Body>
            <Right>
              {this.state.user_id == 0 ? (
                <Button onPress={this.moveLogin} transparent>
                  <Icon
                    style={{ color: colors.theme_button_fg }}
                    name="person"
                  />
                </Button>
              ) : null}
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
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF6149" />
          </View>
        </Container>
      );
    } else {
      return (
        <Container>
          <Header
            style={{ backgroundColor: colors.theme_fg }}
            androidStatusBarColor={colors.header}
          >
            <Body style={{ flex: 3, justifyContent: "center" }}>
              <Title style={{ color: colors.theme_button_fg }}>
                <Text style={{ textAlign: "left" }}>
                  {strings.search_restaurants}
                </Text>
              </Title>
            </Body>
            <Right>
              {this.state.user_id == 0 ? (
                <Button onPress={this.moveLogin} transparent>
                  <Icon
                    style={{ color: colors.theme_button_fg }}
                    name="person"
                  />
                </Button>
              ) : null}
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
            onChangeText={(keyword) =>
              this.setState({ keyword: keyword, responses: [], page: 0 })
            }
            onSearch={() => this.List()}
            value={this.state.keyword}
          />

          {/*<Icon style={styles.searchIcon} name="search" size={15} />
              <TextInput
                  style={styles.input}
                  placeholder="Search restaurants and food.."
                  onChangeText={ keyword => this.setState({keyword : keyword }) }
                  returnKeyType="search"
                  underlineColorAndroid="transparent" value={this.state.keyword}
              />
              <TouchableHighlight onPress={this.List.bind()}>
              <Entypo style={styles.filterIcon} name='arrow-bold-right' size={27} />
         </TouchableHighlight>*/}

          {this.state.keyword != "" && (
            <View>
              <Row style={styles.show_all}>
                <Col style={{ width: "100%" }}>
                  <Text
                    onPress={() => this.reload()}
                    style={{ textAlign: "right", color: colors.theme_fg }}
                  >
                    {strings.show_all}
                  </Text>
                </Col>
              </Row>
            </View>
          )}

          {this.state.result_count == 0 ? (
            <Content>
              <Body style={{ justifyContent: "center", alignItems: "center", }}>
                <Thumbnail
                  style={{
                    height: 150,
                    width: 150,
                    marginBottom: 15 
                  }}
                  square
                  source={require(".././assets/img/no_data.png")}
                ></Thumbnail>
                <Text style={{ marginBottom: 15 }}>
                  {strings.sorry_no_data_available}
                </Text>
                <ReactButton
                  title="Retry"
                  color={colors.theme_fg}
                  onPress={this.reload}
                  titleStyle={{
                    fontWeight: "normal",
                    fontFamily: colors.font_family,
                  }}
                ></ReactButton>
              </Body>
            </Content>
          ) : (
            <View style={styles.rows}>
              <FlatList
                data={this.state.responses}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <View pointerEvents={item.open_status == 0 ? "none" : "auto"}>
                    <Grid
                      style={{
                        marginBottom: 10,
                        opacity: item.open_status == 0 ? 0.5 : 1,
                      }}
                    >
                      <Col style={{ width: 100 }}>
                        <TouchableHighlight
                          onPress={this.hotelDetail.bind(this, index)}
                        >
                          <Thumbnail
                            style={{ width: 100, height: 100, borderRadius: 5 }}
                            square
                            source={{ uri: img_url + item.profile_image }}
                          />
                        </TouchableHighlight>
                      </Col>
                      <Col>
                        <Row>
                          <Left>
                            <Text
                              onPress={this.hotelDetail.bind(this, index)}
                              style={styles.name}
                            >
                              {item.location_name}
                            </Text>
                          </Left>
                          <Right>
                            <Thumbnail
                              square
                              style={{ width: 15, height: 15 }}
                              source={
                                item.veg_type == "veg"
                                  ? require(".././assets/img/veg.png")
                                  : null
                              }
                            ></Thumbnail>
                          </Right>
                        </Row>

                        <Text
                          onPress={this.hotelDetail.bind(this, index)}
                          style={styles.description}
                          numberOfLines={1}
                        >
                          {item.description}
                        </Text>
                        <Row
                          style={styles.contentrow}
                          onPress={this.hotelDetail.bind(this, index)}
                        >
                          <Left>
                            <Div
                              style={{
                                height: "75%",
                                width: "40%",
                                borderRadius: 5,
                                borderColor: colors.divider,
                                borderWidth: 1,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text style={{ fontSize: 12 }}>
                                <Icon
                                  style={{ fontSize: 14, color: colors.icons }}
                                  name="star"
                                />{" "}
                                {parseFloat(item.location_ratings).toFixed(1)}
                              </Text>
                            </Div>
                          </Left>

                          <Right>
                            <Div
                              style={{
                                height: "75%",
                                borderRadius: 5,
                                borderColor: colors.divider,
                                borderWidth: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 5,
                              }}
                            >
                              <Text style={{ fontSize: 10 }}>
                                <Icon
                                  style={{ fontSize: 12, color: colors.icons }}
                                  name="pin"
                                />{" "}
                                {parseInt(item.distance) > 1
                                  ? parseInt(item.distance) + "KMS"
                                  : parseInt(item.distance) + "KM"}
                              </Text>
                            </Div>
                          </Right>
                        </Row>
                        <Row
                          style={styles.contentrow}
                          onPress={this.hotelDetail.bind(this, index)}
                        >
                          <Left>
                            <Text
                              onPress={() =>
                                this.addfavourite(
                                  item.location_id,
                                  item.favorite,
                                  index
                                )
                              }
                            >
                              <MaterialCommunityIcons
                                style={{ color: colors.icons, fontSize: 18 }}
                                name={
                                  item.favorite > 0 ? "heart" : "heart-outline"
                                }
                              />
                            </Text>
                            {item.open_status == 0 ? (
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "red",
                                  fontFamily: colors.font_family,
                                }}
                              >
                                {strings.currently_unavailable}
                              </Text>
                            ) : null}
                          </Left>
                          {item.minimum_price > 0 ? (
                            <Right style={{ width: 120 }}>
                              <Button
                                bordered
                                warning
                                style={styles.choosebtn}
                                onPress={this.hotelDetail.bind(this, index)}
                              >
                                <Text
                                  style={{
                                    color: colors.theme_button_fg,
                                    fontSize: 11,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                  }}
                                >
                                  Starts from {item.minimum_price}
                                </Text>
                              </Button>
                            </Right>
                          ) : null}
                        </Row>
                      </Col>
                    </Grid>
                    <Divider
                      style={{
                        backgroundColor: colors.divider,
                        marginBottom: 10,
                      }}
                    />
                  </View>
                )}
                onEndReachedThreshold={0.8}
                bounces={false}
                onEndReached={this.handleLoadMore}
                // ListFooterComponent={this.renderFooter}
              />
            </View>
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
    padding: 10,
    marginBottom: 30,
  },
  show_all: {
    width: "100%",
    height: 15,
    padding: 10,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    height: 27,
    color: colors.theme_button_fg,
    marginRight: 10,
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
