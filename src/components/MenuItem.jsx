import React from 'react';
import styled from 'styled-components/native';

const MenuItem = ({onPress, title}) => {
  return (
    <MenuItemButton onPress={onPress}>
      <MenuTextItem>{title}</MenuTextItem>
    </MenuItemButton>
  );
};

export default MenuItem;

const MenuItemButton = styled.TouchableOpacity`
  padding: ${props =>
    `${props.theme.spacings.verticalScale.s18}px ${props.theme.spacings.normalScale.s18}px`};
`;
const MenuTextItem = styled.Text`
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f14}px;
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.white};
`;
