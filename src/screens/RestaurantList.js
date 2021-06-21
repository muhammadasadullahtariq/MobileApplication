/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, BackHandler, ScrollView } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Icon, Content, List, ListItem, Thumbnail, Row, Col, Grid } from 'native-base';
import { Divider } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
export default class RestaurantList extends Component<Props> {
  static navigationOptions = {
  	header:null
	}

  /*static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerTitle: 'New Task',
      headerLeft: <Button title="Save" onPress={() => navigation.openDrawer() } />,
    }
  }*/
  
  hotelDetail = () => {
    this.props.navigation.navigate('RestaurantDetail');
  }

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  render() {

    return (
      <Container>
      <Header style={{backgroundColor:'#FF6149'}} >
        <Left style={{flex: 1, color:'#FD4431'}}>
          <Button transparent>
            <Icon style={{color:'#FFFFFF'}} name='menu' />
          </Button>
        </Left>
        <Body style={{flex: 3,justifyContent: 'center'}}>
          <Title style={{alignSelf:'center', color:'#FFFFFF'}} >RESTAURANTS LIST</Title>
        </Body>
        <Right>

        </Right>
      </Header>
      <ScrollView>
      <Content style={styles.rows}>
          <Grid style={styles.list} onPress={this.hotelDetail}>
            <Col style={{ width:100 }} >
                <Thumbnail style={{ width:100, height:120 }} square source={require('.././img/restaurant1.jpg')} />
            </Col>
            <Col>
               <Text style={styles.name}>DAIRY QUEEN STORE</Text>
               <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
               <Row style={styles.contentrow}>
                  <Left><Button bordered warning style={styles.ratingbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='star' />4.3</Text></Button></Left>
                  <Body></Body>
                  <Right style={{ marginRight:10 }} ><Button bordered warning style={styles.locationbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='pin' /> 63 KMS</Text></Button></Right>
               </Row>
               <Divider style={{ backgroundColor: '#FD4431' }} />
               <Row style={styles.contentrow}>
                  <Left><Icon style={{ color: '#FD4431', fontSize:18  }} name="heart" /></Left>
                  <Right style={{ width: 120 }}><Button bordered warning style={styles.choosebtn} ><Text style={{ color: '#FFFFFF', fontSize:11, paddingLeft:5, paddingRight:5 }} >Starts from $12</Text></Button></Right>
               </Row>
            </Col>
          </Grid>
          <Grid style={styles.list}>
            <Col style={{ width:100 }} >
                <Thumbnail style={{ width:100, height:120 }} square source={require('.././img/restaurant3.jpg')} />
            </Col>
            <Col>
               <Text style={styles.name}>DAIRY QUEEN STORE</Text>
               <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
               <Row style={styles.contentrow}>
                  <Left><Button bordered warning style={styles.ratingbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='star' />4.3</Text></Button></Left>
                  <Body></Body>
                  <Right style={{ marginRight:10 }} ><Button bordered warning style={styles.locationbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='pin' /> 63 KMS</Text></Button></Right>
               </Row>
               <Divider style={{ backgroundColor: '#FD4431' }} />
               <Row style={styles.contentrow}>
                  <Left><Icon style={{ color: '#FD4431', fontSize:18  }} name="heart" /></Left>
                  <Right style={{ width: 120 }}><Button bordered warning style={styles.choosebtn} ><Text style={{ color: '#FFFFFF', fontSize:11, paddingLeft:5, paddingRight:5 }} >Starts from $12</Text></Button></Right>
               </Row>
            </Col>
          </Grid>
          <Grid style={styles.list}>
            <Col style={{ width:100 }} >
                <Thumbnail style={{ width:100, height:120 }} square source={require('.././img/restaurant4.jpeg')} />
            </Col>
            <Col>
               <Text style={styles.name}>DAIRY QUEEN STORE</Text>
               <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
               <Row style={styles.contentrow}>
                  <Left><Button bordered warning style={styles.ratingbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='star' />4.3</Text></Button></Left>
                  <Body></Body>
                  <Right style={{ marginRight:10 }} ><Button bordered warning style={styles.locationbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='pin' /> 63 KMS</Text></Button></Right>
               </Row>
               <Divider style={{ backgroundColor: '#FD4431' }} />
               <Row style={styles.contentrow}>
                  <Left><Icon style={{ color: '#FD4431', fontSize:18  }} name="heart" /></Left>
                  <Right style={{ width: 120 }}><Button bordered warning style={styles.choosebtn} ><Text style={{ color: '#FFFFFF', fontSize:11, paddingLeft:5, paddingRight:5 }} >Starts from $12</Text></Button></Right>
               </Row>
            </Col>
          </Grid>
          <Grid style={styles.list}>
            <Col style={{ width:100 }} >
                <Thumbnail style={{ width:100, height:120 }} square source={require('.././img/restaurant2.jpeg')} />
            </Col>
            <Col>
               <Text style={styles.name}>DAIRY QUEEN STORE</Text>
               <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
               <Row style={styles.contentrow}>
                  <Left><Button bordered warning style={styles.ratingbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='star' />4.3</Text></Button></Left>
                  <Body></Body>
                  <Right style={{ marginRight:10 }} ><Button bordered warning style={styles.locationbtn} ><Text style={{ fontSize:12, marginLeft:5, marginRight:5 }}><Icon style={{ fontSize:15 }} name='pin' /> 63 KMS</Text></Button></Right>
               </Row>
               <Divider style={{ backgroundColor: '#FD4431' }} />
               <Row style={styles.contentrow}>
                  <Left><Icon style={{ color: '#FD4431', fontSize:18  }} name="heart" /></Left>
                  <Right style={{ width: 120 }}><Button bordered warning style={styles.choosebtn} ><Text style={{ color: '#FFFFFF', fontSize:11, paddingLeft:5, paddingRight:5 }} >Starts from $12</Text></Button></Right>
               </Row>
            </Col>
          </Grid>
        </Content>
        </ScrollView>
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rows: {
    padding:20,
  },
  name:{
    color:'#FF6149',
    fontSize:14,
    textAlign:'left',
    marginLeft:10
  },
  description:{
    fontSize:10,
    textAlign:'left',
    marginLeft:10
  },
  contentrow:{
    marginLeft:10
  },
  ratingbtn:{
   height:30,
   fontSize:10
  },
  locationbtn:{
   height:30,
   fontSize:10,
  },
  list: {
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#FD4431',
    marginBottom:10
  },
  marginleft: {
    marginLeft:10
  },
  rating: {
   fontSize:10,
  },
  choosebtn: {
    backgroundColor:'#FF6149',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#FF6149',
    height:27,
    color:'#FFFFFF',
    marginRight:10,
  },
  ratingblock: {
    borderRadius:3,
    borderWidth: 1,
    borderColor: '#FD4431',
    
  },

});
