import {realm} from 'database';
import {tableNames} from 'database/tableNames';
import RecentCalls from './RecentCalls.model';
const realmInstance = realm();
const queryHandler = realmInstance.objects(tableNames.RecentCalls);

export function mapQueryDataToPlainObject(recent) {
  return {
    _id: recent._id,
    recordID: recent.recordID,
    number: recent.number,
    displayName: recent.displayName,
    date: recent.date,
    type: recent.type,
    duration: recent.duration,
    channel: recent.channel,
  };
}

const addCallLog = async log => {
  if (realmInstance) {
    try {
      await realmInstance.write(() => {
        realmInstance.create(
          tableNames.RecentCalls,
          RecentCalls.generate(log),
          true,
        );
      });
    } catch (error) {
      console.log({error, location: 'addCallLog'});
    }
  }
};

const getLastRecentCall = async () => {
  if (realmInstance) {
    try {
      const result = await queryHandler.sorted('date', true)[0];
      return result;
    } catch (error) {
      // console.log({error, location: 'getLastSMS'});
    }
  }
};

const getAllRecentCalls = async () => {
  if (realmInstance) {
    try {
      const result = await queryHandler.sorted('date', true).map(item => {
        return mapQueryDataToPlainObject(item);
      });

      return result;
    } catch (error) {
      return [];
      // console.log({error, location: 'getLastSMS'});
    }
  }
};

const searchCallLog = async (key = '', phoneNumbers = []) => {
  if (realmInstance) {
    let q1 = '';
    try {
      if (phoneNumbers && phoneNumbers.length) {
        q1 = phoneNumbers
          .map((p, index) => `number CONTAINS[c] $${index + 2}`)
          .join(' OR ');
      }
      const params = [key, key, ...phoneNumbers];

      const query =
        'number CONTAINS[c] $0 OR displayName CONTAINS[c] $1' +
        (q1 ? ` OR ${q1}` : '') +
        ' LIMIT(20)';
      const result = await queryHandler
        .filtered(query, ...params)
        .sorted('date', true)
        .map(item => {
          return mapQueryDataToPlainObject(item);
        });

      return result;
    } catch (error) {
      return [];
      // console.log({error, location: 'searchCallLog'});
    }
  }
};

const searchCallLogByNumber = async (keyword = []) => {
  if (realmInstance) {
    try {
      const result = await queryHandler
        .filtered('number CONTAINS[c] $0 LIMIT(20)', keyword)
        .sorted('date', true)
        .map(item => {
          return mapQueryDataToPlainObject(item);
        });

      return result;
    } catch (error) {
      return [];
      // console.log({error, location: 'searchCallLogByNumber'});
    }
  }
};

export const RecentCallsQueries = {
  addCallLog,
  getLastRecentCall,
  searchCallLog,
  getAllRecentCalls,
  searchCallLogByNumber,
};
