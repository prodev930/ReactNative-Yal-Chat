import {realm, useRealm} from 'database';
import React from 'react';
import RealmPlugin from 'realm-flipper-plugin-device';

const RealmDebugger = () => {
  const realm = useRealm();
  return <RealmPlugin realms={[realm]} />;
};

export default RealmDebugger;
