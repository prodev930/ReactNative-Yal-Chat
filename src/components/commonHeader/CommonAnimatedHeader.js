import {StatusBar, StyleSheet, Text} from 'react-native';
import React from 'react';
import {MotiView} from 'moti';
import {MotiPressable} from 'moti/interactions';
import {themeColorCombinations} from 'constants/theme';
import {useNavigation} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {BounceInUp, BounceOutUp, FadeIn} from 'react-native-reanimated';

const CommonAnimatedHeader = ({title = '', style}) => {
  const navigation = useNavigation();
  return (
    <MotiView
      style={[styles.header, style]}
      from={{
        scale: 0,
        translateX: -10,
      }}
      animate={{
        scale: 1,
        translateX: 0,
      }}>
      <StatusBar
        backgroundColor={themeColorCombinations?.['light']?.background}
      />
      <MotiPressable
        onPress={() => {
          navigation.goBack();
        }}>
        <MCI name="keyboard-backspace" size={30} color={'#5D3AB7'} />
      </MotiPressable>
      <Text
        style={[
          styles.headerText,
          {color: themeColorCombinations?.['light']?.textcolor},
        ]}>
        {title}
      </Text>
    </MotiView>
  );
};

export default CommonAnimatedHeader;

const styles = StyleSheet.create({
  header: {
    // paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 30,
  },
});
