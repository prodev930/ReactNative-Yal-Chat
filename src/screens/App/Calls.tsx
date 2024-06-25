/* eslint-disable @typescript-eslint/no-explicit-any */
import useTheme from 'hooks/useTheme';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MT } from 'styled/MT';
import { useNavigation } from '@react-navigation/native';
import { Wrapper } from 'styled';
import Switcher from 'components/Switcher';
import CallSectionHeader from 'components/CallSectionHeader';
import DialPadFAB from 'components/Buttons/DialPadFAB';
import DialPad from 'components/DialPad';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { normalize } from 'utils/normalize';
import RecentCallCard, { ITEM_HEIGHT } from 'components/RecentCallCardV2';
import { screens } from 'constants/screens';
import usePhoneHandles from 'hooks/usePhoneHandles';
import { RecentCallsQueries } from 'database/models/RecentCalls/RecentCalls.queries';
import { useRecentCallSync } from 'hooks/useSync';
import debounce from 'lodash.debounce';
import { ContactQueries } from 'database/models/Contacts/Contacts.queries';
import ActivityIndicatorController, {
  ActivityIndicatorControllerRef,
} from 'components/ActivityIndicatorController';
import { themeColorCombinations } from 'constants/theme';
import MyAppThemeContext from 'context/MyAppTheme';
import Modal from 'react-native-modal';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
import ThreadQueryServices from 'services/thread-query.services';
import { openDialPad } from 'redux/utils';

