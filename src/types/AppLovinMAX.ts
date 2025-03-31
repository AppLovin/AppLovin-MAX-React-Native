import type { Configuration } from './Configuration';
import type { CMPError } from './CMPError';
import type { ConsentFlowUserGeography } from '../AppLovinMAX';

/**
 * Defines the AppLovin MAX module interface exposed to JavaScript.
 */
export type AppLovinMAXType = {
    /**
     * Checks whether the AppLovin MAX SDK has finished initializing.
     *
     * @returns A promise that resolves to `true` if the SDK is initialized, or `false` otherwise.
     */
    isInitialized(): Promise<boolean>;

    /**
     * Initializes the AppLovin MAX SDK.
     *
     * @param sdkKey - Your AppLovin SDK key.
     * @returns A promise that resolves with the initialization configuration.
     */
    initialize(sdkKey: string): Promise<Configuration>;

    /**
     * Restricts initialization to the specified ad unit IDs only.
     *
     * @param adUnitIds - An array of ad unit IDs to initialize.
     */
    setInitializationAdUnitIds(adUnitIds: string[]): void;

    /**
     * Displays the AppLovin Mediation Debugger UI.
     */
    showMediationDebugger(): void;

    /**
     * Checks whether the current device is a tablet.
     *
     * @returns A promise that resolves to `true` if the device is a tablet.
     */
    isTablet(): Promise<boolean>;

    /**
     * Sets a user ID for use in SDK events and S2S postbacks.
     *
     * @param userId - The custom user ID to associate with this device.
     */
    setUserId(userId: string): void;

    /**
     * Sets whether video ads should start in a muted state.
     *
     * @param muted - `true` to mute ads by default.
     */
    setMuted(muted: boolean): void;

    /**
     * Gets whether video ads will start muted.
     *
     * @returns A promise that resolves to `true` if ads will begin muted.
     */
    isMuted(): Promise<boolean>;

    /**
     * Enables or disables verbose logging in the AppLovin MAX SDK.
     *
     * @param verboseLoggingEnabled - `true` to enable verbose logs.
     */
    setVerboseLogging(verboseLoggingEnabled: boolean): void;

    /**
     * Registers test devices using their advertising IDs (IDFA/IDFV).
     *
     * @param advertisingIds - An array of advertising IDs to register.
     */
    setTestDeviceAdvertisingIds(advertisingIds: string[]): void;

    /**
     * Enables or disables the Creative Debugger gesture (flip screen down twice).
     *
     * @param enabled - `true` to enable the Creative Debugger (default: true).
     */
    setCreativeDebuggerEnabled(enabled: boolean): void;

    /**
     * Sets an extra parameter to send with SDK requests.
     *
     * @param key - The name of the parameter.
     * @param value - The value of the parameter, or `null` to clear it.
     */
    setExtraParameter(key: string, value: string | null): void;

    /**
     * Enables the AppLovin MAX Terms and Privacy Policy flow.
     *
     * @param enabled - `true` to enable the flow.
     */
    setTermsAndPrivacyPolicyFlowEnabled(enabled: boolean): void;

    /**
     * Sets the URL for your company’s privacy policy (required to enable the terms flow).
     *
     * @param urlString - A valid URL string to your privacy policy.
     */
    setPrivacyPolicyUrl(urlString: string): void;

    /**
     * Sets the URL for your company’s terms of service (optional).
     *
     * @param urlString - A valid URL string to your terms of service.
     */
    setTermsOfServiceUrl(urlString: string): void;

    /**
     * Sets a mock geography for testing the CMP flow (e.g., GDPR).
     *
     * @note This only applies when running the app in debug mode.
     *
     * @param userGeography - The mock user geography to simulate.
     */
    setConsentFlowDebugUserGeography(userGeography: ConsentFlowUserGeography): void;

    /**
     * Displays the CMP flow for an existing user and resets their consent status.
     *
     * @returns A promise that resolves to `null` on success, or a {@link CMPError} on failure.
     */
    showCmpForExistingUser(): Promise<CMPError | null>;

    /**
     * Checks if a supported CMP SDK is available.
     *
     * @returns A promise that resolves to `true` if a CMP is detected.
     */
    hasSupportedCmp(): Promise<boolean>;

    /**
     * Adds a new user segment.
     *
     * @param key - An integer key identifying the segment.
     * @param values - An array of integer values for the segment.
     * @returns A promise that resolves on success, or rejects if the operation fails.
     */
    addSegment(key: number, values: number[]): Promise<void>;

    /**
     * Retrieves the list of user segments.
     *
     * @returns A promise that resolves to a map of segment keys to arrays of values,
     * or `null` if no segments are available.
     */
    getSegments(): Promise<Map<number, number[]> | null>;
};
