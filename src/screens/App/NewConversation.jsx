import {useNavigation} from '@react-navigation/native';
import ContactCardSMSView from 'components/ContactCardSMSView';
import NewConversationHeader from 'components/NewConversationHeader';
import AlphabetFlashList from 'components/alphabet-section-flash-list/AlphabetFlashList';
import {screens} from 'constants/screens';
import {useQuery} from 'database';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {tableNames} from 'database/tableNames';
import useTheme from 'hooks/useTheme';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {normalScale, normalize} from 'utils/normalize';
import {formatDataForSectionFlatlist} from 'utils/utilities';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  Animated,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'utils/device';
import {NativeSMSHandler} from 'nativeModules';

const NewConversation = ({}) => {
  const navigation = useNavigation();
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stickyHeaderIndices, setStickyHeaderIndices] = useState([]);
  const [selected, setSelected] = useState([]);
  const contacts = useQuery(
    tableNames.Contacts,
    collection => {
      return collection.sorted('givenName', false);
    },
    [],
  );

  const handleSearch = async s => {
    try {
      if (s && s.length) {
        setResults([]);
        setLoading(true);
        const res = await ContactQueries.searchContacts(s);
        if (res && res.length) {
          setResults([...formatDataForSectionFlatlist(res)]);
          setLoading(false);
        } else {
          setResults([]);
          setLoading(false);
        }
      } else {
        setResults([...formatDataForSectionFlatlist(contacts)]);
      }
    } catch (error) {
      setLoading(false);
      // console.log({error});
    }
  };

  useEffect(() => {
    handleSearch(searchKey);
  }, [searchKey]);

  const renderListItem = item => {
    return (
      <ContactCardSMSView
        item={item}
        selected={selected}
        setSelected={setSelected}
        navigation={navigation}
      />
    );
  };
  const renderSectionHeader = section => {
    return (
      <SectionHeaderContainer>
        <SectionHeaderText>{section}</SectionHeaderText>
      </SectionHeaderContainer>
    );
  };

  useEffect(() => {
    const indicesMap = {};
    results.forEach((r, i) => {
      if (typeof r === 'string') {
        indicesMap[r] = i;
      }
    });
    setStickyHeaderIndices({...indicesMap});
  }, [results]);

  return (
    <Cover>
      <NewConversationHeader
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        selected={selected}
        setSelected={setSelected}
      />
      <AlphabetFlashList
        minIndex={0}
        maxIndex={
          Object.keys(stickyHeaderIndices).length
            ? Object.keys(stickyHeaderIndices).length - 1
            : 0
        }
        data={results}
        searchKey={searchKey}
        renderListItem={renderListItem}
        extraData={[stickyHeaderIndices, selected]}
        renderSectionHeader={renderSectionHeader}
        stickyHeaderIndices={stickyHeaderIndices}
      />
      {selected.length ? <SendFAB selected={selected} /> : null}
    </Cover>
  );
};

export default NewConversation;

const Cover = styled.View`
  background-color: ${props => props.theme.colors.NewConversationMainBG};
  flex: 1;
`;

const SectionHeaderContainer = styled.View`
  padding: ${props =>
    `${props.theme.spacings.verticalScale.s12}px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props => props.theme.colors.NewConversationMainBG};
`;
const SectionHeaderText = styled.Text`
  font-size: ${props => props.theme.fontSize.f18}px;
`;

const SendFAB = ({selected}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const inputRef = useRef();
  const widthAnimation = useRef(new Animated.Value(0)).current;
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const expand = () => {
    Animated.timing(widthAnimation, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      setExpanded(true);
      inputRef.current.focus();
    });
  };

  const collapse = () => {
    Animated.timing(widthAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      setExpanded(false);
      inputRef.current.clear();
      inputRef.current.blur();
    });
  };

  const handleAnimation = () => {
    if (expanded) {
      collapse();
    } else {
      expand();
    }
  };

  const onPressSend = useCallback(async () => {
    try {
      setSending(true);
      const promises = [];
      selected.forEach(c =>
        promises.push(NativeSMSHandler.sendSms(c.phoneNumber, message)),
      );
      const results = await Promise.all(promises);
      setSending(false);
      navigation.goBack();
    } catch (error) {
      setSending(false);
      // console.log(error, 'smsThread/onPressSend');
    }
  }, [message, selected]);

  return (
    <Container
      style={[
        {
          width: widthAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: [
              normalize(40),
              width - theme.spacings.normalScale.s24 * 2,
            ],
          }),
        },
      ]}>
      <Animated.View
        style={[
          {
            width: widthAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '80%'],
            }),
          },
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TextInput
          ref={inputRef}
          style={{
            width: '90%',
            fontSize: theme.fontSize.f12,
          }}
          placeholder="Type to send"
          value={message}
          onChangeText={setMessage}
          placeholderTextColor={theme.colors.ChatInputPlaceHolderColor}
        />
        <TouchableOpacity onPress={handleAnimation}>
          <MCI
            style={{marginRight: normalScale(10)}}
            name="close-circle"
            size={normalize(15)}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
      {sending ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (expanded) {
              onPressSend();
            } else {
              handleAnimation();
            }
          }}>
          <MCI
            name="send"
            size={normalize(25)}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      )}
    </Container>
  );
};

const bottom = normalize(30);

const Container = styled(Animated.View)`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: ${normalize(5)}px;
  background-color: ${props => props.theme.colors.bubbleBGLeft};
  bottom: ${normalize(bottom)}px;
  height: ${normalize(40)}px;
  right: ${props => `${props.theme.spacings.normalScale.s24}px`};
`;
