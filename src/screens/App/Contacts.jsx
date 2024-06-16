import useTheme from 'hooks/useTheme';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, Text, View} from 'react-native';
import {normalize} from 'utils/normalize';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Wrapper} from 'styled';
import {tableNames} from 'database/tableNames';
import {useRealmContext} from 'database';
import LoadingActivity from 'components/LoadingActivity';
import MessageBox from 'components/MessageBox';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import ContactsHeader from 'components/Contacts/ContactsHeader';
import ContactCardContactListing from 'components/Contacts/ContactCardContactListing';
import styled from 'styled-components/native';
import MI from 'react-native-vector-icons/MaterialIcons';
import AlphabetFlashList from 'components/alphabet-section-flash-list/AlphabetFlashList';
import {formatDataForSectionFlatlist} from 'utils/utilities';
import ContactsFilterDrawer from 'components/Contacts/ContactsFilterDrawer';
import CreateNewContactDrawer from 'components/Contacts/CreateNewContactDrawer';
import ViewContactDrawer from 'components/Contacts/ViewContactDrawer';
import {ErrorBoundary} from 'react-error-boundary';
import usePhoneHandles from 'hooks/usePhoneHandles';
import {screens} from 'constants/screens';
import MyAppThemeContext from 'context/MyAppTheme';
import {themeColorCombinations} from 'constants/theme';

const ITEM_HEIGHT = normalize(50);

