/**
 * Represents an ad when it is successfully loaded.
 */
export interface AdInfo {

    /**
     * The ad unit ID for which this ad was loaded.
     */
    adUnitId: string;

    /**
     * The creative id tied to the ad, if any. You can report creative issues to the corresponding
     * ad network using this id.
     */
    creativeId?: string | null;

    /**
     * The ad network from which this ad was loaded.
     */
    networkName: string;

    /**
     * The placement name that you assign when you integrate each ad format, for granular reporting
     * in postbacks.
     */
    placement?: string | null;

    /**
     *  The ad’s revenue amount. In the case where no revenue amount exists, or it is not available
     *  yet, will return a value of 0.
     */
    revenue: number;

    /**
     * The DSP network that provided the loaded ad when the ad is served through AppLovin Exchange.
     */
    dspName?: string | null;

    /**
     * The underlying waterfall of ad responses.
     */
    waterfall: AdWaterfallInfo;

    /**
     * The native ad info.
     */
    nativeAd?: AdNativeInfo | null;
}

/**
 * Encapsulates data for load errors.
 */
export interface AdLoadFailedInfo {

    /**
     * The ad unit ID for which this ad was loaded.
     */
    adUnitId: string;

    /**
     * The error code for the error.
     */
    code: string | null;

    /**
     * The error message for the error.
     */
    message?: string | null;

    /**
     * The message for the error.
     */
    adLoadFailureInfo?: string | null;

    /**
     * The underlying waterfall of ad responses.
     */
    waterfall?: AdWaterfallInfo | null;
}

/**
  * Encapsulates data for display errors.
 */
export interface AdDisplayFailedInfo extends AdInfo {

    /**
     * The error code for the error.
     */
    code: string | null;

    /**
     * The error message for the error.
     */
    message?: string | null;
}

/**
 * Represents a reward ad when receiving a reward event.
 */
export interface AdRewardInfo extends AdInfo {

    /**
     * The reward label.
     */
    rewardLabel?: string | null;

    /**
     * The rewarded amount.
     */
    rewardAmount: string;
}

/**
 * Represents a ad revenue when receiving a revenue event.
 */
export interface AdRevenueInfo extends AdInfo {

    /**
     * The ad network placement for which this ad was loaded.
     */
    networkPlacement: string;

    /**
     * The precision of the revenue value for this ad.
     */
    revenuePrecision: string;

    /**
     * The current country code.
     */
    countryCode: string;
}

/**
 * Represents a native ad.
 */
export interface AdNativeInfo {

    /**
     * The native ad title text.
     */
    title?: string;

    /**
     * The native ad advertiser text.
     */
    advertiser?: string;

    /**
     * The native ad body text.
     */
    body?: string;

    /**
     * The native ad CTA button text.
     */
    callToAction?: string;

    /**
     * The star rating of the native ad.
     */
    starRating?: number;

    /**
     * The aspect ratio for the media view if provided by the network.
     */
    mediaContentAspectRatio?: number;

    /**
     * Whether or not the icon is available.
     */
    isIconImageAvailable: boolean;

    /**
     * Whether or not the Options view is available.
     */
    isOptionsViewAvailable: boolean;

    /**
     * Whether or not the Media view is available.
     */
    isMediaViewAvailable: boolean;
}

/**
 * Represents an ad waterfall.
 */
export interface AdWaterfallInfo {

    /**
     * The ad waterfall name.
     */
    name: string;

    /**
     * The ad waterfall test name.
     */
    testName: string;

    /**
     * The list of `AdNetworkResponseInfo` info objects relating to each ad in the waterfall,
     * ordered by their position.
     */
    networkResponses?: AdNetworkResponseInfo[];

    /**
     * The total latency in seconds for this waterfall to finish processing.
     */
    latencyMillis: number;
}

/**
 * States of an ad in the waterfall the adapter response info could represent.
 */
export enum AdLoadState {

    /**
     * The AppLovin MAX SDK did not attempt to load an ad from this network in the waterfall because
     * an ad higher in the waterfall loaded successfully
     */
    LoadStateAdLoadNotAttempted = 0,

    /**
     * An ad successfully loaded from this network
     */
    LoadStateAdLoaded = 1,

    /**
     * An ad failed to load from this network
     */
    LoadStateAdFailedToLoad = 2
}

/**
 * Encapsulates load and display errors.
 */
export interface AdErrorInfo {

    /**
     * The error code for the error
     */
    code: number;

    /**
     * The error message for the error
     */
    message?: string;

    /**
     * @deprecated
     */
    adLoadFailureInfo?: string;
}

/**
 * Represents an ad response in a waterfall.
 */
export interface AdNetworkResponseInfo {

    /**
     * The state of the ad that this object represents.
     */
    adLoadState?: AdLoadState;

    /**
     * The mediated network that this adapter response info object represents.
     */
    mediatedNetwork?: AdMediatedNetworkInfo;

    /**
     * The credentials used to load an ad from this adapter, as entered in the AppLovin MAX dashboard.
     */
    credentials?: { [key: string]: any; };

    /**
     * The ad load error this network response resulted in.
     */
    error?: AdErrorInfo;

    /**
     * The amount of time the network took to load (either successfully or not) an ad, in seconds. 
     */
    latencyMillis?: number;
}

/**
 * Represents information for a mediated network.
 */
export interface AdMediatedNetworkInfo {

    /**
     * The name of the mediated network.
     */
    name: string;

    /**
     * The class name of the adapter for the mediated network.
     */
    adapterClassName: string;

    /**
     * The version of the adapter for the mediated network.
     */
    adapterVersion: string;

    /**
     * The version of the mediated network’s SDK.
     */
    sdkVersion: string;
}
