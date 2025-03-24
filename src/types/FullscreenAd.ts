import type { AdEventListener } from './AdEvent';
import type { AdInfo, AdLoadFailedInfo, AdDisplayFailedInfo } from './AdInfo';
import type { LocalExtraParameterValue } from './AdProps';

/**
 * Defines the interface for managing full-screen ads such as Interstitial, Rewarded, and AppOpen ads.
 */
export type FullscreenAdType = {
    /**
     * Checks whether an ad is ready to be shown.
     *
     * @param adUnitId - The ad unit ID to check.
     * @returns A promise that resolves to `true` if the ad is ready.
     */
    isAdReady(adUnitId: string): Promise<boolean>;

    /**
     * Loads a full-screen ad for the given ad unit ID.
     *
     * @param adUnitId - The ad unit ID to load.
     */
    loadAd(adUnitId: string): void;

    /**
     * Shows a loaded full-screen ad.
     *
     * @param adUnitId - The ad unit ID of the ad to show.
     * @param placement - Optional placement name for event reporting.
     * @param customData - Optional custom string data (max size: 8 KB).
     */
    showAd(adUnitId: string, placement?: string | null, customData?: string | null): void;

    /**
     * Sets an extra parameter to pass to the SDK for the specified ad unit.
     *
     * @param adUnitId - The ad unit ID.
     * @param key - The parameter name.
     * @param value - The parameter value or `null` to clear it.
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Sets a local extra parameter to pass to the adapter for the specified ad unit.
     *
     * @param adUnitId - The ad unit ID.
     * @param key - The parameter name.
     * @param value - The parameter value (string, number, boolean, object, or null).
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: LocalExtraParameterValue): void;

    /**
     * Registers a listener for when an ad is successfully loaded.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad loaded listener.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Registers a listener for when an ad fails to load.
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
     * Registers a listener for when an ad is displayed.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad display listener.
     */
    removeAdDisplayedEventListener(): void;

    /**
     * Registers a listener for when an ad fails to display.
     *
     * @param listener - Callback to be notified with {@link AdDisplayFailedInfo}.
     */
    addAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void;

    /**
     * Unregisters the ad display failure listener.
     */
    removeAdFailedToDisplayEventListener(): void;

    /**
     * Registers a listener for when an ad is hidden (dismissed).
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdHiddenEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad hidden listener.
     */
    removeAdHiddenEventListener(): void;

    /**
     * Registers a listener for when ad revenue is paid.
     *
     * @param listener - Callback to be notified with {@link AdInfo}.
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Unregisters the ad revenue paid listener.
     */
    removeAdRevenuePaidListener(): void;
};
