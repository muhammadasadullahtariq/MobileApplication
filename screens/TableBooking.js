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
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
} from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Content,
  Thumbnail,
  Row,
  Col,
  Grid,
  Footer,
  View,
  Item,
  Input,
  Button,
} from "native-base";
import { Div } from "react-native-div";
import SQLite from "react-native-sqlite-storage";
import { Divider } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { NavigationActions, StackActions } from "react-navigation";
import { BASE_URL, img_url } from "../config/Constants";
import * as colors from "../assets/css/Colors";
import { TextInput } from "react-native-gesture-handler";
//import DateTimePicker from "react-native-modal-datetime-picker";
import AnimateLoadingButton from "react-native-animate-loading-button";
//import TimePicker from "react-native-navybits-date-time-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import DateModal from "react-native-modalbox";
import strings from "./stringsoflanguages";
import Snackbar from "react-native-snackbar";

let db = SQLite.openDatabase({ name: "spotneats.db" });

export default class TableBooking extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      mode: "",
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      category: "all",
      visible: false,
      showIndicator: false,
      pressStatus: true,
      details: this.props.navigation.getParam("details"),
      from: this.props.navigation.getParam("from"),
      tax_percent: this.props.navigation.getParam("tax_percent"),
      menu_total: 0,
      sub_total: 0,
      total: 0,
      st_qty: 0,
      food_cost: 0,
      dataSource: [],
      location_id: 0,
      menu_cnt: 0,
      currency: this.props.navigation.getParam("currency"),
      already_qty: 0,
      user_id: 0,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      date: new Date(),
      time_slots: [],
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
      guest_count: 1,
      table_count: 0,
      guest_count_temp: 1,
      table_count_temp: 0,
      current_date: moment().format("DD-MM-YYYY"),
      current_date_temp: new Date(),
      current_time: "",
      current_time_temp: "",
      selected_slot: "",
      selected_time: "",
      table_price: 20,
      cart_length: this.props.navigation.getParam("cart_length"),
      table_modalVisible: false,
      language: "",
      name: "",
      phone: "",
      email: "",
      // details:
      // {
      //   location_id:17,
      //   location_name:'samshut',
      //   description:'test',
      //   location_ratings:'4.5',
      //   profile_image:'data/banner2.jpg'
      // }
    };
  }

  async componentDidMount() {
    await this.retrieveData();
    // if(this.state.from=='modalsave'){
    //   await this.loadtable_values();
    //   //await this.time_slot();
    // }else{
    await this.getcurrenttimes();
    // await this.time_slot();
    // if(this.state.time_slots==""){
    //   await this.showSnackbar("No time slots available")
    // }
    // }

    //var time = moment().format(' hh:mm a');
    //var date = moment().format();
    //this.setState({ date:date,time: time });
    //Settign up time to show
  }
  modal_success = async () => {
    //
    //await AsyncStorage.removeItem('from')
    this.loadingButton.showLoading(true);
    var details = {
      language: this.state.language == "en" ? "english" : "spanish",
      location_id: this.state.details.location_id,
      user_id: this.state.user_id,
      guest_num: this.state.guest_count,
      reserve_date: this.state.current_date,
      reserve_time: this.state.current_time,
      first_name: this.state.name,
      email: this.state.email,
      telephone: this.state.phone,
      booking_type: "reserve",
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
          this.showSnackbar(res.message);
          this.loadingButton.showLoading(false);
        } else {
          this.closeModal();
          this.props.navigation.navigate("Success", { from: "TableBooking" });
        }
      });
  };
  loadtable_values = async () => {
    await db.transaction((tx) => {
      var table_temp = [];
      var self = this;
      tx.executeSql(
        "SELECT * FROM tablevalues",
        [],
        async function (txn, resultss) {
          if (
            resultss.rows.length > 0 &&
            self.state.user_id != resultss.rows.item(0).user_id &&
            self.state.location_id != resultss.rows.item(0).location_id
          ) {
            tx.executeSql("Delete FROM tablevalues", [], (tx, resultss) => {
              console.log("Resultss", resultss.rowsAffected);
            });
            self.setState({ showIndicator: false });
            return false;
          }
          for (let i = 0; i < resultss.rows.length; i++) {
            table_temp.push(resultss.rows.item(i));
            var location_id = await resultss.rows.item(i).location_id;
            var date = await resultss.rows.item(i).date;
            var guest_count = await resultss.rows.item(i).guest_count;
            var current_time = await resultss.rows.item(i).time;
            // console.log(resultss.rows.item(i))
          }
          await self.setState({
            current_time: current_time,
            showIndicator: false,
            guest_count: guest_count,
            current_date: date,
          });
          //  await self.time_slot();
          //  if(self.state.time_slots==""){
          //   await self.showSnackbar("No time slots available")
          //   }
        }
      );
    });
  };
  moveTranslate = async (visible) => {
    await this.setState({ table_modalVisible: visible });
    // if(this.state.selected_time!=""){
    //   //await AsyncStorage.getItem('from').then((val)=>this.setState({from:val}))
    //   // if(this.state.from=='modalsave'){
    //   //   //console.log("Adding")
    //   //   await this.addtablevalues();

    //   // }
    //   await this.setState({ table_modalVisible: visible });
    // }else{
    //   this.showSnackbar("Please select time")
    // }
  };
  closeModal = async () => {
    await this.setState({ table_modalVisible: false });
  };
  modalsave = async () => {
    // alert(this.state.current_date_temp);
    var timenow = new Date(Date.parse(this.state.current_date_temp));
    var dd = timenow.getDate();
    var mm = timenow.getMonth() + 1; //January is 0!
    var yyyy = timenow.getFullYear();
    var hours = timenow.getHours();
    var minutes = timenow.getMinutes();
    var timeString = "" + (hours > 12 ? hours - 12 : hours);
    timeString += (minutes < 10 ? ":0" : ":") + minutes;
    timeString += hours >= 12 ? " pm" : " am";
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var date = dd + "-" + mm + "-" + yyyy;
    await this.setState({
      isOpen: false,
      guest_count: this.state.guest_count_temp,
      table_count: this.state.table_count_temp,
      current_time: timeString,
      current_date: date,
    });
    await this.time_slot();
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
  openmenu() {
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
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Menu",
                params: { details: this.state.details, from: "TableBooking" },
              }),
            ],
          })
        );
        //this.props.navigation.navigate('Menu',{ details: this.state.details ,from:'TableBooking' });
      }
    } else {
      this.showSnackbar("Menus are not available now!");
    }
  }

  async sendcart() {
    try {
      if (this.state.selected_time != "") {
        AsyncStorage.setItem("from", "TableBooking");
        this.addtablevalues();
        this.props.navigation.navigate("Cart", {
          details: this.state.details,
          currency: this.state.currency,
          tax_percent: this.state.tax_percent,
          from: "TableBooking",
        });
      } else {
        this.showSnackbar("Please select time");
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  // getcurrenttimes = async() =>
  // {
  //   var minutes = moment().format('mm');
  //   var a = moment().format('a');

  //   var m = Math.ceil(moment().minute() / 15) * 15;
  //   var min = (m == 60) ? 0 : m;
  //   var hours = moment().format('hh');
  //   //var m = (parseInt((8 + 7.5)/15) * 15) % 60;
  //   var h = minutes > 45 ? (hours == 12 ? 1 : hours) : hours;

  //   await this.setState({
  //     current_time:h+':'+(min<10?'0':'') + min+' '+a,
  //     current_time_temp:h+':'+(min<10?'0':'') + min+' '+a,
  //   });
  // }
  getcurrenttimes = async () => {
    var minutes = moment().format("mm");
    var a = moment().format("a");

    var m = Math.ceil(moment().minute() / 15) * 15;
    var min = m == 60 ? 0 : m;
    var hours = moment().format("hh");
    //var m = (parseInt((8 + 7.5)/15) * 15) % 60;
    var h = minutes > 45 ? (hours === 23 ? 0 : ++hours) : hours;

    await this.setState({
      current_time: h + ":" + (min < 10 ? "0" : "") + min + " " + a,
      current_time_temp: h + ":" + (min < 10 ? "0" : "") + min + " " + a,
    });
  };
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  time_slot = async () => {
    var add_details = {
      guest: this.state.guest_count,
      date: this.state.current_date,
      time: this.state.current_time,
      location_id: this.state.details.location_id,
    };
    var formBody = [];
    for (var property in add_details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(add_details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    await fetch(BASE_URL + "restaurantsList/getTableTime", {
      method: "post",
      headers: {
        Authorization: "Basic YWRtaW46MTIzNA==",
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "X-API-KEY": "RfTjWnZr4u7x!A-D",
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then(async (res) => {
        if (res.message != "Success") {
          this.loadingButton.showLoading(false);
          this.showSnackbar(res.message);
        } else {
          /*this.storeData(res.result.customer_id,res.result.first_name,res.result.telephone,res.result.default_address,this.state.email);

        this.loadingButton.showLoading(false);*/
          //this.props.navigation.navigate('Home');
          await this.setState({
            time_slots: res.times,
          });
          this.setState({ showIndicator: false });
          //this.resetMenu();
        }
      })
      .catch((error) => {
        this.loadingButton.showLoading(false);
        //this.showSnackbar("Something went wrong");
      });

    // var m = (Math.round(minutes/15) * 15) % 60;
  };

  handleBackButtonClick() {
    // this.props
    //   .navigation
    //   .dispatch(StackActions.reset({
    //     index: 0,
    //     actions: [
    //       NavigationActions.navigate({
    //         routeName: 'RestaurantDetail',
    //         params: { details: this.state.details },
    //       }),
    //     ],
    //   }))
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "Menu",
            params: { details: this.state.details },
          }),
        ],
      })
    );
    return true;
  }

  retrieveData = async () => {
    try {
      await AsyncStorage.getItem("user_id").then((val) => {
        this.setState({ user_id: val });
      });
      await AsyncStorage.getItem("language").then((val) => {
        this.setState({ language: val });
      });
      await AsyncStorage.getItem("name").then((val) => {
        this.setState({ name: val });
      });
      await AsyncStorage.getItem("phone").then((val) => {
        this.setState({ phone: val });
      });
      await AsyncStorage.getItem("email").then((val) => {
        this.setState({ email: val });
      });
      //await AsyncStorage.getItem('from').then((val)=>{this.setState({from:val})})
    } catch (error) {}
  };
  async check_sqli() {
    await db.transaction((tx) => {
      var temp = [];
      var self = this;
      tx.executeSql(
        "SELECT * FROM main_cart",
        [],
        async function (txn, results) {
          var foodcst = 0;
          if (
            results.rows.length > 0 &&
            (results.rows.item(0).location_id !=
              self.state.details.location_id ||
              self.state.user_id != results.rows.item(0).user_id)
          ) {
            tx.executeSql("Delete FROM main_cart", [], (tx, results) => {
              console.log("Results", results.rowsAffected);
            });
            await self.setState({ food_cost: 0 });
            self.setState({ showIndicator: false });
            results.rows.length == 0;
            return false;
          }

          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              await temp.push(results.rows.item(i));
              foodcst = foodcst + results.rows.item(i).menu_total;
              location_id = results.rows.item(i).location_id;
            }
            await self.setState({
              dataSource: temp,
              location_id: location_id,
              food_cost: parseFloat(foodcst).toFixed(2),
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
  viewcart = () => {
    this.props.navigation.navigate("Cart", {
      details: this.state.details,
      currency: this.state.currency,
      tax_percent: this.state.tax_percent,
    });
  };
  addvalue = async (type) => {
    if (type == "guest") {
      var gu_cnt = parseInt(this.state.guest_count_temp) + 1;
      await this.setState({ guest_count_temp: gu_cnt, guest_count: gu_cnt });
    } else {
      var tb_cnt = parseInt(this.state.table_count_temp) + 1;
      await this.setState({ table_count_temp: tb_cnt, table_count: tb_cnt });
    }
  };
  decrementvalue = async (type) => {
    if (type == "guest") {
      if (this.state.guest_count_temp > 0) {
        var gu_cnt = parseInt(this.state.guest_count_temp) - 1;
        await this.setState({ guest_count_temp: gu_cnt, guest_count: gu_cnt });
      }
    } else {
      if (this.state.table_count > 0) {
        var tb_cnt = parseInt(this.state.table_count_temp) - 1;
        await this.setState({ table_count_temp: tb_cnt, table_count: tb_cnt });
      }
    }
  };
  removecart = (menu_id, option_id) => {
    var self = this;
    db.transaction((tx) => {
      if (option_id) {
        tx.executeSql(
          "Delete FROM main_cart where menu_id=? and option_id=?",
          [menu_id, option_id],
          (tx, results) => {
            console.log("Results", results.rowsAffected);
          }
        );
      } else {
        tx.executeSql(
          "Delete FROM main_cart where menu_id=?",
          [menu_id],
          (tx, results) => {
            console.log("Results", results.rowsAffected);
          }
        );
      }
    });
  };
  check_exists_menu = (key, menu_key, menu_id) => {
    db.transaction((tx) => {
      var self = this;
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
            self.state.details.categories[key].menu_items[
              menu_key
            ].qty = results.rows.item(0).menu_qty;
            //await self.setState({ already_qty : results.rows.item(0).menu_qty});
            //console.log('afr'+self.state.already_qty);
          } else {
            self.state.details.categories[key].menu_items[menu_key].qty = 0;
          }
        }
      );
    });
  };
  addtablevalues = () => {
    var self = this;

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS tablevalues(user_id INTEGER NOT NULL,location_id INTEGER NOT NULL,time VARCHAR(30),guest_count INTEGER NOT NULL,no_of_tables INTEGER NOT NULL,date VARCHAR(20))",
        []
      );

      tx.executeSql(
        "SELECT * FROM tablevalues",
        [],
        async function (txn, results) {
          if (
            results.rows.length > 0 &&
            (results.rows.item(0).location_id !=
              self.state.details.location_id ||
              self.state.user_id != results.rows.item(0).user_id)
          ) {
            await tx.executeSql("Delete from tablevalues");
            await this.setState({ food_cost: 0 });
          }
        }
      );
      tx.executeSql(
        "INSERT INTO tablevalues (user_id,location_id,time,guest_count,no_of_tables,date) VALUES ('" +
          self.state.user_id +
          "','" +
          self.state.details.location_id +
          "','" +
          self.state.selected_time +
          "','" +
          self.state.guest_count +
          "','" +
          self.state.table_count +
          "','" +
          self.state.current_date +
          "')"
      );
    });
  };
  render() {
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
      // var slots =  this.state.time_slots.map((val,key) => {
      //   return(
      //     <View style={{marginRight:5}}>
      //         <Button style={this.state.selected_slot === key ? styles.all_categorybtn : styles.category_btn} onPress={async() => {await this.setState({ selected_slot: key,selected_time: val }); }}><Text style={{color:this.state.selected_slot === key ?colors.theme_button_fg : colors.theme_fg }}>{val}</Text></Button>
      //      </View>
      //   )
      // });

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
          <ScrollView>
            <Content>
              <Grid>
                <Row>
                  <Thumbnail
                    style={{ width: "100%", height: 150 }}
                    square
                    source={{ uri: img_url + this.state.details.profile_image }}
                  />
                </Row>
                <Row
                  style={{
                    paddingTop: 0,
                    paddingBottom: 5,
                    backgroundColor: colors.bg_two,
                  }}
                >
                  <Left style={{ marginTop: 10 }}>
                    <Text style={styles.restaurantname}>
                      {this.state.details.location_name}
                    </Text>
                  </Left>
                  <Right style={styles.ratingbtn}>
                    <Text
                      style={{
                        fontSize: 12,
                        marginLeft: 5,
                        marginRight: 5,
                        color: colors.star_icons,
                      }}
                    >
                      <Icon
                        style={{
                          fontSize: 13,
                          color: colors.star_icons,
                        }}
                        name="star"
                      />{" "}
                      {parseFloat(this.state.details.location_ratings).toFixed(
                        1
                      )}{" "}
                      ({this.state.details.review_count})
                    </Text>
                  </Right>
                </Row>
                <Row
                  style={{
                    paddingTop: 0,
                    paddingBottom: 10,
                    backgroundColor: colors.bg_two,
                  }}
                >
                  <Text style={styles.description} numberOfLines={1}>
                    {this.state.details.description}
                  </Text>
                </Row>
                <Row>
                  <Row
                    style={{
                      padding: 10,
                      height: Dimensions.get("screen").height * 0.1,
                      backgroundColor: "transparent",
                    }}
                  >
                    <Col style={{ width: "70%" }}>
                      <Row style={{ alignItems: "center", marginLeft: "8%" }}>
                        <Ionicons
                          color={colors.theme_fg}
                          style={{ marginLeft: "2%", fontSize: 25 }}
                          name="ios-person"
                        />
                        <Text style={{ color: colors.theme_fg, fontSize: 18 }}>
                          {" "}
                          {this.state.guest_count_temp}{" "}
                          {this.state.guest_count_temp == 1
                            ? "person"
                            : strings.people}
                        </Text>
                      </Row>
                    </Col>
                    <Col style={{ width: "30%" }}>
                      <Row
                        style={{
                          alignItems: "center",
                          justifyContent: "flex-end",
                          marginRight: "28%",
                        }}
                      >
                        <Ionicons
                          onPress={() =>
                            this.state.guest_count_temp > 1
                              ? this.decrementvalue("guest")
                              : null
                          }
                          color={colors.theme_fg}
                          style={{
                            opacity: this.state.guest_count_temp > 1 ? 1 : 0.5,
                            marginLeft: "5%",
                            fontSize: 25,
                          }}
                          name="ios-remove-circle-outline"
                        />
                        <Ionicons
                          onPress={() => this.addvalue("guest")}
                          color={colors.theme_fg}
                          style={{ marginLeft: "5%", fontSize: 25 }}
                          name="ios-add-circle-outline"
                        />
                      </Row>
                    </Col>
                  </Row>

                  {/*<Col style={{width:'50%',marginTop:25}}>
              <Row>
                  <Text style={{color:colors.theme_fg}}>Total Tables</Text>
                </Row>
                <Row style={{marginTop:10,justifyContent:'center',alignItems:'center'}}>
                  <TextInput
                    style={{borderWidth:1,borderColor:colors.border,width:120,height:40,borderRadius:5}}
                    textAlign={'center'}
                    keyboardType='numeric'
                    onChangeText={TextInputValue => this.setState({ table_count: TextInputValue })}
                    editable={false}
                    >{this.state.table_count}</TextInput>
                  <Ionicons onPress={(text) => this.decrementvalue('table')} color={colors.theme_fg} style={{marginTop:'3%',marginLeft:'2%', fontSize:26  }} name="ios-remove-circle" />
                  <Ionicons onPress={(text) => this.addvalue('table')} color={colors.theme_fg} style={{marginTop:'3%',marginLeft:'2%', fontSize:26  }} name="ios-add-circle" />
                </Row>
              </Col>*/}
                </Row>
                <Divider
                  style={{
                    backgroundColor: colors.divider,
                    marginRight: 20,
                    marginLeft: 20,
                  }}
                />
                <Row
                  style={{
                    padding: 10,
                    height: Dimensions.get("screen").height * 0.12,
                    backgroundColor: "transparent",
                  }}
                >
                  <Col style={{ marginRight: 5, alignItems: "center" }}>
                    <Row
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Ionicons
                        style={{ fontSize: 20, color: colors.theme_fg }}
                        name="md-calendar"
                      />
                      <Text
                        onPress={() =>
                          this.setState({ isOpen: true, mode: "date" })
                        }
                        style={{
                          color: colors.theme_fg,
                          fontSize: 16,
                          marginLeft: 5,
                        }}
                      >
                        Date
                      </Text>
                      {/* <Ionicons
                        onPress={() => this.setState({ isOpen: true })}
                        style={{
                          fontSize: 26,
                          color: colors.theme_fg,
                          alignItems: "center",
                          marginLeft: 5,
                        }}
                        name="md-arrow-dropdown"
                      /> */}
                    </Row>
                    <Row style={{ marginTop: 3 }}>
                      <Text
                        onPress={() =>
                          this.setState({ isOpen: true, mode: "date" })
                        }
                        style={{ fontSize: 16 }}
                      >
                        {this.state.current_date}
                      </Text>
                      {/* <Feather style={{paddingLeft: 5, color: colors.theme_fg, marginTop: 2}} size={20} name="chevron-down" /> */}
                    </Row>
                  </Col>
                  <Col
                    style={{ backgroundColor: colors.divider, width: 0.8 }}
                  ></Col>
                  <Col style={{ alignItems: "center", marginLeft: 5 }}>
                    <Row
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Ionicons
                        onPress={() =>
                          this.setState({ isOpen: true, mode: "time" })
                        }
                        style={{ fontSize: 20, color: colors.theme_fg }}
                        name="md-time"
                      />
                      <Text
                        onPress={() =>
                          this.setState({ isOpen: true, mode: "time" })
                        }
                        style={{
                          color: colors.theme_fg,
                          fontSize: 16,
                          marginLeft: 5,
                        }}
                      >
                        Time
                      </Text>
                      {/* <Ionicons
                        onPress={() => this.setState({ isOpen: true })}
                        style={{
                          fontSize: 25,
                          color: colors.theme_fg,
                          alignItems: "center",
                          marginLeft: 5,
                        }}
                        name="md-arrow-dropdown"
                      /> */}
                    </Row>
                    <Row style={{ marginTop: 3 }}>
                      <Text
                        onPress={() =>
                          this.setState({ isOpen: true, mode: "time" })
                        }
                        style={{ fontSize: 16 }}
                      >
                        {this.state.current_time}
                      </Text>
                      {/* <Feather style={{paddingLeft: 0, marginTop: 2}} size={20} name="chevron-down" /> */}
                    </Row>
                  </Col>
                </Row>
                <Divider
                  style={{
                    backgroundColor: colors.divider,
                    marginRight: 20,
                    marginLeft: 20,
                  }}
                />
                <Row style={{ margin: 10 }}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                  >
                    {/* {slots}  */}
                  </ScrollView>
                </Row>
                {/*<Col style={{width:'40%',marginTop:25,marginLeft:10}}>
                <Row>
                  <Text style={{color:colors.theme_fg}}>Select Time</Text>
                </Row>
                <Row style={{marginTop:10,justifyContent:'center',alignItems:'center'}}>
                <DatePicker
                  customStyles={{dateInput:{borderWidth: 0}}}
                  style={{borderColor:colors.theme_fg,borderWidth:1,width:130}}
                  date={this.state.time}
                  mode={'time'}
                  is24Hour={false}
                  androidMode='spinner'
                  format='hh:mm a'
                  minuteInterval={15}
                  onDateChange={time => this.setState({ time })}
                  iconComponent={
                    <Ionicons color={colors.theme_fg} name='ios-timer' size={26} style={{paddingRight:10}} />
                 }
                />

                </Row>
              </Col>*/}

                {/* <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={this.state.screenWidth-20}
                height={40}
                title={<Text>{this.state.cart_length == null? "Pre Order your food (optional)":"You have ordered "+this.state.cart_length+" items"}</Text>}
                titleFontSize={15}
                titleColor={colors.theme_fg}
                backgroundColor={colors.bg_two}
                borderRadius={2}
                onPress={()=>this.openmenu()}
                titleFontFamily={colors.font_family}
              />
            </Row> */}
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
                    title="BOOK TABLE"
                    titleFontSize={15}
                    titleColor={colors.theme_button_fg}
                    backgroundColor={colors.theme_fg}
                    borderRadius={5}
                    onPress={() => this.moveTranslate()}
                    titleFontFamily={colors.font_family}
                  />
                </Row>
              </Grid>
            </Content>
          </ScrollView>
          {this.state.food_cost > 0 ? (
            <Footer style={{ backgroundColor: colors.theme_fg, height: 40 }}>
              <Row onPress={this.viewcart}>
                <Col style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: colors.theme_button_fg,
                      marginTop: 5,
                      marginLeft: 10,
                    }}
                  >
                    {strings.view_cart}
                  </Text>
                </Col>
                <Col style={{ width: "50%" }}>
                  <Text
                    id="cart_total"
                    style={{
                      fontSize: 20,
                      color: colors.theme_button_fg,
                      marginTop: 5,
                      paddingRight: 10,
                      textAlign: "right",
                    }}
                  ></Text>
                </Col>
              </Row>
            </Footer>
          ) : (
            <Text></Text>
          )}
          <DateModal
            style={[styles.modal, styles.modal4]}
            isOpen={this.state.isOpen}
            position={"bottom"}
            ref={"modal4"}
            onClosed={() => this.setState({ isOpen: false })}
          >
            <Row
              style={{
                height: Dimensions.get("screen").height * 0.1,
                backgroundColor: "transparent",
              }}
            >
              <Col style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 19,
                    color: "#a3a3a3",
                    marginLeft: 5,
                    fontFamily: colors.font_family,
                  }}
                >
                  {" "}
                  {this.state.mode === "time" ? "Time" : "Date"}
                </Text>
              </Col>
            </Row>
            <Row
              style={{
                backgroundColor: colors.divider,
                marginRight: "5%",
                marginLeft: "5%",
                height: 0.8,
                width: "100%",
              }}
            ></Row>
            <Row
              style={{
                alignItems: "center",
                justifyContent: "center",
                // height: 150,
                padding: 10,
                // width: Dimensions.get("window").width,
                marginBottom: 5,
              }}
            >
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  // style={{
                  //   borderColor: colors.theme_fg,
                  //   borderWidth: 1,
                  //   fontFamily: colors.font_family,
                  //   fontSize: 25,
                  //   // justifyContent: "center",
                  //   // alignItems: "center",
                  //   // paddingLeft:20,
                  //   // height: 50,
                  //   padding:10,
                  //   height:100
                  // }}
                  // value={this.state.current_date_temp}
                  display="spinner"
                  style={{
                    width: 320,
                    height: 140,
                    backgroundColor: "white",
                    marginBottom: 10,
                  }}
                  value={this.state.current_date_temp}
                  minuteInterval={15}
                  mode={this.state.mode}
                  minimumDate={this.state.date}
                  onChange={(event, current_date_temp) =>
                    this.setState({ current_date_temp })
                  }
                />
              ) : (
                <DatePicker
                  style={{
                    borderColor: colors.theme_fg,
                    borderWidth: 1,
                    fontFamily: colors.font_family,
                  }}
                  date={this.state.current_date_temp}
                  minuteInterval={15}
                  mode={this.state.mode}
                  minimumDate={this.state.date}
                  onDateChange={(current_date_temp) =>
                    this.setState({ current_date_temp })
                  }
                />
              )}
            </Row>
            <Row
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "5%",
                height: 50,
              }}
            >
              <AnimateLoadingButton
                ref={(c) => (this.loadingButton = c)}
                width={this.state.screenWidth - 20}
                height={40}
                title={strings.done}
                titleFontSize={18}
                titleColor={colors.theme_button_fg}
                backgroundColor={colors.theme_fg}
                borderRadius={5}
                onPress={() => {
                  this.modalsave();
                }}
                titleFontFamily={colors.font_family}
              />
            </Row>
          </DateModal>
          <Modal
            visible={this.state.table_modalVisible}
            transparent={true}
            animationType={"fade"}
            onRequestClose={() => {
              this.closeModal();
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ table_modalVisible: false });
              }}
            >
              <View style={styles.model_view}>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={colors.status_bar}
                  networkActivityIndicatorVisible={true}
                />
                <View style={styles.model_view1}>
                  <Container
                    style={{
                      width: Dimensions.get("screen").width * 0.6,
                      borderRadius: Dimensions.get("screen").height * 0.01,
                    }}
                  >
                    <View
                      style={{
                        height: Dimensions.get("screen").height * 0.05,
                        //backgroundColor: colors.theme_fg,
                        borderTopLeftRadius:
                          Dimensions.get("screen").height * 0.01,
                        borderTopRightRadius:
                          Dimensions.get("screen").height * 0.01,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StatusBar
                        barStyle="light-content"
                        backgroundColor={colors.status_bar}
                        networkActivityIndicatorVisible={true}
                      />
                      <Row
                        style={{
                          backgroundColor: "transparent",
                          alignItems: "center",
                        }}
                      >
                        {/* <View
                          style={{ width: "85%", alignItems: "flex-start" }}
                        >
                          <Text
                            style={{
                              fontSize: 24,
                              color: "white",
                            }}
                          >
                            Book
                          </Text>
                        </View> */}
                        <View
                          style={{
                            width: "100%",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.closeModal();
                            }}
                          >
                            <Text
                              style={{ color: colors.theme_fg, fontSize: 18 }}
                            >
                              {" "}
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Row>
                    </View>
                    <Divider
                      style={{
                        backgroundColor: colors.divider,
                        //marginLeft: Dimensions.get("screen").width * 0.025,
                        //marginRight: Dimensions.get("screen").width * 0.025,
                        marginBottom: 5,
                        marginTop: 5,
                        //width: "95%",
                      }}
                    />
                    <TouchableWithoutFeedback>
                      <View
                        style={{
                          height: "80%",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Row
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: Dimensions.get("screen").height * 0.05,
                            marginLeft: Dimensions.get("screen").width * 0.025,
                            marginRight: Dimensions.get("screen").width * 0.025,
                            backgroundColor: "transparent",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              color: colors.theme_fg,
                              fontFamily: colors.font_family_bold,
                            }}
                          >
                            {this.state.details.location_name}
                          </Text>
                        </Row>
                        {/* <Row style={{alignItems:"flex-end",height:Dimensions.get("screen").height*0.05,backgroundColor:'transparent'}}>
                      <Col style={{ width:'60%' }}>

                        <Text style={styles.cart_label} >Guest Count</Text>
                      </Col>
                      <Col style={{ width:'40%' }}>
                        <Text style={styles.cart_values}>:{this.state.guest_count} Guests</Text>
                      </Col>
                      </Row> */}
                        <Row
                          style={{
                            height: Dimensions.get("screen").height * 0.04,
                            marginLeft: Dimensions.get("screen").width * 0.05,
                            marginRight: Dimensions.get("screen").width * 0.05,
                            backgroundColor: "transparent",
                            alignItems: "center",
                          }}
                        >
                          <Col>
                            <Row style={{ alignItems: "center" }}>
                              <Text style={styles.cart_label}>Guests</Text>
                            </Row>
                          </Col>
                          <Col>
                            <Row style={{ alignItems: "center" }}>
                              <Text style={styles.cart_values}>
                                {this.state.guest_count_temp}
                              </Text>
                            </Row>
                          </Col>
                        </Row>

                        {/* <Row style={{alignItems:"center",height:Dimensions.get("screen").height*0.05,backgroundColor:'transparent'}}>
                      <Col style={{ width:'60%' }}>
                        <Text style={styles.cart_label} >Time</Text>
                      </Col>
                      <Col style={{ width:'40%' }}>
                        <Text style={styles.cart_values}>:{this.state.selected_time}</Text>
                      </Col>
                      </Row> */}
                        <Row
                          style={{
                            height: Dimensions.get("screen").height * 0.04,
                            marginLeft: Dimensions.get("screen").width * 0.05,
                            marginRight: Dimensions.get("screen").width * 0.05,
                            backgroundColor: "transparent",
                          }}
                        >
                          <Col>
                            <Row style={{ alignItems: "center" }}>
                              <Text style={styles.cart_label}>Time</Text>
                            </Row>
                          </Col>
                          <Col>
                            <Row style={{ alignItems: "center" }}>
                              <Text style={styles.cart_values}>
                                {this.state.current_time}
                              </Text>
                            </Row>
                          </Col>
                        </Row>
                        {/* <Row style={{alignItems:"flex-start",height:Dimensions.get("screen").height*0.05,backgroundColor:'transparent'}}>
                      <Col style={{ width:'60%' }}>
                        <Text style={styles.cart_label} >Date</Text>
                      </Col>
                      <Col style={{ width:'40%' }}>
                        <Text style={styles.cart_values}>:{this.state.current_date}</Text>
                      </Col>
                      </Row> */}
                        <Row
                          style={{
                            height: Dimensions.get("screen").height * 0.04,
                            marginLeft: Dimensions.get("screen").width * 0.05,
                            marginRight: Dimensions.get("screen").width * 0.05,
                            backgroundColor: "transparent",
                          }}
                        >
                          <Col>
                            <Row style={{ alignItems: "center" }}>
                              <Text style={styles.cart_label}>Date</Text>
                            </Row>
                          </Col>
                          <Col>
                            <Row style={{ alignItems: "center" }}>
                              <Text style={styles.cart_values}>
                                {this.state.current_date}
                              </Text>
                            </Row>
                          </Col>
                        </Row>
                        {/* <Divider
                          style={{
                            backgroundColor: colors.divider,
                            marginLeft: Dimensions.get("screen").width * 0.025,
                            marginRight: Dimensions.get("screen").width * 0.025,
                            marginBottom: 0,
                            marginTop: 5,
                            //marginLeft: 5,
                            // marginRight: 5,
                            width: "95%",
                          }}
                        /> */}
                        <Divider
                          style={{
                            backgroundColor: colors.divider,
                            //marginLeft: Dimensions.get("screen").width * 0.025,
                            //marginRight: Dimensions.get("screen").width * 0.025,
                            marginBottom: 0,
                            marginTop: 10,
                            //width: "95%",
                          }}
                        />

                        <Footer
                          style={{
                            marginTop: 0,
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <AnimateLoadingButton
                            ref={(c) => (this.loadingButton = c)}
                            width={200}
                            height={40}
                            title="Confirm"
                            titleColor={colors.theme_fg}
                            titleFontSize={17}
                            backgroundColor={"white"}
                            titleFontFamily={colors.font_family}
                            //backgroundColor={Platform.OS === 'android' ? colors.theme_fg : colors.theme_button_fg}
                            borderRadius={5}
                            onPress={() => this.modal_success()}
                          />
                        </Footer>
                      </View>
                    </TouchableWithoutFeedback>
                  </Container>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
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
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modal4: {
    height: 330,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  dateInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  category_btn: {
    borderRadius: 5,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 10,
    borderColor: colors.divider,
    backgroundColor: colors.bg_two,
  },
  all_categorybtn: {
    backgroundColor: colors.theme_fg,
    borderRadius: 5,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 10,
  },
  restaurantname: {
    marginLeft: 10,
    color: colors.header,
    fontSize: 16,
    fontFamily: colors.font_family_bold,
  },
  name: {
    color: colors.theme_fg,
    fontSize: 16,
    textAlign: "left",
    marginLeft: 5,
    marginTop: 5,
  },
  price: {
    color: colors.price,
    fontSize: 12,
    textAlign: "left",
    marginLeft: 5,
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    textAlign: "left",
    marginLeft: 10,
    color: colors.sub_font,
  },
  cart_label: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 5,
    color: colors.sub_font,
    fontFamily: colors.font_family_bold,
  },
  cart_values: {
    fontSize: 14,
    textAlign: "right",
    marginTop: 5,
    color: colors.sub_font,
  },
  ratingbtn: {
    //height: 20,
    fontSize: 12,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginRight: 10,
  },
  model_view: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    height: Dimensions.get("screen").height * 1,
    borderRadius: Dimensions.get("screen").height * 0.01,
  },
  model_view1: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get("screen").height * 0.35,
    borderRadius: Dimensions.get("screen").height * 0.01,
  },
});
