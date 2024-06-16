import React from 'react';
import styled from 'styled-components/native';
import useTheme from 'hooks/useTheme';
import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {normalize} from 'utils/normalize';
import {MT} from 'styled/MT';
const ConfirmationDialogue = ({
  visible,
  title = '',
  description = '',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancelPressed = () => console.log('cancel pressed'),
  onConfirmPressed = () => console.log('confirm pressed'),
}) => {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onCancelPressed}>
        <Container>
          <View style={styles.box}>
            <AlertBox>
              <PadContainer>
                <Title>{title}</Title>
                <MT MT={theme.spacings.verticalScale.s16} />
                <Description>{description}</Description>
              </PadContainer>
              <BottomButtonContainer>
                <CancelButton onPress={onCancelPressed}>
                  <CancelButtonText>{cancelText}</CancelButtonText>
                </CancelButton>
                <ConfirmButton onPress={onConfirmPressed}>
                  <ConfirmButtonText>{confirmText}</ConfirmButtonText>
                </ConfirmButton>
              </BottomButtonContainer>
            </AlertBox>
          </View>
        </Container>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmationDialogue;

const styles = StyleSheet.create({
  box: {
    borderRadius: normalize(20),
    overflow: 'hidden',
  },
});

const Container = styled.View`
  background-color: #00000026;
  width: 100%;
  height: 100%;
  z-index: 99999999;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PadContainer = styled.View`
  padding: ${props => props.theme.spacings.verticalScale.s24}px
    ${props => props.theme.spacings.verticalScale.s24}px;
`;

const AlertBox = styled.View`
  width: 80%;
  background-color: ${props => props.theme.colors.ConfirmationDialougeBGColor};
  aspect-ratio: 16/9;
  position: relative;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.ConfirmationDialougeTitleColor};
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f18}px;
`;

const Description = styled.Text`
  color: ${props => props.theme.colors.ConfirmationDialougeDescriptionColor};
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f12}px;
`;

const BottomButtonContainer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  flex-direction: row;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px ${props => props.theme.spacings.verticalScale.s24}px
    ${props => props.theme.spacings.verticalScale.s12}px
    ${props => props.theme.spacings.verticalScale.s24}px;
`;

const CancelButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacings.verticalScale.s16}px 0px;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;
const ConfirmButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacings.verticalScale.s16}px 0px;
  display: flex;
  width: 30%;
  justify-content: center;
  align-items: flex-end;
`;

const ConfirmButtonText = styled.Text`
  color: ${props => props.theme.colors.ConfirmationDialougeConfirmButtonColor};
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f14}px;
`;
const CancelButtonText = styled.Text`
  color: ${props => props.theme.colors.ConfirmationDialougeCancelButtonColor};
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f12}px;
`;
