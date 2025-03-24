import type { AdEventListener } from './AdEvent';
import type { AdInfo, AdLoadFailedInfo } from './AdInfo';
import type { LocalExtraParameterValue } from './AdProps';
import type { AdViewPosition } from '../AdView';

/**
 * Defines the interface for view-based ads such as Banners and MRECs.
 */
export type ViewAdType = {
    /**
     * Destroys the banner or MREC ad.
     *
     * @param adUnitId - The ad unit ID of the ad to destroy.
     */
    destroyAd(adUnitId: string): void;

    /**
     * Displays the banner or MREC ad.
     *
     * @param adUnitId - The ad unit ID of the ad to show.
     */
    showAd(adUnitId: string): void;

    /**
     * Hides the banner or MREC ad.
     *
     * @param adUnitId - The ad unit ID of the ad to hide.
     */
    hideAd(adUnitId: string): void;

    /**
     * Sets a placement to associate with the showing ad’s events.
     *
     * @param adUnitId - The ad unit ID.
     * @param placement - The placement name.
     */
    setPlacement(adUnitId: string, placement: string | null): void;

    /**
     * Sets custom data to associate with the showing ad’s events.
     *
     * @param adUnitId - The ad unit ID.
     * @param customData - Optional custom string (max 8 KB).
     */
    setCustomData(adUnitId: string, customData: string | null): void;

    /**
     * Updates the position of the banner or MREC.
     *
     * @param adUnitId - The ad unit ID.
     * @param bannerPosition - The new position on screen.
     */
    updatePosition(adUnitId: string, bannerPosition: AdViewPosition): void;

    /**
     * Sets an extra parameter for the ad.
     *
     * @param adUnitId - The ad unit ID.
     * @param key - Parameter name.
     * @param value - Parameter value (or `null` to clear it).
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Sets a local extra parameter to be passed to the mediation adapter.
     *
     * @param adUnitId - The ad unit ID.
     * @param key - Parameter name.
     * @param value - Parameter value (string, number, boolean, object, or null).
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: LocalExtraParameterValue): void;

    /**
     * Starts or resumes auto-refresh for the ad.
     *
     * @param adUnitId - The ad unit ID.
     */
    startAutoRefresh(adUnitId: string): void;

    /**
     * Pauses auto-refresh for the ad.
     *
     * @param adUnitId - The ad unit ID.
     */
    stopAutoRefresh(adUnitId: string): void;

    /**
     * Registers a listener for when a new ad is successfully loaded.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad loaded listener.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Registers a listener for when ad loading fails.
     *
     * @param listener - Callback to be notified with {@link AdLoadFailedInfo}.
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Unregisters the ad load failure listener.
     */
    removeAdLoadFailedEventListener(): void;

    /**
     * Registers a listener for ad click events.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdClickedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad click listener.
     */
    removeAdClickedEventListener(): void;

    /**
     * Registers a listener for when the ad collapses (e.g. after expansion).
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad collapsed listener.
     */
    removeAdCollapsedEventListener(): void;

    /**
     * Registers a listener for when the ad expands.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdExpandedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad expanded listener.
     */
    removeAdExpandedEventListener(): void;

    /**
     * Registers a listener for when the ad pays revenue to the publisher.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad revenue paid listener.
     */
    removeAdRevenuePaidListener(): void;
};
