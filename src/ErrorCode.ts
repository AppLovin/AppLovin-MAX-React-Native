import AppLovinMAX from './specs/NativeAppLovinMAXMoudle';

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
 * This enum contains various error codes that the SDK can return when a MAX ad fails to load or
 * display.
 */
export enum ErrorCode {
    /**
     * This error code represents an error that could not be categorized into one of the other defined
     * errors. See the message field in the error object for more details.
     */
    UNSPECIFIED = MAX_ERROR_CODE_UNSPECIFIED,

    /**
     * This error code indicates that MAX returned no eligible ads from any mediated networks for this
     * app/device.
     */
    NO_FILL = MAX_ERROR_CODE_NO_FILL,

    /**
     * This error code indicates that MAX returned eligible ads from mediated networks, but all ads
     * failed to load. See the adLoadFailureInfo field in the error object for more details.
     */
    AD_LOAD_FAILED = MAX_ERROR_CODE_AD_LOAD_FAILED,

    /**
     * This error code represents an error that was encountered when showing an ad.
     */
    AD_DISPLAY_FAILED = MAX_ERROR_CODE_AD_DISPLAY_FAILED,

    /**
     * This error code indicates that the ad request failed due to a generic network error. See the
     * message field in the error object for more details.
     */
    NETWORK_ERROR = MAX_ERROR_CODE_NETWORK_ERROR,

    /**
     * This error code indicates that the ad request timed out due to a slow internet connection.
     */
    NETWORK_TIMEOUT = MAX_ERROR_CODE_NETWORK_TIMEOUT,

    /**
     * This error code indicates that the ad request failed because the device is not connected to the
     * internet.
     */
    NO_NETWORK = MAX_ERROR_CODE_NO_NETWORK,

    /**
     * This error code indicates that you attempted to show a fullscreen ad while another fullscreen ad
     * is still showing.
     */
    FULLSCREEN_AD_ALREADY_SHOWING = MAX_ERROR_CODE_FULLSCREEN_AD_ALREADY_SHOWING,

    /**
     * This error code indicates you are attempting to show a fullscreen ad before the one has been
     * loaded.
     */
    FULLSCREEN_AD_NOT_READY = MAX_ERROR_CODE_FULLSCREEN_AD_NOT_READY,

    /**
     * This error code indicates you attempted to present a fullscreen ad from an invalid view
     * controller.
     * **iOS ONLY**.
     */
    FULLSCREEN_AD_INVALID_VIEW_CONTROLLER = MAX_ERROR_CODE_FULLSCREEN_AD_INVALID_VIEW_CONTROLLER,

    /**
     * This error code indicates that the SDK failed to display an ad because the user has the
     * "Don't Keep Activities" developer setting enabled.
     * **Android ONLY**.
     */
    DONT_KEEP_ACTIVITIES_ENABLED = MAX_ERROR_CODE_DONT_KEEP_ACTIVITIES_ENABLED,

    /**
     * This error code indicates that the SDK failed to load an ad because the publisher provided an
     * invalid ad unit identifier.
     *
     * Possible reasons for an invalid ad unit identifier:
     * 1. Ad unit identifier is malformed or does not exist.
     * 2. Ad unit is disabled.
     * 3. Ad unit is not associated with the current app's package name.
     * 4. Ad unit was created within the last 30-60 minutes.
     */
    INVALID_AD_UNIT_ID = MAX_ERROR_CODE_INVALID_AD_UNIT_ID,
}
