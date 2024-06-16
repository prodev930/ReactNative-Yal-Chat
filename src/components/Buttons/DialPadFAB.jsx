import React from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MI from 'react-native-vector-icons/MaterialIcons';
import useTheme from 'hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import {useDispatch} from 'react-redux';
import {openDialPad} from 'redux/utils';
const DialPadFAB = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <Container
      onPress={() => {
        dispatch(openDialPad());
      }}>
      <MI name="dialpad" size={normalize(25)} color={theme.colors.white} />
    </Container>
  );
};

export default DialPadFAB;

const bottom = 100;

const Container = styled.TouchableOpacity`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${normalize(100)}px;
  height: ${normalize(50)}px;
  width: ${normalize(50)}px;
  background-color: ${props => props.theme.colors.primary};
  bottom: ${normalize(bottom)}px;
  right: ${props => `${props.theme.spacings.normalScale.s24}px`};
`;
