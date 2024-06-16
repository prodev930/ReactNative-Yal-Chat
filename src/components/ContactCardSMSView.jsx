import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Text, View} from 'react-native';
import {useQuery} from 'database';
import {tableNames} from 'database/tableNames';
import {screens} from 'constants/screens';
import {clipMessage, formatName} from 'utils/utilities';
import dayjs from 'dayjs';
import {avatar} from 'assets/images';

const ContactCardSMSView = ({
  item,
  setSelected,
  selected,
  navigation,
  index,
}) => {
  const thread = useQuery(
    tableNames.Threads,
    collection => {
      return collection.filtered('phoneNumber == $0', item.phoneNumber);
    },
    [item],
  );

  const onPress = () => {
    if (selected.length) {
      handleSelection(item);
    } else {
      navigation.navigate(screens.APP.SMS_THREADS, {
        thread_id: thread[0]?.thread_id,
        phone_number: item.phoneNumber,
      });
    }
  };
  const handleSelection = p => {
    if (selected.filter(s => s.phoneNumber === p.phoneNumber).length) {
      setSelected([...selected.filter(s => s.phoneNumber !== p.phoneNumber)]);
    } else {
      setSelected([...selected, p]);
    }
  };

  return item ? (
    <Cover
      // onPress={() => console.log({item})}
      onPress={onPress}
      onLongPress={_ => handleSelection(item)}
      selected={
        selected.filter(s => s.phoneNumber === item.phoneNumber).length
      }>
      <Container>
        <AvatarContainer>
          {selected.filter(s => s.phoneNumber === item.phoneNumber).length ? (
            <AvatarselectedPlaceholder>
              <FontAwesome5 name="check" size={30} />
            </AvatarselectedPlaceholder>
          ) : (
            <AvatarImage source={avatar} />
          )}
        </AvatarContainer>
        <DetailsContainer>
          <View>
            <NameText
              selected={
                selected.filter(s => s.phoneNumber === item.phoneNumber).length
              }>
              {formatName(`${item.displayName || item.givenName}`)}
            </NameText>
          </View>
          <DescriptionText
            selected={
              selected.filter(s => s.phoneNumber === item.phoneNumber).length
            }>
            {`${item ? `${item.phoneNumber}` : '-'}`}
          </DescriptionText>
        </DetailsContainer>
      </Container>
    </Cover>
  ) : null;
};
export default ContactCardSMSView;

const borderWidth = 0;
const height = 50;

const Cover = styled.TouchableOpacity`
  padding: ${props =>
    `${props.theme.spacings.verticalScale.s12}px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props =>
    props.selected
      ? props.theme.colors.threadHighlightBG
      : props.theme.colors.threadBG};
`;

const Container = styled.View`
  border: ${borderWidth}px solid red;
  flex-direction: row;
  width: 100%;
  height: ${normalize(height)}px;
`;

const AvatarContainer = styled.View`
  border: ${borderWidth}px solid blue;
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.Image`
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  border-radius: ${normalize(13)}px;
`;

const AvatarselectedPlaceholder = styled.View`
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  border-radius: ${normalize(13)}px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.secondary};
`;

const DetailsContainer = styled.View`
  border: ${borderWidth}px solid green;
  flex: 1;
  height: 100%;
  padding: ${props => `${0}px ${props.theme.spacings.normalScale.s12}px`};
  justify-content: space-between;
`;

const NameText = styled.Text`
  font-size: ${props => props.theme.fontSize.f18}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props =>
    props.selected
      ? props.theme.colors.threadCardNameHighlightedText
      : props.theme.colors.threadCardNameText};
  font-family: ${props => props.theme.fontFamily};
`;
const DescriptionText = styled.Text`
  font-size: ${props => props.theme.fontSize.f13}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props =>
    props.selected
      ? props.theme.colors.threadCardSubHighlightedText
      : props.theme.colors.threadCardSubText};
  font-family: ${props => props.theme.fontFamily};
`;
