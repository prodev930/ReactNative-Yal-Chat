import {Realm} from '@realm/react';
import {realm} from 'database';
import {tableNames} from 'database/tableNames';
import {dispatchSnackBar} from 'utils/snackbar';
import {splitNumber} from 'utils/utilities';
const realmInstance = realm();
const queryHandler = realmInstance.objects(tableNames.BlockList);

const initialize = async () => {
  if (realmInstance)
    realmInstance.write(() => {
      const newObj = realmInstance.create(tableNames.BlockList, {
        _id: Realm.BSON.ObjectID(),
        blockList: Array.from(new Set()), // Initialize yourSet as an empty set
      });
    });
};

const addToBlockList = async numbers => {
  if (realmInstance)
    try {
      if (queryHandler.length === 0) {
        await initialize();
      } else {
        const phoneNumbers = numbers.map(p => splitNumber(p));
        const set = new Set();
        for (const {phoneNumber, countryCode} of phoneNumbers) {
          realmInstance.write(() => {
            queryHandler[0]?.blockList.add(phoneNumber);
          });
        }
      }
    } catch (error) {
      // console.log({error, location: 'addToBlockList'});
    }
};

const removeFromBlockList = async numbers => {
  if (realmInstance)
    try {
      if (queryHandler.length === 0) {
        await initialize();
        dispatchSnackBar({
          text: 'This contact is not Blocked',
        });
      } else {
        const phoneNumbers = numbers.map(p => splitNumber(p));
        const set = new Set();
        for (const {phoneNumber, countryCode} of phoneNumbers) {
          realmInstance.write(() => {
            queryHandler[0]?.blockList.delete(phoneNumber);
          });
        }
      }
    } catch (error) {
      // console.log({error, location: 'removeFromBlockList'});
    }
};

const isBlocked = async number => {
  if (realmInstance)
    try {
      if (queryHandler.length === 0) {
        return false;
      } else {
        return queryHandler[0]?.blockList.has(number);
      }
    } catch (error) {
      // console.log({error, location: 'isBlocked'});
      return false;
    }
};

export const BlockListQueries = {
  addToBlockList,
  removeFromBlockList,
  isBlocked,
};
