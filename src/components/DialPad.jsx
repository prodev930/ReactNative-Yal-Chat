import React, {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {Animated, BackHandler, Image, Text, View, Easing} from 'react-native';
import {useDispatch, useSelector, useStore} from 'react-redux';
import styled from 'styled-components/native';
import {height} from 'utils/device';
import FA6 from 'react-native-vector-icons/FontAwesome6';
import OI from 'react-native-vector-icons/Octicons';
import MI from 'react-native-vector-icons/MaterialIcons';
import {normalize} from 'utils/normalize';
import {closeDialPad} from 'redux/utils';
import CallButton from './Buttons/CallButton';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import {dispatchSnackBar} from 'utils/snackbar';
import useTheme from 'hooks/useTheme';
import {addUserIcon, clearSymbolIcon} from 'assets/images';

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
const DialPad = ({phoneHandles, onDialPadValueChange, defaultValue}) => {
  const navigation = useNavigation();
  const isDialPadOpen = useSelector(state => state.utils.dialPad);
  const heightAnimation = useRef(new Animated.Value(0));
  const dialPadNumRef = useRef('');
  const deleteButtonRef = useRef(null);
  const dialPadDisplayerRef = useRef(null);
  const callButtonRef = useRef(null);
  const dispatch = useDispatch();
  const store = useStore();
  const longPressDeleteInterval = useRef(null);
  const previousDialPadState = useRef(undefined);

  const setDialPadNum = useCallback(
    value => {
      dialPadNumRef.current = value;
      dialPadDisplayerRef.current?.setText(value);
      callButtonRef.current?.setPhoneNumber(value);
      deleteButtonRef.current?.setDisabled(!value ? true : false);
      onDialPadValueChange && onDialPadValueChange(value);
    },
    [onDialPadValueChange],
  );

  const clearDialPad = useCallback(() => {
    dialPadNumRef.current = '';
    dialPadDisplayerRef.current?.setText('');
    callButtonRef.current?.setPhoneNumber('');
    deleteButtonRef.current?.setDisabled(true);
  }, []);
  useEffect(() => {
    defaultValue && dialPadDisplayerRef.current?.setText(defaultValue);
  }, [defaultValue]);


const expand = useCallback(() => {
  Animated.timing(heightAnimation.current, {
    toValue: 100,
    duration: 150, // Faster animation
    easing: Easing.inOut(Easing.ease), // Smoother easing function
    useNativeDriver: false, // useNativeDriver can't be used for height
  }).start(finished => {
    // Callback after animation finishes
  });
}, []);

const collapse = useCallback(() => {
  Animated.timing(heightAnimation.current, {
    toValue: 0,
    duration: 150, // Faster animation
    easing: Easing.inOut(Easing.ease), // Smoother easing function
    useNativeDriver: false, // useNativeDriver can't be used for height
  }).start(({ finished }) => {
    if (finished) {
      clearDialPad(); // Clear dial pad after animation
    }
  });
}, [clearDialPad]);


  const deleteChar = useCallback(() => {
    const _dialPadNum = dialPadNumRef.current;
    setDialPadNum(
      _dialPadNum.substring(0, Math.max(_dialPadNum.length - 1, 0)),
    );
  }, [setDialPadNum]);

  const onLongPressDelete = useCallback(() => {
    longPressDeleteInterval.current = setInterval(() => {
      deleteChar();
    }, 100);
  }, [deleteChar]);

  const onLongPressDeleteEnd = useCallback(() => {
    longPressDeleteInterval.current &&
      clearInterval(longPressDeleteInterval.current);
  }, []);

  const handleAddContact = useCallback(() => {
    const _dialPadNum = dialPadNumRef.current;

    if (_dialPadNum && _dialPadNum.length) {
      navigation.navigate(screens.APP.CONTACTS, {
        number: _dialPadNum,
      });
    } else {
      dispatchSnackBar({text: 'Nothing to add'});
    }
  }, [navigation]);

  useLayoutEffect(() => {
    if (isDialPadOpen) {
      expand();
    } else {
      /**
       * ensure not triggering collapse on initial render
       */
      previousDialPadState.current !== undefined && collapse();
    }
    previousDialPadState.current = isDialPadOpen;
  }, [collapse, isDialPadOpen, expand]);

  useEffect(() => {
    const backAction = () => {
      const _isDialPadOpen = store.getState()?.utils?.dialPad ?? false;
      if (_isDialPadOpen) {
        store.dispatch(closeDialPad());
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
  }, [store]);

  const onPressDialKey = useCallback(
    value => {
      if (!value) {
        return;
      }
      setDialPadNum(dialPadNumRef.current + value);
    },
    [setDialPadNum],
  );

  const onLongPresDialKey = useCallback(
    longPressValue => {
      if (!longPressValue) {
        return;
      }
      setDialPadNum(dialPadNumRef.current + longPressValue);
    },
    [setDialPadNum],
  );

  return (
    <DialPadContainer
      style={[
        {
          height: heightAnimation.current.interpolate({
            inputRange: [0, 100],
            outputRange: [0, height / 2],
          }),
          elevation: 20,
          shadowColor: '#000',
        },
      ]}>
      <DialPadTopRow>
        <NewContactButton onPress={handleAddContact}>
          <Image source={addUserIcon} style={{height: 20, width: 20}} />
        </NewContactButton>
        <DialPadNumberDisplay>
          <DialPadNumberDisplayer ref={dialPadDisplayerRef} />
        </DialPadNumberDisplay>
        <DeleteButtonControlled
          onPress={deleteChar}
          onLongPress={onLongPressDelete}
          onPressOut={onLongPressDeleteEnd}
          ref={deleteButtonRef}
        />
      </DialPadTopRow>
      <DialPadMidRow>
        {dialPadGrid.map((row, i) => {
          return (
            <NumRow key={`keypad_row_${i}`}>
              {row.map(({display, value, longPressValue, longPressDisplay}) => {
                return (
                  <NumbBlockHandler
                    key={`keypad_key_${value}`}
                    onPress={onPressDialKey}
                    onLongPress={onLongPresDialKey}
                    value={value}
                    longPresValue={longPressValue}
                    displayValue={display}
                    displayLongPressValue={longPressDisplay}
                  />
                );
              })}
            </NumRow>
          );
        })}
      </DialPadMidRow>
      <DialPadBottomRow>
        <DialPadBottomRowContainer>
          <CallButtonContainer>
            <CallButton ref={callButtonRef} handles={phoneHandles} />
          </CallButtonContainer>
          <CloseButtonContainer
            onPress={() => {
              dispatch(closeDialPad());
            }}>
            <MI name="dialpad" size={normalize(25)} color="#3A3A3A" />
          </CloseButtonContainer>
        </DialPadBottomRowContainer>
      </DialPadBottomRow>
    </DialPadContainer>
  );
};

const NumbBlockHandler = memo(
  ({
    onPress,
    onLongPress,
    value,
    longPresValue,
    displayValue,
    displayLongPressValue,
  }) => {
    const onPressDialKey = useCallback(() => {
      onPress(value);
    }, [onPress, value]);

    const onLongPressDialKey = useCallback(() => {
      onLongPress(longPresValue);
    }, [longPresValue, onLongPress]);

    return (
      <NumBlock
        key={`keypad_key_${value}`}
        onPress={onPressDialKey}
        onLongPress={onLongPressDialKey}>
        <NumBlockDisplayText>{displayValue}</NumBlockDisplayText>
        {longPresValue ? (
          <LongPressBox>
            <Text>{displayLongPressValue}</Text>
          </LongPressBox>
        ) : null}
      </NumBlock>
    );
  },
);

const DialPadNumberDisplayer = React.forwardRef((props, ref) => {
  const [number, setNumber] = useState('');

  useImperativeHandle(
    ref,
    () => ({
      setText: value => {
        setNumber(value);
      },
    }),
    [],
  );
  return <DialPadNumberDisplayText>{number}</DialPadNumberDisplayText>;
});

const DeleteButtonControlled = React.forwardRef((props, ref) => {
  const [disabled, setDisabled] = useState(true);
  const theme = useTheme();
  useImperativeHandle(
    ref,
    () => ({
      setDisabled: value => {
        setDisabled(value);
      },
    }),
    [],
  );

  return (
    <DeleteButton disabled={disabled} {...props}>
      <Image
        source={clearSymbolIcon}
        style={{
          height: 20,
          width: 20,
          tintColor: disabled ? theme.colors.disabled : undefined,
        }}
      />
    </DeleteButton>
  );
});

export default memo(DialPad);

const radius = 30;
const topHeight = 20;
const midHeight = 100 - topHeight * 2;

const LongPressBox = styled.View`
  position: absolute;
  bottom: 0;
`;

const DialPadContainer = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  bottom: 50;
  overflow: hidden;
  width: 100%;
  background-color: #fff;
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
  color: #5d3ab7;
`;

const DeleteButton = styled.Pressable`
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
const NumBlock = styled.Pressable`
  width: 33%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const NumBlockDisplayText = styled.Text`
  font-size: ${props => props.theme.fontSize.f32}px;
  font-weight: ${props => props.theme.fontWeight.w500};
  color: #000;
`;

const DialPadBottomRowContainer = styled.View`
  width: 80%;
  height: 100%;
  flex-direction: row;
`;

const CallButtonContainer = styled.View`
  flex: 3;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const CloseButtonContainer = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
