/* eslint-disable @typescript-eslint/no-explicit-any */
import {EmitterSubscription} from 'react-native';

export interface SyncError {
  messages: string;
  time: string;
}

export type SYNC_STATUS = 'idle' | 'syncing' | 'done' | 'error';

export type SYNC_STATUS_CALLBACK = (status: SYNC_STATUS, data?: any) => void;

abstract class ASyncServices {
  private static status: SYNC_STATUS = 'idle';

  private static listeners: Map<string, EmitterSubscription> = new Map();

  private static errors: {messages: string; time: string}[] = [];

  private static onSyncStatusChange?: SYNC_STATUS_CALLBACK;

  static syncCursor: string = '';

  static async sync() {
    //
  }

  static cancelSync() {
    //
  }

  static getErrors() {
    return this.errors;
  }

  static setError(error: string) {
    this.errors.push({messages: error, time: new Date().toISOString()});
  }

  static getStatus() {
    return this.status;
  }

  static setStatus(status: SYNC_STATUS, data?: any) {
    this.status = status;
    this.onSyncStatusChange?.(status, data);
  }

  static resetErrors() {
    this.errors = [];
  }

  static resetStatus() {
    this.status = 'idle';
  }

  static getListener(key: string) {
    return this.listeners.get(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static initListener(callback: () => void) {
    //
  }

  static addListenerToPool(key: string, listener: EmitterSubscription) {
    if (this.listeners.has(key)) {
      this.removeListener(key);
    }
    this.listeners.set(key, listener);
  }

  static removeListener(key: string) {
    this.listeners.get(key)?.remove();
    this.listeners.delete(key);
  }

  static clearListeners() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners.clear();
    this.onSyncStatusChange = undefined;
  }

  static getSyncStatusCallback() {
    return this.onSyncStatusChange;
  }

  static setSyncStatusCallback(callback: SYNC_STATUS_CALLBACK) {
    this.onSyncStatusChange = callback;
  }
}

export default ASyncServices;
