import type { AppLovinMAXType } from './types/AppLovinMAX';
import type { Configuration } from './types/Configuration';
import NativeAppLovinMAX from './specs/NativeAppLovinMAXModule';

const VERSION = '9.4.1';

/**
 * Represents the user's geography, used to determine which type of consent flow to display.
 */
export enum ConsentFlowUserGeography {
    /**
     * The user's geography could not be determined.
     */
    UNKNOWN = 'U',

    /**
     * The user is located in a GDPR region.
     */
    GDPR = 'G',

    /**
     * The user is not in a GDPR region.
     */
    OTHER = 'O',
}

/**
 * App tracking transparency status values as defined by the AppLovin SDK.
 *
 * These values are based on Apple's AppTrackingTransparency framework (iOS 14+).
 */
export enum AppTrackingStatus {
    /**
     * Device is running an iOS version prior to iOS 14.
     * AppTrackingTransparency is not available.
     */
    UNAVAILABLE = 'U',

    /**
     * The user has not yet responded to the tracking authorization prompt.
     */
    NOT_DETERMINED = 'N',

    /**
     * Tracking is restricted (e.g. due to parental controls).
     */
    RESTRICTED = 'R',

    /**
     * The user denied authorization for tracking.
     */
    DENIED = 'D',

    /**
     * The user authorized tracking access.
     */
    AUTHORIZED = 'A',
}

/**
 * Error codes returned from the Consent Management Platform (CMP) flow.
 */
export enum CMPErrorCode {
    /**
     * An unspecified error occurred.
     */
    UNSPECIFIED = -1,

    /**
     * The CMP was not integrated correctly.
     */
    INTEGRATION_ERROR = 1,

    /**
     * The CMP form is unavailable.
     */
    FORM_UNAVAILABLE = 2,

    /**
     * The CMP form is not required for this user.
     */
    FORM_NOT_REQUIRED = 3,
}

/**
 * Initializes the AppLovin MAX SDK with the provided SDK key.
 *
 * @param sdkKey - Your AppLovin SDK key.
 * @returns A promise that resolves with the SDK configuration.
 */
const initialize = (sdkKey: string): Promise<Configuration> => NativeAppLovinMAX.initialize(VERSION, sdkKey);

/**
 * Retrieves the user segments.
 *
 * @returns A promise resolving to a Map of segment IDs to arrays of group IDs,
 *          or `null` if no segments are available.
 */
const getSegments = async (): Promise<Map<number, number[]> | null> => {
    const segments = await NativeAppLovinMAX.getSegments();

    if (!segments) {
        return null;
    }

    const map = new Map<number, number[]>();

    for (const [key, value] of Object.entries(segments)) {
        // In JavaScript, object keys are always strings, so we convert them to numbers for the Map.
        if (value) {
            map.set(Number(key), value);
        }
    }

    return map;
};

// All native methods except those overridden here
type NativeAppLovinMAXType = Omit<AppLovinMAXType, 'initialize' | 'getSegments'>;

const nativeMethods: NativeAppLovinMAXType = NativeAppLovinMAX;

/**
 * Main AppLovin MAX module interface exposed to JavaScript.
 * Wraps the native module and overrides `initialize()` and `getSegments()` for custom handling.
 */
export const AppLovinMAX: AppLovinMAXType = Object.create(nativeMethods, {
    initialize: {
        value: initialize,
        enumerable: true,
    },
    getSegments: {
        value: getSegments,
        enumerable: true,
    },
});

export default AppLovinMAX;
