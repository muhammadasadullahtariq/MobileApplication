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
  Image,
  Dimensions,
  Platform,
  Modal,
  Linking,
  StatusBar,
  TouchableOpacity,
  PixelRatio,
} from "react-native";
import {
  DrawerActions,
  NavigationActions,
  StackActions,
} from "react-navigation";
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
  Footer,
} from "native-base";
import { Divider } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import StepIndicator from "react-native-step-indicator";
import AnimateLoadingButton from "react-native-animate-loading-button";
import { fb } from "../config/ConfigFirebase";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  AnimatedRegion,
} from "react-native-maps";
import PolyLine from "@mapbox/polyline";
import { BASE_URL, img_url, style_path, GOOGLE_KEY } from "../config/Constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MapViewDirections from "react-native-maps-directions";

/* Include color file */
import * as colors from "../assets/css/Colors";
import geolib from "geolib";
import fb_lib from "./Firebase";
import strings from "./stringsoflanguages";

var FONT_BACK_LABEL = 16;

var FONT_ICON_SIZE = 40;

if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 14;
  FONT_ICON_SIZE = 35;
}

/* Include global style sheet */
var cstyles = style_path;

const thirdIndicatorStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 25,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.theme_fg,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: colors.theme_fg,
  stepStrokeUnFinishedColor: colors.bg_two,
  separatorFinishedColor: colors.theme_fg,
  separatorUnFinishedColor: colors.bg_two,
  stepIndicatorFinishedColor: colors.theme_fg,
  stepIndicatorUnFinishedColor: colors.bg_two,
  stepIndicatorCurrentColor: colors.theme_button_fg,
  stepIndicatorLabelFontSize: 40,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: "transparent",
  stepIndicatorLabelFinishedColor: "transparent",
  stepIndicatorLabelUnFinishedColor: "transparent",
  labelColor: "#999999",
  labelSize: 11,
  currentStepLabelColor: colors.theme_fg,
};

const LATITUDE_DELTA = 0.025;
const LONGITUDE_DELTA = 0.0252;
const origin = { latitude: 9.921622, longitude: 78.090687 };
const destination = { latitude: 9.944627, longitude: 78.155944 };
const GOOGLE_MAPS_APIKEY = "AIzaSyCZ8vkwzvrZg2ZZMb3yR7OXCa2TVy2-nPU";

