import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface ActivityIndicatorControllerProps {
  defaultMessage?: string;
  defaultLoading?: boolean;
}

export interface ActivityIndicatorControllerRef {
  showLoading: (text?: string) => void;
  hideLoading: (text?: string) => void;
  setMessage: (text: string) => void;
  updateStatus: ({loading, text}: {loading: boolean; text?: string}) => void;
}

const ActivityIndicatorController = forwardRef<
  ActivityIndicatorControllerRef,
  ActivityIndicatorControllerProps
>((props, ref) => {
  const {defaultMessage = '', defaultLoading} = props;
  const [loadingState, setLoadingState] = useState(defaultLoading ?? false);
  const [message, setMessage] = useState(defaultMessage);

  useImperativeHandle(ref, () => ({
    showLoading(text: string = '') {
      setLoadingState(true);
      setMessage(text);
    },
    hideLoading(_text: string = '') {
      setLoadingState(false);
      setMessage(text => (text ? _text || text : _text));
    },
    setMessage(text: string) {
      setMessage(text);
    },
    updateStatus({loading, text}: {loading: boolean; text?: string}) {
      setLoadingState(loading);
      text !== undefined && setMessage(text);
    },
  }));

  if (!loadingState && !message) {
    return null;
  }

  return (
    <View>
      {loadingState && <ActivityIndicator />}
      {!!message && <Text style={styles.emptyText}>{message}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
  },
});

export default ActivityIndicatorController;
