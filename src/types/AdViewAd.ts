import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";
import type { AdViewPosition } from "./AdViewProps";

export interface AdViewAdInterface {

    /**
     * Sets a placement to tie the showing ad’s events to.
     *
     * @param adUnitId 
     * @param placement 
     */
    setPlacement(adUnitId: string, placement: string | null): void;

    /**
     * Sets custom data to tie the showing ad’s events to.
     * 
     * @param adUnitId 
     * @param customData 
     */
    setCustomData(adUnitId: string, customData: string | null): void;

    /**
     * Updates the banner position.
     * 
     * @param adUnitId 
     * @param bannerPosition 
     */
    updatePosition(adUnitId: string, bannerPosition: AdViewPosition): void;

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
     * Starts or resumes auto-refreshing of the banner.
     * 
     * @param adUnitId 
     */
    startAutoRefresh(adUnitId: string): void;

    /**
     * Pauses auto-refreshing of the banner.
     * 
     * @param adUnitId 
     */
    stopAutoRefresh(adUnitId: string): void;

    /**
     * Shows the banner.
     * 
     * @param adUnitId 
     */
    show(adUnitId: string): void;

    /**
     * Hides the banner.
     * 
     * @param adUnitId 
     */
    hide(adUnitId: string): void;

    /**
     * Destroys the banner.
     * 
     * @param adUnitId 
     */
    destroy(adUnitId: string): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addAdClickedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is collapsed.
     * 
     * @param listener 
     */
    addAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is expanded.
     * 
     * @param listener 
     */
    addAdExpandedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void;

    removeAdLoadedEventListener(): void;

    removeAdLoadFailedEventListener(): void;

    removeAdClickedEventListener(): void;

    removeAdCollapsedEventListener(): void;

    removeAdExpandedEventListener(): void;

    removeAdRevenuePaidListener(): void;
}
