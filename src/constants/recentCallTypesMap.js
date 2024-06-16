export const RECENT_CALL_TYPES_MAP_ENUMS = {
  Incoming: 'Incoming',
  Outgoing: 'Outgoing',
  Missed: 'Missed',
  Rejected: 'Rejected',
  Blocked: 'Blocked',
  Voicemail: 'Voicemail',
  'Answered Externally': 'Answered Externally',
};

export const RECENT_CALL_TYPES_MAP = {
  1: RECENT_CALL_TYPES_MAP_ENUMS.Incoming,
  2: RECENT_CALL_TYPES_MAP_ENUMS.Outgoing,
  3: RECENT_CALL_TYPES_MAP_ENUMS.Missed,
  4: RECENT_CALL_TYPES_MAP_ENUMS.Voicemail,
  5: RECENT_CALL_TYPES_MAP_ENUMS.Rejected,
  6: RECENT_CALL_TYPES_MAP_ENUMS.Blocked,
  7: RECENT_CALL_TYPES_MAP_ENUMS['Answered Externally'],
};
