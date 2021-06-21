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
import StarRatingBar from 'react-native-star-rating-view/StarRatingBar';
import UIStepper from 'react-native-ui-stepper';
import Dialog, { DialogFooter, DialogButton, DialogContent, SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
export default class Menu extends Component<Props> {
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
  state = {
    visible:false
  }
  setValue = (value) => {
    // do something with value
  }
  

  forgotPassword = () => {
    this.props.navigation.navigate('Forgot');
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
                  <Row style={{ paddingTop:20, paddingBottom:20 }}>
                    <Col style={{ width:'75%' }}>
                     <Row>
                     <Text style={styles.restaurantname}>DAIRY QUEEN STORE</Text>
                     <Button danger style={styles.ratingbtn} ><Text style={{ fontSize:10, marginLeft:5, marginRight:5, color:'#FFFFFF' }}><Icon style={{ fontSize:13 }} name='star' />4.3</Text></Button>
                     </Row>
                     <Text style={styles.description}>American Dairy Queen Corporation</Text>
                     <Text style={styles.address}>3619 W Olympic Blvd, Log Angels, CA 90019, USA Phone: +1 323-734-8714</Text>
                    </Col>
                    <Col style={{ width:'25%' }}>
                        <Thumbnail style={{ borderWidth:1, borderColor:'#FD4431', marginRight:10 }} source={require('.././img/static_map.png')} />
                    </Col>
                  </Row>
                </Content>
            </Row>
            <Row>
              <Content style={{ paddingTop:20, paddingBottom:20, marginLeft:'5%', marginRight:'5%' }} > 
                  <Row>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                      <Button small style={{ backgroundColor:'#FD5240', color:'#FFFFFF', marginRight:10 }} >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10, color:'#FFFFFF' }}>Most Popular</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered warning >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>VEG ROLL</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered danger >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>CHICKEN ROLL</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered success >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>BURGERS</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered info >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>PIZZA'S</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered warning >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>FRIED RICE</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered danger >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>MEALS</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered primary >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>JUICE</Text>
                      </Button>
                      <Button small style={{ marginRight:10 }} bordered success >
                        <Text style={{ marginLeft:5, marginRight:5, fontSize:10 }}>SWEETS</Text>
                      </Button>
                    </ScrollView>
                  </Row>
                </Content>
            </Row>
            <Row>
              <Content style={{ paddingBottom:20, marginLeft:'5%', marginRight:'5%' }} > 
                  <Row style={{ borderColor:'#FD4431', borderRadius:3, borderWidth:1, marginBottom:10 }}>
                    <Col style={{ width:'25%' }} >
                        <Thumbnail style={{ width:'95%', height:75 }} square source={require('.././img/food1.jpeg')} />
                    </Col>
                    <Col style={{ width:'50%' }}>
                       <Text style={styles.name} onPress={() => { this.setState({ visible: true }); }} >Cubano Chicken Roll</Text>
                       <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
                       <Text style={styles.price}>Start From $11.00</Text>
                    </Col>
                    <Col>
                      <Div style={{ marginTop:10 }} ></Div>
                        <UIStepper displayValue height={15} width={60} fontSize={15} borderColor="#FD4431" textColor="#FD4431" overrideTintColor tintColor="#FD4431" borderRadius={3}  />
                        <Text style={{ fontSize:16, color:'#FF6149', marginTop:10 }}>$11.00</Text>
                    </Col>
                  </Row>
                  <Row style={{ borderColor:'#FD4431', borderRadius:3, borderWidth:1, marginBottom:10  }}>
                    <Col style={{ width:'25%' }} >
                        <Thumbnail style={{ width:'95%', height:75 }} square source={require('.././img/food2.jpg')} />
                    </Col>
                    <Col style={{ width:'50%' }} >
                       <Text style={styles.name}>Cubano Chicken Roll</Text>
                       <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
                       <Text style={styles.price}>Start From $11.00</Text>
                    </Col>
                    <Col>
                      <Div style={{ marginTop:10 }} ></Div>
                        <UIStepper displayValue height={15} width={60} fontSize={15} borderColor="#FD4431" textColor="#FD4431" overrideTintColor tintColor="#FD4431" borderRadius={3}  />
                        <Text style={{ fontSize:16, color:'#FF6149', marginTop:10 }}>$11.00</Text>
                    </Col>
                  </Row>
                  <Row style={{ borderColor:'#FD4431', borderRadius:3, borderWidth:1, marginBottom:10  }}>
                    <Col style={{ width:'25%' }} >
                        <Thumbnail style={{ width:'95%', height:75 }} square source={require('.././img/food3.jpg')} />
                    </Col>
                    <Col style={{ width:'50%' }} >
                       <Text style={styles.name}>Cubano Chicken Roll</Text>
                       <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
                       <Text style={styles.price}>Start From $11.00</Text>
                    </Col>
                    <Col>
                      <Div style={{ marginTop:10 }} ></Div>
                        <UIStepper displayValue height={15} width={60} fontSize={15} borderColor="#FD4431" textColor="#FD4431" overrideTintColor tintColor="#FD4431" borderRadius={3}  />
                        <Text style={{ fontSize:16, color:'#FF6149', marginTop:10 }}>$11.00</Text>
                    </Col>
                  </Row>
                  <Row style={{ borderColor:'#FD4431', borderRadius:3, borderWidth:1, marginBottom:10  }}>
                    <Col style={{ width:'25%' }} >
                        <Thumbnail style={{ width:'95%', height:75 }} square source={require('.././img/food4.jpeg')} />
                    </Col>
                    <Col style={{ width:'50%' }} >
                       <Text style={styles.name}>Cubano Chicken Roll</Text>
                       <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
                       <Text style={styles.price}>Start From $11.00</Text>
                    </Col>
                    <Col>
                      <Div style={{ marginTop:10 }} ></Div>
                        <UIStepper displayValue height={15} width={60} fontSize={15} borderColor="#FD4431" textColor="#FD4431" overrideTintColor tintColor="#FD4431" borderRadius={3}  />
                        <Text style={{ fontSize:16, color:'#FF6149', marginTop:10 }}>$11.00</Text>
                    </Col>
                  </Row>
                  <Row style={{ borderColor:'#FD4431', borderRadius:3, borderWidth:1, marginBottom:10  }}>
                    <Col style={{ width:'25%' }} >
                        <Thumbnail style={{ width:'95%', height:75 }} square source={require('.././img/food5.jpg')} />
                    </Col>
                    <Col style={{ width:'50%' }} >
                       <Text style={styles.name}>Cubano Chicken Roll</Text>
                       <Text style={styles.description}>This is a chain of soft serve ice cream ans fast food restaurant.</Text>
                       <Text style={styles.price}>Start From $11.00</Text>
                    </Col>
                    <Col>
                      <Div style={{ marginTop:10 }} ></Div>
                        <UIStepper displayValue height={15} width={60} fontSize={15} borderColor="#FD4431" textColor="#FD4431" overrideTintColor tintColor="#FD4431" borderRadius={3}  />
                        <Text style={{ fontSize:16, color:'#FF6149', marginTop:10 }}>$11.00</Text>
                    </Col>
                  </Row>
                </Content>
            </Row>
          </Grid>
      </Content>
      </ScrollView>
      <Dialog
        visible={this.state.visible}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        onTouchOutside={() => {
          this.setState({ visible: false });
        }}
      >
        <DialogContent style={{ width:250, height:300 }}>
          <Row>
            <Text style={{ color:'#FF6149', fontSize:16, textAlign:'center' }}>Fresh Tomatoes Pizza</Text>
          </Row>
        </DialogContent>
      </Dialog>
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
  price:{
    color:'#B77467',
    fontSize:12,
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
   marginLeft:20
  },
  rating: {
   fontSize:10,
  },

});
