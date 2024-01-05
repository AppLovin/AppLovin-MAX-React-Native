import { NativeModules } from 'react-native';
import type { AppLovinMAXType } from './types/AppLovinMAX';
import type { Configuration } from './types/Configuration';

const NativeAppLovinMAX = NativeModules.AppLovinMAX;

const VERSION = '6.2.1';

/**
 * Represents errors for CMP flow.
 */
export enum CmpError {
    /**
     * Indicates that an unspecified error has occurred.
     */
    UNSPECIFIED = -1,

    /**
     * Indicates that the CMP has not been integrated correctly.
     */
    INTEGRATION_ERROR = 1,

    /**
     * Indicates that the CMP form is unavailable.
     */
    FORM_UNAVAILABLE = 2,

    /**
     * Indicates that the CMP form is not required.
     */
    FORM_NOT_REQUIRED = 3,
}

const initialize = async (sdkKey: string): Promise<Configuration> => {
    return NativeAppLovinMAX.initialize(VERSION, sdkKey);
};

type NativeAppLovinMAXType = Omit<AppLovinMAXType, 'initialize'>;

const nativeMethods: NativeAppLovinMAXType = NativeAppLovinMAX;

export const AppLovinMAX: AppLovinMAXType = {
    ...nativeMethods,
    initialize,
};

export default AppLovinMAX;
