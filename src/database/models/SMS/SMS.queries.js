import {realm} from 'database';
import {tableNames} from 'database/tableNames';
import SMS from './SMS.model';
import {threadQueries} from '../Threads/Threads.queries';
import {NativeSMSHandler} from 'nativeModules';
import {splitNumber, tokenizeString} from 'utils/utilities';
import {ContactQueries} from '../Contacts/Contacts.queries';
const realmInstance = realm();
const queryHandler = realmInstance.objects(tableNames.SMS);
const threadQueryHandler = realmInstance.objects(tableNames.Threads);
const addSMS = async sms => {
  if (realmInstance) {
    try {
      const added = await realmInstance.write(async () => {
        const result = await realmInstance.create(
          tableNames.SMS,
          SMS.generate(sms),
          true,
        );
        return result;
      });
      return added;
    } catch (error) {
      // console.log({error, location: 'addSMS'});
    }
  }
};

const searchSMS = async (key, phoneNumbers) => {
  if (realmInstance) {
    try {
      let q = '';
      let q1 = '';
      let q2 = '';
      //build query string to match phone numbers of sms
      if (phoneNumbers && phoneNumbers.length) {
        q1 = phoneNumbers
          .map(p => `phoneNumber CONTAINS[c] "${p}"`)
          .join(' || ');
      }
      //split query string in to tokens of incrementing char length so that it can perform partial matches
      const tokens = tokenizeString(key);
      // build query string to match previously generated tokens
      if (tokens && tokens.length) {
        q2 = tokens.map(p => `body CONTAINS[c] "${p}"`).join(' || ');
      }
      // concatnate both query string on basis of length phone number will always go first because that is on priority
      q = `${q1 && q1.length ? `${q1} || ` : ''} ${
        q2 && q2.length ? `${q2}` : ''
      }`;
      const result = await queryHandler.filtered(q);
      // now the results are in descending order by date field this happens because it iterates on collection insertion order and mark the results
      // order results in desired preferance criteria
      // contacts > body.matchedLength > body
      //this is taking time so the quries are slow TODO optimization for better performance
      //starts here
      const orderedResults = result
        .map(s => {
          for (let index = 0; index < tokens.length; index++) {
            if (s.body.includes(tokens[index])) {
              return {...s, matchLength: tokens[index].length};
            }
          }
        })
        .sort((a, b) => b.matchLength - a.matchLength)
        .reduce((group, sms) => {
          if (sms && sms.phoneNumber) {
            const {phoneNumber} = sms;
            group[phoneNumber] = group[phoneNumber] ?? [];
            group[phoneNumber].push(sms);
            return group;
          } else {
            return group;
          }
        }, {});
      const final = [];
      Object.keys(orderedResults).map(phoneNumber => {
        if (phoneNumbers.includes(phoneNumber)) {
          final.push(orderedResults[phoneNumber][0]);
          // not deleting the pushed result needs fix
        }
      });
      Object.values(orderedResults).map(v => {
        final.push(v[0]);
      });
      // ends here
      return final;
    } catch (error) {
      // console.log({error, location: 'searchSMS'});
    }
  }
};

function scoringOccurrences(str = '', value = '') {
  const wordsCount = str.split(/\s+/gi).length;
  const regExp = new RegExp(value, 'gi');
  const count = (str.match(regExp) || []).length;
  if (wordsCount === 0 || count === 0) {
    return 0;
  }

  return (count / wordsCount) * 100;
}

function scoringIndex(str = '', keyword = '') {
  if (str.length === 0 || keyword.length === 0) {
    return 0;
  }
  const index = str.indexOf(keyword);
  const length = str.length;
  const score = ((length - index) / length) * 100;
  return score;
}

const searchByContact = async (keyword = '') => {
  const contacts = await ContactQueries.searchContacts(keyword);
  // const phoneNumbers = contacts.map(v => v.phoneNumber);
  return contacts.map(contact => {
    const scoreO = scoringOccurrences(contact.searchKey, keyword);
    const scoreI = scoringIndex(contact.searchKey, keyword);
    /**
     * index is more important than occurrences in title
     */
    const score = (scoreO + scoreI * 2) / 3;
    const _phoneNumbers = (contact?.phoneNumbers ?? []).map(p => p.number);
    return {...contact, score, simplePhoneNumbers: _phoneNumbers};
  });
};

const scoringContactMap = (contacts = []) => {
  const mapPhoneNumbers = contacts.reduce((acc, contact) => {
    const score = contact?.score ?? 0;
    const phoneNumbers = contact?.simplePhoneNumbers ?? [];
    phoneNumbers.forEach(phoneNumber => {
      acc[phoneNumber] = (acc[phoneNumber] ?? 0) + score;
    });
    return acc;
  }, {});

  return mapPhoneNumbers;
};

/**
 * simple implement full text search with scoring index and occurrences for text
 */
