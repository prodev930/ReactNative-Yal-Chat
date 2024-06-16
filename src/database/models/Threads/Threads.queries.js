import {realm} from 'database';
import {tableNames} from 'database/tableNames';

import Threads from './Threads.model';
import {NativeSMSHandler} from 'nativeModules';
const realmInstance = realm();
const queryHandler = realmInstance.objects(tableNames.Threads);
const SMSqueryHandler = realmInstance.objects(tableNames.SMS);

const addThread = async thread => {
  if (realmInstance) {
    try {
      await realmInstance.write(() => {
        realmInstance.create(
          tableNames.Threads,
          Threads.generate(thread),
          true,
        );
      });
      // console.log('Thread Saved');
    } catch (error) {
      // console.log({error, location: 'addThread'});
    }
  }
};

const getAllThreads = async () => {
  if (realmInstance) {
    try {
      const result = await queryHandler.sorted('date', true);
      return result;
    } catch (error) {
      // console.log({error, location: 'getAllThreads'});
    }
  }
};

const threadSyncedTill = async () => {
  if (realmInstance) {
    try {
      const result = await queryHandler.sorted('last_sms_id', true)[0];
      return result;
    } catch (error) {
      // console.log({error, location: 'threadSyncedTill'});
    }
  }
};

const markThreadAsRead = async id => {
  if (realmInstance) {
    try {
      const doc = queryHandler.filtered('thread_id == $0', id);
      const result = await realmInstance.write(async () => {
        const result = await doc.forEach(async doc => {
          doc.read = 1;
          doc.seen = 1;
        });
        return result;
      });
      //native op
      // threads in android db doesn't have read and seen values
      // const nativeOP = await NativeSMSHandler.markThreadAsReadByIds([id]);
      return result;
    } catch (error) {
      // console.log({error, location: 'markThreadAsRead'});
    }
  }
};

const markAllAsRead = async () => {
  if (realmInstance) {
    const ids = [];
    try {
      const doc = queryHandler.filtered('read == $0', 0);
      const result = await realmInstance.write(async () => {
        const result = await doc.forEach(async doc => {
          ids.push(doc.thread_id);
          doc.read = 1;
          doc.seen = 1;
        });
        return result;
      });
      //native ops
      // threads in android db doesn't have read and seen values
      // const nativeOP = await NativeSMSHandler.markThreadAsReadByIds(ids);
      return result;
    } catch (error) {
      // console.log({error, location: 'markAllAsRead'});
    }
  }
};

const getThreadsByIds = async thread_ids => {
  if (realmInstance) {
    try {
      const qs = thread_ids
        .map(thread_id => `thread_id = ${thread_id}`)
        .join(' OR ');
      const result = await queryHandler.filtered(`(${qs})`);
      return result;
    } catch (error) {
      // console.log({error, location: 'getThreadsByIds'});
    }
  }
};

const deleteThreadsByIds = async thread_ids => {
  if (realmInstance) {
    try {
      // delete all threads
      const qs = thread_ids
        .map(thread_id => `thread_id = ${thread_id}`)
        .join(' OR ');
      const threads = queryHandler.filtered(`(${qs})`);
      const threadDeleteResult = await realmInstance.write(() => {
        for (const thread of threads) {
          realmInstance.delete(thread);
        }
      });
      const sms_ids = [];
      // delete all sms belongs to above threads
      const smses = SMSqueryHandler.filtered(`(${qs})`);
      const smsesDeleteResult = await realmInstance.write(() => {
        for (const sms of smses) {
          sms_ids.push(sms.id);
          realmInstance.delete(sms);
        }
      });
      //native ops
      const nativeOP = await NativeSMSHandler.deleteThreadsByIds(thread_ids);
      const nativeSMSOP = await NativeSMSHandler.deleteSmsByIds(sms_ids);
      return true;
    } catch (error) {
      // console.log({error, location: 'markThreadAsRead'});
    }
  }
};

const getThreadByPhoneNumber = async phoneNumber => {
  if (realmInstance) {
    try {
      const result = await queryHandler.filtered(
        'phoneNumber == $0',
        phoneNumber,
      );
      return result;
    } catch (error) {
      // console.log({error, location: 'getThreadsByIds'});
    }
  }
};

const toggleArchived = async ids => {
  if (realmInstance) {
    try {
      const q = ids
        .map(thread_id => `thread_id == "${thread_id}"`)
        .join(' || ');
      const doc = queryHandler.filtered(q);
      const result = await realmInstance.write(async () => {
        const result = await doc.forEach(async doc => {
          doc.archived = !doc.archived;
        });
        return result;
      });
      return result;
    } catch (error) {
      // console.log({error, location: 'markThreadAsRead'});
    }
  }
};

const togglePinned = async ids => {
  if (realmInstance) {
    try {
      const q = ids
        .map(thread_id => `thread_id == "${thread_id}"`)
        .join(' || ');

      const doc = queryHandler.filtered(q);
      const result = await realmInstance.write(async () => {
        const result = await doc.forEach(async doc => {
          doc.pinned = !doc.pinned;
        });
        return result;
      });
      return result;
    } catch (error) {
      // console.log({error, location: 'markThreadAsRead'});
    }
  }
};
export const threadQueries = {
  addThread,
  getAllThreads,
  threadSyncedTill,
  markThreadAsRead,
  getThreadsByIds,
  deleteThreadsByIds,
  markAllAsRead,
  getThreadByPhoneNumber,
  togglePinned,
  toggleArchived,
};
