import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo } from './AdInfo';

/**
 * Represents the allowed value types for local extra parameters passed to the ad adapter.
 * Can be a primitive, object, or null.
 */
export type LocalExtraParameterValue = string | number | boolean | object | null;

/**
 * Defines the base props shared by ad UI components like {@link AdView} and {@link NativeAdView}.
 */
export type AdProps = {
    /**
     * The ad unit ID used to load ads.
     */
    adUnitId: string;

    /**
     * The placement name defined in your integration, used for granular reporting.
     */
    placement?: string | null;

    /**
     * Optional custom data to attach to the ad, used for analytics or targeting.
     */
    customData?: string | null;

    /**
     * Extra parameters to be sent as key-value string pairs.
     */
    extraParameters?: { [key: string]: string };

    /**
     * Local extra parameters sent to the adapter instance.
     * Supports string and boolean values only.
     */
    localExtraParameters?: { [key: string]: string | boolean };

    /**
     * Called when a new ad is successfully loaded.
     */
    onAdLoaded?: (adInfo: AdInfo) => void;

    /**
     * Called when the SDK fails to load a new ad.
     */
    onAdLoadFailed?: (error: AdLoadFailedInfo) => void;

    /**
     * Called when the ad fails to display after being loaded.
     */
    onAdDisplayFailed?: (error: AdDisplayFailedInfo) => void;

    /**
     * Called when the ad is clicked by the user.
     */
    onAdClicked?: (adInfo: AdInfo) => void;

    /**
     * Called when ad revenue is paid to the publisher.
     */
    onAdRevenuePaid?: (adInfo: AdInfo) => void;
};
