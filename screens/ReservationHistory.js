/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
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
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import {
  Container,
  Left,
  Body,
  Right,
  Content,
  Row,
  Header,
  Thumbnail,
  Button,
  Card,
  CardItem,
  Tabs,
  Tab,
} from 'native-base';
import { fb } from '../config/ConfigFirebase';
import { BASE_URL, img_url } from '../config/Constants';
/* Include color file */
import * as colors from '../assets/css/Colors';
import Snackbar from 'react-native-snackbar';
import strings from './stringsoflanguages';
import PTRView from 'react-native-pull-to-refresh';

export default class ReservationHistory extends Component {
  static navigationOptions = {
    header: null,
  };

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
      order_stat: 'pending',
      delivery_id: 0,
      phone: '',
      backClickCount: 0,
      reservation_id: '',
    };
  }
  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'RestaurantList',
          }),
        ],
      })
    );

    //this.props.navigation.navigate('RestaurantList');
    //this.props.navigation.goBack(null);
    //  return true;
  }
  // _refresh=()=>{
  //   this.setState({refreshing:false})
  //   this.wait(6000).then(() =>this.setState({refreshing:true}));
  // }
  _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(), this.componentDidMount();
      }, 2000);
    });
  };
  async componentDidMount() {
    this.setState({ showIndicator: true });
    await this.retrieveData();
    // console.log(this.state.user_id)
    await this.get_data(this.state.user_id);
    //await this.getstatus_updation(this.state.user_id);
    //await this.pending_list();
    //await this.completed_list();
    if (Platform.OS === 'ios') {
      //this.callLocation(that);
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
                    routeName: 'Home',
                    params: { someParams: 'parameters goes here...' },
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
    }
  }

  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const phone = await AsyncStorage.getItem('phone');
      if (user_id !== null) {
        await this.setState({
          user_id: user_id,
          phone: phone,
        });
      }
    } catch (error) {}
  };
  get_data = async (user_id) => {
    if (user_id != 0) {
      var details = {
        customer_id: user_id,
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      //alert(formBody)
      await fetch(BASE_URL + 'reservation/view', {
        method: 'post',
        async: true,
        crossDomain: true,
        headers: {
          Authorization: 'Basic YWRtaW46MTIzNA==',
          'X-API-KEY': 'RfTjWnZr4u7x!A-D',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      })
        .then((response) => response.json())
        .then(async (res) => {
          var ontrip = [];
          var completed = [];
          if (res.message.code != 401) {
            for (let i = 0; i < res.result.length; i++) {
              if (res.result[i].status == 24 || res.result[i].status == 23) {
                //alert("Hello")
                completed.push(res.result[i]);
              } else {
                ontrip.push(res.result[i]);
              }
            }
            this.setState({
              pending: ontrip,
              completed: completed,
              showIndicator: false,
            });
          } else {
            this.setState({ showIndicator: false });
          }
        });
    } else {
      this.setState({ showIndicator: false });
    }
  };
  handleCustomIndexSelect = (index: number) => {
    this.setState((prevState) => ({ ...prevState, customStyleIndex: index }));
  };

  bookingDetail = (
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
    let btn_label = '';
    if (status == 3) {
      btn_label = 'Picked Up';
    } else if (status == 4 || status == 5) {
      btn_label = 'Delivered';
    } else if (status == 6) {
      btn_label = 'Completed';
    } else if (status == 20) {
      btn_label = 'Completed';
    } else if (status == 0) {
      btn_label = 'Cancelled';
    }
    this.props.navigation.navigate('Booking', {
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
  };
  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  rating(
    reservation_id,
    customer_id,
    date,
    location_id,
    reservation_time,
    guest_count
  ) {
    /* this.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'ReservationReview',
          params: { order_id: order_id,customer_id:customer_id,date:date,location_id:location_id },
        }),
      ],
    }))*/
    this.props.navigation.navigate('ReservationReview', {
      reservation_id: reservation_id,
      customer_id: customer_id,
      date: date,
      location_id: location_id,
      time: reservation_time,
      count: guest_count,
    });
  }
  tracking(order_id, delivery_id, location_id) {
    //var delivery_id = 1;
    //var order_id = 1;
    //console.log(delivery_id +'---'+ order_id);
    fb.ref('/orders/' + delivery_id + '/' + order_id).on(
      'value',
      (dataSnapshot) => {
        this.bookingDetail(
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
      }
    );
  }
  getstatus_updation = (user_id) => {
    fb.ref('/customer_pendings/' + user_id).on('value', (dataSnapshot) => {
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
      routeName: 'Login',
    });
    this.props.navigation.dispatch(navigateAction);
  };
  pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
  tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  render() {
    let ontrip = <Text></Text>;
    let completed = <Text></Text>;

    if (this.state.pending != undefined && this.state.completed != undefined) {
      ontrip = this.state.pending.map((val, key) => {
        if (val.status == 21) {
          var btn_text = strings.waiting_for_restaurant_confirmation;
          var colo = '#a6a6a6';
          var status = strings.reservation_pending;
        } else if (val.status == 22) {
          var btn_text = strings.restaurant_confirmed_your_order;
          var colo = colors.theme_fg;
          var status = strings.reservation_confirmed;
        }
        //this.getstatus_updation(this.state.user_id,val.order_id);
        var val_status = status;
        var reservation_id = val.reservation_id;
        var otp = val.otp;
        var date = val.reserve_date;
        var time = this.tConvert(val.reserve_time);
        var guest_count = val.guest_num;
        return (
          <View>
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
                width: '90%',
                marginLeft: '5%',
                borderRadius: 10,
                borderWidth: 0,
                borderColor: 'transparent',
              }}
            >
              <ImageBackground
                source={require('.././assets/img/res_bg.png')}
                imageStyle={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                style={{
                  height: 100,
                  flex: 1,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <Row
                  style={{
                    backgroundColor: 'rgba(128,128,128,0.4)',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Body
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        color: colors.theme_button_fg,
                        fontSize: 20,
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5,
                      }}
                    >
                      #{reservation_id}
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
                      Code : {otp}
                    </Text>
                  </Right>
                </Row>
                <Row>
                  <Left>
                    <Text style={{ fontSize: 12 }}>
                      {date} at {time}
                    </Text>
                  </Left>
                  <Right>
                    <Text style={{ fontSize: 12, marginRight: 10 }}>
                      {strings.reservation_guests} : {guest_count}
                    </Text>
                  </Right>
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
                  borderColor: 'transparent',
                }}
              >
                <Body>
                  <Text style={{ color: colors.theme_button_fg }}>
                    {btn_text}
                  </Text>
                </Body>
              </Content>
            </Card>
          </View>
        );
      });

      completed = this.state.completed.map((val, key) => {
        if (val.status == 23) {
          var btn_text = strings.your_order_cancelled;
          var colo = '#a6a6a6';
          var status = strings.reservation_cancelled;
        } else {
          var btn_text = 'You order has been completed';
          var colo = colors.theme_fg;
          var status = strings.reservation_completed;
        }
        var val_status = status;
        var reservation_id = val.reservation_id;
        var otp = val.otp;
        var date = val.reserve_date;
        var time = this.tConvert(val.reserve_time);
        var guest_count = val.guest_num;
        return (
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={
              val.status == 24
                ? this.rating.bind(
                    this,
                    val.reservation_id,
                    this.state.user_id,
                    date,
                    val.location_id,
                    time,
                    guest_count
                  )
                : null
            }
          >
            <Card
              style={{
                width: '90%',
                marginLeft: '5%',
                borderRadius: 10,
                borderWidth: 0,
                borderColor: 'transparent',
              }}
            >
              <ImageBackground
                source={require('.././assets/img/res_bg.png')}
                imageStyle={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                style={{
                  height: 100,
                  flex: 1,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <Row
                  style={{
                    backgroundColor: 'rgba(128,128,128,0.4)',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Body
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        color: colors.theme_button_fg,
                        fontSize: 20,
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5,
                      }}
                    >
                      #{reservation_id}
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
                      Code : {otp}
                    </Text>
                  </Right>
                </Row>
                <Row>
                  <Left>
                    <Text style={{ fontSize: 12 }}>
                      {date} at {time}
                    </Text>
                  </Left>
                  <Right>
                    <Text style={{ fontSize: 12, marginRight: 10 }}>
                      Guests : {guest_count}
                    </Text>
                  </Right>
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
                  borderColor: 'transparent',
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
        <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: colors.header,
              borderBottomWidth: 0,
            }}
          >
            <StatusBar
              translucent
              barStyle='dark-content'
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
          <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Thumbnail
              style={{
                height: 150,
                width: 150,
              }}
              square
              source={require('.././assets/img/no_data.png')}
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
                  justifyContent: 'center',
                  alignItems: 'center',
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
                height: Platform.OS === 'ios' ? 25 : 0,
              }}
            >
              <StatusBar
                translucent
                barStyle='dark-content'
                // dark-content, light-content and default
                hidden={false}
                //To hide statusBar
                backgroundColor={colors.status_bar}
                //Background color of statusBar only works for Android
                translucent={false}
                //allowing light, but not detailed shapes
                networkActivityIndicatorVisible={true}
              />
            </View>
            <View style={styles.container}>
              <ActivityIndicator size='large' color={colors.theme_fg} />
            </View>
          </Container>
        );
      } else {
        return (
          <Container>
            <View
              style={{
                backgroundColor: colors.status_bar,
                height: Platform.OS === 'ios' ? 35 : 0,
              }}
            >
              <StatusBar
                barStyle='light-content'
                // dark-content, light-content and default
                hidden={false}
                //To hide statusBar
                backgroundColor={colors.status_bar}
                //Background color of statusBar only works for Android
                translucent={false}
                //allowing light, but not detailed shapes
                networkActivityIndicatorVisible={true}
              />
            </View>
            <Tabs tabBarUnderlineStyle={{ backgroundColor: colors.theme_fg }}>
              <Tab
                heading={'Ongoing Reservations'}
                tabStyle={{ backgroundColor: colors.bg_one }}
                activeTabStyle={{ backgroundColor: colors.bg_one }}
                textStyle={{
                  color: colors.sp_subtext_fg,
                  fontFamily: colors.font_family,
                }}
                activeTextStyle={{
                  color: colors.theme_fg,
                  fontFamily: colors.font_family,
                  fontWeight: 'normal',
                }}
              >
                {ontrip == '' ? (
                  <Body
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Thumbnail
                      style={{
                        height: 150,
                        width: 150,
                      }}
                      square
                      source={require('.././assets/img/no_data.png')}
                    ></Thumbnail>
                    <Text style={{ marginTop: 15 }}>
                      {strings.sorry_no_data_available}
                    </Text>
                  </Body>
                ) : (
                  <PTRView onRefresh={() => this._refresh()}>
                    <ScrollView style={{ marginTop: 15 }}>{ontrip}</ScrollView>
                  </PTRView>
                )}
              </Tab>
              <Tab
                heading={'Previous Reservations'}
                tabStyle={{ backgroundColor: colors.bg_one }}
                activeTabStyle={{ backgroundColor: colors.bg_one }}
                textStyle={{
                  color: colors.sp_subtext_fg,
                  fontFamily: colors.font_family,
                }}
                activeTextStyle={{
                  color: colors.theme_fg,
                  fontFamily: colors.font_family,
                  fontWeight: 'normal',
                }}
              >
                {completed == '' ? (
                  <Body
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Thumbnail
                      style={{
                        height: 150,
                        width: 150,
                      }}
                      square
                      source={require('.././assets/img/no_data.png')}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
