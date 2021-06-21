import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  AsyncStorage,
  Dimensions,
  BackHandler,
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
  Row,
  Thumbnail,
} from "native-base";
import { Divider } from "react-native-elements";
import { NavigationActions, StackActions } from "react-navigation";
import { Div } from "react-native-div";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AnimateLoadingButton from "react-native-animate-loading-button";
import * as colors from "../assets/css/Colors";
import strings from "./stringsoflanguages";

export default class Success extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      reservation_id: this.props.navigation.getParam("reservation_id"),
      unique_code: this.props.navigation.getParam("unique_code"),
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
      from: this.props.navigation.getParam("from"),
    };
    this.update = this.update.bind(this);
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

  _spring() {
    var cnt = this.state.backClickCount + 1;
    this.setState({ backClickCount: cnt });
  }

  handleBackButtonClick = () => {
    this.setState({ backClickCount: 0 });
    this._spring();

    return true;
  };

  Success = async () => {
    this.loadingButton.showLoading(true);
    /*const navigateAction = NavigationActions.navigate({
      routeName: 'OrderHistory'
    });
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [navigateAction ],
    }));*/
    // this.props.navigation.navigate('OrderHistory');
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
  };
  Home = async () => {
    /*this.loadingButton.showLoading(true);
      const navigateAction = NavigationActions.navigate({
        routeName: 'OrderHistory'
      });
      this.props.navigation.dispatch(navigateAction);*/
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
  };

  update = (value, each) => {
    this.setState({ val: parseFloat(parseInt(value) * each).toFixed(2) });
  };

  render() {
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
            backgroundColor={colors.header}
            networkActivityIndicatorVisible={true}
          />
          <Left style={{ flex: 1, color: colors.theme_button_fg }}>
            <Button transparent>
              <Icon
                onPress={this.Home}
                style={{
                  color: colors.theme_button_fg,
                  fontSize: 25,
                  marginLeft: 15,
                }}
                name="home"
              />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: "center" }}>
            <Title
              style={{ alignSelf: "center", color: colors.theme_button_fg }}
            >
              <Text>{strings.success}</Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
        <Content style={styles.firstblock}>
          <Row>
            <Content>
            <Body
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 100,
                  paddingBottom: 30,              
                }}
              >
                <Thumbnail
                  style={{
                    height: 300,
                    width: 300,
                  }}
                  square
                  source={require(".././assets/img/cooker1.png")}
                ></Thumbnail>
              {/* <Text style={styles.successname}>{strings.success}</Text> */}
              <Div style={{ marginTop: 20 }}></Div>
              <Text style={styles.detail}>
                {this.state.from == "Cart"
                  ? strings.success_text
                  : strings.succes_text2}
              </Text>
              </Body>
              {/*<ImageBackground style={{ width:'100%', height:60 }} source={require('.././img/success_bg.png')} >
              <Text style={styles.rese_detail}>Reservation ID : {this.state.reservation_id}</Text>
              <Divider style={{ backgroundColor: '#FFFFFF',marginLeft:'40%',marginRight:'40%' }} />
              <Text style={styles.rese_detail}>Unique Code : {this.state.unique_code}</Text>
            </ImageBackground>*/}
            </Content>
          </Row>
          <Row>
            <Content style={{ marginBottom: "2%" }}>
              <View>
                <AnimateLoadingButton
                  ref={(c) => (this.loadingButton = c)}
                  width={this.state.screenWidth - 20}
                  height={40}
                  title={strings.done}
                  titleFontSize={15}
                  titleColor={colors.theme_button_fg}
                  backgroundColor={colors.theme_fg}
                  borderRadius={5}
                  titleFontFamily={colors.font_family}
                  onPress={this.Success}
                />
              </View>
            </Content>
          </Row>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg_one,
  },
  icon: {
    color: colors.icons,
    fontSize: 90,
    marginTop: "30%",
    textAlign: "center",
  },
  actionbuttons: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  firstblock: {
    //backgroundColor: colors.bg_two,
  },
  successname: {
    color: colors.theme_fg,
    fontSize: 22,
    textAlign: "center",
  },
  detail: {
    textAlign: "center",
    color: colors.icons,
    fontSize: 14,
    marginRight: "20%",
    marginLeft: "20%",
  },

  rese_detail: {
    textAlign: "center",
    color: colors.theme_button_fg,
    fontSize: 14,
    marginRight: "20%",
    marginLeft: "20%",
    paddingTop: 5,
    paddingBottom: 5,
  },
});
