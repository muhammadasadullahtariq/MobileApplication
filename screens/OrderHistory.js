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
  ScrollView,
  BackHandler,
  PermissionsAndroid,
  Platform,
  AsyncStorage,
  ActivityIndicator,
  ImageBackground,
  TouchableHighlight,
  StatusBar,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import {
  Container,
  Left,
  Body,
  Right,
  Content,
  Row,
  Header,
  Thumbnail,
  Card,
  CardItem,
  Button,
  Tabs,
  Tab,
} from "native-base";
import { fb } from ".././config/ConfigFirebase";

/* Include color file */
import * as colors from "../assets/css/Colors";
import * as Constants from "../config/Constants";
import Snackbar from "react-native-snackbar";
import strings from "./stringsoflanguages";

export default class JobRequests extends Component {
  static navigationOptions = {
    header: null,
  };
  watchId: ?number = null;
  constructor(props) {
    super(props);
    //this.props.navigation.closeDrawer();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      showIndicator: false,
      page: 0,
      pending: [],
      completed: [],
      user_id: 0,
      selectedIndex: 0,
      selectedIndices: [0],
      customStyleIndex: 0,
      order_stat: "pending",
      delivery_id: 0,
      phone: "",
      backClickCount: 0,
      shoparray: [],
      res_name: "",
      res_address: "",
      res_phone: "",
      res_location: "",
      res_lat: "",
      res_lng: "",
      driver_lat: "",
      driver_lng: "",
      driver_location: "",
    };
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
  async getcountryname(tag, lat, lng) {
    //console.log(tag)
    const publishlocation = `${lat},${lng}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${publishlocation}&sensor=true&key=${Constants.GOOGLE_KEY}`;
    await fetch(url)
      .then((response) => response.json())
      .then((result) => {
        for (var i = 0; i < result.results.length; i++) {
          const adress = result.results[i].formatted_address;
          var loc = adress.split(" ");
          //console.log(loc[loc.length-1])
          if (tag == "driver") {
            this.setState({ driver_location: loc[loc.length - 1] });
          } else {
            this.setState({ res_location: loc[loc.length - 1] });
          }
        }
      });
  }
  getcustomerlocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.setState({
          driver_lat: position.coords.latitude,
          driver_lng: position.coords.longitude,
          error: null,
        });
        this.getcountryname(
          "driver",
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => this.showSnackbar(error.message),
      { enableHighAccuracy: false, timeout: 30000 }
    );
  };
  async getIosLocation() {
    this.watchID = navigator.geolocation.watchPosition(
      async (position) => {
        this.setState({
          driver_lat: position.coords.latitude,
          driver_lng: position.coords.longitude,
          error: null,
        });
        this.getcountryname(
          "driver",
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => this.showSnackbar(error.message),
      { enableHighAccuracy: false, distanceFilter: 1, timeout: 30000 }
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

  async componentDidMount() {
    this.setState({ showIndicator: true });
    await this.retrieveData();
    await this.getstatus_updation(this.state.user_id);
    //await this.pending_list();
    //await this.completed_list();
    if (Platform.OS === "ios") {
      //this.callLocation(that);
      await this.getIosLocation();
    } else {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: strings.location_access_required,
              message: strings.app_needs_to_access_your_location_for_tracking,
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            //that.callLocation(that);
          } else {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "Home",
                    params: { someParams: "parameters goes here..." },
                  }),
                ],
              })
            );
          }
        } catch (err) {
          console.warn(err);
        }
      }
      requestCameraPermission();
      await this.getcustomerlocation();
    }
  }
  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const phone = await AsyncStorage.getItem("phone");
      if (user_id != null) {
        await this.setState({
          user_id: user_id,
          phone: phone,
        });
      }
    } catch (error) {}
  };
  handleCustomIndexSelect = (index: number) => {
    this.setState((prevState) => ({ ...prevState, customStyleIndex: index }));
  };

  bookingDetail = async (
    key,
    delivery_id,
    id,
    restaurant_name,
    order_id,
    restaurant_address,
    restaurant_lat,
    restaurant_lng,
    customer_lat,
    customer_lng,
    items,
    status,
    customer_name,
    amount,
    date,
    restaurant_phone,
    delivery_phone,
    location_id,
    shop_details
  ) => {
    if (restaurant_address == undefined) {
      this.showSnackbar(strings.country_issue);
    } else {
      if (this.state.shoparray) {
        this.setState({
          res_name: await this.state.shoparray[0][0].restaurant_name,
          res_address: await this.state.shoparray[0][0].restaurant_address,
          res_phone: await this.state.shoparray[0][0].restaurant_phone,
          res_lat: await this.state.shoparray[0][0].restaurant_lat,
          res_lng: await this.state.shoparray[0][0].restaurant_lng,
        });
        // console.log(this.state.res_lat)
        await this.getcountryname(
          "restaurant",
          this.state.res_lat,
          this.state.res_lng
        );
      }
      // console.log('res=> ' + this.state.res_location + 'dri=>' + this.state.driver_location)
      this.state.driver_location = "Namibia";
      this.state.res_location = "Namibia";
      if (this.state.res_location && this.state.driver_location) {
        console.log("1");
        if (this.state.res_location != this.state.driver_location) {
          await this.showSnackbar(strings.fav_something_went_wrong);
          console.log("2");
        } else {
          console.log("3");
          let btn_label = "";
          if (status == 3) {
            btn_label = "Picked Up";
          } else if (status == 4 || status == 5) {
            btn_label = "Delivered";
          } else if (status == 6) {
            btn_label = "Completed";
          } else if (status == 20) {
            btn_label = "Completed";
          } else if (status == 0) {
            btn_label = "Cancelled";
          }
          this.props.navigation.navigate("Booking", {
            delivery_partner: delivery_id,
            booking_id: id,
            restaurant_name: restaurant_name,
            order_id: order_id,
            restaurant_address: restaurant_address,
            restaurant_lat: restaurant_lat,
            restaurant_lng: restaurant_lng,
            customer_lat: customer_lat,
            customer_lng: customer_lng,
            items: items,
            status: status,
            btn_label: btn_label,
            customer_name: customer_name,
            amount: amount,
            date: date,
            restaurant_phone: restaurant_phone,
            delivery_phone: delivery_phone,
            location_id: location_id,
            shop_details: shop_details,
          });
        }
      }
    }
  };
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  rating(order_id, customer_id, date, location_id) {
    /* this.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'CustomerReview',
          params: { order_id: order_id,customer_id:customer_id,date:date,location_id:location_id },
        }),
      ],
    }))*/
    this.props.navigation.navigate("CustomerReview", {
      order_id: order_id,
      customer_id: customer_id,
      date: date,
      location_id: location_id,
    });
  }
  tracking(key, order_id, delivery_id, location_id) {
    //var delivery_id = 1;
    //var order_id = 1;
    //console.log(delivery_id +'---'+ order_id);
    fb.ref("/orders/" + delivery_id + "/" + order_id).on(
      "value",
      (dataSnapshot) => {
        if (dataSnapshot.val().id != null) {
          this.setState({ shoparray: [dataSnapshot.val().shop] });
          this.bookingDetail(
            key,
            delivery_id,
            dataSnapshot.val().id,
            dataSnapshot.val().restaurant_name,
            dataSnapshot.val().order_id,
            dataSnapshot.val().restaurant_address,
            dataSnapshot.val().restaurant_lat,
            dataSnapshot.val().restaurant_lng,
            dataSnapshot.val().customer_lat,
            dataSnapshot.val().customer_lng,
            dataSnapshot.val().items,
            dataSnapshot.val().status,
            dataSnapshot.val().customer_name,
            dataSnapshot.val().amount,
            dataSnapshot.val().date,
            dataSnapshot.val().restaurant_phone,
            dataSnapshot.val().delivery_partner_phone,
            location_id,
            dataSnapshot.val().shop
          );
        } else {
          this.showSnackbar("the order is empty");
        }
      }
    );
  }
  getstatus_updation = (user_id) => {
    fb.ref("/customer_pendings/" + user_id).on("value", (dataSnapshot) => {
      var ontrip = [];
      var completed = [];
      if (dataSnapshot.numChildren() > 0) {
        dataSnapshot.forEach((child) => {
          if (child.val().status_id == 20 || child.val().status_id == 0) {
            completed.push(child.val());
          } else {
            ontrip.push(child.val());
          }
          this.setState({
            pending: ontrip,
            completed: completed,
            showIndicator: false,
          });
          /*if(dataSnapshot.val().status == "2"){
      this.setState({ order_stat : 'confirmed', delivery_id : dataSnapshot.val().delivery_partner })
      //delivery_id = dataSnapshot.val().delivery_partner;
    }*/
          // }
        });
      } else {
        this.setState({ showIndicator: false });
        //this.showSnackbar("Something went wrong");
      }
    });
  };
  login = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Login",
    });
    this.props.navigation.dispatch(navigateAction);
  };
  pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }
  render() {
    let ontrip = <Text></Text>;
    let completed = <Text></Text>;

    if (this.state.pending != undefined && this.state.completed != undefined) {
      ontrip = this.state.pending.map((val, key) => {
        if (val.status_id == 1) {
          var btn_text = strings.waiting_for_restaurant_confirmation;
          var colo = "#a6a6a6";
        } else if (val.status_id == 2) {
          var btn_text = strings.restaurant_confirmed_your_order;
          var colo = "#a6a6a6";
        } else if (val.status_id == 0) {
          var btn_text = strings.your_order_cancelled;
          var colo = "#a6a6a6";
        } else {
          var btn_text = strings.track_on_your_order;
          var colo = colors.theme_fg;
        }
        //this.getstatus_updation(this.state.user_id,val.order_id);
        var val_status = val.status;
        return (
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={
              val.status_id != 1 && val.status_id != 2 && val.status_id != 0
                ? this.tracking.bind(
                    this,
                    key,
                    val.order_id,
                    val.delivery_partner,
                    val.location_id
                  )
                : null
            }
          >
            {/*<Row onPress={(val.status != "Pending" && val.status != "Confirmed" ) ? this.tracking.bind(this,val.order_id,val.delivery_partner) : null}>
                
                <Col style={{ width:'90%', marginLeft:'5%', marginTop:20, backgroundColor:colors.bg_two,elevation: 5,shadowOffset: { height: 2, width: 0 },shadowOpacity: 1.8, shadowColor :colors.shadow }}>
                <Row style={{ backgroundColor:'#F5511E' , borderWidth:1, borderColor:'#F5511E', padding:5 }}>
                  <Col style={{ width:'70%'}} >
                  <Text style={{ color:'#FFFFFF',textAlign:'left' }}>{val.status}</Text>
                  </Col>
                  <Col style={{ width:'30%'}} >
                   
                  </Col>
                </Row>
                <Row style={{ paddingTop:10, paddingBottom:10, paddingLeft:5, paddingRight:5, justifyContent: 'center',alignItems: 'center'  }}>
                  <Col style={{ width:'30%' }}>
                    <Text style={{ color:'#F5511E', fontWeight:'bold', fontSize:17 }} >#{this.pad(val.order_id,6)}</Text>
                  </Col>
                  <Col style={{ width:'50%' }}>
                    <Text style={{ color:'#F5511E', fontWeight:'bold', fontSize:15 }} >{val.location_name}</Text>
                    <Text style={{ fontSize:13 }} >{val.date} - {val.time}</Text>
                  </Col>
                  <Col style={{ width:'20%' }}>
                    <Text style={{ textAlign:'right',color:'#F5511E', fontWeight:'bold', fontSize:15 }} >{val.price}</Text>
                  </Col>
                </Row>
                </Col>
          </Row>*/}
            <Card
              style={{
                width: "90%",
                marginLeft: "5%",
                borderRadius: 10,
                borderWidth: 0,
                borderColor: "transparent",
              }}
            >
              <ImageBackground
                source={require(".././assets/img/res_bg.png")}
                imageStyle={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                style={{
                  height: 100,
                  flex: 1,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Row
                  style={{
                    backgroundColor: "rgba(128,128,128,0.4)",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Body
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        color: colors.theme_button_fg,
                        fontSize: 20,
                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5,
                      }}
                    >
                      #{this.pad(val.order_id, 6)}
                    </Text>
                    {/*<Text style={{ color:colors.theme_button_fg, fontSize:13, textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 5, marginRight:5, marginLeft:5 }} >#{this.pad(val.order_id,6)}</Text>*/}
                  </Body>
                </Row>
              </ImageBackground>

              <Content
                style={{ marginTop: 10, marginLeft: 10, marginBottom: 10 }}
              >
                <Row>
                  <Left>
                    <Text style={{ fontSize: 15, color: colors.theme_fg }}>
                      {val_status.replace(/[ /]/g, "")}
                    </Text>
                  </Left>
                  <Right>
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.theme_fg,
                        marginRight: 10,
                      }}
                    >
                      {val.price}
                    </Text>
                  </Right>
                </Row>
                <Row>
                  <Left>
                    <Text style={{ fontSize: 12 }}>{val.date}</Text>
                  </Left>
                </Row>
              </Content>
              <Content
                style={{
                  padding: 10,
                  backgroundColor: colo,
                  color: colors.theme_button_fg,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderWidth: 0.5,
                  borderColor: "transparent",
                }}
              >
                <Body>
                  <Text style={{ color: colors.theme_button_fg }}>
                    {btn_text}
                  </Text>
                </Body>
              </Content>
            </Card>
          </TouchableHighlight>
        );
      });

      completed = this.state.completed.map((val, key) => {
        if (val.status_id == 0) {
          var btn_text = strings.your_order_cancelled;
          var colo = "#a6a6a6";
        } else {
          var btn_text = strings.view_your_order_details;
          var colo = colors.theme_fg;
        }
        var val_status = val.status;
        return (
          <TouchableHighlight
            underlayColor={"transparent"}
            onPress={
              val.status_id != 0
                ? this.rating.bind(
                    this,
                    val.order_id,
                    this.state.user_id,
                    val.date,
                    val.location_id
                  )
                : null
            }
          >
            <Card
              style={{
                width: "90%",
                marginLeft: "5%",
                borderRadius: 10,
                borderWidth: 0,
                borderColor: "transparent",
              }}
            >
              <ImageBackground
                source={require(".././assets/img/res_bg.png")}
                imageStyle={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                style={{
                  height: 100,
                  flex: 1,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Row
                  style={{
                    backgroundColor: "rgba(128,128,128,0.4)",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Body
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        color: colors.theme_button_fg,
                        fontSize: 22,
                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5,
                      }}
                    >
                      #{this.pad(val.order_id, 6)}
                    </Text>
                    {/*<Text style={{ color:colors.theme_button_fg, fontSize:18, textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 5, marginRight:5, marginLeft:5 }} >#{this.pad(val.order_id,6)}</Text>*/}
                  </Body>
                </Row>
              </ImageBackground>

              <Content
                style={{ marginTop: 10, marginLeft: 10, marginBottom: 10 }}
              >
                <Row>
                  <Left>
                    <Text style={{ fontSize: 15, color: colors.theme_fg }}>
                      {val_status}
                    </Text>
                  </Left>
                  <Right>
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.theme_fg,
                        marginRight: 10,
                      }}
                    >
                      {val.price}
                    </Text>
                  </Right>
                </Row>
                <Row>
                  <Left>
                    <Text style={{ fontSize: 12 }}>{val.date}</Text>
                  </Left>
                </Row>
              </Content>
              <Content
                style={{
                  padding: 10,
                  backgroundColor: colo,
                  color: colors.theme_button_fg,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderWidth: 0.5,
                  borderColor: "transparent",
                }}
              >
                <Body>
                  <Text style={{ color: colors.theme_button_fg }}>
                    {btn_text}
                  </Text>
                </Body>
              </Content>
            </Card>
          </TouchableHighlight>
        );
      });
    }
    if (this.state.user_id == 0 && this.state.showIndicator == false) {
      return (
        <Container style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: colors.header,
              height: Platform.OS === "ios" ? 35 : 0,
              //borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            }}
          >
            <StatusBar
              //translucent
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
      if (this.state.showIndicator) {
        return (
          <Container>
            <View
              style={{
                backgroundColor: colors.status_bar,
                height: Platform.OS === "ios" ? 35 : 0,
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
            <View style={styles.container}>
              <ActivityIndicator size="large" color={colors.theme_fg} />
            </View>
          </Container>
        );
      } else {
        return (
          <Container>
            <View
              style={{
                backgroundColor: colors.header,
                height: Platform.OS === "ios" ? 35 : 0,
              }}
            >
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
            <Tabs tabBarUnderlineStyle={{ backgroundColor: colors.theme_fg }}>
              <Tab
                heading={strings.ongoing_orders}
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
                {ontrip == "" ? (
                  <Body
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Thumbnail
                      style={{
                        height: 150,
                        width: 150,
                      }}
                      square
                      source={require(".././assets/img/no_data.png")}
                    ></Thumbnail>
                    <Text style={{ marginTop: 15 }}>
                      {strings.sorry_no_data_available}
                    </Text>
                  </Body>
                ) : (
                  <ScrollView style={{ marginTop: 15 }}>{ontrip}</ScrollView>
                )}
              </Tab>
              <Tab
                heading={strings.previous_orders}
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
                {completed == "" ? (
                  <Body
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Thumbnail
                      style={{
                        height: 150,
                        width: 150,
                      }}
                      square
                      source={require(".././assets/img/no_data.png")}
                    ></Thumbnail>
                    <Text style={{ marginTop: 15 }}>
                      {strings.sorry_no_data_available}
                    </Text>
                  </Body>
                ) : (
                  <ScrollView style={{ marginTop: 15 }}>{completed}</ScrollView>
                )}
              </Tab>
            </Tabs>
          </Container>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
