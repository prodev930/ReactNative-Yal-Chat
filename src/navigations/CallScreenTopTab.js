import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Calls from 'screens/App/Calls';
import Contacts from 'screens/App/Contacts';

const Tab = createMaterialTopTabNavigator();

function MyTabBar({state, descriptors, navigation, position, setSelectedTab}) {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={styles.topTabContainer}
      style={styles.topTabStyle}
      bounces={false}
      key={Math.random()?.toString()}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            setSelectedTab(route?.name);
            navigation.navigate({name: route.name, merge: true});
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0.8)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 8
            }}
            activeOpacity={0.8}>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: isFocused ? 'green' : 'white',
              }}>
              <Animated.Text
                style={[
                  isFocused ? styles.activeTab : styles.inActiveTab,
                  {opacity},
                ]}>
                {label}
              </Animated.Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function CallTopTab({route, setSelectedTab}) {
  return (
    <Tab.Navigator
      screenOptions={{
        horizontal: true,
        swipeEnabled: false,
      }}
      initialRouteName={route || 'LUMPSUM'}
      tabBar={props => <MyTabBar setSelectedTab={setSelectedTab} {...props} />}>
      <Tab.Screen name="Calls" component={Calls} />
      <Tab.Screen name="Contacts" component={Contacts} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  topTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topTabStyle: {
    maxHeight: 50,
  },
  activeTab: {
    fontSize: 12,
    color: "green",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  inActiveTab: {
    fontSize: 12,
    color: "#333333",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
