import {Modal} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import notifee, {EventType} from '@notifee/react-native';
import {MT} from 'styled/MT';
import {useSelector} from 'react-redux';
import {CALL_STATE_MAP_ENUMS} from 'constants/callStateMap';
import {
  getAllCallsN,
  getCallAudioRouteN,
  getDurationN,
  getSupportedAudioRoutesN,
  mergeN,
  rejectN,
  swapN,
  toggleHoldN,
  toggleMuteN,
  toggleSpeakerPhoneN,
} from 'nativeModules';
import useTheme from 'hooks/useTheme';
import dayjs from 'dayjs';
import durationDayJS from 'dayjs/plugin/duration';
import 'dayjs/locale/en';
import {width} from 'utils/device';
import {normalize, verticalScale} from 'utils/normalize';
import {avatar} from 'assets/images';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import IconButton from 'components/Buttons/IconButton';
import useCallerInfo from 'hooks/useCallerInfo';
import InCallDialPad from './InCallDialPad';

dayjs.extend(durationDayJS);

const ActiveCallUI = () => {
  const callerInfo = useCallerInfo();
  const {callState} = useSelector(state => state.callState);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [merged, setMerged] = useState(false);
  const [allCalls, setAllCalls] = useState([]);
  const theme = useTheme();
  const [dialPadVisible, setDialPadVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const toggleAudioDeviceRef = useRef('idle');

  const handleHold = () => toggleHoldN();
  const handleEnd = () => rejectN();
  const getSupportedAudioRoutes = async () => {
    try {
      const state = await getCallAudioRouteN();
      const supportedRoutes = await getSupportedAudioRoutesN();
      console.log({supportedRoutes, state});
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          setModalOpen(prev => !prev);
          break;
      }
    });
  }, []);

  const toggleMute = async () => {
    try {
      const _isMuted = await toggleMuteN();
      setIsMuted(_isMuted);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwap = async () => {
    try {
      await swapN();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMerge = async () => {
    try {
      const merged = await mergeN();
      setMerged(true);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSpeaker = async () => {
    try {
      if (toggleAudioDeviceRef.current === 'pending') {
        return;
      }

      toggleAudioDeviceRef.current = 'pending';
      const _isSpeakerOn = await toggleSpeakerPhoneN();
      console.log({_isSpeakerOn});
      setIsSpeakerOn(_isSpeakerOn);
    } catch (err) {
      console.log('toggleSpeaker', {err});
    } finally {
      toggleAudioDeviceRef.current = 'idle';
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const _duration = await getDurationN();
      if (_duration) {
        setDuration(parseInt(_duration));
      } else {
        setDuration(null);
      }
    }, 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const calls = await getAllCallsN();
        setAllCalls(calls);
      } catch (err) {
        console.log({err});
      }
    }, 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <Modal
      transparent={false}
      visible={
        (callState === CALL_STATE_MAP_ENUMS.ACTIVE ||
          callState === CALL_STATE_MAP_ENUMS.STATE_HOLDING ||
          callState === CALL_STATE_MAP_ENUMS.STATE_DIALING) &&
        modalOpen
      }
      onRequestClose={async () => {
        setModalOpen(false);
        const channelId = await notifee.createChannel({
          id: 'background_call',
          name: 'background_call',
        });

        await notifee.displayNotification({
          title: 'Ongoing Call',
          android: {
            channelId,
            ongoing: true,
          },
        });
        // Display a notification
      }}
      animationType="slide">
      <Container>
        <CallerInfoSection>
          <MT MT={verticalScale(40)} />
          <HighlightedText>Ongoing Call</HighlightedText>
          <MT MT={verticalScale(20)} />
          <CallerName>{callerInfo?.displayName}</CallerName>
          <MT MT={verticalScale(10)} />
          <CallerNumberDetails>{callerInfo?.phoneNumber}</CallerNumberDetails>
          <MT MT={verticalScale(10)} />
          <CallerNumberDetails>
            {callState === CALL_STATE_MAP_ENUMS.STATE_DIALING
              ? 'Dialing'
              : `${dayjs.duration(duration, 'seconds').format('HH:mm:ss')}`}
          </CallerNumberDetails>
          <MT MT={verticalScale(20)} />

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
        </CallerInfoSection>
        <CallActionButtonsSection>
          <CallActionButtonsContainer>
            {/* <IconButton
              onPress={getSupportedAudioRoutes}
              opacity={1}
              iconName={'phone-bluetooth'}
              iconSize={normalize(35)}
              iconColor={
                isSpeakerOn
                  ? theme.colors.callActionIconColorActive
                  : theme.colors.callActionIconColor
              }
              bgColor={
                isSpeakerOn
                  ? theme.colors.callActionIconBGActive
                  : theme.colors.callActionIconBG
              }
              IconLibrary={MCI}
            /> */}
            <IconButton
              onPress={toggleSpeaker}
              opacity={1}
              iconName={'volume-high'}
              iconSize={normalize(35)}
              iconColor={
                isSpeakerOn
                  ? theme.colors.callActionIconColorActive
                  : theme.colors.callActionIconColor
              }
              bgColor={
                isSpeakerOn
                  ? theme.colors.callActionIconBGActive
                  : theme.colors.callActionIconBG
              }
              IconLibrary={MCI}
            />
            <IconButton
              onPress={toggleMute}
              opacity={1}
              iconName={'microphone-off'}
              iconColor={
                isMuted
                  ? theme.colors.callActionIconColorActive
                  : theme.colors.callActionIconColor
              }
              bgColor={
                isMuted
                  ? theme.colors.callActionIconBGActive
                  : theme.colors.callActionIconBG
              }
              iconSize={normalize(35)}
              IconLibrary={MCI}
            />
            {callState === CALL_STATE_MAP_ENUMS.STATE_DIALING ? null : (
              <IconButton
                opacity={1}
                onPress={handleHold}
                iconName={'phone-paused'}
                iconColor={
                  callState === CALL_STATE_MAP_ENUMS.STATE_HOLDING
                    ? theme.colors.callActionIconColorActive
                    : theme.colors.callActionIconColor
                }
                bgColor={
                  callState === CALL_STATE_MAP_ENUMS.STATE_HOLDING
                    ? theme.colors.callActionIconBGActive
                    : theme.colors.callActionIconBG
                }
                iconSize={normalize(35)}
                IconLibrary={MCI}
              />
            )}
          </CallActionButtonsContainer>
          <MT MT={verticalScale(40)} />
          <CallActionButtonsContainer>
            {allCalls.length > 1 ? (
              <IconButton
                opacity={1}
                onPress={handleSwap}
                iconName={'swap-vertical-variant'}
                iconColor={theme.colors.callActionIconColor}
                iconSize={normalize(35)}
                bgColor={theme.colors.callActionIconBG}
                IconLibrary={MCI}
                name={'keypad'}
              />
            ) : null}
            <IconButton
              opacity={1}
              onPress={() => setDialPadVisible(!dialPadVisible)}
              iconName={'dialpad'}
              iconColor={theme.colors.callActionIconColor}
              iconSize={normalize(35)}
              bgColor={theme.colors.callActionIconBG}
              IconLibrary={MCI}
              name={'keypad'}
            />
            {allCalls.length > 1 ? (
              <IconButton
                opacity={1}
                onPress={handleMerge}
                iconName={'call-merge'}
                iconSize={normalize(35)}
                iconColor={
                  merged
                    ? theme.colors.callActionIconColorActive
                    : theme.colors.callActionIconColor
                }
                bgColor={
                  merged
                    ? theme.colors.callActionIconBGActive
                    : theme.colors.callActionIconBG
                }
                IconLibrary={MCI}
                name={'keypad'}
              />
            ) : null}
          </CallActionButtonsContainer>
          <MT MT={verticalScale(40)} />
          <CallActionButtonsContainer>
            <IconButton
              onPress={handleEnd}
              opacity={1}
              iconName={'phone-hangup'}
              iconColor={theme.colors.callRejectButtonIconColor}
              iconSize={normalize(30)}
              bgColor={theme.colors.callRejectButtonBG}
              IconLibrary={MCI}
            />
          </CallActionButtonsContainer>
        </CallActionButtonsSection>
        <InCallDialPad
          visible={dialPadVisible}
          setVisible={setDialPadVisible}
        />
      </Container>
    </Modal>
  );
};

export default ActiveCallUI;

const Container = styled.View`
  background-color: ${props => props.theme.colors.RingingCallBG};
  flex: 1;
`;

const CallerInfoSection = styled.View`
  background-color: 'transparent';
  flex: 1;
`;
const CallActionButtonsSection = styled.View`
  background-color: 'transparent';
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.callActionDrawerBG};
  border-radius: ${30}px ${30}px 0px 0px;
`;

const CallActionButtonsContainer = styled.View`
  width: 80%;
  flex-direction: row;
  justify-content: space-around;
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
  font-size: ${props => props.theme.fontSize.f20}px;
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
