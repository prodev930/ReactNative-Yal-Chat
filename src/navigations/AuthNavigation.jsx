import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {screens} from 'constants/screens';
import Login from 'screens/Auth/Login/Login';
import Signup from 'screens/Auth/Signup/Singup';
import Verificationfailed from 'screens/Auth/Verificationfailed/Verificationfailed';
import VerifyMobileOtpScreen from 'screens/Auth/Login/VerifyMobileOtpScreen';
import UserExistsScreen from 'screens/Auth/Signup/UserExistsScreen';

const AuthNavigationStack = createNativeStackNavigator();
const Stack = [
  {name: screens.AUTH.LOGIN, component: Login},
  {name: 'OTP_VERIFY', component: VerifyMobileOtpScreen},
  {name: screens.AUTH.SIGNUP, component: Signup},
  {name: screens.AUTH.VERIFICATION, component: Verificationfailed},
  {name: screens.AUTH.USER_EXISTS, component: UserExistsScreen},
  {name: screens.AUTH.VERIFICATION_FAILED, component: Verificationfailed},
];

const AuthNavigation = () => {
  return (
    <AuthNavigationStack.Navigator
      initialRouteName={screens.AUTH.LOGIN}
      screenOptions={{headerShown: false, animation: 'none'}}>
      {Stack.map(({name, component, screenOptions}) => (
        <AuthNavigationStack.Screen
          key={name}
          name={name}
          component={component}
          options={screenOptions ? screenOptions : {}}
        />
      ))}
    </AuthNavigationStack.Navigator>
  );
};

export default AuthNavigation;
