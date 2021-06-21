import React, { Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableHighlight, ImageBackground, BackHandler, ScrollView, TextInput, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, Icon, Content, List, ListItem, Thumbnail, Row, Col, Grid } from 'native-base';
//import ImageSlider from 'react-native-image-slider';

export default class Welcome extends Component {
  render() {
    const images = [
      'https://placeimg.com/640/640/nature',
      'https://placeimg.com/640/640/people',
      'https://placeimg.com/640/640/animals',
      'https://placeimg.com/640/640/beer',
    ];
    return ( 
      <Container>
         <Header style={{backgroundColor:'transparent'}} >
        <Left  style={{flex: 1, color:'#FF6149'}}>
          <Button onPress={() => this.props.navigation.toggleDrawer({ side: 'right', animated: true, to: 'closed', })} transparent>
            <Icon style={{color:'#FFFFFF'}} name='menu' />
          </Button>
        </Left>
        <Body style={{flex: 3,justifyContent: 'center'}}>
          <Title style={{alignSelf:'center', color:'#FFFFFF'}} >RESTAURANTS LIST</Title>
        </Body>
        <Right>

        </Right>
      </Header>
        <Content>

        <View style={styles.container}> 
      <ImageSlider style={styles.maincontainer}
          images={images}
          customSlide={({ index, item, style, width }) => (
            <View key={index} style={[style, styles.customSlide]}>
             <Thumbnail large source={{uri: item}} style={{alignSelf:'center',flex:1,marginTop:10,width:200,padding:150,borderRadius:150,borderColor:'#FF6149',borderWidth:5,height:'200%'}} />
             <Title style={{flex:1,alignSelf:'center', color:'#000000',marginTop:15}} >Lorem Ipsum dolor sit amet consect</Title>
              <Text style={{width:'75%',textAlign:'center',flex: 4,marginTop:20,alignSelf: 'center',justifyContent: 'center',color:'#f67445'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>  

              <Button block style={{margin:'8%',backgroundColor:'#FF6149',borderRadius:10}}>
                  <Text style={{color:'#FFFFFF',fontWeight: 'bold',justifyContent: 'center',alignItems: 'center',flexDirection: 'row','textTransform':'uppercase',marginTop: 20 }}>Get Started</Text>
              </Button>        

            </View>
          )}
        />
      </View>
       
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
   
  
});