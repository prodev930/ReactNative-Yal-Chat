export function normalizePhoneNumber(
  phone: string = '',
  countryCode: string = '+91',
) {
  // Remove any non-digit characters from the phone number
  let normalizedPhone = phone.replace(/[^+]\D/g, '');

  // Check if the phone number starts with a country code
  if (normalizedPhone.startsWith('+')) {
    // Extract the country code and the number
    const _countryCode = normalizedPhone.slice(0, 3);
    const number = normalizedPhone.slice(3);

    // Return the normalized phone number with the country code separated
    normalizedPhone = `${_countryCode}-${number}`;
    /**
     *  if the phone number starts with a 0
     * for some countries will auto replace countries code with 0
     * for local calls
     */
  } else if (normalizedPhone.startsWith('0')) {
    normalizedPhone = normalizedPhone.replace(/^0/, countryCode + '-');
  } else {
    normalizedPhone = countryCode + '-' + normalizedPhone;
  }
  // If the phone number doesn't start with a country code, return it as is
  return normalizedPhone;
}

/**
 * test suite
 */
// console.log('RESULT: ', normalizePhoneNumber('123-456-7890')); // 12457890
// console.log('RESULT: ', normalizePhoneNumber('+1234567890')); // +12-34567890
// console.log('RESULT: ', normalizePhoneNumber('1234567890')); // 1234567890
// console.log('RESULT: ', normalizePhoneNumber('123-456-7890')); // 12457890
// console.log('RESULT: ', normalizePhoneNumber('0123-456-7890')); // +91-12457890
