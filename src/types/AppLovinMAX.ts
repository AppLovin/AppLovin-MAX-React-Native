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
     * Show the loaded interstitial ad, optionallly for a given placement and custom data to tie ad events to.
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
     * 
     * @param listener 
     */
    addInterstitialLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addInterstitialLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addInterstitialClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addInterstitialDisplayedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addInterstitialAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addInterstitialHiddenEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addInterstitialAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    /**
     * 
     */
    removeInterstitialLoadedEventListener(): void

    /**
     * 
     */
    removeInterstitialLoadFailedEventListener(): void

    /**
     * 
     */
    removeInterstitialClickedEventListener(): void

    /**
     * 
     */
    removeInterstitialDisplayedEventListener(): void

    /**
     * 
     */
    removeInterstitialAdFailedToDisplayEventListener(): void

    /**
     * 
     */
    removeInterstitialHiddenEventListener(): void

    /**
     * 
     */
    removeInterstitialAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* Rewarded */
    /**********************************************************************************/

    /**
     * 
     * @param adUnitId 
     */
    loadRewardedAd(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    isRewardedAdReady(adUnitId: string): Promise<boolean>

    /**
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showRewardedAd(adUnitId: string, placement?: string | null, customData?: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setRewardedAdExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setRewardedAdLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdFailedToDisplayEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdHiddenEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdReceivedRewardEventListener(listener: AdEventListener<AdRewardInfo>): void

    /**
     * 
     * @param listener 
     */
    addRewardedAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    /**
     * 
     */
    removeRewardedAdLoadedEventListener(): void

    /**
     * 
     */
    removeRewardedAdLoadFailedEventListener(): void

    /**
     * 
     */
    removeRewardedAdClickedEventListener(): void

    /**
     * 
     */
    removeRewardedAdDisplayedEventListener(): void

    /**
     * 
     */
    removeRewardedAdFailedToDisplayEventListener(): void

    /**
     * 
     */
    removeRewardedAdHiddenEventListener(): void

    /**
     * 
     */
    removeRewardedAdReceivedRewardEventListener(): void

    /**
     * 
     */
    removeRewardedAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* AppOpen */
    /**********************************************************************************/

    /**
     * 
     * @param adUnitId 
     */
    loadAppOpenAd(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    isAppOpenAdReady(adUnitId: string): Promise<boolean>

    /**
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showAppOpenAd(adUnitId: string, placement?: string | null, customData?: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setAppOpenAdExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setAppOpenAdLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdDisplayedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdFailedToDisplayEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdHiddenEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addAppOpenAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    /**
     * 
     */
    removeAppOpenAdLoadedEventListener(): void

    /**
     * 
     */
    removeAppOpenAdLoadFailedEventListener(): void

    /**
     * 
     */
    removeAppOpenAdClickedEventListener(): void

    /**
     * 
     */
    removeAppOpenAdDisplayedEventListener(): void

    /**
     * 
     */
    removeAppOpenAdFailedToDisplayEventListener(): void

    /**
     * 
     */
    removeAppOpenAdHiddenEventListener(): void

    /**
     * 
     */
    removeAppOpenAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* Banner */
    /**********************************************************************************/

    /**
     * 
     * @param adUnitId 
     * @param position 
     */
    createBanner(adUnitId: string, position: AdViewPosition): void

    /**
     * 
     * @param adUnitId 
     * @param position 
     * @param xOffset 
     * @param yOffset 
     */
    createBannerWithOffsets(adUnitId: string, position: AdViewPosition, xOffset: number, yOffset: number): void

    /**
     * 
     * @param adUnitId 
     * @param hexColorCode 
     */
    setBannerBackgroundColor(adUnitId: string, hexColorCode: string): void

    /**
     * 
     * @param adUnitId 
     * @param placement 
     */
    setBannerPlacement(adUnitId: string, placement: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param customData 
     */
    setBannerCustomData(adUnitId: string, customData: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param width 
     */
    setBannerWidth(adUnitId: string, width: number): void

    /**
     * 
     * @param adUnitId 
     * @param bannerPosition 
     */
    updateBannerPosition(adUnitId: string, bannerPosition: AdViewPosition): void

    /**
     * 
     * @param adUnitId 
     * @param xOffset 
     * @param yOffset 
     */
    updateBannerOffsets(adUnitId: string, xOffset: number, yOffset: number): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setBannerExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setBannerLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * 
     * @param adUnitId 
     */
    startBannerAutoRefresh(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    stopBannerAutoRefresh(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    showBanner(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    hideBanner(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    destroyBanner(adUnitId: string): void

    /**
     * 
     * @param width 
     */
    getAdaptiveBannerHeightForWidth(width: number): Promise<number>

    /**
     * 
     * @param listener 
     */
    addBannerAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addBannerAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addBannerAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addBannerAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addBannerAdExpandedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addBannerAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    /**
     * 
     */
    removeBannerAdLoadedEventListener(): void

    /**
     * 
     */
    removeBannerAdLoadFailedEventListener(): void

    /**
     * 
     */
    removeBannerAdClickedEventListener(): void

    /**
     * 
     */
    removeBannerAdCollapsedEventListener(): void

    /**
     * 
     */
    removeBannerAdExpandedEventListener(): void

    /**
     * 
     */
    removeBannerAdRevenuePaidListener(): void

    /**********************************************************************************/
    /* MREC */
    /**********************************************************************************/

    /**
     * 
     * @param adUnitId 
     * @param position 
     */
    createMRec(adUnitId: string, position: AdViewPosition): void

    /**
     * 
     * @param adUnitId 
     * @param position 
     * @param xOffset 
     * @param yOffset 
     */
    createMRecWithOffsets(adUnitId: string, position: AdViewPosition, xOffset: number, yOffset: number): void

    /**
     * 
     * @param adUnitId 
     * @param hexColorCode 
     */
    setMRecBackgroundColor(adUnitId: string, hexColorCode: string): void

    /**
     * 
     * @param adUnitId 
     * @param placement 
     */
    setMRecPlacement(adUnitId: string, placement: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param customData 
     */
    setMRecCustomData(adUnitId: string, customData: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param width 
     */
    setMRecWidth(adUnitId: string, width: number): void

    /**
     * 
     * @param adUnitId 
     * @param MRecPosition 
     */
    updateMRecPosition(adUnitId: string, MRecPosition: AdViewPosition): void

    /**
     * 
     * @param adUnitId 
     * @param xOffset 
     * @param yOffset 
     */
    updateMRecOffsets(adUnitId: string, xOffset: number, yOffset: number): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setMRecExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setMRecLocalExtraParameter(adUnitId: string, key: string, value: any): void

    /**
     * 
     * @param adUnitId 
     */
    startMRecAutoRefresh(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    stopMRecAutoRefresh(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    showMRec(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    hideMRec(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    destroyMRec(adUnitId: string): void

    /**
     * 
     * @param listener 
     */
    addMRecAdLoadedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addMRecAdLoadFailedEventListener(listener: AdEventListener<AdLoadFailedInfo>): void

    /**
     * 
     * @param listener 
     */
    addMRecAdClickedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addMRecAdCollapsedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addMRecAdExpandedEventListener(listener: AdEventListener<AdInfo>): void

    /**
     * 
     * @param listener 
     */
    addMRecAdRevenuePaidListener(listener: AdEventListener<AdRevenueInfo>): void

    /**
     * 
     */
    removeMRecAdLoadedEventListener(): void

    /**
     * 
     */
    removeMRecAdLoadFailedEventListener(): void

    /**
     * 
     */
    removeMRecAdClickedEventListener(): void

    /**
     * 
     */
    removeMRecAdCollapsedEventListener(): void

    /**
     * 
     */
    removeMRecAdExpandedEventListener(): void

    /**
     * 
     */
    removeMRecAdRevenuePaidListener(): void
}
