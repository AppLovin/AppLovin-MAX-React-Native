import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./AdInfo";
import type { AdViewPosition } from "./AdViewProps";

export interface AdViewAdInterface {

    /**
     * Creates a banner/mrec at the specified position and offsets.
     * 
     * @param adUnitId 
     * @param position 
     * @param args
     */
    createAd(adUnitId: string, position: AdViewPosition, ...args: any[]): void;

    /**
     * Destroys the banner/mrec.
     * 
     * @param adUnitId 
     */
    destroyAd(adUnitId: string): void;

    /**
     * Shows the banner/mrec.
     * 
     * @param adUnitId 
     */
    showAd(adUnitId: string): void;

    /**
     * Hides the banner/mrec.
     * 
     * @param adUnitId 
     */
    hideAd(adUnitId: string): void;

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
     * Updates the banner/mrec position.
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
     * Starts or resumes auto-refreshing of the banner/mrec.
     * 
     * @param adUnitId 
     */
    startAutoRefresh(adUnitId: string): void;

    /**
     * Pauses auto-refreshing of the banner/mrec.
     * 
     * @param adUnitId 
     */
    stopAutoRefresh(adUnitId: string): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * 
     */
    removeAdLoadedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * 
     */
    removeAdLoadFailedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addAdClickedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * 
     */
    removeAdClickedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is collapsed.
     * 
     * @param listener 
     */
    addAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * 
     */
    removeAdCollapsedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is expanded.
     * 
     * @param listener 
     */
    addAdExpandedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * 
     */
    removeAdExpandedEventListener(): void;

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void;

    /**
     * 
     */
    removeAdRevenuePaidListener(): void;
}
