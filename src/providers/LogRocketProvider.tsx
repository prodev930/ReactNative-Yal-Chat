import React, {FC, useEffect} from 'react';

import LogRocket from '@logrocket/react-native';

import {
  getUniqueId,
  getManufacturer,
  getBrand,
  getDeviceName,
  getInstallerPackageName,
  getInstallReferrer,
  getReadableVersion,
  getSystemVersion,
  isLowRamDevice,
  isEmulator,
} from 'react-native-device-info';
import LogService from 'services/log.services';

interface LogRocketProviderProps {
  children: React.ReactNode;
}

const LogRocketProvider: FC<LogRocketProviderProps> = ({children}) => {
  useEffect(() => {
    LogRocket.init('7s9vjw/yal-ai');
    // LogRocket.init('yal/yal-chat');

  }, []);

  useEffect(() => {
    const identify = async () => {
      try {
        const promises = [
          getUniqueId(),
          getManufacturer(),
          getBrand(),
          getDeviceName(),
          getInstallerPackageName(),
          getInstallReferrer(),
          getReadableVersion(),
          getSystemVersion(),
          isLowRamDevice(),
          isEmulator(),
        ];

        const [
          uniqueId,
          manufacturer,
          brand,
          deviceName,
          installerPackageName,
          installReferer,
          version,
          systemVersion,
          isLowRam,
          isEmu,
        ] = await Promise.allSettled(promises);

        const data = {
          uniqueId: getValueFromPromiseSettedResult(uniqueId),
          manufacturer: getValueFromPromiseSettedResult(manufacturer),
          brand: getValueFromPromiseSettedResult(brand),
          deviceName: getValueFromPromiseSettedResult(deviceName),
          installerPackageName:
            getValueFromPromiseSettedResult(installerPackageName),
          installReferer: getValueFromPromiseSettedResult(installReferer),
          version: getValueFromPromiseSettedResult(version),
          systemVersion: getValueFromPromiseSettedResult(systemVersion),
          isLowRamDevice: getValueFromPromiseSettedResult(isLowRam),
          isEmulator: getValueFromPromiseSettedResult(isEmu),
        };
        console.log('----> IDENTITY DATA', data);

        LogRocket.identify(`${data.uniqueId}`, data);
      } catch (error) {
        LogService.trackIssue(LogRocketProvider.name, error, 'error');
      }
    };

    identify();
  }, []);

  return <>{children}</>;
};

function getValueFromPromiseSettedResult<T>(result: PromiseSettledResult<T>) {
  if (result.status === 'fulfilled') {
    return result.value;
  }

  return 'unknown';
}

export default LogRocketProvider;
