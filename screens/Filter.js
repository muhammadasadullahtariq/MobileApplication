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
  Dimensions,
  BackHandler,
  ScrollView,
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
  Grid,
} from "native-base";
import { Divider, CheckBox } from "react-native-elements";

import { NavigationActions, StackActions } from "react-navigation";
import AnimateLoadingButton from "react-native-animate-loading-button";
import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";
export default class Filter extends Component {
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

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      scrollEnabled: true,
      checked: this.props.navigation.getParam("filters").favourite
        ? true
        : false,
      rating: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").rating
        : 1,
      price: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").price
        : "low",
      distance: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").distance
        : "nearest",
      favourite: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").favourite
        : 0,
      type: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").type
        : "all",
      lat: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").lat
        : "",
      lng: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").lng
        : "",
      user_id: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").user_id
        : "",
      location_type: this.props.navigation.getParam("filters")
        ? this.props.navigation.getParam("filters").location_type
        : "",
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
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

  handleBackButtonClick() {
    this.props.navigation.navigate("RestaurantList");
  }
  reset = async () => {
    await this.setState({ rating: 0 });
    await this.setState({ price: "" });
    await this.setState({ distance: "nearest" });
    await this.setState({ favourite: 0 });
    await this.setState({ type: "both" });
    await this.setState({ checked: false });
    await this.setState({ location_type: "restaurant" });
    /*this.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'RestaurantList',
          params: { filters: this.state },
        }),
      ],
    }))*/
  };
  filter_submit = async () => {
    if (this.state.checked) {
      await this.setState({ favourite: 1 });
    } else {
      await this.setState({ favourite: 0 });
    }
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "RestaurantList",
            params: { filters: this.state },
          }),
        ],
      })
    );
    //await this.props.navigation.navigate('RestaurantList',{ filters: this.state });
  };

  render() {
    let ratings_arr = [5, 4, 3, 2, 1];
    let ratings = ratings_arr.map((val, key) => {
      return (
        <Col
          style={{
            borderWidth: 1.5,
            borderColor: colors.theme_fg,
            // borderRadius:
            //   Math.round(
            //     Dimensions.get("window").width + Dimensions.get("window").height
            //   ) / 2,
            borderRadius: 5,
            width: 45,
            height: 45,
            backgroundColor:
              val >= this.state.rating
                ? colors.theme_fg
                : colors.theme_button_fg,
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "5%",
            paddingLeft: "5%",
            marginRight: "5%",
          }}
          onPress={() => this.setState({ rating: val })}
        >
          <Text
            style={{
              color:
                val >= this.state.rating
                  ? colors.theme_button_fg
                  : colors.theme_fg,
              fontSize: 18,
              fontFamily: colors.font_family,
            }}
          >
            {" "}
            {val}{" "}
          </Text>
        </Col>
      );
    });
    return (
      <Container>
        <Header
          style={{
            backgroundColor: colors.header,
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
              <Text>{strings.filters}</Text>
            </Title>
          </Body>
          <Right>
            <Button small danger style={styles.ratingbtn}>
              <Text
                onPress={this.reset}
                style={{ fontSize: 14, color: colors.header, fontFamily: colors.font_family, }}
              >
                {strings.filters_reset}
              </Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Grid>
            <ScrollView>
              <Row>
                <Content style={styles.secondblock}>
                  <Row
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    <Col style={{ width: "100%" }}>
                      <Row style={{ paddingBottom: 10 }}>
                        <Text style={styles.restaurantname}>
                          {strings.rating_stars}
                        </Text>
                      </Row>
                      <Row
                        style={{
                          paddingTop: 5,
                          paddingBottom: 10,
                          paddingLeft: 10,
                        }}
                      >
                        {ratings}
                      </Row>
                    </Col>
                  </Row>
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  />
                  <Row
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    <Col style={{ width: "100%" }}>
                      <Row style={{ paddingBottom: 10 }}>
                        <Text style={styles.restaurantname}>
                          {strings.price_range}
                        </Text>
                      </Row>
                      <Row
                        style={{
                          paddingTop: 5,
                          paddingBottom: 10,
                          paddingLeft: 10,
                        }}
                      >
                        <Button
                          small
                          style={
                            this.state.price == "low"
                              ? styles.distancebtn_active
                              : styles.distancebtn
                          }
                          onPress={() => this.setState({ price: "low" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.price == "low"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            {strings.low}
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.price == "high"
                              ? styles.distancebtn_active
                              : styles.distancebtn
                          }
                          onPress={() => this.setState({ price: "high" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.price == "high"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            {strings.high}
                          </Text>
                        </Button>
                        {/* 
                     <Text style={{paddingTop:10,paddingRight:10,color : "#F5511E",fontSize:16}}>$10
                        </Text>
                     <Slider
                      style={{width: '70%', height: 40,paddingLeft:10,paddingRight:10}}
                      minimumValue={10}
                      maximumValue={1000}
                      minimumTrackTintColor="#F5511E"
                      maximumTrackTintColor="#F9E6E0"
                      thumbTintColor="#F5511E"
                      step={10}
                        value={this.state.value}
                        onValueChange={value => this.setState({ value })}
                        /> 
                        <Text style={{paddingTop:10,paddingLeft:10,color : "#F5511E",fontSize:16}}>$  
                        {this.state.value}
                        </Text>
                     */}
                      </Row>
                    </Col>
                  </Row>
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  />
                  <Row
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    <Col style={{ width: "100%" }}>
                      <Row style={{ paddingBottom: 10 }}>
                        <Text style={styles.restaurantname}>
                          {strings.distance_from_current_location}
                        </Text>
                      </Row>
                      <Row
                        style={{
                          paddingTop: 5,
                          paddingBottom: 10,
                          paddingLeft: 10,
                        }}
                      >
                        <Button
                          small
                          style={
                            this.state.distance == "nearest"
                              ? styles.distancebtn_active
                              : styles.distancebtn
                          }
                          onPress={() => this.setState({ distance: "nearest" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.distance == "nearest"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            {strings.nearest}
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.distance == "longest"
                              ? styles.distancebtn_active
                              : styles.distancebtn
                          }
                          onPress={() => this.setState({ distance: "longest" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.distance == "longest"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            {strings.longest}
                          </Text>
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                  {/*}
                  {this.state.user_id != 0 ? 
                  <View>
                     <Divider style={{ backgroundColor: '#FD4431', marginLeft:10, marginRight:10 }}></Divider>
                  <Row style={{ paddingTop:10, paddingBottom:10, marginLeft:10, marginRight:10 }}>
                   
                    <Col style={{ width:'100%' }}>
                     <Row style={{ paddingBottom:10 }}>
                     <Text style={styles.restaurantname}>My Favourites :</Text>
                     </Row>
                     <Row>
                     <CheckBox
                        title='Show all my favourites'
                        checked={this.state.checked}
                        checkedColor='#F5511E'
                        uncheckedColor='#7f7f7f'
                        textStyle={{color:'#a3a3a3',fontSize:14}}
                        containerStyle={{backgroundColor: '#FFFFFF',borderWidth:0}}
                        onPress={() => this.setState({checked: !this.state.checked})}
                      />
                     </Row>
                    </Col>
                  </Row>
                  </View>
                   : null} 
                  */}
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  />

                  <Row
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    <Col style={{ width: "100%" }}>
                      <Row style={{ paddingBottom: 10 }}>
                        <Text style={styles.restaurantname}>
                          {strings.food_type}
                        </Text>
                      </Row>
                      <Row
                        style={{
                          paddingTop: 5,
                          paddingBottom: 10,
                          paddingLeft: 10,
                        }}
                      >
                        <Button
                          small
                          style={
                            this.state.type == "both"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ type: "both" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.type == "both"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            {strings.all}
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.type == "veg"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ type: "veg" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.type == "veg"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            {strings.veg}
                          </Text>
                        </Button>
                        {/*<Button style={this.state.type == 'nonveg' ? styles.foodbtn_active : styles.foodbtn} onPress={() => this.setState({type: 'nonveg'})} ><Text style={{ fontSize:14, color:this.state.type == 'nonveg' ? colors.theme_button_fg : colors.theme_fg, padding:10 }}>Non-Veg</Text></Button>*/}
                      </Row>
                    </Col>
                  </Row>
                  <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  />
                                    <Divider
                    style={{
                      backgroundColor: colors.divider,
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  />

                  <Row
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    <Col style={{ width: "100%" }}>
                      <Row style={{ paddingBottom: 10 }}>
                        <Text style={styles.restaurantname}>
                          Type
                        </Text>
                      </Row>
                      <Row
                        style={{
                          paddingTop: 5,
                          paddingBottom: 10,
                          paddingLeft: 10,
                        }}
                      >
                        <Button
                          small
                          style={
                            this.state.location_type == "restaurant"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ location_type: "restaurant" })}
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
                        {/* <Button
                          small
                          style={
                            this.state.location_type == "home"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ location_type: "home" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "home"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                              Home
                          </Text>
                        </Button> */}
                        <Button
                          small
                          style={
                            this.state.location_type == "groceries"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ location_type: "groceries" })}
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
                          onPress={() => this.setState({ location_type: "supplies" })}
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
                          onPress={() => this.setState({ location_type: "alcohol" })}
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

                      </Row>
                      <Row
                        style={{
                          paddingTop: 5,
                          paddingBottom: 10,
                          paddingLeft: 10,
                        }}
                      >

                        {/* <Button
                          small
                          style={
                            this.state.location_type == "restaurant"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ location_type: "restaurant" })}
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
                            restaurant
                          </Text>
                        </Button>
                        <Button
                          small
                          style={
                            this.state.location_type == "cafe"
                              ? styles.foodbtn_active
                              : styles.foodbtn
                          }
                          onPress={() => this.setState({ location_type: "cafe" })}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              color:
                                this.state.location_type == "cafe"
                                  ? colors.theme_button_fg
                                  : colors.theme_fg,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Cafes
                          </Text>
                        </Button> */}

                        {/*<Button style={this.state.type == 'nonveg' ? styles.foodbtn_active : styles.foodbtn} onPress={() => this.setState({type: 'nonveg'})} ><Text style={{ fontSize:14, color:this.state.type == 'nonveg' ? colors.theme_button_fg : colors.theme_fg, padding:10 }}>Non-Veg</Text></Button>*/}
                      </Row>

                    </Col>
                  </Row>

                  <Row>
                    <Content style={{ marginTop: "0%", marginBottom: "2%" }}>
                      <View>
                        <AnimateLoadingButton
                          ref={(c) => (this.loadingButton = c)}
                          width={this.state.screenWidth - 20}
                          height={40}
                          title={strings.apply_filter}
                          titleFontSize={15}
                          titleFontFamily={colors.font_family}
                          titleColor={colors.theme_button_fg}
                          backgroundColor={colors.theme_fg}
                          borderRadius={5}
                          onPress={this.filter_submit.bind(this)}
                        />
                      </View>
                    </Content>
                  </Row>
                </Content>
              </Row>
            </ScrollView>
          </Grid>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  secondblock: {
    width: "100%",
  },
  restaurantname: {
    marginLeft: 5,
    color: colors.header,
    fontSize: 16,
    fontFamily: colors.font_family_bold,
  },
  ratingbtn: {
    fontSize: 10,
    backgroundColor: colors.theme_button_fg,
    borderRadius: 3,
    textAlign: "center",
    marginRight: 10,
    elevation: 0,
    shadowOpacity: 0,
    fontFamily: colors.font_family,
  },
  distancebtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.theme_button_fg,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    elevation: 0

  },
  distancebtn_active: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.theme_fg,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    elevation: 0

  },
  foodbtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.theme_button_fg,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    elevation: 0

  },
  foodbtn_active: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.theme_fg,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.theme_fg,
    elevation: 0

  },
  rating: {
    fontSize: 10,
    fontFamily: colors.font_family,
  },
});
