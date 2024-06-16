import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Animated, TextInput, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import HeaderBarSmsMenu from './HeaderBarSmsMenu';
import {SMSQueries} from 'database/models/SMS/SMS.queries';
import {useToast} from 'react-native-toast-notifications';
import debounce from 'lodash.debounce';
import {CommonStyles} from 'styled/common.styles';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {themeColorCombinations} from 'constants/theme';
import {searchIcon} from 'assets/images';
import {Text} from 'react-native';
import {Image} from 'react-native';

const HeaderBar = ({searchOpen, setSearchOpen, onSearch}) => {
  const searchKeywordRef = useRef('');
  const toast = useToast();
  const theme = useTheme();
  const widthAnimation = useRef(new Animated.Value(0)).current;
  const [headerMenuVisible, setHeadermenuVisible] = useState(false);
  const inputRef = useRef(null);
  const expand = () => {
    setSearchOpen(true);
    inputRef.current.focus();
  };

  const collapse = () => {
    setSearchOpen(false);
    onSearch && onSearch('');
    inputRef.current.clear();
    inputRef.current.blur();
  };

  /**
   * search handler with debounce
   */
  const handleSearchEvent = useMemo(() => {
    return debounce(
      text => {
        onSearch && onSearch(text);
      },
      250,
      {maxWait: 350, leading: false, trailing: true},
    );
  }, [onSearch]);

  const onChangeTextSearchInput = useCallback(
    text => {
      if (text == '') {
        console.log("TEst is empty");
        setSearchOpen(true);
        handleSerchPress();
      } else searchKeywordRef.current = text;
      handleSearchEvent(text);
    },
    [handleSearchEvent],
  );

  const handleSerchPress = () => {
    console.log('🚀 ~ handleSerchPress ~ searchOpen:', searchOpen);
    if (searchOpen) {
      collapse();
    } else {
      expand();
    }
    // collapse()
  };

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

  const handlePressMarkAllAsRead = async () => {
    try {
      setHeadermenuVisible(false);
      const result = await SMSQueries.markAllAsRead();
      if (result) {
        toast.show('Marked all as read', {
          type: 'normal',
          placement: 'bottom',
          duration: 2000,
          offset: normalize(150),
          animationType: 'slide-in',
        });
      }
    } catch (err) {
      // console.log(err, 'handlePressMarkAllAsRead');
    }
  };

  return (
    // <View style={{height: 100, width: '100%'}}>
    //   <View style={{flexDirection: 'row'}}>
    //     <TextInput
    //       ref={inputRef}
    //       style={{backgroundColor: 'white', width: '80%', height: 40}}
    //       placeholder="Type to search..."
    //       onChangeText={onChangeTextSearchInput}
    //       // onFocus={handleSerchPress}
    //     />
    //     <MaterialCommunityIcons
    //       color={'black'}
    //       onPress={handleSerchPress}
    //       name="close"
    //       size={normalize(25)}
    //     />
    //   </View>

    //   <Container>
    //     {/* <TouchableOpacity onPress={handleSerchPress} style={{width: '80%'}}>
    //       <MaterialCommunityIcons
    //         color={theme.colors.HeaderIconColor}
    //         name="magnify"
    //         size={normalize(25)}
    //       />
    //     </TouchableOpacity> */}
    //     {/* <TouchableOpacity onPress={() => setHeadermenuVisible(true)}>
    //       <MaterialCommunityIcons
    //         color={theme.colors.HeaderIconColor}
    //         name="dots-vertical"
    //         size={normalize(25)}
    //       />
    //     </TouchableOpacity> */}
    //   </Container>
    // </View>
    <View
      style={{
        backgroundColor: themeColorCombinations?.['light']?.background,
        paddingHorizontal: 20,
        paddingTop: 20,
      }}>
      <View style={{paddingBottom: 16}}>
        <Text
          style={{
            color: themeColorCombinations?.light.textcolor,
            fontSize: 20,
            fontWeight: '500',
          }}>
          Messaging
        </Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#F5F5F5',
          borderRadius: 22,
          height: 40,
          backgroundColor: themeColorCombinations?.['light']?.inputBackground,
          paddingLeft: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image source={searchIcon} style={{height: 22, width: 22}} />
        {/* <TextInput
          placeholder="Search numbers, names & more"
          placeholderTextColor={'#7F7F7F'}
          style={{paddingLeft: 12, color: '#333'}}
          ref={inputRef}
          onChangeText={onChangeTextSearchInput}
          onFocus={handleSerchPress}
        /> */}
        <TextInput
          ref={inputRef}
          placeholder="Search numbers, names & more"
          placeholderTextColor={'#7F7F7F'}
          style={{paddingLeft: 12, color: '#333'}}
          onChangeText={onChangeTextSearchInput}
          onFocus={handleSerchPress}
          // onBlur={handleSerchPress}
        />
      </View>

      <View
        style={[
          styles.container,
          {backgroundColor: themeColorCombinations?.['light']?.background},
        ]}>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={CallsFilterData}
          itemTextStyle={styles.selectedTextStyle}
          itemContainerStyle={{
            backgroundColor: themeColorCombinations?.['light']?.background,
            height: 48,
          }}
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
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  container: {
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
});

const Cover = styled.View`
  padding: ${props =>
    `${props.theme.spacings.verticalScale.s36}px ${props.theme.spacings.normalScale.s18}px 0px ${props.theme.spacings.normalScale.s18}px`};
  height: 10%;
  margin-bottom: ${props => props.theme.spacings.verticalScale.s12}px;
`;

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => `0px ${props.theme.spacings.normalScale.s12 * 0.5}px`};
  height: ${normalize(40)}px;
  border-radius: 2000px;
`;

const SearchContainer = styled(Animated.View)`
  position: absolute;
  z-index: 20;
  top: ${props => props.theme.spacings.verticalScale.s36}px;
  left: ${props => props.theme.spacings.normalScale.s18}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* background-color: ${props => props.theme.colors.chatBG}; */
  background-color: #2f2f2f;
  padding: ${props =>
    props.visible ? `0px ${props.theme.spacings.normalScale.s12}px` : '0px'};
  height: ${normalize(40)}px;
  border-radius: 2000px;
`;
