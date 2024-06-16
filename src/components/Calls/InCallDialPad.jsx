import React, {useEffect, useRef, useState} from 'react';
import {Animated, BackHandler, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {height} from 'utils/device';
import MI from 'react-native-vector-icons/MaterialIcons';
import OI from 'react-native-vector-icons/Octicons';
import FA6 from 'react-native-vector-icons/FontAwesome6';
import {normalize} from 'utils/normalize';
import {keypadN} from 'nativeModules';

const dialPadGrid = [
  [
    {display: '1', value: '1'},
    {display: '2', value: '2'},
    {display: '3', value: '3'},
  ],
  [
    {display: '4', value: '4'},
    {display: '5', value: '5'},
    {display: '6', value: '6'},
  ],
  [
    {display: '7', value: '7'},
    {display: '8', value: '8'},
    {display: '9', value: '9'},
  ],
  [
    {display: '*', value: '*', longPressValue: ',', longPressDisplay: ','},
    {display: '0', value: '0', longPressValue: '+', longPressDisplay: '+'},
    {display: '#', value: '#', longPressValue: ';', longPressDisplay: ';'},
  ],
];

const iconSize = 20;

const InCallDialPad = ({visible, setVisible}) => {
  const [dialPadNum, setDialPadNum] = useState('');
  const heightAnimation = useRef(new Animated.Value(0)).current;

  const expand = () => {
    Animated.timing(heightAnimation, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {});
  };

  const collapse = () => {
    Animated.timing(heightAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      setDialPadNum('');
    });
  };

  const handlePress = v => {
    keypadN(`${v}`);
    setDialPadNum(dialPadNum + v);
  };

  const deleteChar = () => {
    setDialPadNum(dialPadNum.substring(0, dialPadNum.length - 1));
  };

  useEffect(() => {
    if (visible) {
      expand();
    } else {
      collapse();
    }
  }, [visible]);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        setVisible(false);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [visible]);

  return (
    <DialPadContainer
      style={[
        {
          height: heightAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, height / 2],
          }),
        },
      ]}>
      <DialPadTopRow>
        <NewContactButton onPress={() => null}>
          {/* <OI name={'person-add'} size={iconSize} /> */}
        </NewContactButton>
        <DialPadNumberDisplay>
          <DialPadNumberDisplayText>{dialPadNum}</DialPadNumberDisplayText>
        </DialPadNumberDisplay>
        <DeleteButton onPress={deleteChar} disabled={!dialPadNum.length}>
          <FA6 name="delete-left" size={iconSize} />
        </DeleteButton>
      </DialPadTopRow>
      <DialPadMidRow>
        {dialPadGrid.map((row, i) => {
          return (
            <NumRow key={i}>
              {row.map(({display, value, longPressValue, longPressDisplay}) => {
                return (
                  <NumBlock
                    key={value}
                    onPress={() => handlePress(value)}
                    onLongPress={() =>
                      longPressValue ? handlePress(longPressValue) : null
                    }>
                    <NumBlockDisplayText>{display}</NumBlockDisplayText>
                    {longPressDisplay ? (
                      <View style={{position: 'absolute', bottom: 0}}>
                        <Text>{longPressDisplay}</Text>
                      </View>
                    ) : null}
                  </NumBlock>
                );
              })}
            </NumRow>
          );
        })}
      </DialPadMidRow>
      <DialPadBottomRow>
        <DialPadBottomRowContainer>
          <CallButtonContainer></CallButtonContainer>
          <CloseButtonContainer
            onPress={() => {
              setVisible(false);
            }}>
            <MI name="dialpad" size={normalize(20)} />
          </CloseButtonContainer>
        </DialPadBottomRowContainer>
      </DialPadBottomRow>
    </DialPadContainer>
  );
};

export default InCallDialPad;

const radius = 30;
const topHeight = 20;
const midHeight = 100 - topHeight * 2;

const DialPadContainer = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  background-color: ${props => props.theme.colors.DialPadBG};
  z-index: 100;
  border-radius: ${radius}px ${radius}px 0px 0px;
`;

const DialPadTopRow = styled.View`
  flex-direction: row;
  height: ${topHeight}%;
  width: 100%;
`;
const DialPadMidRow = styled.View`
  height: ${midHeight}%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const DialPadBottomRow = styled.View`
  height: ${topHeight}%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const NewContactButton = styled.TouchableOpacity`
  width: ${topHeight}%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const DialPadNumberDisplay = styled.View`
  width: ${midHeight}%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const DialPadNumberDisplayText = styled.Text`
  font-size: ${props => props.theme.fontSize.f24}px;
  font-weight: ${props => props.theme.fontWeight.w500};
`;

const DeleteButton = styled.TouchableOpacity`
  width: ${topHeight}%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const NumRow = styled.View`
  flex-direction: row;
  flex: 1;
  width: 80%;
`;
const NumBlock = styled.TouchableOpacity`
  width: 33%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const NumBlockDisplayText = styled.Text`
  font-size: ${props => props.theme.fontSize.f32}px;
  font-weight: ${props => props.theme.fontWeight.w500};
`;

const DialPadBottomRowContainer = styled.View`
  width: 80%;
  height: 100%;

  flex-direction: row;
`;

const CallButtonContainer = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const CloseButtonContainer = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
