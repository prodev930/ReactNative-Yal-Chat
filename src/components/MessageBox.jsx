import { themeColorCombinations } from 'constants/theme';
import useTheme from 'hooks/useTheme';
import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

const MessageBox = ({message}) => {
  const theme = useTheme();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: themeColorCombinations?.light.color}}>{message}</Text>
    </View>
  );
};

export default MessageBox;
