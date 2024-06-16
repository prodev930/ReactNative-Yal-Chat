import {createSlice} from '@reduxjs/toolkit';

const initialState = {};
const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {
    updateAPIStatus: (prevState, action) => {
      const state = {
        ...prevState,
        [action.payload.url]: action.payload.loading,
      };
      return state;
    },
  },
});

const apiStatusReducer = apiStatusSlice.reducer;

const {updateAPIStatus} = apiStatusSlice.actions;

export {updateAPIStatus, apiStatusReducer};
