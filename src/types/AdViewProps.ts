import { NativeModules } from "react-native";
import type { ViewProps } from "react-native";
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";

const { AppLovinMAX } = NativeModules;

const {
    BANNER_AD_FORMAT_LABEL,
    MREC_AD_FORMAT_LABEL,

    TOP_CENTER_POSITION,
    TOP_LEFT_POSITION,
    TOP_RIGHT_POSITION,
    CENTERED_POSITION,
    CENTER_LEFT_POSITION,
    CENTER_RIGHT_POSITION,
    BOTTOM_LEFT_POSITION,
    BOTTOM_CENTER_POSITION,
    BOTTOM_RIGHT_POSITION,
} = AppLovinMAX.getConstants();

/**
 * Defines a format of an ad.
 */
export enum AdFormat {

    /**
     * Banner ad.
     */
    BANNER = BANNER_AD_FORMAT_LABEL,

    /**
     * MRec ad.
     */
    MREC = MREC_AD_FORMAT_LABEL,
}

/**
 * Defines a position of a banner and MRec ad.
 */
export enum AdViewPosition {
    TOP_CENTER = TOP_CENTER_POSITION,
    TOP_LEFT = TOP_LEFT_POSITION,
    TOP_RIGHT = TOP_RIGHT_POSITION,
    CENTERED = CENTERED_POSITION,
    CENTER_LEFT = CENTER_LEFT_POSITION,
    CENTER_RIGHT = CENTER_RIGHT_POSITION,
    BOTTOM_LEFT = BOTTOM_LEFT_POSITION,
    BOTTOM_CENTER = BOTTOM_CENTER_POSITION,
    BOTTOM_RIGHT = BOTTOM_RIGHT_POSITION,
}

/**
 * Represents an `AdView` - banner / MRec.
 */
export interface AdViewProps extends ViewProps {

    /**
     * A string value representing the ad unit id to load ads for.
     */
    adUnitId: string;

    /**
     * A string value representing the ad format to load ads for. Should be either `AppLovinMAX.AdFormat.BANNER` or `AppLovinMAX.AdFormat.MREC`.
     */
    adFormat: AdFormat;

    /**
     * A string value representing the placement name that you assign when you integrate each ad format, for granular reporting in ad events.
     */
    placement?: string | null;

    /**
     * A string value representing the customData name that you assign when you integrate each ad format, for granular reporting in ad events.
     */
    customData?: string | null;

    /**
     * A boolean value representing whether or not to enable adaptive banners.
     */
    adaptiveBannerEnabled?: boolean;

    /**
     * A boolean value representing whether or not to enable auto-refresh. Note that auto-refresh is enabled by default.
     */
    autoRefresh?: boolean;

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
     * A callback fuction to be fired when the ad view is expanded.
     */
    onAdExpanded?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction to be fired when the ad view is collapsed.
     */
    onAdCollapsed?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction to be fired when the revenue event is detected.
     */
    onAdRevenuePaid?: (adInfo: AdRevenueInfo) => void;
}
