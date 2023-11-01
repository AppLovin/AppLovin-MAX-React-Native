/**
 * Represents an ad that has been served by AppLovin MAX.
 */
export type AdInfo = {

    /**
     * The ad unit ID for which this ad was loaded.
     */
    adUnitId: string;

    /**
     * The creative id tied to the ad, if any. You can report creative issues to the corresponding
     * ad network using this id.
     *
     * @see {@link https://dash.applovin.com/documentation/mediation/react-native/testing-networks/creative-debugger#creative-id}
     */
    creativeId?: string | null;

    /**
     * The ad network from which this ad was loaded.
     *
     * @see {@link https://dash.applovin.com/documentation/mediation/react-native/testing-networks/creative-debugger#network-name}
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
};


/**
 * Encapsulates various data for MAX load errors.
 */
export type AdLoadFailedInfo = {

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
     * The mediated network's error code for the error.
     */
    mediatedNetworkErrorCode: number;

    /**
     * The mediated network's error message for the error.
     */
    mediatedNetworkErrorMessage: string;

    /**
     * The message for the error.
     */
    adLoadFailureInfo?: string | null;

    /**
     * The underlying waterfall of ad responses.
     */
    waterfall?: AdWaterfallInfo | null;
};

/**
 * Encapsulates various data for MAX display errors.
 */
export type AdDisplayFailedInfo = AdInfo & {

    /**
     * The error code for the error.
     */
    code: string | null;

    /**
     * The error message for the error.
     */
    message?: string | null;

    /**
     * The mediated network's error code for the error.
     */
    mediatedNetworkErrorCode: number;

    /**
     * The mediated network's error message for the error.
     */
    mediatedNetworkErrorMessage: string;
};

/**
 * Represents a reward given to the user.
 */
export type AdRewardInfo = AdInfo & {

    /**
     * The reward label.
     */
    rewardLabel?: string | null;

    /**
     * The rewarded amount.
     */
    rewardAmount: string;
};

/**
 * Represents a revenue given to the user.
 */
export type AdRevenueInfo = AdInfo & {

    /**
     * The ad network placement for which this ad was loaded.
     */
    networkPlacement: string;

    /**
     * The precision of the revenue value for this ad.
     *
     * Possible values are:
     * - "publisher_defined" - If the revenue is the price assigned to the line item by the publisher.
     * - "exact" - If the revenue is the resulting price of a real-time auction.
     * - "estimated" - If the revenue is the price obtained by auto-CPM.
     * - "undefined" - If we do not have permission from the ad network to share impression-level data.
     * - "" - An empty string, if revenue and precision are not valid (for example, in test mode).
     */
    revenuePrecision: string;

    /**
     * The current country code.
     */
    countryCode: string;
};

/**
 * Represents a native ad.
 */
export type AdNativeInfo = {

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
};

/**
 * Represents an ad waterfall, encapsulating various metadata such as total latency, underlying ad
 * responses, etc.
 */
export type AdWaterfallInfo = {

    /**
     * The ad waterfall name.
     */
    name: string;

    /**
     * The ad waterfall test name.
     */
    testName: string;

    /**
     * The list of {@link AdNetworkResponseInfo} info objects relating to each ad in the waterfall,
     * ordered by their position.
     */
    networkResponses: AdNetworkResponseInfo[];

    /**
     * The total latency in seconds for this waterfall to finish processing.
     */
    latencyMillis: number;
};

/**
 * This enum contains possible states of an ad in the waterfall the adapter response info could
 * represent.
 */
export enum AdLoadState {

    /**
     * The AppLovin MAX SDK did not attempt to load an ad from this network in the waterfall because
     * an ad higher in the waterfall loaded successfully.
     */
    LoadStateAdLoadNotAttempted = 0,

    /**
     * An ad successfully loaded from this network.
     */
    LoadStateAdLoaded = 1,

    /**
     * An ad failed to load from this network.
     */
    LoadStateAdFailedToLoad = 2
}

/**
 * Encapsulates load and display errors.
 */
export type AdErrorInfo = {

    /**
     * The error code for the error.
     */
    code: number;

    /**
     * The error message for the error.
     */
    message?: string;

    /**
     * @deprecated
     */
    adLoadFailureInfo?: string;
};

/**
 * This class represents an ad response in a waterfall.
 */
export type AdNetworkResponseInfo = {

    /**
     * The state of the ad that this object represents.  For more info, see the {@link AdLoadState} enum.
     */
    adLoadState: AdLoadState;

    /**
     * The mediated network that this adapter response info object represents.
     */
    mediatedNetwork?: AdMediatedNetworkInfo;

    /**
     * The credentials used to load an ad from this adapter, as entered in the AppLovin MAX dashboard.
     */
    credentials: { [key: string]: any; };

    /**
     * The ad load error this network response resulted in. Will be unavailable if an attempt to
     * load an ad has not been made or an ad was loaded successfully (i.e. the loadState is NOT
     * LoadStateAdFailedToLoad).
     */
    error?: AdErrorInfo;

    /**
     * The amount of time the network took to load (either successfully or not) an ad, in
     * milliseconds. If an attempt to load an ad has not been made (i.e. the loadState is
     * LoadStateAdLoadNotAttempted), the value will be -1.
     */
    latencyMillis: number;
};

/**
 * This class represents information for a mediated network.
 */
export type AdMediatedNetworkInfo = {

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
};