const searchSMS2 = async (keyword = '') => {
  if (realmInstance) {
    try {
      const q1Result = await searchByContact(keyword);
      /**
       * extract all phone number in q1Result and score them
       */
      const contactOnlyPhoneNumberScoreMap = scoringContactMap(q1Result);
      const phoneNumberQuery = Object.keys(contactOnlyPhoneNumberScoreMap)
        .map(key => {
          const {phoneNumber} = splitNumber(key);
          return `phoneNumber CONTAINS[c] "${phoneNumber.replace(/^0/, '')}"`;
        })
        .join(' OR ');

      const q2Query =
        'body TEXT $0' +
        (phoneNumberQuery ? ` OR ${phoneNumberQuery}` : '') +
        ' OR phoneNumber CONTAINS[c] $1';
      const q2Result = await queryHandler.filtered(q2Query, keyword, keyword);

      /**
       * group by phone number
       */
      const groupByPhoneNumber = q2Result.reduce((group, sms) => {
        if (sms && sms.phoneNumber) {
          const {phoneNumber} = sms;
          /** scoring body */
          const scoreO = scoringOccurrences(sms.body, keyword);
          const scoreI = scoringIndex(sms.body, keyword);
          const score = (scoreO + scoreI) / 2;
          group[phoneNumber] = group[phoneNumber] ?? [];
          group[phoneNumber].push({...sms, score});
          return group;
        } else {
          return group;
        }
      }, {});

      const groupScoreMap = {};
      /**
       * calculate median score for each group
       */
      Object.keys(groupByPhoneNumber).map(phoneNumber => {
        const length = groupByPhoneNumber[phoneNumber]?.length ?? 0;
        const score = groupByPhoneNumber[phoneNumber].reduce(
          (acc, sms) => acc + sms.score,
          0,
        );
        const phoneNumberScoreO = scoringOccurrences(phoneNumber, keyword);
        const phoneNumberScoreI = scoringIndex(phoneNumber, keyword);
        const phoneNumberScore =
          (phoneNumberScoreO + phoneNumberScoreI * 2) / 3;
        groupScoreMap[phoneNumber] =
          score / length +
          (contactOnlyPhoneNumberScoreMap[phoneNumber] ?? 0) +
          phoneNumberScore;
      });

      /**
       * sort groupScoreMap by score in descending order
       */
      const sorted = Object.keys(groupScoreMap)
        .sort((a, b) => groupScoreMap[b] - groupScoreMap[a])
        .map(phoneNumber => groupByPhoneNumber[phoneNumber][0]);

      return sorted;
    } catch (error) {
      console.log({error, location: 'searchSMS'});
      return [];
    }
  }
};

const getAllSMS = async key => {
  if (realmInstance) {
    try {
      const result = await queryHandler;
      return result;
    } catch (error) {
      // console.log({error, location: 'getAllSMS'});
    }
  }
};

const getLastSMS = async () => {
  if (realmInstance) {
    try {
      const result = await queryHandler.sorted('id', true)[0];
      return result;
    } catch (error) {
      // console.log({error, location: 'getLastSMS'});
    }
  }
};

const getThreadsFromSMS = async () => {
  if (realmInstance) {
    try {
      const threads = queryHandler
        .sorted('date', true)
        .filtered('thread_id != null DISTINCT(thread_id)');
      return threads;
    } catch (error) {
      // console.log({error, location: 'getThreadsFromSMS'});
    }
  }
};

const getSmsFromThreadId = async thread_id => {
  if (realmInstance) {
    try {
      const sms = queryHandler
        .filtered('thread_id == $0', thread_id)
        .sorted('date');
      return sms;
    } catch (error) {
      // console.log({error, location: 'getSmsFromThreadId'});
    }
  }
};

const markThreadAsRead = async id => {
  if (realmInstance) {
    try {
      const sms_ids = [];
      const doc = queryHandler.filtered('thread_id == $0', id);
      const result = await realmInstance.write(() => {
        doc.forEach(doc => {
          sms_ids.push(doc.id);
          doc.read = 1;
          doc.seen = 1;
        });
      });
      //native op
      const nativeOP = await NativeSMSHandler.markSmsAsReadByIds(sms_ids);
      threadQueries.markThreadAsRead(id);
    } catch (error) {
      // console.log({error, location: 'markThreadAsRead'});
    }
  }
};

const markAllAsRead = async () => {
  const ids = [];

  if (realmInstance) {
    try {
      const doc = queryHandler.filtered('read == $0', 0);
      await realmInstance.write(() => {
        doc.forEach(doc => {
          ids.push(doc.id);
          doc.read = 1;
          doc.seen = 1;
        });
      });
      // native op
      const nativeOP = await NativeSMSHandler.markSmsAsReadByIds(ids);
      const threadResult = await threadQueries.markAllAsRead();
      return true;
    } catch (error) {
      console.error({error, location: 'markAllAsRead'});
    }
  }
};

const deleteSMSbyIds = async sms_ids => {
  if (realmInstance) {
    try {
      const qs = sms_ids.map(sms_id => `id = ${sms_id}`).join(' OR ');
      const docs = queryHandler.filtered(`(${qs})`);
      const threadIdsSet = new Set();
      const smsDeleteResult = await realmInstance.write(() => {
        docs.forEach(doc => {
          threadIdsSet.add(doc.thread_id);
          realmInstance.delete(doc);
        });
      });
      const threadIds = Array.from(threadIdsSet);
      const qst = threadIds
        .map(thread_id => `thread_id = ${thread_id}`)
        .join(' OR ');
      const threads = await threadQueryHandler.filtered(`(${qst})`);
      realmInstance.write(() => {
        for (const thread of threads) {
          const lastSMSForThread = queryHandler
            .sorted('date', true)
            .filtered('thread_id == $0', thread.thread_id)[0];
          if (lastSMSForThread && lastSMSForThread.date) {
            thread.date = lastSMSForThread.date;
            thread.last_sms_id = lastSMSForThread.id;
            thread.read = lastSMSForThread.read;
            thread.seen = lastSMSForThread.seen;
          } else {
            realmInstance.delete(thread);
          }
        }
      });
      //native op
      const nativeOP = await NativeSMSHandler.deleteSmsByIds(sms_ids);
      return true;
    } catch (error) {
      // console.log({error, location: 'deleteSMSbyIds'});
    }
  }
};

export const SMSQueries = {
  addSMS,
  searchSMS,
  searchSMS2,
  getThreadsFromSMS,
  getSmsFromThreadId,
  getLastSMS,
  getAllSMS,
  markThreadAsRead,
  deleteSMSbyIds,
  markAllAsRead,
};
