import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {acceptN, getCallingNumberN, rejectN} from 'nativeModules';
import {MT} from 'styled/MT';
import {useSelector} from 'react-redux';
import {CALL_STATE_MAP_ENUMS} from 'constants/callStateMap';
import useTheme from 'hooks/useTheme';
import styled from 'styled-components/native';
import {avatar} from 'assets/images';
import {width} from 'utils/device';
import {normalize, verticalScale} from 'utils/normalize';
import IconButton from 'components/Buttons/IconButton';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {splitNumber} from 'utils/utilities';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import useCallerInfo from 'hooks/useCallerInfo';

const RingingCallUI = () => {
  const callerInfo = useCallerInfo();
  const {callState} = useSelector(state => state.callState);
  const theme = useTheme();

  const handleAccept = () => acceptN();
  const handleReject = () => rejectN();
  const handleRejectWithSMS = () => {
    console.log('reject with sms - TODO');
    handleReject();
  };

  return (
    <Modal
      visible={callState === CALL_STATE_MAP_ENUMS.STATE_RINGING}
      animationType="slide">
      <Container>
        <CallerInfoSection>
          <MT MT={verticalScale(80)} />
          <HighlightedText>Incoming Call</HighlightedText>
          <MT MT={verticalScale(80)} />

          <ProfilePictureContainer>
            <ProfilePictureSquare>
              <ProfilePicture
                source={
                  callerInfo.hasThumbnail
                    ? {
                        uri: callerInfo.thumbnailPath,
                      }
                    : avatar
                }
              />
            </ProfilePictureSquare>
          </ProfilePictureContainer>
          <MT MT={verticalScale(15)} />
          <CallerName>{callerInfo?.displayName}</CallerName>
          <CallerNumberDetails>{callerInfo?.phoneNumber}</CallerNumberDetails>
        </CallerInfoSection>
        <CallActionButtonsSection>
          <CallActionButtonsContainer>
            <IconButton
              onPress={handleReject}
              opacity={1}
              iconName={'phone-hangup'}
              iconColor={theme.colors.callRejectButtonIconColor}
              iconSize={normalize(30)}
              bgColor={theme.colors.callRejectButtonBG}
              IconLibrary={MCI}
            />
            <IconButton
              onPress={handleAccept}
              opacity={1}
              iconName={'phone'}
              iconColor={theme.colors.callAcceptButtonIconColor}
              iconSize={normalize(30)}
              bgColor={theme.colors.callAcceptButtonBG}
              IconLibrary={MCI}
            />
            <IconButton
              opacity={1}
              onPress={handleRejectWithSMS}
              iconName={'message-processing-outline'}
              iconColor={theme.colors.callRejectWithSMSButtonIconColor}
              iconSize={normalize(30)}
              bgColor={theme.colors.callRejectWithSMSButtonBG}
              IconLibrary={MCI}
            />
          </CallActionButtonsContainer>
        </CallActionButtonsSection>
      </Container>
    </Modal>
  );
};

export default RingingCallUI;

const Container = styled.View`
  background-color: ${props => props.theme.colors.RingingCallBG};
  flex: 1;
`;

const CallerInfoSection = styled.View`
  background-color: 'transparent';
  flex: 3;
`;
const CallActionButtonsSection = styled.View`
  background-color: 'transparent';
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const CallActionButtonsContainer = styled.View`
  width: 70%;
  height: 50%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HighlightedText = styled.Text`
  text-align: center;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f12}px;
  color: ${props => props.theme.colors.IncomingCallTextHighlight};
`;

const CallerName = styled.Text`
  text-align: center;
  font-weight: ${props => props.theme.fontWeight.w600};
  font-size: ${props => props.theme.fontSize.f24}px;
  color: ${props => props.theme.colors.IncomingCallText};
`;

const CallerNumberDetails = styled.Text`
  text-align: center;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f12}px;
  color: ${props => props.theme.colors.IncomingCallText};
`;

const ProfilePictureContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.Image`
  width: ${width * 0.4}px;
  height: ${width * 0.4}px;
  border-radius: ${width * 0.4}px;
`;

const ProfilePictureSquare = styled.View`
  width: ${width * 0.4}px;
  height: ${width * 0.4}px;
`;