const Calls = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const store = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { phoneHandles } = usePhoneHandles();
  const { recentCallSyncDone } = useRecentCallSync(true);
  // const originDataRef = useRef<any[]>([]);
  // const fetchNewControllerRef = useRef<ActivityIndicatorControllerRef>(null);
  const emptyControlRef = useRef<ActivityIndicatorControllerRef>(null);
  const isDialPadOpen = useSelector(state => state.utils.dialPad);
  const originDataRef = useRef([]);
  const fetchNewControllerRef = useRef(null);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState<
    number | string | null
  >(null);
  const [defaultNumberSelction, setDefaultNumberSelction] = useState(null);
  const [data, setString] = useClipboard();
  const toast = useToast();

  const { theme: mytheme } = useContext(MyAppThemeContext);

  const setLoading = useCallback(
    ({
      isShow,
      message1,
      message2,
    }: {
      isShow: boolean;
      message1?: string;
      message2?: string;
    }) => {
      if (isShow) {
        fetchNewControllerRef.current?.updateStatus({
          loading: true,
          text: message1 ?? '',
        });
        typeof message2 === 'string' &&
          emptyControlRef.current?.setMessage(message2);
      } else {
        fetchNewControllerRef.current?.updateStatus({
          loading: false,
        });
        typeof message1 === 'string' &&
          fetchNewControllerRef.current?.setMessage(message1);

        typeof message2 === 'string' &&
          emptyControlRef.current?.setMessage(message2);
      }
    },
    [],
  );

  const [isModalVisible, setModalVisible] = useState(false);

  /**
   * fetching data on mount
   */
  useEffect(() => {
    setInterval(() => {
      if (recentCallSyncDone) {
        (async () => {
          try {
            setLoading({ isShow: true });
            const dataForDisplay = await RecentCallsQueries.getAllRecentCalls();
            originDataRef.current = dataForDisplay ?? [];
            setResults(originDataRef.current);
          } catch (error) {
            console.log('fetching data on mount', { error });
            setResults([]);
          } finally {
            setLoading({ isShow: false, message2: 'You have no recent calls' });
          }
        })();
      }
    }, 1000)
  }, [recentCallSyncDone, setLoading]);

  const onSearch = useCallback(
    async (text: string) => {
      const keyword = text.trim();
      let result: any[] = [];
      setLoading({ isShow: true });
      try {
        if (searchOpen && keyword) {
          const contacts = await ContactQueries.searchContacts(keyword);
          const phoneNumbers: string[] = [];
          contacts?.forEach(contact => {
            const _phoneNumbers = ((contact?.phoneNumbers as any[]) ?? []).map(
              p => p.number,
            );
            phoneNumbers.push(..._phoneNumbers);
          });
          result =
            (await RecentCallsQueries.searchCallLog(keyword, phoneNumbers)) ??
            [];
        } else {
          result = originDataRef.current;
        }
      } catch (error) {
        console.log('onSearch', { error });
      } finally {
        setLoading({
          isShow: false,
          message1:
            result.length === 0 ? `No results for "${keyword}"` : undefined,
          message2: 'Check the spelling or try a new search - search',
        });
        setResults(result);
      }
    },
    [searchOpen, setLoading],
  );

  const onDialKeyPadPress = useMemo(() => {
    return debounce(async _phoneNumber => {
      let result = []
      let contact_result = []
      let call_result = []

      const _isDialPadOpen = store.getState().utils.dialPad;

      if (!_isDialPadOpen) {
        return;
      }

      try {
        setLoading({ isShow: true });
        if (_phoneNumber) {
          call_result = await RecentCallsQueries.searchCallLogByNumber(_phoneNumber);
          contact_result = await ContactQueries.searchContacts(_phoneNumber);

          result = [...call_result, ...contact_result];

        } else {
          result = originDataRef.current;
        }
      } catch (error) {
      } finally {
        setLoading({
          isShow: false,
          message1: result.length === 0 && `No results for "${_phoneNumber}"`,
          message2: 'Check the spelling or try a new search - dialpad',
        });
        setResults(result);
      }
    }, 250);
  }, [setLoading, store]);

  const handleMessage = useCallback(
    async (_phoneNumber: string) => {
      try {
        const threadId = await ThreadQueryServices.getThreadIdByPhoneNumber(
          _phoneNumber,
        );

        if (threadId === -1) {
          return;
        }

        navigation.navigate(screens.APP.SMS_THREADS, {
          thread_id: threadId,
          phone_number: _phoneNumber,
        });
      } catch (err) {
        console.log({ err });
      }
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <RecentCallCard
          handles={phoneHandles}
          item={item}
          handleMessage={handleMessage}
          results={results}
          mytheme={mytheme}
          setModalVisible={setModalVisible}
          isModalVisible={isModalVisible}
          index={index}
          setSelectedMobileNumber={setSelectedMobileNumber}
        />
      );
    },
    [handleMessage, phoneHandles, isModalVisible],
  );

  const keyExtractor = useCallback(item => item.recordID, []);

  const renderEmptyCallsList = useCallback(() => {
    return (
      <ActivityIndicatorController ref={emptyControlRef} defaultMessage="" />
    );
  }, []);

  const renderHeaderListWithActivityIndicator = useCallback(() => {
    return <ActivityIndicatorController ref={fetchNewControllerRef} />;
  }, []);

  return (
    <View
      style={{
        backgroundColor: themeColorCombinations?.[mytheme]?.background,
        flex: 1,
      }}
      onStartShouldSetResponder={() => {
        setModalVisible(false);
      }}>
      <StatusBar
        backgroundColor={themeColorCombinations?.[mytheme]?.background}
      />
      <CallSectionHeader
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onSearch={onSearch}
      />

      <MT />
      {recentCallSyncDone === true ? (
        <FlashList
          estimatedItemSize={ITEM_HEIGHT}
          ListEmptyComponent={renderEmptyCallsList}
          data={results}
          ListHeaderComponent={renderHeaderListWithActivityIndicator}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          decelerationRate={'normal'}
          ListFooterComponent={<MT MT={normalize(60)} />}
          contentContainerStyle={styles.listFooter}
        />
      ) : (
        <ActivityIndicatorController
          defaultLoading
          defaultMessage="Syncing your call history ..."
        />
      )}
      {searchOpen ? null : (
        <>
          <DialPadFAB />
          <DialPad
            phoneHandles={phoneHandles}
            onDialPadValueChange={onDialKeyPadPress}
            defaultValue={defaultNumberSelction}
          />
        </>
      )}

      {isModalVisible && (
        <Modal
          // transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          onBackdropPress={() => {
            setModalVisible(false);
          }}>
          <Animated.View
            style={{
              backgroundColor: themeColorCombinations?.light.background,
              paddingVertical: 15,
              borderRadius: 8,
              width: 150,
              paddingLeft: 15,
              alignSelf: 'flex-end',
              position: 'absolute',
              elevation: 5,
            }}>
            <Text style={styles.modalText}>{selectedMobileNumber}</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setString(selectedMobileNumber);
                toast.show(`Copied ${selectedMobileNumber}`);
              }}>
              <Text style={styles.modalText}>Copy Number</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                dispatch(openDialPad());
                setDefaultNumberSelction(selectedMobileNumber);
              }}>
              <Text style={styles.modalText}>Edit number before call</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Block/report junk</Text>
            <Text style={styles.modalText}>Delete</Text>
            <Text
              style={styles.modalText}
              onPress={() => {
                setModalVisible(false);
              }}>
              Close
            </Text>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listFooter: {
    // paddingBottom: 100,
  },
  modalText: {
    color: '#000',
    fontWeight: '500',
    paddingVertical: 8,
  },
});

export default Calls;