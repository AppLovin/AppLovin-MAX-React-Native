import type { ErrorCode } from '../ErrorCode';
import type { AdViewId } from './AdViewProps';

/**
 * Represents a successfully loaded ad served by AppLovin MAX.
 */
export type AdInfo = {
    /**
     * The ad unit ID that was used to load this ad.
     */
    adUnitId: string;

    /**
     * The format of the ad.
     */
    adFormat: string;

    /**
     * The unique identifier of the associated native AdView component, if any.
     */
    adViewId?: AdViewId;

    /**
     * The creative ID associated with the ad.
     * This can be used to report issues with the creative.
     *
     * @see https://support.applovin.com/hc/en-us/articles/13986039797389
     */
    creativeId?: string | null;

    /**
     * The name of the ad network that served the ad.
     */
    networkName: string;

    /**
     * The name of the placement as configured on the ad network side.
     */
    networkPlacement: string;

    /**
     * The custom placement name defined in your integration.
     * Used for postback reporting.
     */
    placement?: string | null;

    /**
     * The revenue generated from the ad impression, in USD.
     * Defaults to 0 if not available.
     */
    revenue: number;

    /**
     * The precision level of the revenue value reported for this ad.
     *
     * Possible values:
     * - `"exact"` — Revenue from a real-time auction.
     * - `"estimated"` — Revenue estimated via auto-CPM.
     * - `"publisher_defined"` — Revenue set manually by the publisher.
     * - `"undefined"` — The ad network does not permit impression-level revenue data.
     * - `""` — Empty when revenue and precision are unavailable (e.g., in test mode).
     */
    revenuePrecision: string;

    /**
     * The name of the DSP (Demand-Side Platform), if served through AppLovin Exchange.
     */
    dspName?: string | null;

    /**
     * Total mediation load time in milliseconds.
     */
    latencyMillis: number;

    /**
     * The full ad waterfall associated with this ad request.
     */
    waterfall?: AdWaterfallInfo;

    /**
     * The native ad, if available.
     */
    nativeAd?: AdNativeInfo | null;

    /**
     * The size of the AdView format ad, or size with (width: 0, height: 0) otherwise.
     */
    size: {
        width: number;
        height: number;
    };
};

/**
 * Represents a failure when attempting to load an ad.
 */
export type AdLoadFailedInfo = {
    /**
     * The ad unit ID for which the load failed.
     */
    adUnitId: string;

    /**
     * The native AdView component ID, if available.
     */
    adViewId?: AdViewId;

    /**
     * AppLovin MAX-defined error code.
     */
    code: ErrorCode;

    /**
     * Descriptive message for the error.
     */
    message?: string | null;

    /**
     * Error code from the mediated network.
     */
    mediatedNetworkErrorCode: number;

    /**
     * Error message from the mediated network.
     */
    mediatedNetworkErrorMessage: string;

    /**
     * Additional debug information for ad load failure (legacy).
     */
    adLoadFailureInfo?: string | null;

    /**
     * Waterfall data associated with the failed request.
     */
    waterfall?: AdWaterfallInfo | null;
};

/**
 * Represents an error that occurred when displaying an ad.
 */
export type AdDisplayFailedInfo = AdInfo & {
    /**
     * AppLovin MAX-defined error code.
     */
    code: ErrorCode;

    /**
     * Descriptive message for the error.
     */
    message?: string | null;

    /**
     * Error code from the mediated network.
     */
    mediatedNetworkErrorCode: number;

    /**
     * Error message from the mediated network.
     */
    mediatedNetworkErrorMessage: string;
};

/**
 * Represents a successful reward event from a rewarded ad.
 */
export type AdRewardInfo = AdInfo & {
    /**
     * The label of the reward.
     */
    rewardLabel?: string | null;

    /**
     * The reward amount, as a string.
     */
    rewardAmount: string;
};

/**
 * Describes metadata for a native ad, including asset availability.
 */
export type AdNativeInfo = {
    /**
     * Title text of the native ad for use in {@link TitleView}.
     */
    title?: string;

    /**
     * Advertiser name for {@link AdvertiserView}.
     */
    advertiser?: string;

    /**
     * Body text for {@link BodyView}.
     */
    body?: string;

    /**
     * Call-to-action label for {@link CallToActionView}.
     */
    callToAction?: string;

    /**
     * Star rating (0.0 to 5.0) for {@link StarRatingView}.
     */
    starRating?: number;

    /**
     * Aspect ratio (width / height) for {@link MediaView}, if available.
     */
    mediaContentAspectRatio?: number;

    /**
     * Whether an icon image is available for {@link IconView}.
     */
    isIconImageAvailable: boolean;

    /**
     * Whether the options menu view is available for {@link OptionsView}.
     */
    isOptionsViewAvailable: boolean;

    /**
     * Whether a media view is available for {@link MediaView}.
     */
    isMediaViewAvailable: boolean;
};

/**
 * Contains metadata about the ad waterfall evaluated during an ad request.
 */
export type AdWaterfallInfo = {
    /**
     * The waterfall name for this request.
     */
    name: string;

    /**
     * The test name, if the waterfall is part of an A/B test.
     */
    testName: string;

    /**
     * Ordered list of network responses attempted during mediation.
     */
    networkResponses: AdNetworkResponseInfo[];

    /**
     * Total time taken to complete the waterfall, in milliseconds.
     */
    latencyMillis: number;
};

/**
 * Enumeration of possible ad load states for each network in the waterfall.
 */
export enum AdLoadState {
    /**
     * SDK did not attempt to load an ad from this network.
     */
    LoadStateAdLoadNotAttempted = 0,

    /**
     * An ad was successfully loaded from this network.
     */
    LoadStateAdLoaded = 1,

    /**
     * The network failed to load an ad.
     */
    LoadStateAdFailedToLoad = 2,
}

/**
 * General error info object used in waterfall response details.
 */
export type AdErrorInfo = {
    /**
     * AppLovin MAX-defined error code.
     */
    code: ErrorCode;

    /**
     * Descriptive error message.
     */
    message?: string;

    /**
     * @deprecated Use `message` instead.
     */
    adLoadFailureInfo?: string;
};

/**
 * Contains information about a single mediated network response.
 */
export type AdNetworkResponseInfo = {
    /**
     * The result of the load attempt.
     */
    adLoadState: AdLoadState;

    /**
     * Metadata about the mediated network.
     */
    mediatedNetwork?: AdMediatedNetworkInfo;

    /**
     * A key-value map of adapter-specific credentials, as configured in the MAX dashboard.
     */
    credentials: { [key: string]: string | number | boolean | object | null };

    /**
     * The ad load error resulting from this network response. This will be unavailable if no ad load
     * attempt was made or if the ad loaded successfully (i.e., [adLoadState] is NOT [LoadStateAdFailedToLoad]).
     */
    error?: AdErrorInfo;

    /**
     * The amount of time, in milliseconds, the network took to load an ad—regardless of success.
     * If no ad load attempt was made (i.e., [adLoadState] is [LoadStateAdLoadNotAttempted]),
     * this value will be -1.
     */
    latencyMillis: number;
};

/**
 * Metadata about a mediated ad network.
 */
export type AdMediatedNetworkInfo = {
    /**
     * Name of the mediated network.
     */
    name: string;

    /**
     * Fully-qualified adapter class name.
     */
    adapterClassName: string;

    /**
     * Version of the adapter.
     */
    adapterVersion: string;

    /**
     * Version of the mediated network’s SDK.
     */
    sdkVersion: string;
};
