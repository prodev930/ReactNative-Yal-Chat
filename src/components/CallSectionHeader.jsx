import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import debounce from 'lodash/debounce';
import {searchIcon} from 'assets/images';
import {Dropdown} from 'react-native-element-dropdown';
import {themeColorCombinations} from 'constants/theme';
import MyAppThemeContext from 'context/MyAppTheme';

const CallSectionHeader = ({
  searchOpen,
  setSearchOpen,
  MenuComponent,
  onSearch,
}) => {
  const widthAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const searchKeywordRef = useRef('');
  const {theme: mytheme} = useContext(MyAppThemeContext);

  const expand = () => {
    setSearchOpen(true);
    Animated.timing(widthAnimation, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      inputRef.current.focus();
    });
  };

  const collapse = () => {
    Animated.timing(widthAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      setSearchOpen(false);
      onSearch && onSearch('');
      inputRef.current.clear();
      inputRef.current.blur();
    });
  };

  const handleSerchPress = () => {
    if (searchOpen) {
      collapse();
    } else {
      expand();
    }
  };

  const CallsFilterData = [
    {label: 'All Calls', value: 1},
    {label: 'Missed', value: 2},
    {label: 'Received', value: 3},
    {label: 'Outgoing', value: 4},
  ];

  const [value, setValue] = useState(1);
  const [isFocus, setIsFocus] = useState(false);

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
        handleSerchPress();
      } else searchKeywordRef.current = text;
      handleSearchEvent(text);
    },
    [handleSearchEvent],
  );

  return (
    <View
      style={{
        backgroundColor: themeColorCombinations?.[mytheme]?.background,
        paddingHorizontal: 20,
        paddingTop: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity>
          <MCI name="phone" size={25} color={'#5D3AB7'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(screens.APP.CONTACTS)}
          style={{paddingLeft: 20}}>
          <MCI name="contacts" size={25} color={'#5D3AB7'} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#F5F5F5',
          borderRadius: 22,
          height: 40,
          backgroundColor: themeColorCombinations?.[mytheme]?.inputBackground,
          paddingLeft: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image source={searchIcon} style={{height: 22, width: 22}} />
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
          {backgroundColor: themeColorCombinations?.[mytheme]?.background},
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
            backgroundColor: themeColorCombinations?.[mytheme]?.background,
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

export default memo(CallSectionHeader);

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
