import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SYNC_STATUS} from 'services/sync.services.abstract';
import {RootState} from './store.types';

interface SyncStatusState {
  smsSyncStatus: SYNC_STATUS;
  contactSyncStatus: SYNC_STATUS;
  threadSyncStatus: SYNC_STATUS;
  recentCallsSyncStatus: SYNC_STATUS;
  isAllPermissionsGranted: boolean;
}

const initialState: SyncStatusState = {
  smsSyncStatus: 'idle',
  contactSyncStatus: 'idle',
  threadSyncStatus: 'idle',
  recentCallsSyncStatus: 'idle',
  isAllPermissionsGranted: false,
};

const syncStatusSlice = createSlice({
  name: 'syncStatus',
  initialState,
  reducers: {
    setSMSSyncStatus: (state, action: PayloadAction<SYNC_STATUS>) => {
      state.smsSyncStatus = action.payload;
    },
    setContactSyncStatus: (state, action: PayloadAction<SYNC_STATUS>) => {
      state.contactSyncStatus = action.payload;
    },
    setThreadSyncStatus: (state, action: PayloadAction<SYNC_STATUS>) => {
      state.threadSyncStatus = action.payload;
    },
    setRecentCallsSyncStatus: (state, action: PayloadAction<SYNC_STATUS>) => {
      state.recentCallsSyncStatus = action.payload;
    },
    setIsAllPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.isAllPermissionsGranted = action.payload;
    },
  },
});

export const selectSMSSyncStatus = (state: RootState) => {
  return state.syncStatus.smsSyncStatus;
};

export const selectContactSyncStatus = (state: RootState) => {
  return state.syncStatus.contactSyncStatus;
};

export const selectThreadSyncStatus = (state: RootState) => {
  return state.syncStatus.threadSyncStatus;
};

export const selectRecentCallsSyncStatus = (state: RootState) => {
  return state.syncStatus.recentCallsSyncStatus;
};

export const selectIsAllPermissionGranted = (state: RootState) => {
  return state.syncStatus.isAllPermissionsGranted;
};

export const {
  setSMSSyncStatus,
  setContactSyncStatus,
  setThreadSyncStatus,
  setRecentCallsSyncStatus,
  setIsAllPermissionGranted,
} = syncStatusSlice.actions;
export const syncStatusReducer = syncStatusSlice.reducer;
