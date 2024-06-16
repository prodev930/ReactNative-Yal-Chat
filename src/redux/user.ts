import {createSlice} from '@reduxjs/toolkit';
const user = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTQ4ZDQ5NDQ5YjhkMDcxZjY2MGU1ZGUiLCJwaG9uZU51bWJlciI6IjcwMDcwNzA5ODEiLCJjb3VudHJ5Q29kZSI6Iis5MSIsIm5hbWUiOm51bGwsImVtYWlsIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTExLTA2VDExOjU3OjA4LjkzMloiLCJfX3YiOjAsImlhdCI6MTcwMTA2MjI1NSwiZXhwIjoxNzMyNTk4MjU1fQ.gP1TmTRKNhuVzpO4qalnhnPzdqLyAr7lchmHkI_6gTk',
  user: {
    _id: '6548d49449b8d071f660e5de',
    phoneNumber: '7007070981',
    countryCode: '+91',
    name: null,
    email: null,
    createdAt: '2023-11-06T11:57:08.932Z',
    __v: 0,
  },
};
const initialState = user;
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (prevState, action) => {
      const state = action.payload;
      return state;
    },
    resetUser: () => initialState,
  },
});

const userReducer = userSlice.reducer;

const {setUser, resetUser} = userSlice.actions;

export {setUser, resetUser, userReducer};
