import {createSlice, createSelector} from '@reduxjs/toolkit';
import {Contact} from 'models/contacts';
import {mapContactsByPhoneNumber} from 'utils/contacts';
import {normalizePhoneNumber} from 'utils/phones';
import {RootState} from './store.types';

const initialState: {contacts: Record<string, Contact>} = {
  contacts: {},
};
/**
 * we need a redux slice for contact map here to store all contacts at key-value pair
 * Help on quick access to contact by phone number
 */

const contactsMapSlice = createSlice({
  name: 'contactsMap',
  initialState,
  reducers: {
    addContacts(state, action) {
      const {contacts} = state;
      const payloadContacts = action.payload?.contacts ?? [];
      const map = mapContactsByPhoneNumber(payloadContacts);
      const newContactsMap = {
        ...contacts,
        ...map,
      };
      state.contacts = newContactsMap;
    },
  },
});

export const {addContacts} = contactsMapSlice.actions;

export const selectContactsMap = (state: RootState) => {
  return state.contactsMap?.contacts ?? {};
};

export const selectContactByPhoneNumber = createSelector(
  [selectContactsMap, (_, phoneNumber) => phoneNumber],
  (contactsMap, phoneNumber) => {
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    return contactsMap[normalizedPhoneNumber];
  },
);

export const contactsMapReducer = contactsMapSlice.reducer;
