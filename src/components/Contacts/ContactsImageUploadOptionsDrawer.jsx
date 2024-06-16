import useTheme from 'hooks/useTheme';
import React, {useState} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MI from 'react-native-vector-icons/MaterialIcons';
import {MT} from 'styled/MT';

const ContactsImageUploadOptionsDrawer = ({
  visible,
  closeContactsImageUploadOptionsDrawer,
  openCamera,
  openGallery,
}) => {
  const theme = useTheme();
  return (
    <Modal
      visible={visible}
      statusBarTranslucent={true}
      transparent={true}
      animationType="slide">
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, width: '100%', backgroundColor: 'transparent'}}
        onPress={closeContactsImageUploadOptionsDrawer}>
        <FilterContainer>
          <TitleText>Profile Picture</TitleText>
          <MT MT={theme.spacings.verticalScale.s16} />
          <OptionButtonContainer>
            <OptionButton onPress={openCamera}>
              <MI
                name="photo-camera"
                size={normalize(70)}
                color={theme.colors.white}
              />
              <OptionButtonText>Camera</OptionButtonText>
            </OptionButton>
            <OptionButton onPress={openGallery}>
              <MI
                name="insert-photo"
                size={normalize(70)}
                color={theme.colors.white}
              />
              <OptionButtonText>Gallery</OptionButtonText>
            </OptionButton>
          </OptionButtonContainer>
        </FilterContainer>
      </TouchableOpacity>
    </Modal>
  );
};

export default ContactsImageUploadOptionsDrawer;

const FilterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  /* height: 40%; */
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${normalize(30)}px ${normalize(30)}px 0px 0px;
  padding: ${normalize(30)}px ${normalize(60)}px;
  justify-content: space-evenly;
`;

const TitleText = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w400};
`;

const OptionButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OptionButton = styled.TouchableOpacity`
  padding: ${normalize(20)}px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: ${normalize(5)}px;
`;

const OptionButtonText = styled.Text`
  font-size: ${props => props.theme.fontSize.f14}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w400};
`;
