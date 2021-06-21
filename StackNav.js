import React, { Component } from 'react';
import { Icon } from 'native-base';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Login from './screens/Login';
import Splashscreen from './screens/Splashscreen';
import Register from './screens/Register';
import Forgot from './screens/Forgot';
import Otp from './screens/Otp';
import Home from './screens/Home';
import RestaurantList from './screens/RestaurantList';
import RestaurantDetail from './screens/RestaurantDetail';
import Menu from './screens/Menu';
import Test from './screens/Test';

const AppNavigator = createStackNavigator({
   
  Splashscreen: { screen: Splashscreen },
  Login: { screen: Login },
  Register: { screen: Register },
  Forgot: { screen: Forgot },
  Otp: { screen: Otp },
  Home: { screen: Home },
  RestaurantList: { screen: RestaurantList },
  RestaurantDetail: { screen: RestaurantDetail },
  Menu: { screen: Menu },
  
});
