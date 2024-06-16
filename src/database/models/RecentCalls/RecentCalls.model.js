import {Realm} from '@realm/react';
import {tableNames} from 'database/tableNames';
import {nullChecker, splitNumber} from 'utils/utilities';

export default class extends Realm.Object {
  static schema = {
    name: tableNames.RecentCalls,
    properties: {
      _id: 'objectId',
      recordID: {type: 'string'},
      number: {type: 'string', indexed: 'full-text'},
      displayName: {type: 'string', indexed: 'full-text'},
      date: {type: 'int'},
      type: {type: 'string', indexed: 'full-text'},
      duration: {type: 'string'},
      channel: {type: 'string', indexed: 'full-text'},
    },
    primaryKey: 'recordID',
  };
  static generate(log) {
    return {
      _id: new Realm.BSON.ObjectId(),
      recordID: log._id,
      number: log.number,
      displayName: log.displayName || log.number,
      date: parseInt(log.date),
      type: log.type,
      duration: log.duration,
      channel: log.channel,
    };
  }
}
