import {Realm} from '@realm/react';
import {tableNames} from 'database/tableNames';
import {splitNumber} from 'utils/utilities';

export default class Threads extends Realm.Object {
  static schema = {
    name: tableNames.Threads,
    properties: {
      _id: 'objectId',
      thread_id: {type: 'int'},
      date: {type: 'int'},
      read: {type: 'int'},
      seen: {type: 'int'},
      phoneNumber: {type: 'string'},
      countryCode: {type: 'string'},
      last_sms_id: {type: 'int'},
      archived: {type: 'bool'},
      pinned: {type: 'bool'},
      sms_list: 'SMS[]',
    },
    primaryKey: 'thread_id',
  };
  static generate(thread) {
    const {phoneNumber, countryCode} = splitNumber(
      thread?.address || thread?.countryCode + thread?.phoneNumber,
    );
    return {
      _id: new Realm.BSON.ObjectId(),
      thread_id: parseInt(thread.thread_id),
      date: parseInt(thread.date),
      read: parseInt(thread.read),
      seen: parseInt(thread.seen),
      phoneNumber,
      countryCode,
      last_sms_id: parseInt(thread.id),
      archived: false,
      pinned: false,
    };
  }
}
