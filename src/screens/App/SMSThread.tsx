/* eslint-disable @typescript-eslint/no-explicit-any */
import useTheme from 'hooks/useTheme';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Keyboard,
  // KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {
  GiftedChat,
  Bubble,
  Message,
  InputToolbar,
  IMessage,
  MessageProps,
  BubbleProps,
  ComposerProps,
  SendProps,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import ThreadHeader from 'components/ThreadHeader';
import {normalize, verticalScale} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageActionHeader from 'components/MessageActionHeader';
import ConfirmationDialogue from 'components/ConfirmationDialouge';
import debounce from 'lodash.debounce';

import {
  keepPreviousData,
  useInfiniteQuery as useTanStackInfiniteQuery,
} from '@tanstack/react-query';
import SMSQueryServices from 'services/sms-query.services';
import {CommonStyles} from 'styled/common.styles';
import {common} from 'constants/theme';
import {ThreadRouterProps} from 'navigations/types';
import ThreadQueryServices from 'services/thread-query.services';
import {selectConversationsViewIdByTarget, updateViewId} from 'redux/threads';
import {useDispatch, useSelector} from 'react-redux';
import {convertSMSToGiftedChatData} from 'utils/threads';
import {Toast} from 'react-native-toast-notifications';
import {screens} from 'constants/screens';

