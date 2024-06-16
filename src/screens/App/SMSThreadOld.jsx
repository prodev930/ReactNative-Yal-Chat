import useTheme from 'hooks/useTheme';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useObject, useQuery} from 'database';
import {tableNames} from 'database/tableNames';
import {
  GiftedChat,
  Bubble,
  Message,
  InputToolbar,
} from 'react-native-gifted-chat';
import {SMSQueries} from 'database/models/SMS/SMS.queries';
import ThreadHeader from 'components/ThreadHeader';
import {normalize, verticalScale} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageActionHeader from 'components/MessageActionHeader';
import ConfirmationDialouge from 'components/ConfirmationDialouge';
import {NativeSMSHandler} from 'nativeModules';
import {threadQueries} from 'database/models/Threads/Threads.queries';

const SMSThread = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const messageContainerRef = useRef();
  const {thread_id: t, phoneNumber, last_sms_id} = route.params;
  const [thread_id, set_thread_id] = useState(t);
  const [copyContent, setCopyContent] = useState(null);
  const [selected, setSelected] = useState([]);
  const [deleteConfirmDialouge, setDeleteConfirmDialouge] = useState(false);
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const styles = useCustomStyles(theme);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const threadExists = useObject(tableNames.Threads, thread_id ? thread_id : 0);

  const thread = useQuery(
    tableNames.SMS,
    collection => {
      return collection
        .filtered('thread_id == $0', thread_id ? thread_id : 0)
        .sorted('date', true);
    },
    [thread_id],
  );

  const contact = useQuery(
    tableNames.Contacts,
    collection => {
      return collection.filtered(`searchKey CONTAINS[c] $0`, phoneNumber);
    },
    [phoneNumber],
  );

  const handlePress = (e, item) => {
    if (selected.length) {
      handleLongPress(e, item);
    }
  };

  const handleLongPress = (e, item) => {
    if (selected.includes(item._id)) {
      setSelected([...selected.filter(d => item._id !== d)]);
    } else {
      setCopyContent(`${item.text}`);
      setSelected([...selected, item._id]);
    }
  };

  const getMessages = () =>
    thread.map(s => ({
      _id: s.id,
      text: s.body,
      createdAt: s.date,
      user: {
        _id: s.type,
      },
    }));

  const renderMessage = props => {
    return (
      <Message
        {...props}
        linkStyle={{
          right: {
            color: theme.colors.bubbleLinkColorRight,
          },
          left: {
            color: theme.colors.bubbleLinkColorLeft,
          },
        }}
      />
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: theme.colors.bubbleTextColorRight,
          },
          left: {
            color: theme.colors.black,
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: selected.includes(props.currentMessage._id)
              ? '#D8C9FF'
              : '#D9D9D9',
          },
          right: {
            backgroundColor: selected.includes(props.currentMessage._id)
              ? '#D8C9FF'
              : theme.colors.bubbleBGRight,
          },
        }}></Bubble>
    );
  };

  const onPressCopy = () => {
    console.log('copied : ', copyContent);
  };

  const onPressClear = () => {
    setCopyContent(null);
    console.log('cleared : ', copyContent);
  };

  const openDeleteConfirmationDialouge = () => {
    setDeleteConfirmDialouge(true);
  };
  const closeDeleteConfirmationDialouge = () => {
    setDeleteConfirmDialouge(false);
  };

  const onPressDelete = () => {
    openDeleteConfirmationDialouge();
  };

  const onPressConfirm = useCallback(async () => {
    try {
      const result = await SMSQueries.deleteSMSbyIds(selected);
      setSelected([]);
      closeDeleteConfirmationDialouge();
    } catch (err) {
      // console.log(
      //   err,
      //   'onPressDelete delete sms by ids location SMSThread.jsx',
      // );
      closeDeleteConfirmationDialouge();
    }
  }, [selected]);

  const onPressSend = useCallback(async () => {
    try {
      const sent = await NativeSMSHandler.sendSms(phoneNumber, message);
      setTimeout(async () => {
        setMessage('');
        const thread = await threadQueries.getThreadByPhoneNumber(phoneNumber);
        if (thread.length) {
          const thread_id = thread[0].thread_id;
          if (thread_id) {
            set_thread_id(thread_id);
          }
        }
      }, 3000);
    } catch (error) {
      // console.log(error, 'smsThread/onPressSend');
    }
  }, [message, phoneNumber]);

  const onPressCancel = () => {
    closeDeleteConfirmationDialouge();
  };

  const handleScrollToIndex = thread => {
    if (thread && thread.length) {
      let index = null;
      for (const [i, sms] of thread.entries()) {
        if (sms.id === last_sms_id) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        setTimeout(() => {
          messageContainerRef?.current?.scrollToIndex({
            animated: true,
            index,
          });
        }, 1000);
      }
    }
  };

  const onScrollToIndexFailed = error => {
    messageContainerRef?.current.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: true,
    });
    setTimeout(() => {
      if (
        thread &&
        thread.length !== 0 &&
        messageContainerRef?.current !== null
      ) {
        messageContainerRef?.current.scrollToIndex({
          index: error.index,
          animated: true,
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (thread_id) {
      SMSQueries.markThreadAsRead(thread_id);
    }
  }, [thread_id]);

  useEffect(() => {
    // if (!threadExists) {
    //   navigation.goBack();
    // }
  }, [threadExists]);

  // scroll to index helper
  useEffect(() => {
    handleScrollToIndex(thread);
  }, [thread]);

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white,
      }}>
      <ConfirmationDialouge
        visible={deleteConfirmDialouge}
        title="Delete this message?"
        description="This is permanent and can’t be undone"
        onCancelPressed={onPressCancel}
        onConfirmPressed={onPressConfirm}
        cancelText="Cancel"
        confirmText="Delete"
      />

      <MessageActionHeader
        onPressCopy={onPressCopy}
        onPressClear={onPressClear}
        onPressDelete={onPressDelete}
        selected={selected}
        setSelected={setSelected}
      />
      <ThreadHeader
        contact={contact}
        phoneNumber={phoneNumber}
        toggleModal={toggleModal}
      />
      <View style={{flex: 1}}>
        <GiftedChat
          listViewProps={{
            onScrollToIndexFailed,
          }}
          messageContainerRef={messageContainerRef}
          onLongPress={handleLongPress}
          onPress={handlePress}
          renderInputToolbar={props => (
            <InputToolbar
              {...props}
              containerStyle={{
                borderTopWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
                margin: theme.spacings.verticalScale.s24,
                padding: theme.spacings.verticalScale.s12,
                backgroundColor: '#D9D9D9',
                borderRadius: normalize(8),
              }}
              renderSend={props => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    setMessage('');
                    onPressSend();
                  }}
                  style={{
                    justifyContent: 'center',
                    height: '100%',
                  }}>
                  <MCI name="send" size={30} color="#A9A9A9" />
                </TouchableOpacity>
              )}
              renderComposer={props => (
                <TextInput
                  {...props}
                  style={{
                    width: '90%',
                    fontSize: theme.fontSize.f16,
                    color: theme.colors.black,
                  }}
                  placeholder="Text Message"
                  value={message}
                  onChangeText={setMessage}
                  placeholderTextColor={theme.colors.black}
                />
              )}
            />
          )}
          showUserAvatar={false}
          renderAvatar={null}
          showAvatarForEveryMessage={false}
          messages={getMessages()}
          user={{
            _id: '2',
          }}
          messagesContainerStyle={{
            paddingRight: theme.spacings.verticalScale.s12,
            paddingLeft: theme.spacings.verticalScale.s12,
            paddingTop: theme.spacings.verticalScale.s24,
            paddingBottom: verticalScale(60),
          }}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
        />
      </View>
      {isModalVisible && (
        <Modal isVisible={isModalVisible}>
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 15,
              borderRadius: 8,
              width: 150,
              paddingLeft: 15,
              alignSelf: 'flex-end',
              position: 'absolute',
              flex: 1,
            }}>
            <Text style={styles.modalText}>Send a message</Text>
            <Text style={styles.modalText}>Call</Text>
            <Text style={styles.modalText}>Edit</Text>
            <Text style={styles.modalText}>Copy</Text>
            <Text style={styles.modalText}>Delete</Text>
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
      <KeyboardAvoidingView />
    </View>
  );
};

export default SMSThread;

const useCustomStyles = theme => {
  const styles = useMemo(() => {
    return StyleSheet.create({
      modalText: {
        color: '#000',
        fontWeight: '500',
        paddingVertical: 8,
      },
    });
  }, [theme]);
  return styles;
};
