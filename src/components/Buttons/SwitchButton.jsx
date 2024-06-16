import useTheme from 'hooks/useTheme';
import React from 'react';
import {Switch} from 'react-native';

const SwitchButton = ({value, onChange}) => {
  const theme = useTheme();
  return (
    <Switch
      trackColor={{false: '#3e3e3e', true: theme.colors.secondary}}
      thumbColor={value ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onChange}
      value={value}
    />
  );
};

export default SwitchButton;