const SMSThread = () => {
  const dispatch = useDispatch();
  const route = useRoute<ThreadRouterProps>();
  const styles = useStyles();
  const messageContainerRef = useRef<FlatList<IMessage>>(null);
  const {
    thread_id: threadIdParam,
    phone_number: phoneNumber,
    last_sms_id,
  } = route.params;

  const [threadId, setTreadId] = useState(threadIdParam);

  const [copyContent, setCopyContent] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteConfirmDialogue, setDeleteConfirmDialogue] = useState(false);
  const theme = useTheme();
  const messageRef = useRef('');
  const textInputRef = useRef<TextInput>(null);
  const smsThreadViewID = useSelector(state =>
    selectConversationsViewIdByTarget(state, screens.APP.SMS_THREADS),
  );

  const {data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useTanStackInfiniteQuery({
      queryKey: ['sms-thread-content', threadId],
      initialPageParam: -1,
      queryFn: async ({pageParam}: {pageParam: number}) => {
        const _cursor = Number.isFinite(pageParam) ? pageParam : -1;
        const response = await SMSQueryServices.getSMSbyThreadId(
          threadId,
          _cursor,
        );
        return {
          sms: response?.sms.map(convertSMSToGiftedChatData) ?? [],
          cursor: response.cursor,
        };
      },
      getNextPageParam: lastPage => {
        if (lastPage.cursor?.has_next) {
          return lastPage?.cursor?.next_cursor ?? -1;
        }
        return undefined;
      },
      getPreviousPageParam: firstPage => {
        return firstPage?.cursor?.next_cursor ?? -1;
      },
      enabled: Number.isFinite(threadId),
      placeholderData: keepPreviousData,
    });

  /**
   * refetch when the view id is updated by
   *  received new SMS
   */
  useEffect(() => {
    if (smsThreadViewID && smsThreadViewID.startsWith('received')) {
      refetch();
    }
  }, [refetch, smsThreadViewID]);

  const displayedData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.pages.reduce((acc, page) => {
      return [...acc, ...page.sms];
    }, [] as IMessage[]);
  }, [data]);

  const handlePress = (context: any, _message: IMessage) => {
    if (selected.length) {
      handleLongPress(context, _message);
    }
  };

  const handleLongPress = (context: any, _message: IMessage) => {
    const {_id} = _message;
    if (selected.includes(_id as number)) {
      setSelected([...selected.filter(item => _message._id !== item)]);
    } else {
      setCopyContent(`${_message.text}`);
      setSelected([...selected, _message._id as number]);
    }
  };

  const renderMessage = (props: MessageProps<IMessage>) => {
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

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: theme.colors.bubbleTextColorRight,
          },
          left: {
            color: theme.colors.bubbleTextColorLeft,
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: selected.includes(props.currentMessage?._id)
              ? theme.colors.selectedBubbleBGLeft
              : theme.colors.bubbleBGLeft,
          },
          right: {
            backgroundColor: selected.includes(props.currentMessage._id)
              ? theme.colors.selectedBubbleBGRight
              : theme.colors.bubbleBGRight,
          },
        }}
      />
    );
  };

  const onPressCopy = () => {
    console.log('copied : ', copyContent);
  };

  const onPressClear = () => {
    setCopyContent(null);
    console.log('cleared : ', copyContent);
  };

  const openDeleteConfirmationDialogue = () => {
    setDeleteConfirmDialogue(true);
  };
  const closeDeleteConfirmationDialogue = () => {
    setDeleteConfirmDialogue(false);
  };

  const onPressDelete = () => {
    openDeleteConfirmationDialogue();
  };

  const onPressConfirm = useCallback(async () => {
    try {
      await SMSQueryServices.deleteSMSs(selected);
      closeDeleteConfirmationDialogue();
    } catch (err) {
      closeDeleteConfirmationDialogue();
    } finally {
      setSelected([]);
      refetch();
    }
  }, [refetch, selected]);

  const onPressSend = useMemo(
    () =>
      debounce(async () => {
        const message = messageRef.current ?? '';

        try {
          if (!message || !phoneNumber) {
            !message &&
              Toast.show('Please enter a message', {
                type: 'error',
              });
            !phoneNumber &&
              Toast.show('Please enter a phone number', {
                type: 'error',
              });
            return;
          }

          const sentSuccess = await SMSQueryServices.sendSMSViaPhoneNumber(
            phoneNumber,
            message,
          );

          if (!sentSuccess) {
            Toast.show('Failed to send message', {
              type: 'error',
            });
            return;
          }

          messageRef.current = '';
          textInputRef.current?.clear();

          /**
           * if it's a new thread, we need to get the thread id
           */
          if (!threadId) {
            setTimeout(async () => {
              const _threadId =
                await ThreadQueryServices.getThreadIdByPhoneNumber(phoneNumber);

              if (_threadId > 0) {
                setTreadId(_threadId);
              }
            }, 3000);
          } else {
            setTimeout(() => {
              console.log('refetch');
              // Keyboard.dismiss();
              refetch();
            }, 100);
          }
        } catch (error) {
          // console.log(error, 'smsThread/onPressSend');
        }
      }, 500),
    [phoneNumber, refetch, threadId],
  );

  const onPressCancel = () => {
    closeDeleteConfirmationDialogue();
  };

  const handleScrollToIndex = useCallback(
    (sms: IMessage[] | undefined) => {
      if (!sms || sms.length === 0) {
        return;
      }

      let index = -1;
      for (const [i, _sms] of sms.entries()) {
        if (_sms._id === last_sms_id) {
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
    },
    [last_sms_id],
  );

  // const onScrollToIndexFailed = (error: any) => {
  //   messageContainerRef?.current?.scrollToOffset({
  //     offset: error.averageItemLength * error.index,
  //     animated: true,
  //   });
  //   setTimeout(() => {
  //     if (
  //       displayedData &&
  //       displayedData.length !== 0 &&
  //       messageContainerRef?.current !== null
  //     ) {
  //       messageContainerRef?.current.scrollToIndex({
  //         index: error.index,
  //         animated: true,
  //       });
  //     }
  //   }, 100);
  // };

  useEffect(() => {
    /**
     * try to get thread id if have phone number
     */
    const getThreadId = async () => {
      if (phoneNumber && !threadId) {
        try {
          const _threadId = await ThreadQueryServices.getThreadIdByPhoneNumber(
            phoneNumber,
          );

          if (_threadId > 0) {
            setTreadId(_threadId);
          }
        } catch (error: any) {
          console.log('getThreadIdByPhoneNumber', error.message);
        }
      }
    };

    getThreadId();
  }, [phoneNumber, threadId]);

  /**
   * mark thread as read
   */
  useEffect(() => {
    if (threadId) {
      ThreadQueryServices.markThreadAsRead(threadId);
      // notify to SMS screen to update the view id
      dispatch(updateViewId({action: 'read', targets: [screens.APP.SMS]}));
    }
  }, [dispatch, threadId]);

  // scroll to index helper
  useEffect(() => {
    // handleScrollToIndex(displayedData);
  }, [displayedData, handleScrollToIndex]);

  const onChangeText = useCallback((text: string) => {
    messageRef.current = text;
  }, []);

  const onBlur = useCallback(() => {
    Keyboard.isVisible() && Keyboard.dismiss();
  }, []);

  const renderComposer = useCallback(
    (_props: ComposerProps) => {
      const {multiline} = _props;

      return (
        <UncontrolledTextInput
          textInputRef={textInputRef}
          onChangeText={onChangeText}
          onBlur={onBlur}
          multiline={multiline}
          placeholderTextColor={theme.colors.ChatInputPlaceHolderColor}
        />
      );
    },
    [onBlur, onChangeText, theme.colors.ChatInputPlaceHolderColor],
  );

  const renderSend = useCallback(
    (_props: SendProps<IMessage>) => (
      <Pressable
        {..._props}
        onPress={onPressSend}
        disabled={_props.disabled}
        style={styles.sendButton}>
        <MCI
          name="send"
          size={30}
          color={
            _props.disabled
              ? theme.colors.placeholderTextColor
              : theme.colors.secondary
          }
        />
      </Pressable>
    ),
    [
      onPressSend,
      styles.sendButton,
      theme.colors.placeholderTextColor,
      theme.colors.secondary,
    ],
  );

  const renderInputToolbar = useCallback(
    (_props: InputToolbarProps<IMessage>) => (
      <InputToolbar {..._props} containerStyle={styles.toolBar} />
    ),
    [styles.toolBar],
  );

  const onLoadEarlier = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <View style={styles.container}>
      <ConfirmationDialogue
        visible={deleteConfirmDialogue}
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
      <ThreadHeader phoneNumber={phoneNumber} />
      <View style={CommonStyles.flex1}>
        <GiftedChat
          infiniteScroll
          keyboardShouldPersistTaps={'never'}
          loadEarlier={hasNextPage}
          onLoadEarlier={onLoadEarlier}
          isLoadingEarlier={isFetchingNextPage}
          listViewProps={{}}
          messageContainerRef={messageContainerRef}
          onLongPress={handleLongPress}
          onPress={handlePress}
          showUserAvatar={false}
          showAvatarForEveryMessage={false}
          messages={displayedData ?? []}
          user={{
            _id: 2,
          }}
          messagesContainerStyle={styles.messageContainer}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderAvatar={null}
        />
      </View>

      {/* <KeyboardAvoidingView /> */}
    </View>
  );
};

