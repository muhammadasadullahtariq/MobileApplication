/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
export default class Logout extends Component{

  static navigationOptions = {
    header:null
  }
  
  componentWillMount() {
      this.resetMenu();
  }


  resetMenu() {
   this.props
     .navigation
     .dispatch(StackActions.reset({
       index: 0,
       actions: [
         NavigationActions.navigate({
           routeName: 'Login'
         }),
       ],
     }))
  }
  render () {
    return (
      <View></View>
    );
  }
}

