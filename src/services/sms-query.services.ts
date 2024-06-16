/* eslint-disable @typescript-eslint/no-explicit-any */
import {NativeSMSHandler} from 'nativeModules';
import LogService from './log.services';

export interface SMSType {
  _id: number;
  body: string;
  address: string;
  date: number;
  thread_id?: number;
  date_sent?: number;
  error_code?: number;
  locked?: number;
  person?: number;
  protocol?: number;
  read?: number;
  reply_path_present?: number;
  seen?: number;
  service_center?: string;
  status?: number;
  subscription_id?: number;
  type?: number;
}

export type SMSResponse = {
  sms: SMSType[];
  cursor: {
    next_cursor: number;
    limit: number;
    has_next: boolean;
  };
};

class SMSQueryServices {
  //
  static async getSMSbyThreadId(
    threadId: number,
    cursor: number,
    limit: number = 50,
  ) {
    try {
      const smsResponse: SMSResponse = await NativeSMSHandler.getSMSbyThreadId(
        threadId,
        cursor,
        limit,
      );

      return smsResponse;
    } catch (error: any) {
      LogService.trackIssue('getSMSbyThreadId', error, 'error');
      return {
        sms: [],
        cursor: {
          next_cursor: -1,
          limit: limit,
          has_next: false,
        },
      } as SMSResponse;
    }
  }

  static async sendSMSViaPhoneNumber(
    phoneNumber: string,
    message: string,
  ): Promise<boolean> {
    try {
      await NativeSMSHandler.sendSms(phoneNumber, message);
      return true;
    } catch (error: any) {
      LogService.trackIssue('sendSMSViaPhoneNumber', error, 'error');
      return false;
    }
  }

  static async deleteSMSs(smsIds: number[]): Promise<boolean> {
    try {
      const result: boolean = await NativeSMSHandler.deleteSmsByIds(smsIds);
      return result;
    } catch (error: any) {
      LogService.trackIssue('deleteSMSs', error, 'error');
      return false;
    }
  }
}

export default SMSQueryServices;
