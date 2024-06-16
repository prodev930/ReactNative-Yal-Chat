import {Realm} from '@realm/react';
import {tableNames} from 'database/tableNames';
import {splitNumber} from 'utils/utilities';

export default class OnboardedContacts extends Realm.Object {
  static schema = {
    name: tableNames.OnboardedContacts,
    properties: {
      _id: 'objectId',
      userId: {type: 'string', indexed: 'full-text'},
      familyName: {type: 'string', indexed: 'full-text'},
      givenName: {type: 'string', indexed: 'full-text'},
      phoneNumber: {type: 'string'},
      countryCode: {type: 'string'},
      label: 'string',
    },
    primaryKey: 'phoneNumber',
  };
  static generate(contact) {
    const {phoneNumber, countryCode} = splitNumber(contact.phoneNumber);
    return {
      _id: new Realm.BSON.ObjectId(),
      userId: contact.userId,
      familyName: contact.familyName,
      givenName: contact.givenName,
      label: contact.label,
      phoneNumber,
      countryCode,
    };
  }
}
