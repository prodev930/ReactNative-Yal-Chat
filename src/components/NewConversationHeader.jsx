import useTheme from 'hooks/useTheme';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import ContactChip from './Contacts/ContactChip';
const iconSize = normalize(25);
const NewConversationHeader = ({
  searchKey,
  setSearchKey,
  selected,
  setSelected,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Cover>
      <Container>
        <ContainerIcons onPress={() => navigation.goBack()}>
          <MCI
            name="chevron-left"
            size={iconSize}
            color={theme.colors.NewConversationMainTextColor}
          />
        </ContainerIcons>
        <ContainerText>
          <TextStyled>{`All contacts`}</TextStyled>
        </ContainerText>
      </Container>
      <Container>
        <ContainerIcons>
          <TextLeft>To : </TextLeft>
        </ContainerIcons>
        <ContainerText>
          <TextInput
            value={searchKey}
            onChangeText={setSearchKey}
            placeholderTextColor={theme.colors.NewConversationSubTextColor}
            placeholder="Type name or phone number"
          />
        </ContainerText>
      </Container>
      <ContactChip selected={selected} setSelected={setSelected} />
    </Cover>
  );
};

export default NewConversationHeader;

const Cover = styled(Animated.View)`
  width: 100%;
  min-height: 15%;
  padding: ${props =>
    `0px ${props.theme.spacings.normalScale.s18}px ${props.theme.spacings.normalScale.s18}px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props => props.theme.colors.NewConversationHeaderBG};
  border-radius: 0px 0px ${normalize(20)}px ${normalize(20)}px;
  justify-content: space-evenly;
`;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ContainerIcons = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ContainerText = styled.View`
  flex: 5;
  align-items: flex-start;
  justify-content: center;
`;

const TextStyled = styled.Text`
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f18}px;
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.NewConversationMainTextColor};
`;

const TextLeft = styled.Text`
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f13}px;
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.NewConversationSubTextColor};
`;
