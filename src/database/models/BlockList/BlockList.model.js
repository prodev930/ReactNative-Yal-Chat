import {Realm} from '@realm/react';
import {tableNames} from 'database/tableNames';
import {splitNumber} from 'utils/utilities';

export default class BlockList extends Realm.Object {
  static schema = {
    name: tableNames.BlockList,
    properties: {
      _id: 'objectId',
      blockList: {type: 'set', objectType: 'string'},
    },
  };
  // static generate(phone) {
  //   const phoneNumbers = phone.map(p => splitNumber(p));
  //   const set = new Set();
  //   for (const {phoneNumber, countryCod} of phoneNumbers) {
  //     set.add(phoneNumber);
  //   }
  //   const blockList = Array.from(set);
  //   return {
  //     _id: new Realm.BSON.ObjectId(),
  //     blockList,
  //   };
  // }
}
