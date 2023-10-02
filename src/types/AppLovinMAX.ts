/**
 * The SDK configuration.
 */
export interface Configuration {

    /**
     * The country code of this user. 
     */
    countryCode: string;
}

export interface AppLovinMAXInterface {

    /**
     * Whether the SDK has fully been initialized without errors and the completion callback called.
     */
    isInitialized(): Promise<boolean>;

    /**
     * Initializes the SDK, and returns Configuration when it finishes initializing.
     * 
     * @param sdkKey 
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
     * @param userId 
     */
    setUserId(userId: string): void;

    /**
     * Sets a muted state or not for beginning video ads.
     *
     * @param muted 
     */
    setMuted(muted: boolean): void;

    /**
     * Whether to begin video ads in a muted state or not.
     */
    isMuted(): Promise<boolean>;

    /**
     * A toggle for verbose logging for the SDK.
     *
     * @param verboseLoggingEnabled 
     */
    setVerboseLogging(verboseLoggingEnabled: boolean): void;

    /**
     * Enable devices to receive test ads by passing in the advertising identifier (IDFA) of each
     * test device.  Refer to AppLovin logs for the IDFA of your current device.
     * 
     * @param advertisingIds 
     */
    setTestDeviceAdvertisingIds(advertisingIds: string[]): void;

    /**
     * Whether the Creative Debugger will be displayed after flipping the device screen down twice.
     *
     * @param enabled 
     */
    setCreativeDebuggerEnabled(enabled: boolean): void;

    /**
     * Set an extra parameter to pass to the AppLovin server.
     * 
     * @param key 
     * @param value 
     */
    setExtraParameter(key: string, value: string | null): void;

    /**
     * Whether or not the SDK will collect the device location.
     *
     * @param enabled 
     */
    setLocationCollectionEnabled(enabled: boolean): Promise<void>;
}
