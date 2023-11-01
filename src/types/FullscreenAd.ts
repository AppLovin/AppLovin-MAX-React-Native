import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdDisplayFailedInfo } from "./AdInfo";

/**
 * Define a fullscreen ad (i.e Intestitial / Rewarded / AppOpen)
 */
export type FullscreenAdType = {

    /**
     * Whether or not this ad is ready to be shown.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     */
    isAdReady(adUnitId: string): Promise<boolean>;

    /**
     * Loads an interstitial ad.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     */
    loadAd(adUnitId: string): void;

    /**
     * Show the loaded interstitial ad, optionallly for a given placement and custom data to tie ad
     * events to.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param placement The placement to tie the showing ad's events to.
     * @param customData The custom data to tie the showing ad's events to. Maximum size is 8KB.
     */
    showAd(adUnitId: string, placement?: string | null, customData?: string | null): void;

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param key Parameter key.
     * @param value Parameter value.
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Set a local extra parameter to pass to the adapter instances.
     *
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param key Parameter key.
     * @param value Parameter value.
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: any): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when a new ad has been loaded.
     * 
     * @param listener Listener to be notified.
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a new ad has been loaded.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdLoadFailedInfo} when an ad could not be loaded.
     * 
     * @param listener Listener to be notified.
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Removes the event listener to receive {@ link adLoadFailedInfo} when an ad could not be loaded.
      */
    removeAdLoadFailedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when the ad is clicked.
     * 
     * @param listener Listener to be notified.
     */
    addAdClickedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when the ad is clicked.
     */
    removeAdClickedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when the ad is displayed.
     * 
     * @param listener Listener to be notified.
     */
    addAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when the ad is displayed.
     */
    removeAdDisplayedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdDisplayFailedInfo} when the ad is failed to
     * display.
     * 
     * @param listener Listener to be notified.
     */
    addAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void;

    /**
     * Removes the event listener to receive {@link AdDisplayFailedInfo} when the ad is failed to display.
     */
    removeAdFailedToDisplayEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when the ad is hidden.
     * 
     * @param listener Listener to be notified.
     */
    addAdHiddenEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when the ad is hidden.
     */
    removeAdHiddenEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdRevenueInfo} when the ad revenue is paid.
     * 
     * @param listener Listener to be notified.
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void;

    /**
     * Removes the event listener to receive {@link AdRevenueInfo} when the ad revenue is paid.
     */
    removeAdRevenuePaidListener(): void;
};
