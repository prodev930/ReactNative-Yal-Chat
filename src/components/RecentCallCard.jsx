import React, {memo, useCallback, useRef} from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import {Animated, StyleSheet, View} from 'react-native';
import {useQuery} from 'database';
import {tableNames} from 'database/tableNames';
import {formatName, splitNumber} from 'utils/utilities';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {avatar} from 'assets/images';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import {RECENT_CALL_TYPES_MAP} from 'constants/recentCallTypesMap';
import {Swipeable} from 'react-native-gesture-handler';
import {width} from 'utils/device';
import {handleCall} from 'utils/call';
dayjs.extend(duration);
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

const RecentCallCard = ({item, handles, handleMessage, index}) => {
  const ref = useRef(1);
  console.log('RE RENDER ITEM TIMES', ref.current++, item.recordID, {index});
  const swipeRef = useRef(null);
  const theme = useTheme();

  const swipeRight = useCallback(
    (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [-500, 0],
        outputRange: [2, 0],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={styles.swipeItem}>
          <Animated.Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginLeft: 'auto',
              marginRight: theme.spacings.normalScale.s18,
              fontSize: 18,
              fontWeight: 'bold',
              transform: [{scale}],
            }}>
            <MCI name={'android-messages'} size={40} />
          </Animated.Text>
        </Animated.View>
      );
    },
    [theme.spacings.normalScale.s18],
  );

  const swipeLeft = useCallback(
    (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [0, 500],
        outputRange: [0, 2],
        extrapolate: 'clamp',
      });
      return (
        <Animated.View style={styles.swipeItem}>
          <Animated.Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginLeft: theme.spacings.normalScale.s18,
              fontSize: 18,
              fontWeight: 'bold',
              transform: [{scale}],
            }}>
            <MCI name={'phone'} size={40} />
          </Animated.Text>
        </Animated.View>
      );
    },
    [theme.spacings.normalScale.s18],
  );

  const contact = useQuery(
    tableNames.Contacts,
    collection => {
      const {phoneNumber, countryCode} = splitNumber(item.number);
      return collection.filtered('phoneNumbers.number == $0', phoneNumber);
    },
    [item],
  );

  const handleSwipableOpen = d => {
    if (d === 'left') {
      handleCall(handles[0].id, item.number);
      swipeRef?.current?.close();
    } else if (d === 'right') {
      const {phoneNumber, countryCode} = splitNumber(item.number);
      handleMessage(phoneNumber);
      swipeRef?.current?.close();
    }
  };

  return item ? (
    <Swipeable
      ref={swipeRef}
      friction={2}
      renderRightActions={swipeRight}
      renderLeftActions={swipeLeft}
      onSwipeableOpen={handleSwipableOpen}
      overshootLeft={false}
      overshootRight={false}>
      <Cover>
        <Container>
          <AvatarContainer>
            <AvatarImage
              source={
                contact && contact[0] && contact[0].hasThumbnail
                  ? {uri: contact[0].thumbnailPath}
                  : avatar
              }
            />
          </AvatarContainer>
          <DetailsContainer>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '100%'}}>
                <NameText>
                  {formatName(
                    `${
                      contact && contact[0]
                        ? `${contact[0].givenName} ${contact[0].familyName}`
                        : item.displayName || item.number || 'unknown'
                    }`,
                  )}
                </NameText>
              </View>
            </View>
            <DescriptionText type={item.type}>{`${
              RECENT_CALL_TYPES_MAP[item.type]
            } Call • ${
              parseInt(item.duration) > 0
                ? dayjs
                    .duration(parseInt(item.duration), 'seconds')
                    .format('HH:mm:ss') + ' • '
                : ''
            }${
              dayjs(item.date).isToday()
                ? dayjs(item.date).fromNow()
                : dayjs(item.date).format('DD MMM YY hh:mm a')
            }`}</DescriptionText>
          </DetailsContainer>
        </Container>
      </Cover>
    </Swipeable>
  ) : null;
};
export default memo(RecentCallCard);

const borderWidth = 0;
const height = 50;

const styles = StyleSheet.create({
  swipeItem: {
    backgroundColor: 'transparent',
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

const Cover = styled.View`
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
  justify-content: space-around;
`;

const NameText = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  font-weight: ${props =>
    props.read === 1
      ? props.theme.fontWeight.w400
      : props.theme.fontWeight.w800};
  color: ${props =>
    props.highlight
      ? props.theme.colors.primary
      : props.selected
      ? props.theme.colors.threadCardNameHighlightedText
      : props.theme.colors.threadCardNameText};
  font-family: ${props => props.theme.fontFamily};
`;
const DescriptionText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  font-weight: ${props =>
    props.read === 1
      ? props.theme.fontWeight.w400
      : props.theme.fontWeight.w800};
  color: ${props =>
    props.type !== '1' && props.type !== '2'
      ? props.theme.colors.callEndButtonBG
      : props.theme.colors.threadCardSubText};
  font-family: ${props => props.theme.fontFamily};
`;
