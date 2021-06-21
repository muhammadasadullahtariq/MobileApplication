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
  TextInput,
  Dimensions,
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
import { Divider } from "react-native-elements";
import AnimateLoadingButton from "react-native-animate-loading-button";
import Snackbar from "react-native-snackbar";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL } from "../config/Constants";
import StarRating from "react-native-star-rating";
import * as colors from "../assets/css/Colors";
import { fb } from "../config/ConfigFirebase";
import strings from "./stringsoflanguages";

export default class ReservationReview extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      showIndicator: false,
      validation: true,
      delivery_rate: 0,
      food_rate: 0,
      restaurant_rate: 0,
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
      reservation_id: this.props.navigation.getParam("reservation_id"),
      reservation_date: this.props.navigation.getParam("date"),
      reservation_time: this.props.navigation.getParam("time"),
      guest_count: this.props.navigation.getParam("count"),
      customer_id: this.props.navigation.getParam("customer_id"),
      location_id: this.props.navigation.getParam("location_id"),
      comment: "",
      order_details_menu: [],
      order_details: [],
      currency: global.currency,
      review_status: "",
      shop_list: [],
      coupon_name: "",
      coupon_amount: 0,
      order_type: 0,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async componentDidMount() {
    this.setState({ showIndicator: true });
    await this.get_order_details();
    await this.get_shops();
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
  get_shops = async () => {
    fb.ref(
      "/customer_pendings/" +
        this.state.customer_id +
        "/" +
        this.state.reservation_id +
        "/shop"
    ).on("value", (dataSnapshot) => {
      var shop_list = [];
      if (dataSnapshot.numChildren() > 0) {
        dataSnapshot.forEach((child) => {
          shop_list.push(child.val());
          this.setState({
            shop_list: shop_list,
          });
        });
      }
    });
  };
  async get_order_details() {
    var details = {
      page: 0,
      customer_id: this.state.customer_id,
      reservation_id: this.state.reservation_id,
      status: "all",
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    await fetch(BASE_URL + "restaurantsList/getOrderHistory", {
      method: "post",
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then(async (res) => {
        await this.setState({
          order_details_menu: res.result[0].ordered_items,
          order_details: res.result[0],
          food_rate: res.result[0].quality_rating,
          restaurant_rate: res.result[0].service_rating,
          delivery_rate: res.result[0].delivery_rating,
          comment: res.result[0].review_text,
          review_status: res.result[0].review_status,
          coupon_name: res.result[0].coupon_code,
          coupon_amount: res.result[0].coupon_value,
          order_type: res.result[0].order_type,
        });
        this.setState({ showIndicator: false });
      })
      .catch((error) => {
        this.setState({ showIndicator: false });
        //this.loadingButton.showLoading(false);
        this.showSnackbar(strings.cus_rev_something_went_wrong);
      });
  }

  saverating = async () => {
    this.loadingButton.showLoading(true);
    //this.checkValidate();
    var add_details = {
      sale_type: "reservation",
      sale_id: this.state.reservation_id,
      location_id: this.state.location_id,
      customer_id: this.state.customer_id,
      rating_quality: this.state.food_rate,
      rating_service: this.state.restaurant_rate,
      review_text: this.state.comment,
    };
    var formBody = [];
    for (var property in add_details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(add_details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    fetch(BASE_URL + "restaurantsList/addReview", {
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
        if (res.message != "Success") {
          this.loadingButton.showLoading(false);
          this.showSnackbar(res.message.error);
        } else {
          this.loadingButton.showLoading(false);
          this.showSnackbar(strings.thank_you_for_your_feedback);
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
        }
      })
      .catch((error) => {
        this.loadingButton.showLoading(false);
        this.showSnackbar(strings.cus_rev_something_went_wrong);
      });
  };
  later = async () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "OrderHistory",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }

  render() {
    let shops = this.state.shop_list.map((val, key) => {
      return (
        <Row>
          <Text
            style={{ color: colors.sub_font, fontSize: 18, marginLeft: 10 }}
          >
            {val.restaurnat_name}
            {"\n"}
          </Text>
          <Text style={{ marginLeft: 10 }}>
            {val.restaurant_address}
            {"\n"}
            {strings.phone} {val.restaurant_phone}
          </Text>
        </Row>
      );
    });
    //   let menus = this.state.order_details_menu.map((val,key) => {
    //     // foodcst = foodcst + val.menu_total;
    //      return(
    //        <Row>
    //            <Content style={{ paddingBottom:5 }} >
    //            <Row>
    //              <Col style={{ width:'70%' }}>
    //                 <Text style={styles.name} >{val.name}</Text>
    //                 <Text style={styles.price}>{val.quantity} x {this.state.currency+''+ parseFloat(val.price).toFixed(2)}</Text>
    //              </Col>
    //              <Col style={{ width:'30%' }}>
    //                 <Text style={styles.cart_values} >{this.state.currency}{parseFloat(val.subtotal).toFixed(2)}</Text>
    //              </Col>
    //              </Row>

    //          </Content>
    //        </Row>
    //      )
    //  });
    if (this.state.showIndicator) {
      return (
        <Container>
          <Header
            style={{ backgroundColor: colors.theme_fg }}
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
                <Text>Reservation Summary</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.theme_fg} />
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
                <Text>{strings.reservation_summary}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>

          <ScrollView>
            <Content
              style={{
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              {/* <Row>
            <Text style={{color:colors.theme_fg,fontSize:20}}>Reservation Summary</Text>
          </Row>
          <Divider style={{ backgroundColor: colors.divider,marginBottom:10 }} /> */}
              {/*{shops}
          <Row>
          <Text style={{color:colors.theme_fg,fontSize:20}}>{strings.your_order}</Text>
          </Row>
          <Divider style={{ backgroundColor: colors.divider,marginBottom:10 }} />
          <Divider style={{ backgroundColor: colors.divider }} />
          <Row>
            <Col style={{ width:'70%' }}>
              <Text style={styles.cart_label} >{strings.sub_total}</Text>
            </Col>
            <Col style={{ width:'30%' }}>
                <Text style={styles.cart_values}>{this.state.currency+''+this.state.order_details.sub_total} </Text>
            </Col>
          </Row> */}

              {/*{
          this.state.coupon_name !=="" ? (
            <Row>
            <Col style={{ width:'70%' }}>
              <Text style={{fontSize:16,textAlign:'right',fontWeight: "bold",marginTop:5,color:this.state.coupon_code !=="" ? "green":colors.sub_font}} >{this.state.coupon_name}</Text>
            </Col>
            <Col style={{ width:'30%' }}>
                <Text style={{fontSize:16,textAlign:'right',fontWeight: "bold",marginTop:5,color:this.state.coupon_code !=="" ? "green":colors.sub_font,}}>{this.state.currency+''+this.state.coupon_amount} </Text>
            </Col>
          </Row>
          ):null
          }
          {this.state.order_details.vat_percentage ? 
          <Row>
            <Col style={{ width:'70%' }}>
                <Text style={styles.cart_label} >{this.state.order_details.vat_percentage}</Text>
            </Col>
            <Col style={{ width:'30%' }}>
                <Text style={styles.cart_values}>{this.state.currency+''+this.state.order_details.vat}</Text>
            </Col>
          </Row>
          :
          null
          }
           <Divider style={{ backgroundColor: colors.divider }} />
          <Row style={{marginBottom:10}}>
            <Col style={{ width:'70%' }}>
                <Text style={styles.total} >{strings.total_cost}</Text>
            </Col>
            <Col style={{ width:'30%' }}>
                <Text style={styles.total_values}>{this.state.currency+''+parseFloat(this.state.order_details.order_total).toFixed(2)}</Text>
            </Col>
          </Row> */}
              <Row>
                <Col>
                  <Text style={{ color: colors.theme_fg, fontSize: 20 }}>
                    {strings.reservation_details} - #{this.state.reservation_id}
                  </Text>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: colors.divider }} />
              <Row style={{ marginTop: 20 }}>
                <Col>
                  <Text
                    style={{
                      color: colors.sub_font,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {strings.reservation_date}
                  </Text>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {this.state.reservation_date}
                  </Text>
                </Col>
                <Col>
                  <Text
                    style={{
                      color: colors.sub_font,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {strings.reservation_guest_count}
                  </Text>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {this.state.guest_count} {strings.reservation_guests}
                  </Text>
                </Col>
                <Col>
                  <Text
                    style={{
                      color: colors.sub_font,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {strings.reservation_time}
                  </Text>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {this.state.reservation_time}
                  </Text>
                </Col>
              </Row>
              {/* <Row style={{marginBottom:10}}>
          <Left>
            <Col>  
                <Text style={{color:colors.sub_font,fontSize:14}}>Reservation id </Text> 
                <Text style={{color:colors.theme_fg,fontSize:14}}>#{this.state.reservation_id}</Text>
            </Col>
            </Left>
            <Right>
            
            </Right>
            
          </Row>  */}
              {/* <Row style={{marginBottom:10}}>
            <Col>  
                <Text style={{color:colors.sub_font,fontSize:14}}>{strings.payment} </Text> 
                <Text style={{color:colors.theme_fg,fontSize:14}}> {this.state.order_details.payment_method}</Text>
            </Col>
          </Row>  */}

              <Row style={{ marginTop: 15 }}>
                <Col style={{ width: Dimensions.get("screen").width * 0.7 }}>
                  <Text style={{ color: colors.theme_fg, fontSize: 20 }}>
                    {strings.rate_reservation}
                  </Text>
                </Col>
                <Col style={{ width: Dimensions.get("screen").width * 0.3 }}>
                  <Text style={{ color: colors.theme_fg, fontSize: 16 }}>
                    {this.state.review_status == 0
                      ? strings.pending_review
                      : this.state.review_status == 1
                      ? strings.approved
                      : ""}
                  </Text>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: colors.divider }} />
              <Row
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  marginLeft: 40,
                  marginRight: 40,
                }}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {
                    strings.reservation_your_revies_help_others_order_on_app_text
                  }
                </Text>
              </Row>

              {this.state.order_type == 1 && (
                <Row>
                  <Text style={{ fontSize: 16 }}>
                    {strings.how_was_the_delivery}
                  </Text>
                </Row>
              )}
              {this.state.order_type == 1 && (
                <Content style={styles.firstblock}>
                  <Row>
                    <Col
                      style={{
                        width: "50%",
                        paddingTop: "3%",
                        paddingBottom: "3%",
                        paddingLeft: "5%",
                      }}
                    >
                      <Thumbnail
                        square
                        source={require(".././assets/img/delivery_review.png")}
                      ></Thumbnail>
                    </Col>
                    <Col style={{ width: "50%" }}>
                      <StarRating
                        disabled={this.state.review_status == 0 ? false : true}
                        maxStars={5}
                        rating={this.state.delivery_rate}
                        starSize={24}
                        fullStarColor={colors.theme_fg}
                        emptyStarColor={colors.theme_fg}
                        containerStyle={{
                          marginTop: "15%",
                          marginBottom: "15%",
                          marginRight: "15%",
                        }}
                        selectedStar={(rating) =>
                          this.setState({ delivery_rate: rating })
                        }
                      />
                    </Col>
                  </Row>
                </Content>
              )}
              <Row style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 16 }}>
                  {strings.reservataion_how_was_the_item}
                </Text>
              </Row>
              <Content style={styles.firstblock}>
                <Row>
                  <Col
                    style={{
                      width: "50%",
                      paddingTop: "3%",
                      paddingBottom: "3%",
                      paddingLeft: "5%",
                    }}
                  >
                    <Thumbnail
                      square
                      source={require(".././assets/img/food_review.png")}
                    ></Thumbnail>
                  </Col>
                  <Col style={{ width: "50%" }}>
                    <StarRating
                      disabled={this.state.review_status == 0 ? false : true}
                      maxStars={5}
                      rating={this.state.food_rate}
                      starSize={24}
                      fullStarColor={colors.theme_fg}
                      emptyStarColor={colors.theme_fg}
                      containerStyle={{
                        marginTop: "15%",
                        marginBottom: "15%",
                        marginRight: "15%",
                      }}
                      selectedStar={(rating) =>
                        this.setState({ food_rate: rating })
                      }
                    />
                  </Col>
                </Row>
              </Content>
              <Row style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 16 }}>
                  {strings.reservataion_how_was_the_service}
                </Text>
              </Row>
              <Content style={styles.firstblock}>
                <Row>
                  <Col
                    style={{
                      width: "50%",
                      paddingTop: "3%",
                      paddingBottom: "3%",
                      paddingLeft: "5%",
                    }}
                  >
                    <Thumbnail
                      square
                      source={require(".././assets/img/restaurant_review.png")}
                    ></Thumbnail>
                  </Col>
                  <Col style={{ width: "50%" }}>
                    <StarRating
                      disabled={this.state.review_status == 0 ? false : true}
                      maxStars={5}
                      rating={this.state.restaurant_rate}
                      starSize={24}
                      fullStarColor={colors.theme_fg}
                      emptyStarColor={colors.theme_fg}
                      containerStyle={{
                        marginTop: "15%",
                        marginBottom: "15%",
                        marginRight: "15%",
                      }}
                      selectedStar={(rating) =>
                        this.setState({ restaurant_rate: rating })
                      }
                    />
                  </Col>
                </Row>
              </Content>
              <Row style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 16 }}>{strings.comment}</Text>
              </Row>
              <Row style={{ marginTop: 10 }}>
                {this.state.review_status == 0 ? (
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder={strings.type_your_text_here}
                    placeholderTextColor={"#9E9E9E"}
                    numberOfLines={10}
                    multiline={true}
                    width={this.state.screenWidth - 30}
                    onChangeText={(text) => this.setState({ comment: text })}
                    value={this.state.comment}
                  />
                ) : (
                  <Text
                    style={{ padding: 5, fontSize: 18, color: colors.theme_fg }}
                  >
                    {this.state.comment}
                  </Text>
                )}
              </Row>
              {this.state.review_status == 0 ? (
                <View>
                  <Row
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                      marginBottom: 10,
                      marginRight: "1%",
                      marginLeft: "1%",
                    }}
                  >
                    <AnimateLoadingButton
                      ref={(c) => (this.loadingButton = c)}
                      width={250}
                      height={40}
                      title={strings.submit}
                      titleFontSize={15}
                      titleColor={colors.theme_button_fg}
                      backgroundColor={colors.theme_fg}
                      borderRadius={2}
                      onPress={this.saverating}
                      titleFontFamily={colors.font_family}
                    />
                  </Row>
                  <Row style={{ marginBottom: 20, marginRight: 10 }}>
                    <AnimateLoadingButton
                      width={this.state.screenWidth - 20}
                      height={40}
                      title={strings.later_text}
                      titleFontSize={15}
                      titleColor={colors.sp_subtext_fg}
                      backgroundColor={colors.theme_button_fg}
                      borderRadius={2}
                      onPress={this.later}
                      titleFontFamily={colors.font_family}
                    />
                  </Row>
                </View>
              ) : null}
            </Content>
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
  name: {
    color: colors.theme_fg,
    fontSize: 16,
    textAlign: "left",
    marginLeft: 10,
  },
  price: {
    color: colors.sub_font,
    fontSize: 14,
    textAlign: "left",
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  total: {
    textAlign: "right",
    color: colors.theme_fg,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
    textAlignVertical: "top",
    borderWidth: 1,
    padding: 10,
    marginLeft: "1%",
    marginRight: "1%",
    borderColor: colors.border,
    fontFamily: colors.font_family,
  },
  cart_values: {
    fontSize: 16,
    textAlign: "right",
    marginTop: 5,
    color: colors.sub_font,
  },
  total_values: {
    textAlign: "right",
    color: colors.theme_fg,
    fontSize: 16,
  },
  cart_label: {
    fontSize: 16,
    textAlign: "right",
    marginTop: 5,
    color: colors.sub_font,
  },
  firstblock: {
    marginLeft: "1%",
    marginRight: "1%",
    marginTop: 10,
    borderRadius: 3,
    borderWidth: 1,
    elevation: 5,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowColor: colors.shadow,
    borderColor: colors.theme_button_fg,
    backgroundColor: colors.theme_button_fg,
  },
});
