

import React, {useContext} from 'react';
import {Text, View} from 'react-native';
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

function AllScamsTopTab() {
  const {theme: mytheme} = useContext(MyAppThemeContext);

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

export default AllScamsTopTab;
