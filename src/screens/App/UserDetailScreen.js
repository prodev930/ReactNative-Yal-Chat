import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import ENT from 'react-native-vector-icons/Entypo';
import {
  chatIcon,
  incomingCallIcon,
  missedCallIcon,
  phoneIcon,
  userIcon,
  videoCallIcon,
} from 'assets/images';
import {common, themeColorCombinations} from 'constants/theme';
import {RecentCallsQueries} from 'database/models/RecentCalls/RecentCalls.queries';
import {RECENT_CALL_TYPES_MAP} from 'constants/recentCallTypesMap';
import Modal from 'react-native-modal';
import {useToast} from 'react-native-toast-notifications';
import {normalize} from 'utils/normalize';
import {useClipboard} from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {dispatchSnackBar} from 'utils/snackbar';
import Animated from 'react-native-reanimated';

const UserDetailScreen = props => {
  const toast = useToast();
  const [data, setString] = useClipboard();
  const [isShowMoreEnabled, setIsShowMoreEnabled] = useState(false);

  const {
    contact = {},
    userDetail = {},
    // callHistory = [],
  } = props?.route?.params;

  const [callHistory, setCallHistory] = useState([]);
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  useEffect(() => {
    (async () => {
      let dataForDisplay = [];
      try {
        dataForDisplay = await RecentCallsQueries.getAllRecentCalls();
      } catch (error) {
        console.log('fetching data on mount', {error});
      } finally {
        setCallHistory(dataForDisplay);
      }
    })();
  }, []);

  const deleteContact = async () => {
    try {
      const result = await ContactQueries.deleteContact(contact.recordID);
      console.log('🚀 ~ deleteContact ~ result:', result);
      if (result) {
        dispatchSnackBar({text: 'Deleted'});
        // console.log('starred successfully');
      }
    } catch (err) {
      // console.log({err, msg: 'ViewContactDrawer/onPressConfirm'});
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const avatarName = String(contact?.displayName)
    ?.split(' ')
    .slice(0, 2)
    ?.map(name => name[0])
    ?.join('');

  const myHistory = callHistory?.filter(item => {
    return item?.number == userDetail?.number;
  });

  const renderCallHistory = ({item, index, array}) => {
    const updatedTextColor = item?.type == 2 ? '#3A3A3A' : '#EB3223';
    const date = new Date(item?.date);
    const formattedDateHour = date.getHours();
    const formattedDateMin =
      date.getMinutes()?.toString()?.length == 1
        ? `0${date.getMinutes()}`
        : date.getMinutes();

    return (
      <View style={{paddingVertical: 8}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={item?.type == 1 ? incomingCallIcon : missedCallIcon}
            style={{
              height: 20,
              width: 32,
              resizeMode: 'contain',
              tintColor: updatedTextColor,
            }}
          />
          <View style={{paddingLeft: 8}}>
            <Text style={{color: 'black'}}>{item?.number}</Text>
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
    );
  };
  const toastObj = {
    type: 'normal',
    placement: 'bottom',
    duration: 2000,
    offset: normalize(150),
    animationType: 'slide-in',
  };

  const navigation = useNavigation();

  const myContactObj = {
    name: contact?.displayName || '',
    number: userDetail?.number,
  };

  const shareFunc = async () => {
    const shareOptions = {
      title: 'Shared on Whatsapp',
      message: JSON.stringify(myContactObj),
      failOnCancel: false,
      // urls: 'www.google.com',
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  const slicedArray =
    myHistory?.length > 5 ? myHistory?.slice(0, 4) : myHistory;
  console.log('🚀 ~ UserDetailScreen ~ slicedArray:', slicedArray?.length);

  return (
    <Animated.ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MCI name="keyboard-backspace" size={30} color={'#5D3AB7'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <ENT name="dots-three-vertical" size={20} color={'#5D3AB7'} />
        </TouchableOpacity>
      </View>
      <View style={styles.userNameContainer}>
        <View style={styles.avatarContainer}>
          {contact?.displayName ? (
            contact.thumbnailPath ? (
              <Image
                style={styles.avatarImage}
                source={{uri: contact.thumbnailPath}}
              />
            ) : (
              <>
                <Text style={[styles.avatarText]}>{avatarName}</Text>
              </>
            )
          ) : (
            <Image style={styles.avatarImage} source={userIcon} />
          )}
        </View>
        <View style={{paddingTop: 16, width: '100%'}}>
          {contact?.displayName ? (
            <Text style={[styles.userName, {textAlign: 'center'}]}>
              {contact?.displayName}
            </Text>
          ) : (
            <></>
          )}
          <Text style={[styles.userNumber, {textAlign: 'center'}]}>
            {userDetail?.number}
          </Text>
        </View>
      </View>
      <View style={styles.mobileDetailsContainer}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            justifyContent: 'space-around',
          }}>
          <View
            style={{backgroundColor: '#EAE2FF', padding: 8, borderRadius: 12}}>
            <Image
              source={phoneIcon}
              style={{height: 24, width: 24}}
              tintColor={'#5D3AB7'}
            />
          </View>
          <View
            style={{backgroundColor: '#EAE2FF', padding: 8, borderRadius: 12}}>
            <Image
              source={chatIcon}
              style={{height: 24, width: 24}}
              tintColor={'#5D3AB7'}
            />
          </View>
          <View
            style={{backgroundColor: '#EAE2FF', padding: 8, borderRadius: 12}}>
            <Image
              source={videoCallIcon}
              style={{height: 24, width: 24}}
              tintColor={'#5D3AB7'}
            />
          </View>
        </View>
      </View>
      <View style={styles.callhistoryContainer}>
        <Text style={{color: '#828282'}}>Call History</Text>
        <FlatList
          data={isShowMoreEnabled ? myHistory : slicedArray}
          renderItem={renderCallHistory}
          contentContainerStyle={{flex: 1}}
          ListFooterComponent={item => {
            return (
              <AnimatedTouchable
                style={{paddingTop: 8}}
                onPress={() => {
                  setIsShowMoreEnabled(!isShowMoreEnabled);
                }}>
                <Animated.Text style={{color: '#5D3AB7'}}>
                  {!isShowMoreEnabled ? 'Show More' : 'Show Less'}
                </Animated.Text>
              </AnimatedTouchable>
            );
          }}
        />
      </View>
      {isModalVisible && (
        <Modal
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          onBackdropPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                deleteContact();
                setModalVisible(false);
              }}>
              <Text style={styles.modalText}>Delete Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                shareFunc();
                setModalVisible(false);
              }}>
              <Text style={styles.modalText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setString(contact?.displayName || '');
                toast.show(`Copied ${contact?.displayName || ''}`, toastObj);
                setModalVisible(false);
              }}>
              <Text style={styles.modalText}>Copy Name</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setString(userDetail?.number);
                toast.show(`Copied ${userDetail?.number}`, toastObj);
                setModalVisible(false);
              }}>
              <Text style={styles.modalText}>Copy Number</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setString(JSON.stringify(myContactObj));
                toast.show(`Copied ${JSON.stringify(myContactObj)}`, toastObj);
                setModalVisible(false);
              }}>
              <Text style={styles.modalText}>Copy Contact</Text>
            </TouchableOpacity>

            <Text
              style={styles.modalText}
              onPress={() => {
                setModalVisible(false);
              }}>
              Close
            </Text>
          </View>
        </Modal>
      )}
    </Animated.ScrollView>
  );
};

export default UserDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userNameContainer: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  },
  avatarImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  avatarText: {
    fontSize: 30,
    color: '#3A3A3A',
  },
  avatarContainer: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#EAE2FF',
  },
  userName: {
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
    // paddingLeft: 16,
  },
  userNumber: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 16,
  },
  mobileDetailsContainer: {
    paddingVertical: 30,
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 20,
    // justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  },
  callhistoryContainer: {
    paddingVertical: 30,
    flex: 1,
  },
  descriptionText: {
    fontSize: common.fontSize.f12,
    fontWeight: common.fontWeight.w300,
    color: 'green',
    fontFamily: common.fontFamily,
  },
  descriptionTextTypeCallEnd: {
    color: 'red',
  },
  modalText: {
    color: '#000',
    fontWeight: '500',
    paddingVertical: 8,
  },
  modalContainer: {
    backgroundColor: themeColorCombinations?.light.background,
    paddingVertical: 15,
    borderRadius: 8,
    width: 150,
    paddingLeft: 15,
    alignSelf: 'flex-end',
    position: 'absolute',
    elevation: 5,
    top: 0,
  },
});
