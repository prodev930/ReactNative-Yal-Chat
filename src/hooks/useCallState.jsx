import {CALL_STATE_MAP} from 'constants/callStateMap';
import {getStateN} from 'nativeModules';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {updateCallState} from 'redux/callState';

export const useCallState = () => {
  const dispatch = useDispatch();
  let prefState = useRef(undefined);

  useEffect(() => {
    const interval = setInterval(async () => {
      const state = await getStateN();

      /**
       * compare state to prevent unnecessary dispatch
       * leads to infinite re-render
       */
      if (prefState.current === state) {
        return;
      }

      /**
       * update prefState to current state
       */
      prefState.current = state;

      if (state) {
        dispatch(updateCallState(CALL_STATE_MAP[state]));
      } else {
        dispatch(updateCallState(undefined));
      }
    }, 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch]);
  return null;
};
