import React, {forwardRef, useImperativeHandle, useState} from 'react';
import styled, {css} from 'styled-components/native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, TouchableOpacity} from 'react-native';
import {handleCall} from 'utils/call';

const CallButton = forwardRef(({handles}, ref) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  /**
   * setPhoneNumber ref function
   */
  useImperativeHandle(
    ref,
    () => ({
      setPhoneNumber: value => {
        setPhoneNumber(value);
      },
    }),
    [],
  );

  return (
    <Wrapper>
      <ButtonContainer>
        {handles && handles.length === 1 ? (
          <ButtonWrapper>
            <TouchableOpacity
              onPress={() => handleCall(handles[0].id, phoneNumber)}>
              <MCI name="phone" size={30} color={'#ffffff'} />
            </TouchableOpacity>
          </ButtonWrapper>
        ) : handles && handles.length > 1 ? (
          <>
            <ButtonWrapper>
              <MCI name="phone" size={25} color={'#ffffff'} />
            </ButtonWrapper>
            {handles.map((h, i) => (
              <ButtonWrapper
                flex={1.2}
                border={i === 0 ? 'right' : 'left'}
                key={h.id}>
                <TouchableOpacity onPress={() => handleCall(h.id, phoneNumber)}>
                  <Text>SIM {i + 1}</Text>
                </TouchableOpacity>
              </ButtonWrapper>
            ))}
          </>
        ) : (
          <ButtonWrapper>
            <Text>No SIM</Text>
          </ButtonWrapper>
        )}
      </ButtonContainer>
    </Wrapper>
  );
});

export default CallButton;

const Wrapper = styled.View`
  /* flex: 1; */
  width: 80%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ButtonContainer = styled.View`
  flex: 1;
  height: 70%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 2000px;
  flex-direction: row;
`;

const ButtonWrapper = styled.View`
  ${props => {
    switch (props.border) {
      case 'left':
        return css`
          border-left-color: white;
          border-left-width: 2px;
          border-left-style: solid;
        `;
      case 'right':
        return css`
          border-right-color: white;
          border-right-width: 2px;
          border-right-style: solid;
        `;
      default:
        return css``;
    }
  }}

  flex: ${props => props.flex || 1};
  justify-content: center;
  align-items: center;
`;
