import {useEffect, useRef} from 'react';
import {Keyboard, TextInput} from 'react-native';
import styled from 'styled-components/native';

export const PinDisplay = ({pinLength, pin, setPin}) => {
  const keyBoardref = useRef();
  useEffect(() => {
    if (pin && pin.length === 4) {
      Keyboard.dismiss();
    }
  }, [pin]);

  const focus = () => {
    setTimeout(() => keyBoardref.current.focus(), 0);
  };

  return (
    <>
      <TextInput
        ref={keyBoardref}
        autoFocus={true}
        value={pin}
        onChangeText={setPin}
        maxLength={4}
        inputMode="numeric"
        style={{width: 0, height: 0}}
      />
      <PinDisplayStyled>
        {Array.apply(null, Array(pinLength)).map((v, i) =>
          pin[i] ? (
            <PinDots key={`${i}`} filled={true} onPress={() => focus()}>
              <PinText>{pin[i]}</PinText>
            </PinDots>
          ) : (
            <PinDots key={`${i}`} filled={false} onPress={() => focus()}>
              <PinText></PinText>
            </PinDots>
          ),
        )}
      </PinDisplayStyled>
    </>
  );
};

const PinDisplayStyled = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PinDots = styled.TouchableOpacity`
  margin: ${props => props.theme.spacings.normalScale.s12 * 0.3}px;
  height: ${props => props.theme.spacings.verticalScale.s42}px;
  border-radius: 500px;
  width: ${props => props.theme.spacings.verticalScale.s36 * 1.5}px;
  background-color: ${props => props.theme.colors.inputBg};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PinText = styled.Text`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f18}px;
  font-weight: ${props => props.theme.fontWeight.w600};
  color: ${props => props.theme.colors.dark};
`;
