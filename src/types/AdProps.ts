import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";

/**
 * Defines the base properties for the UI component ads i.e {@link Adview} and {@link NativeAdView}.
 */
export type AdProps = {

    /**
     * A string value representing the ad unit id to load ads for.
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
    extraParameters?: { [key: string]: string | null };

    /**
     * A dictionary value representing the local extra parameters to set a list of key-value pairs
     * to pass to the adapter instances.
     */
    localExtraParameters?: { [key: string]: any };

    /**
     * A callback fuction to be fired when a new ad has been loaded.
     */
    onAdLoaded?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction to be fired when an ad could not be retrieved.
     */
    onAdLoadFailed?: (error: AdLoadFailedInfo) => void;

    /**
     * A callback fuction to be fired when the ad failed to display.
     */
    onAdDisplayFailed?: (error: AdDisplayFailedInfo) => void;

    /**
     * A callback fuction to be fired when ad is clicked.
     */
    onAdClicked?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction to be fired when the revenue event is detected.
     */
    onAdRevenuePaid?: (adInfo: AdRevenueInfo) => void;
};
