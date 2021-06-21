/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, Button } from 'react-native';
import { DrawerActions } from 'react-navigation';

export default class Test extends Component<Props> {
  static navigationOptions = {
    drawerLabel: 'Home'
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.toggleDrawer()}
        title="Go to notifications"
      />
    );
  }
}
