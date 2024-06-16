import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {getCallingNumberN} from 'nativeModules';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {splitNumber} from 'utils/utilities';

const useCallerInfo = () => {
  const [contact, setContact] = useState({});
  const [callingNumber, setCallingNumber] = useState(null);
  const callState = useSelector(state => state.callState);

  const handleFetchNumber = async () => {
    try {
      const callingNumber = await getCallingNumberN();
      setCallingNumber(callingNumber);
    } catch (e) {
      setCallingNumber(null);
      console.log({e});
    }
  };

  const handleFetchNumberFromRealm = async () => {
    try {
      if (callingNumber) {
        const contact = await ContactQueries.getNameByNumber(
          splitNumber(callingNumber).phoneNumber || '',
        );
        if (contact && contact.length) {
          setContact({...contact[0], phoneNumber: callingNumber});
        } else {
          setContact({
            hasThumbnail: false,
            displayName: callingNumber,
            phoneNumber: callingNumber,
          });
        }
      } else {
        setContact({
          hasThumbnail: false,
          displayName: 'Unknown',
          phoneNumber: 'Unknown',
        });
      }
    } catch (err) {
      console.log({err});
      setContact({
        hasThumbnail: false,
        displayName: 'Unknown',
        phoneNumber: 'Unknown',
      });
    }
  };

  useEffect(() => {
    handleFetchNumber();
  }, [callState]);

  useEffect(() => {
    handleFetchNumberFromRealm();
  }, [callingNumber]);

  return contact;
};

export default useCallerInfo;
