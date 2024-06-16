import {realm} from 'database';
import {tableNames} from 'database/tableNames';
import OnboardedContacts from './OnboardedContacts.model';
const realmInstance = realm();
const queryHandler = realmInstance.objects(tableNames.OnboardedContacts);
const addOnboardedContact = async contact => {
  if (realmInstance)
    try {
      await realmInstance.write(() => {
        realmInstance.create(
          tableNames.OnboardedContacts,
          OnboardedContacts.generate(contact),
          true,
        );
      });
      // console.log('Onboarded Contact Saved');
    } catch (error) {
      // console.log({error, location: 'addOnboardedContact'});
    }
};

const searchOnboardedContactConatct = async key => {
  if (realmInstance)
    try {
      const result = await queryHandler.filtered(
        'phoneNumber CONTAINS[c] $0 || familyName CONTAINS[c] $0 || givenName CONTAINS[c] $0',
        key,
      );
      return result;
    } catch (error) {
      // console.log({error, location: 'searchOnboardedContactConatct'});
    }
};

export const OnboardedContactsQueries = {
  addOnboardedContact,
  searchOnboardedContactConatct,
};
