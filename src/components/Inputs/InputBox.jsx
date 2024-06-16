import useTheme from 'hooks/useTheme';
import React from 'react';
import {Platform, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import {nullChecker} from 'utils/utilities';
const InputBox = props => {
  const theme = useTheme();
  return (
    <Container width={props.width}>
      <TextInputContainer
        noEdges={props.noEdges}
        error={props.error}
        rounded={props.rounded}>
        {props.PrependIcon ? <props.PrependIcon /> : null}
        <TextInputBox error={props.error} {...props}></TextInputBox>
      </TextInputContainer>
      {/* {props.hideError ? null : props.error ? (
        <ErrorText>{nullChecker(props.error)}</ErrorText>
      ) : (
        <ErrorText> </ErrorText>
      )} */}
    </Container>
  );
};

export default InputBox;
const Container = styled.View`
  width: ${props => (props.width ? props.width : 100)}%;
`;
const TextInputContainer = styled.View`
  border-radius: ${props => (props.rounded ? '100' : '5')}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.inputBg};
  padding: ${props => props.theme.spacings.verticalScale.s12}px
    ${props => props.theme.spacings.normalScale.s12}px;
`;

const TextInputBox = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.error
    ? props.theme.colors.placeholderTextColor
    : props.theme.colors.placeholderTextColor,
}))`
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.inputTextColor};
  font-size: ${props => props.theme.fontSize.f14}px;
  padding: 0;
  flex: 1;
`;
