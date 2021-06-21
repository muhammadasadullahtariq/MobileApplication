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
  AsyncStorage,
  StatusBar,
  Alert,
  Dimensions,
  SectionList,
  Linking,
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
  View,
  Card,
} from "native-base";
import StarRating from "react-native-star-rating";
import { Divider } from "react-native-elements";
import { Div } from "react-native-div";
import UIStepper from "react-native-ui-stepper";
import SQLite from "react-native-sqlite-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL, img_url } from "../config/Constants";
import * as colors from "../assets/css/Colors";
import Snackbar from "react-native-snackbar";
import strings from "./stringsoflanguages";
import { TouchableOpacity } from "react-native-gesture-handler";
import ScrollViewIndicator from "react-native-scroll-indicator";
import { Platform } from "react-native";

let db = SQLite.openDatabase({ name: "spotneats.db" });
let { width, height } = Dimensions.get("window");

export default class Menu extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      category: "all",
      visible: false,
      showIndicator: false,
      pressStatus: true,
      details: this.props.navigation.getParam("details"),
      from: this.props.navigation.getParam("from"),
      tax_percent: global.tax_percent,
      menu_total: 0,
      sub_total: 0,
      total: 0,
      st_qty: 0,
      food_cost: 0,
      dataSource: [],
      location_id: 0,
      menu_cnt: 0,
      currency: global.currency,
      already_qty: 0,
      user_id: 0,
      cart_length: 0,
      cart_from: null,
      cart_qty: 0,
    };
  }

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", (payload) =>
        this.componentDidFocus()
      ),
    ];
    this.setState({ showIndicator: true });
    await this.retrieveData();
    await this.first_check_sqli();
    await this.cartAlert();
  }
  async componentDidFocus() {
    // this.setState({ showIndicator: true });
    this.setState({
      details: this.props.navigation.getParam("details"),
      from: this.props.navigation.getParam("from"),
    });
    // await this.retrieveData();
    await this.check_sqli();
    // await this.cartAlert();
  }

  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      if (this.state.from == "TableBooking") {
        await AsyncStorage.getItem("from").then((value) => {
          this.setState({ cart_from: value });
        });
      }
      if (user_id !== null) {
        this.setState({ user_id: user_id });
      }
    } catch (error) {}
  };

  // retrieveData = async () => {
  //   try {
  //     const user_id = await AsyncStorage.getItem("user_id");
  //     if (user_id !== null) {
  //       this.setState({ user_id: user_id });
  //     }
  //   } catch (error) {}
  // };

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
      price += main_cart[i].price;
    }

    for (let i = 0; i < sub_cart.length; i++) {
      price += sub_cart[i].price;
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
            resolve(results);
          }
        );
      });
    });
  };

  async first_check_sqli() {
    await db.transaction((tx) => {
      var temp = [];
      var self = this;

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cart(SUBID INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0, main_cart_id BIGINT NOT NULL" +
          ", FOREIGN KEY (main_cart_id) REFERENCES main_cart(ID) ON DELETE CASCADE ON UPDATE NO ACTION)",

        []
      );

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
            await self.setState({ food_cost: 0 });
            //self.setState({ showIndicator: false });
            results.rows.length == 0;
            return false;
          }

          if (results.rows.length > 0) {
            if (
              results.rows.item(0).location_id != self.state.details.location_id
            ) {
              //self.setState({ showIndicator: false });
            } else {
              for (let i = 0; i < results.rows.length; i++) {
                await temp.push(results.rows.item(i));
                foodcst = foodcst + results.rows.item(i).menu_total;
                location_id = results.rows.item(i).location_id;
                let sub_results = await self.get_sub_cart(
                  results.rows.item(i).ID
                );
                for (let j = 0; j < sub_results.rows.length; j++) {
                  temp.push(sub_results.rows.item(j));
                  foodcst = foodcst + sub_results.rows.item(j).menu_total;
                }
              }
              await self.setState({
                dataSource: temp,
                location_id: location_id,
                food_cost: parseFloat(foodcst).toFixed(2),
                //showIndicator: false,
              });
            }
            //self.setState({showIndicator:false});
          } else {
            //self.setState({ showIndicator: false });
          }
        }
      );
      //self.setState({ showIndicator: false });
    });
  }

  async check_sqli() {
    await db.transaction((tx) => {
      var temp = [];
      var self = this;
      tx.executeSql(
        "SELECT * FROM main_cart",
        [],
        async function (txn, results) {
          var foodcst = 0;
          var cart_qty = 0;
          if (
            results.rows.length > 0 &&
            self.state.user_id != results.rows.item(0).user_id
          ) {
            tx.executeSql("Delete FROM main_cart", [], (tx, results) => {
              //console.log("Results", results.rowsAffected);
            });
            await self.setState({ food_cost: 0 });
            await self.setState({ cart_qty: 0 });
            //self.setState({ showIndicator: false });
            results.rows.length == 0;
            return false;
          }

          if (results.rows.length > 0) {
            if (
              results.rows.item(0).location_id != self.state.details.location_id
            ) {
              self.setState({ showIndicator: false });
              //console.log("Not Same!!!!!!!!!!!", results.rows.length)
            } else {
              for (let i = 0; i < results.rows.length; i++) {
                await temp.push(results.rows.item(i));
                foodcst = foodcst + results.rows.item(i).menu_total;
                location_id = results.rows.item(i).location_id;
                cart_qty = cart_qty + results.rows.item(i).qty;
                let sub_results = await self.get_sub_cart(
                  results.rows.item(i).ID
                );
                for (let j = 0; j < sub_results.rows.length; j++) {
                  temp.push(sub_results.rows.item(j));
                  foodcst = foodcst + sub_results.rows.item(j).menu_total;
                }
              }
              await self.setState({
                dataSource: temp,
                location_id: location_id,
                food_cost: parseFloat(foodcst).toFixed(2),
                showIndicator: false,
                cart_qty: cart_qty,
              });
            }
            //self.setState({showIndicator:false});
          } else {
            self.setState({ showIndicator: false });
          }
        }
      );
      self.setState({ showIndicator: false });
    });
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
    // console.log("key==> ", this.props.navigation.state.key);
    if (this.state.from == "Login")
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
    else {
      // const resetAction = StackActions.reset({
      //   index: ,
      //   key:this.props.navigation.state.key,
      //   actions: [NavigationActions.navigate({ routeName: "RestaurantList" })],
      // });
      // this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate("RestaurantList");
      // this.props.navigation.dispatch(
      //   StackActions.reset({
      //     index: 0,
      //     actions: [
      //       NavigationActions.navigate({
      //         routeName: "RestaurantList",
      //       }),
      //     ],
      //   })
      // );
    }
    // this.props.navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'RestaurantList' }],
    // });
    // this.props.navigation.dispatch(
    //   StackActions.reset({
    //     index: 1,
    //     actions: [
    //       NavigationActions.navigate({
    //         routeName: "RestaurantList",
    //       }),
    //     ],
    //   })
    // );
    return true;
  }

  optionspage(menu_options, alcohol_status, qty, menu_stock) {
    if (menu_stock <= qty) {
      this.showSnackbar(strings.only + strings.quantity_available);
    } else {
      this.props.navigation.navigate("MenuOption", {
        menu_details: menu_options,
        location_name: this.state.details.location_name,
        details: this.state.details,
        currency: this.state.currency,
        user_id: this.state.user_id,
        alcohol_status: alcohol_status,
      });
    }
  }

  mapNavigate() {
    this.props.navigation.navigate("ViewMap", { details: this.state.details });
    //this.setState({showIndicator:true});
  }

  table_book = () => {
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
      this.props.navigation.navigate("TableBooking", {
        details: this.state.details,
        from: "restaurant_details",
      });
    }
  };

  cartAlert() {
    var self = this;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS main_cart(ID INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0)",

        []
      );
      //console.log("CART CHECK 1")

      tx.executeSql(
        "SELECT * FROM main_cart",
        [],
        async function (txn, results) {
          if (
            results.rows.length > 0 &&
            (results.rows.item(0).location_id !=
              self.state.details.location_id ||
              self.state.user_id != results.rows.item(0).user_id)
          ) {
            //console.log("CART CHECK 2")

            Alert.alert(
              "Start a new order?",
              "Your cart already has items from a different outlet. If you pick items from this menu, your existing cart will be cleared.",
              [
                {
                  text: "Go to Cart",
                  onPress: () => self.viewcart(),
                  style: "cancel",
                },
                { text: "OK" },
              ],
              { cancelable: false }
            );
          } else {
          }
        }
      );
    });
  }

  handleChange(
    qty,
    menu_id,
    menu_name,
    menu_photo,
    menu_price,
    stock,
    option_id,
    alcohol_status
  ) {
    if (qty == 0) {
      this.removecart(menu_id, option_id);
    } else {
      this.addcart(
        qty,
        menu_id,
        menu_name,
        menu_photo,
        menu_price,
        stock,
        alcohol_status
      );
    }
  }

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
          "SELECT * FROM main_cart",
          [],
          async function (txn, results) {
            await self.setState({
              cart_length: results.rows.length,
            });
          }
        );
      });
      //alert(this.state.cart_length);
      await this.props.navigation.navigate("TableBooking", {
        details: this.state.details,
        currency: this.state.currency,
        tax_percent: this.state.tax_percent,
        cart_length: this.state.cart_length,
      });
    } else {
      //console.log("CARTFROMMENUDETAILS!!!!", this.state.details);
      AsyncStorage.setItem("from", "Menu");
      this.props.navigation.navigate("Cart", {
        details: this.state.details,
        currency: this.state.currency,
        tax_percent: this.state.tax_percent,
        showIndicator: true,
        from: "Menu",
      });
    }
  };
  maximumreached = (qty) => {
    this.showSnackbar(strings.only + strings.quantity_available);
  };
  addvalue = async (price, menu_options, qty) => {
    var foocst = (parseFloat(this.state.food_cost) + parseFloat(price)).toFixed(
      2
    );
    var qt = this.state.cart_qty + 1;

    //var iqt = this.state.details.categories[key].menu_items[menu_key].qty

    await this.setState({ food_cost: foocst });
    await this.setState({ cart_qty: qt });
    //optionspage(val.menu_items[menu_key])
  };
  decrementvalue = async (price) => {
    var foocst = (parseFloat(this.state.food_cost) - parseFloat(price)).toFixed(
      2
    );
    var qt = this.state.cart_qty - 1;

    await this.setState({ cart_qty: qt });
    await this.setState({ food_cost: foocst });
  };

  removecart = (menu_id, option_id) => {
    var self = this;
    db.transaction((tx) => {
      if (option_id) {
        tx.executeSql(
          "Delete FROM main_cart where menu_id=? and option_id=?",
          [menu_id, option_id],
          (tx, results) => {
            //console.log("Results", results.rowsAffected);
          }
        );
      } else {
        tx.executeSql(
          "Delete FROM main_cart where menu_id=?",
          [menu_id],
          (tx, results) => {
            //console.log("Results", results.rowsAffected);
          }
        );
      }
    });
  };
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  reviewpage = () => {
    this.props.navigation.navigate("Review", { details: this.state.details });
  };

  check_exists_menu = (key, menu_key, menu_id) => {
    db.transaction((tx) => {
      var self = this;
      if (this.state.cart_from == "Menu") {
        tx.executeSql("Delete from main_cart");
      }
      tx.executeSql(
        "SELECT sum(qty) as menu_qty,* FROM main_cart where menu_id=? group by menu_id",
        [menu_id],
        async function (txn, results) {
          if (
            results.rows.length > 0 &&
            results.rows.item(0).location_id ==
              self.state.details.location_id &&
            self.state.user_id == results.rows.item(0).user_id
          ) {
            self.state.details.categories[key].menu_items[menu_key].qty =
              results.rows.item(0).menu_qty;
            //await self.setState({ already_qty : results.rows.item(0).menu_qty});
            //console.log('afr'+self.state.already_qty);
          } else {
            self.state.details.categories[key].menu_items[menu_key].qty = 0;
          }
        }
      );
    });
  };

  addcart = (
    qty,
    menu_id,
    menu_name,
    menu_image,
    price,
    stock,
    alcohol_status
  ) => {
    this.setState({ menu_total: qty * price });
    // console.log("S QTY", stock)
    //console.log("QTY", qty)

    var self = this;

    var locationname = self.state.details.location_name;
    var locationname = locationname.replace("'", "''");
    var menuname = menu_name;
    var menuname = menuname.replace("'", "''");
    var menudesc = self.state.details.description;
    var menudesc = menudesc.replace("'", "''");

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS main_cart(ID INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,location_name VARCHAR(30),unique_id INTEGER NULL,menu_id INTEGER NOT NULL,menu_name  VARCHAR(50),menu_image  VARCHAR(900),option_id INTEGER NULL,option_name  VARCHAR(50),option_value_id INTEGER NULL,option_value_name  VARCHAR(50),qty INTEGER NOT NULL,price DOUBLE NOT NULL,menu_total DOUBLE NOT NULL,menu_options TEXT,stock_qty INTEGER NOT NULL,location_description TEXT,all_tax VARCHAR(30),taxes TEXT,alcohol_status INTEGER NOT NULL DEFAULT 0)",

        []
      );

      tx.executeSql(
        "SELECT * FROM main_cart",
        [],
        async function (txn, results) {
          if (
            results.rows.length > 0 &&
            (results.rows.item(0).location_id !=
              self.state.details.location_id ||
              self.state.user_id != results.rows.item(0).user_id)
          ) {
            await tx.executeSql("Delete from main_cart");
            await this.setState({ food_cost: 0 });
          }
        }
      );

      tx.executeSql(
        "SELECT sum(qty) as menu_qty,* FROM main_cart where menu_id=? group by menu_id",
        [menu_id],
        function (txn, results) {
          if (results.rows.length > 0) {
            //alert(results.rows.item(0).menu_qty);
            // up_qty = results.rows.item(0).menu_qty + 1;
            self.setState({ menu_total: qty * price });
            //self.setState({food_cost : up_qty * price});
            //txn.executeSql("select * from main_cart");
            tx.executeSql(
              "UPDATE main_cart set qty='" +
                qty +
                "',menu_total='" +
                self.state.menu_total +
                "' where menu_id='" +
                menu_id +
                "'"
            );
          } else {
            tx.executeSql(
              "INSERT INTO main_cart (user_id,location_id,location_name,menu_id,menu_name,menu_image,qty,price,menu_total,stock_qty,location_description,all_tax,taxes,alcohol_status) VALUES ('" +
                self.state.user_id +
                "','" +
                self.state.details.location_id +
                "','" +
                locationname +
                "','" +
                menu_id +
                "','" +
                menuname +
                "','" +
                menu_image +
                "','" +
                qty +
                "','" +
                price +
                "','" +
                self.state.menu_total +
                "','" +
                stock +
                "','" +
                menudesc +
                "','" +
                self.state.details.overall_tax +
                "','" +
                JSON.stringify(self.state.details.taxes) +
                "','" +
                alcohol_status +
                "')"
            );
          }
        }
      );
    });
  };

  MenuItem = ({ val, key, menu_key, menu_val }) => {
    //this.check_exists_menu(key, menu_key, menu_val.menu_id);
    return (
      <Row>
        <Content style={{ paddingBottom: 5 }}>
          <Row
            style={{
              elevation: 0,
              // shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0,
              // shadowColor: colors.shadow,
              // borderColor: colors.divider,
              // borderRadius: 6,
              // borderWidth: 0.7,
              marginBottom: 5,
              backgroundColor: colors.theme_button_fg,
            }}
          >
            <Col style={{ width: "25%" }}>
              <Thumbnail
                style={{
                  width: "95%",
                  height: 75,
                  borderRadius: 5,
                }}
                square
                source={{ uri: img_url + menu_val.menu_photo }}
              />
            </Col>

            <Col
              style={{
                height: "100%",
                justifyContent: "space-between",
                marginTop: 0,
              }}
            >
              <Text style={styles.name}>{menu_val.menu_name}</Text>
              <Text style={styles.description}>
                {menu_val.menu_description}
              </Text>
              {menu_val.menus_options.length == 0 ? (
                <Text style={styles.price}>
                  {this.state.currency + "" + menu_val.menu_price}
                </Text>
              ) : (
                <Text style={styles.price}>
                  {this.state.currency +
                    "" +
                    //menu_val.menus_options[0].option_values[0].price
                    menu_val.menu_price}
                </Text>
              )}
            </Col>
            <Col
              style={{
                width: "30%",
                alignItems: "center",
                // alignContent: "center",
                justifyContent: "center",
                marginHorizontal: 1,
              }}
            >
              {/* <Div style={{ marginTop: "20%" }}></Div> */}
              {menu_val.menus_options.length == 0 ? (
                <UIStepper
                  displayValue
                  height={25}
                  width={80}
                  alignItems="center"
                  initialValue={
                    this.state.details.categories[key].menu_items[menu_key].qty
                  }
                  fontSize={14}
                  borderColor={colors.tint_col}
                  textColor={colors.theme_fg}
                  overrideTintColor
                  tintColor={colors.theme_fg}
                  borderRadius={5}
                  marginRight={10}
                  minimumValue={0}
                  maximumValue={menu_val.stock_qty}
                  fontFamily={colors.font_family}
                  onValueChange={(text) =>
                    this.handleChange(
                      text,
                      menu_val.menu_id,
                      menu_val.menu_name,
                      menu_val.menu_photo,
                      menu_val.menu_price,
                      menu_val.stock_qty,
                      menu_val.option_id,
                      val.alcohol_status
                    )
                  }
                  onIncrement={(text) =>
                    this.addvalue(menu_val.menu_price, val.menu_items[menu_key])
                  }
                  onDecrement={(text) =>
                    this.decrementvalue(
                      menu_val.menu_price,
                      val.menu_items[menu_key]
                    )
                  }
                  onMaximumReached={(text) =>
                    this.maximumreached(menu_val.stock_qty)
                  }
                />
              ) : (
                <Icon
                  onPress={(text) =>
                    this.optionspage(
                      val.menu_items[menu_key],
                      val.alcohol_status
                    )
                  }
                  style={{
                    height: 27.5,
                    width: 27.5,
                    color: colors.theme_fg,
                    paddingTop: 0.5,
                    paddingLeft: 1.1,
                    fontSize: 24,
                    borderWidth: 1,
                    borderColor: colors.tint_col,
                    borderRadius: 5,
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  name="add"
                />
              )}
            </Col>
          </Row>
          <Divider
            style={{
              backgroundColor: "white", //colors.divider,
              marginBottom: 5,
              marginTop: 5,
              paddingHorizontal: 10,
            }}
          />
        </Content>
      </Row>
    );
  };
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
                      fontFamily: colors.font_family,
                      fontSize: 14,
                      textDecorationLine: "underline",
                    }}
                    onPress={() => this.reviewpage()}
                  >
                    {strings.view_all}
                  </Text>
                </Right>
              </Row>
              <Divider style={{ backgroundColor: colors.tint_col }} />
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

    let categories = this.state.details.categories.map((val, key) => {
      return (
        <TouchableOpacity
          style={
            this.state.category == val.category_id
              ? styles.all_categorybtn
              : styles.category_btn
          }
          onPress={() => {
            this.setState({ category: val.category_id, pressStatus: false });
          }}
        >
          <Text
            style={{
              // marginLeft: 5,
              // marginRight: 5,
              fontSize: 12,
              padding: 10,
              color:
                this.state.category == val.category_id
                  ? colors.theme_button_fg
                  : null,
            }}
          >
            {val.name}
          </Text>
        </TouchableOpacity>
      );
    });

    let section_list_datas = [];

    for (let i = 0; i < this.state.details.categories.length; i++) {
      let val = this.state.details.categories[i];
      let key = i;
      if (
        this.state.category == "all" ||
        this.state.category == val.category_id
      ) {
        let menus = [];
        for (let j = 0; j < val.menu_items.length; j++) {
          let menu_val = val.menu_items[j];
          let menu_key = j;
          this.check_exists_menu(key, menu_key, menu_val.menu_id);
          menus.push({
            menu: menu_val,
            menu_key: menu_key,
            val: val,
            key: key,
          });
        }
        if (menus.length > 0) {
          section_list_datas.push({ category: val, c_key: key, data: menus });
        }
      }
    }

    this.state.details.categories.map((val, key) => {
      if (
        this.state.category == "all" ||
        this.state.category == val.category_id
      ) {
        let menus = val.menu_items.map((menu_val, menu_key) => {
          this.check_exists_menu(key, menu_key, menu_val.menu_id);
          return { menu: menu_val, menu_key: menu_key, val: val, key: key };
        });
        return { category: val, c_key: key, data: menus };
      }
    });

    //console.log('Section List Datas = ', section_list_datas);
    // let menus = this.state.details.categories.map((val, key) => {
    //   if (
    //     this.state.category == "all" ||
    //     this.state.category == val.category_id
    //   ) {
    //     let menu = val.menu_items.map((menu_val, menu_key) => {
    //       this.check_exists_menu(key, menu_key, menu_val.menu_id);
    //       return (
    //         <Row>
    //           <Content style={{ paddingBottom: 5 }}>
    //             <Row
    //               style={{
    //                 elevation: 0,
    //                 // shadowOffset: { height: 0, width: 0 },
    //                 shadowOpacity: 0,
    //                 // shadowColor: colors.shadow,
    //                 // borderColor: colors.divider,
    //                 // borderRadius: 6,
    //                 // borderWidth: 0.7,
    //                 marginBottom: 5,
    //                 backgroundColor: colors.theme_button_fg,
    //               }}
    //             >
    //               <Col style={{ width: "25%" }}>
    //                 <Thumbnail
    //                   style={{
    //                     width: "95%",
    //                     height: 75,
    //                     borderRadius: 5,
    //                   }}
    //                   square
    //                   source={{ uri: img_url + menu_val.menu_photo }}
    //                 />
    //               </Col>

    //               <Col
    //                 style={{
    //                   height: "100%",
    //                   justifyContent: "space-between",
    //                   marginTop: 0,
    //                 }}
    //               >
    //                 <Text style={styles.name}>{menu_val.menu_name}</Text>
    //                 <Text style={styles.description}>
    //                   {menu_val.menu_description}
    //                 </Text>
    //                 {menu_val.menus_options.length == 0 ? (
    //                   <Text style={styles.price}>
    //                     {this.state.currency + "" + menu_val.menu_price}
    //                   </Text>
    //                 ) : (
    //                   <Text style={styles.price}>
    //                     {this.state.currency +
    //                       "" +
    //                       //menu_val.menus_options[0].option_values[0].price
    //                       menu_val.menu_price}
    //                   </Text>
    //                 )}
    //               </Col>
    //               <Col
    //                 style={{
    //                   width: "30%",
    //                   alignItems: "center",
    //                   // alignContent: "center",
    //                   justifyContent: "center",
    //                   marginHorizontal: 1,
    //                 }}
    //               >
    //                 {/* <Div style={{ marginTop: "20%" }}></Div> */}
    //                 {menu_val.menus_options.length == 0 ? (
    //                   <UIStepper
    //                     displayValue
    //                     height={25}
    //                     width={80}
    //                     alignItems="center"
    //                     initialValue={
    //                       this.state.details.categories[key].menu_items[
    //                         menu_key
    //                       ].qty
    //                     }
    //                     fontSize={14}
    //                     borderColor={colors.tint_col}
    //                     textColor={colors.theme_fg}
    //                     overrideTintColor
    //                     tintColor={colors.theme_fg}
    //                     borderRadius={5}
    //                     marginRight={10}
    //                     minimumValue={0}
    //                     maximumValue={menu_val.stock_qty}
    //                     fontFamily={colors.font_family}
    //                     onValueChange={(text) =>
    //                       this.handleChange(
    //                         text,
    //                         menu_val.menu_id,
    //                         menu_val.menu_name,
    //                         menu_val.menu_photo,
    //                         menu_val.menu_price,
    //                         menu_val.stock_qty,
    //                         menu_val.option_id,
    //                         val.alcohol_status
    //                       )
    //                     }
    //                     onIncrement={(text) =>
    //                       this.addvalue(
    //                         menu_val.menu_price,
    //                         val.menu_items[menu_key]
    //                       )
    //                     }
    //                     onDecrement={(text) =>
    //                       this.decrementvalue(
    //                         menu_val.menu_price,
    //                         val.menu_items[menu_key]
    //                       )
    //                     }
    //                     onMaximumReached={(text) =>
    //                       this.maximumreached(menu_val.stock_qty)
    //                     }
    //                   />
    //                 ) : (
    //                   <Icon
    //                     onPress={(text) =>
    //                       this.optionspage(
    //                         val.menu_items[menu_key],
    //                         val.alcohol_status
    //                       )
    //                     }
    //                     style={{
    //                       // marginLeft: "25%",
    //                       height: 27.5,
    //                       width: 27.5,
    //                       // marginTop: "10%",
    //                       color: colors.theme_fg,
    //                       // width: 30,
    //                       paddingTop: 0.5,
    //                       paddingLeft: 1.1,
    //                       fontSize: 24,
    //                       borderWidth: 1,
    //                       borderColor: colors.tint_col,
    //                       borderRadius: 5,
    //                       textAlign: "center",
    //                       alignItems: "center",
    //                       justifyContent: "center",
    //                     }}
    //                     name="add"
    //                   />
    //                 )}
    //               </Col>
    //             </Row>
    //             <Divider
    //               style={{
    //                 backgroundColor: "white", //colors.divider,
    //                 marginBottom: 5,
    //                 marginTop: 5,
    //                 paddingHorizontal: 10,
    //               }}
    //             />
    //           </Content>
    //         </Row>
    //       );
    //     });
    //     return menu;
    //   }
    // });
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
                <Text>{this.state.details.location_name}</Text>
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
                <Text>{this.state.details.location_name}</Text>
              </Title>
            </Body>
            <Right></Right>
          </Header>
          <ScrollViewIndicator
            //scrollIndicatorStyle={{color: colors.tint_col}}
            flexibleIndicator={false}
            indicatorHeight={50}
            scrollIndicatorStyle={{
              backgroundColor: colors.theme_fg,
              width: 4,
            }}
            hideTimeout={250}
          >
            <Content>
              <Row>
                <Thumbnail
                  style={{
                    width: "100%",
                    height: height * 0.3,
                    borderBottomLeftRadius: 2,
                    borderBottomRightRadius: 2,
                  }}
                  square
                  source={{ uri: img_url + this.state.details.profile_image }}
                />
              </Row>
              <Card style={styles.firstblock}>
                <Row>
                  <Left>
                    <Text style={styles.restaurantname}>
                      {this.state.details.location_name}
                    </Text>
                  </Left>
                  {/*<Right style={{ marginRight:10 }} ><Button danger style={styles.ratingbtn} ><Text style={{ fontSize:10, marginLeft:5, marginRight:5, color:colors.theme_button_fg }}><Icon style={{ fontSize:13 }} name='star' />{parseFloat(this.state.details.location_ratings).toFixed(1)}</Text></Button></Right>*/}
                  {this.state.details.review_count != 0 ? (
                    <Right>
                      <Div style={styles.ratingbtn}>
                        <Text
                          style={{
                            fontSize: 12,
                            marginLeft: 5,
                            marginRight: 5,
                            color: colors.star_icons,
                            fontFamily: colors.font_family,
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
                    {this.state.details.location_city}
                    {/* ,{" "}
                    {this.state.details.location_state},{" "}
                    {this.state.details.location_postcode},{" "}
                    {this.state.details.location_country}{" "} */}
                  </Text>
                </Row>
                {/* <Row>
                  <Left>
                    <Text
                      style={{
                        marginLeft: 0,
                        color: colors.header,
                        fontSize: 14,
                        fontFamily: colors.font_family,
                        fontWeight: "bold",
                      }}
                    >
                      {strings.about_restaurant}
                    </Text>
                  </Left>
                  <Right style={{ marginRight: 10 }}></Right>
                </Row> */}
                <Row>
                  <Text style={styles.detail}>
                    {this.state.details.description}
                  </Text>
                </Row>
                <Row
                  style={{
                    alignItems: "space-between",
                    justifyContent: "center",
                  }}
                >
                  <Body>
                    <Row>
                      <Col
                        //style={styles.contentboxItem}
                        onPress={() => this.mapNavigate()}
                      >
                        <Row
                          style={{
                            alignItems: "center",
                            justifyContent: "flex-start",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            style={{ fontSize: 18, color: colors.location }}
                            name="ios-pin"
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.sub_font,
                              fontFamily: colors.font_family,
                            }}
                          >
                            {"  "}
                            {strings.location}
                          </Text>
                        </Row>
                      </Col>
                      <Col
                        style={{
                          alignItems:
                            this.state.details.location_type == "restaurant"
                              ? null
                              : "flex-end",
                          marginRight:
                            this.state.details.location_type != "restaurant"
                              ? 5
                              : null,
                        }}
                        //style={styles.contentboxItem}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${this.state.details.location_telephone}`
                          )
                        }
                      >
                        <Row
                          style={{
                            alignItems:
                              this.state.details.location_type == "restaurant"
                                ? "center"
                                : "flex-end",
                            justifyContent: "flex-start",
                            flexDirection: "row",
                          }}
                        >
                          <Icon
                            style={{
                              fontSize: 18,
                              color:
                                this.state.details.location_type == "restaurant"
                                  ? colors.theme_fg
                                  : colors.star_icons,
                            }}
                            name="call"
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.sub_font,
                              fontFamily: colors.font_family,
                            }}
                          >
                            {"  "}
                            {strings.contact}
                          </Text>
                        </Row>
                      </Col>
                      {this.state.details.location_type == "restaurant" ? (
                        <Col>
                          <Row
                            style={{
                              alignItems: "center",
                              justifyContent: "flex-end",
                              flexDirection: "row",
                            }}
                          >
                            <Button
                              block
                              bordered
                              warning
                              onPress={this.table_book}
                              style={{
                                borderWidth: 0.2,
                                // justifyContent: "center",
                                // borderRadius: 5,
                                // alignItems: "center",
                                height: 30,
                                width: 100,
                                // backgroundColor: "white",
                                // borderColor: colors.star_icons,
                                elevation: 0,
                                shadowOpacity: 0,
                                borderRadius: 5,
                                // padding:3,
                                // margin:2
                              }}
                            >
                              <Text
                                style={{
                                  color: colors.star_icons,
                                  fontFamily: colors.font_family,
                                }}
                              >
                                Book a Table
                              </Text>
                            </Button>
                          </Row>
                        </Col>
                      ) : null}
                    </Row>
                    {/* </Div> */}
                  </Body>
                </Row>

                {/* <Row style={styles.gallery}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                  >
                    {gallery}
                  </ScrollView>
                </Row> */}
                {/* <Row style={styles.actionbuttons}>
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
                </Row> */}
              </Card>
              <Row style={{ marginLeft: 10, marginRight: 0 }}>
                <Content style={{ paddingTop: 10, paddingBottom: 20 }}>
                  <Row>
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      style={{
                        backgroundColor: colors.header,
                        paddingHorizontal: 10,
                        paddingVertical: 0,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <Icon
                          style={{
                            color: colors.theme_button_fg,
                            fontSize: 24,
                            marginLeft: 0,
                            fontFamily: colors.font_family,
                          }}
                          name="menu"
                        />
                        <Text
                          style={{
                            color: "#fff",
                            marginLeft: 5,
                            marginRight: 10,
                            fontSize: 15,
                            fontFamily: colors.font_family_bold,
                          }}
                        >
                          Menu
                        </Text>
                        <TouchableOpacity
                          style={[
                            this.state.pressStatus
                              ? styles.all_categorybtn
                              : styles.category_btn,
                            {
                              borderTopLeftRadius: 5,
                              borderBottomLeftRadius: 5,
                            },
                          ]}
                          onPress={() => {
                            this.setState({
                              category: "all",
                              pressStatus: true,
                            });
                          }}
                        >
                          <Text
                            style={{
                              marginLeft: 10,
                              marginRight: 10,
                              fontSize: 12,
                              padding: 10,
                              fontFamily: colors.font_family,
                              color: this.state.pressStatus
                                ? colors.theme_button_fg
                                : null,
                            }}
                          >
                            {strings.all_categories}
                          </Text>
                        </TouchableOpacity>
                        {categories}
                      </View>
                    </ScrollView>
                  </Row>
                </Content>
              </Row>
              {/* {menus} */}
              <Content
                style={{
                  marginBottom: 0,
                  marginTop: 0,
                  marginRight: 10,
                  marginLeft: 10,
                }}
              >
                <SectionList
                  sections={section_list_datas}
                  keyExtractor={(item, index) => item.c_key + index}
                  renderItem={({ item }) => {
                    let val = item.val;
                    let key = item.key;
                    let menu_val = item.menu;
                    let menu_key = item.menu_key;
                    //console.log('zzz');
                    //console.log('Menu Key = ', menu_key)
                    return (
                      <Row>
                        <Content style={{ paddingBottom: 5 }}>
                          <Row
                            style={{
                              elevation: 0,
                              // shadowOffset: { height: 0, width: 0 },
                              shadowOpacity: 0,
                              // shadowColor: colors.shadow,
                              // borderColor: colors.divider,
                              // borderRadius: 6,
                              // borderWidth: 0.7,
                              marginBottom: 5,
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
                                source={{ uri: img_url + menu_val.menu_photo }}
                              />
                            </Col>

                            <Col
                              style={{
                                height: "100%",
                                justifyContent: "space-between",
                                marginTop: 0,
                              }}
                            >
                              <Text style={styles.name}>
                                {menu_val.menu_name}
                              </Text>
                              <Text style={styles.description}>
                                {menu_val.menu_description}
                              </Text>
                              {menu_val.menus_options.length == 0 ? (
                                <Text style={styles.price}>
                                  {this.state.currency +
                                    "" +
                                    menu_val.menu_price}
                                </Text>
                              ) : (
                                <Text style={styles.price}>
                                  {this.state.currency +
                                    "" +
                                    //menu_val.menus_options[0].option_values[0].price
                                    menu_val.menu_price}
                                </Text>
                              )}
                            </Col>
                            <Col
                              style={{
                                width: "15%",
                                alignItems: "flex-end",
                                // alignContent: "center",
                                justifyContent: "center",
                                marginHorizontal: 1,
                              }}
                            >
                              {/* <Div style={{ marginTop: "20%" }}></Div> */}
                              {menu_val.menus_options.length == 0 ? (
                                <UIStepper
                                  displayValue
                                  height={15}
                                  width={55}
                                  alignItems="center"
                                  justifyContent="center"
                                  initialValue={
                                    this.state.details.categories[key]
                                      .menu_items[menu_key].qty
                                  }
                                  fontSize={14}
                                  vertical={true}
                                  // displayDecrementFirst={true}
                                  borderColor={colors.tint_col}
                                  textColor={colors.theme_fg}
                                  overrideTintColor
                                  tintColor={colors.tint_col}
                                  borderRadius={5}
                                  marginTop={5}
                                  minimumValue={0}
                                  maximumValue={menu_val.stock_qty}
                                  fontFamily={colors.font_family}
                                  onValueChange={(text) =>
                                    this.handleChange(
                                      text,
                                      menu_val.menu_id,
                                      menu_val.menu_name,
                                      menu_val.menu_photo,
                                      menu_val.menu_price,
                                      menu_val.stock_qty,
                                      menu_val.option_id,
                                      val.alcohol_status
                                    )
                                  }
                                  onIncrement={(text) =>
                                    this.addvalue(
                                      menu_val.menu_price,
                                      val.menu_items[menu_key],
                                      this.state.details.categories[key]
                                        .menu_items[menu_key].qty
                                    )
                                  }
                                  onDecrement={(text) =>
                                    this.decrementvalue(
                                      menu_val.menu_price,
                                      val.menu_items[menu_key],
                                      this.state.details.categories[key]
                                        .menu_items[menu_key].qty
                                    )
                                  }
                                  onMaximumReached={(text) =>
                                    this.maximumreached(menu_val.stock_qty)
                                  }
                                />
                              ) : this.state.details.categories[key].menu_items[
                                  menu_key
                                ].qty > 0 ? (
                                <View
                                  style={{
                                    flex: 1,
                                    position: "absolute",
                                    height: "100%",
                                    width: "100%",
                                    alignItems: "flex-end",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Icon
                                    onPress={(text) =>
                                      this.optionspage(
                                        val.menu_items[menu_key],
                                        val.alcohol_status,
                                        this.state.details.categories[key]
                                          .menu_items[menu_key].qty,
                                        menu_val.stock_qty
                                      )
                                    }
                                    style={{
                                      //marginBottom: 10,
                                      position: "absolute",
                                      height: 27.5,
                                      width: 27.5,
                                      // marginTop: "10%",
                                      color: colors.tint_col,
                                      // width: 30,
                                      paddingTop:
                                        Platform.OS === "android" ? 1.4 : 0,
                                      paddingLeft:
                                        Platform.OS === "android" ? 2.5 : 1.5,
                                      fontSize: 25,
                                      borderWidth: 1,
                                      borderColor: colors.tint_col,
                                      borderRadius: 5,
                                      //alignSelf:"center",
                                      //justifySelf:"center",
                                      textAlign: "center",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    name="add"
                                  />
                                  <Text
                                    style={{
                                      position: "relative",
                                      top: 20,
                                      //marginLeft: -3,
                                      height: 11,
                                      width: 11,
                                      marginTop: -70,
                                      color: colors.star_icons,
                                      // width: 30,
                                      paddingTop: 0.5,
                                      fontSize: 7,
                                      borderWidth: 1,
                                      borderColor: colors.star_icons,
                                      borderRadius: 3,
                                      textAlign: "center",
                                      //position: "absolute",
                                      //alignItems: "center",
                                      //justifyContent: "flex-end",
                                      zIndex: 10,
                                      backgroundColor: "#FFFF",
                                    }}
                                  >
                                    {
                                      this.state.details.categories[key]
                                        .menu_items[menu_key].qty
                                    }
                                  </Text>
                                </View>
                              ) : (
                                <Icon
                                  onPress={(text) =>
                                    this.optionspage(
                                      val.menu_items[menu_key],
                                      val.alcohol_status,
                                      this.state.details.categories[key]
                                        .menu_items[menu_key].qty,
                                      menu_val.stock_qty
                                    )
                                  }
                                  style={{
                                    marginLeft: 0,
                                    height: 27.5,
                                    width: 27.5,
                                    // marginTop: "10%",
                                    color: colors.tint_col,
                                    // width: 30,
                                    paddingTop:
                                      Platform.OS === "android" ? 1.4 : 0,
                                    paddingLeft:
                                      Platform.OS === "android" ? 2.5 : 1.5,
                                    fontSize: 25,
                                    borderWidth: 1,
                                    borderColor: colors.tint_col,
                                    borderRadius: 5,
                                    textAlign: "center",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  name="add"
                                />
                              )}
                            </Col>
                          </Row>
                          <Divider
                            style={{
                              backgroundColor: "white", //colors.divider,
                              marginBottom: 5,
                              marginTop: 5,
                              paddingHorizontal: 10,
                            }}
                          />
                        </Content>
                      </Row>
                    );
                  }}
                  renderSectionHeader={({ section }) => {
                    //console.log('Section Item = ', section)
                    return (
                      <Div w="100%" style={styles.section_header}>
                        <Text style={styles.section_header_text}>
                          {section.category.name}
                        </Text>
                      </Div>
                    );
                  }}
                  keyExtractor={(item, index) => item.menu_key + item.key}
                />
              </Content>
            </Content>
          </ScrollViewIndicator>
          {this.state.food_cost > 0 ? (
            <Footer style={{ backgroundColor: colors.theme_fg, height: 35 }}>
              <Row
                tyle={{ alignItems: "space-between" }}
                onPress={async () => await this.viewcart()}
              >
                <Col style={{}}>
                  <Col
                    style={{
                      //width: "40%",
                      //height: "20%",
                      marginVertical: 3,
                      marginHorizontal: 10,
                    }}
                  >
                    <Button small style={styles.btn}>
                      <Text
                        style={{
                          marginLeft: 7,
                          marginRight: 7,
                          fontSize: 16,
                          color: colors.theme_button_fg,
                          fontFamily: colors.font_family,
                        }}
                      >
                        {this.state.cart_qty}
                      </Text>
                    </Button>
                  </Col>
                </Col>
                <Col style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.theme_button_fg,
                      marginTop: 5,
                      marginLeft: 10,
                      textAlign: "left",
                      fontFamily: colors.font_family,
                    }}
                  >
                    {strings.view_cart}
                  </Text>
                </Col>
                <Col style={{}}>
                  <Text
                    id="cart_total"
                    style={{
                      fontSize: 16,
                      color: colors.theme_button_fg,
                      marginTop: 5,
                      paddingRight: 10,
                      textAlign: "right",
                      fontFamily: colors.font_family,
                    }}
                  >
                    {this.state.currency + "" + this.state.food_cost}
                  </Text>
                </Col>
              </Row>
            </Footer>
          ) : null}
          {/* {this.state.food_cost > 0 && this.state.from=="TableBooking" ?
       <Footer style={{backgroundColor:colors.theme_fg,height: 40}} >
        <Row onPress={async()=>await this.viewcart()}>
          <Col style={{width:'50%'}}>
            <Text style={{ fontSize:20, color:colors.theme_button_fg, marginTop:5, marginLeft:10 }}>Go to TableBooking</Text>
          </Col>
          <Col style={{width:'50%'}}>
            <Text id='cart_total' style={{ fontSize:20, color:colors.theme_button_fg, marginTop:5,paddingRight:10,textAlign:'right' }}>{this.state.currency+''+this.state.food_cost}</Text>
          </Col>
        </Row>
      </Footer>
      : null} */}
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
    backgroundColor: colors.divider,
  },
  category_btn: {
    //borderWidth: 0.3,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    // marginRight: 10,
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
    borderColor: colors.header,
    backgroundColor: colors.theme_button_fg,
  },
  all_categorybtn: {
    backgroundColor: colors.theme_fg,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    //borderWidth: 0.3,
    borderColor: colors.header,
    // marginRight: 10,
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
  },
  name: {
    color: colors.main_font,
    fontSize: 14,
    textAlign: "left",
    marginLeft: 5,
    fontFamily: colors.font_family,
    //fontWeight: "400",
    //marginTop: 0,
    //paddingTop: 0,
    //fontWeight: "100",
  },
  price: {
    color: colors.price,
    fontSize: 12,
    textAlign: "left",
    marginLeft: 5,
    //marginBottom: 0,
    //paddingBottom: 0,
    fontFamily: colors.font_family_bold,
  },
  description: {
    fontSize: 10,
    textAlign: "left",
    marginLeft: 5,
    color: colors.sub_font,
    fontFamily: colors.font_family,
    //paddingBottom: 20,
  },
  btn: {
    elevation: 0,
    shadowOpacity: 0,
    alignSelf: "flex-start",
    borderWidth: 0,
    height: "100%",
    backgroundColor: colors.qty_cnt,
    borderColor: colors.theme_button_fg,
    marginVertical: 0,
    //marginRight: 0,
    borderRadius: 3,
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
    //width: width * 0.9,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    // borderRadius: 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowOpacity: 0,
    borderColor: "#fff",
    //padding: 15,
    //paddingTop: 20,
    paddingBottom: 0,
    elevation: 0,
    shadowOpacity: 0,
    justifyContent: "center",
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
    //marginLeft: 10,
    color: colors.header,
    fontSize: 18,
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
    //marginLeft: 10,
    color: colors.icons,
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
    marginLeft: 0,
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
    //backgroundColor: colors.theme_fg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },

  section_header_text: {
    fontSize: 17,
    //fontWeight: 'bold',
    color: "#000",
    fontFamily: colors.font_family_bold,
    // backgroundColor: "#fff",
    marginTop: 2,
    marginBottom: 2,
  },
  section_header: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 0.5,
    marginBottom: 5,
    marginTop: 2.5,
    width: Dimensions.get("window").width,
    // backgroundColor:'blue'
    //opacity: 0.7
  },
});