interface UncontrolledTextInputProps {
  multiline?: boolean;
  textInputRef: RefObject<TextInput>;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  placeholderTextColor?: string;
}

class UncontrolledTextInput extends React.PureComponent<UncontrolledTextInputProps> {
  render() {
    const {
      textInputRef,
      onChangeText,
      onBlur,
      multiline,
      placeholderTextColor,
    } = this.props;

    return (
      <View style={composerStyles.container}>
        <TextInput
          // {..._props}
          multiline={multiline}
          ref={textInputRef}
          style={composerStyles.composerInput}
          placeholder="Type to send"
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholderTextColor={placeholderTextColor}
        />
      </View>
    );
  }
}

const composerStyles = StyleSheet.create({
  container: {
    width: '92%',
  },
  composerInput: {
    width: '80%',
    fontSize: common.fontSize.f16,
  },
});

const useStyles = () => {
  const theme = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.chatBG,
      },
      toolBar: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: common.spacings.verticalScale.s24,
        padding: common.spacings.verticalScale.s12,
        backgroundColor: theme.colors.bubbleBGLeft,
        borderRadius: normalize(18),
        borderTopWidth: 0,
      },
      messageContainer: {
        paddingRight: theme.spacings.verticalScale.s12,
        paddingLeft: theme.spacings.verticalScale.s12,
        paddingTop: theme.spacings.verticalScale.s24,
        paddingBottom: verticalScale(60),
      },
      sendButton: {
        justifyContent: 'center',
        height: '100%',
      },
    });
  }, [theme]);

  return styles;
};

export default SMSThread;
