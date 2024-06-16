import useTheme from 'hooks/useTheme';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import ENT from 'react-native-vector-icons/Entypo';
import {userIcon} from 'assets/images';
import usePhoneHandles from 'hooks/usePhoneHandles';
import {handleCall} from 'utils/call';
import {formatName, splitNumber} from 'utils/utilities';
import {useSelector} from 'react-redux';
import {selectContactByPhoneNumber} from 'redux/contacts-map';
import { useNavigation } from '@react-navigation/native';

const iconSize = normalize(30);

const ThreadHeader = ({phoneNumber}) => {
  const heightAnimation = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const {phoneHandles} = usePhoneHandles();
  const navigation = useNavigation();

  const contact = useSelector(state =>
    selectContactByPhoneNumber(state, phoneNumber),
  );

  const expand = () => {
    Animated.timing(heightAnimation, {
      toValue: 200,
      duration: 500,
      useNativeDriver: false,
    }).start(finished => {});
  };

  const collapse = () => {
    Animated.timing(heightAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start(finished => {});
  };

  useEffect(() => {
    expand();
    return () => collapse();
  }, []);

  return (
    <View>
      <Cover
        style={[
          {
            height: heightAnimation.interpolate({
              inputRange: [0, 200],
              outputRange: ['0%', '10%'],
            }),
          },
        ]}>
        <Container>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <MCI name="keyboard-backspace" size={25} color={'#5D3AB7'} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <AvatarImage
              source={
                contact && contact[0] && contact[0].hasThumbnail
                  ? {uri: contact[0].thumbnailPath}
                  : userIcon
              }
            />
            <View style={{alignItems:"center"}}>
              <TextStyled>
                {`${
                  contact && contact[0]
                    ? `${contact[0].givenName} ${contact[0].familyName}`
                    : phoneNumber
                }`}
              </TextStyled>
              <TextStyled>
                {`${contact && contact[0] ? phoneNumber : ''}`}
              </TextStyled>
            </View>
          </View>
          <View>

          </View>
          {/* <TouchableOpacity onPress={()=>{
            toggleModal?.()
          }}>
            <ENT name="dots-three-vertical" size={25} color={'#5D3AB7'} />
          </TouchableOpacity> */}
        </Container>
      </Cover>
      {/* {isModalVisible && (
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
      )} */}
    </View>
  );
};

export default ThreadHeader;

const height = 50;

const Cover = styled(Animated.View)`
  padding: ${props => `0px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props => props.theme.colors.white};
  marginTop:10px;
`;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const AvatarImage = styled.Image`
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  border-radius: 20000px;
  margin-right: ${props => props.theme.spacings.normalScale.s18}px;
`;

const TextStyled = styled.Text`
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f14}px;
  font-family: ${props => props.theme.fontFamily};
  color: #000000;
`;
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
