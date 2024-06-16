import {Contact} from 'models/contacts';
import {normalizePhoneNumber} from './phones';

export function mapContactsByPhoneNumber(contacts: Contact[] = []) {
  const map: Record<string, {thumbnailPath: string; displayName: string}> = {};
  contacts.forEach(contact => {
    const _phoneNumbers = contact?.phoneNumbers ?? [];
    _phoneNumbers.forEach(number => {
      const normalizedPhoneNumber = normalizePhoneNumber(number.number);
      const name = (
        (contact.givenName ?? '') +
        ' ' +
        (contact.familyName ?? '')
      ).trim();
      map[normalizedPhoneNumber] = {
        thumbnailPath: contact.thumbnailPath ?? '',
        displayName: name ?? '',
      };
    });
  });
  // assign to contacts map ref
  return map;
}
