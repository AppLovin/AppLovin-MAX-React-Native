import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";
import type { AdViewPosition } from "../AdView";

/**
 * Define a view-based ad (i.e. Banner / MREC)
 */
export type ViewAdType = {

    /**
     * Destroys the banner/MREC.
     * 
     * @param adUnitId The ad unit ID of the ad to destroy.
     */
    destroyAd(adUnitId: string): void;

    /**
     * Shows the banner/MREC.
     * 
     * @param adUnitId The ad unit ID of the ad to show.
     */
    showAd(adUnitId: string): void;

    /**
     * Hides the banner/MREC.
     * 
     * @param adUnitId The ad unit ID of the ad to hide.
     */
    hideAd(adUnitId: string): void;

    /**
     * Sets a placement to tie the showing ad’s events to.
     *
     * @param adUnitId The ad unit ID of the ad to set a placement for.
     * @param placement The placement to tie the showing ad's events to.
     */
    setPlacement(adUnitId: string, placement: string | null): void;

    /**
     * Sets custom data to tie the showing ad’s events to.
     * 
     * @param adUnitId The ad unit ID of the ad to set custom data for.
     * @param customData The custom data to tie the showing ad's events to. Maximum size is 8KB.
     */
    setCustomData(adUnitId: string, customData: string | null): void;

    /**
     * Updates the banner/mrec position.
     * 
     * @param adUnitId The ad unit ID of the ad to update the position of.
     * @param bannerPosition {@link AdViewPosition} position.
     */
    updatePosition(adUnitId: string, bannerPosition: AdViewPosition): void;

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId The ad unit ID of the ad to set a parameter for.
     * @param key Key parameter.
     * @param value Value parameter.
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Set a local extra parameter to pass to the adapter instances.
     * 
     * @param adUnitId The ad unit ID of the ad to set a local parameter for.
     * @param key Key parameter.
     * @param value Value parameter.
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: any): void;

    /**
     * Starts or resumes auto-refreshing of the banner/mrec.
     * 
     * @param adUnitId The ad unit ID of the ad to start or resume auto-refreshing.
     */
    startAutoRefresh(adUnitId: string): void;

    /**
     * Pauses auto-refreshing of the banner/mrec.
     * 
     * @param adUnitId The ad unit ID of the ad to stop auto-refreshing.
     */
    stopAutoRefresh(adUnitId: string): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when a view-base ad loads a new ad.
     * 
     * @param listener Listener to be notified.
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a view-base ad loads a new ad.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdLoadFailedInfo} when a view-base ad
     * could not load a new ad.
     * 
     * @param listener Listener to be notified.
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Removes the event listener to receive {@link AdLoadFailedInfo} when a view-base ad could not
     * load a new ad.
     */
    removeAdLoadFailedEventListener(): void;

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
     * Adds the specified event listener to receive {@link AdInfo} when a view-base ad collapses the ad.
     * 
     * @param listener Listener to be notified.
     */
    addAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a view-base ad collapses the ad.
     */
    removeAdCollapsedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when a view-base ad expands the ad.
     * 
     * @param listener Listener to be notified.
     */
    addAdExpandedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a view-base ad expands the ad.
     */
    removeAdExpandedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdRevenueInfo} when a view-base ad pays
     * ad revenue to the publisher.
     * 
     * @param listener Listener to be notified.
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void;

    /**
     * Removes the event listener to receive {@link AdRevenueInfo} when when a view-base ad pays ad
     * revenue to the publisher.
     */
    removeAdRevenuePaidListener(): void;
};
