import type { ConsentFlowUserGeography, AppTrackingStatus } from '../AppLovinMAX';

/**
 * Represents the AppLovin MAX SDK configuration returned after initialization.
 */
export type Configuration = {
    /**
     * The user's country code.
     */
    countryCode: string;

    /**
     * The user's geographic region used to determine which consent flow to display.
     * Returns {@link ConsentFlowUserGeography.UNKNOWN} if the geography cannot be determined.
     */
    consentFlowUserGeography: ConsentFlowUserGeography;

    /**
     * The user's app tracking transparency status on iOS.
     * Only available on iOS 14+; undefined on Android.
     */
    appTrackingStatus?: AppTrackingStatus;

    /**
     * Indicates whether test mode is enabled for this session.
     *
     * Returns `true` if any of the following conditions are met:
     * - {@link AppLovinMAX.setTestDeviceAdvertisingIds()} was called with the current device's GAID before SDK initialization.
     * - The current device was registered via the MAX dashboard under "Test Devices".
     * - Test mode was manually enabled in the Mediation Debugger in a previous session.
     * - The app is running on an emulator.
     */
    isTestModeEnabled: boolean;
};
