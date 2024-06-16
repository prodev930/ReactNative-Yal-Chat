import useTheme from 'hooks/useTheme';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {MT} from 'styled/MT';
import {normalize} from 'utils/normalize';
import {Wrapper} from 'styled';
import HeaderBar from 'components/HeaderBar';
import {tableNames} from 'database/tableNames';
import Switcher from 'components/Switcher';
import NewChatFAB from 'components/Buttons/NewChatFAB';
import ThreadCard from 'components/ThreadCard';
import {FlashList} from '@shopify/flash-list';
import {useQuery} from 'database';
import ThreadActionHeader from 'components/ThreadActionHeader';
import CategoryList from 'components/CategoryList';
import {threadQueries} from 'database/models/Threads/Threads.queries';
import {SMSQueries} from 'database/models/SMS/SMS.queries';
import MessageBox from 'components/MessageBox';
import ConfirmationDialouge from 'components/ConfirmationDialouge';
import {CommonStyles} from 'styled/common.styles';
import useSync from 'hooks/useSync';
import {AppContext} from '../../../App';
import {searchIcon} from 'assets/images';
import {Dropdown} from 'react-native-element-dropdown';
import {themeColorCombinations} from 'constants/theme';
import MyAppThemeContext from 'context/MyAppTheme';

const ITEM_HEIGHT = normalize(50);

