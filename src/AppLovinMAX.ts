import { NativeModules } from 'react-native';
import type { AppLovinMAXType } from './types/AppLovinMAX';
import type { Configuration } from './types/Configuration';

const NativeAppLovinMAX = NativeModules.AppLovinMAX;

const VERSION = '7.0.0';

/**
 * This enum represents the user's geography used to determine the type of consent flow shown to the
 * user.
 */
export enum ConsentFlowUserGeography {
    /**
     * User's geography is unknown.
     */
    UNKNOWN = 'U',

    /**
     * The user is in GDPR region.
     */
    GDPR = 'G',

    /**
     * The user is in a non-GDPR region.
     */
    OTHER = 'O',
}

/**
 * AppLovin SDK-defined app tracking transparency status values (extended to include "unavailable"
 * state on iOS before iOS14).
 */
export enum AppTrackingStatus {
    /**
     * Device is on iOS before iOS14, AppTrackingTransparency.framework is not available.
     */
    UNAVAILABLE = 'U',

    /**
     * The user has not yet received an authorization request to authorize access to app-related
     * data that can be used for tracking the user or the device.
     */
    NOT_DETERMINED = 'N',

    /**
     * Authorization to access app-related data that can be used for tracking the user or the device
     * is restricted.
     */
    RESTRICTED = 'R',

    /**
     * The user denies authorization to access app-related data that can be used for tracking the
     * user or the device.
     */
    DENIED = 'D',

    /**
     * The user authorizes access to app-related data that can be used for tracking the user or the
     * device.
     */
    AUTHORIZED = 'A',
}

/**
 * Represents errors for CMP flow.
 */
export enum CMPErrorCode {
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
