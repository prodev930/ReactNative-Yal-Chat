import React, {useContext, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import FA from 'react-native-vector-icons/FontAwesome';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import {searchIcon} from 'assets/images';
import {themeColorCombinations} from 'constants/theme';
import MyAppThemeContext from 'context/MyAppTheme';
const ContactsHeader = ({
  searchOpen,
  setSearchOpen,
  handleFilterPress,
  handleMenuPress,
  searchKey,
  setSearchKey,
}) => {
  const theme = useTheme();
  const widthAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const navigation = useNavigation();
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

  const {theme: mytheme} = useContext(MyAppThemeContext);

  const collapse = () => {
    Animated.timing(widthAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      setSearchKey('');
      setSearchOpen(false);
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

  return (
    <View
      style={{
        backgroundColor: themeColorCombinations?.[mytheme]?.background,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={()=>{
           navigation.navigate(screens.APP.BOTTOM_TAB);
        }}>
          <MCI name="phone" size={25} color={'#5D3AB7'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(screens.APP.CONTACTS)}
          style={{paddingLeft: 20}}>
          <MCI name="contacts" size={25} color={'#5D3AB7'} />
        </TouchableOpacity>
      </View>
      <View style={[styles.inputContainer, { backgroundColor: themeColorCombinations?.[mytheme]?.inputBackground}]}>
        <Image source={searchIcon} style={{height: 22, width: 22}} />
        <TextInput
          ref={inputRef}
          placeholder="Search numbers, names & more"
          placeholderTextColor={'#7F7F7F'}
          style={{paddingLeft: 12, color: '#333'}}
          onChangeText={setSearchKey}
        />
      </View>
    </View>
  );
};

export default ContactsHeader;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 22,
    height: 40,

    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
    props.visible ? `0px ${props.theme.spacings.normalScale.s12}px` : `0px`};
  height: ${normalize(40)}px;
  border-radius: 2000px;
`;
