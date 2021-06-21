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
  BackHandler,
  ScrollView,
  ActivityIndicator,
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
  Footer,
  FooterTab,
  View,
} from "native-base";
import { Div } from "react-native-div";
import { Divider } from "react-native-elements";
import UIStepper from "react-native-ui-stepper";
import { RadioButton, TouchableRipple } from "react-native-paper";
import SQLite from "react-native-sqlite-storage";
import { NavigationActions, StackActions } from "react-navigation";
import * as colors from "../assets/css/Colors";
import { img_url } from "../config/Constants";
import Snackbar from "react-native-snackbar";
import CheckBox from "react-native-check-box";
import strings from "./stringsoflanguages";
import moment from "moment";

let db = SQLite.openDatabase({ name: "spotneats.db" });

export default class Menu extends Component {
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
      showIndicator: true,
      menu_option_id:
        this.props.navigation.getParam("menu_details").menus_options[0]
          .menu_option_id,
      visible: false,
      details: this.props.navigation.getParam("details"),
      menu_details: this.props.navigation.getParam("menu_details"),
      location_name: this.props.navigation.getParam("location_name"),
      amount: 0, //(parseFloat(this.props.navigation.getParam('menu_details').menu_price) + parseFloat(this.props.navigation.getParam('menu_details').menus_options[0].option_values[0].price)).toFixed(2),
      price: (
        parseFloat(this.props.navigation.getParam("menu_details").menu_price) +
        parseFloat(
          this.props.navigation.getParam("menu_details").menus_options[0]
            .option_values[0].price
        )
      ).toFixed(2),
      qtym: 0,
      menu_total: 0,
      qty: "",
      checked: [],
      checked_details: [],
      currency: this.props.navigation.getParam("currency"),
      user_id: this.props.navigation.getParam("user_id"),
      alcohol_status: this.props.navigation.getParam("alcohol_status"),
      dataSource: [],
      option_order_id: moment().utcOffset("+02:00").format("YYYYMMDDhhmmss"),
    };
  }
  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", (payload) =>
        this.componentDidFocus(payload)
      ),
    ];

    //await this.handleChange(1);
    await this.check_sqli();
    await this.addvalueM(this.state.menu_details.menu_price);
    this.setState({
      option_order_id:
        this.state.menu_details.menu_id +
        "-" +
        this.state.user_id +
        "-" +
        moment().utcOffset("+02:00").format("YYYYMMDDhhmmss"),
    });
    //await this.get_cart();
  }

  async componentDidFocus() {
    //  await this.check_sqli();
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    //this.setState({showIndicator:true});
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    //this.props.navigation.navigate('RestaurantDetail',{details : this.state.details});
    this.props.navigation.goBack(null);
    return true;
  }

  maximumreached = (qty) => {
    this.showSnackbar("Only " + qty + " quantity available");
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  async check_sqli() {
    await db.transaction((tx) => {
      var self = this;

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cart(SUBID INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0, main_cart_id BIGINT NOT NULL" +
          ", FOREIGN KEY (main_cart_id) REFERENCES main_cart(ID) ON DELETE CASCADE ON UPDATE NO ACTION)",

        []
      );

      tx.executeSql(
        "SELECT * FROM cart where menu_id=? and location_id=?",
        [this.state.menu_details.menu_id, this.state.menu_details.location_id],
        async function (txn, results) {
          var foodcst = 0;
          if (
            results.rows.length > 0 &&
            self.state.user_id != results.rows.item(0).user_id
          ) {
            tx.executeSql("Delete FROM cart", [], (tx, results) => {});
            await self.setState({ food_cost: 0 });
            self.setState({ showIndicator: false });
            results.rows.length == 0;
            return false;
          }

          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              var unique_id = results.rows.item(i).unique_id.toString();
              // await self.manageToggle(
              //   unique_id,
              //   results.rows.item(i).price,
              //   results.rows.item(i).option_id,
              //   results.rows.item(i).option_name,
              //   results.rows.item(i).option_value_id,
              //   results.rows.item(i).option_value_name,
              //   results.rows.item(i).qty
              // );
              foodcst = foodcst + results.rows.item(i).menu_total;
            }

            await self.setState({
              //amount: parseFloat(foodcst).toFixed(2),
              showIndicator: false,
            });
            //self.setState({showIndicator:false});
          } else {
            self.setState({ showIndicator: false });
          }
        }
      );
      self.setState({ showIndicator: false });
    });
  }

  handleChange(
    qty
    // menu_id,
    // menu_name,
    // menu_photo,
    // menu_price,
    // stock,
    // option_id,
    // alcohol_status
  ) {
    if (qty == 0) {
      // this.removecartM(menu_id, option_id);
      var q = parseFloat(this.state.qtym) - 1;
      this.setState({ qtym: q });
    } else {
      // this.addcartM(
      //   qty,
      //   menu_id,
      //   menu_name,
      //   menu_photo,
      //   menu_price,
      //   stock,
      //   alcohol_status
      // );
      var q = parseFloat(this.state.qtym) + 1;
      this.setState({ qtym: q });
    }
  }

  addvalueM = async (price, menu_options) => {
    var foocst = (parseFloat(this.state.amount) + parseFloat(price)).toFixed(2);

    this.state.qtym += 1;

    //var qt = this.state.st_qty + 1;
    await this.setState({ amount: foocst });
    //optionspage(val.menu_items[menu_key])
  };

  decrementvalueM = async (price) => {
    var foocst = (parseFloat(this.state.amount) - parseFloat(price)).toFixed(2);
    this.state.qtym -= 1;
    //this.setState({});
    //var qt = this.state.st_qty - 1;

    await this.setState({ amount: foocst });
  };

  addvalue = async (unique_id, price) => {
    var vall = this.state.checked.indexOf(unique_id);
    var food_cos = this.state.checked_details[vall][unique_id].amount;
    var foocst = (parseFloat(food_cos) + parseFloat(price)).toFixed(2);
    this.state.checked_details[vall][unique_id].amount = foocst;
    this.state.checked_details[vall][unique_id].qty += 1;
    var amt = (parseFloat(this.state.amount) + parseFloat(price)).toFixed(2);
    await this.setState({ amount: amt });
    //await this.setState({ checked_details[unique_id].amount : foocst });
  };

  decrementvalue = async (unique_id, price) => {
    var vall = this.state.checked.indexOf(unique_id);
    var food_cos = this.state.checked_details[vall][unique_id].amount;
    var foocst = (parseFloat(food_cos) - parseFloat(price)).toFixed(2);
    this.state.checked_details[vall][unique_id].amount = foocst;
    this.state.checked_details[vall][unique_id].qty -= 1;
    var amt = (parseFloat(this.state.amount) - parseFloat(price)).toFixed(2);
    await this.setState({ amount: amt });

    //var foocst = (parseFloat(this.state.food_cost) + parseFloat(price)).toFixed(2);
    //var qt = this.state.st_qty + 1;
    //await this.setState({ food_cost : foocst });
    //optionspage(val.menu_items[menu_key])
  };

  addcartM = async () => {
    var self = this;

    var qtym = self.state.qtym;

    var pricem = parseFloat(self.state.menu_details.menu_price).toFixed(2);

    self.setState({ menu_total: qtym * pricem });

    var locationname = self.state.details.location_name;
    var locationname = locationname.replace("'", "''");
    var menuname = self.state.menu_details.menu_name;
    var menuname = menuname.replace("'", "''");
    var menudesc = self.state.menu_details.menu_description;
    var menudesc = menudesc.replace("'", "''");

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS main_cart(ID INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0)",
          []
        );

        tx.executeSql("Delete from main_cart where location_id!=?", [
          self.state.menu_details.location_id,
        ]);

        tx.executeSql(
          "SELECT * FROM main_cart",
          [],
          async function (txn, results) {
            if (
              results.rows.length > 0 &&
              self.state.user_id != results.rows.item(0).user_id
            ) {
              await tx.executeSql("Delete from main_cart");
              await this.setState({ amount: 0 });
            }
          }
        );

        tx.executeSql(
          "INSERT INTO main_cart (user_id,location_id,location_name,menu_id,menu_name,menu_image,qty,price,menu_total,stock_qty,location_description,all_tax,taxes,alcohol_status) VALUES ('" +
            self.state.user_id +
            "','" +
            self.state.details.location_id +
            "','" +
            locationname +
            "','" +
            self.state.menu_details.menu_id +
            "','" +
            menuname +
            "','" +
            self.state.menu_details.menu_photo +
            "','" +
            qtym +
            "','" +
            self.state.menu_details.menu_price +
            "','" +
            self.state.menu_total +
            "','" +
            self.state.menu_details.stock_qty +
            "','" +
            menudesc +
            "','" +
            self.state.details.overall_tax +
            "','" +
            JSON.stringify(self.state.details.taxes) +
            "','" +
            self.state.menu_details.alcohol_status +
            "')",
          [],
          function (txn, results) {
            if (results.rowsAffected == 1) {
              resolve(results.insertId);
            } else {
              reject("error");
            }
          }
        );
      });
    });
  };

  addcart = async () => {
    this.state.menu_details.menus_options[0]["selected_option"] =
      this.state.checked; // Update selected option
    //var optionid = this.state.menu_details.menus_options[0].option_values[this.state.checked].option_value_id;

    let insertedID = await this.addcartM();
    var self = this;

    var locationname = self.state.location_name;
    var locationname = locationname.replace("'", "''");
    var menuname = self.state.menu_details.menu_name;
    var menuname = menuname.replace("'", "''");
    var menudesc = self.state.menu_details.menu_description;
    var menudesc = menudesc.replace("'", "''");

    db.transaction((tx) => {
      //tx.executeSql('DELETE FROM `cart`',[]);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cart(SUBID INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0, main_cart_id BIGINT NOT NULL" +
          ", FOREIGN KEY (main_cart_id) REFERENCES main_cart(ID) ON DELETE CASCADE ON UPDATE NO ACTION)",

        []
      );

      self.state.checked.map((val, key) => {
        var menu_option_id =
          self.state.checked_details[key][val].menu_option_id;
        var option_name = self.state.checked_details[key][val].option_name;
        var option_name = option_name.replace("'", "''");
        var option_value_id =
          self.state.checked_details[key][val].option_value_id;
        var option_value_id = option_value_id.replace("'", "''");
        var option_value_name =
          self.state.checked_details[key][val].option_value_name;
        var qty = self.state.checked_details[key][val].qty;
        var price = self.state.checked_details[key][val].price;
        var amount = self.state.checked_details[key][val].amount;
        tx.executeSql(
          "INSERT INTO cart (user_id,location_id,location_name,unique_id,menu_id,menu_name,menu_image,option_id,option_name,option_value_id,option_value_name,qty,price,menu_total,stock_qty,location_description,all_tax,taxes,menu_options,alcohol_status, main_cart_id) VALUES ('" +
            self.state.user_id +
            "','" +
            locationname +
            "','" +
            self.state.location_name +
            "','" +
            val +
            "','" +
            self.state.menu_details.menu_id +
            "','" +
            menuname +
            "','" +
            self.state.menu_details.menu_photo +
            "','" +
            menu_option_id +
            "','" +
            option_name +
            "','" +
            option_value_id +
            "','" +
            option_value_name +
            "','" +
            qty +
            "','" +
            price +
            "','" +
            amount +
            "','" +
            self.state.menu_details.stock_qty +
            "','" +
            self.state.details.description +
            "','" +
            self.state.details.overall_tax +
            "','" +
            JSON.stringify(self.state.details.taxes) +
            "','" +
            JSON.stringify(self.state.menu_details) +
            "','" +
            self.state.alcohol_status +
            "','" +
            insertedID +
            "')"
        );
      });
    });

    this.props.navigation.navigate("Menu", {
      details: this.state.details,
      from: "menu_option",
    });
    /*this.props
     .navigation
     .dispatch(StackActions.reset({
       index: 0,
       actions: [
         NavigationActions.navigate({
           routeName: 'Menu',
           params: { details: this.state.details },
         }),
       ],
     }))*/
  };

  removecartM = (menu_id, option_id) => {
    var self = this;
    db.transaction((tx) => {
      if (option_id) {
        tx.executeSql(
          "Delete FROM cart where menu_id=? and option_id=?",
          [menu_id, option_id],
          (tx, results) => {
            console.log("Results", results.rowsAffected);
          }
        );
      } else {
        tx.executeSql(
          "Delete FROM cart where menu_id=?",
          [menu_id],
          (tx, results) => {
            console.log("Results", results.rowsAffected);
          }
        );
      }
    });
  };

  isItemChecked = (abilityName) => {
    return this.state.checked.indexOf(abilityName) > -1;
  };

  viewcart = async () => {
    AsyncStorage.setItem("offer_delivery", this.state.details.offer_delivery);
    AsyncStorage.setItem(
      "offer_collection",
      this.state.details.offer_collection
    );
    AsyncStorage.setItem("delivery_fee", this.state.details.delivery_fee);
    AsyncStorage.setItem("details", JSON.stringify(this.state.details));

    if (this.state.from == "TableBooking") {
      AsyncStorage.setItem("from", this.state.from);
      var self = this;
      var cart_length;
      db.transaction(async (tx) => {
        await tx.executeSql(
          "SELECT * FROM cart",
          [],
          async function (txn, results) {
            await self.setState({
              cart_length: results.rows.length,
            });
          }
        );
      });
      alert(this.state.cart_length);
      await this.props.navigation.navigate("TableBooking", {
        details: this.state.details,
        currency: this.state.currency,
        tax_percent: this.state.tax_percent,
        cart_length: this.state.cart_length,
      });
    } else {
      AsyncStorage.setItem("from", "Menu");
      this.props.navigation.navigate("Cart", {
        details: this.state.details,
        currency: this.state.currency,
        tax_percent: this.state.tax_percent,
      });
    }
  };

  manageToggle = async (
    abilityName,
    value,
    menu_option_id,
    option_name,
    option_value_id,
    option_value_name,
    qty
  ) => {
    var tot_amt = (qty * value).toFixed(2);
    if (this.isItemChecked(abilityName)) {
      var amount = (parseFloat(this.state.amount) - parseFloat(value)).toFixed(
        2
      );
      await this.setState({ amount: amount });
      await this.setState({
        //checked_details: this.state.checked_details.filter(function(person,index){ person.index.abilityName !== abilityName}),

        checked: this.state.checked.filter((i) => i !== abilityName),
      });
    } else {
      //this.setState({ amount: parseFloat(this.state.amount) + parseFloat(amt) });
      //this.setState({ price: value });
      //{[abilityName] : {'qty' : 1,'amount': 10}}
      await this.setState({
        checked: [...this.state.checked, abilityName],
        checked_details: [
          ...this.state.checked_details,
          {
            [abilityName]: {
              menu_option_id: menu_option_id,
              option_name: option_name,
              option_value_id: option_value_id,
              option_value_name: option_value_name,
              qty: qty,
              price: value,
              amount: tot_amt,
            },
          },
        ],
      });
      var amount = (parseFloat(this.state.amount) + parseFloat(value)).toFixed(
        2
      );
      await this.setState({ amount: amount });
    }
  };

  render() {
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
                <Text>{this.state.menu_details.menu_name}</Text>
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
      let option_names = this.state.menu_details.menus_options.map(
        (val, key) => {
          return (
            <Button
              small
              style={
                this.state.menu_option_id == val.menu_option_id
                  ? styles.all_categorybtn
                  : styles.category_btn
              }
              onPress={() => {
                this.setState({
                  menu_option_id: val.menu_option_id,
                  pressStatus: false,
                });
              }}
            >
              <Text
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  fontSize: 14,
                  color:
                    this.state.menu_option_id == val.menu_option_id
                      ? colors.header
                      : null,
                }}
              >
                {val.option_name}
              </Text>
            </Button>
          );
        }
      );

      let menu_options = this.state.menu_details.menus_options.map(
        (menu_val, menu_key) => {
          if (this.state.menu_option_id == menu_val.menu_option_id) {
            let options = menu_val.option_values.map((val, key) => {
              var index_val = this.state.checked.indexOf(val.unique_id);
              var price =
                parseFloat(this.state.menu_details.menu_price) +
                parseFloat(val.price);
              return (
                <View pointerEvents={val.quantity == 0 ? "none" : "auto"}>
                  <Grid style={{ opacity: val.quantity == 0 ? 0.5 : 1 }}>
                    <Row
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        alignItems: "center",
                      }}
                    >
                      <Col
                        style={{
                          height: "100%",
                          width: "70%",
                          justifyContent: "flex-start",
                        }}
                      >
                        <TouchableRipple
                          style={{
                            height: "100%",
                          }}
                          onPress={() => {
                            this.manageToggle(
                              val.unique_id,
                              val.price,
                              val.menu_option_id,
                              menu_val.option_name,
                              val.option_value_id,
                              val.option_value_name,
                              1
                            );
                          }}
                        >
                          <Row
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {/*<RadioButton
          
                                color={colors.theme_fg}
                                uncheckedColor={colors.theme_fg}
                                status={this.state.checked === key ? 'checked' : 'unchecked'}
                                
                              />*/}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <CheckBox
                                style={{ height: "35%" }}
                                checkBoxColor={colors.theme_fg}
                                //onClick={this.checkChange(key)}
                                //isChecked={this.state.checkedItems.get(key)}
                                isChecked={this.isItemChecked(val.unique_id)}
                                onClick={() =>
                                  this.manageToggle(
                                    val.unique_id,
                                    val.price,
                                    val.menu_option_id,
                                    menu_val.option_name,
                                    val.option_value_id,
                                    val.option_value_name,
                                    1
                                  )
                                }
                              />
                              <Text
                                style={{ fontSize: 12, color: colors.sub_font }}
                              >
                                {" "}
                                {val.option_value_name} (+ {this.state.currency}
                                {parseFloat(val.price).toFixed(2)})
                              </Text>
                            </View>
                            {/*<RadioGroup
                                size={24}
                                thickness={2}
                                color='#f5511e'
                                selectedIndex={0}
                                onSelect = {(index, value) => this.onSelect(index, value)}
                              >
                                <RadioButton index={key} value={val.price} >
                                  <Text style={{ fontSize:16, color:'#735735' }}> {val.option_value_name}</Text>
                                </RadioButton>
                        
                                </RadioGroup>*/}
                          </Row>
                        </TouchableRipple>
                      </Col>
                      {val.quantity <= 0 ? (
                        <Col
                          style={{
                            width: "30%",
                            marginRight: 0,
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: "red",
                              fontFamily: colors.font_family,
                            }}
                          >
                            No Stock
                          </Text>
                        </Col>
                      ) : null}
                      {this.isItemChecked(val.unique_id) && val.quantity > 0 ? (
                        <Col
                          style={{
                            width: "30%",
                            marginLeft: 0,
                            marginRight: 0,
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <UIStepper
                            displayValue
                            height={22}
                            width={75}
                            fontSize={14}
                            justifyContent={"center"}
                            alignItems={"center"}
                            marginTop={5}
                            borderColor={"white"}
                            textColor={colors.theme_fg}
                            overrideTintColor
                            tintColor={colors.tint_col}
                            borderRadius={5}
                            initialValue={
                              this.state.checked_details[index_val][
                                val.unique_id
                              ] != undefined
                                ? this.state.checked_details[index_val][
                                    val.unique_id
                                  ].qty
                                : 1
                            }
                            minimumValue={1}
                            maximumValue={val.quantity}
                            fontFamily={colors.font_family}
                            onIncrement={(text) =>
                              this.addvalue(val.unique_id, val.price)
                            }
                            onDecrement={(text) =>
                              this.decrementvalue(val.unique_id, val.price)
                            }
                            onMaximumReached={(text) =>
                              this.maximumreached(val.quantity)
                            }
                          />
                        </Col>
                      ) : null}
                    </Row>
                  </Grid>
                </View>
              );
            });
            return options;
          }

          /*return(
      <Content style={styles.secondblock}>
        <Row style={{ paddingTop:20, paddingBottom:10, marginLeft:10, marginRight:10 }}>
        <Col style={{ width:'75%' }}>
         <Row>
         <Text style={styles.restaurantname}>{menu_val.option_name}</Text>
         </Row>
        
        </Col>
        <Col style={{ width:'25%' }}>
            <Text style={{ fontSize:14, marginLeft:5, marginRight:5, color:colors.theme_fg }}></Text>
        </Col>
        <Divider style={{ backgroundColor: colors.border, marginLeft:10, marginRight:10 }} />
        {options}
      </Row>
      </Content>
    )*/
        }
      );
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
            <Body style={{ flex: 3, justifyContent: "center" }}>
              <Title
                style={{ alignSelf: "center", color: colors.theme_button_fg }}
              >
                <Text>{this.state.menu_details.menu_name}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>

          <Content style={{ marginBottom: 20 }}>
            <Grid>
              <ScrollView>
                <Row>
                  <Thumbnail
                    style={{ width: "100%", height: 150 }}
                    square
                    source={{
                      uri: img_url + this.state.menu_details.menu_photo,
                    }}
                  />
                </Row>
                {/*
            <Row>
                <Content style={styles.firstblock}>
                  <Row style={{ paddingTop:20, paddingBottom:10, marginLeft:10, marginRight:10 }}>
                    <Col style={{ width:'75%' }}>
                     <Row>
                     <Text style={styles.restaurantname}>Packing Charges</Text>
                     </Row>
                    
                    </Col>
                    <Col style={{ width:'25%' }}yl
                  </Row>
                  <Divider style={{ backgroundColor: '#FD4431', marginLeft:10, marginRight:10 }} />
                  <Row style={{ paddingTop:20, paddingBottom:10, marginLeft:10, marginRight:10 }}>
                  <Col style={{ width:'75%' }}>
                  <Row>  
                  <Radio
                    color={"#f55624"}
                    selectedColor={"#FD4431"}
                    
                  />
                  <Text style={{ padding:2, fontSize:14, color:'#735735' }}> Additional Charges</Text>
                  </Row>
                </Col>
                  <Col style={{ width:'25%' }}>
                        <Text style={{ fontSize:14, marginLeft:5, marginRight:5, color:'#735735' }}>+ $ 5.00</Text>
                    </Col>
                </Row>
                </Content>
            </Row>*/}
                <Row
                  style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    alignItems: "center",
                    //backgroundColor: colors.theme_button_fg,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.name}>
                    {this.state.menu_details.menu_name}
                  </Text>
                  <Text style={styles.price}>
                    {this.state.currency +
                      "" +
                      this.state.menu_details.menu_price}
                  </Text>
                  {/* <UIStepper
                        displayValue
                        height={"50%"}
                        width={"95%"}
                        //alignItems="center"
                        initialValue={
                          0
                        }
                        fontSize={14}
                        borderColor={colors.divider}
                        textColor={colors.theme_fg}
                        overrideTintColor 
                        tintColor={colors.theme_fg}
                        borderRadius={5}
                        //marginRight={10}
                        minimumValue={0}
                        maximumValue={ 
                          this.state.menu_details.stock_qty > 0
                            ? this.state.menu_details.stock_qty
                            : undefined
                        }
                        fontFamily={colors.font_family}
                        onValueChange={(text) =>
                          this.handleChange(
                            text,
                            this.state.menu_details.menu_id,
                            this.state.menu_details.menu_name,
                            this.state.menu_details.menu_photo,
                            this.state.menu_details.menu_price,
                            this.state.menu_details.stock_qty,
                            this.state.menu_details.option_id,
                            //val.alcohol_status
                          )
                        }
                        onIncrement={(text) =>
                          this.addvalueM(
                            this.state.menu_details.menu_price
                            //val.menu_items[menu_key]
                          )
                        }
                        onDecrement={(text) =>
                          this.decrementvalueM(
                            this.state.menu_details.menu_price,
                            //val.menu_items[menu_key]
                          )
                        }
                        onMaximumReached={(text) =>
                          this.state.menu_details.stock_qty != 0 && this.state.menu_details.qty != 0
                            ? this.maximumreached(this.state.menu_details.stock_qty)
                            : null
                        }
                      /> */}
                </Row>
                <Row
                  style={{
                    paddingTop: 0,
                    paddingBottom: 10,
                    marginLeft: 12,
                    marginRight: 10,
                  }}
                >
                  <Text style={styles.description}>
                    {this.state.menu_details.menu_description}
                  </Text>
                </Row>
                <Row>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={{
                      backgroundColor: colors.bg_two,
                      paddingHorizontal: 10,
                      paddingVertical: 0,
                      borderBottomWidth: 0.5,
                      borderColor: colors.divider,
                    }}
                  >
                    {option_names}
                  </ScrollView>
                </Row>
                <Row>
                  <Content style={styles.secondblock}>
                    {/*<Row style={{ paddingTop:20, paddingBottom:10, marginLeft:10, marginRight:10 }}>
                    <Col style={{ width:'75%' }}>
                     <Row>
                     <Text style={styles.restaurantname}>Options</Text>
                     </Row>
                    
                    </Col>
                    <Col style={{ width:'25%' }}>
                        <Text style={{ fontSize:14, marginLeft:5, marginRight:5, color:colors.theme_fg }}></Text>
                    </Col>
                   </Row>*/}
                    {/* <Divider
                      style={{
                        backgroundColor: colors.divider,
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    /> */}
                    {menu_options}
                  </Content>
                </Row>
              </ScrollView>
              {/*<Row>
              <Content style={styles.thirdblock}>
                          
                <Row style={{ paddingTop:20, paddingBottom:10, marginLeft:'20%', marginRight:'20%' }}>
                  <Col style={{ width:'100%' }}>
                    
                     <UIStepper displayValue 
                    height={50} 
                    width={200} 
                    fontSize={25} 
                    initialValue={1} 
                    minimumValue={1} 
                    maximumValue={this.state.menu_details.stock_qty} 
                    borderColor={colors.border} 
                    textColor={colors.theme_fg} 
                    overrideTintColor tintColor={colors.border} 
                    borderRadius={3} 
                    onIncrement={(text) => this.addvalue(text)} 
                    onDecrement={(text) => this.decrementvalue(text)} 
                    fontFamily={colors.font_family}
                    onMaximumReached={(text) => this.maximumreached(this.state.menu_details.stock_qty)}  /> 
                </Col>
                </Row>
                </Content>
            </Row>*/}
            </Grid>
          </Content>
          {this.state.amount > 0 ? (
            <Footer style={{ backgroundColor: colors.star_icons, height: 35 }}>
              <Row onPress={this.addcart}>
                <Col style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.theme_button_fg,
                      marginTop: 5,
                      marginLeft: 10,
                      textAlign: "left",
                    }}
                  >
                    {strings.add_to_cart}
                  </Text>
                </Col>
                <Col style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.theme_button_fg,
                      marginTop: 5,
                      marginRight: 10,
                      textAlign: "right",
                    }}
                  >
                    {this.state.currency}
                    {this.state.amount}
                  </Text>
                </Col>
              </Row>
            </Footer>
          ) : null}
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
  secondblock: {
    // backgroundColor: colors.bg_two,
    width: "100%",
    // marginLeft:'5%',
    // marginRight:'5%',
    //marginTop: 10,
    // borderRadius:3,
    // borderWidth: 1,
    // borderColor:'#f0744e'
  },
  thirdblock: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: 30,
  },
  restaurantname: {
    marginLeft: 10,
    color: colors.theme_fg,
    fontSize: 16,
  },
  category_btn: {
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    marginRight: 10,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  all_categorybtn: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    borderColor: colors.star_icons,
    marginRight: 10,
    borderRadius: 0,
    //width: "100%",
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: colors.header,
    fontSize: 18,
    textAlign: "left",
    marginLeft: 5,
    fontFamily: colors.font_family_bold,
    //marginTop: 0,
    //paddingTop: 0,
    //fontWeight: "100",
  },
  price: {
    color: colors.price,
    fontSize: 14,
    textAlign: "right",
    //marginRight: 0,
    //marginBottom: 0,
    //paddingBottom: 0,
    //fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 5,
    color: colors.sub_font,
    //paddingBottom: 20,
  },
});
