import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Platform, Text, View} from 'react-native';
import {useQuery} from 'database';
import {tableNames} from 'database/tableNames';
import {screens} from 'constants/screens';
import {clipMessage, formatName, tokenizeString} from 'utils/utilities';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {avatar, userIcon} from 'assets/images';
import HighlightedText from './HighlightedText';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectContactByPhoneNumber} from 'redux/contacts-map';

dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});
const iconSize = normalize(10);

const ThreadCard = ({item, setSelected, selected = []}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const isSelected = useMemo(() => {
    return selected.includes(item.thread_id);
  }, [item.thread_id, selected]);

  const onPress = () => {
    if (selected.length) {
      handleSelection(item.thread_id);
    } else {
      navigation.navigate(screens.APP.SMS_THREADS, {
        thread_id: Number.parseInt(item.thread_id),
        phone_number: item.phoneNumber,
        last_sms_id: item.last_sms_id,
      });
    }
  };

  const handleSelection = () => {
    if (isSelected) {
      setSelected([...selected.filter(d => item.thread_id !== d)]);
    } else {
      setSelected([...selected, item.thread_id]);
    }
  };

  const unreadCount = useQuery(
    tableNames.SMS,
    collection => {
      return collection.filtered(
        '(thread_id == $0 AND (seen == $1 OR read == $1))',
        Number.parseInt(item?.thread_id),
        0,
      );
    },
    [item],
  );

  const contact =
    useSelector(state =>
      selectContactByPhoneNumber(state, item?.phoneNumber ?? ''),
    ) ?? {};

  if (!item) {
    return null;
  }

  return (
    <Cover
      onPress={onPress}
      onLongPress={_ => handleSelection(item.thread_id)}
      selected={isSelected}>
      <Container>
        <AvatarContainer>
          {isSelected ? (
            <AvatarselectedPlaceholder>
              <FontAwesome5 name="check" size={30} />
            </AvatarselectedPlaceholder>
          ) : (
            <AvatarImage
              source={
                contact && contact[0] && contact[0].hasThumbnail
                  ? {uri: contact[0].thumbnailPath}
                  : userIcon
              }
            />
          )}
        </AvatarContainer>
        <DetailsContainer>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '60%'}}>
              <HighlightedText
                searchWords={tokenizeString(item?.keyword ?? '')}
                textToHighlight={formatName(
                  contact?.displayName ||
                    item.displayName ||
                    item.phoneNumber ||
                    'unknown',
                )}
                TextComponent={NameText}
                read={item.read}
                selected={isSelected}
              />
            </View>
            <View
              style={{
                width: '40%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                gap: normalize(5),
              }}>
              <DescriptionText read={item.read} selected={isSelected}>
                {item?.date
                  ? dayjs(item.date).isToday()
                    ? dayjs(item.date).fromNow()
                    : dayjs(item.date).isSame(Date.now(), 'year')
                    ? dayjs(item.date).format('DD MMM')
                    : dayjs(item.date).format('DD MMM YY')
                  : 'Loading ...'}
              </DescriptionText>
              {item.pinned ? (
                <UnreadBadge>
                  <MCI name="pin" size={iconSize} color={theme.colors.white} />
                </UnreadBadge>
              ) : null}
              {item.archived ? (
                <UnreadBadge>
                  <MCI
                    name="archive-arrow-down"
                    size={iconSize}
                    color={theme.colors.white}
                  />
                </UnreadBadge>
              ) : null}
              {unreadCount.length ? (
                <UnreadBadge>
                  <Text style={{fontSize: normalize(8), fontWeight: 900}}>
                    {unreadCount.length}
                  </Text>
                </UnreadBadge>
              ) : null}
            </View>
          </View>
          <HighlightedText
            read={item.read}
            searchWords={tokenizeString(item.keyword ?? '')}
            selected={isSelected}
            TextComponent={DescriptionText}
            textToHighlight={item?.snippet ?? 'Loading ...'}
          />
        </DetailsContainer>
      </Container>
    </Cover>
  );
};
export default ThreadCard;

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

const UnreadBadge = styled.View`
  width: ${normalize(15)}px;
  height: ${normalize(15)}px;
  background-color: ${props => props.theme.colors.secondary};
  padding: ${normalize(2)}px;
  border-radius: 2000px;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.Image`
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  border-radius: ${normalize(100)}px;
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
  font-size: ${props => props.theme.fontSize.f16}px;
  font-weight: ${props =>
    props.read === 1
      ? props.theme.fontWeight.w600
      : props.theme.fontWeight.w800};
  color: ${props =>
    props.highlight
      ? props.theme.colors.primary
      : 'green'
      ? '#3A3A3A'
      : props.theme.colors.threadCardNameText};
  font-family: 'Poppins';
`;
const DescriptionText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  font-weight: ${props =>
    props.read === 1
      ? props.theme.fontWeight.w400
      : props.theme.fontWeight.w800};
  color: ${props =>
    props.highlight
      ? props.theme.colors.primary
      : 'red'
      ? '#3A3A3A'
      : props.theme.colors.threadCardSubText};
  font-family: 'Poppins';
`;
