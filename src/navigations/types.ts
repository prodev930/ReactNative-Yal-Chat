import type {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type AppStackParamList = {
  SMS_THREADS: {
    thread_id: number;
    phone_number?: string;
    last_sms_id?: number;
  };
};

export enum RootScreens {
  APP = 'APP',
  AUTH = 'AUTH',
}

export type RootStackParamList = {
  [RootScreens.APP]: AppStackParamList;
  [RootScreens.AUTH]: undefined;
};

export type ThreadRouterProps = RouteProp<AppStackParamList, 'SMS_THREADS'>;

export type RootNavigationRouterProps = NativeStackNavigationProp<
  RootStackParamList,
  RootScreens.APP
>;

export default RootStackParamList;
