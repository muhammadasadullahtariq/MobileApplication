import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  AppState,
} from "react-native";
import * as colors from "./assets/css/Colors";
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  DrawerItems,
  createSwitchNavigator,
} from "react-navigation";
import RNStart from 'react-native-restart';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Login from "./screens/Login";
import Splashscreen from "./screens/Splashscreen";
import Register from "./screens/Register";
import Forgot from "./screens/Forgot";
import Otp from "./screens/Otp";

import RestaurantList from "./screens/RestaurantList";
import RestaurantDetail from "./screens/RestaurantDetail";
import Menu from "./screens/Menu";
import ResetPassword from "./screens/ResetPassword";

import Logout from "./screens/Logout";
import Cart from "./screens/Cart";
import Success from "./screens/Success";
import ViewMap from "./screens/ViewMap";
import MenuOption from "./screens/MenuOption";
import Filter from "./screens/Filter";
import Address from "./screens/Address";
import ManageAddress from "./screens/ManageAddress";
import Review from "./screens/Review";
import OrderHistory from "./screens/OrderHistory";
import Booking from "./screens/Booking";
import CustomerReview from "./screens/CustomerReview";
import Profile from "./screens/Profile";
import Search from "./screens/Search";
import Favourites from "./screens/Favourites";
import TableBooking from "./screens/TableBooking";
import ReservationHistory from "./screens/ReservationHistory";
import ReservationReview from "./screens/ReservationReview";
import strings from "./screens/stringsoflanguages";

import Verify from "./screens/Verify";
/*const DrawerNavigator = createDrawerNavigator({
  
  RestaurantList: { screen: RestaurantList, navigationOptions: {
                gesturesEnabled: true,
            } },
  OrderHistory: { screen: OrderHistory, navigationOptions: {
              gesturesEnabled: true,
          } }
},{
  contentComponent: SideMenu,
  drawerWidth: 220
});*/
const TabNavigator = createMaterialBottomTabNavigator(
  {
    RestaurantList: {
      screen: RestaurantList,
      navigationOptions: {
        tabBarLabel: strings.tab_Home,
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        ),
      },
    },
    Cart: {
      screen: Cart,
      navigationOptions: {
        tabBarLabel: strings.tab_cart,
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-cart" color={tintColor} size={24} />
        ),
      },
    },
    OrderHistory: {
      screen: OrderHistory,
      navigationOptions: {
        tabBarLabel: "Orders",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-bookmark" color={tintColor} size={24} />
        ),
      },
    },
    ReservationHistory: {
      screen: ReservationHistory,
      navigationOptions: {
        tabBarLabel: "Bookings",
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="format-list-checks"
            color={tintColor}
            size={24}
          />
        ),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: strings.tab_Profile,
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-person" color={tintColor} size={24} />
        ),
      },
    },
  },
  {
    initialRouteName: "RestaurantList",
    activeColor: colors.theme_fg,
    activeTintColor: colors.theme_fg,
    inactiveTintColor: colors.icons,
    inactiveColor: colors.theme_fg,
    shifting: false,
    barStyle: { backgroundColor: colors.theme_button_fg, borderTopWidth: 0 },
    style: { borderTopWidth: 0 },
  }
);

const AppNavigator = createStackNavigator(
  {
    Splashscreen: { screen: Splashscreen },
    Login: { screen: Login },
    Register: { screen: Register },
    Forgot: { screen: Forgot },
    Otp: { screen: Otp },
    ResetPassword: { screen: ResetPassword },
    Cart: { screen: Cart },
    Success: { screen: Success },

    /* RestaurantList: { screen: DrawerNavigator, navigationOptions: {
        header: null
      } },*/
    RestaurantList: {
      screen: TabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    RestaurantDetail: { screen: RestaurantDetail },
    ViewMap: { screen: ViewMap },
    Menu: { screen: Menu },
    MenuOption: { screen: MenuOption },
    Filter: { screen: Filter },
    Address: { screen: Address },
    Logout: { screen: Logout },
    ManageAddress: { screen: ManageAddress },
    Review: { screen: Review },
    Booking: { screen: Booking },
    CustomerReview: { screen: CustomerReview },
    Search: { screen: Search },
    Profile: { screen: Profile },
    OrderHistory: { screen: OrderHistory },
    Favourites: { screen: Favourites },
    TableBooking: { screen: TableBooking },
    ReservationReview: { screen: ReservationReview },
    Verify: { screen: Verify },
  },
  {
    initialRouteName: "Splashscreen",
  }
);

export default createAppContainer(AppNavigator);
// export default ;

