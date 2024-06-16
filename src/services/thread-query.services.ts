/* eslint-disable @typescript-eslint/no-explicit-any */
import {NativeSMSHandler} from 'nativeModules';
import LogService from './log.services';

export type ThreadResponse = {
  thread_id: number;
  contactName: string;
  contacts: any[];
  date: number;
  phoneNumber: string;
  snippet: string;
  unread_count?: number;
  keyword?: string;
  pinned: boolean;
  archived: boolean;
  draft: string;
};

export type SearchThreadsResponse = {
  threads: ThreadResponse[];
  contacts: any[];
  cursor?: {
    next_cursor: number;
    limit: number;
    has_next: boolean;
  };
};

export type GetThreadsPaginatedResponse = {
  threads: ThreadResponse[];
  cursor?: {
    next_cursor: number;
    limit: number;
    has_next: boolean;
  };
};

const THREADS_LIMIT = 50;

class ThreadQueryServices {
  //
  static async searchThreadsByKeyword(
    keyword: string,
    // cursor: number,
    // limit: number = 100,
  ): Promise<GetThreadsPaginatedResponse> {
    try {
      const result = await NativeSMSHandler.searchThreadsByKeyword(keyword);
      return result;
    } catch (error) {
      return {
        threads: [],
      };
    }
  }

  static async getThreads(
    cursorId?: number,
  ): Promise<GetThreadsPaginatedResponse> {
    try {
      const result: GetThreadsPaginatedResponse =
        await NativeSMSHandler.getThreads(
          THREADS_LIMIT,
          Number.isFinite(cursorId) ? cursorId : -1,
        );
      return result;
    } catch (error: any) {
      LogService.trackIssue('ERROR getThreads', error, 'error');
      return {
        threads: [],
        cursor: {
          next_cursor: -1,
          limit: 0,
          has_next: false,
        },
      };
    }
  }

  static async deleteThreads(threadIds: number[]) {
    const result = await NativeSMSHandler.deleteThreads(threadIds);
    return result > 0;
  }

  static async getThreadIdByPhoneNumber(phoneNumber: string): Promise<number> {
    try {
      const threadId = await NativeSMSHandler.getThreadIdByPhoneNumber(
        phoneNumber,
      );
      return threadId;
    } catch (error: any) {
      LogService.trackIssue('getThreadIdByPhoneNumber', error, 'error');
      return -1;
    }
  }

  static async markThreadAsRead(threadId: number) {
    try {
      await NativeSMSHandler.markThreadAsRead(threadId);
    } catch (error: any) {
      LogService.trackIssue('markThreadAsRead', error, 'error');
    }
  }
}

export default ThreadQueryServices;
