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
  BackHandler,
  AsyncStorage,
  Dimensions,
  Keyboard,
  View,
  Image,
  Platform,
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
  Item,
  Label,
  Input,
  CheckBox,
  Row,
  Picker,
} from "native-base";
import AnimateLoadingButton from "react-native-animate-loading-button";
import Snackbar from "react-native-snackbar";
import { Form } from "react-native-form-validation";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_KEY } from "../config/Constants";
import { BASE_URL } from "../config/Constants";
import { NavigationActions, StackActions } from "react-navigation";
import * as colors from "../assets/css/Colors";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import strings from "./stringsoflanguages";

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default class Address extends Component {
  static navigationOptions = {
    header: null,
  };

  login = () => {
    this.props.navigation.navigate("Login");
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      validation: true,
      checked: false,
      lat: "",
      lng: "",
      latitudeDelta: 0.01,
      longitudeDelta: 0.0012,
      address1: "",
      address2: "",
      state: "",
      city: "",
      pin_code: "",
      user_id: 0,
      default: "",
      specification: "Home",
      details: this.props.navigation.getParam("details"),
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
      markers: {
        coordinates: {
          latitude: "",
          longitude: "",
        },
      },
      country: "",
      address_length: 0,
    };
    this.retrieveData();
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
    this.props.navigation.goBack(null);
    return true;
  }
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");

      if (user_id !== null) {
        await this.setState({ user_id: user_id });
      }
    } catch (error) {
      console.log(error);
    }
  };

  addresssave = async () => {
    Keyboard.dismiss();
    if (this.state.checked) {
      await this.setState({ default: "on" });
    } else {
      await this.setState({ default: "off" });
    }

    if (this.state.address_length == 1) {
      this.showSnackbar("Choose exact location via map");
      return false;
    }

    this.loadingButton.showLoading(true);
    //this.checkValidate();
    if (this.state.validation) {
      var add_details = {
        address_1: this.state.address1,
        address_2: this.state.address2,
        state: this.state.state,
        city: this.state.city,
        postcode: this.state.pin_code,
        customer_id: this.state.user_id,
        latitude: this.state.lat,
        longitude: this.state.lng,
        default_address: this.state.default,
        country: this.state.country,
        specification: this.state.specification,
      };
      var formBody = [];
      for (var property in add_details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(add_details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      fetch(BASE_URL + "user/addAddress", {
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
          console.log(res);
          if (res.message != "New Addess Added Successfully") {
            this.loadingButton.showLoading(false);
            this.showSnackbar(res.message.error);
          } else {
            this.loadingButton.showLoading(false);
            /*this.props
            .navigation
            .dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'ManageAddress',
                  params: { customer_id: this.state.user_id,details:this.state.details },
                }),
              ],
            }))*/
            this.props.navigation.navigate("ManageAddress", { from_add: 1 });
            //this.resetMenu();
          }
        })
        .catch((error) => {
          this.loadingButton.showLoading(false);
          //alert(JSON.stringify(error));
          this.showSnackbar("Something went wrong");
        });
    }
  };

  /*checkValidate(){
    if(this.state.email == '' || this.state.password == '' || this.state.user_name == '' || this.state.confirm_password == ''){
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Please fill all mandatory fields.");
      return true;
    }

    if(this.state.password != this.state.confirm_password && this.state.password != ''){
      this.loadingButton.showLoading(false);
      this.state.validation = false;
      this.showSnackbar("Password mismatch! ");
    }else{
      this.state.validation = true;
    }
  }*/
  onValueChange(value) {
    this.setState({ specification: value });
  }
  onRegionChange = async (value) => {
    var self = this;
    let distance = this.calculateDistance(
      value.latitude,
      self.state.lat,
      value.longitude,
      self.state.lng
    );

    if (distance > 0) {
      fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          value.latitude +
          "," +
          value.longitude +
          "&key=" +
          GOOGLE_KEY
      )
        .then((response) => response.json())
        .then(async (responseJson) => {
          await this.getcitystate(responseJson.results[0]);
          /*let add_count = (responseJson.results[0].address_components).length;
            if(add_count < 4)
            {
              await this.setState({
                address1:responseJson.results[0].formatted_address,
                city: add_count >= 3 ? responseJson.results[0].address_components[add_count-3].long_name : 'NULL' ,
                state: responseJson.results[0].address_components[add_count-2].long_name,
                
              });
            }
            else{
              await this.setState({
                address1:responseJson.results[0].formatted_address,
                city: responseJson.results[0].address_components[add_count-4].long_name,
                state: responseJson.results[0].address_components[add_count-3].long_name,
                pin_code: responseJson.results[0].address_components[add_count-1].long_name,
              });
            }*/
        });
      await self.setState({
        lat: value.latitude,
        lng: value.longitude,
        latitudeDelta: value.latitudeDelta,
        longitudeDelta: value.longitudeDelta,
        markers: {
          coordinates: {
            latitude: value.latitude,
            longitude: value.longitude,
          },
        },
      });
    }
  };
  getcitystate = async (details) => {
    this.setState({
      city: "",
      state: "",
      country: "",
      pin_code: "",
    });
    var address_comp = details.address_components.length;
    var componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "long_name",
      country: "long_name",
      postal_code: "short_name",
    };
    for (var i = 0; i < address_comp; i++) {
      var addressType = details.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = details.address_components[i][componentForm[addressType]];
        await this.setState({
          address1: details.formatted_address,
          city: addressType == "locality" ? val : this.state.city,
          state:
            addressType == "administrative_area_level_1"
              ? val
              : this.state.state,
          country: addressType == "country" ? val : this.state.country,
          pin_code: addressType == "postal_code" ? val : this.state.pin_code,
          address_length: address_comp,
        });
      }
    }
    this.state.city == ""
      ? this.setState({
          city: this.state.state,
        })
      : null;
    this.state.state == ""
      ? this.setState({
          state: this.state.city,
        })
      : null;
  };
  calculateDistance(lat1: number, lat2: number, long1: number, long2: number) {
    let p = 0.017453292519943295; // Math.PI / 180
    let c = Math.cos;
    let a =
      0.5 -
      c((lat1 - lat2) * p) / 2 +
      (c(lat2 * p) * c(lat1 * p) * (1 - c((long1 - long2) * p))) / 2;
    let dis = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    return dis;
  }
  onMapReady = () => {
    Platform.OS === "ios" && this.map.animateToRegion(initialRegion, 0.1); // TODO remove once the initialRegion is fixed in the module
  };
  render() {
    const specification = [
      {
        label: strings.home,
        value: "Home",
      },
      {
        label: strings.office,
        value: "Office",
      },
      {
        label: strings.other,
        value: "Others",
      },
    ];
    return (
      <Container>
        <Header
          style={{ backgroundColor: colors.header }}
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
                style={{ color: colors.theme_button_fg }}
                name="arrow-back"
              />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: "center" }}>
            <Title
              style={{ alignSelf: "center", color: colors.theme_button_fg }}
            >
              <Text>{strings.add_new_address}</Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView keyboardShouldPersistTaps="always">
          <Content style={{ marginBottom: 20, marginTop: 10}}>
            <Form style={{ marginRight: 20, marginLeft: 20 }}>
            <View style={{backgroundColor: colors.bg_two, padding: 10, borderRadius: 5}}>
              <Item stackedLabel style={{ borderColor: colors.tint_col}}>
                <Label style={{ color: colors.theme_fg }}>
                  {strings.enter_location}
                </Label>
                <GooglePlacesAutocomplete
                  placeholder=""
                  minLength={2}
                  autoFocus={false}
                  returnKeyType={"default"}
                  fetchDetails={true}
                  listView={false}
                  currentLocation={false}
                  text={this.state.address1}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: GOOGLE_KEY,
                    language: "en", // language of the results
                    // types: '(cities)' // default: 'geocode'
                  }}
                  onPress={async (data, details = null) => {
                    // 'details' is provided when fetchDetails = true

                    /*var componentForm = {
                    street_number: 'short_name',
                    route: 'long_name',
                    locality: 'long_name',
                    administrative_area_level_1: 'long_name',
                    country: 'long_name',
                    postal_code: 'short_name'
                  };*/

                    await this.getcitystate(details);
                    /*var address_comp = (details.address_components).length;

                    //console.log(details.address_components)
                    for (var i = 0; i < address_comp; i++) {
                      var addressType = details.address_components[i].types[0];
                     if (componentForm[addressType]) {
                        var val = details.address_components[i][componentForm[addressType]];
                        await this.setState({
                          city: addressType == 'locality' ? val : this.state.city,
                          state: addressType == 'administrative_area_level_1' ? val : this.state.state,
                          country: addressType == 'country' ? val : this.state.country,
                          pin_code:addressType == 'postal_code' ? val : this.state.pin_code
                        });
                        
                      }
                    }*/
                    /* if(address_comp < 4)
                    {
                      await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + details.geometry.location.lat + ',' + details.geometry.location.lng + '&key=' + GOOGLE_KEY)
                      .then((response) => response.json())
                      .then(async(responseJson) => {
                        let add_count = (responseJson.results[0].address_components).length;
                        await this.setState({
                          city: responseJson.results[0].address_components[add_count-2].long_name,
                          state: responseJson.results[0].address_components[add_count-1].long_name,
                        });
                        
                        }) 
                     
                    }*/
                    this.setState({
                      lat: details.geometry.location.lat,
                      lng: details.geometry.location.lng,
                      markers: {
                        coordinates: {
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                        },
                      },
                      address1: details.formatted_address,
                    });
                  }}
                  listViewDisplayed="false"
                  styles={{
                    textInputContainer: {
                      width: "100%",
                      backgroundColor: "rgba(0,0,0,0)",
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      borderLeftWidth: 0,
                    },
                    textInput: {
                      marginLeft: 0,
                      marginRight: 0,
                      marginBottom: 0,
                      color: colors.sub_font,
                      fontFamily: colors.font_family, 
                    },
                  }}
                />
              </Item>
              {/* <Text style={{ color: colors.sub_font }}>
                {strings.note_select_address_from_autocomplete}
              </Text> */}
              <Item stackedLabel style={{ borderColor: colors.tint_col }}>
                <Label style={{ color: colors.theme_fg }}>
                  {strings.plot_no2}
                </Label>
                <Input
                  ref="address"
                  style={{
                    color: colors.sub_font,
                    fontFamily: colors.font_family,
                  }}
                  onChangeText={(TextInputValue) =>
                    this.setState({ address2: TextInputValue })
                  }
                />
              </Item>
              {/*<Item stackedLabel style={{ borderColor: colors.divider }} >
                <Label style={{ color: colors.theme_fg }}>Address2</Label>
                <Input ref="landmark" style={{ color: colors.sub_font,fontFamily: colors.font_family }} onChangeText={TextInputValue => this.setState({ address2: TextInputValue })} />
              </Item>
              
              <Item stackedLabel style={{ borderColor: colors.divider }}>
                <Label style={{ color: colors.theme_fg }}>Pin Code</Label>
                <Input ref="pin_code" style={{ color: colors.sub_font,fontFamily: colors.font_family  }} onChangeText={TextInputValue => this.setState({ pin_code: TextInputValue })} />
              </Item>*/}
              <Item stackedLabel style={{ borderColor: colors.bg_two }}>
                <Label style={{ color: colors.theme_fg }}>
                  {strings.specification}
                </Label>
                <Picker
                  mode="dropdown"
                  onValueChange={this.onValueChange.bind(this)}
                  selectedValue={this.state.specification}
                  itemTextStyle={{ fontFamily: colors.font_family }}
                  textStyle={{ fontFamily: colors.font_family }}
                  style={{ width: "100%", color: colors.sub_font }}
                >
                  <Picker.Item label={strings.home} value="Home" />
                  <Picker.Item label={strings.office} value="Office" />
                </Picker>
                {/*<Picker
                  selectedValue={this.state.specification}
                  style={{ width: '100%', color: colors.sub_font }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ specification: itemValue })
                  }>
                  <Picker.Item label="Home" value="Home" />
                  <Picker.Item label="Office" value="Office" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>*/}
              </Item>

              {/*<Row style={{ marginBottom: 10, marginRight: 10, marginLeft: 10 }}>
                    <CheckBox checked={this.state.checked} color={colors.theme_fg} style={{ borderRadius: 3 }} onPress={() => this.setState({ checked: !this.state.checked })} />
                    <Text style={{color:colors.theme_fg}}>Set as Default Address</Text>
              </Row>*/}
               </View> 
              {/* {this.state.lat ? ( */}
                {/* <View>
                  <Label
                    style={{
                      color: colors.theme_fg,
                      marginBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    {strings.choose_your_language}
                  </Label>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <MapView
                      showsMyLocationButton={true}
                      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                      style={{
                        width: this.state.screenWidth - 20,
                        height: 240,
                        padding: 20,
                        borderColor: colors.divider,
                        borderWidth: 1,
                        marginBottom: 0,
                      }}
                      region={{
                        latitude: this.state.lat,
                        longitude: this.state.lng,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta,
                      }}
                      zoomEnabled={true}
                      showsUserLocation={true}
                      followsUserLocation={true}
                      showsPointsOfInterest={true}
                      showsScale={true}
                      showsCompass={true}
                      showsPointsOfInterest={true}
                      onRegionChangeComplete={this.onRegionChange}
                    />

                    {/* <MapView.Marker 
                draggable={false}
                coordinate={this.state.markers.coordinates}
                style={{justifyContent:'center',alignItems:'center',position:'absolute'}}
                />
                <View style={{marginLeft: '50%',marginBottom: '-25%', position: 'absolute', justifyContent:'center',alignItems:'center'}}>
                  <Image style={{ width:40, height:40 }} source={require('.././assets/img/marker_restaurant.png')} />
                </View>*/}

                    {/* <View
                      style={{
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={require(".././assets/img/customer_marker.png")}
                      />
                    </View>
                  </View>
                </View>  */}
              {/* ) : null} */}
              
              <Row
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <AnimateLoadingButton
                  ref={(c) => (this.loadingButton = c)}
                  width={this.state.screenWidth - 20}
                  height={40}
                  title={strings.save_and_update}
                  titleFontSize={15}
                  titleColor={colors.theme_button_fg}
                  backgroundColor={colors.theme_fg}
                  borderRadius={5}
                  onPress={this.addresssave}
                  titleFontFamily={colors.font_family}
                />
              </Row>
            </Form>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}