export default class Booking extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.mapRef = null;
    this.state = {
      toggle: global.online_status,
      currentPosition: "",
      delivery_partner: this.props.navigation.getParam("delivery_partner"),
      booking_id: this.props.navigation.getParam("booking_id"),
      order_id: this.props.navigation.getParam("order_id"),
      restaurant_name: this.props.navigation.getParam("restaurant_name"),
      restaurant_address: this.props.navigation.getParam("restaurant_address"),
      details: "Test",
      markers: {
        latitude: this.props.navigation.getParam("customer_lat"),
        longitude: this.props.navigation.getParam("customer_lng"),
      },
      restaurant: {
        latitude: this.props.navigation.getParam("restaurant_lat"),
        longitude: this.props.navigation.getParam("restaurant_lng"),
      },
      destination: {
        latitude: this.props.navigation.getParam("customer_lat"),
        longitude: this.props.navigation.getParam("customer_lng"),
      },
      bearing: 0,
      mapRegion: null,
      pointCoords: [],
      btn_label: this.props.navigation.getParam("btn_label"),
      status: this.props.navigation.getParam("status"),
      customer_name: this.props.navigation.getParam("customer_name"),
      amount: this.props.navigation.getParam("amount"),
      date: this.props.navigation.getParam("date"),
      items: this.props.navigation.getParam("items"),
      restaurant_phone: this.props.navigation.getParam("restaurant_phone"),
      delivery_phone: this.props.navigation.getParam("delivery_phone"),
      payment_model: false,
      coordinate: new AnimatedRegion({
        latitude: this.props.navigation.getParam("customer_lat"),
        longitude: this.props.navigation.getParam("customer_lng"),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      delivery_name: "",
      delivery_image: "",
      eta: "",
      location_id: this.props.navigation.getParam("location_id"),
      shop_details: this.props.navigation.getParam("shop_details"),
      menu_model: "false",
      shop_model: "false",
    };
    const startLoc = `${this.props.navigation.getParam(
      "restaurant_lat"
    )},${this.props.navigation.getParam("restaurant_lng")}`;
    // alert(startLoc);
    // const destLoc =
    //   `${this.props.navigation.getParam("customer_lat")},${this.props.navigation.getParam("customer_lng")}`;
    // this.getRouteDirections(startLoc, destLoc);
    console.log("restaurant=>", startLoc);
    console.log("destination=>", this.state.markers);
    console.log("status=> ", this.state.status);
    console.log("shop-details=>", this.state.shop_details);
  }

  animate(nextProps) {
    const duration = 500;

    if (this.state.markers !== nextProps) {
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(nextProps, duration);
        }
      } else {
        this.state.coordinate
          .timing({
            ...nextProps,
            duration,
          })
          .start();
      }
    }
  }

  payment_model(visible) {
    this.setState({ payment_model: visible });
    if (visible == false) {
      this.handleBackButtonClick();
    }
  }
  componentDidMount() {
    fb.ref(
      "/orders/" + this.state.delivery_partner + "/" + this.state.booking_id
    ).on("value", (snapshot) => {
      let data = snapshot.val();
      console.log("ETA!!!!!!", data.eta.text);

      if (data.status == 3) {
        this.setState({ eta: data.eta.text });
        this.setState({ currentPosition: 2, status: data.status });
      } else if (data.status == 4) {
        this.setState({ eta: data.eta.text });
        this.setState({ currentPosition: 3, status: data.status });
      } else if (data.status == 20) {
        this.setState({ currentPosition: 4, status: data.status });
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "CustomerReview",
                params: {
                  order_id: this.state.booking_id,
                  customer_id: data.customer_id,
                  date: data.date,
                  location_id: this.state.location_id,
                },
              }),
            ],
          })
        );
        // const navigateAction = NavigationActions.navigate({
        //   routeName: 'CustomerReview',
        //   params: { order_id: this.state.booking_id,customer_id:data.customer_id,date:data.date,location_id:this.state.location_id },
        // });
        // this.props.navigation.dispatch(navigateAction);
        return true;
      }
    });

    fb.ref("/delivery_partners/" + this.state.delivery_partner).on(
      "value",
      (snapshot) => {
        let data = snapshot.val();

        let region = {
          latitude: data.l[0],
          longitude: data.l[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        let marker = {
          latitude: data.l[0],
          longitude: data.l[1],
        };

        this.animate(marker);
        this.onRegionChange(
          region,
          marker,
          data.bearing,
          data.name,
          data.profile
        );
      }
    );
  }

  onRegionChange(region, marker, bearing, name, profile) {
    this.setState({
      mapRegion: region,
      markers: marker,
      bearing: bearing,
      delivery_name: name,
      delivery_image: profile,
      coordinate: new AnimatedRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    });
  }

  async getRouteDirections(from, to) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${GOOGLE_MAPS_APIKEY}`
      );

      const json = await response.json();
      const points = PolyLine.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({ pointCoords });
    } catch (error) {
      console.error(error);
    }
  }

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  Track = async () => {
    this.loadingButton.showLoading(true);
  };

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.setState({ menu_model: false });
    this.setState({ shop_model: false });
    this.props.navigation.goBack(null);
    return true;
  }

  menu(visible) {
    this.setState({ menu_model: visible });
  }
  shop(visible) {
    this.setState({ shop_model: visible });
  }

  /* status_update() {
    this.loadingButton.showLoading(true);

    if(this.state.status == 3){
      this.setState({currentPosition:2, status:4, btn_label:"Delivered" });
      this.loadingButton.showLoading(false);
      fb_lib.update_booking_status(this.state.delivery_partner,this.state.booking_id,4);
    }else if(this.state.status == 4){
      this.payment_model(true);
      this.setState({currentPosition:4, status:20, btn_label:"Completed" });
      this.loadingButton.showLoading(false);
      this.completeBooking();
      fb_lib.update_booking_status(this.state.delivery_partner,this.state.booking_id,20);
    }else{
      this.loadingButton.showLoading(false);
    }
  }

  completeBooking = async () => {
      fetch(base_url+complete, {
          method: 'post',
          headers: {
            'Authorization': 'Basic YWRtaW46MTIzNA==',
            'Content-Type': 'application/json',
            'X-API-KEY': 'RfTjWnZr4u7x!A-D'
          },
          body: JSON.stringify({
            "order_id": this.state.booking_id,
            "deliver_id": this.state.delivery_partner
          })
        }).then((response) => response.json())
        .then((res) => {
      if(res.message != "Success"){
         this.loadingButton.showLoading(false);
         this.showSnackbar(res.message);
      }else{
          
      }
     }).catch((error) => {
         this.loadingButton.showLoading(false);
         //this.showSnackbar("Something went wrong");
         alert(JSON.stringify(error));
     });
  }*/

  render() {
    console.log("marker=>", this.state.markers);
    let items = this.state.items.map((val, key) => {
      // foodcst = foodcst + val.menu_total;
      return (
        <Row style={{ paddingLeft: 20, marginBottom: 5 }}>
          <Col style={{ width: "75%" }}>
            <Text style={{ fontSize: 15, color: colors.sub_font }}>
              {val.name}
            </Text>
          </Col>
          <Col style={{ width: "25%", textAlign: "right" }}>
            <Text style={{ fontSize: 15, color: colors.sub_font }}>
              {val.quantity} {strings.nos}
            </Text>
          </Col>
        </Row>
      );
    });

    let shops = this.state.shop_details.map((val, key) => {
      // foodcst = foodcst + val.menu_total;
      return (
        <Row style={{ paddingLeft: 20, marginBottom: 0, marginTop: 15 }}>
          <Col style={{ width: "70%" }}>
            <Text style={{ fontSize: 15, color: colors.theme_fg }}>
              {" "}
              {val.restaurant_name}{" "}
            </Text>
            <Text style={{ fontSize: 11, paddingLeft: 5 }}>
              {val.restaurant_address}
            </Text>
          </Col>

          <Col
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "30%",
            }}
            onPress={() => Linking.openURL(`tel:${val.restaurant_phone}`)}
          >
            <Icon
              style={{ color: colors.theme_fg, fontSize: 30 }}
              name="call"
            />
          </Col>
        </Row>
      );
    });

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
          <Body
            style={{ flex: 3, justifyContent: "center", alignItems: "center" }}
          >
            <Title
              style={{ alignSelf: "center", color: colors.theme_button_fg }}
            >
              <Text>
                {strings.booking_txt} {this.state.order_id}
              </Text>
            </Title>
            <Text style={{ fontSize: 11, color: colors.theme_button_fg }}>
              {this.state.date}
            </Text>
          </Body>
          <Right>
            <Button onPress={() => this.menu(true)} transparent>
              <Icon
                style={{
                  color: colors.theme_button_fg,
                  fontSize: 25,
                  marginRight: 15,
                }}
                name="clipboard"
              />
            </Button>
          </Right>
        </Header>

        <Content style={cstyles.content}>
          {/*<Row style={{ backgroundColor:colors.bg_two, paddingLeft:20, paddingRight:20, padding:10 }} >
               <Col style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => Linking.openURL(`tel:${this.state.restaurant_phone}`)}>
                <Text style={{ fontSize:15, color:colors.theme_fg }}><Icon style={{ color:colors.theme_fg,fontSize:20 }} name='call' />    {this.state.restaurant_name} </Text>
                <Text style={{ fontSize:11 }}>{this.state.restaurant_address}</Text>
              </Col>
              
    </Row>*/}
          <Divider style={{ backgroundColor: colors.divider }} />
          <Row style={{ backgroundColor: colors.bg_two, padding: 10 }}>
            <Col
              style={{
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 15, color: colors.theme_fg }}>
                {strings.eta}
              </Text>
              <Text style={{ fontSize: 11 }}>
                {this.state.eta == "estimating"
                  ? strings.estimating
                  : this.state.eta}
              </Text>
            </Col>
            <Col
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
              }}
              onPress={() => {
                this.shop();
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.theme_fg,
                  textAlign: "center",
                }}
              >
                {strings.view_restaurant_details}
              </Text>
            </Col>
          </Row>
          <View
            style={{
              paddingTop: 15,
              paddingBottom: 5,
              backgroundColor: colors.bg_one,
              elevation: 3,
              shadowOffset: { height: 2, width: 0 },
              shadowOpacity: 1.8,
              shadowColor: colors.shadow,
              
            }}
          >
            <StepIndicator
              stepCount={4}
              customStyles={thirdIndicatorStyles}
              currentPosition={this.state.currentPosition}
              labels={[
                strings.pending, //waiting for restaurant to confirm on admin panel
                strings.assigned, //delivery has been assigned -> driver needs to know, the user needs to know... -> push to driver and user
                strings.on_the_way, //driver picked up, on the way -> push to user
                strings.delivered, //driver...
              ]}
            />
          </View>
          <Grid>
            {this.state.mapRegion != "" &&
              this.state.markers != "" &&
              this.state.restaurant != "" &&
              this.state.destination != "" &&
              this.state.coordinate != "" && (
                <Row style={{ height: Dimensions.get("window").height }}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={this.state.mapRegion}
                    /*ref={(ref) => { this.mapRef = ref }}
                    onLayout = {() => this.mapRef.fitToCoordinates(this.state.pointCoords, { edgePadding: { top: 5, right: 5, bottom: 5, left: 5 }, animated: true })}  */
                  >
                    {/* <Polyline
                      coordinates={this.state.pointCoords}
                      strokeWidth={3}
                      strokeColor="#e0000d"
                    /> */}

                    {/* <MapViewDirections
                      origin={{
                        latitude: this.state.shop_details[0].restaurant_lat,
                        longitude: this.state.shop_details[0].restaurant_lng,
                      }}
                      // waypoints={[this.state.markers]}
                      // waypoints={[this.state.markers,this.state.destination]}
                      destination={this.state.markers}
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={3}
                      strokeColor="hotpink"
                    /> */}
                    <MapViewDirections
                      origin={this.state.markers}
                      // waypoints={[this.state.markers]}
                      // waypoints={[
                      //   {
                      //     latitude: this.state.shop_details[0].restaurant_lat,
                      //     longitude: this.state.shop_details[0].restaurant_lng,
                      //   },
                      //   // this.state.destination,
                      // ]}
                      destination={
                        this.state.status === 4
                          ? this.state.destination
                          : {
                              latitude: this.state.shop_details[0]
                                .restaurant_lat,
                              longitude: this.state.shop_details[0]
                                .restaurant_lng,
                            }
                      }
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={3}
                      strokeColor={colors.header}
                    />

                    {/* <Marker
                        coordinate={this.state.restaurant}
                      >
                        <Thumbnail
                          square
                          style={{ width: 100, height: 100 }}
                          source={require(".././assets/img/marker_restaurant.png")}
                        ></Thumbnail>
                      </Marker> */}

                    <MapView.Marker.Animated
                      ref={(marker) => {
                        this.marker = marker;
                      }}
                      rotation={this.state.bearing}
                      coordinate={
                        Platform.OS === "ios"
                          ? this.state.coordinate
                          : this.state.markers
                      }
                    >
                      <Thumbnail
                        square
                        style={{ width: 20, height: 40 }}
                        source={require(".././assets/img/bike.png")}
                      ></Thumbnail>
                    </MapView.Marker.Animated>
                    {/*<Marker
		          coordinate={this.state.markers}
		          icon={require('.././assets/img/bike.png')}
		          rotation={this.state.bearing}
		        />*/}

                    {/*<Marker coordinate={{latitude: 9.925628,longitude: 78.117087}} rotation = {45}>
	            <View><Thumbnail square source={require('.././assets/img/bike.png')} ></Thumbnail></View>
	          </Marker>*/}
                    {this.state.shop_details.map((value) => {
                      console.log("value=> ", value);
                      return (
                        <Marker
                          coordinate={{
                            latitude: value.restaurant_lat,
                            longitude: value.restaurant_lng,
                          }}
                        >
                          <Thumbnail
                            square
                            style={{ width: 40 }}
                            source={require(".././assets/img/marker_restaurant.png")}
                          ></Thumbnail>
                        </Marker>
                      );
                    })}

                    <Marker coordinate={this.state.destination}>
                      <Thumbnail
                        square
                        style={{ width: 50, height: 50 }}
                        source={require(".././assets/img/customer_marker.png")}
                      ></Thumbnail>
                    </Marker>
                  </MapView>
                </Row>
              )}

            {/*
            <Row style={{ paddingLeft:20, marginTop:10 }}>
            	<Text style={{ fontSize:18, color:colors.theme_fg }}>Ordered Products</Text>
            </Row>
            <Divider style={[ cstyles.divider,cstyles.margin_top_10]} />
            <Row style={{ paddingLeft:20, marginTop:10, marginBottom:5 }}>
            	<Col style={{ width:'75%' }}>
            		<Text style={{ fontSize:15, color:colors.theme_fg}}>Items</Text>
            	</Col>
            	<Col style={{ width:'25%' }}>
            		<Text style={{ fontSize:15, color:colors.theme_fg }}>Qty</Text>
            	</Col>
            </Row>
            <View style={{marginTop:20}}>
            {items}
            </View>
           <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop:20 }}>
	          <AnimateLoadingButton
	            ref={c => (this.loadingButton = c)}
	            width={300}
	            height={40}
	            title={this.state.btn_label}
	            titleFontSize={15}
	            titleColor="rgb(255,255,255)"
	            backgroundColor={colors.theme_bg}
	            borderRadius={5}
	            onPress={this.status_update.bind(this)}
            />
	        </Row>*/}
          </Grid>

          <Modal
            visible={this.state.menu_model}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.menu(!this.state.menu_model);
            }}
          >
            <View
              style={{
                //position: "absolute",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(100,100,100, 0.5)",
                padding: 20,
                alignSelf: "flex-start",
              }}
            >
              <View style={styles.Alert_Menu_View}>
                <View style={styles.popup_container}>
                  <View style={styles.header}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.theme_fg,
                        textAlign: "center",
                        margin: 10,
                        fontFamily: colors.font_family_bold,
                      }}
                    >
                      {strings.menu_details}
                    </Text>
                  </View>
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginBottom: 5,
                      marginTop: 5,
                      paddingHorizontal: 80,
                    }}
                  />
                  <View style={styles.contentContainer}>
                    <View>
                      <ScrollView>
                        <Body>
                          <Row
                            style={{
                              paddingLeft: 20,
                              marginTop: 10,
                              marginBottom: 5,
                            }}
                          >
                            <Col style={{ width: "70%" }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: colors.fg_one,
                                  fontWeight: "bold",
                                  fontFamily: colors.font_family_bold,
                                }}
                              >
                                {strings.items}
                              </Text>
                            </Col>
                            <Col style={{ width: "30%" }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: colors.fg_one,
                                  //fontWeight: "bold",
                                  fontFamily: colors.font_family_bold,
                                }}
                              >
                                {strings.qty}
                              </Text>
                            </Col>
                          </Row>
                          {items}
                        </Body>
                      </ScrollView>
                    </View>
                    <Divider
                      style={{
                        backgroundColor: colors.divider,
                        marginBottom: 0,
                        marginTop: 5,
                        paddingHorizontal: 80,
                      }}
                    />
                  </View>
                  <View style={styles.footer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.menu(!this.state.menu_model);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.theme_fg,
                          //fontWeight: "bold",
                          //fontFamily: colors.font_family_bold,
                        }}
                      >
                        Go Back to Tracking
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={this.state.shop_model}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.shop(!this.state.shop_model);
            }}
          >
            <View
              style={{
                //position: "absolute",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(100,100,100, 0.5)",
                padding: 20,
              }}
            >
              <View style={styles.Alert_Menu_View}>
                <View>
                  <View style={styles.header}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.theme_fg,
                        textAlign: "center",
                        fontFamily: colors.font_family_bold,
                        margin: 10,
                      }}
                    >
                      {strings.restaurant_details}
                    </Text>
                  </View>
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginBottom: 5,
                      marginTop: 5,
                      paddingHorizontal: 80,
                    }}
                  />

                  <View style={styles.contentContainer}>
                    <ScrollView>
                      <Body>{shops}</Body>
                    </ScrollView>
                  </View>
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginBottom: 5,
                      marginTop: 5,
                      paddingHorizontal: 80,
                    }}
                  />

                  <View style={styles.footer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.shop(!this.state.shop_model);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.theme_fg,
                          //fontFamily: colors.font_family_bold,
                        }}
                      >
                        Go Back to Tracking
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </Content>
        <Footer style={{ height: Dimensions.get("window").height * 0.1 }}>
          <Row
            style={{
              backgroundColor: "#FFF",
              paddingLeft: 20,
              paddingRight: 20,
              padding: 10,
              height: Dimensions.get("window").height * 0.1,
            }}
          >
            <Col style={{ width: "20%" }}>
              <Thumbnail
                style={{
                  width: Dimensions.get("window").height * 0.07,
                  height: Dimensions.get("window").height * 0.07,
                  borderRadius: (Dimensions.get("window").height * 0.07) / 2,
                }}
                square
                source={{ uri: img_url + this.state.delivery_image }}
              />
            </Col>
            <Col style={{ width: "65%", height: "100%" }}>
              <Text
                style={{
                  fontSize: FONT_BACK_LABEL,
                  color: colors.theme_fg,
                  height: "50%",
                }}
              >
                {this.state.delivery_name.split(' ')[0]}
                {""}
                <Text> {strings.is_on_the_way_text}</Text>
              </Text>
              <Row
                style={{
                  // paddingTop: 5,
                  height: "50%",
                  marginBottom: 0,
                }}
              >
                <Text
                  onPress={() =>
                    Linking.openURL(`tel:${this.state.delivery_phone}`)
                  }
                  style={{
                    fontSize: FONT_BACK_LABEL,
                    alignItems: "center",
                    height: "100%",
                    // textAlign:'center'
                  }}
                >
                  {strings.for_further_queries_text}
                </Text>
              </Row>
            </Col>
            <Col
              style={{
                width: "15%",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Icon
                style={{
                  color: colors.theme_fg,
                  fontSize: FONT_ICON_SIZE,
                }}
                onPress={() =>
                  Linking.openURL(`tel:${this.state.delivery_phone}`)
                }
                name="call"
              />
            </Col>
          </Row>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  Alert_Main_View: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 200,
    //width: "70%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
  },

  Alert_Menu_View: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 200,
    //width: "80%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    //alignSelf: "flex-start",
  },

  Alert_Title: {
    fontSize: 16,
    color: colors.theme_fg,
    textAlign: "center",
    fontFamily: colors.font_family_bold,
    marginTop: 20,
  },

  Alert_Message: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    padding: 10,
    height: "42%",
  },

  buttonStyle: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  TextStyle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 22,
    marginTop: -5,
  },
  popup_container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: 50,
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    //height: 50,
    //flex: 1,
  },
});
