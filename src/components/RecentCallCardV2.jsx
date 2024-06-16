import React, {memo, useContext, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Button,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {normalize} from 'utils/normalize';
import {formatName, splitNumber} from 'utils/utilities';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {
  arrow_icon,
  avatar,
  bottomTabFocusedCallIcon,
  bottomTabFocusedContactsIcon,
  bottomTabFocusedSmsIcon,
  chatIcon,
  incomingCallIcon,
  logo,
  missedCallIcon,
  userIcon,
  videoCallIcon,
} from 'assets/images';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {RECENT_CALL_TYPES_MAP} from 'constants/recentCallTypesMap';
import {handleCall} from 'utils/call';
import Spacer from './Spacer';
import {CommonStyles} from 'styled/common.styles';
import {common, themeColorCombinations} from 'constants/theme';
import useTheme from 'hooks/useTheme';
import {useSelector} from 'react-redux';
import {selectContactByPhoneNumber} from 'redux/contacts-map';
// import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import MyAppThemeContext from 'context/MyAppTheme';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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

const RecentCallCard = ({
  item,
  handles,
  handleMessage,
  results,
  setModalVisible,
  isModalVisible,
  index,
  setSelectedMobileNumber,
}) => {
  const theme = useTheme();
  const {theme: mytheme} = useContext(MyAppThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setselectedIndex] = useState(null);
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const height = useSharedValue(70);

  const handleViewHeight = h => {
    !isExpanded
      ? (height.value = withSpring(70 + 50))
      : (height.value = withSpring(70));
  };

  const fadeInOpacity = useSharedValue(0);

  const fadeIn = () => {
    fadeInOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.linear,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInOpacity.value, // Use the value directly
    };
  });

  const navigation = useNavigation();

  const toggleModal = number => {
    setSelectedMobileNumber(number);
    setModalVisible(true);
  };
  const date = new Date(item?.date);
  const formattedDateHour = date.getHours();
  const formattedDateMin =
    date.getMinutes()?.toString()?.length == 1
      ? `0${date.getMinutes()}`
      : date.getMinutes();

  const contact =
    useSelector(state => selectContactByPhoneNumber(state, item.number)) ?? {};

  const avatarName = String(contact?.displayName)
    ?.split(' ')
    .slice(0, 2)
    ?.map(name => name[0])
    ?.join('');

  const updatedTextColor =
    item?.type == 3 ? 'red' : themeColorCombinations?.[mytheme]?.textcolor;

  const styles = useCustomStyles(theme);

  if (!item) {
    return <View style={styles.cover} />;
  }

  const onPressCall = () => {
    handleCall(handles[0].id, item?.number);
  };

  const onPressMessage = () => {
    const {phoneNumber, countryCode} = splitNumber(item?.number);
    console.log("🚀 ~ onPressMessage ~ phoneNumber:", phoneNumber)
    navigation.navigate(screens.APP.SMS_THREADS, {
      // thread_id: item?.thread_id,
      phone_number: item?.phoneNumber,
    });
    // handleMessage(phoneNumber);
    
  };

  return (
    <AnimatedTouchable
      style={[
        styles.cover,
        {backgroundColor: isExpanded ? '#F7F5FF' : '#fff', height},
      ]}
      onPress={() => {
        setIsExpanded(!isExpanded);
        // isExpanded ? handlePressIncrease() : handlePressDecrease();
        handleViewHeight();
        fadeIn();
      }}
      xx
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        // handleViewHeight(height);
      }}
      onLongPress={() => {
        toggleModal(item.number);
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.avatarContainer,
            {
              backgroundColor:
                themeColorCombinations?.[mytheme]?.avatarContainer,
            },
          ]}
          onPress={() => {
            navigation.navigate(screens.APP.USERDETAIL, {
              userDetail: item,
              contact: contact,
              callHistory: results,
            });
          }}>
          {contact?.displayName ? (
            contact.thumbnailPath ? (
              <Image
                style={styles.avatarImage}
                source={{uri: contact.thumbnailPath}}
              />
            ) : (
              <>
                <Text
                  style={[
                    styles.avatarText,
                    {color: themeColorCombinations?.[mytheme]?.avatarText},
                  ]}>
                  {avatarName}
                </Text>
              </>
            )
          ) : (
            <Image style={styles.avatarImage} source={userIcon} />
          )}
        </TouchableOpacity>
        <View style={styles.detailsContainer}>
          <View>
            <View style={CommonStyles.row}>
              <View style={CommonStyles.width100}>
                <Text style={[styles.nameText, {color: updatedTextColor}]}>
                  {formatName(
                    contact.displayName ||
                      item.displayName ||
                      item.number ||
                      'unknown',
                  )}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={item?.type == 1 ? incomingCallIcon : missedCallIcon}
                style={{
                  height: 16,
                  width: 32,
                  resizeMode: 'contain',
                  tintColor: updatedTextColor,
                }}
              />

              <Text
                style={[
                  styles.descriptionText,
                  item.type !== '1' &&
                    item.type !== '2' &&
                    styles.descriptionTextTypeCallEnd,
                  {color: updatedTextColor},
                ]}>
                {`${
                  RECENT_CALL_TYPES_MAP[item.type]
                } Call • ${formattedDateHour}`}
                :{formattedDateMin}{' '}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonActionContainer}>
          <Pressable
            onPress={onPressCall}
            style={{
              paddingRight: 5,
            }}>
            <Image
              source={bottomTabFocusedCallIcon}
              style={{
                height: 18,
                width: 18,
                alignSelf: 'center',
              }}
            />
          </Pressable>
        </View>
        <View></View>
      </View>
      {isExpanded && (
        <Animated.View
          style={[
            animatedStyle,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 20,
              // marginRight: 40,
              paddingVertical: 6,
              paddingHorizontal: 20,
            },
          ]}>
          <TouchableOpacity style={{marginTop: 5}} onPress={onPressCall}>
            <Image
              source={bottomTabFocusedCallIcon}
              style={{height: 24, width: 24, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 5}} onPress={onPressMessage}>
            <Image
              source={chatIcon}
              style={{height: 24, width: 24, resizeMode: 'contain'}}
              tintColor={'#5D3AB7'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 5}}>
            <Image
              source={videoCallIcon}
              style={{
                height: 24,
                width: 24,
                resizeMode: 'contain',
                tintColor: 'grey',
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </AnimatedTouchable>
  );
};
export default RecentCallCard;

