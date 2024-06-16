import React from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useTheme from 'hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
const NewChatFAB = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Container
      onPress={() => navigation.navigate(screens.APP.NEW_CONVERSATION)}>
      <FontAwesome5
        // style={{paddingTop: normalize(5)}}
        name="comment-medical"
        size={normalize(25)}
        color={theme.colors.white}
      />
    </Container>
  );
};

export default NewChatFAB;

const bottom = 100;

const Container = styled.TouchableOpacity`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${normalize(5)}px;
  height: ${normalize(50)}px;
  width: ${normalize(50)}px;
  background-color: ${props => props.theme.colors.primary};
  bottom: ${normalize(100)}px;
  right: ${props => `${props.theme.spacings.normalScale.s24}px`};
`;
