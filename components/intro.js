import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image, Icon, TouchableOpacity } from 'react-native';

import bgImage from '../images/back1.png';
import logo from '../images/icon3.png';

import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default class Introduction extends Component {
  openCamera=()=>{
    this.props.navigation.navigate('FaceRecognitionCamera')
  }

  
  render() {
    console.log(this.props.navigation)
    return (
      <ImageBackground source={bgImage} style={styles.backgroundContainer}>
        {/* <FontAwesome5 name="chevron-left" size={24} color="black" style={styles.left}></FontAwesome5> */}
        <View style={styles.mainContainer}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.logoText}>Face Verification</Text>
          <View style={styles.row}>
            <View style={styles.WrapImage}>
              <MaterialIcons name="security" size={50} style={styles.IconTheme}></MaterialIcons>
            </View>
            <View style={styles.WrapText}>
              <Text style={styles.guide}>Fast and Easy</Text>
              <Text style={styles.guides}>Sign in using this Face id {'\n'}system for easy access and high security</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.WrapImage}>
              <FontAwesome5 name="user-lock" size={40} style={styles.IconTheme}></FontAwesome5>
            </View>
            <View style={styles.WrapText}>
              <Text style={styles.guide}>Hide Your Details</Text>
              <Text style={styles.guides}>Hide your important information {'\n'}using this face verification</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.WrapImage}>
              <MaterialCommunityIcons name="key-variant" style={styles.IconTheme} size={40} ></MaterialCommunityIcons>
            </View>
            <View style={styles.WrapText}>
              <Text style={styles.guide}>Respects your privacy</Text>
              <Text style={styles.guides}>Apps may only ask for email and name {'\n'}and it will never track you</Text>
            </View>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.btnLogin} onPress={this.openCamera}>
              <Text style={styles.text}>Click Here</Text>
            </TouchableOpacity>
          </View>
        </View>
        

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 15
  },
  WrapText: {
    width: '60%'
  },
  WrapImage: {
    width: '20%'
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  left: {
    left: 0,
    top: 0,
  },

  logo: {
    width: 160,
    height: 160,
    borderRadius: 30,
  },

  mainContainer: {
    // height: '84%',
    flexWrap: "wrap",
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },

  logoText: {
    color: 'black',
    fontSize: 30,
    fontWeight: '500',
    marginTop: 10,
  },

  btnLogin: {
    width: 150,
    height: 50,
    borderRadius: 39,
    backgroundColor: '#589EEB',
    justifyContent: 'center',
    bottom: 10,
  },


  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },

  IconTheme: {
    alignItems: 'center',
    color: '#589EEB',
  },


  guide: {
    fontWeight: 'bold',
  },
});