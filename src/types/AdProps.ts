import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo } from './AdInfo';

/**
 * Local extra parameters can be of type: string, number, boolean, array, map, and null.
 */
export type LocalExtraParameterValue = string | number | boolean | object | null;

/**
 * Defines the base properties for the UI component ads i.e {@link AdView} and {@link NativeAdView}.
 */
export type AdProps = {
    /**
     * A string value representing the ad unit ID to load ads for.
     */
    adUnitId: string;

    /**
     * A string value representing the placement name that you assign when you integrate each ad
     * format, for granular reporting in ad events.
     */
    placement?: string | null;

    /**
     * The custom data to tie the showing ad to.
     */
    customData?: string | null;

    /**
     * A dictionary value representing the extra parameters to set a list of key-value string pairs
     * for the ad.
     */
    extraParameters?: { [key: string]: string };

    /**
     * A dictionary value representing the local extra parameters to set a list of key-value pairs
     * to pass to the adapter instances.
     */
    localExtraParameters?: { [key: string]: string | boolean };

    /**
     * A callback fuction that {@link AdView} or {@link NativeAdView} fires when it loads a new ad.
     */
    onAdLoaded?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction that {@link AdView} or {@link NativeAdView} fires when it could not load a new ad.
     */
    onAdLoadFailed?: (error: AdLoadFailedInfo) => void;

    /**
     * A callback fuction that {@link AdView} or {@link NativeAdView} fires when it fails to display the ad.
     */
    onAdDisplayFailed?: (error: AdDisplayFailedInfo) => void;

    /**
     * A callback fuction that {@link AdView} or {@link NativeAdView} fires when the user clicks the ad.
     */
    onAdClicked?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction that {@link AdView} or {@link NativeAdView} fires when it pays ad revenue to the publisher.
     */
    onAdRevenuePaid?: (adInfo: AdInfo) => void;
};
