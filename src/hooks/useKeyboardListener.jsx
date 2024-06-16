import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {height} from 'utils/device';

const useKeyboardListener = () => {
  const [keyBoardVisible, setkeyBoardVisible] = useState(false);
  const [keyBoardHeightPercentage, setKeyBoardHeightPercentage] = useState(0);
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyBoardHeight(e.endCoordinates.height);
      setKeyBoardHeightPercentage((e.endCoordinates.height * 100) / height);
      setkeyBoardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setkeyBoardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return {keyBoardVisible, keyBoardHeight, keyBoardHeightPercentage};
};

export default useKeyboardListener;
