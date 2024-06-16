import Realm from 'realm';
import {createRealmContext} from '@realm/react';
import Contacts, {
  EmailAddressSchema,
  ImAddressSchema,
  PhoneNumberSchema,
  PostalAddressSchema,
} from './models/Contacts/Contacts.model';
import SMS from './models/SMS/SMS.model';
import OnboardedContacts from './models/OnboardedContacts/OnboardedContacts.model';
import Threads from './models/Threads/Threads.model';
import BlockList from './models/BlockList/BlockList.model';
import RecentCalls from './models/RecentCalls/RecentCalls.model';

const config = {
  schema: [
    PhoneNumberSchema,
    EmailAddressSchema,
    PostalAddressSchema,
    ImAddressSchema,
    Contacts,
    OnboardedContacts,
    SMS,
    Threads,
    BlockList,
    RecentCalls,
  ],
  schemaVersion: 4,
};

let realmInstance = new Realm(config);

let realm = () => {
  if (realmInstance.isClosed) {
    realmInstance = new Realm(config);
  }
  return realmInstance;
};

const realmContext = createRealmContext(realm);

const {RealmProvider, useObject, useQuery, useRealm} = realmContext;

export const useRealmContext = () => realmContext;

export {RealmProvider, realm, useObject, useQuery, useRealm};