const SMS = () => {
  const theme = useTheme();
  const [category, setCategory] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [threadsToDisplay, setThreadsToDisplay] = useState(null);
  console.log("🚀 ~ SMS ~ threadsToDisplay:",  JSON.stringify(threadsToDisplay?.[16]) )
  const [deleteConfirmDialouge, setDeleteConfirmDialouge] = useState(false);
  const inputRef = useRef();
  const {permissions} = useContext(AppContext);

  const {theme: mytheme} = useContext(MyAppThemeContext);

  const {smsSyncDone, idBeingSynced, threadsGenerationDone} =
    useSync(permissions);

  const CallsFilterData = [
    {label: 'Inbox', value: 1},
    {label: 'Unread', value: 2},
    {label: 'Promotions', value: 3},
    {label: 'Important', value: 4},
    {label: 'Spams', value: 5},
    {label: 'Scams', value: 6},
  ];

  const [value, setValue] = useState(1);
  const [isFocus, setIsFocus] = useState(false);

  const threads = useQuery(
    tableNames.Threads,
    collection => {
      return collection.sorted('date', true);
    },
    [],
  );

  const categorizeThreads = async categories => {
    setThreadsToDisplay(null);
    try {
      const thread_ids_set = new Set();
      const allSMS = await SMSQueries.getAllSMS();
      categories.forEach(category => {
        for (const sms of allSMS) {
          if (sms.category.has(category)) {
            thread_ids_set.add(sms.thread_id);
          }
        }
      });
      const thread_ids = Array.from(thread_ids_set);
      if (thread_ids.length) {
        const _threads = await threadQueries.getThreadsByIds(thread_ids);
        setThreadsToDisplay([..._threads]);
      } else {
        setThreadsToDisplay([]);
      }
    } catch (err) {
      setThreadsToDisplay([]);
      // console.log(err, 'categorizeThreads');
    }
  };

  const renderEmptyCallsList = () => {
    return (
      <View>
        <MessageBox message={'No data at the moment !!!'} />
      </View>
    );
  };

  const renderItem = useCallback(
    ({item}) => {
      return (
        <ThreadCard item={item} selected={selected} setSelected={setSelected} />
      );
    },
    [selected],
  );

  const handleSearch = useCallback(async text => {
    if (text && text.length) {
      try {
        const keyword = text.trim();
        const sms = await SMSQueries.searchSMS2(keyword);
        const _thread = sms.map(s => ({
          thread_id: s.thread_id,
          sms_id: s.id,
          phoneNumber: s.phoneNumber,
          last_sms_id: s.id,
          keyword: keyword,
        }));

        if (_thread && _thread.length) {
          setThreadsToDisplay([..._thread]);
        } else {
          setThreadsToDisplay([]);
        }
      } catch (err) {
        // console.log(err);
      }
    } else {
      const _threads = await threadQueries.getAllThreads();
      setThreadsToDisplay(_threads);
    }
  }, []);

  const handleClearSelection = () => {
    setSelected([]);
  };

  const handlePressCancel = () => {
    closeDeleteConfirmationDialouge();
  };

  const handleDelete = () => {
    openDeleteConfirmationDialouge();
  };

  const handlePin = useCallback(async () => {
    try {
      const result = await threadQueries.togglePinned(selected);
      setSelected([]);
    } catch (error) {
      // console.log(err, 'ThreadActionHeader/handlePin');
    }
  }, [selected]);

  const handleArchive = useCallback(async () => {
    try {
      const result = await threadQueries.toggleArchived(selected);
      setSelected([]);
    } catch (error) {
      // console.log(err, 'ThreadActionHeader/handleArchive');
    }
  }, [selected]);

  const closeDeleteConfirmationDialouge = () => {
    setDeleteConfirmDialouge(false);
  };

  const openDeleteConfirmationDialouge = () => {
    setDeleteConfirmDialouge(true);
  };

  const handlePressConfirmDelete = async () => {
    try {
      const result = await threadQueries.deleteThreadsByIds(selected);

      if (result) {
        handleClearSelection();
        closeDeleteConfirmationDialouge();
      }
    } catch (err) {
      closeDeleteConfirmationDialouge();
      // console.log(err, 'handleDelete');
    }
  };

  const getItemLayout = useCallback((_data, index) => {
    const dataItems = _data ?? [];
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * dataItems.length,
      index,
    };
  }, []);

  useEffect(() => {
    if (category && category.length) {
      const arg = [...category.map(v => v.category)];
      categorizeThreads([...arg]);
    } else {
      if (threads && threads.length) {
        setThreadsToDisplay(threads);
      } else {
        setThreadsToDisplay([]);
      }
    }
  }, [threads, category]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust as needed
    >
      <StatusBar
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
        translucent={true}
      />
      <Wrapper backgroundColor={theme.colors.white} style={{marginBottom: 50}}>
        {/* <ConfirmationDialouge
        visible={deleteConfirmDialouge}
        title="Delete this conversation?"
        description="This is permanent and can’t be undone"
        onCancelPressed={handlePressCancel}
        onConfirmPressed={handlePressConfirmDelete}
        cancelText="Cancel"
        confirmText="Delete"
      />
      <ThreadActionHeader
        selected={selected}
        onPressClear={handleClearSelection}
        onPressDelete={handleDelete}
        onPressArchive={handleArchive}
        onPressPin={handlePin}
      />
      <HeaderBar
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onSearch={handleSearch}
      />
      <CategoryList
        searchOpen={searchOpen}
        category={category}
        setCategory={setCategory}
      /> */}

        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingTop: 20,
          }}>
          <Text style={styles.messagingText}>Messaging</Text>

          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor:
                  themeColorCombinations?.[mytheme]?.inputBackground,
              },
            ]}>
            <Image source={searchIcon} style={{height: 22, width: 22}} />
            <TextInput
              ref={inputRef}
              placeholder="Search numbers, names & more"
              placeholderTextColor={'#7F7F7F'}
              style={{paddingLeft: 12, color: '#333'}}
              // onChangeText={onChangeTextSearchInput}
            />
          </View>

          <View style={styles.container}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={CallsFilterData}
              itemTextStyle={styles.selectedTextStyle}
              itemContainerStyle={{backgroundColor: 'white', height: 48}}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>
        </View>

        <MT MT={theme.spacings.verticalScale.s16} />
        <View style={CommonStyles.flex1}>
          {smsSyncDone === false ||
          threadsGenerationDone === false ||
          threadsToDisplay?.length === 0 ? (
            <View>
              <ActivityIndicator />
              <Text style={{color: theme.colors.white, textAlign: 'center'}}>
                {'Loading your chats!!!'}
              </Text>
            </View>
          ) : (
            <FlashList
              getItemLayout={getItemLayout}
              extraData={selected}
              estimatedItemSize={ITEM_HEIGHT}
              data={threadsToDisplay}
              renderItem={renderItem}
              ListEmptyComponent={renderEmptyCallsList}
              ListFooterComponent={() => {
                // <MT MT={normalize(60)} />;
                <View
                  style={{marginBottom: 200, backgroundColor: 'red'}}></View>;
              }}
            />
          )}
        </View>
        {searchOpen ? null : (
          <>
            <NewChatFAB />
          </>
        )}
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

export default SMS;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 12,
  },
  dropdown: {
    height: 26,
    borderRadius: 100,
    paddingHorizontal: 5,
    paddingLeft: 8,
    width: 100,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#5D3AB7',
  },
  selectedTextStyle: {
    fontSize: 10,
    color: '#5D3AB7',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  messagingText: {
    fontSize: 26,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: '#080808',
    paddingBottom: 16,
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 22,
    height: 40,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
