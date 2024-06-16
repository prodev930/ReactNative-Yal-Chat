import useTheme from 'hooks/useTheme';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MT} from 'styled/MT';
import {normalScale, normalize} from 'utils/normalize';

const IconButton = ({
  onPress,
  iconSize,
  iconColor,
  bgColor,
  opacity,
  IconLibrary,
  iconName,
  disabled,
  borderWidth,
  name,
}) => {
  const theme = useTheme();
  return (
    // <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          aspectRatio: 1,
          borderWidth: borderWidth ? 1 : 0,
          backgroundColor: bgColor || theme.colors.white,
          opacity: disabled ? 0.5 : opacity || 0.5,
          padding: theme.spacings.verticalScale.s15,
          borderRadius: 500,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <IconLibrary name={iconName} color={iconColor} size={iconSize} />
    </TouchableOpacity>
    // <Text>{name}</Text>
    // </View>
  );
};

export default IconButton;
