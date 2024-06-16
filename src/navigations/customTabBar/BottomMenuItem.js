import {
  bottomTabCallIcon,
  bottomTabContactsIcon,
  bottomTabFocusedCallIcon,
  bottomTabFocusedContactsIcon,
  bottomTabFocusedSmsIcon,
  bottomTabSmsIcon,
  missedCallIcon,
} from 'assets/images';
import {darkTheme, lightTheme} from 'constants/theme';
import React from 'react';
import {Image, View, Text} from 'react-native';

export const BottomMenuItem = ({iconName, isCurrent, label, theme}) => {
  const textColor =
    theme == 'light'
      ? isCurrent
        ? '#5D3AB7'
        : '#000'
      : isCurrent
      ? darkTheme.colors.black
      : lightTheme.colors.bg;

  const bottomTabIcons = {
    Calls: bottomTabCallIcon,
    SMS: bottomTabSmsIcon,
    Profile: bottomTabContactsIcon,
  };

  const bottomTabFocusedIcons = {
    Calls: bottomTabFocusedCallIcon,
    SMS: bottomTabFocusedSmsIcon,
    Profile: bottomTabFocusedContactsIcon,
  };

  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Image
          source={
            isCurrent ? bottomTabFocusedIcons?.[label] : bottomTabIcons?.[label]
          }
          style={{
            width: 16,
            height: 16,
            resizeMode: 'contain',
          }}
        />
      </View>
      <View>
        <Text style={{color: textColor, paddingTop:2}}>{label}</Text>
      </View>
    </View>
  );
};
