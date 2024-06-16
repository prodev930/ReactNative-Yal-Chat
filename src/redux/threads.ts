import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Thread} from 'models/threads';

// Define the initial state interface
interface ThreadsState {
  threads: Thread[];
  threadsMap: Record<string, Thread>;
  viewId: string;
  conversationsViewId: Record<string, string>;
}

// Define the initial state
const initialState: ThreadsState = {
  threads: [],
  threadsMap: {},
  viewId: 'idle-000',
  conversationsViewId: {},
};

export const VIEW_ACTIONS = ['received', 'send', 'delete', 'read'];

// Create the slice
const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setThreads(state, action: PayloadAction<Thread[]>) {
      const checkMap: Record<string, boolean> = {};
      const threadMaps: Record<string, Thread> = {};
      const threadsList: Thread[] = [];
      const rawThreads = action.payload ?? [];
      rawThreads.forEach(thread => {
        const threadId = `${thread?.thread_id ?? ''}`.trim();
        if (threadId && !checkMap[threadId]) {
          checkMap[threadId] = true;
          threadMaps[threadId] = thread;
          threadsList.push(thread);
        }
      });
      state.threads = threadsList;
      state.threadsMap = threadMaps;
    },
    updateViewId(
      state,
      action: PayloadAction<{
        action: 'idle' | 'received' | 'send' | 'delete' | 'read';
        targets: string[];
      }>,
    ) {
      const viewId = `${action.payload.action}-${Date.now()}-${Math.random()}`;

      action.payload.targets.forEach(target => {
        if (!state.conversationsViewId) {
          state.conversationsViewId = {};
        }
        state.conversationsViewId[target] = viewId;
      });

      console.log('-----> UPDATE VIEW ID', viewId);
      state.viewId = viewId;
    },
  },
});

export const selectThreads = (state: {threads: ThreadsState}) =>
  state.threads.threads;

export const selectThreadsMap = (state: {threads: ThreadsState}) =>
  state.threads.threadsMap;

export const selectConversationsViewId = (state: {threads: ThreadsState}) =>
  state.threads.conversationsViewId;

export const selectViewId = (state: {threads: ThreadsState}) =>
  state.threads.viewId;

export const selectConversationsViewIdByTarget = createSelector(
  [selectConversationsViewId, (_, target: string) => target],
  (conversationsViewId, target) =>
    conversationsViewId && conversationsViewId[target],
);

export const selectThreadIdsOnly = createSelector(selectThreads, threads =>
  threads.map(thread => thread.thread_id),
);

export const selectThreadById = createSelector(
  [selectThreadsMap, (_, threadId: string) => threadId],
  (threadsMap, threadId) => threadsMap[threadId],
);

// Export the actions and reducer
export const {setThreads, updateViewId} = threadsSlice.actions;
const threadsReducer = threadsSlice.reducer;

export default threadsReducer;
