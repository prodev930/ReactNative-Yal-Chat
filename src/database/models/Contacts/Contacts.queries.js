import {realm} from 'database';
import {tableNames} from 'database/tableNames';
import Contacts from './Contacts.model';
const realmInstance = realm();
const queryHandler = realmInstance.objects(tableNames.Contacts);
import ContactManager from 'react-native-contacts';

const addContact = async (contact, writeToNative) => {
  if (realmInstance) {
    if (writeToNative) {
      //by default there will be empty objects in contact document we will sanitize the final output below by removing any object with no value property
      let contactToAdd = {...contact};
      contactToAdd.phoneNumbers = contactToAdd.phoneNumbers.filter(
        v => v.number && v.number.length,
      );
      contactToAdd.emailAddresses = contactToAdd.emailAddresses.filter(
        v => v.email && v.email.length,
      );
      contactToAdd.postalAddresses = contactToAdd.postalAddresses.filter(
        v => v.formattedAddress && v.formattedAddress.length,
      );
      contactToAdd.imAddresses = contactToAdd.imAddresses.filter(
        v => v.username && v.username.length,
      );
      //remove tags as its not supported natively
      delete contactToAdd.tags;
      try {
        // add to native db
        const addedContact = await ContactManager.addContact(contactToAdd);
        // add to realm db
        await realmInstance.write(() => {
          realmInstance.create(
            tableNames.Contacts,
            Contacts.generate({
              ...contactToAdd,
              tags: contact.tags,
              displayName: addedContact.displayName,
              recordID: addedContact.recordID, // add record id from native db to realm contact
            }),
          );
        });
        return true;
      } catch (error) {
        // console.log({error});
        throw error;
      }
    } else {
      try {
        await realmInstance.write(() => {
          realmInstance.create(
            tableNames.Contacts,
            Contacts.generate(contact),
            true,
          );
        });
      } catch (error) {
        // console.log({error, location: 'addContact'});
      }
    }
  }
};

const editContact = async c => {
  if (realmInstance) {
    let contact = JSON.parse(JSON.stringify(c));
    try {
      //by default there will be empty objects in contact document we will sanitize the final output below by removing any object with no value property
      let contactToAdd = {...contact};
      contactToAdd.phoneNumbers = contactToAdd.phoneNumbers.filter(
        v => v.number && v.number.length,
      );
      contactToAdd.emailAddresses = contactToAdd.emailAddresses.filter(
        v => v.email && v.email.length,
      );
      contactToAdd.postalAddresses = contactToAdd.postalAddresses.filter(
        v => v.formattedAddress && v.formattedAddress.length,
      );

      contactToAdd.postalAddresses = contactToAdd.postalAddresses.map(v => {
        let temp = {...v};
        delete temp.formattedAddress;
        return temp;
      });

      contactToAdd.imAddresses = contactToAdd.imAddresses.filter(
        v => v.username && v.username.length,
      );
      //remove tags as its not supported natively
      delete contactToAdd.tags;
      delete contactToAdd.displayName;

      console.log({contactToAdd});

      const writtenToNative = await ContactManager.updateContact({
        ...contactToAdd,
        rawContactId: contactToAdd.recordID,
      });

      temp = Contacts.generate({
        ...contact,
        displayName: `${contact.givenName} ${contact.middleName} ${contact.familyName}`,
      });

      const doc = queryHandler.filtered(
        `recordID == $0`,
        contactToAdd.recordID,
      );
      const result = await realmInstance.write(() => {
        doc.forEach(doc => {
          for (const key in doc) {
            if (key === '_id' || key === 'recordID') {
              continue;
            } else {
              doc[key] = temp[key];
            }
          }
        });
      });

      return true;
    } catch (error) {
      // console.log({error, location: 'editContact'});
      return false;
    }
  }
};

const deleteContact = async recordID => {
  try {
    //delete from native DB
    const deleted = await ContactManager.deleteContact({recordID});
    const doc = queryHandler.filtered(`recordID == $0`, recordID);
    const smsDeleteResult = await realmInstance.write(() => {
      doc.forEach(doc => {
        realmInstance.delete(doc);
      });
    });
    return true;
  } catch (error) {
    // console.log({error, location: 'deleteContact'});
    return false;
  }
};

const searchContacts = async key => {
  if (realmInstance) {
    try {
      const result = await queryHandler.filtered(
        `searchKey CONTAINS[c] $0`,
        key.trim(),
      );

      return result;
    } catch (error) {
      // console.log({error, location: 'searchContacts'});
    }
  }
};

const getNameByNumber = async n => {
  if (realmInstance) {
    try {
      const result = await queryHandler.filtered(
        `phoneNumbers.number == $0`,
        n.trim(),
      );

      return result;
    } catch (error) {
      // console.log({error, location: 'searchContacts'});
    }
  }
};

const allContacts = async () => {
  if (realmInstance)
    try {
      const result = await queryHandler.sorted('givenName', false);
      return result;
    } catch (error) {
      // console.log({error, location: 'allContacts'});
    }
};

const toggleStarred = async recordID => {
  if (realmInstance)
    try {
      const doc = queryHandler.filtered(`recordID == $0`, recordID);
      const result = await realmInstance.write(() => {
        doc.forEach(doc => {
          doc.isStarred = !doc.isStarred;
        });
      });
      // native op
      return true;
    } catch (error) {
      // console.log({error, location: 'toggleStarred'});
      return false;
    }
};

const toggleBlock = async recordID => {
  if (realmInstance)
    try {
      const doc = queryHandler.filtered(`recordID == $0`, recordID);
      const result = await realmInstance.write(() => {
        doc.forEach(doc => {
          doc.isBlocked = !doc.isBlocked;
        });
      });
      // native op
      return true;
    } catch (error) {
      // console.log({error, location: 'toggleStarred'});
      return false;
    }
};

export const ContactQueries = {
  addContact,
  searchContacts,
  allContacts,
  editContact,
  toggleStarred,
  toggleBlock,
  deleteContact,
  getNameByNumber,
};
