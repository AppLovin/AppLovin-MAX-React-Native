import { NativeModules } from 'react-native';

const { AppLovinMAX } = NativeModules;

const {
    MAXERRORCODE_UNSPECIFIED,
    MAXERRORCODE_NO_FILL,
    MAXERRORCODE_AD_LOAD_FAILED,
    MAXERRORCODE_NETWORK_ERROR,
    MAXERRORCODE_NETWORK_TIMEOUT,
    MAXERRORCODE_NO_NETWORK,
    MAXERRORCODE_FULLSCREEN_AD_ALREADY_SHOWING,
    MAXERRORCODE_FULLSCREEN_AD_NOT_READY,
    MAXERRORCODE_FULLSCREEN_AD_ALREADY_LOADING,
    MAXERRORCODE_FULLSCREEN_AD_LOAD_WHILE_SHOWING,
    MAXERRORCODE_INVALID_AD_UNIT_ID,
} = AppLovinMAX.getConstants();

/**
 * This class contains various error codes that the SDK can return when a MAX ad fails to load or
 * display.
 */
export enum ErrorCode {
    /**
     * This error code represents an error that could not be categorized into one of the other defined
     * errors. See the message field in the error object for more details.
     */
    UNSPECIFIED = MAXERRORCODE_UNSPECIFIED,

    /**
     * This error code indicates that MAX returned no eligible ads from any mediated networks for this
     * app/device.
     */
    NO_FILL = MAXERRORCODE_NO_FILL,

    /**
     * This error code indicates that MAX returned eligible ads from mediated networks, but all ads
     * failed to load. See the adLoadFailureInfo field in the error object for more details.
     */
    AD_LOAD_FAILED = MAXERRORCODE_AD_LOAD_FAILED,

    /**
     * This error code indicates that the ad request failed due to a generic network error. See the
     * message field in the error object for more details.
     */
    NETWORK_ERROR = MAXERRORCODE_NETWORK_ERROR,

    /**
     * This error code indicates that the ad request timed out due to a slow internet connection.
     */
    NETWORK_TIMEOUT = MAXERRORCODE_NETWORK_TIMEOUT,

    /**
     * This error code indicates that the ad request failed because the device is not connected to the
     * internet.
     */
    NO_NETWORK = MAXERRORCODE_NO_NETWORK,

    /**
     * This error code indicates that you attempted to show a fullscreen ad while another fullscreen ad
     * is still showing.
     */
    FULLSCREEN_AD_ALREADY_SHOWING = MAXERRORCODE_FULLSCREEN_AD_ALREADY_SHOWING,

    /**
     * This error code indicates you are attempting to show a fullscreen ad before the one has been
     * loaded.
     */
    FULLSCREEN_AD_NOT_READY = MAXERRORCODE_FULLSCREEN_AD_NOT_READY,

    /**
     * This error code indicates you are attempting to load a fullscreen ad while another
     * fullscreen ad is already loading.
     */
    FULLSCREEN_AD_ALREADY_LOADING = MAXERRORCODE_FULLSCREEN_AD_ALREADY_LOADING,

    /**
     * This error code indicates you are attempting to load a fullscreen ad while another fullscreen ad
     * is still showing.
     */
    FULLSCREEN_AD_LOAD_WHILE_SHOWING = MAXERRORCODE_FULLSCREEN_AD_LOAD_WHILE_SHOWING,

    /**
     * This error code indicates that the SDK failed to load an ad because the publisher provided an
     * invalid ad unit identifier.
     *
     * Possible reasons for an invalid ad unit identifier:
     * 1. Ad unit identifier is malformed or does not exist
     * 2. Ad unit is disabled
     * 3. Ad unit is not associated with the current app's package name
     * 4. Ad unit was created within the last 30-60 minutes
     */
    INVALID_AD_UNIT_ID = MAXERRORCODE_INVALID_AD_UNIT_ID,
}
