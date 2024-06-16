import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {common} from 'constants/theme';
import {useQuery} from 'database';
import {tableNames} from 'database/tableNames';
import {screens} from 'constants/screens';
import {formatName, tokenizeString} from 'utils/utilities';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {avatar} from 'assets/images';
import HighlightedText from './HighlightedText';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectContactByPhoneNumber} from 'redux/contacts-map';
import {selectThreadById} from 'redux/threads';
import {CommonStyles} from 'styled/common.styles';

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

const ThreadCard2 = ({id, setSelected, selected = []}) => {
  const navigation = useNavigation();

  const item = useSelector(state => selectThreadById(state, id));

  const styles = useStyles();
  const isSelected = useMemo(() => {
    return selected.includes(item?.thread_id);
  }, [item?.thread_id, selected]);

  const handleSelection = useCallback(() => {
    if (isSelected) {
      setSelected([...selected.filter(d => item?.thread_id !== d)]);
    } else {
      setSelected([...selected, item?.thread_id]);
    }
  }, [isSelected, item?.thread_id, selected, setSelected]);

  const onPress = useCallback(() => {
    if (selected.length) {
      handleSelection(item?.thread_id);
    } else {
      navigation.navigate(screens.APP.SMS_THREADS, {
        thread_id: Number.parseInt(item?.thread_id),
        phone_number: item?.phoneNumber,
        last_sms_id: item?.last_sms_id,
      });
    }
  }, [
    handleSelection,
    item?.last_sms_id,
    item?.phoneNumber,
    item?.thread_id,
    navigation,
    selected.length,
  ]);

  if (!item) {
    return <View style={styles.cover} />;
  }

  return (
    <Pressable
      style={[styles.cover, isSelected && styles.coverHighLight]}
      onPress={onPress}
      onLongPress={() => {
        handleSelection(item?.thread_id);
      }}
      selected={isSelected}>
      <MemoizedExpensiveContent
        item={item}
        styles={styles}
        isSelected={isSelected}
      />
    </Pressable>
  );
};

const ExpensiveContent = ({item, styles = {}, isSelected}) => {
  const theme = useTheme();
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

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {isSelected ? (
          <View style={styles.avatarSelectedPlaceholder}>
            <FontAwesome5 name="check" size={30} />
          </View>
        ) : (
          <Image
            style={styles.avatarImage}
            source={
              contact?.hasThumbnail && contact?.thumbnailPath
                ? {uri: contact?.thumbnailPath}
                : avatar
            }
          />
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={CommonStyles.row}>
          <View style={CommonStyles.width60}>
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
          <View style={styles.descriptionBox}>
            <DescriptionText read={item.read} selected={isSelected}>
              {item?.date
                ? dayjs(item.date).isToday()
                  ? dayjs(item.date).fromNow()
                  : dayjs(item.date).isSame(Date.now(), 'year')
                  ? dayjs(item.date).format('DD MMM')
                  : dayjs(item.date).format('DD MMM YY')
                : 'Loading ...'}
            </DescriptionText>
            {!!item.pinned && (
              <View style={styles.unreadBadge}>
                <MCI name="pin" size={iconSize} color={theme.colors.white} />
              </View>
            )}
            {!!item.archived && (
              <View style={styles.unreadBadge}>
                <MCI
                  name="archive-arrow-down"
                  size={iconSize}
                  color={theme.colors.white}
                />
              </View>
            )}
            {unreadCount?.length > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadTxt}>{unreadCount.length}</Text>
              </View>
            )}
          </View>
        </View>
        <HighlightedText
          read={item.read}
          searchWords={tokenizeString(item.keyword ?? '')}
          selected={isSelected}
          TextComponent={DescriptionText}
          textToHighlight={item?.snippet ?? 'Loading ...'}
        />
      </View>
    </View>
  );
};

const MemoizedExpensiveContent = React.memo(ExpensiveContent);

export default ThreadCard2;

const ITEM_HEIGHT = normalize(50);

const ITEM_PADDING = common.spacings.verticalScale.s12;

export const ITEM_COVER_HEIGHT = ITEM_HEIGHT + ITEM_PADDING * 2;

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
    props.highlight
      ? props.theme.colors.primary
      : props.selected
      ? props.theme.colors.threadCardSubHighlightedText
      : props.theme.colors.threadCardSubText};
  font-family: ${props => props.theme.fontFamily};
`;

const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      cover: {
        paddingVertical: common.spacings.verticalScale.s12,
        paddingHorizontal: common.spacings.normalScale.s18,
        backgroundColor: theme.colors.threadBG,
        height: ITEM_COVER_HEIGHT,
      },
      debug: {
        backgroundColor: 'yellow',
        borderWidth: 1,
        borderColor: 'red',
      },
      coverHighLight: {
        backgroundColor: theme.colors.threadHighlightBG,
      },
      container: {
        borderWidth: 0,
        flexDirection: 'row',
        width: '100%',
        height: ITEM_HEIGHT,
      },
      avatarContainer: {
        borderWidth: 0,
        height: ITEM_HEIGHT,
        width: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
      },
      unreadBadge: {
        width: normalize(15),
        height: normalize(15),
        backgroundColor: theme.colors.secondary,
        padding: normalize(2),
        borderRadius: normalize(15),
        justifyContent: 'center',
        alignItems: 'center',
      },
      unreadTxt: {
        fontSize: normalize(8),
        fontWeight: '900',
      },
      avatarImage: {
        height: ITEM_HEIGHT,
        width: ITEM_HEIGHT,
        borderRadius: normalize(13),
      },
      avatarSelectedPlaceholder: {
        height: ITEM_HEIGHT,
        width: ITEM_HEIGHT,
        borderRadius: normalize(13),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.secondary,
      },
      detailsContainer: {
        borderWidth: 0,
        flex: 1,
        height: '100%',
        padding: common.spacings.normalScale.s12,
        justifyContent: 'space-between',
      },
      descriptionBox: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: normalize(5),
      },
    });
  }, [theme]);

  return styles;
};
