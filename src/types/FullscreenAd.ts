import type { AdEventListener } from './AdEvent';
import type { AdInfo, AdLoadFailedInfo, AdDisplayFailedInfo } from './AdInfo';
import type { LocalExtraParameterValue } from './AdProps';

/**
 * Defines a full-screen ad (i.e Intestitial / Rewarded / AppOpen)
 */
export type FullscreenAdType = {
    /**
     * Whether or not this ad is ready to be shown.
     *
     * @param adUnitId The ad unit ID of the ad to check whether it is ready to be shown.
     */
    isAdReady(adUnitId: string): Promise<boolean>;

    /**
     * Loads an interstitial ad.
     *
     * @param adUnitId The ad unit ID to load an ad for.
     */
    loadAd(adUnitId: string): void;

    /**
     * Shows the loaded interstitial ad, optionallly for a given placement and custom data to tie ad
     * events to.
     *
     * @param adUnitId The ad unit ID of the ad to show.
     * @param placement The placement to tie the showing ad's events to.
     * @param customData The custom data to tie the showing ad's events to. Maximum size is 8KB.
     */
    showAd(adUnitId: string, placement?: string | null, customData?: string | null): void;

    /**
     * Sets an extra key/value parameter for the ad.
     *
     * @param adUnitId The ad unit ID of the ad to set a parameter for.
     * @param key Parameter key.
     * @param value Parameter value.
     */
    setExtraParameter(adUnitId: string, key: string, value: string | null): void;

    /**
     * Sets a local extra parameter to pass to the adapter instances.
     *
     * @param adUnitId The ad unit ID of the ad to set a local parameter for.
     * @param key Parameter key.
     * @param value Parameter value.
     */
    setLocalExtraParameter(adUnitId: string, key: string, value: LocalExtraParameterValue): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when a full-screen ad loads a new ad.
     *
     * @param listener Listener to be notified.
     */
    addAdLoadedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a full-screen ad loads a new ad.
     */
    removeAdLoadedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdLoadFailedInfo} when a full-screen ad
     * could not load a new ad.
     *
     * @param listener Listener to be notified.
     */
    addAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void;

    /**
     * Removes the event listener to receive {@ link adLoadFailedInfo} when a full-screen ad could
     * not load a new ad.
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
     * Adds the specified event listener to receive {@link AdInfo} when a full-screen ad displays the ad.
     *
     * @param listener Listener to be notified.
     */
    addAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a full-screen ad displays the ad.
     */
    removeAdDisplayedEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdDisplayFailedInfo} when a full-screen
     * ad fails to display the ad.
     *
     * @param listener Listener to be notified.
     */
    addAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void;

    /**
     * Removes the event listener to receive {@link AdDisplayFailedInfo} when a full-screen ad
     * fails to display the ad.
     */
    removeAdFailedToDisplayEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when a full-screen ad hides the
     * ad.
     *
     * @param listener Listener to be notified.
     */
    addAdHiddenEventListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a full-screen ad hides the ad.
     */
    removeAdHiddenEventListener(): void;

    /**
     * Adds the specified event listener to receive {@link AdInfo} when a full-screen ad
     * pays ad revenue to the publisher.
     *
     * @param listener Listener to be notified.
     */
    addAdRevenuePaidListener(listener: AdEventListener<AdInfo>): void;

    /**
     * Removes the event listener to receive {@link AdInfo} when a full-screen ad pays
     * ad revenue to the publisher.
     */
    removeAdRevenuePaidListener(): void;
};
