import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import {BottomMenuItem} from './BottomMenuItem';
import MyAppThemeContext from 'context/MyAppTheme';
import {lightTheme} from 'constants/theme';

export const TabBar = ({state, descriptors, navigation}) => {
  const [translateValue] = useState(new Animated.Value(0));
  const totalWidth = Dimensions.get('window').width;
  const tabWidth = totalWidth / state.routes.length;

  const animateSlider = index => {
    Animated.spring(translateValue, {
      toValue: index * tabWidth,
      velocity: 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateSlider(state.index);
  }, [state.index]);

  const {theme, toggleTheme} = useContext(MyAppThemeContext);

  return (
    <View
      style={[
        style.tabContainer,
        {
          width: totalWidth,
          height: 60,
          backgroundColor: theme == 'light' ? lightTheme.colors.bg : '#535353',
          paddingTop:4
        },
      ]}>
      <View style={{flexDirection: 'row'}}>
        <Animated.View
          style={[
            style.slider,
            {
              transform: [{translateX: translateValue}],
              width: tabWidth - tabWidth / 2.5,
              left: tabWidth / 5,
              marginTop: tabWidth / 50,
            },
          ]}
        />
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
              navigation.navigate(route.name);
            }

            animateSlider(index);
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, marginBottom: 4}}
              key={index}>
              <BottomMenuItem
                iconName={`${label}Icon`}
                isCurrent={isFocused}
                label={label}
                theme={theme}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  tabContainer: {
    // height: 80,
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.0,
    backgroundColor: 'white',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
  },
  slider: {
    // height: 50,
    height: 45,
    position: 'absolute',
    backgroundColor: '#EAE2FF',
    borderRadius: 10,
    opacity: 1,
    // marginBottom:20
  },
});
