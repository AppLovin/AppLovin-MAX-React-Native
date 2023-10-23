import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";

/**
 * Define the base properties of the UI component ads i.e Adview and NativeAdView.
 */
export type AdProps = {
    
    /**
     * A string value representing the ad unit id to load ads for.
     */
    adUnitId: string;

    /**
     * A string value representing the placement name that you assign when you integrate each ad format, for granular reporting in ad events.
     */
    placement?: string | null;

    /**
     * A string value representing the customData name that you assign when you integrate each ad format, for granular reporting in ad events.
     */
    customData?: string | null;

    /**
     * A dictionary value representing the extra parameters to set a list of key-value string pairs
     * for customization.
     */
    extraParameters?: { [key: string]: string | null };

    /**
     * A dictionary value representing the extra parameters to set a list of key-value string pairs to
     * customize the plugins of the mediated networks.
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
