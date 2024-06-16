import useTheme from 'hooks/useTheme';
import React from 'react';
import {View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const AddContactInputNormal = props => {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: `${props.width}%`,
      }}>
      <Label>{props.placeholder}</Label>
      <TextInputBox {...props} />
    </View>
  );
};

const AddContactInputDropDown = ({
  value,
  items,
  onSelect,
  placeholder,
  defaultValue,
  ...props
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'column',
        width: `${props.width}%`,
      }}>
      <Label>{placeholder}</Label>
      <SelectDropdown
        data={items}
        defaultValue={value}
        onSelect={onSelect}
        defaultButtonText={value}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={{
          height: normalize(35),
          width: '100%',
          padding: 0,
          margin: 0,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          maxHeight: normalize(70),
          marginBottom: normalize(10),
          borderRadius: normalize(5),
        }}
        buttonTextStyle={{
          fontSize: theme.fontSize.f14,
          margin: 0,
          padding: 0,
          color: theme.colors.white,
        }}
        renderDropdownIcon={isOpened => {
          return (
            <FontAwesome
              name={isOpened ? 'chevron-up' : 'chevron-down'}
              color={'#FFF'}
              size={10}
            />
          );
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={{
          backgroundColor: theme.colors.primary,
          borderTopRightRadius: normalize(10),
          borderTopLeftRadius: normalize(10),
        }}
        rowStyle={{
          height: normalize(35),
          borderBottomWidth: 0,
        }}
        rowTextStyle={{
          fontSize: theme.fontSize.f14,
          margin: 0,
          padding: 0,
          color: theme.colors.white,
        }}
      />
    </View>
  );
};

const Container = styled.View`
  width: ${props => (props.width ? props.width : '100')}%;
`;

const Label = styled.Text`
  font-size: ${props => props.theme.fontSize.f10}px;
  color: ${props => props.theme.colors.secondary};
  margin: 0px 0px ${normalize(5)}px ${normalize(10)}px;
`;

const TextInputBox = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.error
    ? props.theme.colors.white
    : props.theme.colors.white,
}))`
  width: 100%;
  height: ${normalize(35)}px;
  border: 1px solid ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.inputTextColor};
  font-size: ${props => props.theme.fontSize.f14}px;
  padding: ${normalize(5)}px ${normalize(20)}px;
  border-radius: ${normalize(5)}px;
  margin-bottom: ${normalize(10)}px;
`;

export {AddContactInputNormal, AddContactInputDropDown};
