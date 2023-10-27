import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdDisplayFailedInfo } from "./AdInfo";

/**
 * Define a fullscreen ad (i.e Intestitial / Rewarded / AppOpen)
 */
export type FullscreenAdType = {

    /**
     * Whether or not this ad is ready to be shown.
     * 
     * @param adUnitId 
     */
    isAdReady(adUnitId: string): Promise<boolean>;

    /**
     * Loads an interstitial ad.
     * 
     * @param adUnitId 
     */
    loadAd(adUnitId: string): void;

    /**
     * Show the loaded interstitial ad, optionallly for a given placement and custom data to tie ad
     * events to.
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showAd(adUnitId: string, placement?: string | null, customData?: string | null): void;

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Set a local extra parameter to pass to the adapter instances.
     *
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: any): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive `AdInfo` when a new ad has been loaded.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Removes the event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
      */
    removeAdLoadFailedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addAdClickedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive `AdInfo` when the ad is clicked.
     */
    removeAdClickedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is displayed.
     * 
     * @param listener 
     */
    addAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive `AdInfo` when the ad is displayed.
     */
    removeAdDisplayedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdDisplayFailedInfo` when the ad is failed to
     * display.
     * 
     * @param listener 
     */
    addAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void;

    /**
     * Removes the event listener to receive `AdDisplayFailedInfo` when the ad is failed to display.
     */
    removeAdFailedToDisplayEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is hidden.
     * 
     * @param listener 
     */
    addAdHiddenEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive `AdInfo` when the ad is hidden.
     */
    removeAdHiddenEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void;

    /**
     * Removes the event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     */
    removeAdRevenuePaidListener(): void;
};
