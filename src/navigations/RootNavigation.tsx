import React, {FC, useEffect} from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useCallState} from 'hooks/useCallState';
import RingingCallUI from 'components/Calls/RingingCallUI';
import ActiveCallUI from 'components/Calls/ActiveCallUI';
import {CALL_STATE_MAP_ENUMS} from 'constants/callStateMap';
import RootStackParamList, {
  RootNavigationRouterProps,
  RootScreens,
} from './types';
import {RootState} from 'redux/store.types';
const RootNavigationStack = createNativeStackNavigator<RootStackParamList>();
const Stack: {
  name: RootScreens;
  component: () => JSX.Element;
  screenOptions?: NativeStackNavigationOptions;
}[] = [
  {name: RootScreens.AUTH, component: AuthNavigation},
  {name: RootScreens.APP, component: AppNavigation},
];

interface RootNavigationProps {}

const RootNavigation: FC<RootNavigationProps> = ({}) => {
  useCallState();
  const {callState} = useSelector((state: RootState) => state.callState);
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<RootNavigationRouterProps>();
  useEffect(() => {
    if (user && user.token) {
      navigation.reset({
        index: 0,
        routes: [{name: RootScreens.APP}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: RootScreens.AUTH}],
      });
    }
  }, [navigation, user]);

  return (
    <>
      {callState === CALL_STATE_MAP_ENUMS.STATE_RINGING ? (
        <RingingCallUI />
      ) : callState === CALL_STATE_MAP_ENUMS.ACTIVE ||
        callState === CALL_STATE_MAP_ENUMS.STATE_HOLDING ||
        callState === CALL_STATE_MAP_ENUMS.STATE_DIALING ? (
        <ActiveCallUI />
      ) : null}

      <RootNavigationStack.Navigator
        initialRouteName={user ? RootScreens.APP : RootScreens.AUTH}
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
        tabBarOptions={{
          tabBarHideOnKeyboard: true,
        }}
        >
        {Stack.map(({name, component, screenOptions}) => (
          <RootNavigationStack.Screen
            key={name}
            name={name}
            component={component}
            options={screenOptions ? screenOptions : {}}
          />
        ))}
      </RootNavigationStack.Navigator>
    </>
  );
};

export default RootNavigation;
