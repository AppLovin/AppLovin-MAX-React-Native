import type { Configuration } from "./Configuration";

/**
 * Represents the AppLovinMAX module.
 */
export type AppLovinMAXType = {

    /**
     * Whether the SDK has fully been initialized without errors and the completion callback called.
     */
    isInitialized(): Promise<boolean>;

    /**
     * Initializes the SDK, and returns Configuration when it finishes initializing.
     * 
     * @param sdkKey SDK key to use for the instance of the AppLovin SDK.
     */
    initialize(sdkKey: string): Promise<Configuration>;

    /**
     * Presents the mediation debugger UI.
     */
    showMediationDebugger(): void;

    /**
     * Whether this device is a tablet.
     */
    isTablet(): Promise<boolean>;

    /**
     * Sets an id for the current user.  This identifier will be tied to SDK events and AppLovin’s
     * optional S2S postbacks.
     * 
     * @param userId User id.
     */
    setUserId(userId: string): void;

    /**
     * Sets a muted state or not for beginning video ads.
     *
     * @param muted If ads should begin in a muted state.
     */
    setMuted(muted: boolean): void;

    /**
     * Whether to begin video ads in a muted state or not.
     */
    isMuted(): Promise<boolean>;

    /**
     * A toggle for verbose logging for the SDK.
     *
     * @param verboseLoggingEnabled True if log messages should be output.
     */
    setVerboseLogging(verboseLoggingEnabled: boolean): void;

    /**
     * Enable devices to receive test ads by passing in the advertising identifier (IDFA) of each
     * test device.  Refer to AppLovin logs for the IDFA of your current device.
     * 
     * @param advertisingIds A list of the advertising ids.
     */
    setTestDeviceAdvertisingIds(advertisingIds: string[]): void;

    /**
     * Whether the Creative Debugger will be displayed after flipping the device screen down twice.
     *
     * @param enabled Default to true.
     */
    setCreativeDebuggerEnabled(enabled: boolean): void;

    /**
     * Set an extra parameter to pass to the AppLovin server.
     * 
     * @param key Parameter key.
     * @param value Parameter value.
     */
    setExtraParameter(key: string, value: string | null): void;

    /**
     * Whether or not the SDK will collect the device location.
     *
     * @param enabled Defaults to true.
     */
    setLocationCollectionEnabled(enabled: boolean): Promise<void>;
};
