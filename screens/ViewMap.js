/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Thumbnail,
  Text,
  Image,
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
} from "native-base";
import * as colors from "../assets/css/Colors";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg_one,
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default class ViewMap extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      details: this.props.navigation.getParam("details"),
      markers: {
        title: this.props.navigation.getParam("details").location_name,
        coordinates: {
          latitude: parseFloat(
            this.props.navigation.getParam("details").location_lat
          ),
          longitude: parseFloat(
            this.props.navigation.getParam("details").location_lng
          ),
        },
        description: this.props.navigation.getParam("details").description,
      },
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    // this.setState({showIndicator:true});
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.navigate("Menu", {
      details: this.state.details,
    });
    //this.props.navigation.goBack(null);
    return true;
  }

  render() {
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
              <Text>{this.state.details.location_name}</Text>
            </Title>
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                color: colors.theme_button_fg,
                fontSize: 10
              }}
            >
              {this.state.details.location_address_1},
              {this.state.details.location_address_2},{" "}
              {this.state.details.location_city}
            </Text>
          </Body>
          <Right></Right>
        </Header>

        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: parseFloat(this.state.details.location_lat),
              longitude: parseFloat(this.state.details.location_lng),
              latitudeDelta: 0.015,
              longitudeDelta: 0.0152,
            }}
          >
            <Marker
              coordinate={this.state.markers.coordinates}
              title={this.state.markers.title}
              description={this.state.markers.description}
            >
              <Image
                square
                style={{ width: 40, height: 55 }}
                source={require(".././assets/img/marker_restaurant.png")}
              ></Image>
            </Marker>
          </MapView>
        </View>
      </Container>
    );
  }
}
