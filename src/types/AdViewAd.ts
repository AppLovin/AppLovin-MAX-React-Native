import type { AdFormat } from '../AdView';
import type { AdEventListener } from './AdEvent';
import type { AdInfo, AdLoadFailedInfo, AdDisplayFailedInfo, AdRevenueInfo } from './AdInfo';
import type { LocalExtraParameterValue } from './AdProps';

/**
 * Encapsulates an ad object for you to pass to {@link AdView}. {@link AdViewAd} loads view-based
 * ads (i.e. banner or MREC) and can be passed to {@link AdView} when you mount {@link AdView}.
 */
export type AdViewAd = {
    /**
     * A string value representing the ad unit id to load ads for.
     */
    adUnitId: string;

    /**
     * A string value representing the ad format to load ads for. Should be either
     * {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
     */
    adFormat: AdFormat;

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
     * A boolean value representing whether or not to enable adaptive banners.
     */
    adaptiveBannerEnabled?: boolean;

    /**
     * A boolean value representing whether or not to enable auto-refresh. Note that auto-refresh is
     * enabled by default.
     */
    autoRefresh?: boolean;

    /**
     * A dictionary value representing the extra parameters to set a list of key-value string pairs
     * for the ad.
     */
    extraParameters?: { [key: string]: string | null };

    /**
     * A dictionary value representing the local extra parameters to set a list of key-value pairs
     * to pass to the adapter instances.
     */
    localExtraParameters?: { [key: string]: LocalExtraParameterValue };

    /**
     * Loads an ad.
     */
    loadAd(): void;

    /**
     * Destroys the {@link AdViewAd} object.
     */
    destroy(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when {@link AdViewAd} loads a new ad.
     *
     * @param listener Listener to be notified.
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when {@link AdViewAd} loads a new ad.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdLoadFailedInfo} when {@link AdViewAd}
     * could not load a new ad.
     *
     * @param listener Listener to be notified.
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Removes the event listener to receive {@link AdLoadFailedInfo} when {@link AdViewAd} could
     * not load a new ad.
     */
    removeAdLoadFailedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdDisplayFailedInfo} when {@link AdViewAd}
     * fails to display the ad.
     *
     * @param listener Listener to be notified.
     */
    addAdDisplayFailedEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void;

    /**
     * Removes the event listener to receive {@link AdDisplayFailedInfo} when {@link AdViewAd}
     * fails to display the ad.
     */
    removeAdDisplayFailedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when the user clicks the ad.
     *
     * @param listener Listener to be notified.
     */
    addAdClickedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when the user clicks the ad.
     */
    removeAdClickedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when {@link AdViewAd} collapses
     * the ad.
     *
     * @param listener Listener to be notified.
     */
    addAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when {@link AdViewAd} collapses
     * the ad.
     */
    removeAdCollapsedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when {@link AdViewAd} expands
     * the ad.
     *
     * @param listener Listener to be notified.
     */
    addAdExpandedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when {@link AdViewAd} expands
     * the ad.
     */
    removeAdExpandedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdRevenueInfo} when {@link AdViewAd} pays
     * ad revenue to the publisher.
     *
     * @param listener Listener to be notified.
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void;

    /**
     * Removes the event listener to receive {@link AdRevenueInfo} when {@link AdViewAd} pays ad
     * revenue to the publisher.
     */
    removeAdRevenuePaidListener(): void;
};
