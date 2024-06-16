import {createSlice} from '@reduxjs/toolkit';

const initialState = {};
const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    openDialPad: prevState => {
      const state = {
        ...prevState,
        dialPad: true,
      };
      return state;
    },
    closeDialPad: prevState => {
      const state = {
        ...prevState,
        dialPad: false,
      };
      return state;
    },
  },
});

const utilsReducer = utilsSlice.reducer;

const {openDialPad, closeDialPad} = utilsSlice.actions;

export {openDialPad, closeDialPad, utilsReducer};
