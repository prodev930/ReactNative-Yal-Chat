import {Realm} from '@realm/react';
import {tableNames} from 'database/tableNames';
import {nullChecker, splitNumber} from 'utils/utilities';

export class PhoneNumberSchema extends Realm.Object {
  static schema = {
    name: 'PhoneNumber',
    properties: {
      label: {type: 'string', indexed: 'full-text', default: ''},
      number: {type: 'string', indexed: 'full-text', default: ''},
      countryCode: {type: 'string', indexed: 'full-text', default: ''},
    },
  };
}

export class EmailAddressSchema extends Realm.Object {
  static schema = {
    name: 'EmailAddress',
    properties: {
      label: {type: 'string', indexed: 'full-text', default: ''},
      email: {type: 'string', indexed: 'full-text', default: ''},
    },
  };
}

export class ImAddressSchema extends Realm.Object {
  static schema = {
    name: 'ImAddress',
    properties: {
      username: {type: 'string', indexed: 'full-text', default: ''},
      service: {type: 'string', indexed: 'full-text', default: ''},
    },
  };
}

export class PostalAddressSchema extends Realm.Object {
  static schema = {
    name: 'PostalAddress',
    properties: {
      label: {type: 'string', indexed: 'full-text', default: ''},
      formattedAddress: {type: 'string', indexed: 'full-text', default: ''},
      street: {type: 'string', indexed: 'full-text', default: ''},
      pobox: {type: 'string', indexed: 'full-text', default: ''},
      neighborhood: {type: 'string', indexed: 'full-text', default: ''},
      city: {type: 'string', indexed: 'full-text', default: ''},
      region: {type: 'string', indexed: 'full-text', default: ''},
      state: {type: 'string', indexed: 'full-text', default: ''},
      postCode: {type: 'string', indexed: 'full-text', default: ''},
      country: {type: 'string', indexed: 'full-text', default: ''},
    },
  };
}

export default class extends Realm.Object {
  static schema = {
    name: tableNames.Contacts,
    properties: {
      _id: 'objectId',
      recordID: {type: 'string'},
      prefix: {type: 'string', indexed: 'full-text', default: ''},
      givenName: {type: 'string', indexed: 'full-text', default: ''},
      middleName: {type: 'string', indexed: 'full-text', default: ''},
      familyName: {type: 'string', indexed: 'full-text', default: ''},
      displayName: {type: 'string', indexed: 'full-text', default: ''},
      suffix: {type: 'string', indexed: 'full-text', default: ''},
      jobTitle: {type: 'string', indexed: 'full-text', default: ''},
      company: {type: 'string', indexed: 'full-text', default: ''},
      department: {type: 'string', indexed: 'full-text', default: ''},
      phoneNumber: {type: 'string', indexed: 'full-text', default: ''},
      isStarred: {type: 'bool'},
      isBlocked: {type: 'bool'},
      hasThumbnail: {type: 'bool'},
      thumbnailPath: {type: 'string', default: ''},
      phoneNumbers: {type: 'list', objectType: 'PhoneNumber'},
      emailAddresses: {type: 'list', objectType: 'EmailAddress'},
      postalAddresses: {type: 'list', objectType: 'PostalAddress'},
      imAddresses: {type: 'list', objectType: 'ImAddress'},
      searchKey: {type: 'string', indexed: 'full-text'},
      tags: {type: 'set', objectType: 'string'},
    },
    primaryKey: 'recordID',
  };
  static generate(contact) {
    const defaultTemplate = {
      prefix: '',
      givenName: '',
      middleName: '',
      familyName: '',
      displayName: '',
      suffix: '',
      jobTitle: '',
      company: '',
      department: '',
      isStarred: false,
      isBlocked: false,
      hasThumbnail: false,
      thumbnailPath: '',
      phoneNumbers: [],
      emailAddresses: [],
      postalAddresses: [],
      imAddresses: [],
      tags: new Set(),
    };

    let {
      prefix,
      givenName,
      middleName,
      familyName,
      displayName,
      suffix,
      jobTitle,
      company,
      department,
      phoneNumbers = [],
      tags,
    } = contact;

    const phoneNumbersSplited = phoneNumbers.map(v => {
      const {phoneNumber, countryCode} = splitNumber(v.number) || {};
      return {
        label: v.label,
        number: phoneNumber,
        countryCode,
      };
    });
    const numString = phoneNumbersSplited.map(v => v.number).join('');
    const filtered = Object.entries({
      ...contact,
      phoneNumbers: phoneNumbersSplited,
    }).reduce((a, [k, v]) => {
      if (v) {
        a[k] = v;
      }
      return a;
    }, {});
    return {
      _id: new Realm.BSON.ObjectId(),
      ...defaultTemplate,
      ...filtered,
      phoneNumber: phoneNumbersSplited[0].number || '',
      tags: tags ? Array.from(tags) : [],
      searchKey:
        prefix +
        givenName +
        middleName +
        familyName +
        displayName +
        suffix +
        jobTitle +
        company +
        department +
        numString,
    };
  }
}