const borderWidth = 0;
const height = normalize(50);
const ITEM_PADDING = common.spacings.verticalScale.s12;

export const ITEM_HEIGHT = height + ITEM_PADDING * 2;

const useCustomStyles = theme => {
  const styles = useMemo(() => {
    return StyleSheet.create({
      cover: {
        paddingVertical: ITEM_PADDING,
        marginHorizontal: common.spacings.normalScale.s18,
        paddingHorizontal: 6,
        marginTop: 4,
        borderRadius: 8,
        // height: ITEM_HEIGHT,
      },
      container: {
        borderWidth: borderWidth,
        flexDirection: 'row',
        width: '100%',
        height: height,
      },
      avatarContainer: {
        height: height,
        width: height,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(100),
        backgroundColor: '#EAE2FF',
        // borderColor:"#333",
        // borderWidth:0.5
      },
      avatarImage: {
        height: height,
        width: height,
        borderRadius: normalize(100),
        resizeMode: 'contain',
      },
      detailsContainer: {
        flex: 1,
        height: '100%',
        paddingLeft: common.spacings.normalScale.s12,
        paddingRight: 4,
        justifyContent: 'space-around',
      },
      buttonActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      nameText: {
        fontSize: common.fontSize.f16,
        fontWeight: common.fontWeight.w400,
        color: theme.colors.threadCardNameText,
        fontFamily: common.fontFamily,
      },
      descriptionText: {
        fontSize: common.fontSize.f12,
        fontWeight: common.fontWeight.w300,
        color: theme.colors.threadCardSubText,
        fontFamily: common.fontFamily,
      },
      descriptionTextTypeCallEnd: {
        color: theme.colors.callEndButtonBG,
      },
      avatarText: {
        fontSize: 20,
        color: '#3A3A3A',
      },
      modalText: {
        color: '#000',
        fontWeight: '500',
        paddingVertical: 8,
        // fontFamily:"Poppins"
      },
    });
  }, [theme]);
  return styles;
};
