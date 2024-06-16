import {createSlice} from '@reduxjs/toolkit';

const initialState = {};
const callStateSlice = createSlice({
  name: 'callState',
  initialState,
  reducers: {
    updateCallState: (prevState, action) => {
      const state = {
        ...prevState,
        callState: action.payload,
      };
      return state;
    },
  },
});

const callStateReducer = callStateSlice.reducer;

const {updateCallState} = callStateSlice.actions;

export {updateCallState, callStateReducer};
