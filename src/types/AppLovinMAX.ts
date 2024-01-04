import type { Configuration } from './Configuration';
import type { CmpError } from '../AppLovinMAX';

/**
 * Represents the AppLovinMAX module.
 */
export type AppLovinMAXType = {
    /**
     * Indicates whether or not the AppLovinMAX SDK has fully initialized without errors and
     * {@link AppLovinMAX.initialize()} has called the completion callback.
     */
    isInitialized(): Promise<boolean>;

    /**
     * Initializes the AppLovinMAX SDK, and returns {@link Configuration} when it finishes initializing.
     *
     * @param sdkKey SDK key to use for the instance of the AppLovinMAX SDK.
     */
    initialize(sdkKey: string): Promise<Configuration>;

    /**
     * Sets a list of the ad units for the SDK to initialize only those networks.
     *
     * @param adUnitIds Ad units to be initialized with the SDK.
     */
    setInitializationAdUnitIds(adUnitIds: string[]): void;

    /**
     * Presents the mediation debugger UI.
     */
    showMediationDebugger(): void;

    /**
     * Whether this device is a tablet.
     */
    isTablet(): Promise<boolean>;

    /**
     * Sets an ID for the current user. AppLovin ties this identifier to SDK events and AppLovin’s
     * optional S2S postbacks.
     *
     * @param userId User id.
     */
    setUserId(userId: string): void;

    /**
     * Sets a muted state (or not) as the initial state for video ads.
     *
     * @param muted If ads should begin in a muted state.
     */
    setMuted(muted: boolean): void;

    /**
     * Whether to begin video ads in a muted state or not.
     */
    isMuted(): Promise<boolean>;

    /**
     * A toggle for verbose logging for the AppLovinMAX SDK.
     *
     * @param verboseLoggingEnabled true if the AppLovinMAX SDK should output log messages.
     */
    setVerboseLogging(verboseLoggingEnabled: boolean): void;

    /**
     * Enables devices to receive test ads by passing in the advertising identifier (IDFA) of each
     * test device. Refer to AppLovin logs for the IDFA of your current device.
     *
     * @param advertisingIds A list of the advertising ids.
     */
    setTestDeviceAdvertisingIds(advertisingIds: string[]): void;

    /**
     * Whether the Creative Debugger displays after you flip the device screen down twice.
     *
     * @param enabled Default to true.
     */
    setCreativeDebuggerEnabled(enabled: boolean): void;

    /**
     * Sets an extra parameter to pass to the AppLovin server.
     *
     * @param key Parameter key.
     * @param value Parameter value.
     */
    setExtraParameter(key: string, value: string | null): void;

    /**
     * Whether or not the AppLovinMAX SDK collects the device location.
     *
     * @param enabled Defaults to true.
     */
    setLocationCollectionEnabled(enabled: boolean): void;

    /**
     * Shows the CMP flow to an existing user.
     * Note that this resets the user’s existing consent information.
     *
     * The function returns when the flow finishes showing. On success, returns null. On failure,
     * returns one of the {@link CmpError} codes.
     *
     * @return {Promise<CmpError|null>}
     */
    showCmpForExistingUser(): Promise<CmpError | null>;

    /**
     * Returns true if a supported CMP SDK is detected.
     *
     * @return {boolean}
     */
    hasSupportedCmp(): Promise<boolean>;
};
