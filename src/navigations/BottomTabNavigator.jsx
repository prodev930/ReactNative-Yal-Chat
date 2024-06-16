// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Calls from 'screens/App/Calls';
import Contacts from 'screens/App/Contacts';
import Profile from 'screens/App/Profile';
import SMS from 'screens/App/SMS';
import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabBar} from './customTabBar/CustomTabBar';
import {SafeAreaView} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          // keyboardHidesTabBar: true
        }}
        initialRouteName='SMS'>
        <Tab.Screen name="Calls" component={Calls} />
        <Tab.Screen name="SMS" component={SMS} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      <SafeAreaView
        style={{
          backgroundColor: 'white',
        }}
        edges={['bottom']}
      />
    </View>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({});
