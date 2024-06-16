import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {screens} from 'constants/screens';
import Home from 'screens/App/Home';
import Contacts from 'screens/App/Contacts';
import SMSThread from 'screens/App/SMSThread';
import NewConversation from 'screens/App/NewConversation';
import Calls from 'screens/App/Calls';
import SMSScreen from 'screens/App/SMS';
import BottomTabNavigator from './BottomTabNavigator';
import Profile from 'screens/App/Profile';
import UserDetailScreen from 'screens/App/UserDetailScreen';
import CompromisedThreats from 'screens/App/CompromisedThreats';
import AllScams from 'screens/App/AllScams';
import AllSpams from 'screens/App/AllSpams';
import Setting from 'screens/App/Setting';
import FAQ from 'screens/App/FAQ';
import ManageBlocking from 'screens/App/ManageBlocking';
const AppNavigationStack = createNativeStackNavigator();
const Stack = [
  {name: screens.APP.BOTTOM_TAB, component: BottomTabNavigator},
  {name: screens.APP.HOME, component: Home},
  {name: screens.APP.CONTACTS, component: Contacts},
  {name: screens.APP.SMS, component: SMSScreen},
  {name: screens.APP.CALLS, component: Calls},
  {name: screens.APP.SMS_THREADS, component: SMSThread},
  {name: screens.APP.NEW_CONVERSATION, component: NewConversation},
  {name: screens.APP.PROFILE, component: Profile},
  {name: screens.APP.USERDETAIL, component: UserDetailScreen},
  {name: screens.APP.COMPROMISEDTHREATS, component: CompromisedThreats},
  {name: screens.APP.ALLSCAMS, component: AllScams},
  {name: screens.APP.ALLSPAMS, component: AllSpams},
  {name: screens.APP.SETTING, component: Setting},
  {name: screens.APP.FAQ, component: FAQ},
  {name: screens.APP.MANAGEBLOCKING, component: ManageBlocking},
];
const AppNavigation = () => {
  return (
    <>
      <AppNavigationStack.Navigator
        initialRouteName={screens.APP.BOTTOM_TAB}
        screenOptions={{headerShown: false, animation: 'none'}}>
        {Stack.map(({name, component, screenOptions}) => (
          <AppNavigationStack.Screen
            key={name}
            name={name}
            component={component}
            options={screenOptions ? screenOptions : {}}
          />
        ))}
      </AppNavigationStack.Navigator>
    </>
  );
};

export default AppNavigation;
