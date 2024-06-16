import {screens} from './screens';

// TODO fix constant theme usage
const type1 = t => ({
  color: t.colors.bg,
  contentStyle: t.contentStyle,
});
const type2 = t => ({
  color: t.colors.greyLightestBg,
  contentStyle: t.contentStyle,
});

const SMS = t => ({
  color: t.colors.chatBG,
  contentStyle: t.contentStyle,
});

const SMS_THREADS = t => ({
  color: t.colors.bubbleBGLeft,
  contentStyle: t.contentStyle,
});
const NEW_CONVERSATION = t => ({
  color: t.colors.NewConversationHeaderBG,
  contentStyle: t.contentStyle,
});

export const statusBarColor = t => ({
  [screens.AUTH.LOGIN]: type1(t),
  [screens.AUTH.SIGNUP]: type1(t),
  [screens.AUTH.VERIFICATION]: type1(t),
  [screens.AUTH.VERIFICATION_FAILED]: type1(t),
  [screens.AUTH.USER_EXISTS]: type1(t),
  [screens.APP.HOME]: type1(t),
  [screens.APP.SMS]: SMS(t),
  [screens.APP.CALLS]: SMS(t),
  [screens.APP.CONTACTS]: type1(t),
  [screens.APP.SMS_THREADS]: SMS_THREADS(t),
  [screens.APP.NEW_CONVERSATION]: NEW_CONVERSATION(t),
});
