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
import TearLines from "react-native-tear-lines";
import { Divider } from "react-native-elements";
import AnimateLoadingButton from "react-native-animate-loading-button";
import Snackbar from "react-native-snackbar";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL } from "../config/Constants";
import StarRating from "react-native-star-rating";
import * as colors from "../assets/css/Colors";
import { fb } from ".././config/ConfigFirebase";
import strings from "./stringsoflanguages";

export default class CustomerReview extends Component {
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
      order_id: this.props.navigation.getParam("order_id"),
      order_date: this.props.navigation.getParam("date"),
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
    // this.props
    // .navigation
    // .dispatch(StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'OrderHistory'
    //     }),
    //   ],
    // }))
    this.props.navigation.navigate("OrderHistory");
    return true;
  }
  get_shops = async () => {
    fb.ref(
      "/customer_pendings/" +
        this.state.customer_id +
        "/" +
        this.state.order_id +
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
      order_id: this.state.order_id,
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
        console.log(this.state.order_details);
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
      sale_type: "order",
      sale_id: this.state.order_id,
      location_id: this.state.location_id,
      customer_id: this.state.customer_id,
      rating_quality: this.state.food_rate,
      rating_service: this.state.restaurant_rate,
      rating_delivery: this.state.delivery_rate,
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
    this.props.navigation.navigate("OrderHistory");
    return true;
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
    let menus = this.state.order_details_menu.map((val, key) => {
      // foodcst = foodcst + val.menu_total;
      return (
        <Row
          style={{
            elevation: 0,
            // shadowOffset: { height: 2, width: 0 },
            // shadowOpacity: 2,
            // shadowColor: colors.theme_fg,
            // borderColor: colors.icons,
            borderRadius: 5,
            // borderWidth: 0.7,
            marginBottom: 10,
            backgroundColor: colors.bg_two,
          }}
        >
          <Content style={{ paddingBottom: 5 }}>
            <Row>
              <Col style={{ width: "70%" }}>
                <Text style={styles.name}>{val.name}</Text>
                <Text style={styles.price}>
                  {val.quantity} x{" "}
                  {this.state.currency + "" + parseFloat(val.price).toFixed(2)}
                </Text>
              </Col>
              <Col style={{ width: "30%" }}>
                <Text style={styles.cart_values}>
                  {this.state.currency}
                  {parseFloat(val.subtotal).toFixed(2)}
                </Text>
              </Col>
            </Row>
          </Content>
        </Row>
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
                <Text>{strings.order_summary}</Text>
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
            style={{ backgroundColor: colors.header,
              shadowColor: 'transparent',
              shadowRadius: 0,
              shadowOffset: {
                  height: 0,
              },
              elevation: 0,
              borderWidth: 0,
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
                <Text>{strings.order_summary}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>
          <Content
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: 5,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            {/*             <Row>
              <Text
                style={{
                  color: colors.theme_fg,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {strings.order_summary_small_letters}
              </Text>
            </Row>
            <Divider
              style={{ backgroundColor: colors.divider, 
                marginBottom: 10 }}
            /> */}
            {shops}
            <TearLines
                ref="top"
                color={colors.bg_two}
                backgroundColor= "#ffff"/>
            <View
              style={{
                elevation: 0,
                // shadowOffset: { height: 2, width: 0 },
                // shadowOpacity: 2,
                // shadowColor: colors.theme_fg,
                // borderColor: colors.icons,
                borderRadius: 0,
                // borderWidth: 0.7,
                marginBottom: 0,
                backgroundColor: colors.bg_two,
                padding: 10,
              }}
              onLayout={e => {
                this.refs.top.onLayout(e);
                this.refs.bottom.onLayout(e);
              }}
            >
              <Row>
                <Text
                  style={{
                    color: colors.theme_fg,
                    fontSize: 16,
                    fontFamily: colors.font_family_bold,
                  }}
                >
                  {strings.your_order}
                </Text>
              </Row>
              <Divider
                style={{ backgroundColor: colors.tint_col, marginVertical: 10 }}
              />

              {menus}

              <Divider
                style={{ backgroundColor: colors.tint_col, marginBottom: 10 }}
              />
              <Row>
                <Col style={{ width: "70%" }}>
                  <Text style={styles.cart_label}>{strings.sub_total}</Text>
                </Col>
                <Col style={{ width: "30%" }}>
                  <Text style={styles.cart_values}>
                    {this.state.currency +
                      "" +
                      this.state.order_details.sub_total}{" "}
                  </Text>
                </Col>
              </Row>

              {this.state.coupon_name !== "" ? (
                <Row>
                  <Col style={{ width: "70%" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "right",
                        fontFamily: colors.font_family_bold,
                        marginTop: 5,
                        color:
                          this.state.coupon_code !== ""
                            ? "green"
                            : colors.sub_font,
                      }}
                    >
                      {this.state.coupon_name}
                    </Text>
                  </Col>
                  <Col style={{ width: "30%" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "right",
                        fontFamily: colors.font_family_bold,
                        marginTop: 5,
                        color:
                          this.state.coupon_code !== ""
                            ? "green"
                            : colors.sub_font,
                      }}
                    >
                      {this.state.currency + "" + this.state.coupon_amount}{" "}
                    </Text>
                  </Col>
                </Row>
              ) : null}
              {this.state.order_details.vat_percentage ? (
                <Row>
                  <Col style={{ width: "70%" }}>
                    <Text style={styles.cart_label}>
                      {this.state.order_details.vat_percentage}
                    </Text>
                  </Col>
                  <Col style={{ width: "30%" }}>
                    <Text style={styles.cart_values}>
                      {this.state.currency + "" + this.state.order_details.vat}
                    </Text>
                  </Col>
                </Row>
              ) : null}
              <Divider
                style={{ backgroundColor: colors.tint_col, marginTop: 10 }}
              />
              <Row style={{ marginVertical: 10 }}>
                <Col style={{ width: "70%" }}>
                  <Text style={styles.total}>{strings.total_cost}</Text>
                </Col>
                <Col style={{ width: "30%" }}>
                  <Text style={styles.total_values}>
                    {this.state.currency +
                      "" +
                      parseFloat(this.state.order_details.order_total).toFixed(
                        2
                      )}
                  </Text>
                </Col>
              </Row>
            </View>
            <TearLines
                isUnder
                ref="bottom"
                color={colors.bg_two}
                backgroundColor="#ffff"/>

            <View
              style={{
                elevation: 0,
                // shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0,
                // shadowColor: colors.theme_fg,
                // borderColor: colors.icons,
                borderRadius: 5,
                // borderWidth: 0.7,
                marginTop: 10,
                marginBottom: 10,
                backgroundColor: colors.bg_two,
                padding: 10,
              }}
            >
              <Row>
                <Col>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 16,
                      fontFamily: colors.font_family_bold,
                    }}
                  >
                    {strings.order_details}
                  </Text>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: colors.tint_col }} />

              <Row
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  paddingHorizontal: 15,
                }}
              >
                <Left>
                  <Text style={{ color: colors.theme_fg, fontSize: 14 }}>
                    {strings.order_id}{" "}
                  </Text>
                </Left>
                <Right>
                  <Text style={{ color: colors.sub_font, fontSize: 14 }}>
                    #{this.pad(this.state.order_id, 6)}
                  </Text>
                </Right>
              </Row>
              <Row style={{ marginBottom: 10, paddingHorizontal: 15 }}>
                <Left>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 14,
                      textAlign: "left",
                    }}
                  >
                    {strings.order_date}
                  </Text>
                </Left>
                <Right>
                  <Text style={{ color: colors.sub_font, fontSize: 14 }}>
                    {this.state.order_date}
                  </Text>
                </Right>
              </Row>
              <Row style={{ marginBottom: 10, paddingHorizontal: 15 }}>
                <Left>
                  <Text
                    style={{
                      // color: colors.sub_font,
                      fontSize: 14,
                      color: colors.theme_fg,
                    }}
                  >
                    {strings.payment}{" "}
                  </Text>
                </Left>
                <Right>
                  <Text style={{ color: colors.sub_font, fontSize: 14 }}>
                    {" "}
                    {this.state.order_details.payment_method}
                  </Text>
                </Right>
              </Row>
            </View>

            <View
              style={{
                elevation: 0,
                // shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0,
                // shadowColor: colors.theme_fg,
                // borderColor: colors.icons,
                borderRadius: 5,
                // borderWidth: 0.7,
                marginBottom: 10,
                backgroundColor: colors.bg_two,
                padding: 10,
              }}
            >
              <Row>
                <Left style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 16,
                      fontFamily: colors.font_family_bold,
                    }}
                  >
                    {strings.rate_order}
                  </Text>
                </Left>
                <Right style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.theme_fg,
                      fontSize: 16,
                      textAlign: "right",
                    }}
                  >
                    {this.state.review_status == 0
                      ? strings.pending_review
                      : this.state.review_status == 1
                      ? strings.approved
                      : ""}
                  </Text>
                </Right>
              </Row>
              <Divider style={{ backgroundColor: colors.tint_col }} />
              <Row
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    //justifyContent: "center",
                    //alignItems: "center",
                    textAlign: "justify",
                    color: colors.sub_font,
                  }}
                >
                  {strings.your_revies_help_others_order_on_app_text}
                </Text>
              </Row>

              {this.state.order_type == 1 && (
                <Row>
                  <Text style={{ fontSize: 16, color: colors.theme_fg }}>
                    {strings.how_was_the_delivery}
                  </Text>
                </Row>
              )}
              <Divider
                style={{
                  backgroundColor: colors.theme_button_fg,
                  marginTop: 10,
                  height: 1,
                  marginHorizontal: 10,
                }}
              />

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
                        disabled={
                          this.state.review_status == null ? false : true
                        }
                        maxStars={5}
                        rating={this.state.delivery_rate}
                        starSize={24}
                        fullStarColor={colors.star_icons}
                        emptyStarColor={colors.star_icons}
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
              {/* <Row style={{marginTop:20}}>
           <Text style={{fontSize:16}}>{strings.how_was_the_product}</Text>
        </Row>
        <Content style={styles.firstblock}>
          <Row>
              <Col style={{width:"50%",paddingTop:'3%',paddingBottom:'3%',paddingLeft:'5%'}}>
              <Thumbnail square source={require('.././assets/img/food_review.png')} ></Thumbnail>
              </Col>
              <Col style={{width:"50%"}}>
              <StarRating
                          disabled={this.state.review_status == null ? false : true}
                          maxStars={5}
                          rating={this.state.food_rate}
                          starSize={24}
                          fullStarColor={colors.theme_fg}
                          emptyStarColor={colors.theme_fg}
                          containerStyle={{marginTop:'15%',marginBottom:'15%',marginRight:'15%'}}
                          selectedStar={(rating) => this.setState({food_rate: rating})}
                      />
              </Col>
          </Row>
        </Content> */}
              <Row style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 16, color: colors.theme_fg }}>
                  {strings.how_was_the_food}
                </Text>
              </Row>
              <Divider
                style={{
                  backgroundColor: colors.theme_button_fg,
                  marginTop: 10,
                  height: 1,
                  marginHorizontal: 10,
                }}
              />
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
                      disabled={this.state.review_status == null ? false : true}
                      maxStars={5}
                      rating={this.state.restaurant_rate}
                      starSize={24}
                      fullStarColor={colors.star_icons}
                      emptyStarColor={colors.star_icons}
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
            </View>
            {/*<Row style={{marginTop:20}}>
        <Text style={{fontSize:16}}>{strings.comment}</Text>
        </Row>
         <Row style={{marginTop:10}}>
        {this.state.review_status == null ? 
        <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder={strings.type_your_text_here}
            placeholderTextColor={"#9E9E9E"}
            numberOfLines={10}
            multiline={true}
            width={this.state.screenWidth-30}
            onChangeText={(text) => this.setState({comment:text})}
            value={this.state.comment}
            
          />
          :
          <Text style={{padding:5,fontSize:18,color:colors.theme_fg}}>{this.state.comment}</Text>
        }
        </Row> */}
            {this.state.review_status == null ? (
              <View>
                <Row
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: "1%",
                    marginLeft: "1%",
                  }}
                >
                  <AnimateLoadingButton
                    ref={(c) => (this.loadingButton = c)}
                    width={this.state.screenWidth - 20}
                    height={40}
                    title={strings.submit}
                    titleFontSize={15}
                    titleColor={colors.theme_button_fg}
                    backgroundColor={colors.theme_fg}
                    borderRadius={5}
                    onPress={this.saverating}
                    titleFontFamily={colors.font_family}
                  />
                </Row>
                <Row
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // marginTop: 20,
                    marginBottom: 10,
                    marginRight: "1%",
                    marginLeft: "1%",
                  }}
                >
                  <AnimateLoadingButton
                    width={this.state.screenWidth - 30}
                    height={40}
                    title={strings.later_text}
                    titleFontSize={15}
                    titleColor={colors.sp_subtext_fg}
                    backgroundColor={colors.bg_two}
                    borderRadius={5}
                    onPress={this.later}
                    titleFontFamily={colors.font_family}
                  />
                </Row>
              </View>
            ) : null}
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
    fontFamily: colors.font_family_bold,
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
    fontFamily: colors.font_family_bold,
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
    // borderRadius: 3,
    // borderWidth: 1,
    elevation: 0,
    // shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0,
    // shadowColor: colors.shadow,
    // borderColor: colors.theme_button_fg,
    // backgroundColor: colors.theme_button_fg,
  },
});
