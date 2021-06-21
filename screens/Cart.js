import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  Keyboard,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
  Platform,
  Button as ReactButton,
  Modal,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  Picker,
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
  Input,
} from "native-base";
//import {Picker} from '@react-native-community/picker';
import AnimateLoadingButton from "react-native-animate-loading-button";
import { Divider, Rating } from "react-native-elements";
import { Div } from "react-native-div";
import SQLite from "react-native-sqlite-storage";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL, img_url } from "../config/Constants";
import { WebView } from "react-native-webview";
import stripe from "tipsi-stripe";
import testID from "../utils/testID";
import Snackbar from "react-native-snackbar";
import { fb } from "../config/ConfigFirebase";
import UIStepper from "react-native-ui-stepper";
import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";
import TearLines from "react-native-tear-lines";
import PayToday from "./PayToday";
import moment from "moment";
import Geocoder from "react-native-geocoding";
import ScrollViewIndicator from "react-native-scroll-indicator";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native";
import { getDistance } from "geolib";

import { GOOGLE_KEY } from "../config/Constants";

const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

const payments = [
  {
    label: strings.cash,
    value: "cash",
    color: colors.sub_font,
  },
  {
    label: "Stripe",
    value: "stripe",
    color: colors.sub_font,
  },
];

let db = SQLite.openDatabase({ name: "spotneats.db" });

export const guidGenerator = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

