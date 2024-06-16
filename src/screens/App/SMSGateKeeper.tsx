// import useTheme from 'hooks/useTheme';
import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {selectSMSSyncStatus, selectThreadSyncStatus} from 'redux/sync-status';
import {Wrapper} from 'styled';
import {CommonStyles} from 'styled/common.styles';
import SMS from './SMS';

interface SMSGateKeeperProps {}

/**
 *
 * Keep the Realm useQuery doesn't spam SMS screen while syncing
 */
const SMSGateKeeper: React.FC<SMSGateKeeperProps> = () => {
  const threadSyncStatus = useSelector(selectThreadSyncStatus);
  const smsSyncStatus = useSelector(selectSMSSyncStatus);
  // const theme = useTheme();

  if (threadSyncStatus === 'syncing' || smsSyncStatus === 'syncing') {
    return (
      <Wrapper>
        <View
          style={[
            CommonStyles.flex1,
            CommonStyles.justifyContentCenter,
            CommonStyles.alignItemsCenter,
          ]}>
          <ActivityIndicator />
          <Text>Syncing your data...</Text>
        </View>
      </Wrapper>
    );
  }

  if (threadSyncStatus === 'idle') {
    return null;
  }

  return (
    <>
      <SMS />
    </>
  );
};

export default SMSGateKeeper;