const Contacts = () => {
  const route = useRoute();
  const {number} = route.params || {};
  const theme = useTheme();
  const {useQuery} = useRealmContext();

  const contacts = useQuery(
    tableNames.Contacts,
    collection => {
      return collection.sorted('givenName', false);
    },
    [],
  );

  const {theme: mytheme} = useContext(MyAppThemeContext);

  const navigation = useNavigation();
  const [selected, setSelected] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [results, setResults] = useState(contacts ?? []);
  const [loading, setLoading] = useState(false);
  const [stickyHeaderIndices, setStickyHeaderIndices] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [addContactDrawerVisible, setAddContactDrawerVisible] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [viewModeContact, setViewModeContact] = useState(null);
  const [editModeContact, setEditModeContact] = useState(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [showIncludingTags, setShowIcludingTags] = useState([]);
  const {phoneHandles} = usePhoneHandles();

  const openViewContactDrawer = c => setViewModeContact(c);

  const closeViewContactDrawer = () => {
    setViewModeContact(null);
  };

  const handleFilter = (data, showBlocked, showStarred, showIncludingTags) => {
    let temp = [...data];
    if (showBlocked) {
      temp = temp.filter(t => t.isBlocked);
    }
    if (showStarred) {
      temp = temp.filter(t => t.isStarred);
    }
    if (showIncludingTags && showIncludingTags.length) {
      temp = temp.filter(t => {
        return !!t.tags.filter(tag => showIncludingTags.includes(tag)).length;
      });
    }
    return temp;
  };

  const renderListItem = item => {
    return item ? (
      <ContactCardContactListing
        item={item}
        openViewContactDrawer={openViewContactDrawer}
        selected={selected}
        setSelected={setSelected}
        navigation={navigation}
      />
    ) : null;
  };
  const renderSectionHeader = section => {
    return (
      <SectionHeaderContainer mytheme={mytheme}>
        <SectionHeaderText mytheme={mytheme}>{section}</SectionHeaderText>
      </SectionHeaderContainer>
    );
  };

  const handleSearch = useCallback(
    async (s, sb, ss, sit) => {
      try {
        if (s && s.length) {
          setResults([]);
          setLoading(true);
          const res = await ContactQueries.searchContacts(s);
          if (res && res.length) {
            setResults([
              ...formatDataForSectionFlatlist(handleFilter(res, sb, ss, sit)),
            ]);
            setLoading(false);
          } else {
            setResults([]);
            setLoading(false);
          }
        } else {
          setResults([
            ...formatDataForSectionFlatlist(
              handleFilter(contacts, sb, ss, sit),
            ),
          ]);
        }
      } catch (error) {
        setLoading(false);
        // console.log({error});
      }
    },
    [contacts],
  );

  const openFilterDrawer = () => setFilterDrawerVisible(true);
  const closeFilterDrawer = () => setFilterDrawerVisible(false);

  const openAddContactDrawer = () => setAddContactDrawerVisible(true);
  const closeAddContactDrawer = () => {
    setEditModeContact(null);
    setAddContactDrawerVisible(false);
  };

  const OpenEditContactDrawer = c => {
    setEditModeContact(c);
    setAddContactDrawerVisible(true);
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
    handleSearch(searchKey, showBlocked, showStarred, showIncludingTags);
  }, [contacts, searchKey, showBlocked, showStarred, showIncludingTags]);

  useEffect(() => {
    const indicesMap = {};
    results.forEach((r, i) => {
      if (typeof r === 'string') {
        indicesMap[r] = i;
      }
    });
    setStickyHeaderIndices({...indicesMap});
  }, [results]);

  useEffect(() => {
    if (number && number.length) {
      setAddContactDrawerVisible(true);
    }
  }, [number]);

  return (
    <ErrorBoundary fallback={<Text>Something went wrong</Text>}>
      <StatusBar
        backgroundColor={themeColorCombinations?.[mytheme]?.background}
      />
      <Wrapper backgroundColor={theme.colors.chatBG}>
      <ContactsHeader
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          handleFilterPress={openFilterDrawer}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />
                         
        <ContactsFilterDrawer
          showIncludingTags={showIncludingTags}
          setShowIcludingTags={setShowIcludingTags}
          showStarred={showStarred}
          setShowStarred={setShowStarred}
          showBlocked={showBlocked}
          setShowBlocked={setShowBlocked}
          visible={filterDrawerVisible}
          closeFilterDrawer={closeFilterDrawer}
        />

        {addContactDrawerVisible ? (
          <CreateNewContactDrawer
            number={number}
            visible={addContactDrawerVisible}
            closeAddContactDrawer={closeAddContactDrawer}
            editModeContact={editModeContact}
          />
        ) : null}

        {viewModeContact ? (
          <ViewContactDrawer
            phoneHandles={phoneHandles}
            OpenEditContactDrawer={OpenEditContactDrawer}
            contact={viewModeContact}
            closeViewContactDrawer={closeViewContactDrawer}
          />
        ) : null}

        {searchOpen ? null : (
          <>
            <CreateContactButton onPress={openAddContactDrawer}>
              <MI
                name={'person-add-alt-1'}
                color={theme.colors.white}
                size={normalize(25)}
              />
              <CreateContactButtonText>
                Create new Contact
              </CreateContactButtonText>
            </CreateContactButton>
          </>
        )}

        <View
          style={{
            flex: 1,
            backgroundColor: themeColorCombinations?.light?.background,
          }}>
          {!results || loading ? (
            <LoadingActivity />
          ) : !results.length ? (
            // <MessageBox message={'No data at the moment !!!'} />

            <Text
              style={{
                color: themeColorCombinations?.light?.textcolor,
                textAlign: 'center',
                paddingTop: 20,
              }}>
              No data at the moment !!!
            </Text>
          ) : (
            <AlphabetFlashList
              disableSendMessageButton={true}
              minIndex={0}
              maxIndex={
                Object.keys(stickyHeaderIndices).length
                  ? Object.keys(stickyHeaderIndices).length - 1
                  : 0
              }
              data={results}
              getItemLayout={getItemLayout}
              searchKey={searchKey}
              renderListItem={renderListItem}
              extraData={[stickyHeaderIndices, selected]}
              renderSectionHeader={renderSectionHeader}
              stickyHeaderIndices={stickyHeaderIndices}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
            />
          )}
        </View>
      </Wrapper>
    </ErrorBoundary>
  );
};

export default Contacts;

const CreateContactButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacings.verticalScale.s8 / 4}px;
  background-color: ${props => props.theme.colors.primary};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${normalize(10)}px;
`;

const CreateContactButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
`;

const SectionHeaderContainer = styled.View`
  padding: ${props =>
    `${props.theme.spacings.verticalScale.s12}px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props =>
    themeColorCombinations?.[props?.mytheme]?.background};
`;

const SectionHeaderText = styled.Text`
  font-size: ${props => props.theme.fontSize.f18}px;
  color: ${props => themeColorCombinations?.[props?.mytheme]?.textcolor};
`;