export default class Cart extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      val: 0,
      showIndicator: false,
      disabled: false,
      dataSource: [],
      option_value_name: null,
      food_cost: 0,
      tax_percent: 0,
      total_cost: 0,
      location_name: "",
      location_id: 0,
      location_description: "",
      details: this.props.navigation.getParam("details")
        ? this.props.navigation.getParam("details")
        : "",
      user_id: 0,
      name: "",
      phone: "",
      lat: "",
      lng: "",
      address: [],
      def_add_id: this.props.navigation.getParam("default_id")
        ? this.props.navigation.getParam("default_id")
        : 0,
      default_id: this.props.navigation.getParam("default_id")
        ? this.props.navigation.getParam("default_id")
        : 0,
      total_items: 0,
      currency: global.currency,
      modal_open: false,
      loading: false,
      token: "",
      strip_resp: "",
      payment: "paytoday",
      email: "",
      modalVisible: false,
      link: "",
      comment_msg: "",
      coupon_code: "",
      discount_amount: "",
      apply_disabled: false,
      prev_total_cost: 0,
      coupon_id: 0,
      show_hide_coupon: false,
      added_amount: 0,
      tax_amount_cal: 0,
      offer_delivery: null,
      offer_collection: null,
      delivery_charge: 0,
      tax_delivery_charge: "",
      delivery_percent: 10,
      switchValue: null,
      delivery_fee: 0,
      table_price: 0,
      token: "",
      approvalUrl: null,
      paymentId: null,
      from: null,
      success_status: 0,
      trans_id: "",
      orderId: "",
      cart_length: null,
      table_length: null,
      screenWidth: Math.round(Dimensions.get("window").width),
    };
    Geocoder.init(GOOGLE_KEY);
  }
  async componentDidMount() {
    // if(this.state.address.address_1 && this.state.location_name)
    //this.delivery_func();
    console.log("details=====> ", this.state.details);
    this.subs = [
      this.props.navigation.addListener("didFocus", (payload) =>
        this.componentDidFocus(payload)
      ),
    ];
    await this.retrieveData();
    await this.first_get_cart();
    await this.default_address();

    // await fb
    //   .ref("/paypal_payment/" + this.state.user_id)
    //   .on("value", (snapshot) => {
    //     const userObj = snapshot.val();
    //     if (userObj) {
    //       this.setState({
    //         success_status: userObj.success_status,
    //         trans_id: userObj.trans_id,
    //       });
    //       if (this.state.success_status > 0) {
    //         this.setState({ modalVisible: false, disabled: false });
    //         if (this.state.success_status == 1) {
    //           this.showSnackbar("Payment Success");
    //           this.success();
    //         }
    //         if (this.state.success_status == 0) {
    //           this.showSnackbar("Payment Failed");
    //         }
    //       }
    //     }
    //   });
  }
  async componentDidFocus() {
    //this.setState({ showIndicator: true });
    this.setState({
      details: this.props.navigation.getParam("details")
        ? this.props.navigation.getParam("details")
        : "",
      def_add_id: this.props.navigation.getParam("default_id")
        ? this.props.navigation.getParam("default_id")
        : 0,
      default_id: this.props.navigation.getParam("default_id")
        ? this.props.navigation.getParam("default_id")
        : 0,
    });
    await this.retrieveData();
    await this.default_address();
    if (this.state.coupon_code != "") {
      await this.coupon_func();
    }
    await this.get_cart();
    //await this.delivery_func();
    this.setState({ showIndicator: false });
    //console.log("CARTFROMMENU2DETAILS", this.state.details)
    //console.log("After Mount 2", this.state.showIndicator)
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  delivery_func = async () => {
    //console.log("h1=>");
    if (this.state.offer_delivery == 1 && this.state.delivery_fee !== 0) {
      //console.log("h2=>");
      await this.calculateDeliveryCost();
    } else {
      //console.log("h8=>");
      // this.calculateDeliveryCost();
      var food_cst = parseFloat(this.state.food_cost);
      var tax = (((food_cst * this.state.tax_percent) / 100) * 10).toFixed(2);
      var tot_cst = (
        parseFloat(food_cst) +
        parseFloat((food_cst * this.state.tax_percent) / 100)
      ).toFixed(2);
      await this.setState({
        added_amount: await tax,
        total_cost: await tot_cst,
      });
    }
  };
  calculateTotalCharge = async (delivery_fee) => {
    // await setTimeout(async () => {
    //console.log("devliery fee===> ", delivery_fee);
    if (this.state.tax_delivery_charge == "YES") {
      //console.log("h3=>");
      if (this.state.discount_amount !== 0 && this.state.added_amount !== 0) {
        //console.log("h4=>");
        var charge = await parseFloat(delivery_fee).toFixed(2);
        var cost = await (
          parseFloat(this.state.added_amount) + parseFloat(charge)
        ).toFixed(2);
        var val = await (
          parseFloat(cost) +
          parseFloat(cost * parseFloat(this.state.tax_percent / 100))
        ).toFixed(2);
        await this.setState({
          added_amount: await cost,
          total_cost: await val,
        });
      } else {
        //console.log("h5=>");
        var charge = await parseFloat(delivery_fee).toFixed(2);
        //console.log("charge=> ", charge);
        var cost = await (
          parseFloat(this.state.food_cost) + parseFloat(charge)
        ).toFixed(2);
        //console.log("cost=> ", cost);
        var val = await (
          parseFloat(cost) +
          parseFloat(cost * parseFloat(this.state.tax_percent / 100))
        ).toFixed(2);
        //console.log("val=> ", val);
        // this.calculateDeliveryCost();
        await this.setState({
          // delivery_fee: await charge,
          added_amount: await cost,
          total_cost: await val,
        });
        // }, 1000);
      }
    } else {
      //console.log("h6=>");

      if (this.state.discount_amount !== 0 && this.state.added_amount !== 0) {
        // await this.calculateDeliveryCost();
        var charge = await parseFloat(delivery_fee).toFixed(2);
        var cost = await (
          parseFloat(this.state.added_amount) + parseFloat(charge)
        ).toFixed(2);
        var val = await (
          parseFloat(cost) +
          parseFloat(
            this.state.added_amount * parseFloat(this.state.tax_percent / 100)
          )
        ).toFixed(2);
        await this.setState({
          // delivery_fee: await charge,
          added_amount: await this.state.added_amount,
          total_cost: await val,
        });
      } else {
        //console.log("h7=>");
        // await this.calculateDeliveryCost();
        var charge = await parseFloat(delivery_fee).toFixed(2);
        var cost = await (
          parseFloat(this.state.food_cost) + parseFloat(charge)
        ).toFixed(2);
        var val = await (
          parseFloat(cost) +
          parseFloat(
            this.state.food_cost * parseFloat(this.state.tax_percent / 100)
          )
        ).toFixed(2);
        await this.setState({
          // delivery_fee: await charge,
          added_amount: await this.state.food_cost,
          total_cost: await val,
        });
      }
    }
  };
  toggleSwitch = async (value) => {
    var code = this.state.coupon_code;
    var amount = this.state.discount_amount;
    await this.setState({
      switchValue: (await this.state.switchValue) == 2 ? 1 : 2,
    });
    if (code != "") {
      if (this.state.switchValue === 2) {
        var added_val = await (
          parseFloat(this.state.food_cost) - parseFloat(amount)
        ).toFixed(2);
        var tax = await parseFloat(
          (added_val * this.state.tax_percent) / 100
        ).toFixed(2);
        var total = await (parseFloat(added_val) + parseFloat(tax)).toFixed(2);
        await this.setState({
          total_cost: await total,
          apply_disabled: await true,
          coupon_code: await code,
          added_amount: (await tax) * 10,
          discount_amount: await amount,
        });
      } else {
        //g("callc");
        await this.delivery_func();
      }
    } else {
      if (this.state.switchValue === 1) {
        //console.log("calld");
        await this.delivery_func();
      } else {
        var val = await (
          parseFloat(this.state.food_cost) +
          parseFloat((this.state.food_cost * this.state.tax_percent) / 100)
        ).toFixed(2);
        await this.setState({
          added_amount: await parseFloat(this.state.food_cost).toFixed(2),
          total_cost: await val,
        });
      }
    }
  };
  coupon_func = async () => {
    Keyboard.dismiss();
    this.setState({ added_amount: 0 });
    if (this.state.coupon_code != "") {
      var coupon_details = {
        customer_id: this.state.user_id,
        location_id: this.state.location_id,
        total_amount: this.state.total_cost,
        coupon: this.state.coupon_code,
      };
    } else {
      this.showSnackbar(strings.invalid_coupon);
      return;
    }
    var formBody = [];
    for (var property in coupon_details) {
      //console.log("loop")
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(coupon_details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log(formBody)
    await fetch(BASE_URL + "restaurantsList/checkCoupon", {
      method: "post",
      async: true,
      crossDomain: true,
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then(async (res) => {
        //console.log(res);
        if (res.message != "Success") {
          await this.setState({ apply_disabled: false });
          await this.get_cart();
          //console.log(res)
          this.showSnackbar(strings.invalid_coupon);
        } else {
          //console.log(res)
          await this.setState({
            discount_amount: parseFloat(res.result.discount).toFixed(2),
          });
          if (this.state.from != "TableBooking") {
            var value = this.state.food_cost - this.state.discount_amount;
            value = value.toFixed(2);
            var amount_cal =
              parseFloat(value) + (value * this.state.tax_percent) / 100;
            amount_cal = amount_cal.toFixed(2);
          } else {
            var value = this.state.food_cost - this.state.discount_amount;
            value = value.toFixed(2);
            var amount_cal =
              parseFloat(value) +
              parseFloat((value * this.state.tax_percent) / 100) +
              parseFloat(this.state.table_price);
            amount_cal = amount_cal.toFixed(2);
          }
          await this.setState({
            added_amount: value,
            apply_disabled: true,
            coupon_id: res.result.coupon_id,
          });
          await this.setState({ total_cost: amount_cal });
          this.showSnackbar(strings.coupon_applied);
        }
      });
    if (this.state.from != "TableBooking") {
      if (this.state.switchValue == 2) {
        var value = this.state.food_cost - this.state.discount_amount;
        value = value.toFixed(2);
        var amount_cal =
          parseFloat(value) + (value * this.state.tax_percent) / 100;
        amount_cal = amount_cal.toFixed(2);
        await this.setState({
          added_amount: value,
          apply_disabled: true,
          coupon_id: res.result.coupon_id,
        });
        await this.setState({ total_cost: amount_cal });
      } else {
        if (this.state.offer_delivery == 1) {
          this.delivery_func();
        } else {
          this.toggleSwitch();
        }
      }
    }
  };

  func = async () => {
    this.loadingButton.showLoading(true);

    if (this.state.address.length == 0) {
      this.showSnackbar("Please add a delivery location");
      this.loadingButton.showLoading(false);
    } else if (this.state.payment.toLocaleLowerCase() === "paytoday") {
      this.setState({
        modalVisible: true,
      });
      this.loadingButton.showLoading(false);
    } else {
      //     if(this.state.payment == 'knet')
      //     {
      //       var details = {
      //         "customer_id":this.state.user_id,
      //         "location_id":this.state.location_id,
      //         "total_price":this.state.total_cost,
      //         "cust_email":this.state.email,
      //         "cust_fname":this.state.name,
      //         "cust_mobile":this.state.phone
      //     };
      //     var formBody = [];
      //     for (var property in details) {
      //       var encodedKey = encodeURIComponent(property);
      //       var encodedValue = encodeURIComponent(details[property]);
      //       formBody.push(encodedKey + "=" + encodedValue);
      //     }
      //     formBody = formBody.join("&");

      //       fetch(BASE_URL+'restaurantsList/paymentUrlGenerate', {
      //       method: 'post',
      //       "async": true,
      //       "crossDomain": true,
      //       headers: {
      //           'Authorization': 'Basic YWRtaW46MTIzNA==',
      //           'X-API-KEY': 'RfTjWnZr4u7x!A-D',
      //           'Content-Type': 'application/x-www-form-urlencoded',
      //       },
      //       body: formBody
      //       }).then((response) => response.json())
      //        .then(async(res) => {
      //         if(res.message != "Success"){
      //         this.setState({link : res.result});
      //         this.setModalVisible(true);

      //        }else{

      //      console.log(res.message);
      //     }
      //   });
      // }
      if (this.state.payment == "paypal_express") {
        var details = {
          // "customer_id":this.state.user_id,
          // "location_id":this.state.location_id,
          // "total_price":this.state.total_cost,
          // "cust_email":this.state.email,
          // "cust_fname":this.state.name,
          // "cust_mobile":this.state.phone
          first_name: this.state.name,
          last_name: "",
          payer_email: this.state.email,
          amount: this.state.total_cost,
          customer_id: this.state.user_id,
        };
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch(BASE_URL + "restaurantsList/paymentUrlGenerate", {
          method: "post",
          async: true,
          crossDomain: true,
          headers: {
            Authorization: "Basic YWRtaW46MTIzNA==",
            "X-API-KEY": "RfTjWnZr4u7x!A-D",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody,
        })
          .then((response) => response.json())
          .then(async (res) => {
            if (res.message != "Success") {
              this.setState({ link: res.payment_url });
              this.setModalVisible(true);
            } else {
              //console.log(res.message);
            }
          });
      } else {
        this.success();
      }
    }
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleBackButtonClick() {
    // console.log("CARTTODETAILS", this.state.details)
    if (this.state.details != "") {
      if (this.state.from != "TableBooking") {
        this.props.navigation.navigate("Menu", {
          details: this.state.details,
          currency: this.state.currency,
          from: "cart",
        });
        // this.props.navigation.dispatch(
        //   StackActions.reset({
        //     index: 0,
        //     actions: [
        //       NavigationActions.navigate({
        //         routeName: "Menu",
        //         params: {
        //           details: this.state.details,
        //           currency: this.state.currency,
        //           from: "cart",
        //         },
        //       }),
        //     ],
        //   })
        // );
      } else {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "TableBooking",
                params: {
                  details: this.state.details,
                  currency: this.state.currency,
                  from: "cart",
                },
              }),
            ],
          })
        );
      }
    } else {
      this.props.navigation.navigate("RestaurantList");
    }
    /*this.props.navigation.goBack(null);
      return true;*/
  }
  _onNavigationStateChange(webViewState) {
    this.hide();
  }
  show() {
    this.setState({ modalVisible: true });
  }

  hide() {
    this.setState({ modalVisible: false });
  }
  get_sub_cart = async (id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS cart(SUBID INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0, main_cart_id BIGINT NOT NULL" +
            ", FOREIGN KEY (main_cart_id) REFERENCES main_cart(ID) ON DELETE CASCADE ON UPDATE NO ACTION)",

          []
        );
        tx.executeSql(
          "SELECT * FROM cart where main_cart_id=" + id,
          [],
          function (txn, results) {
            //console.log('aaaa');
            resolve(results);
          }
        );
      });
    });
  };

  first_get_cart = async () => {
    await db.transaction((tx) => {
      var temp = [];
      var table_temp = [];
      var self = this;
      if (self.state.from != "TableBooking") {
        tx.executeSql(
          "SELECT * FROM main_cart",
          [],
          async function (txn, results) {
            var foodcst = 0;
            if (
              results.rows.length > 0 &&
              self.state.user_id != results.rows.item(0).user_id
            ) {
              tx.executeSql("Delete FROM main_cart", [], (tx, results) => {
                //console.log("Results", results.rowsAffected);
              });
              //self.setState({ showIndicator: false });
              return false;
            }
            var cart_length = results.rows.length;

            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
              let sub_results = await self.get_sub_cart(
                results.rows.item(i).ID
              );
              foodcst = foodcst + results.rows.item(i).menu_total;
              for (let j = 0; j < sub_results.rows.length; j++) {
                temp.push(sub_results.rows.item(j));
                foodcst = foodcst + sub_results.rows.item(j).menu_total;
              }

              location_name = results.rows.item(i).location_name;
              location_id = results.rows.item(i).location_id;
              location_description = results.rows.item(i).location_description;
              //console.log("loc description=> ", location_name);
              option_value_name = results.rows.item(i).option_value_name;
            }
            //console.log("FOOD", foodcst);
            //console.log("FROM", self.state.from);
            //console.log("DETAILS", self.state.details);
            //console.log("SWITCH", self.state.switchValue);
            //console.log("DEL", self.state.offer_delivery);
            //console.log("DELCH", self.state.tax_delivery_charge);
            //console.log("SWITCH", self.state.switchValue);

            if (self.state.from != "TableBooking") {
              if (self.state.details === "") {
                if (self.state.switchValue == 1) {
                  if (self.state.offer_delivery == 1) {
                    if (self.state.tax_delivery_charge == "YES") {
                      var fooddel =
                        parseFloat(foodcst) +
                        parseFloat(self.state.delivery_fee);
                      var tot_cst =
                        parseFloat(fooddel) +
                        fooddel * (results.rows.item(0).all_tax / 100);
                      var tax =
                        fooddel * (results.rows.item(0).all_tax / 100) * 10;
                    } else {
                      var tot_cst =
                        parseFloat(self.state.delivery_fee) +
                        parseFloat(foodcst) +
                        foodcst * (results.rows.item(0).all_tax / 100);
                      var tax =
                        foodcst * (results.rows.item(0).all_tax / 100) * 10;
                    }
                  }
                  // else {
                  //     var tot_cst = (parseFloat(foodcst) + (foodcst * (results.rows.item(0).all_tax / 100)));
                  //     var tax =(foodcst * (results.rows.item(0).all_tax / 100))*10;
                  // }
                } else {
                  var tot_cst =
                    parseFloat(foodcst) +
                    foodcst * (results.rows.item(0).all_tax / 100);
                  var tax = foodcst * (results.rows.item(0).all_tax / 100) * 10;
                }
              } else {
                self.setState({
                  apply_disabled: "",
                  added_amount: 0,
                  discount_amount: 0,
                });
                if (self.state.switchValue == 1) {
                  if (self.state.offer_delivery == 1) {
                    if (self.state.tax_delivery_charge == "YES") {
                      var fooddel =
                        parseFloat(foodcst) +
                        parseFloat(self.state.delivery_fee);
                      //console.log("FOODEL", fooddel);

                      var tot_cst =
                        parseFloat(fooddel) +
                        fooddel * (results.rows.item(0).all_tax / 100);
                      //console.log("TOTCOST", tot_cst);

                      var tax =
                        fooddel * (results.rows.item(0).all_tax / 100) * 10;
                      //console.log("TAX", tax);
                    } else {
                      var tot_cst =
                        parseFloat(self.state.delivery_fee) +
                        parseFloat(foodcst) +
                        foodcst * (results.rows.item(0).all_tax / 100);
                      //console.log("TOTCOST", tot_cst);
                      //console.log("FOOD", foodcst);
                      //console.log("ALL_TAX", results.rows.item(0).all_tax);

                      var tax =
                        foodcst * (results.rows.item(0).all_tax / 100) * 10;
                      //console.log("TAX", tax);
                    }
                  }
                  // else {
                  //     var tot_cst = (parseFloat(foodcst) + (foodcst * (results.rows.item(0).all_tax / 100)));
                  //     var tax =(foodcst * (results.rows.item(0).all_tax / 100))*10;
                  // }
                } else {
                  var tot_cst =
                    parseFloat(foodcst) +
                    foodcst * (results.rows.item(0).all_tax / 100);
                  var tax = foodcst * (results.rows.item(0).all_tax / 100) * 10;
                }
              }
            } else {
              var tot_cst =
                parseFloat(foodcst) +
                foodcst * (results.rows.item(0).all_tax / 100) +
                self.state.table_price;
              var tax = foodcst * (results.rows.item(0).all_tax / 100) * 10;
            }
            // console.log(
            //   (foodcst * (results.rows.item(0).all_tax / 100)).toFixed(2)
            // );
            self.setState({
              dataSource: temp,
              total_items: results.rows.length,
              location_name: location_name,
              location_id: location_id,
              food_cost: foodcst.toFixed(2),
              total_cost: tot_cst.toFixed(2),
              added_amount:
                self.state.tax_delivery_charge == "YES" ? tax.toFixed(2) : 0,
              //prev_total_cost:(foodcst + (foodcst * (results.rows.item(0).all_tax / 100))).toFixed(2),
              //tax_amount_cal:results.rows.item(0).all_tax / 100,
              location_description: location_description,
              tax_percent: results.rows.item(0).all_tax,
              taxes: results.rows.item(0).taxes,
              cart_length: cart_length,
              option_value_name: option_value_name,
            });
            //console.log("temp", self.state.dataSource);
            //console.log("LENGTH!!", cart_length);
            //console.log("Results", results);
          }
        );
      } else {
        tx.executeSql(
          "SELECT * FROM tablevalues",
          [],
          function (txn, resultss) {
            if (
              resultss.rows.length > 0 &&
              self.state.user_id != resultss.rows.item(0).user_id &&
              self.state.location_id != resultss.rows.item(0).location_id
            ) {
              tx.executeSql(
                "Delete FROM tablevalues",
                [],
                (tx, resultss) => {}
              );
              //self.setState({ showIndicator: false });
              return false;
            }

            for (let i = 0; i < resultss.rows.length; i++) {
              table_temp.push(resultss.rows.item(i));
              location_id = resultss.rows.item(i).location_id;
              date = resultss.rows.item(i).date;
              guest_count = resultss.rows.item(i).guest_count;
              table_price = resultss.rows.item(i).table_price;
            }
            tx.executeSql(
              "SELECT * FROM main_cart",
              [],
              async function (txn, results) {
                var foodcst = 0;
                if (
                  results.rows.length > 0 &&
                  self.state.user_id != results.rows.item(0).user_id &&
                  self.state.location_id != results.rows.item(0).location_id
                ) {
                  tx.executeSql(
                    "Delete FROM main_cart",
                    [],
                    (tx, results) => {}
                  );
                  //self.setState({ showIndicator: false });
                  return false;
                }
                var cart_length = results.rows.length;
                if (results.rows.length != 0) {
                  for (let i = 0; i < results.rows.length; i++) {
                    temp.push(results.rows.item(i));
                    foodcst = foodcst + results.rows.item(i).menu_total;
                    location_name = results.rows.item(i).location_name;
                    location_id = results.rows.item(i).location_id;
                    location_description =
                      results.rows.item(i).location_description;
                  }
                  if (resultss.rows.length > 0) {
                    if (self.state.coupon_code != "") {
                      var tablefood =
                        parseFloat(foodcst) +
                        parseFloat(table_price) -
                        parseFloat(self.state.discount_amount);
                      var tax =
                        tablefood * (results.rows.item(0).all_tax / 100) * 10;
                      var tot_cst =
                        parseFloat(tablefood) +
                        parseFloat(
                          tablefood * (results.rows.item(0).all_tax / 100)
                        );
                    } else {
                      var tablefood =
                        parseFloat(foodcst) + parseFloat(table_price);
                      var tax =
                        tablefood * (results.rows.item(0).all_tax / 100) * 10;
                      var tot_cst =
                        parseFloat(tablefood) +
                        parseFloat(
                          tablefood * (results.rows.item(0).all_tax / 100)
                        );
                    }
                  } else {
                    var tax =
                      foodcst * (results.rows.item(0).all_tax / 100) * 10;
                    var tot_cst =
                      parseFloat(foodcst) +
                      parseFloat(
                        tablefood * (results.rows.item(0).all_tax / 100)
                      );
                  }
                  self.setState({
                    dataSource: temp,
                    total_items: results.rows.length,
                    location_name: location_name,
                    location_id: location_id,
                    food_cost: foodcst.toFixed(2),
                    total_cost: tot_cst.toFixed(2),
                    added_amount: tax.toFixed(2),
                    guest_count: guest_count,
                    table_price: table_price.toFixed(2),
                    //prev_total_cost:(foodcst + (foodcst * (results.rows.item(0).all_tax / 100))).toFixed(2),
                    //tax_amount_cal:results.rows.item(0).all_tax / 100,
                    location_description: location_description,
                    tax_percent: results.rows.item(0).all_tax,
                    taxes: results.rows.item(0).taxes,
                    cart_length: cart_length,
                    table_length: resultss.rows.length,
                  });
                } else {
                  var tot_cst =
                    parseFloat(table_price) +
                    parseFloat(
                      table_price * (resultss.rows.item(0).all_tax / 100)
                    );
                  await self.setState({
                    dataSource: table_temp,
                    total_items: resultss.rows.length,
                    guest_count: guest_count,
                    location_id: location_id,
                    table_price: table_price.toFixed(2),
                    total_cost: tot_cst.toFixed(2),
                    added_amount: table_price.toFixed(2),
                    cart_length: cart_length,
                    table_length: resultss.rows.length,
                  });
                }
              }
            );
          }
        );
      }
    });
  };

  get_cart = async () => {
    await db.transaction((tx) => {
      var temp = [];
      var table_temp = [];
      var self = this;
      if (self.state.from != "TableBooking") {
        tx.executeSql(
          "SELECT * FROM main_cart",
          [],
          async function (txn, results) {
            var foodcst = 0;
            if (
              results.rows.length > 0 &&
              self.state.user_id != results.rows.item(0).user_id
            ) {
              tx.executeSql("Delete FROM main_cart", [], (tx, results) => {
                //console.log("Results", results.rowsAffected);
              });
              //self.setState({ showIndicator: false });
              return false;
            }
            var cart_length = results.rows.length;

            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
              let sub_results = await self.get_sub_cart(
                results.rows.item(i).ID
              );
              foodcst = foodcst + results.rows.item(i).menu_total;
              for (let j = 0; j < sub_results.rows.length; j++) {
                temp.push(sub_results.rows.item(j));
                foodcst = foodcst + sub_results.rows.item(j).menu_total;
              }

              location_name = results.rows.item(i).location_name;
              location_id = results.rows.item(i).location_id;
              location_description = results.rows.item(i).location_description;
              option_value_name = results.rows.item(i).option_value_name;
            }
            //console.log("FOOD", foodcst);
            //console.log("FROM", self.state.from);
            //console.log("DETAILS", self.state.details);
            //console.log("SWITCH", self.state.switchValue);
            //console.log("DEL", self.state.offer_delivery);
            //console.log("DELCH", self.state.tax_delivery_charge);
            //console.log("SWITCH", self.state.switchValue);

            if (self.state.from != "TableBooking") {
              if (self.state.details === "") {
                if (self.state.switchValue == 1) {
                  if (self.state.offer_delivery == 1) {
                    if (self.state.tax_delivery_charge == "YES") {
                      var fooddel =
                        parseFloat(foodcst) +
                        parseFloat(self.state.delivery_fee);
                      var tot_cst =
                        parseFloat(fooddel) +
                        fooddel * (results.rows.item(0).all_tax / 100);
                      var tax =
                        fooddel * (results.rows.item(0).all_tax / 100) * 10;
                    } else {
                      var tot_cst =
                        parseFloat(self.state.delivery_fee) +
                        parseFloat(foodcst) +
                        foodcst * (results.rows.item(0).all_tax / 100);
                      var tax =
                        foodcst * (results.rows.item(0).all_tax / 100) * 10;
                    }
                  }
                  // else {
                  //     var tot_cst = (parseFloat(foodcst) + (foodcst * (results.rows.item(0).all_tax / 100)));
                  //     var tax =(foodcst * (results.rows.item(0).all_tax / 100))*10;
                  // }
                } else {
                  var tot_cst =
                    parseFloat(foodcst) +
                    foodcst * (results.rows.item(0).all_tax / 100);
                  var tax = foodcst * (results.rows.item(0).all_tax / 100) * 10;
                }
              } else {
                self.setState({
                  apply_disabled: "",
                  added_amount: 0,
                  discount_amount: 0,
                });
                if (self.state.switchValue == 1) {
                  if (self.state.offer_delivery == 1) {
                    if (self.state.tax_delivery_charge == "YES") {
                      var fooddel =
                        parseFloat(foodcst) +
                        parseFloat(self.state.delivery_fee);
                      //console.log("FOODEL", fooddel);

                      var tot_cst =
                        parseFloat(fooddel) +
                        fooddel * (results.rows.item(0).all_tax / 100);
                      //console.log("TOTCOST", tot_cst);

                      var tax =
                        fooddel * (results.rows.item(0).all_tax / 100) * 10;
                      //console.log("TAX", tax);
                    } else {
                      var tot_cst =
                        parseFloat(self.state.delivery_fee) +
                        parseFloat(foodcst) +
                        foodcst * (results.rows.item(0).all_tax / 100);
                      //console.log("TOTCOST", tot_cst);
                      //console.log("FOOD", foodcst);
                      //console.log("ALL_TAX", results.rows.item(0).all_tax);

                      var tax =
                        foodcst * (results.rows.item(0).all_tax / 100) * 10;
                      //console.log("TAX", tax);
                    }
                  }
                  // else {
                  //     var tot_cst = (parseFloat(foodcst) + (foodcst * (results.rows.item(0).all_tax / 100)));
                  //     var tax =(foodcst * (results.rows.item(0).all_tax / 100))*10;
                  // }
                } else {
                  var tot_cst =
                    parseFloat(foodcst) +
                    foodcst * (results.rows.item(0).all_tax / 100);
                  var tax = foodcst * (results.rows.item(0).all_tax / 100) * 10;
                }
              }
            } else {
              var tot_cst =
                parseFloat(foodcst) +
                foodcst * (results.rows.item(0).all_tax / 100) +
                self.state.table_price;
              var tax = foodcst * (results.rows.item(0).all_tax / 100) * 10;
            }
            // console.log(
            //   (foodcst * (results.rows.item(0).all_tax / 100)).toFixed(2)
            // );
            self.setState({
              dataSource: temp,
              total_items: results.rows.length,
              location_name: location_name,
              location_id: location_id,
              food_cost: foodcst.toFixed(2),
              total_cost: tot_cst.toFixed(2),
              added_amount:
                self.state.tax_delivery_charge == "YES" ? tax.toFixed(2) : 0,
              //prev_total_cost:(foodcst + (foodcst * (results.rows.item(0).all_tax / 100))).toFixed(2),
              //tax_amount_cal:results.rows.item(0).all_tax / 100,
              location_description: location_description,
              tax_percent: results.rows.item(0).all_tax,
              taxes: results.rows.item(0).taxes,
              cart_length: cart_length,
              option_value_name: option_value_name,
            });
            //console.log("temp", self.state.dataSource);
            //console.log("LENGTH!!", cart_length);
            //console.log("Results", results);
          }
        );
      } else {
        tx.executeSql(
          "SELECT * FROM tablevalues",
          [],
          function (txn, resultss) {
            if (
              resultss.rows.length > 0 &&
              self.state.user_id != resultss.rows.item(0).user_id &&
              self.state.location_id != resultss.rows.item(0).location_id
            ) {
              tx.executeSql("Delete FROM tablevalues", [], (tx, resultss) => {
                //console.log("Resultss", resultss.rowsAffected);
              });
              //self.setState({ showIndicator: false });
              return false;
            }

            for (let i = 0; i < resultss.rows.length; i++) {
              table_temp.push(resultss.rows.item(i));
              location_id = resultss.rows.item(i).location_id;
              date = resultss.rows.item(i).date;
              guest_count = resultss.rows.item(i).guest_count;
              table_price = resultss.rows.item(i).table_price;
            }
            tx.executeSql(
              "SELECT * FROM main_cart",
              [],
              async function (txn, results) {
                var foodcst = 0;
                if (
                  results.rows.length > 0 &&
                  self.state.user_id != results.rows.item(0).user_id &&
                  self.state.location_id != results.rows.item(0).location_id
                ) {
                  tx.executeSql("Delete FROM main_cart", [], (tx, results) => {
                    //console.log("Results", results.rowsAffected);
                  });
                  //self.setState({ showIndicator: false });
                  return false;
                }
                var cart_length = results.rows.length;
                if (results.rows.length != 0) {
                  for (let i = 0; i < results.rows.length; i++) {
                    temp.push(results.rows.item(i));
                    foodcst = foodcst + results.rows.item(i).menu_total;
                    location_name = results.rows.item(i).location_name;
                    location_id = results.rows.item(i).location_id;
                    location_description =
                      results.rows.item(i).location_description;
                  }
                  if (resultss.rows.length > 0) {
                    if (self.state.coupon_code != "") {
                      var tablefood =
                        parseFloat(foodcst) +
                        parseFloat(table_price) -
                        parseFloat(self.state.discount_amount);
                      var tax =
                        tablefood * (results.rows.item(0).all_tax / 100) * 10;
                      var tot_cst =
                        parseFloat(tablefood) +
                        parseFloat(
                          tablefood * (results.rows.item(0).all_tax / 100)
                        );
                    } else {
                      var tablefood =
                        parseFloat(foodcst) + parseFloat(table_price);
                      var tax =
                        tablefood * (results.rows.item(0).all_tax / 100) * 10;
                      var tot_cst =
                        parseFloat(tablefood) +
                        parseFloat(
                          tablefood * (results.rows.item(0).all_tax / 100)
                        );
                    }
                  } else {
                    var tax =
                      foodcst * (results.rows.item(0).all_tax / 100) * 10;
                    var tot_cst =
                      parseFloat(foodcst) +
                      parseFloat(
                        tablefood * (results.rows.item(0).all_tax / 100)
                      );
                  }
                  self.setState({
                    dataSource: temp,
                    total_items: results.rows.length,
                    location_name: location_name,
                    location_id: location_id,
                    food_cost: foodcst.toFixed(2),
                    total_cost: tot_cst.toFixed(2),
                    added_amount: tax.toFixed(2),
                    guest_count: guest_count,
                    table_price: table_price.toFixed(2),
                    //prev_total_cost:(foodcst + (foodcst * (results.rows.item(0).all_tax / 100))).toFixed(2),
                    //tax_amount_cal:results.rows.item(0).all_tax / 100,
                    location_description: location_description,
                    tax_percent: results.rows.item(0).all_tax,
                    taxes: results.rows.item(0).taxes,
                    cart_length: cart_length,
                    table_length: resultss.rows.length,
                  });
                } else {
                  var tot_cst =
                    parseFloat(table_price) +
                    parseFloat(
                      table_price * (resultss.rows.item(0).all_tax / 100)
                    );
                  await self.setState({
                    dataSource: table_temp,
                    total_items: resultss.rows.length,
                    guest_count: guest_count,
                    location_id: location_id,
                    table_price: table_price.toFixed(2),
                    total_cost: tot_cst.toFixed(2),
                    added_amount: table_price.toFixed(2),
                    cart_length: cart_length,
                    table_length: resultss.rows.length,
                  });
                }
              }
            );
          }
        );
      }
    });
  };
  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, token: "" });
      stripe.setOptions({
        publishableKey: "pk_test_Cb0tOY2vj2Hhf1vqDN5LwT9D00orG79MjU",
        merchantId: "<MERCHANT_ID>",
        androidPayMode: "test",
      });

      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: "full",
        prefilledInformation: {
          billingAddress: {
            name: this.state.name,
            line1: "Canary Place",
            line2: "3",
            city: "Macon",
            state: "Georgia",
            country: "US",
            postalCode: "31217",
            email: this.state.email,
          },
        },
      });
      if (token != "") {
        await this.payAmount(token.tokenId);
      }
    } catch (error) {
      this.setState({ loading: false });
      this.showSnackbar(strings.payment_failed);

      //console.log(this.state);
    }
  };

  async payAmount(token) {
    var amt_conver = this.state.total_cost * 100;
    var add_details = {
      amount: parseInt(amt_conver),
      currency: "usd",
      source: token,
      description: "Charge for " + this.state.name,
    };

    var formBody = [];
    for (var property in add_details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(add_details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    await fetch("https://api.stripe.com/v1/charges", {
      method: "post",
      headers: {
        Authorization: "Bearer sk_test_Kro2Z0yLKqCCeFswzzRJJrLK00xqzyqstN",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then(async (res) => {
        //return res;
        if (res.status == "succeeded") {
          await this.setState({
            loading: false,
            token: token,
            strip_resp: JSON.stringify(res),
          });
        } else {
          this.setState({ loading: false });
          this.showSnackbar(res.error.message);
          console.log(res.error.message);
        }
      })
      .catch((error) => {
        this.showSnackbar(error);
      });
  }

  address_list = () => {
    this.props.navigation.navigate("ManageAddress", {
      customer_id: this.state.user_id,
      details: this.state.details,
    });
  };
  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const name = await AsyncStorage.getItem("name");
      const phone = await AsyncStorage.getItem("phone");
      const email = await AsyncStorage.getItem("email");
      await AsyncStorage.getItem("delivery_fee").then((value) => {
        this.setState({ delivery_fee: value });
      });
      await AsyncStorage.getItem("offer_delivery").then((value) => {
        this.setState({ offer_delivery: value });
      });
      await AsyncStorage.getItem("offer_collection").then((value) => {
        this.setState({ offer_collection: value });
      });
      await AsyncStorage.getItem("from").then((value) => {
        this.setState({ from: value });
      });
      await AsyncStorage.getItem("tax_delivery_charge").then((value) => {
        this.setState({ tax_delivery_charge: value });
      });

      await AsyncStorage.getItem("details").then((value) => {
        this.setState({ details: JSON.parse(value) });
      });
      if (this.state.from != "TableBooking") {
        if (
          this.state.offer_collection == 1 &&
          this.state.offer_delivery == 0
        ) {
          await this.setState({ switchValue: 2 });
          // await this.get_cart();
          // await this.toggleSwitch();
        } else if (
          this.state.offer_collection == 0 &&
          this.state.offer_delivery == 0
        ) {
          await this.setState({ switchValue: 1, offer_delivery: 1 });
          // await this.get_cart();
        } else {
          await this.setState({ switchValue: 1 });
        }
      }

      if (user_id !== null) {
        await this.setState({ user_id: user_id });
        await this.setState({ name: name });
        await this.setState({ phone: phone });
        await this.setState({ email: email });
        // if(this.state.def_add_id == 0)
        // {
        //   await this.setState({def_add_id:default_address_id});
        // }
        //   fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lng + '&key=' + GOOGLE_KEY)
        //   .then((response) => response.json())
        //   .then((responseJson) => {
        //       console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
        // })
      }
    } catch (error) {}
  };

  default_address = async () => {
    fetch(
      BASE_URL +
        "user/getdefaultAddress?customer_id=" +
        this.state.user_id +
        "&address_id=" +
        this.state.default_id,
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
          //this.showSnackbar(res.message.error);
          this.setState({ showIndicator: false });
        } else {
          await this.setState({ address: res.result });
          await this.delivery_func();
          await this.setState({ def_add_id: res.result.address_id });
          //}
          //this.setState({ showIndicator: false });
          //this.props.navigation.navigate('Login');
          //this.resetMenu();
        }
      })
      .catch((error) => {
        this.showSnackbar(strings.cart_something_went_wrong);
        this.setState({ showIndicator: false });
      });
  };

  calculateDeliveryCost = async () => {
    Geocoder.from(this.state.address.address_1)
      .then(async (json) => {
        try {
          var customer_location = await json.results[0].geometry.location;
          const address_2 =
            this.state.details.location_address_1 +
            ", " +
            this.state.details.location_city +
            ", " +
            this.state.details.location_country;
          const myresponse = await Geocoder.from(address_2);
          const restaurant_location = await myresponse.results[0].geometry
            .location;
          const distance = await getDistance(
            restaurant_location,
            customer_location
          );
          const distance_km = (await distance) / 1000;

          let del_fee = (await distance_km) * 3 + 15;
          if (del_fee <= 20) del_fee = 20;
          else if (del_fee > 20 && del_fee <= 50) del_fee = 30;
          else if (del_fee > 50 && del_fee <= 65) del_fee = 50;
          else if (del_fee > 65 && del_fee <= 100) del_fee = 75;
          else if (del_fee > 100 && del_fee <= 120) del_fee = 100;
          else if (del_fee > 120) del_fee = 120;
          this.setState({ delivery_fee: del_fee });
          await this.calculateTotalCharge(del_fee);
        } catch (err) {
          "error2=> ", err;
        }
      })
      .catch((error) => console.log("error=> ", error));
  };
  success = async () => {
    this.setState({ showIndicator: true });

    if (this.state.payment == "stripe") {
      await this.handleCardPayPress();
      await testID("cardFormButton");
    } else {
      this.setState({ token: "" });
    }

    if (
      this.state.token ||
      this.state.payment == "cash" ||
      this.state.payment == "paypal_express" ||
      this.state.payment == "paytoday"
    ) {
      this.setState({ token: "" });

      var menudetails = [];
      this.state.dataSource.map((menu_val, menu_key) => {
        menudetail = {
          menu_id: menu_val.menu_id,
          qty: menu_val.qty,
          menu_price: menu_val.price,
          comment: "",
          option_id: menu_val.option_id,
          option_value_id: menu_val.option_value_id,
          /*'options'     : [{
                            'menu_option_id' : menu_val.option_id,
                          }]*/
        };
        menudetails.push(menudetail);
      });
      menudetails = { menu_details: menudetails };

      var taxdetails = [];
      var data = JSON.parse(this.state.dataSource[0].taxes);

      data.map((tax_val, key) => {
        var taxtotal =
          this.state.added_amount != 0
            ? this.state.added_amount * (tax_val.tax_value / 100)
            : this.state.food_cost * (tax_val.tax_value / 100);
        taxdetail = {
          tax_name: [],
          percentage: [],
          tax_amount: 0,
        };
        taxdetails.push(taxdetail);
      });
      taxdetails = { tax_details: taxdetails };

      var details = {
        user_id: this.state.user_id,
        location_id: this.state.location_id,
        payment: this.state.payment,
        food_tax: this.state.tax_percent ? this.state.tax_percent : 0,
        food_cart_total: this.state.food_cost ? this.state.food_cost : 0.0,
        food_order_total: this.state.total_cost ? this.state.total_cost  :0.0,
        total_items: this.state.total_items ? this.state.total_items : 0,
        language: "english",
        comment: this.state.comment_msg ? this.state.comment_msg : '',
        address_id: this.state.def_add_id,
        menu_details: JSON.stringify(menudetails),
        tax_details: JSON.stringify(taxdetails),
        delivery_fee: this.state.delivery_fee ? this.state.delivery_fee: 0,
        stripe_response: this.state.strip_resp ? this.state.strip_resp : '',
        stripe_token: this.state.token ? this.state.token : '',
        coupon_id: this.state.coupon_id ? this.state.coupon_id : 0,
        coupon_code: this.state.coupon_code ? this.state.coupon_code : '',
        coupon_discount: this.state.discount_amount ? this.state.discount_amount: 0,
        order_type: this.state.switchValue,
        paypal_token: this.state.trans_id ? this.state.trans_id : '',
        booking_type: "order",
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      
      fetch(BASE_URL + "restaurantsList/reserveTable", {
        method: "post",
        async: true,
        crossDomain: true,
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA==",
          "X-API-KEY": "RfTjWnZr4u7x!A-D",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      })
        .then((response) => response.json())
        .then(async (res) => {
          if (res.message != "Success") {
            //this.showSnackbar(res.message);
            this.setState({ showIndicator: false });
          } else {
            await db.transaction(async (tx) => {
              await tx.executeSql(
                "Delete FROM main_cart",
                [],
                (tx, results) => {
                  //console.log("Results", results.rowsAffected);
                }
              );
            });
            fb.ref("/paypal_payment/" + this.state.user_id).set({
              success_status: 0,
              trans_id: 0,
            });
            fb.ref(
              "/customer_pendings/" + this.state.user_id + "/" + res.order_id
            ).set({
              status: "Pending",
              status_id: 1,
              price: this.state.currency + "" + this.state.total_cost,
              delivery_partner: "",
              reservation_id: res.reservation_id,
              location_name: this.state.location_name,
              //location_image:this.state.details.profile_image,
              location_id: this.state.location_id,
              date: res.order_date,
              time: res.order_time,
              order_id: res.order_id,
              address: this.state.address.address_1,
            });
            this.props.navigation.navigate("Success", { from: "Cart" });
            this.loadingButton.showLoading(false);
            //
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.setState({ showIndicator: false });
    } else {
      this.setState({ showIndicator: false });
      this.setState({ loading: false });
      this.showSnackbar(strings.payment_failed);
      this.loadingButton.showLoading(false);
    }
  };

  removecart = (ID, menu_id, option_id, option_value_id) => {
    var self = this;

    db.transaction((tx) => {
      tx.executeSql("Delete FROM main_cart where ID=?", [ID], (tx, results) => {
        if (self.state.total_items == 1) {
          self.setState({ total_items: 0 });
          if (this.state.details != "") {
            self.props.navigation.navigate("Menu", {
              details: this.state.details,
              cart_qty: 0,
              food_cost: 0,
              from: "cart",
            });
            /*  self.props
            .navigation
            .dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Menu',
                  params: { details: self.state.details },
                }),
              ],
            }))*/
          }
        } else {
          var tott_item = self.state.total_items - 1;
          self.setState({ total_items: tott_item });
          this.get_cart();
        }
        //console.log("Results", results.rowsAffected);
      });
    });
  };
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  handleChange(qty, ID, menu_id, menu_price, option_id, option_value_id) {
    if (qty == 0) {
      this.removecart(ID, menu_id, option_id, option_value_id);
    } else {
      this.addcart(qty, ID, menu_id, menu_price);
    }
  }
  maximumreached = (qty) => {
    this.showSnackbar(strings.only + strings.quantity_available);
  };
  addvalue = async (price, ID, key) => {
    var val;
    if (this.state.apply_disabled == false) {
      if (this.state.from != "TableBooking") {
        var foocst = await (
          parseFloat(this.state.food_cost) + parseFloat(price)
        ).toFixed(2);
        val = parseInt(foocst).toFixed(2);
        var tot_cst = await parseFloat(
          parseFloat(foocst) +
            parseFloat(foocst) * (this.state.tax_percent / 100)
        ).toFixed(2);
      } else {
        var foocst = await (
          parseFloat(this.state.food_cost) + parseFloat(price)
        ).toFixed(2);
        val = (parseInt(foocst) + parseFloat(this.state.table_price)).toFixed(
          2
        );
        var tot_cst = await parseFloat(
          parseFloat(val) + parseFloat(val) * (this.state.tax_percent / 100)
        ).toFixed(2);
      }
    } else {
      if (this.state.from != "TableBooking") {
        var foocst = await (
          parseFloat(this.state.food_cost) + parseFloat(price)
        ).toFixed(2);
        val = await parseInt(
          parseInt(foocst) - parseInt(this.state.discount_amount)
        );
        val = val.toFixed(2);
        var tot_cst = await parseFloat(
          parseFloat(val) + parseFloat(val) * (this.state.tax_percent / 100)
        ).toFixed(2);
      } else {
        var foocst = await (
          parseFloat(this.state.food_cost) + parseFloat(price)
        ).toFixed(2);
        val = await parseInt(
          parseInt(foocst) - parseInt(this.state.discount_amount)
        );
        val = val.toFixed(2);
        var tot_cst = await parseFloat(
          parseFloat(val) +
            parseFloat(val) * (this.state.tax_percent / 100) +
            parseFloat(this.state.table_price)
        ).toFixed(2);
      }
    }
    this.state.dataSource[key].qty = this.state.dataSource[key].qty + 1;
    this.state.dataSource[key].menu_total =
      this.state.dataSource[key].qty * this.state.dataSource[key].price;
    for (let i = 0; i < this.state.dataSource.length; i++) {
      if (
        this.state.dataSource[i].hasOwnProperty("main_cart_id") &&
        this.state.dataSource[i].main_cart_id == ID
      ) {
        this.state.dataSource[i].qty =
          this.state.dataSource[i].qty +
          this.state.dataSource[i].qty / (this.state.dataSource[key].qty - 1);
        this.state.dataSource[i].menu_total =
          this.state.dataSource[i].qty * this.state.dataSource[i].price;
      }
    }
    await this.setState({
      food_cost: foocst,
      added_amount: val,
      total_cost: tot_cst,
    });
    //optionspage(val.menu_items[menu_key])

    if (this.state.switchValue == 1 && this.state.from != "TableBooking") {
      if (
        (this.state.offer_delivery == 1 && this.state.offer_collection == 0) ||
        (this.state.offer_delivery == 1 && this.state.offer_collection == 1)
      ) {
        //console.log("calla");
        await this.delivery_func();
      }
    }
  };
  decrementvalue = async (price, key) => {
    var val;
    // if(this.state.apply_disabled==false){
    //   var foocst = await (parseFloat(this.state.food_cost) - parseFloat(price)).toFixed(2);
    //   val=parseInt(foocst).toFixed(2);
    //   var tot_cst = await (parseFloat(parseFloat(foocst) + (parseFloat(foocst) * (this.state.tax_percent / 100)))).toFixed(2);
    // }
    // else{
    //   var foocst = await (parseFloat(this.state.food_cost) - parseFloat(price)).toFixed(2);
    //   val= await(parseInt(parseInt(foocst)-parseInt(this.state.discount_amount)))
    //  // alert(parseInt(foocst)-parseFloat(this.state.discount_amount))
    //   val=val.toFixed(2);
    //   var tot_cst = await (parseFloat(parseFloat(val) + (parseFloat(val) * (this.state.tax_percent / 100)))).toFixed(2);
    // }
    if (this.state.apply_disabled == false) {
      if (this.state.from != "TableBooking") {
        var foocst = await (
          parseFloat(this.state.food_cost) - parseFloat(price)
        ).toFixed(2);
        val = parseInt(foocst).toFixed(2);
        var tot_cst = await parseFloat(
          parseFloat(foocst) +
            parseFloat(foocst) * (this.state.tax_percent / 100)
        ).toFixed(2);
      } else {
        var foocst = await (
          parseFloat(this.state.food_cost) - parseFloat(price)
        ).toFixed(2);
        val = (parseInt(foocst) + parseFloat(this.state.table_price)).toFixed(
          2
        );
        var tot_cst = await parseFloat(
          parseFloat(val) + parseFloat(val) * (this.state.tax_percent / 100)
        ).toFixed(2);
      }
    } else {
      if (this.state.from != "TableBooking") {
        var foocst = await (
          parseFloat(this.state.food_cost) - parseFloat(price)
        ).toFixed(2);
        val = await parseInt(
          parseInt(foocst) - parseInt(this.state.discount_amount)
        );
        val = val.toFixed(2);
        var tot_cst = await parseFloat(
          parseFloat(val) + parseFloat(val) * (this.state.tax_percent / 100)
        ).toFixed(2);
      } else {
        var foocst = await (
          parseFloat(this.state.food_cost) - parseFloat(price)
        ).toFixed(2);
        val = await parseInt(
          parseInt(foocst) - parseInt(this.state.discount_amount)
        );
        val = val.toFixed(2);
        var tot_cst = await parseFloat(
          parseFloat(val) +
            parseFloat(val) * (this.state.tax_percent / 100) +
            parseFloat(this.state.table_price)
        ).toFixed(2);
      }
    }
    if (this.state.dataSource[key].qty - 1 == 0) {
      await this.setState({
        apply_disabled: "",
        added_amount: 0,
        discount_amount: 0,
        coupon_code: "",
      });
      if (this.state.table_length > 0) {
        await this.setState({
          total_items: this.state.table_length,
        });
        await this.get_cart();
      }
      this.state.dataSource[key].qty =
        (await this.state.dataSource[key].qty) - 1;
    } else {
      this.state.dataSource[key].qty =
        (await this.state.dataSource[key].qty) - 1;
      let ID = this.state.dataSource[key].ID;
      this.state.dataSource[key].menu_total =
        this.state.dataSource[key].qty * this.state.dataSource[key].price;
      for (let i = 0; i < this.state.dataSource.length; i++) {
        if (
          this.state.dataSource[i].hasOwnProperty("main_cart_id") &&
          this.state.dataSource[i].main_cart_id == ID &&
          this.state.dataSource[key].qty > 0
        ) {
          this.state.dataSource[i].qty =
            this.state.dataSource[i].qty -
            this.state.dataSource[i].qty / (this.state.dataSource[key].qty + 1);
          this.state.dataSource[i].menu_total =
            this.state.dataSource[i].qty * this.state.dataSource[i].price;
        }
      }
    }
    await this.setState({
      food_cost: foocst,
      added_amount: val,
      total_cost: tot_cst,
    });
    if (this.state.switchValue == 1 && this.state.from != "TableBooking") {
      if (
        (this.state.offer_delivery == 1 && this.state.offer_collection == 0) ||
        (this.state.offer_delivery == 1 && this.state.offer_collection == 1)
      ) {
        //console.log("callb");
        await this.delivery_func();
      }
    }
  };

  addcart = async (qty, ID, menu_id, price) => {
    await this.setState({ menu_total: qty * price });
    var self = this;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM main_cart",
        [],
        async function (txn, results) {
          if (
            results.rows.length > 0 &&
            (results.rows.item(0).location_id != self.state.location_id ||
              self.state.user_id != results.rows.item(0).user_id)
          ) {
            await tx.executeSql("Delete from main_cart");
            await this.setState({ food_cost: 0 });
          }
        }
      );
      //console.log('ID = ', ID);
      tx.executeSql(
        "SELECT * FROM main_cart where ID=?",
        [ID],
        function (txn, results) {
          if (results.rows.length > 0) {
            //alert(results.rows.item(0).menu_qty);
            //up_qty = results.rows.item(0).qty + 1;
            //self.setState({menu_total : up_qty * price});
            //self.setState({food_cost : up_qty * price});
            //txn.executeSql("select * from main_cart");
            let sub_carts = self.state.dataSource.filter(
              (subcart) => subcart.hasOwnProperty("ID") && subcart.ID == ID
            );
            for (let j = 0; j < sub_carts.length; j++) {
              tx.executeSql(
                "UPDATE main_cart set qty='" +
                  sub_carts[j].qty +
                  "',menu_total='" +
                  sub_carts[j].menu_total +
                  "' where ID='" +
                  ID +
                  "'"
              );
            }
          }
        }
      );

      tx.executeSql(
        "SELECT * FROM cart where main_cart_id=?",
        [ID],
        function (txn, results) {
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              let nID = results.rows.item(i).SUBID;
              let sub_carts = self.state.dataSource.filter(
                (subcart) =>
                  subcart.hasOwnProperty("SUBID") && subcart.SUBID == nID
              );
              for (let j = 0; j < sub_carts.length; j++) {
                tx.executeSql(
                  "UPDATE cart set qty='" +
                    sub_carts[j].qty +
                    "',menu_total='" +
                    sub_carts[j].menu_total +
                    "' where SUBID='" +
                    nID +
                    "'"
                );
              }
            }
            tx.executeSql;
          }
        }
      );
    });
  };

  //onclick_send_message = () => {

  //ToastAndroid.show(this.state.comment_msg, ToastAndroid.SHORT);

  //}

  get_menu_price = (main_cart_id) => {
    let main_cart = this.state.dataSource.filter((tmp) => {
      if (tmp.hasOwnProperty("ID") && tmp.ID == main_cart_id) {
        return true;
      }
      return false;
    });

    let sub_cart = this.state.dataSource.filter((tmp) => {
      if (
        !tmp.hasOwnProperty("ID") &&
        tmp.hasOwnProperty("main_cart_id") &&
        tmp.main_cart_id == main_cart_id
      ) {
        return true;
      }
      return false;
    });

    let price = 0;
    for (let i = 0; i < main_cart.length; i++) {
      price = price + main_cart[i].price;
    }

    for (let i = 0; i < sub_cart.length; i++) {
      if (main_cart[0].qty > 0) {
        price =
          price + sub_cart[i].price * (sub_cart[i].qty / main_cart[0].qty);
      }
    }
    return price;
  };

  get_sub_menus = (main_cart_id) => {
    let sub_cart = this.state.dataSource.filter((tmp) => {
      if (
        !tmp.hasOwnProperty("ID") &&
        tmp.hasOwnProperty("main_cart_id") &&
        tmp.main_cart_id == main_cart_id
      ) {
        return true;
      }
      return false;
    });
    return sub_cart;
  };
  render() {
    const { approvalUrl } = this.state;
    var amount = this.state.total_cost * 100;
    var cost = amount.toString();
    var orderId_num =
      this.state.location_name +
      "-" +
      this.state.user_id +
      "-" +
      moment().utcOffset("+02:00").format("YYYYMMDDhhmmss"); //guidGenerator();
    var orderId = orderId_num.toString();
    //var cburl = 'https://paytoday.com.na/transactions/txstatus/2790/'+ orderId + '.json';

    //async function load(url) {
    //   let obj = await (await fetch(url)).json();
    //   console.log(obj.status.toString())
    //    return obj.status.toString()
    //  }

    let taxes = <Text></Text>;
    let menus = this.state.dataSource.map((val, key) => {
      if (this.state.cart_length > 0 && val.hasOwnProperty("ID")) {
        return (
          <Row>
            <Content
              style={{ paddingBottom: 5, marginLeft: "3%", marginRight: "3%" }}
            >
              <Row
                style={{
                  elevation: 0,
                  shadowOffset: { height: 0, width: 0 },
                  shadowOpacity: 0,
                  shadowColor: colors.shadow,
                  borderColor: colors.divider,
                  // borderRadius: 6,
                  // borderWidth: 0.7,
                  marginBottom: 10,
                  backgroundColor: colors.theme_button_fg,
                }}
              >
                <Col style={{ width: "25%" }}>
                  <Thumbnail
                    style={{
                      width: "95%",
                      height: 80,
                      borderRadius: 5,
                    }}
                    square
                    source={{ uri: img_url + val.menu_image }}
                  ></Thumbnail>
                </Col>
                <Col
                  style={{
                    //width: "45%",
                    //height: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.name}>{val.menu_name}</Text>
                  {this.get_sub_menus(val.ID).map((sub_cart, key) => {
                    return (
                      <Text style={styles.subname}>
                        {sub_cart.qty} x {sub_cart.option_value_name}
                      </Text>
                    );
                  })}
                  <Text style={styles.price}>
                    {this.state.currency +
                      "" +
                      (this.get_menu_price(val.ID) * val.qty).toFixed(2)}
                  </Text>
                  {/* {val.option_value_name != null ? (
                    <Text style={styles.name}>{val.option_value_name}</Text>
                  ) : null} */}
                </Col>
                <Col style={{ width: "15%", paddingRight: 3 }}>
                  <Row
                  //style={{ justifyContent: "flex-end", alignItems: "space-between" }}
                  >
                    <Col
                      style={{
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <UIStepper
                        displayValue
                        height={15}
                        width={55}
                        value={val.qty}
                        initialValue={val.qty}
                        minimumValue={0}
                        maximumValue={val.stock_qty}
                        vertical={true}
                        fontSize={14}
                        borderColor={colors.tint_col}
                        textColor={colors.theme_fg}
                        overrideTintColor
                        tintColor={colors.tint_col}
                        borderRadius={5}
                        fontFamily={colors.font_family}
                        onValueChange={(text) =>
                          this.handleChange(
                            text,
                            val.ID,
                            val.menu_id,
                            val.price,
                            val.option_id,
                            val.option_value_name != null
                              ? val.option_value_id
                              : null
                          )
                        }
                        onIncrement={(text) =>
                          this.addvalue(
                            this.get_menu_price(val.ID),
                            val.ID,
                            key
                          )
                        }
                        onDecrement={(text) =>
                          this.decrementvalue(this.get_menu_price(val.ID), key)
                        }
                        onMaximumReached={(text) =>
                          this.maximumreached(val.stock_qty)
                        }
                      />
                      {/*} <UIStepper displayValue height={20} width={75}  borderColor="#FD4431" textColor="#FD4431" overrideTintColor tintColor="#FD4431" initialValue={val.qty} maximumValue={99} borderRadius={5} onValueChange={(value) => { this.update(value,val.price,val.menu_id) }} 
                            />
                    <Text id='menu_tot_{val.menu_id}' style={{ fontSize:16, color:'#FF6149',marginTop:20,textAlign:'right' }}>{this.state.currency+''+(val.menu_total).toFixed(2)}</Text>
                    */}
                    </Col>
                  </Row>
                </Col>
                {/*<Col style={{ width:'10%',justifyContent:'center',alignItems:'center' }}>
                  <Row>
                  <Text onPress={(text)=> this.removecart(val.menu_id,val.option_id)} style={{ marginTop:5,textAlign:'center'}}><Entypo style={{color:'#FF6149',fontSize:18}} name='circle-with-cross' /></Text>
                  </Row>
                  </Col>*/}
              </Row>
            </Content>
          </Row>
        );
      }
    });

    if (this.state.dataSource && this.state.dataSource.length > 0) {
      data = JSON.parse(this.state.dataSource[0].taxes);
      taxes = data.map((tax_val, key) => {
        // if (this.state.added_amount != 0) {
        //   var tax_amt = this.state.added_amount * (tax_val.tax_value / 100);
        // } else {
        //   var tax_amt = this.state.food_cost * (tax_val.tax_value / 100);
        // }
        if (this.state.tax_delivery_charge == "YES") {
          if (this.state.switchValue !== 1) {
            var tax_amt =
              parseInt(this.state.food_cost) * (tax_val.tax_value / 100);
          } else {
            var tax_amt =
              (parseInt(this.state.food_cost) +
                parseInt(this.state.delivery_fee)) *
              (tax_val.tax_value / 100);
          }
        } else {
          var tax_amt =
            parseInt(this.state.food_cost) * (tax_val.tax_value / 100);
        }
        //var tax_amt = this.state.added_amount * (tax_val.tax_value / 100);
        return (
          <Row>
            <Col style={{ width: "70%" }}>
              <Text style={styles.cart_label}>
                {tax_val.tax_name} ({tax_val.tax_value}%)
              </Text>
            </Col>
            <Col style={{ width: "30%" }}>
              <Text style={styles.cart_values}>
                {this.state.currency}
                {tax_amt.toFixed(2)}{" "}
              </Text>
            </Col>
          </Row>
        );
      });
    }
    if (this.state.showIndicator) {
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
                <Text>{strings.cart}</Text>
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
      const { loading, token } = this.state;
      return (
        // Try removing the `flex: 1` on the parent View.
        // The parent will not have dimensions, so the children can't expand.
        // What if you add `height: 300` instead of `flex: 1`?
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
                <Text>{strings.cart}</Text>
              </Title>
            </Body>
            <Right>
              {/* <Icon style={{color:'#FFFFFF'}} name='cart' />
          <Badge warning style={{scaleX: 0.8, scaleY: 0.6,marginTop: -9,marginLeft: -10}}><Text style={{marginTop:-2,color : '#FFFFFF', fontSize: 20,justifyContent:'center'}}>1</Text></Badge> */}
            </Right>
          </Header>
          {
            this.state.total_items == 0 ? (
              <Body
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Thumbnail
                  style={{
                    height: 150,
                    width: 150,
                  }}
                  square
                  source={require(".././assets/img/no_data.png")}
                ></Thumbnail>
                <Text style={{ marginBottom: 15, marginTop: 15 }}>
                  {" "}
                  {strings.cart_is_empty}
                </Text>
              </Body>
            ) : (
              //  <ScrollView>
              // <ScrollViewIndicator
              //   //scrollIndicatorStyle={{color: colors.tint_col}}
              //   flexibleIndicator={false}
              //   indicatorHeight={50}
              //   scrollIndicatorStyle={{
              //     backgroundColor: colors.theme_fg,
              //     width: 4,
              //   }}
              //   hideTimeout={250}
              // >
              <KeyboardAwareScrollView
                extraScrollHeight={20}
                // indicatorStyle={{
                //   // backgroundColor: colors.theme_fg,
                //   width: 4,
                //   height: 50,
                // }}
                contentContainerStyle={{ flex: 1 }}
              >
                <Content
                  style={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Grid>
                    <Row>
                      <Content style={styles.firstblock}>
                        {/* <Modal
                          animationType="slide"
                          visible={this.state.modalVisible}
                          onRequestClose={this.hide.bind(this)}
                          transparent={false}
                        >
                          <View style={styles.modalWarp}>
                            <View style={styles.contentWarp}>
                              
                              <WebView
                                style={[{ flex: 1 }, this.props.styles]}
                                source={{uri: 'https://google.com/'}}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                                onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                onError={this._onNavigationStateChange.bind(this)}
                              />
                              <TouchableOpacity onPress={this.hide.bind(this)} style={styles.btnStyle}>
                                <Text style={styles.closeStyle}>close</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal > */}
                        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
                          <Col style={{ width: "90%", marginLeft: "5%" }}>
                            <Row>
                              <Text style={styles.restaurantname}>
                                {this.state.location_name}
                              </Text>
                            </Row>
                            {/* <Text style={styles.description} numberOfLines={1}>
                            {this.state.location_description}
                          </Text> */}

                            {this.state.offer_collection == 1 &&
                            this.state.from != "TableBooking" ? (
                              <Row
                                style={{
                                  alignContent: "flex-end",
                                  marginTop: 10,
                                }}
                              >
                                <Left>
                                  <Row style={{ alignItems: "center" }}>
                                    <Text style={styles.name}>Self-pickup</Text>
                                    {/* <Text style={styles.name} >{this.state.switchValue != 1 ? 'ON' : 'OFF'}</Text> */}
                                  </Row>
                                </Left>
                                <Right>
                                  <Row style={{ alignItems: "center" }}>
                                    <Text style={styles.name}>
                                      {this.state.switchValue !== 1 ? (
                                        <Text
                                          style={{
                                            color: colors.star_icons,
                                            fontSize: 14,
                                            paddingRight:
                                              Platform.OS === "ios" ? 4 : 0,
                                          }}
                                        >
                                          YES
                                        </Text>
                                      ) : (
                                        <Text
                                          style={{
                                            fontSize: 14,
                                            color: colors.star_icons,
                                            paddingRight:
                                              Platform.OS === "ios" ? 4 : 0,
                                          }}
                                        >
                                          NO
                                        </Text>
                                      )}
                                    </Text>
                                    <Switch
                                      tintColor={colors.star_icons_tint}
                                      onTintColor={colors.star_icons_tint}
                                      disabled={
                                        this.state.offer_delivery == 0 &&
                                        this.state.offer_collection !== 0
                                          ? true
                                          : false
                                      }
                                      thumbTintColor={colors.star_icons}
                                      onValueChange={this.toggleSwitch}
                                      value={
                                        this.state.switchValue == 1
                                          ? false
                                          : true
                                      }
                                    />
                                  </Row>
                                </Right>
                              </Row>
                            ) : null}
                          </Col>

                          {this.state.from == "TableBooking" ? (
                            <Col>
                              <Row>
                                <Left>
                                  <Text style={styles.guests_label}>
                                    Guests
                                  </Text>
                                  <Text style={styles.guests_label}>
                                    Total-Tables
                                  </Text>
                                </Left>
                                <Right>
                                  <Text style={styles.guests}>
                                    : {this.state.guest_count}
                                  </Text>
                                  <Text style={styles.guests}>: 2</Text>
                                </Right>
                              </Row>
                            </Col>
                          ) : null}
                        </Row>
                        <Divider style={{ backgroundColor: colors.divider }} />
                        <Div style={{ marginTop: 20 }}></Div>
                        {menus}
                      </Content>
                    </Row>
                    <Row
                      style={{
                        marginLeft: "3%",
                        marginRight: "3%",
                        marginTop: 10,
                      }}
                    >
                      {/* <Content > */}
                      {/* <Div style={{  }} ></Div> */}
                      <Row
                        style={{
                          // borderColor: colors.bg_two,
                          borderRadius: 5,
                          // borderWidth: 1,
                          marginBottom: 10,
                          backgroundColor: colors.bg_two,
                        }}
                      >
                        <Col style={{ width: "75%", height: 40 }}>
                          <Input
                            style={{
                              marginBottom: 0,
                              paddingLeft: 15,
                              fontSize: 14,
                              fontFamily: colors.font_family,
                              opacity:
                                this.state.apply_disabled == true ? 0.5 : 1,
                            }}
                            disabled={this.state.apply_disabled}
                            placeholderTextColor={colors.tint}
                            placeholder={strings.enter_coupon_code}
                            onChangeText={(val) =>
                              this.setState({
                                coupon_code: val,
                                apply_disabled: false,
                              })
                            }
                            value={this.state.coupon_code}
                          />
                        </Col>
                        <Col
                          style={{
                            width: "25%",
                            height: 40,
                            alignItems: "flex-end",
                          }}
                        >
                          <Button
                            small
                            style={{
                              backgroundColor: colors.theme_fg,
                              elevation: 0,
                              shadowOpacity: 0,
                              justifyContent: "center",
                              height: 40,
                              borderBottomRightRadius: 10,
                              borderTopRightRadius: 10,
                              width: 70,
                              opacity:
                                this.state.apply_disabled == true ? 0.5 : 1,
                            }}
                            onPress={() => this.coupon_func()}
                            disabled={this.state.apply_disabled}
                          >
                            <Text style={{ fontSize: 14, color: "#FFF" }}>
                              {strings.apply}
                            </Text>
                          </Button>
                        </Col>
                      </Row>
                      {/* </Content> */}
                    </Row>

                    <Row>
                      <Col style={{ marginLeft: "3%", marginRight: "3%" }}>
                        <Row
                          style={{
                            elevation: 0,
                            // shadowOffset: { height: 2, width: 0 },
                            shadowOpacity: 0,
                            // shadowColor: colors.shadow,
                            // borderColor: colors.icons,
                            borderRadius: 5,
                            // borderWidth: 0.7,
                            marginBottom: 10,
                            backgroundColor: colors.bg_two,
                          }}
                        >
                          <Col style={{ width: "100%" }}>
                            <Div style={{ marginTop: 7 }}></Div>
                            <Row style={{ alignItems: "center" }}>
                              <Col style={{ width: "50%" }}>
                                <Text style={styles.name}>
                                  {strings.personal_details}
                                </Text>
                              </Col>
                            </Row>
                            <Div style={{ marginTop: 10 }}></Div>
                            <Divider
                              style={{
                                backgroundColor: colors.tint_col,
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                            />
                            <Div style={{ marginTop: 10 }}></Div>
                            <Row>
                              <Col style={{ width: "75%" }}>
                                <Text style={styles.customername}>
                                  {this.state.name}: {this.state.phone}{" "}
                                </Text>
                              </Col>
                              {/*<Col style={{ width:'75%' }}>
                       <Text style={styles.restaurantname} >Change</Text>
                        </Col>*/}
                            </Row>
                            <Div style={{ marginTop: 10 }}></Div>
                          </Col>
                        </Row>
                        {this.state.switchValue == 1 &&
                        this.state.from != "TableBooking" ? (
                          <Row
                            style={{
                              elevation: 0,
                              // shadowOffset: { height: 2, width: 0 },
                              shadowOpacity: 0,
                              // shadowColor: colors.shadow,
                              // borderColor: colors.icons,
                              borderRadius: 5,
                              // borderWidth: 0.7,
                              marginBottom: 10,
                              backgroundColor: colors.bg_two,
                            }}
                          >
                            <Col style={{ width: "100%" }}>
                              <Div style={{ marginTop: 7 }}></Div>
                              <Row
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Col style={{ width: "50%" }}>
                                  <Text style={styles.name}>
                                    {strings.delivery_location}
                                  </Text>
                                </Col>
                                <Col style={{ width: "50%" }}>
                                  <Text
                                    onPress={this.address_list}
                                    style={styles.rewards}
                                  >
                                    {strings.add_or_change}
                                  </Text>
                                </Col>
                              </Row>
                              <Div style={{ marginTop: 10 }}></Div>
                              <Divider
                                style={{
                                  backgroundColor: colors.tint_col,
                                  marginLeft: 10,
                                  marginRight: 10,
                                }}
                              />
                              <Div style={{ marginTop: 10 }}></Div>
                              {this.state.address.default_address == "on" ||
                              this.state.default_id != 0 ? (
                                <Row>
                                  <Col style={{ width: "75%" }}>
                                    <Text style={styles.customername}>
                                      {this.state.address.address_1}
                                    </Text>
                                    {this.state.address.address_2 ? (
                                      <Text style={styles.customername}>
                                        {strings.plot_no1}
                                        {this.state.address.address_2}{" "}
                                      </Text>
                                    ) : null}
                                  </Col>
                                </Row>
                              ) : null}
                              <Div style={{ marginTop: 10 }}></Div>
                            </Col>
                          </Row>
                        ) : null}
                        {/* comment section ------------- */}
                        {/* {strings.notes_optional} */}
                        <Row
                          style={{
                            elevation: 0,
                            // shadowOffset: { height: 2, width: 0 },
                            shadowOpacity: 0,
                            // shadowColor: colors.shadow,
                            // borderColor: colors.icons,
                            borderRadius: 5,
                            // borderWidth: 0.7,
                            marginBottom: 10,
                            backgroundColor: colors.bg_two,
                            shadowOpacity: 0,
                          }}
                        >
                          <Col style={{ width: "100%" }}>
                            <Div style={{ marginTop: 7 }}></Div>
                            <Row style={{ alignItems: "center" }}>
                              <Col style={{ width: "50%" }}>
                                <Text style={styles.name}>
                                  Additional Notes
                                </Text>
                              </Col>
                            </Row>
                            <Div style={{ marginTop: 10 }}></Div>
                            <Divider
                              style={{
                                backgroundColor: colors.tint_col,
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                            />
                            <Div style={{ marginTop: 10 }}></Div>
                            <Row>
                              <Col style={{ marginLeft: 5, width: "75%" }}>
                                <TextInput
                                  style={styles.name}
                                  underlineColorAndroid="transparent"
                                  placeholder={strings.Write_your_notes_here}
                                  placeholderTextColor="#a3a3a3"
                                  autoCapitalize={true}
                                  onChangeText={(text) =>
                                    this.setState({ text, comment_msg: text })
                                  }
                                  multiline={false}
                                  value={this.state.comment_msg}
                                />
                              </Col>
                            </Row>
                            <Div style={{ marginTop: 10 }}></Div>
                          </Col>
                        </Row>
                        <TearLines
                          ref="top"
                          color={colors.bg_two}
                          backgroundColor="#ffff"
                        />
                        <Row
                          style={{
                            elevation: 0,
                            // shadowOffset: { height: 2, width: 0 },
                            shadowOpacity: 0,
                            // shadowColor: colors.theme_fg,
                            // borderColor: colors.icons,
                            borderRadius: 0,

                            // borderWidth: 0.7,
                            //marginBottom: 10,
                            backgroundColor: colors.bg_two,
                            shadowOpacity: 0,
                          }}
                          onLayout={(e) => {
                            this.refs.top.onLayout(e);
                            this.refs.bottom.onLayout(e);
                          }}
                        >
                          <Col style={{ width: "100%" }}>
                            <Div style={{ marginTop: 7 }}></Div>

                            <Row
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: 30,
                              }}
                            >
                              <Col style={{ width: "60%" }}>
                                <Text style={styles.name}>
                                  {strings.payment_mode}
                                </Text>
                              </Col>

                              <Col style={{ width: "40%" }}>
                                {/*} <Text onPress={this.handleCardPayPress}
                               {...testID('cardFormButton')} style={styles.rewards}>Rewards & Cash <Entypo style={{color:'#000000'}} name='chevron-down' /></Text>*/}
                                {/*} <RNPickerSelect
                      placeholder={{}}
                      items={payments}
                      onValueChange={value => {
                        this.setState({ payment: value })
                      }}
                      style={styles.pickerSelectStyles}
                      value={this.state.payment}
                    /> */}
                                <Picker
                                  mode="dropdown"
                                  selectedValue={this.state.payment}
                                  iosHeader="Select Payment method"
                                  iosIcon={<Icon name="arrow-down" />}
                                  itemTextStyle={{
                                    color: colors.sub_font,
                                    fontFamily: colors.font_family,
                                  }}
                                  textStyle={{
                                    color: colors.header,
                                    fontFamily: colors.font_family,
                                  }}
                                  style={{
                                    color: colors.sub_font,
                                    fontSize: 12,
                                  }}
                                  onValueChange={(itemValue) =>
                                    this.setState({ payment: itemValue })
                                  }
                                >
                                  <Picker.Item
                                    label="Paytoday"
                                    value="paytoday"
                                  />
                                  <Picker.Item 
                                  label="Cash" 
                                  value="cash" 
                                  />
                                  {/*      <Picker.Item
                                  label="Credit Card"
                                  value="stripe"
                                /> */}
                                  {/*     <Picker.Item
                                  label="Paypal"
                                  value="paypal_express"
                                /> */}
                                </Picker>
                              </Col>
                            </Row>
                            <Modal
                              animationType="slide"
                              transparent={false}
                              visible={this.state.modalVisible}
                              onRequestClose={() => {
                                this.hide();
                                this.loadingButton.showLoading(false);
                              }}
                            >
                              <SafeAreaView
                                style={{
                                  height: "100%",
                                  width: SCREEN_WIDTH,
                                  overflow: "hidden",
                                }}
                              >
                                <Button
                                  light
                                  rounded
                                  small
                                  full={false}
                                  // iconLeft
                                  style={{
                                    marginTop: 10,
                                    marginBottom: 5,
                                    marginLeft: 5,
                                    padding: 10,
                                    // paddingRight:8,
                                    width: 75,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  textStyle={{ textAlign: "center" }}
                                  onPress={() => {
                                    this.setState({
                                      modalVisible: false,
                                      disabled: false,
                                    });
                                  }}
                                >
                                  {/* <Icon
                                    name="close"
                                    type="MaterialCommunityIcons"
                                  /> */}
                                  <Text>Close</Text>
                                </Button>
                                {/* // Faisal work    */}
                                <PayToday
                                  //source={{uri:"file:///android_asset/index.html"}}
                                  Amount={cost}
                                  Business_ID="2790"
                                  Business_Name="Dely"
                                  Thank_you_URL=""
                                  Reference_Number={orderId}
                                  onSuccess={(e) => {
                                    const split = e.url.split("/");
                                    const split2 = split[split.length - 1];
                                    const split3 = split2.split("=");
                                    const url = split3[split3.length - 1];
                                    // console.log(
                                    //   "test",
                                    //   url,
                                    //   //load(cburl),
                                    //   e.title.toLowerCase(),
                                    //   orderId
                                    // );
                                    if (
                                      url === "success" ||
                                      (url === "thankyou" && e.canGoBack)
                                    ) {
                                      //console.log("i am called");
                                      this.setState(
                                        {
                                          modalVisible: false,
                                          showIndicator: true,
                                        },
                                        () => {
                                          this.success();
                                        }
                                      );
                                    } else if (
                                      url !== "success" &&
                                      e.canGoBack
                                    ) {
                                      this.setState({ modalVisible: false });
                                      this.showSnackbar("Payment Failed");
                                    }
                                  }}
                                />
                                {/* // Faisal work  end  */}
                              </SafeAreaView>
                            </Modal>
                            <Div style={{ marginTop: 10 }}></Div>
                            <Divider
                              style={{
                                backgroundColor: colors.tint_col,
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                            />
                            <Div style={{ marginTop: 10 }}></Div>
                            {this.state.food_cost != 0 ? (
                              <Row>
                                <Col style={{ width: "70%" }}>
                                  <Text style={styles.cart_label}>
                                    {strings.food_cost}
                                  </Text>
                                </Col>
                                <Col style={{ width: "30%" }}>
                                  <Text style={styles.cart_values}>
                                    {this.state.currency +
                                      "" +
                                      this.state.food_cost}{" "}
                                  </Text>
                                </Col>
                              </Row>
                            ) : null}

                            {/* <Row>
                    <Col style={{ width:'70%' }}>
                       <Text style={styles.cart_label} >Table Cost</Text>
                    </Col>
                    <Col style={{ width:'30%' }}>
                       <Text style={styles.cart_values}>USD 10 </Text>
                    </Col>
                  </Row> */}
                            {/* <Row>
                    <Col style={{ width:'70%' }}>
                       <Text style={styles.cart_label} >Table Cost</Text>
                    </Col>
                    <Col style={{ width:'30%' }}>
                       <Text style={styles.cart_values}>USD 10 </Text>
                    </Col>
                  </Row>  */}

                            {this.state.apply_disabled ? (
                              <Row
                                style={{
                                  opacity:
                                    this.state.apply_disabled !== true ? 0 : 1,
                                }}
                              >
                                <Col style={{ width: "70%" }}>
                                  <Row
                                    style={{
                                      width: "100%",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        textAlign: "right",
                                        fontFamily: colors.font_family_bold,
                                        marginTop: 5,
                                        color:
                                          this.state.coupon_code != ""
                                            ? "green"
                                            : colors.sub_font,
                                      }}
                                    >
                                      {strings.coupon +
                                        " " +
                                        this.state.coupon_code}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={async () => {
                                        await this.setState({
                                          apply_disabled: false,
                                          added_amount: 0,
                                          discount_amount: 0,
                                          coupon_code: "",
                                        }),
                                          this.state.from != "TableBooking" &&
                                          this.state.switchValue != 2
                                            ? await this.delivery_func()
                                            : await this.get_cart();
                                      }}
                                    >
                                      <Icon
                                        name="close"
                                        style={{
                                          color: "red",
                                          fontSize: 14,
                                          marginTop: 6,
                                          marginLeft: 10,
                                          marginRight: 5,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </Row>
                                </Col>
                                <Col style={{ width: "30%" }}>
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      textAlign: "left",
                                      fontFamily: colors.font_family_bold,
                                      marginLeft: 20,
                                      marginTop: 5,
                                      color:
                                        this.state.coupon_code != ""
                                          ? "green"
                                          : colors.sub_font,
                                    }}
                                  >
                                    {this.state.currency}
                                    {this.state.discount_amount === ""
                                      ? (0).toFixed(2)
                                      : "-" + this.state.discount_amount}{" "}
                                  </Text>
                                </Col>
                              </Row>
                            ) : null}
                            {this.state.from == "TableBooking" ? (
                              <View>
                                <Row>
                                  <Col style={{ width: "70%" }}>
                                    <Text style={styles.cart_label}>
                                      {strings.table_price}
                                    </Text>
                                  </Col>
                                  <Col style={{ width: "30%" }}>
                                    <Text style={styles.cart_values}>
                                      {this.state.currency +
                                        "" +
                                        this.state.table_price}
                                    </Text>
                                  </Col>
                                </Row>
                              </View>
                            ) : null}
                            {this.state.from != "TableBooking" &&
                            this.state.offer_delivery == 1 &&
                            this.state.switchValue == 1 &&
                            this.state.delivery_fee !== 0 ? (
                              <Row>
                                <Col style={{ width: "70%" }}>
                                  <Text style={styles.cart_label}>
                                    {strings.delivery_charge}
                                  </Text>
                                </Col>
                                <Col style={{ width: "30%" }}>
                                  <Text style={styles.cart_values}>
                                    {this.state.currency +
                                      "" +
                                      parseFloat(
                                        this.state.delivery_fee
                                      ).toFixed(2)}{" "}
                                  </Text>
                                </Col>
                              </Row>
                            ) : null}
                            {taxes}
                            <Div style={{ marginTop: 10 }}></Div>
                            <Divider
                              style={{
                                backgroundColor: colors.tint_col,
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                            />
                            <Div style={{ marginTop: 10 }}></Div>
                            <Row>
                              <Col style={{ width: "65%" }}>
                                <Text style={styles.total}>
                                  {strings.total_cost}
                                </Text>
                              </Col>
                              <Col style={{ width: "35%" }}>
                                <Text style={styles.total_values}>
                                  {this.state.currency +
                                    "" +
                                    this.state.total_cost}
                                </Text>
                              </Col>
                            </Row>
                            <Div style={{ marginTop: 10 }}></Div>
                          </Col>
                        </Row>
                        <TearLines
                          isUnder
                          ref="bottom"
                          color={colors.bg_two}
                          backgroundColor="#ffff"
                        />
                        {/* --------------------------------------------------------------- */}
                        <View style={{ marginTop: 10 }}>
                          {this.state.switchValue == 2 ||
                          this.state.total_cost > 0 ? (
                            // <TouchableOpacity
                            //   style={{ backgroundColor: colors.theme_fg }}
                            //   underlayColor="#fff"
                            // >
                            <AnimateLoadingButton
                              ref={(c) => (this.loadingButton = c)}
                              width={this.state.screenWidth - 20}
                              height={40}
                              title={strings.place_order}
                              titleFontFamily={colors.font_family}
                              backgroundColor={
                                Platform.OS === "android"
                                  ? colors.theme_fg
                                  : colors.theme_fg
                              }
                              borderRadius={5}
                              onPress={this.func.bind(this)}
                            />
                          ) : // </TouchableOpacity>
                          null}
                        </View>
                      </Col>
                    </Row>
                  </Grid>
                  <View style={{ padding: 10 }}></View>
                </Content>
              </KeyboardAwareScrollView>
            )
            // </ScrollView>
          }
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
  firstblock: {
    backgroundColor: "#fff",
    width: "100%",
  },
  restaurantname: {
    /*marginLeft:10,*/
    color: colors.header,
    fontSize: 16,
    fontFamily: colors.font_family_bold,
    textAlign: "center",
  },
  total: {
    textAlign: "left",
    marginLeft: 15,
    color: colors.header,
    fontSize: 14,
    fontFamily: colors.font_family_bold,
  },
  name: {
    color: colors.theme_fg,
    fontSize: 14,
    textAlign: "left",
    marginLeft: 5,
    marginBottom: 2,
    paddingTop: 0,
    paddingRight: Platform.OS === "ios" ? 4 : 0,
    //fontWeight: "bold",
    fontFamily: colors.font_family,
  },
  subname: {
    //color: colors.theme_fg,
    fontSize: 12,
    textAlign: "left",
    marginLeft: 5,
    marginTop: 0,
    paddingTop: 0,
  },
  price: {
    color: colors.price,
    fontSize: 14,
    textAlign: "left",
    marginLeft: 5,
    marginTop: 2,
    //fontWeight: "bold",
  },
  guests: {
    fontSize: 16,
    textAlign: "right",
    marginRight: 50,
    color: "#000000",
  },
  rewards: {
    fontSize: 14,
    textAlign: "right",
    marginRight: 10,
    color: colors.star_icons,
    //textDecorationLine: "underline",
  },
  cart_values: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 20,
    marginTop: 5,
    color: colors.sub_font,
  },
  total_values: {
    textAlign: "left",
    marginLeft: 14,
    fontFamily: colors.font_family_bold,
    color: colors.header,
    fontSize: 16,
  },
  cart_label: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 5,
    marginLeft: 15,
    color: colors.theme_fg,
  },
  guests_label: {
    fontSize: 16,
    textAlign: "right",
    marginRight: 0,
    color: colors.sub_font,
  },
  address: {
    fontSize: 10,
    textAlign: "left",
    /*marginLeft:10,*/
    color: colors.sub_font,
  },
  customername: {
    fontSize: 14,
    textAlign: "left",
    marginLeft: 15,
    color: colors.sub_font,
  },
  pickerSelectStyles: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 5,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: colors.font_family,
  },
});
