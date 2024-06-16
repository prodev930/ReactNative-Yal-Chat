import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';

const FloatingMenu = ({visible, setVisible, children}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={() => {
        setVisible(false);
      }}>
      <TouchableOpacity
        style={{width: '100%', height: '100%'}}
        activeOpacity={1}
        onPress={() => {
          setVisible(false);
        }}>
        <TouchableWithoutFeedback>
          <Cover>{children}</Cover>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default FloatingMenu;

const Cover = styled.View`
  position: absolute;
  top: ${props => props.theme.spacings.verticalScale.s36 + normalize(40)}px;
  right: ${props =>
    `${props.theme.spacings.normalScale.s18 + normalize(20)}px`};
  z-index: 60;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${normalize(5)}px;
`;
