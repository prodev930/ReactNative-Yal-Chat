import React, {useContext} from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyAppThemeContext from 'context/MyAppTheme';
import {themeColorCombinations} from 'constants/theme';

// Define your tab screens
function Screen1({mytheme}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColorCombinations?.[mytheme]?.background,
      }}></View>
  );
}

function Screen2({mytheme}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColorCombinations?.[mytheme]?.background,
      }}></View>
  );
}

// Create Material Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

function AllSpamsTopTab() {
  const {theme: mytheme} = useContext(MyAppThemeContext);

  const dummyData = [
    {
      _id: '665f42864ae77ec70b26545e',
      thread_id: 1465,
      date: 1717512929834,
      read: 0,
      seen: 1,
      phoneNumber: 'AD-FIBETM',
      countryCode: '',
      last_sms_id: 7784,
      archived: false,
      pinned: false,
    },
    {
      _id: '665f42864ae77ec70b26545f',
      thread_id: 883,
      date: 1717511482878,
      read: 0,
      seen: 1,
      phoneNumber: 'VM-IDFCFB',
      countryCode: '',
      last_sms_id: 7783,
      archived: false,
      pinned: false,
    },
    {
      _id: '665f42864ae77ec70b26546e',
      thread_id: 1508,
      date: 1717483069820,
      read: 0,
      seen: 1,
      phoneNumber: 'VK-TAXBDY',
      countryCode: '',
      last_sms_id: 7750,
      archived: false,
      pinned: false,
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Screen1"
      screenOptions={{
        tabBarAndroidRipple: {borderless: false},
        tabBarStyle: {
          backgroundColor: themeColorCombinations?.[mytheme]?.background,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          color: themeColorCombinations?.[mytheme]?.textcolor,
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#5F3DB8',
        },
      }}>
      <Tab.Screen
        name="Screen1"
        options={{title: 'Calls'}}
        children={() => <Screen1 mytheme={mytheme} />}
      />
      <Tab.Screen
        name="Screen2"
        children={() => <Screen2 mytheme={mytheme} />}
        options={{title: 'Messages'}}
      />
    </Tab.Navigator>
  );
}

export default AllSpamsTopTab;
