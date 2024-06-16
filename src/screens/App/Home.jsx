import useTheme from 'hooks/useTheme';
import React, {
  // useContext,
  useEffect,
} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {height} from 'utils/device';
import {MT} from 'styled/MT';
// import {SolidButton} from 'components/Buttons/SolidButton';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import {useRecentCallSync} from 'hooks/useSync';
// import {NativeSMSHandler, setDefaultDialerN} from 'nativeModules';
// import {AppContext} from '../../../App';
// import {useSync} from 'services/sync-helpers';

const Home = () => {
  const theme = useTheme();

  // const {
  // grantedDefaultDialer,
  // grantedDefaultSMS,
  // permissions,
  // } = useContext(AppContext);

  const navigation = useNavigation();
  // const {
  // smsSyncDone,
  // threadsGenerationDone,
  // contactSyncDone,
  //  idBeingSynced
  // } = useSync(false);

  const {recentCallIdBeingSynced, recentCallSyncDone} = useRecentCallSync(true);

  useEffect(() => {
    // if (
    //   (smsSyncDone &&
    //     threadsGenerationDone &&
    //     contactSyncDone &&
    //     grantedDefaultSMS &&
    //     grantedDefaultDialer &&
    //     recentCallSyncDone) ||
    //   Platform.OS === 'ios'
    // ) {
      navigation.reset({
        index: 0,
        routes: [{name: screens.APP.BOTTOM_TAB}],
      });
    // }
  }, [navigation]);

  return (
    <View
      style={{
        height: height,
        backgroundColor: theme.colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacings.verticalScale.s36,
        paddingHorizontal: theme.spacings.normalScale.s24,
      }}>
      <>
        {/* {!smsSyncDone ? (
            <>
              <ActivityIndicator />
              <MT MT={theme.spacings.verticalScale.s12} />
              <Text>Syncing SMS @ id {idBeingSynced}</Text>
            </>
          ) : null} */}
        {/* {!threadsGenerationDone ? (
          <>
            <ActivityIndicator />
            <MT MT={theme.spacings.verticalScale.s12} />
            <Text>Generating Threads</Text>
          </>
        ) : null} */}
        {/* {!contactSyncDone ? (
          <>
            <ActivityIndicator />
            <MT MT={theme.spacings.verticalScale.s12} />
            <Text>Syncing Contacts</Text>
          </>
        ) : null} */}
        {!recentCallSyncDone ? (
          <>
            <ActivityIndicator />
            <MT MT={theme.spacings.verticalScale.s12} />
            <Text>Syncing Call Logs @ id {recentCallIdBeingSynced}</Text>
          </>
        ) : null}
      </>
    </View>
  );
};

export default Home;
