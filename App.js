import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, } from 'react-native';
import CameraPage from './components/camera'
import Introduction from './components/intro'

// import DeviceInfo from 'react-native-device-info';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="FaceRecognitionIntro"
          component={Introduction}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="FaceRecognitionCamera" component={CameraPage} options={{ title: 'Camera' }} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    width: '90%',
    backgroundColor: '#646464',
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
});