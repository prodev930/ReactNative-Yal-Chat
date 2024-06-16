import {Realm} from '@realm/react';
import {tableNames} from 'database/tableNames';
import {getRegexList} from 'utils/categoryRulesSchema';
import {splitNumber} from 'utils/utilities';

export default class SMS extends Realm.Object {
  static schema = {
    name: tableNames.SMS,
    properties: {
      _id: 'objectId',
      id: {type: 'int'},
      phoneNumber: {type: 'string'},
      countryCode: {type: 'string'},
      body: {type: 'string', indexed: 'full-text'},
      date: {type: 'int'},
      channel: {type: 'string'},
      category: {type: 'set', objectType: 'string'},
      read: {type: 'int'},
      seen: {type: 'int'},
      thread_id: {type: 'int'},
      type: {type: 'string'},
      thread: {
        type: 'linkingObjects',
        objectType: tableNames.Threads,
        property: 'sms_list',
      },
    },
    primaryKey: 'id',
  };
  static generate(sms) {
    const {phoneNumber, countryCode} = splitNumber(sms.address);
    const catSet = new Set();
    let body = sms.body;
    const regexes = getRegexList();
    for (const _category in regexes) {
      var patterns = regexes[_category];
      for (const regexPattern of patterns) {
        if (regexPattern.test(body)) {
          catSet.add(_category);
          break;
        }
      }
    }
    const category = Array.from(catSet);
    return {
      _id: new Realm.BSON.ObjectId(),
      id: parseInt(sms.id),
      phoneNumber,
      countryCode,
      body: sms.body,
      category,
      date: parseInt(sms.date),
      read: parseInt(sms.read),
      seen: parseInt(sms.seen),
      channel: sms.channel,
      thread_id: parseInt(sms.thread_id),
      type: sms.type,
    };
  }
}
