import type { ViewProps } from "react-native";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";

/**
 * A handler of NativeAdView.
 */
export interface NativeAdViewHandler {

    /**
     * Loads a native ad.
     */
    loadAd(): void;
}

/**
 * Represents a NativeAdView.
 */
export type NativeAdViewProps = ViewProps & {

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
    extraParameters?: { key: string, value: string | null };

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
     * A callback fuction to be fired when ad is clicked.
     */
    onAdClicked?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction to be fired when the revenue event is detected.
     */
    onAdRevenuePaid?: (adInfo: AdRevenueInfo) => void;
}
