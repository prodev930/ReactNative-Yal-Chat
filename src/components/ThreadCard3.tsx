import React, {FC, ReactNode, useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {common, lightTheme, themeColorCombinations} from 'constants/theme';
import {screens} from 'constants/screens';
import {formatName, tokenizeString} from 'utils/utilities';
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
import {CommonStyles} from 'styled/common.styles';
import {ThreadResponse} from 'services/thread-query.services';

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

interface ThreadCard3Props {
  item: ThreadResponse;
  setSelected: (selected: number[]) => void;
  selected?: number[];
}

const ThreadCard3: FC<ThreadCard3Props> = ({
  item,
  setSelected,
  selected = [],
}) => {
  const navigation = useNavigation();

  // const item = useSelector(state => selectThreadById(state, id));

  const styles = useStyles();
  const isSelected = useMemo(() => {
    return selected.includes(item?.thread_id);
  }, [item?.thread_id, selected]);

  const handleSelection = useCallback(
    (thread_id: number) => {
      if (isSelected) {
        setSelected([...selected.filter(d => thread_id !== d)]);
      } else {
        setSelected([...selected, item?.thread_id]);
      }
    },
    [isSelected, item?.thread_id, selected, setSelected],
  );

  const onPress = useCallback(() => {
    if (selected.length) {
      handleSelection(item?.thread_id);
    } else {
      navigation.navigate(screens.APP.SMS_THREADS, {
        thread_id: item?.thread_id,
        phone_number: item?.phoneNumber,
      });
    }
  }, [
    handleSelection,
    item?.phoneNumber,
    item?.thread_id,
    navigation,
    selected.length,
  ]);

  if (!item) {
    return <View style={styles.empty} />;
  }

  return (
    <Pressable
      style={[styles.cover, isSelected && styles.coverHighLight]}
      onPress={onPress}
      // onLongPress={() => {
      //   handleSelection(item?.thread_id);
      // }}
      
      >
      <MemoizedExpensiveContent item={item} isSelected={isSelected} />
    </Pressable>
  );
};

const ExpensiveContent: FC<{
  item: ThreadResponse;
  isSelected: boolean;
}> = ({item, isSelected}) => {
  const styles = useStyles();
  const theme = useTheme();
  const unreadCount = item.unread_count ?? 0;
  const read = item.unread_count === 0;

  const contact = item.contacts?.[0];
  const avatarName = String(contact?.displayName)
    ?.split(' ')
    .slice(0, 2)
    ?.map(name => name[0])
    ?.join('');

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {isSelected ? (
          <View style={styles.avatarSelectedPlaceholder}>
            <FontAwesome5 name="check" size={30} />
          </View>
        ) : // <Image
        //   style={styles.avatarImage}
        //   source={
        //     contact?.hasThumbnail && contact?.thumbnailPath
        //       ? {uri: contact?.thumbnailPath}
        //       : avatar
        //   }
        // />
        contact?.displayName ? (
          contact.thumbnailPath ? (
            <Image
              style={styles.avatarImage}
              source={{uri: contact.thumbnailPath}}
            />
          ) : (
            <>
              <View
                style={{
                  backgroundColor: '#EAE2FF',
                  height: ITEM_HEIGHT,
                  width: ITEM_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius:100
                }}>
                <Text
                  style={[
                    styles.avatarText,
                    {color: themeColorCombinations?.['light']?.avatarText},
                  ]}>
                  {avatarName}
                </Text>
              </View>
            </>
          )
        ) : (
          <Image style={styles.avatarImage} source={userIcon} />
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={CommonStyles.row}>
          <View style={CommonStyles.width60}>
            <HighlightedText
              prefix="name-"
              searchWords={tokenizeString(item?.keyword ?? '')}
              textToHighlight={formatName(
                item.contactName ||
                  contact?.displayName ||
                  item.phoneNumber ||
                  'unknown',
              )}
              TextComponent={NameText}
              textComponentProps={{read: read, selected: isSelected}}
            />
          </View>
          <View style={styles.descriptionBox}>
            <DescriptionText read={read} selected={isSelected}>
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
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadTxt}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <HighlightedText
          prefix="desc-"
          textComponentProps={{
            read: read,
            selected: isSelected,
            numberOfLines: 1,
          }}
          searchWords={tokenizeString(item.keyword ?? '')}
          TextComponent={DescriptionText}
          textToHighlight={item?.snippet ?? 'Loading ...'}
        />
      </View>
    </View>
  );
};

const MemoizedExpensiveContent = React.memo(ExpensiveContent);

export default ThreadCard3;

const ITEM_HEIGHT = normalize(50);

const ITEM_PADDING = common.spacings.verticalScale.s12;

export const ITEM_COVER_HEIGHT = ITEM_HEIGHT + ITEM_PADDING * 2;

const NameText: FC<{
  read: boolean;
  highlight?: boolean;
  selected?: boolean;
}> = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  font-weight: ${props =>
    props.read ? props.theme.fontWeight.w400 : props.theme.fontWeight.w800};
  color: ${props =>
    props.highlight
      ? props.theme.colors.primary
      : props.selected
      ? props.theme.colors.threadCardNameHighlightedText
      : props.theme.colors.black};
  font-family: ${props => props.theme.fontFamily};
`;

const DescriptionText: FC<{
  read: boolean;
  highlight?: boolean;
  selected?: boolean;
  children: ReactNode;
}> = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  font-weight: ${props =>
    props.read ? props.theme.fontWeight.w400 : props.theme.fontWeight.w800};
  color: ${props =>
    props.highlight
      ? props.theme.colors.primary
      : props.selected
      ? props.theme.colors.threadCardSubHighlightedText
      : props.theme.colors.black};
  font-family: ${props => props.theme.fontFamily};
`;

const useStyles = () => {
  const theme = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      empty: {
        height: 0,
      },
      cover: {
        paddingVertical: common.spacings.verticalScale.s12,
        paddingHorizontal: common.spacings.normalScale.s18,
        backgroundColor: theme.colors.white,
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
        backgroundColor: themeColorCombinations?.light?.background,
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
        borderRadius: normalize(100),
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
      avatarText: {
        fontSize: 20,
        color: '#3A3A3A',
      },
    });
  }, [theme]);

  return styles;
};
