import { AdViewPosition } from "./AdViewPosition";
import type { AdEventListener } from "./AdEvent";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdDisplayFailedInfo, AdRewardInfo } from "./AdInfo";

/**
 * The SDK configuration.
 */
export type Configuration = {

    /**
     * The country code of this user. 
     */
    countryCode: string
}

export type AppLovinMAXType = {

    /**********************************************************************************/
    /* General */
    /**********************************************************************************/

    /**
     * 
     */
    isInitialized(): Promise<boolean>

    /**
     * Initializes the SDK, and returns Configuration when it finishes initializing.
     * 
     * @param sdkKey 
     */
    initialize(sdkKey: string): Promise<Configuration>

    /**
     * 
     */
    showMediationDebugger(): void

    /**
     * 
     */
    isTablet(): Promise<boolean>

    /**
     * 
     * @param userId 
     */
    setUserId(userId: string): void

    /**
     * 
     * @param muted 
     */
    setMuted(muted: boolean): void

    /**
     * 
     */
    isMuted(): Promise<boolean>

    /**
     * 
     * @param verboseLoggingEnabled 
     */
    setVerboseLogging(verboseLoggingEnabled: boolean): void

    /**
     * 
     * @param advertisingIds 
     */
    setTestDeviceAdvertisingIds(advertisingIds: string[]): void

    /**
     * 
     * @param enabled 
     */
    setCreativeDebuggerEnabled(enabled: boolean): void

    /**
     * 
     * @param key 
     * @param value 
     */
    setExtraParameter(key: string, value: string | null): void

    /**********************************************************************************/
    /* Targeting Data */
    /**********************************************************************************/

    /**
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
     * 
     * @param hasUserConsent 
     */
    setHasUserConsent(hasUserConsent: boolean): void

    /**
     * 
     */
    hasUserConsent(): Promise<boolean>

    /**
     * 
     * @param isAgeRestrictedUser 
     */
    setIsAgeRestrictedUser(isAgeRestrictedUser: boolean): void

    /**
     * 
     */
    isAgeRestrictedUser(): Promise<boolean>

    /**
     * 
     * @param doNotSell 
     */
    setDoNotSell(doNotSell: boolean): void

    /**
     * 
     */
    isDoNotSell(): Promise<boolean>

    /**********************************************************************************/
    /* TERM FLow */
    /**********************************************************************************/

    /**
     * 
     * @param enabled 
     */
    setConsentFlowEnabled(enabled: boolean): Promise<void>

    /**
     * 
     * @param urlString 
     */
    setPrivacyPolicyUrl(urlString: string): Promise<void>

    /**
     * 
     * @param urlString 
     */
    setTermsOfServiceUrl(urlString: string): Promise<void>

    /**********************************************************************************/
    /* Interstitial */
    /**********************************************************************************/

    /**
     * 
     * @param adUnitId 
     */
    loadInterstitial(adUnitId: string): void

    /**
     * 
     * @param adUnitId 
     */
    isInterstitialReady(adUnitId: string): Promise<boolean>

    /**
     * 
     * @param adUnitId 
     * @param placement 
     * @param customData 
     */
    showInterstitial(adUnitId: string, placement?: string | null, customData?: string | null): void

    /**
     * 
     * @param adUnitId 
     * @param key 
     * @param value 
     */
    setInterstitialExtraParameter(adUnitId: string, key: string, value: string | null): void

    /**
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
