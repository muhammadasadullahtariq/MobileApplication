/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight, BackHandler, ScrollView, StatusBar, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Icon, Content,Thumbnail, Row, Col, Grid, Radio, Footer } from 'native-base';
import { Divider } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import * as colors from '../assets/css/Colors';
import Dialog from "react-native-dialog";
import ReadMore from 'react-native-read-more-text';
import { img_url } from '../config/Constants';
import strings from './stringsoflanguages';
export default class Review extends Component {
  static navigationOptions = {
    header:null
  }

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        showIndicator:true,
        details: this.props.navigation.getParam('details'),
        user_id:0,
        dialogVisible:false,
        dialog_name:'',
        dialog_description:''
        } 
        this.retrieveData();  
  }
  menu = () => {
    if(this.state.details.categories.length > 0)
    {
      if(this.state.user_id == 0){
        this.props.navigation.navigate('Login');
      }else{
        this.props.navigation.navigate('Menu',{ details: this.state.details,from:'review' });
      }
    }
    else{
      this.showSnackbar('Menus are not available now!');
    }  
  }

  componentDidMount() {
    this.setState({showIndicator:false});
  }
  retrieveData = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (user_id !== null) {
        await this.setState({user_id:user_id});
      }
    } catch (error) {
      
    }
  };
  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      this.setState({showIndicator:true});
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }
  showDialog = (name,description) => {
    this.setState({ 
      dialog_name:name,
      dialog_description:description,
      dialogVisible: true 
    });
  };
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
  _renderTruncatedFooter = (handlePress) => {
    return (
    <Text style={styles.readmore} onPress={() => this.showDialog(val.first_name,val.review_text)}>{strings.read_more}</Text>
		);
	}

  render() {
    
    let reviews = this.state.details.ratings.map((val,key) => {
      return(
        <Grid style={styles.list}>
        <Row>
        <Col style={{ width:'20%' }} >
            <TouchableHighlight >
                <Thumbnail style={{ width:50, height:50 }} square source={require('.././img/user_default.png')} />
            </TouchableHighlight>  
        </Col>
        <Col style={{ width:'85%' }} > 
        <Row>
          <Col style={{ width:'60%' }} >     
            <Text style={styles.name}>{val.first_name}</Text>
          </Col>
          <Col style={{ width:'15%' }} >  
            <StarRating
                disabled={false}
                maxStars={5}
                rating={val.overall}
                starSize={14}
                fullStarColor={colors.theme_fg}
                emptyStarColor={colors.theme_fg}
                containerStyle={{width:20,marginTop:5,marginLeft:20}}
            />
          </Col>  
        </Row>
          <Row>
            <Text style={styles.description}>{val.date_added}</Text>
          </Row>

          <Row>
          
            <ReadMore 
              numberOfLines={2} 
              onReady={this._renderTruncatedFooter}>
              <Text style={styles.address} >{val.review_text}</Text>
            </ReadMore>
            
          </Row>
        </Col>
        </Row>
        <Divider style={{color:colors.divider, marginBottom:10, marginTop:10 }} />
        </Grid> 
        
      )
     
      });
    return (
      <Container>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Review</Dialog.Title>
          <Dialog.Description>
            <Text style={styles.name}>{this.state.dialog_name}</Text>{"\n"}
              <Text style={styles.address}>{this.state.dialog_description}</Text>
          </Dialog.Description>
          <Dialog.Button label="Ok" onPress={this.handleCancel} />
        </Dialog.Container>
      <Header style={{backgroundColor:colors.theme_fg}}            
      androidStatusBarColor={colors.header}>
         <StatusBar barStyle="light-content" />
        <Left style={{flex: 1, color:colors.theme_button_fg}}>
            <Button onPress={()=> this.handleBackButtonClick()} transparent>
              <Icon style={{color:colors.theme_button_fg}} name='arrow-back' />
            </Button>
        </Left>
        <Body style={{flex: 3,justifyContent: 'center'}}>
          <Title style={{alignSelf:'center', color:colors.theme_button_fg}} ><Text>{this.state.details.location_name}</Text></Title>
        </Body>
        <Right>

        </Right>
      </Header>
      <ScrollView>
      <Content style={{ marginBottom:20,marginTop:20,marginRight:20,marginLeft:20 }} >
          <Grid>
            <Row>
                <Thumbnail style={{ width:'100%', height:150, borderRadius:5 }} square source={{uri : img_url + this.state.details.profile_image}} />
            </Row>
           
            <Row style={{marginBottom:10,marginTop:20}}>
                
                <Col style={{width:'50%',justifyContent:'center',alignItems:'center'}}>
                <Button small style={styles.category_btn} >
  <Text onPress={this.menu} style={{ marginLeft:5, marginRight:5, fontSize:14 }}>{strings.menus}</Text>
                </Button>
                
                </Col>
                <Col style={{width:'50%',justifyContent:'center',alignItems:'center'}}>
                    <Body>
                <Button small style={styles.select_category_btn} >
    <Text style={{color:colors.theme_fg, marginLeft:15,marginRight:15, fontSize:14 }}>{strings.reviews}</Text>
                </Button>
                </Body>
                </Col>
                
            </Row>
            </Grid>
          
           
            {reviews}
            
      </Content>
      </ScrollView>

      {/*} <Footer style={{backgroundColor:'#f5511e',height: 40}} >
        <Left style={{flex: 6, color:colors.theme_button_fg}}>
          <Text onPress={this.viewcart} style={{ fontSize:20, color:colors.theme_button_fg, marginTop:5, marginLeft:10 }}>View Cart</Text>
        </Left>
        <Body>
          
        </Body>
        <Right style={{flex: 6, color:colors.theme_button_fg}}>
        <Text id='cart_total' style={{ fontSize:20, color:colors.theme_button_fg, marginTop:5, marginRight:10 }}>$ {this.state.food_cost}</Text>
        </Right>
        
    </Footer>*/}
     
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
  list: {
    marginBottom:0
  },
  select_category_btn: {
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor:colors.theme_button_fg,
  },
  category_btn: {
    borderWidth: 1,
    marginLeft:10,
    marginRight:5,
    borderColor: colors.divider,
    backgroundColor:colors.theme_button_fg,
  },
  name:{
    color:colors.theme_fg,
    fontSize:16,
    textAlign:'left',
    //marginLeft:10,
  },
  description:{
    fontSize:10,
    textAlign:'left',
    //marginLeft:10,
    color:colors.sub_font,
    paddingBottom:10,
  },
  readmore:{
    fontSize:10,
    textAlign:'left',
    marginLeft:10,
    color:colors.sub_font,
    paddingBottom:10,
  },
  address:{
    fontSize:12,
    textAlign:'left',
    marginLeft:10,
    color:colors.sp_subtext_fg,
    paddingBottom:10,
  },
});
