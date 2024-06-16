export const CALL_AUDIO_STATE_MAP_ENUMS = {
  Speaker: 'Speaker',
  Earpiece: 'Earpiece',
  Bluetooth: 'Bluetooth',
  'Wired Headset': 'Wired Headset',
  'Wired or Earpiece': 'Wired or Earpiece',
};

export const CALL_AUDIO_STATE_MAP = {
  1: CALL_AUDIO_STATE_MAP_ENUMS.Earpiece,
  2: CALL_AUDIO_STATE_MAP_ENUMS.Bluetooth,
  4: CALL_AUDIO_STATE_MAP_ENUMS['Wired Headset'],
  5: CALL_AUDIO_STATE_MAP_ENUMS['Wired or Earpiece'],
  8: CALL_AUDIO_STATE_MAP_ENUMS.Speaker,
};
