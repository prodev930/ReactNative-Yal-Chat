import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {Provider as ReduxStoreProvider} from 'react-redux';
import {persistor, store} from 'redux/store';
import {
  Linking,
  LogBox,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import useTheme from 'hooks/useTheme';
import {ThemeProvider} from 'styled-components';
import {statusBarColor} from 'constants/statusBarColor';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {normalize} from 'utils/normalize';
import {logo} from 'assets/images';
import RootNavigation from 'navigations/RootNavigation';
import {useRealmContext} from 'database';
import RealmDebugger from 'components/RealmDebugger';
import {ToastProvider} from 'react-native-toast-notifications';
import {navigators, screens} from 'constants/screens';
export const ScreenNameContext = createContext(null);
// import notifee, {EventType} from '@notifee/react-native';
// import {acceptN, rejectN} from 'nativeModules';
import {NativeSMSHandler, setDefaultDialerN} from 'nativeModules';
import SyncProvider from 'providers/SyncProvider';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClientProvider} from '@tanstack/react-query';
import Platform from 'utils/platform';
import {
  setupInitialNotification,
  setupNotificationListener,
} from 'services/notification.services';
import TanStackQueryService from 'services/query-services';
import {MyAppThemeProvider} from 'context/MyAppTheme';
import LogRocketProvider from 'providers/LogRocketProvider';

export const AppContext = createContext();
const queryClient = TanStackQueryService.queryClient;

LogBox.ignoreLogs([
  'ReactImageView:',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state',
  'Module Leaflet requires main queue setup since it overrides',
  'BSON: For React Native please polyfill crypto.getRandomValues',
]); // Ignore

// import LogRocketProvider from 'providers/LogRocketProvider';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [grantedDefaultSMS, setGrantedDefaultSMS] = useState(false);
  const [grantedDefaultDialer, setGrantedDefaultDialer] = useState(false);

  const isReadyRef = useRef();
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState('LOGIN');
  const {RealmProvider} = useRealmContext();
  const theme = useTheme();
  const styles = useStyles(currentRoute);

  // disable font scaling
  if (Text.defaultProps == null) {
    Text.defaultProps = {};
  }
  Text.defaultProps.allowFontScaling = false;

  if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
  }
  TextInput.defaultProps.allowFontScaling = false;

  useEffect(() => {
    const timeOut = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timeOut);
  }, []);

  const makeDefaultSms = async () => {
    try {
      let granted = await NativeSMSHandler.setDefault();
      if (granted) {
        console.log({sms: granted});
        setGrantedDefaultSMS(granted);
      }
    } catch (err) {
      // console.log(err, 'makeDefault');
    }
  };

  const makeDefaultDialer = async () => {
    try {
      let granted = await setDefaultDialerN();
      if (granted) {
        console.log({dialer: granted});
        setGrantedDefaultDialer(granted);
      }
    } catch (err) {
      // console.log(err, 'makeDefault');
    }
  };

  useEffect(() => {
    const test = async () => {
      await makeDefaultSms();
      await makeDefaultDialer();
    };
    test();
  }, []);

  const linking = {
    prefixes: ['shambyte://'],
    config: {
      screens: {
        [navigators.APP]: {
          initialRouteName: screens.APP.SMS,
          screens: {
            [screens.APP.SMS_THREADS]: {
              path: 'SMS_THREADS',
              parse: {
                thread_id: Number,
                phone_number: String,
              },
            },
            [screens.APP.CALLS]: {
              path: 'DIAL/:phoneNumber',
              parse: {
                phoneNumber: String,
              },
            },
          },
        },
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      console.log('Initial URL: ', url);
      if (url) {
        let interval = setInterval(() => {
          if (isReadyRef.current) {
            Linking.openURL(url);
            if (interval) {
              clearInterval(interval);
            }
          }
        }, 1000);
      }
      return url;
    },
  };

  useLayoutEffect(() => {
    const unsubscribe = setupNotificationListener();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LogRocketProvider>
      <MyAppThemeProvider>
        <AppContext.Provider value={{grantedDefaultDialer, grantedDefaultSMS}}>
          <AnimatedSplash
            translucent={true}
            isLoaded={isLoaded}
            logoImage={logo}
            backgroundColor={theme.colors.bg}
            logoHeight={normalize(120)}
            logoWidth={normalize(120)}>
            <ToastProvider>
              <RealmProvider>
                <RealmDebugger />
                <ScreenNameContext.Provider value={currentRoute}>
                  <ThemeProvider theme={theme}>
                    <ReduxStoreProvider store={store}>
                      <PersistGate loading={null} persistor={persistor}>
                        <QueryClientProvider client={queryClient}>
                          <SafeAreaProvider>
                            <View style={styles.appContainer}>
                              <SafeAreaView style={styles.safeArea} />
                              <StatusBar
                                barStyle={styles.barStyle}
                                backgroundColor={styles.backgroundColor}
                              />
                              <SyncProvider>
                                <NavigationContainer
                                  fallback={<Text>Loading...</Text>}
                                  linking={linking}
                                  ref={navigationRef}
                                  onReady={() => {
                                    isReadyRef.current = true;
                                    setCurrentRoute(
                                      navigationRef.getCurrentRoute().name,
                                    );
                                    setupInitialNotification();
                                  }}
                                  onStateChange={async () => {
                                    setCurrentRoute(
                                      navigationRef.getCurrentRoute().name,
                                    );
                                  }}>
                                  <RootNavigation
                                    navigationRef={navigationRef}
                                  />
                                </NavigationContainer>
                              </SyncProvider>
                            </View>
                          </SafeAreaProvider>
                        </QueryClientProvider>
                      </PersistGate>
                    </ReduxStoreProvider>
                  </ThemeProvider>
                </ScreenNameContext.Provider>
              </RealmProvider>
            </ToastProvider>
          </AnimatedSplash>
        </AppContext.Provider>
      </MyAppThemeProvider>
    </LogRocketProvider>
  );
};

const useStyles = currentRoute => {
  const theme = useTheme();
  const styles = useMemo(() => {
    return {
      appContainer: {
        flex: 1,
        paddingTop: Platform.isIos ? 0 : StatusBar.currentHeight,
        backgroundColor:
          statusBarColor(theme)[currentRoute]?.color || '#e3e3e3',
      },
      safeArea: {
        flex: 0,
        backgroundColor:
          statusBarColor(theme)[currentRoute]?.color || '#e3e3e3',
      },
      backgroundColor: statusBarColor(theme)[currentRoute]?.color || '#e3e3e3',
      barStyle:
        statusBarColor(theme)[currentRoute]?.contentStyle || 'dark-content',
    };
  }, [currentRoute, theme]);

  return styles;
};

export default App;
