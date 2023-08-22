import { AdViewPosition } from "./AdViewPosition";
import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdDisplayFailedInfo, AdRewardInfo } from "./AdInfo";

/**
 * The SDK configuration.
 */
export interface Configuration {

    /**
     * The country code of this user. 
     */
    countryCode: string;
}

export type AppLovinMAXType = {

    /**********************************************************************************/
    /* General */
    /**********************************************************************************/

    /**
     * Whether the SDK has fully been initialized without errors and the completion callback called.
     */
    isInitialized(): Promise<boolean>

    /**
     * Initializes the SDK, and returns Configuration when it finishes initializing.
     * 
     * @param sdkKey 
     */
    initialize(sdkKey: string): Promise<Configuration>

    /**
     * Presents the mediation debugger UI.
     */
    showMediationDebugger(): void

    /**
     * Whether this device is a tablet.
     */
    isTablet(): Promise<boolean>

    /**
     * Sets an id for the current user.  This identifier will be tied to SDK events and AppLovin’s
     * optional S2S postbacks.
     * 
     * @param userId 
     */
    setUserId(userId: string): void

    /**
     * Sets a muted state or not for beginning video ads.
     *
     * @param muted 
     */
    setMuted(muted: boolean): void

    /**
     * Whether to begin video ads in a muted state or not.
     */
    isMuted(): Promise<boolean>

    /**
     * A toggle for verbose logging for the SDK.
     *
     * @param verboseLoggingEnabled 
     */
    setVerboseLogging(verboseLoggingEnabled: boolean): void

    /**
     * Enable devices to receive test ads by passing in the advertising identifier (IDFA) of each
     * test device.  Refer to AppLovin logs for the IDFA of your current device.
     * 
     * @param advertisingIds 
     */
    setTestDeviceAdvertisingIds(advertisingIds: string[]): void

    /**
     * Whether the Creative Debugger will be displayed after flipping the device screen down twice.
     *
     * @param enabled 
     */
    setCreativeDebuggerEnabled(enabled: boolean): void

    /**
     * Set an extra parameter to pass to the AppLovin server.
     * 
     * @param key 
     * @param value 
     */
    setExtraParameter(key: string, value: string | null): void

    /**
     * Whether or not the SDK will collect the device location.
     *
     * @param enabled 
     */
    setLocationCollectionEnabled(enabled: boolean): Promise<void>

    /**********************************************************************************/
    /* Privacy */
    /**********************************************************************************/

    /**
     * 
     */
    showConsentDialog(): Promise<void>

    /**
     * Sets whether or not the user has provided consent for information-sharing with AppLovin.
     * 
     * @param hasUserConsent 
     */
    setHasUserConsent(hasUserConsent: boolean): void

    /**
     * Checks if user has set consent for information sharing.
     */
    hasUserConsent(): Promise<boolean>

    /**
     * Marks the user as age-restricted (i.e. under 16).
     * 
     * @param isAgeRestrictedUser 
     */
    setIsAgeRestrictedUser(isAgeRestrictedUser: boolean): void

    /**
     * Checks if the user is age-restricted.
     */
    isAgeRestrictedUser(): Promise<boolean>

    /**
     * Sets whether or not the user has opted out of the sale of their personal information.
     * 
     * @param doNotSell 
     */
    setDoNotSell(doNotSell: boolean): void

    /**
     * Checks if the user has opted out of the sale of their personal information.
     */
    isDoNotSell(): Promise<boolean>

    /**********************************************************************************/
    /* TERM FLow */
    /**********************************************************************************/

    /**
     * Enable the Terms Flow.
     *
     * @param enabled 
     */
    setConsentFlowEnabled(enabled: boolean): Promise<void>

    /**
     * URL for your company’s privacy policy. This is required in order to enable the Terms Flow.
     * 
     * @param urlString 
     */
    setPrivacyPolicyUrl(urlString: string): Promise<void>

    /**
     * URL for your company’s terms of service. This is optional; you can enable the Terms Flow with
     * or without it.
     * 
     * @param urlString 
     */
    setTermsOfServiceUrl(urlString: string): Promise<void>

    /**********************************************************************************/
    /* Interstitial */
    /**********************************************************************************/

    /**
     * Loads an interstitial ad.
     * 
     * @param adUnitId 
     */
    loadInterstitial(adUnitId: string): void

    /**
     * Whether or not this ad is ready to be shown.
     * 
     * @param adUnitId 
     */
    isInterstitialReady(adUnitId: string): Promise<boolean>

    /**
     * Show the loaded interstitial ad, optionallly for a given placement and custom data to tie ad
     * events to.
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showInterstitial(adUnitId: string, placement?: string | null, customData?: string | null): void

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setInterstitialExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * Set a local extra parameter to pass to the adapter instances.
     *
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setInterstitialLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addInterstitialLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addInterstitialLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addInterstitialClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is displayed.
     * 
     * @param listener 
     */
    addInterstitialDisplayedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdDisplayFailedInfo` when the ad is failed to
     * display.
     * 
     * @param listener 
     */
    addInterstitialAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is hidden.
     * 
     * @param listener 
     */
    addInterstitialHiddenEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addInterstitialAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    removeInterstitialLoadedEventListener(): void

    removeInterstitialLoadFailedEventListener(): void

    removeInterstitialClickedEventListener(): void

    removeInterstitialDisplayedEventListener(): void

    removeInterstitialAdFailedToDisplayEventListener(): void

    removeInterstitialHiddenEventListener(): void

    removeInterstitialAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* Rewarded */
    /**********************************************************************************/

    /**
     * Loads an rewarded ad.
     * 
     * @param adUnitId 
     */
    loadRewardedAd(adUnitId: string): void

    /**
     * Whether or not this ad is ready to be shown.
     * 
     * @param adUnitId 
     */
    isRewardedAdReady(adUnitId: string): Promise<boolean>

    /**
     * Show the loaded rewarded ad, optionallly for a given placement and custom data to tie ad
     * events to.
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showRewardedAd(adUnitId: string, placement?: string | null, customData?: string | null): void

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setRewardedAdExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * Set a local extra parameter to pass to the adapter instances.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setRewardedAdLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     *
     * @param listener 
     */
    addRewardedAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addRewardedAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addRewardedAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is displayed.
     * 
     * @param listener 
     */
    addRewardedAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdDisplayFailedInfo` when the ad is failed to
     * display.
     * 
     * @param listener 
     */
    addRewardedAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is hidden.
     * 
     * @param listener 
     */
    addRewardedAdHiddenEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdRewardInfo` when the ad is rewarded.
     * 
     * @param listener 
     */
    addRewardedAdReceivedRewardEventListener(listener: AdEventListener<AdRewardInfo>): void

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addRewardedAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    removeRewardedAdLoadedEventListener(): void

    removeRewardedAdLoadFailedEventListener(): void

    removeRewardedAdClickedEventListener(): void

    removeRewardedAdDisplayedEventListener(): void

    removeRewardedAdFailedToDisplayEventListener(): void

    removeRewardedAdHiddenEventListener(): void

    removeRewardedAdReceivedRewardEventListener(): void

    removeRewardedAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* AppOpen */
    /**********************************************************************************/

    /**
     * Loads an app open ad.
     * 
     * @param adUnitId 
     */
    loadAppOpenAd(adUnitId: string): void

    /**
     * Whether or not this ad is ready to be shown.
     * 
     * @param adUnitId 
     */
    isAppOpenAdReady(adUnitId: string): Promise<boolean>

    /**
     * Show the loaded app open ad, optionallly for a given placement and custom data to tie ad
     * events to.
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showAppOpenAd(adUnitId: string, placement?: string | null, customData?: string | null): void

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setAppOpenAdExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * Set a local extra parameter to pass to the adapter instances.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setAppOpenAdLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addAppOpenAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addAppOpenAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addAppOpenAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is displayed.
     * 
     * @param listener 
     */
    addAppOpenAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdDisplayFailedInfo` when the ad is failed to
     * display.
     * 
     * @param listener 
     */
    addAppOpenAdFailedToDisplayEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is hidden.
     * 
     * @param listener 
     */
    addAppOpenAdHiddenEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addAppOpenAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    removeAppOpenAdLoadedEventListener(): void

    removeAppOpenAdLoadFailedEventListener(): void

    removeAppOpenAdClickedEventListener(): void

    removeAppOpenAdDisplayedEventListener(): void

    removeAppOpenAdFailedToDisplayEventListener(): void

    removeAppOpenAdHiddenEventListener(): void

    removeAppOpenAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* Banner */
    /**********************************************************************************/

    /**
     * Creates a banner at the specified position.
     * 
     * @param adUnitId 
     * @param position 
     */
    createBanner(adUnitId: string, position: AdViewPosition): void

    /**
     * Creates a banner at the specified position and offsets.
     * 
     * @param adUnitId 
     * @param position 
     * @param xOffset 
     * @param yOffset 
     */
    createBannerWithOffsets(adUnitId: string, position: AdViewPosition, xOffset: number, yOffset: number): void

    /**
     * Sets a background color for the banner.  
     * 
     * @param adUnitId 
     * @param hexColorCode a hexadecimal color.
     */
    setBannerBackgroundColor(adUnitId: string, hexColorCode: string): void

    /**
     * Sets a placement to tie the showing ad’s events to.
     *
     * @param adUnitId 
     * @param placement 
     */
    setBannerPlacement(adUnitId: string, placement: string | null): void

    /**
     * Sets custom data to tie the showing ad’s events to.
     * 
     * @param adUnitId 
     * @param customData 
     */
    setBannerCustomData(adUnitId: string, customData: string | null): void

    /**
     * Sets the banner width.
     * 
     * @param adUnitId 
     * @param width 
     */
    setBannerWidth(adUnitId: string, width: number): void

    /**
     * Updates the banner position.
     * 
     * @param adUnitId 
     * @param bannerPosition 
     */
    updateBannerPosition(adUnitId: string, bannerPosition: AdViewPosition): void

    /**
     * Updates the banner position offsets.
     * 
     * @param adUnitId 
     * @param xOffset 
     * @param yOffset 
     */
    updateBannerOffsets(adUnitId: string, xOffset: number, yOffset: number): void

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setBannerExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * Set a local extra parameter to pass to the adapter instances.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setBannerLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * Starts or resumes auto-refreshing of the banner.
     * 
     * @param adUnitId 
     */
    startBannerAutoRefresh(adUnitId: string): void

    /**
     * Pauses auto-refreshing of the banner.
     * 
     * @param adUnitId 
     */
    stopBannerAutoRefresh(adUnitId: string): void

    /**
     * Shows the banner.
     * 
     * @param adUnitId 
     */
    showBanner(adUnitId: string): void

    /**
     * Hides the banner.
     * 
     * @param adUnitId 
     */
    hideBanner(adUnitId: string): void

    /**
     * Destroys the banner.
     * 
     * @param adUnitId 
     */
    destroyBanner(adUnitId: string): void

    /**
     * Gets the adaptive banner size for the provided width at the current orientation.
     * 
     * @param width 
     */
    getAdaptiveBannerHeightForWidth(width: number): Promise<number>

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addBannerAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addBannerAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addBannerAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is collapsed.
     * 
     * @param listener 
     */
    addBannerAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is expanded.
     * 
     * @param listener 
     */
    addBannerAdExpandedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addBannerAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    removeBannerAdLoadedEventListener(): void

    removeBannerAdLoadFailedEventListener(): void

    removeBannerAdClickedEventListener(): void

    removeBannerAdCollapsedEventListener(): void

    removeBannerAdExpandedEventListener(): void

    removeBannerAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* MREC */
    /**********************************************************************************/

    /**
     * Creates an MREC at the specified position.
     * 
     * @param adUnitId 
     * @param position 
     */
    createMRec(adUnitId: string, position: AdViewPosition): void

    /**
     * Creates an MREC at the specified position and offsets.
     * 
     * @param adUnitId 
     * @param position 
     * @param xOffset 
     * @param yOffset 
     */
    createMRecWithOffsets(adUnitId: string, position: AdViewPosition, xOffset: number, yOffset: number): void

    /**
     * Sets a background color for the MREC.  
     * 
     * @param adUnitId 
     * @param hexColorCode 
     */
    setMRecBackgroundColor(adUnitId: string, hexColorCode: string): void

    /**
     * Sets a placement to tie the showing ad’s events to.
     * 
     * @param adUnitId 
     * @param placement 
     */
    setMRecPlacement(adUnitId: string, placement: string | null): void

    /**
     * Sets custom data to tie the showing ad’s events to.
     * 
     * @param adUnitId 
     * @param customData 
     */
    setMRecCustomData(adUnitId: string, customData: string | null): void

    /**
     * Sets the MREC width.
     * 
     * @param adUnitId 
     * @param width 
     */
    setMRecWidth(adUnitId: string, width: number): void

    /**
     * Updates the MREC position.
     * 
     * @param adUnitId 
     * @param MRecPosition 
     */
    updateMRecPosition(adUnitId: string, MRecPosition: AdViewPosition): void

    /**
     * Updates the MREC position offsets.
     * 
     * @param adUnitId 
     * @param xOffset 
     * @param yOffset 
     */
    updateMRecOffsets(adUnitId: string, xOffset: number, yOffset: number): void

    /**
     * Sets an extra key/value parameter for the ad.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setMRecExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * Set a local extra parameter to pass to the adapter instances.
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setMRecLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * Starts or resumes auto-refreshing of the MREC.
     * 
     * @param adUnitId 
     */
    startMRecAutoRefresh(adUnitId: string): void

    /**
     * Pauses auto-refreshing of the MREC.
     * 
     * @param adUnitId 
     */
    stopMRecAutoRefresh(adUnitId: string): void

    /**
     * Shows the MREC.
     * 
     * @param adUnitId 
     */
    showMRec(adUnitId: string): void

    /**
     * Hides the MREC.
     * 
     * @param adUnitId 
     */
    hideMRec(adUnitId: string): void

    /**
     * Destroys the MREC.
     * 
     * @param adUnitId 
     */
    destroyMRec(adUnitId: string): void

    /**
     * Adds the specified event listener to receive `AdInfo` when a new ad has been loaded.
     * 
     * @param listener 
     */
    addMRecAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdLoadFailedInfo` when an ad could not be loaded.
     * 
     * @param listener 
     */
    addMRecAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is clicked.
     * 
     * @param listener 
     */
    addMRecAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is collapsed.
     * 
     * @param listener 
     */
    addMRecAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdInfo` when the ad is expanded.
     * 
     * @param listener 
     */
    addMRecAdExpandedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * Adds the specified event listener to receive `AdRevenueInfo` when the ad revenue is paid.
     * 
     * @param listener 
     */
    addMRecAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    removeMRecAdLoadedEventListener(): void

    removeMRecAdLoadFailedEventListener(): void

    removeMRecAdClickedEventListener(): void

    removeMRecAdCollapsedEventListener(): void

    removeMRecAdExpandedEventListener(): void

    removeMRecAdRevenuePaidListener(): void
}
