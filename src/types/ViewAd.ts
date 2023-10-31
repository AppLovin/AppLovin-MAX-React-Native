import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";
import type { AdViewPosition } from "../AdView";

/**
 * Define a view based ad (i.e. Banner / MREC)
 */
export type ViewAdType = {

    /**
     * Destroys the banner/mrec.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     */
    destroyAd(adUnitId: string): void;

    /**
     * Shows the banner/mrec.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     */
    showAd(adUnitId: string): void;

    /**
     * Hides the banner/mrec.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     */
    hideAd(adUnitId: string): void;

    /**
     * Sets a placement to tie the showing ad’s events to.
     *
     * @param adUnitId The Ad Unit ID to  to load ads for.
     * @param placement The placement to tie the showing ad's events to.
     */
    setPlacement(adUnitId: string, placement: string | null): void;

    /**
     * Sets custom data to tie the showing ad’s events to.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     * @param customData The custom data to tie the showing ad's events to. Maximum size is 8KB.
     */
    setCustomData(adUnitId: string, customData: string | null): void;

    /**
     * Updates the banner/mrec position.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     * @param bannerPosition {@link AdViewPosition} position.
     */
    updatePosition(adUnitId: string, bannerPosition: AdViewPosition): void;

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     * @param key Key parameter.
     * @param value Value parameter.
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Set a local extra parameter to pass to the adapter instances.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     * @param key Key parameter.
     * @param value Value parameter.
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: any): void;

    /**
     * Starts or resumes auto-refreshing of the banner/mrec.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     */
    startAutoRefresh(adUnitId: string): void;

    /**
     * Pauses auto-refreshing of the banner/mrec.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     */
    stopAutoRefresh(adUnitId: string): void;

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
     * Removes the event listener to receive {@link AdLoadFailedInfo} when an ad could not be loaded.
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
     * Adds the specified event listener to receive {@link AdInfo} when the ad is collapsed.
     * 
     * @param listener Listener to be notified.
     */
    addAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when the ad is collapsed.
     */
    removeAdCollapsedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when the ad is expanded.
     * 
     * @param listener Listener to be notified.
     */
    addAdExpandedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when the ad is expanded.
     */
    removeAdExpandedEventListener(): void;

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
