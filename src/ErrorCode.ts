import AppLovinMAX from './specs/NativeAppLovinMAXModule';

const {
    MAX_ERROR_CODE_UNSPECIFIED,
    MAX_ERROR_CODE_NO_FILL,
    MAX_ERROR_CODE_AD_LOAD_FAILED,
    MAX_ERROR_CODE_AD_DISPLAY_FAILED,
    MAX_ERROR_CODE_NETWORK_ERROR,
    MAX_ERROR_CODE_NETWORK_TIMEOUT,
    MAX_ERROR_CODE_NO_NETWORK,
    MAX_ERROR_CODE_FULLSCREEN_AD_ALREADY_SHOWING,
    MAX_ERROR_CODE_FULLSCREEN_AD_NOT_READY,
    MAX_ERROR_CODE_FULLSCREEN_AD_INVALID_VIEW_CONTROLLER,
    MAX_ERROR_CODE_DONT_KEEP_ACTIVITIES_ENABLED,
    MAX_ERROR_CODE_INVALID_AD_UNIT_ID,
} = AppLovinMAX.getConstants();

/**
 * Error codes returned by the AppLovin MAX SDK when an ad fails to load or display.
 */
export enum ErrorCode {
    /**
     * An unspecified error occurred.
     * See the `message` field for more details.
     */
    UNSPECIFIED = MAX_ERROR_CODE_UNSPECIFIED,

    /**
     * No eligible ads were returned from any mediated networks.
     */
    NO_FILL = MAX_ERROR_CODE_NO_FILL,

    /**
     * Eligible ads were returned but all failed to load.
     * See `adLoadFailureInfo` for more details.
     */
    AD_LOAD_FAILED = MAX_ERROR_CODE_AD_LOAD_FAILED,

    /**
     * An error occurred while attempting to display the ad.
     */
    AD_DISPLAY_FAILED = MAX_ERROR_CODE_AD_DISPLAY_FAILED,

    /**
     * The ad request failed due to a general network issue.
     * See the `message` field for details.
     */
    NETWORK_ERROR = MAX_ERROR_CODE_NETWORK_ERROR,

    /**
     * The ad request timed out, likely due to a slow internet connection.
     */
    NETWORK_TIMEOUT = MAX_ERROR_CODE_NETWORK_TIMEOUT,

    /**
     * The ad request failed because the device was offline.
     */
    NO_NETWORK = MAX_ERROR_CODE_NO_NETWORK,

    /**
     * A fullscreen ad was requested while another one was already showing.
     */
    FULLSCREEN_AD_ALREADY_SHOWING = MAX_ERROR_CODE_FULLSCREEN_AD_ALREADY_SHOWING,

    /**
     * A fullscreen ad was requested before it had finished loading.
     */
    FULLSCREEN_AD_NOT_READY = MAX_ERROR_CODE_FULLSCREEN_AD_NOT_READY,

    /**
     * The ad was presented from an invalid view controller.
     * **iOS only**.
     */
    FULLSCREEN_AD_INVALID_VIEW_CONTROLLER = MAX_ERROR_CODE_FULLSCREEN_AD_INVALID_VIEW_CONTROLLER,

    /**
     * The SDK was unable to display the ad because the
     * "Don't Keep Activities" developer setting is enabled.
     * **Android only**.
     */
    DONT_KEEP_ACTIVITIES_ENABLED = MAX_ERROR_CODE_DONT_KEEP_ACTIVITIES_ENABLED,

    /**
     * The ad failed to load due to an invalid ad unit identifier.
     *
     * Possible causes:
     * 1. The ad unit ID is malformed or does not exist.
     * 2. The ad unit is disabled.
     * 3. The ad unit is not linked to the current app’s package name.
     * 4. The ad unit was recently created (less than ~30–60 minutes ago).
     */
    INVALID_AD_UNIT_ID = MAX_ERROR_CODE_INVALID_AD_UNIT_ID,
}
