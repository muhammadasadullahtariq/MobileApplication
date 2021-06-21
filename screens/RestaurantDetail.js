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
  BackHandler,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
  Linking,
  StatusBar,
  Dimensions,
  ImageBackground,
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
  Card,
} from "native-base";
import { Divider, Rating } from "react-native-elements";
import StarRating from "react-native-star-rating";
import { Div } from "react-native-div";
import { NavigationActions, StackActions } from "react-navigation";
import * as colors from "../assets/css/Colors";
import { Colors } from "react-native-paper";
import { BASE_URL, img_url } from "../config/Constants";
import Snackbar from "react-native-snackbar";
import strings from "./stringsoflanguages";

let { width, height } = Dimensions.get("window");

export default class RestaurantDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  /*static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerTitle: 'New Task',
      headerLeft: <Button title="Save" onPress={() => navigation.openDrawer() } />,
    }
  }*/

  /*state = {
    
    //userthis.params.user_id,
    details: this.props.navigation.getParam('details')
    
  }*/

  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      if (user_id !== null) {
        this.setState({ user_id: user_id });
      }
    } catch (error) {}
  };
  mapNavigate() {
    this.props.navigation.navigate("ViewMap", { details: this.state.details });
  }
  table_book = () => {
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
      // this.props
      // .navigation
      // .dispatch(StackActions.reset({
      //   index: 0,
      //   actions: [
      //     NavigationActions.navigate({
      //       routeName: 'TableBooking',
      //       params: { details: this.state.details },
      //     }),
      //   ],
      // }))
      this.props.navigation.navigate("TableBooking", {
        details: this.state.details,
        from: "restaurant_details",
      });
    }
  };
  menu = () => {
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
          from: "restaurant_details",
        });
      }
    } else {
      this.showSnackbar("Menus are not available now!");
    }
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  reviewpage = () => {
    this.props.navigation.navigate("Review", { details: this.state.details });
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      showIndicator: false,
      details: this.props.navigation.getParam("details"),
      user_id: 0,
    };
    this.retrieveData();
  }

  async componentDidMount() {
    //console.log(this.state.details)
    if (global.currency == undefined) {
      await this.settings();
    }
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
        global.currency = res.result.currency_symbol;
        this.setState({ showIndicator: false });
      })
      .catch((error) => {
        this.setState({ showIndicator: false });
      });
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
    return true;
    //this.props.navigation.navigate('RestaurantList');
    //this.props.navigation.goBack(null);
    //
  }

  render() {
    let gallery = this.state.details.gallery.map((val, key) => {
      return (
        <Thumbnail
          style={{
            width: 150,
            height: 100,
            borderRadius: 5,
            marginRight: 10,
          }}
          square
          source={{ uri: img_url + val.path }}
        ></Thumbnail>
      );
    });
    const rowleng = this.state.details.ratings.length;

    let reviews = this.state.details.ratings.map((val, key) => {
      if (rowleng == key + 1) {
        return (
          <Row>
            <Content style={styles.secondblock}>
              <Row style={{ marginTop: 10, marginBottom: 10 }}>
                <Left>
                  <Text
                    style={{
                      marginLeft: 10,
                      color: colors.theme_fg,
                      fontSize: 14,
                    }}
                  >
                    {strings.reviews}
                  </Text>
                </Left>
                <Right style={{ marginRight: 10 }}>
                  <Text
                    style={{
                      color: colors.sub_font,
                      fontSize: 14,
                      textDecorationLine: "underline",
                    }}
                    onPress={() => this.reviewpage()}
                  >
                    {strings.view_all}
                  </Text>
                </Right>
              </Row>
              <Divider style={{ backgroundColor: colors.divider }} />
              <Row style={{ marginTop: 10 }}>
                <Left>
                  <Text style={styles.customername}>{val.first_name}</Text>
                </Left>
                <Right>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={val.overall}
                    starSize={14}
                    fullStarColor={colors.theme_fg}
                    emptyStarColor={colors.theme_fg}
                    containerStyle={{ marginTop: "2%", marginRight: "5%" }}
                  />
                </Right>
              </Row>
              <Row>
                <Text style={styles.comment} numberOfLines={3}>
                  {val.review_text}
                </Text>
              </Row>
              <Row>
                <Text style={styles.date}>{val.date_added}</Text>
              </Row>
            </Content>
          </Row>
        );
      }
    });
    if (this.state.showIndicator) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.theme_fg} />
        </View>
      );
    } else {
      return (
        <Container>
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
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.status_bar}
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
                <Text>{this.state.details.location_name}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>
          <ScrollView>
            <View style={styles.container}>
              <Thumbnail
                style={{ width: "100%", height: height * 0.3 }}
                square
                source={{ uri: img_url + this.state.details.profile_image }}
              ></Thumbnail>
              <Card style={styles.firstblock}>
                <Row>
                  <Left>
                    <Text style={styles.restaurantname}>
                      {this.state.details.location_name}
                    </Text>
                  </Left>
                  {/*<Right style={{ marginRight:10 }} ><Button danger style={styles.ratingbtn} ><Text style={{ fontSize:10, marginLeft:5, marginRight:5, color:colors.theme_button_fg }}><Icon style={{ fontSize:13 }} name='star' />{parseFloat(this.state.details.location_ratings).toFixed(1)}</Text></Button></Right>*/}

                  {this.state.details.review_count != 0 ? (
                    <Right style={{ marginRight: 10 }}>
                      <Div style={styles.ratingbtn}>
                        <Text
                          style={{
                            fontSize: 10,
                            marginLeft: 5,
                            marginRight: 5,
                            color: colors.theme_button_fg,
                          }}
                        >
                          <Icon
                            style={{
                              fontSize: 13,
                              color: colors.star_icons,
                            }}
                            name="star"
                          />{" "}
                          {parseFloat(
                            this.state.details.location_ratings
                          ).toFixed(1)}{" "}
                          ({this.state.details.review_count})
                        </Text>
                      </Div>
                    </Right>
                  ) : null}
                </Row>
                <Row style={{ marginTop: 5 }}>
                  <Text style={styles.address}>
                    {this.state.details.location_address_1},{" "}
                    {this.state.details.location_address_2},{" "}
                    {this.state.details.location_city},{" "}
                    {this.state.details.location_state},{" "}
                    {this.state.details.location_postcode},{" "}
                    {this.state.details.location_country}{" "}
                  </Text>
                </Row>
                <Row>
                  <Body>
                    <Div style={styles.contentbox}>
                      {/* <Col style={styles.contentboxItem} onPress={this.menu}>
                              <Icon style={{ fontSize:15, color:colors.icons }} name='clipboard' />
                                <Text style={{ fontSize:12, color: colors.theme_fg,fontFamily:colors.font_family }} >{strings.menu}</Text>
                          </Col> 
                          <Col style={{ width:10, justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ fontSize:25, color: colors.theme_fg }} >|</Text>
                          </Col>*/}
                      <Col
                        style={styles.contentboxItem}
                        onPress={() => this.mapNavigate()}
                      >
                        <Icon
                          style={{ fontSize: 15, color: colors.icons }}
                          name="pin"
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.theme_fg,
                            fontFamily: colors.font_family,
                          }}
                        >
                          {strings.location}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          width: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 25, color: colors.theme_fg }}>
                          |
                        </Text>
                      </Col>
                      <Col
                        style={styles.contentboxItem}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${this.state.details.location_telephone}`
                          )
                        }
                      >
                        <Icon
                          style={{ fontSize: 15, color: colors.icons }}
                          name="call"
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.theme_fg,
                            fontFamily: colors.font_family,
                          }}
                        >
                          {strings.contact}
                        </Text>
                      </Col>
                    </Div>
                  </Body>
                </Row>
                <Row>
                  <Left>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: colors.header,
                        fontSize: 14,
                        fontFamily: colors.font_family_bold,
                      }}
                    >
                      {strings.about_restaurant}
                    </Text>
                  </Left>
                  <Right style={{ marginRight: 10 }}></Right>
                </Row>
                <Row>
                  <Text style={styles.detail}>
                    {this.state.details.description}
                  </Text>
                </Row>
                <Row style={styles.gallery}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                  >
                    {gallery}
                  </ScrollView>
                </Row>
                <Row style={styles.actionbuttons}>
                  <Col style={{ width: "45%" }}>
                    <Button
                      block
                      onPress={this.table_book}
                      style={{
                        // borderWidth: 1,
                        justifyContent: "center",
                        borderRadius: 5,
                        alignItems: "center",
                        height: 35,
                        backgroundColor: colors.theme_fg,
                        // borderColor: colors.divider,
                        color: colors.theme_fg,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          fontFamily: colors.font_family,
                        }}
                      >
                        <Icon
                          style={{
                            color: "#FFF",
                            fontSize: 16,
                            marginRight: 7,
                          }}
                          name="restaurant"
                        />{" "}
                        BOOK TABLE
                      </Text>
                    </Button>
                  </Col>
                  <Col style={{ width: "10%" }}></Col>
                  <Col style={{ width: "45%" }}>
                    <Button
                      block
                      onPress={this.menu}
                      style={{
                        // borderWidth: 1,
                        justifyContent: "center",
                        borderRadius: 5,
                        alignItems: "center",
                        height: 35,
                        backgroundColor: colors.theme_fg,
                        // borderColor: colors.divider,
                        color: colors.theme_fg,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          fontFamily: colors.font_family,
                        }}
                      >
                        <Icon
                          style={{
                            color: "#FFF",
                            fontSize: 14,
                            marginRight: 7,
                          }}
                          name="cart"
                        />{" "}
                        {strings.order_menu}
                      </Text>
                    </Button>
                  </Col>
                </Row>
              </Card>
              {/* {reviews} */}
            </View>
          </ScrollView>
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
  },
  actionbuttons: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  firstblock: {
    backgroundColor: "#fff",
    width: width * 1,
    // marginLeft: "5%",
    // marginRight: "5%",
    marginTop: -20,
    // borderRadius: 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowOpacity: 0,
    borderColor: "#fff",
    padding: 15,
    paddingTop: 20,
    paddingBottom: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  secondblock: {
    backgroundColor: colors.bg_two,
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: 20,
    borderRadius: 3,
    elevation: 0,
    shadowOpacity: 0,
  },
  restaurantname: {
    marginLeft: 10,
    color: colors.header,
    fontSize: 17,
    fontFamily: colors.font_family_bold,
  },
  gallery: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  contentbox: {
    height: 50,
    backgroundColor: colors.theme_button_fg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.divider,
    marginTop: 10,
    marginBottom: 10,
    width: "95%",
  },
  contentboxItem: {
    justifyContent: "center",
    alignItems: "center",
    color: "#FD725F",
  },
  address: {
    fontSize: 10,
    textAlign: "left",
    marginLeft: 10,
    color: colors.sub_font,
  },
  customername: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 10,
    color: colors.theme_fg,
  },
  detail: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    color: colors.sub_font,
  },
  comment: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
    color: colors.sub_font,
  },
  date: {
    fontSize: 10,
    textAlign: "left",
    marginLeft: 10,
    marginBottom: 10,
    color: colors.sp_subtext_fg,
  },
  ratingbtn: {
    height: 20,
    fontSize: 10,
    backgroundColor: colors.theme_fg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
});
