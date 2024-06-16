import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from 'hooks/useTheme';
import {normalize, verticalScale} from 'utils/normalize';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import {height} from 'utils/device';
// import SearchBox from 'components/SearchBox';

import {nullChecker} from 'utils/utilities';
// import LoadingLottie from 'components/LoadingLottie';
import {BlurView} from '@react-native-community/blur';
import styled from 'styled-components/native';
import {MT} from 'styled/MT';
const DropDown = ({
  error,
  hideError,
  width,
  data,
  loading,
  noEdges,
  onUpdate,
  disabled,
  rounded,
  ...Children
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [serachKey, setSearchKey] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [searching, setSearching] = useState(false);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  useEffect(() => {
    if (data && data.length) {
      if (serachKey && serachKey.length) {
        setSearching(true);
        setListItems([
          ...data.filter(l =>
            l.label.toLowerCase().includes(serachKey.toLowerCase()),
          ),
        ]);
        setSearching(false);
      } else {
        setListItems([...data]);
        setSearching(false);
      }
    }
  }, [serachKey, data]);

  useEffect(() => {
    if (data && data.length) {
      setListItems([...data]);
    }
  }, [data]);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        useNativeDriver={true}>
        <BlurView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
          }}
          blurRadius={1}
          blurAmount={2}
        />
        <TouchableWithoutFeedback
          style={{
            height: height,
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onPress={() => {
            setModalVisible(false);
          }}>
          <View
            style={{
              height: height,
              width: '100%',
            }}>
            <TouchableWithoutFeedback>
              <MenuWrapper>
                <TopBar></TopBar>
                {/* {data && data.length ? (
                  <SearchBox
                    placeholder="Search"
                    value={serachKey}
                    onChangeText={setSearchKey}
                  />
                ) : null} */}
                <MenuComponent
                  onUpdate={onUpdate}
                  loading={loading}
                  searching={searching}
                  listItems={listItems}
                  setModalVisible={setModalVisible}
                />
              </MenuWrapper>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Container width={width}>
        <TextInputContainer
          error={error}
          rounded={rounded}
          onPress={e => (disabled ? null : setModalVisible(true))}>
          <TextInputBox
            editable={false}
            error={error}
            {...Children}></TextInputBox>
          <TouchableOpacity disabled={disabled}>
            <Icon
              name="keyboard-arrow-down"
              size={30}
              style={{
                color:
                  colorScheme === 'light'
                    ? theme.colors.black
                    : theme.colors.white,
              }}
              onPress={e => (disabled ? null : setModalVisible(true))}
            />
          </TouchableOpacity>
        </TextInputContainer>
      </Container>
    </>
  );
};

const MenuComponent = ({
  setModalVisible,
  listItems,
  loading,
  onUpdate,

  searching,
}) => {
  const theme = useTheme();
  return (
    <>
      {loading || searching ? (
        <>
          <MT MT={theme.spacings.verticalScale.s36} />
          {/* <LoadingLottie /> */}
        </>
      ) : listItems && listItems.length ? (
        <FlatList
          data={listItems}
          renderItem={({item}) => (
            <MenuItemComponent
              onUpdate={onUpdate}
              icon={item.icon}
              key={`${item.display}`}
              setModalVisible={setModalVisible}
              item={item}
            />
          )}
        />
      ) : (
        <ErrorTextPadded>No Data</ErrorTextPadded>
      )}
    </>
  );
};

const MenuItemComponent = ({item, setModalVisible, icon, onUpdate}) => {
  return (
    <MenuItem
      onPress={_ => {
        if (!item.disabled) {
          onUpdate(item.data);
          setModalVisible(false);
        }
      }}>
      {icon ? <IconImage source={{uri: icon}} /> : null}
      <MenuItemText>
        {item.label} {item.disabled ? ' - Not Available' : ''}
      </MenuItemText>
    </MenuItem>
  );
};

export default DropDown;

const Container = styled.View`
  width: ${props => (props.width ? props.width : 100)}%;
`;

const TopBar = styled.View`
  width: 20%;
  height: ${verticalScale(5)}px;
  background-color: ${props => props.theme.colors.dark};
  align-self: center;
  border-radius: 2.5px;
  margin: ${props => props.theme.spacings.verticalScale.s24}px;
`;

const MenuWrapper = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
  padding: ${props => props.theme.spacings.verticalScale.s24}px
    ${props => props.theme.spacings.normalScale.s24}px
    ${props => props.theme.spacings.verticalScale.s24}px
    ${props => props.theme.spacings.normalScale.s24}px;
  position: absolute;
  bottom: 0;
  background-color: ${props => props.theme.colors.white};
`;

const MenuItem = styled.TouchableOpacity`
  padding: ${props => props.theme.spacings.verticalScale.s24}px
    ${props => props.theme.spacings.normalScale.s24}px;
  border-bottom: 0.5px;
  border-bottom-color: ${props => props.theme.colors.bg};
  border-bottom-width: 1px;
  flex-direction: row;
  align-items: center;
`;

const MenuItemText = styled.Text`
  font-size: ${props => props.theme.fontSize.f18}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.black};
`;

const TextInputContainer = styled.TouchableOpacity`
  border-radius: ${props => (props.rounded ? '100' : '5')}px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.inputBg};
`;

const TextInputBox = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.error
    ? props.theme.colors.placeholderTextColor
    : props.theme.colors.placeholderTextColor,
}))`
  color: ${props =>
    props.error
      ? props.theme.colors.inputTextColor
      : props.theme.colors.inputTextColor};
  width: 50%;
  font-size: ${props => props.theme.fontSize.f16}px;
  padding: ${props => props.theme.spacings.verticalScale.s12}px
    ${props => props.theme.spacings.normalScale.s12}px;
`;

const IconImage = styled.Image`
  height: ${normalize(50)}px;
  width: ${normalize(50)}px;
  resize-mode: contain;
  margin-right: ${props => props.theme.spacings.normalScale.s16}px;
`;

const ErrorTextPadded = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  font-weight: ${props => props.theme.fontWeight.w800};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  padding: ${props => props.theme.spacings.verticalScale.s36}px
    ${props => props.theme.spacings.normalScale.s36}px;
`;
