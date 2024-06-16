import React from 'react';
import styled from 'styled-components/native';
import {verticalScale} from 'utils/normalize';

const ChipButton = props => {
  return (
    <Container {...props}>
      <ButtonText>{props.children}</ButtonText>
    </Container>
  );
};

export default ChipButton;

const Container = styled.TouchableOpacity`
  width: ${props => (props.width ? props.width : 100)}%;
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacings.verticalScale.s16 / 2}px
    ${props => props.theme.spacings.normalScale.s16 / 2}px;
  justify-content: center;
  align-items: center;
  border-radius: 20000px;
`;

const ButtonText = styled.Text`
  font-weight: ${props => props.theme.fontWeight.w600};
  font-size: ${props => props.theme.fontSize.f14}px;
  color: ${props => props.theme.colors.AddContactHeaderIconColor};
`;
