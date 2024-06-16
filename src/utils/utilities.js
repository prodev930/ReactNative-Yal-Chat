export const nullChecker = v => (v ? v : '-');

export const splitNumber = value => {
  //return same value in case of promotional header found
  if (/[A-Za-z]+/.test(value)) {
    return {
      phoneNumber: value,
      countryCode: '',
    };
  }

  const country_codes = [
    '+1',
    '+1242',
    '+1246',
    '+1264',
    '+1268',
    '+1284',
    '+1340',
    '+1441',
    '+1473',
    '+1649',
    '+1664',
    '+1670',
    '+1671',
    '+1684',
    '+1758',
    '+1767',
    '+1784',
    '+1849',
    '+1868',
    '+1869',
    '+1876',
    '+1939',
    '+20',
    '+211',
    '+212',
    '+213',
    '+216',
    '+218',
    '+220',
    '+221',
    '+222',
    '+223',
    '+224',
    '+225',
    '+226',
    '+227',
    '+228',
    '+229',
    '+230',
    '+231',
    '+232',
    '+233',
    '+234',
    '+235',
    '+236',
    '+237',
    '+238',
    '+239',
    '+240',
    '+241',
    '+242',
    '+243',
    '+244',
    '+245',
    '+246',
    '+248',
    '+249',
    '+250',
    '+251',
    '+252',
    '+253',
    '+254',
    '+255',
    '+256',
    '+257',
    '+258',
    '+260',
    '+261',
    '+262',
    '+262',
    '+262',
    '+263',
    '+264',
    '+265',
    '+266',
    '+267',
    '+268',
    '+269',
    '+27',
    '+290',
    '+291',
    '+297',
    '+298',
    '+299',
    '+30',
    '+31',
    '+32',
    '+33',
    '+34',
    '+345',
    '+350',
    '+351',
    '+352',
    '+353',
    '+354',
    '+355',
    '+356',
    '+357',
    '+358',
    '+358',
    '+359',
    '+36',
    '+370',
    '+371',
    '+372',
    '+373',
    '+374',
    '+375',
    '+376',
    '+377',
    '+378',
    '+379',
    '+380',
    '+381',
    '+382',
    '+383',
    '+385',
    '+386',
    '+387',
    '+389',
    '+39',
    '+40',
    '+41',
    '+420',
    '+421',
    '+423',
    '+43',
    '+44',
    '+44',
    '+44',
    '+44',
    '+45',
    '+46',
    '+47',
    '+47',
    '+47',
    '+48',
    '+49',
    '+500',
    '+500',
    '+501',
    '+502',
    '+503',
    '+504',
    '+505',
    '+506',
    '+507',
    '+508',
    '+509',
    '+51',
    '+52',
    '+53',
    '+54',
    '+55',
    '+56',
    '+57',
    '+58',
    '+590',
    '+590',
    '+590',
    '+591',
    '+592',
    '+593',
    '+594',
    '+595',
    '+596',
    '+597',
    '+598',
    '+599',
    '+60',
    '+61',
    '+61',
    '+61',
    '+62',
    '+63',
    '+64',
    '+64',
    '+65',
    '+66',
    '+670',
    '+672',
    '+672',
    '+672',
    '+673',
    '+674',
    '+675',
    '+676',
    '+677',
    '+678',
    '+679',
    '+680',
    '+681',
    '+682',
    '+683',
    '+685',
    '+686',
    '+687',
    '+688',
    '+689',
    '+690',
    '+691',
    '+692',
    '+7',
    '+7',
    '+81',
    '+82',
    '+84',
    '+850',
    '+852',
    '+853',
    '+855',
    '+856',
    '+86',
    '+880',
    '+886',
    '+90',
    '+91',
    '+92',
    '+93',
    '+94',
    '+95',
    '+960',
    '+961',
    '+962',
    '+963',
    '+964',
    '+965',
    '+966',
    '+967',
    '+968',
    '+970',
    '+971',
    '+972',
    '+973',
    '+974',
    '+975',
    '+976',
    '+977',
    '+98',
    '+992',
    '+993',
    '+994',
    '+995',
    '+996',
    '+998',
  ];
  let phoneNumber = value.replace(/[^0-9+]/g, '').trim();
  let countryCode = '';
  for (let i = 0; i < country_codes.length; i++) {
    if (phoneNumber && phoneNumber.includes(country_codes[i])) {
      let code_size = country_codes[i].length;
      countryCode = phoneNumber.substring(0, code_size) || '';
      phoneNumber = phoneNumber.substring(code_size) || '';
      return {
        phoneNumber,
        countryCode,
      };
    }
  }
  if (phoneNumber.length > 10) {
    phoneNumber = phoneNumber.substring(
      phoneNumber.length - 10,
      phoneNumber.length,
    );
  }

  return {
    phoneNumber,
    countryCode,
  };
};

export const clipMessage = b => {
  return b.replace(/\n|\r/g, '').length > 20
    ? `${b.replace(/\n|\r/g, '').substring(0, 20)} ...`
    : b;
};

export const formatDataForSectionFlatlist = data => {
  const map = {};
  let finalData = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i] ? Object.assign({}, {...data[i]}) : null;

    if (item) {
      const initial = item?.givenName
        ? /\p{Extended_Pictographic}/u.test(item.givenName)
          ? [...item?.givenName][0]
          : item.givenName[0].toUpperCase()
        : '#';
      if (map[initial]) {
        map[initial].push(item);
      } else {
        map[initial] = [item];
      }
    }
  }
  Object.entries(map).forEach(([k, v]) => {
    finalData = [...finalData, k, ...v];
  });
  return finalData;
};

export const tokenizeString = key => {
  const tokens = [];
  const newKeys = key.split(' ');
  for (const key of newKeys) {
    for (let index = 0; index < key.length; index++) {
      tokens.push(key.substring(0, index + 1));
    }
  }
  return tokens.reverse();
};

export const formatName = s => (s.length > 17 ? `${s.slice(0, 17)}...` : s);
