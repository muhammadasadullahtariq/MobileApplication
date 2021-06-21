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
import { Divider, Rating } from 'react-native-elements';
import { DrawerActions } from 'react-navigation';
import { Div } from 'react-native-div' ;
import StarRatingBar from 'react-native-star-rating-view/StarRatingBar'
export default class RestaurantDetail extends Component<Props> {
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
  
  

  menu = () => {
    this.props.navigation.navigate('Menu');
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
        <Left style={{flex: 1, color:'#FFFFFF'}}>
            <Button onPress={()=> this.handleBackButtonClick()} transparent>
              <Icon style={{color:'#FFFFFF'}} name='arrow-back' />
            </Button>
        </Left>
        <Body style={{flex: 3,justifyContent: 'center'}}>
          <Title style={{alignSelf:'center', color:'#FFFFFF'}} >DAIRY QUEEN STORE</Title>
        </Body>
        <Right>

        </Right>
      </Header>
      <ScrollView>
      <Content style={{ marginBottom:20 }} >
          <Grid>
            <Row>
                <Thumbnail style={{ width:'100%', height:150 }} square source={require('.././img/restaurant1.jpg')} />
            </Row>
            <Row>
                <Content style={styles.firstblock}>
                  <Row style={styles.gallery}>
                      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant1.jpg')} />
                  
                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant3.jpg')} />
                   
                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant4.jpeg')} />
                  
                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant2.jpeg')} />

                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant1.jpg')} />
                  
                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant3.jpg')} />
                   
                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant4.jpeg')} />
                  
                      <Thumbnail style={{ width:70, height:90, borderRadius:5, marginRight:10 }} square source={require('.././img/restaurant2.jpeg')} />
                      
                      </ScrollView>
                  </Row>
                  <Row>
                    <Left><Text style={styles.restaurantname}>DAIRY QUEEN STORE</Text></Left>
                    <Right style={{ marginRight:10 }} ><Button danger style={styles.ratingbtn} ><Text style={{ fontSize:10, marginLeft:5, marginRight:5, color:'#FFFFFF' }}><Icon style={{ fontSize:13 }} name='star' />4.3</Text></Button></Right>
                  </Row>
                  <Row>
                    <Text style={styles.description}>American Dairy Queen Corporation</Text>
                  </Row>
                  <Row>
                    <Text style={styles.address}>3619 W Olympic Blvd, Log Angels, CA 90019, USA {"\n"}Phone: +1 323-734-8714</Text>
                  </Row>
                  <Row>
                      <Body>
                        <Div style={styles.contentbox}>
                          <Col style={styles.contentboxItem}>
                              <Icon style={{ fontSize:15, color:'#FD725F' }} name='clipboard' />
                              <Text style={{ fontSize:12, color: '#FD725F' }} >FOOD MENU</Text>
                          </Col>
                          <Col style={{ width:10, justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ fontSize:25, color: '#FD725F' }} >|</Text>
                          </Col>
                          <Col style={styles.contentboxItem}>
                              <Icon style={{ fontSize:15, color:'#FD725F' }} name='pin' />
                              <Text style={{ fontSize:12, color: '#FD725F' }} >LOCATION</Text>
                          </Col>
                          <Col style={{ width:10, justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ fontSize:25, color: '#FD725F' }} >|</Text>
                          </Col>
                          <Col style={styles.contentboxItem}>
                              <Icon style={{ fontSize:15, color:'#FD725F' }} name='call' />
                              <Text style={{ fontSize:12, color: '#FD725F' }} >CONTACT</Text>
                          </Col>
                        </Div>
                      </Body>
                  </Row>
                  <Row>
                    <Left><Text style={{ marginLeft:10, color:'#FD5240', fontSize:14 }}>About Restaurant</Text></Left>
                    <Right style={{ marginRight:10 }} ><Text style={{ color:'#B77467', fontSize:14 }}>Read More</Text></Right>
                  </Row>
                  <Row>
                    <Text style={styles.detail}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                  </Row>
                  <Row style={styles.actionbuttons}>
                    <Col>
                      <Button block style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', height:40, backgroundColor: '#FFFFFF', borderColor: '#FD4431', color:'#FD4431' }}><Text style={{ color:'#FD4431' }} ><Icon style={{ color:'#FD4431', fontSize:16 }} name='restaurant' /> BOOK A TABLE</Text></Button>
                    </Col>
                    <Col style={{ width:'10%' }}> 
                    </Col>
                    <Col>
                      <Button block onPress={this.menu} style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', height:40, backgroundColor: '#FFFFFF', borderColor: '#FD4431', color:'#FD4431' }}><Text style={{ color:'#FD4431' }} ><Icon style={{ color:'#FD4431', fontSize:16 }} name='pizza' /> ORDER FOOD</Text></Button>
                    </Col>
                  </Row>
                </Content>
            </Row>
            <Row>
              <Content style={styles.secondblock}>
                  <Row style={{ marginTop:10, marginBottom : 10 }}>
                    <Left><Text style={{ marginLeft:10, color:'#FD5240', fontSize:14 }}>Reviews</Text></Left>
                    <Right style={{ marginRight:10 }} ><Text style={{ color:'#B77467', fontSize:14 }}>View All</Text></Right>
                  </Row>
                  <Divider style={{ backgroundColor: '#FD4431' }} />
                  <Row style={{ marginTop:10 }}>
                    <Left><Text style={styles.customername}>Hanie Lieza martin</Text></Left>
                    <Right style={{ marginRight:10, width : 100 }} ><StarRatingBar
                         starStyle={{
                            width: 12,
                            height: 12
                        }}
                        tintColor='#FD4431'
                        score={4.5}
                        dontShowScore={true}
                        allowsHalfStars={true}
                        accurateHalfStars={true}
                    /></Right>
                  </Row>
                  <Row>
                    <Text style={styles.comment}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Text>
                  </Row>
                  <Row>
                    <Text style={styles.date}>20th OCT - 2018 / Los Angels, CA 900019, USA</Text>
                  </Row>
                </Content>
            </Row>
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
  actionbuttons: {
    marginLeft:10,
    marginRight:10,
    marginBottom:20,

  },
  firstblock: {
    backgroundColor: '#FCD0C7',
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%',
    marginTop:-40,
    borderRadius:3
  },
  secondblock: {
    backgroundColor: '#FCD0C7',
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%',
    marginTop:20,
    borderRadius:3
  },
  restaurantname: {
    marginLeft:10,
    color:'#FD5240',
    fontSize:14,
  },
  gallery:{
    paddingTop:20,
    paddingBottom:10,
    paddingLeft:10
  },
  contentbox:{
    height:50,
    backgroundColor:'#FFFFFF',
    borderRadius:3,
    borderWidth: 1,
    borderColor: '#FD4431',
    marginTop:10,
    marginBottom:10,
    width:'95%'
  },
  contentboxItem:{
    justifyContent: 'center',
    alignItems: 'center',
    color:'#FD725F'
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
    marginLeft:10,
    color:'#A0908C',
    paddingBottom:10,

  },
  address:{
    fontSize:10,
    textAlign:'left',
    marginLeft:10,
    color:'#8D7C78',
    fontWeight:'bold',
  },
  customername:{
    fontSize:12,
    textAlign:'left',
    marginLeft:10,
    color:'#8D7C78',
    fontWeight:'bold',
  },
  detail:{
    fontSize:12,
    textAlign:'left',
    marginLeft:10,
    marginTop:10,
    marginRight:10,
    marginBottom:10,
    color:'#8D7C78',

  },
  comment:{
    fontSize:12,
    textAlign:'left',
    marginLeft:10,
    marginTop:10,
    marginRight:10,
    marginBottom:5,
    color:'#CB8E81',
    fontWeight:'bold',
  },
  date:{
    fontSize:10,
    textAlign:'left',
    marginLeft:10,
    marginBottom:10,
    color:'#A7938E',
  },
  contentrow:{
    marginLeft:10
  },
  ratingbtn:{
   height:20,
   fontSize:10,
   backgroundColor:'#FD5240',
  },
  rating: {
   fontSize:10,
  },

});
