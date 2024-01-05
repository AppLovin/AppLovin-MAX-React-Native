import type { ConsentFlowUserGeography, AppTrackingStatus } from '../AppLovinMAX';

/**
 * Encapsulates data for the AppLovinMAX SDK configuration.
 */
export type Configuration = {
    /**
     * The country code of this user.
     */
    countryCode: string;

    /**
     * The user's geography used to determine the type of consent flow shown to the user.  If no
     * such determination could be made, {@link ConsentFlowUserGeography.UNKNOWN} will be returned.
     */
    consentFlowUserGeography: ConsentFlowUserGeography;

    /**
     * Indicates whether or not the user authorizes access to app-related data that can be used for
     * tracking the user or the device.
     *
     * Note: available only on iOS
     */
    appTrackingStatus?: AppTrackingStatus;

    /**
     * Whether or not test mode is enabled for this session.
     *
     * @return {boolean} true in one of the following cases:
     * 1. {@link AppLovinMAX.setTestDeviceAdvertisingIds()} was called with current device's GAID prior to SDK initialization.
     * 2. Current device was registered as a test device through MAX dashboard -> MAX Test Devices prior to SDK initialization.
     * 3. Test mode was manually enabled for this session through the Mediation Debugger during the last session.
     * 4. Current device is an emulator.
     */
    isTestModeEnabled: boolean;
};
