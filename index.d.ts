declare module 'react-native-applovin-max' {
  import React from 'react'
  import {ColorValue, StyleProp, ViewStyle} from 'react-native'

  enum AdFormat {
    BANNER = 'banner',
    MREC = 'mrec',
  }

  enum AdViewPosition {
    TOP_CENTER = 'top_center',
    TOP_RIGHT = 'top_right',
    CENTERED = 'centered',
    CENTER_LEFT = 'center_left',
    CENTER_RIGHT = 'center_right',
    BOTTOM_LEFT = 'bottom_left',
    BOTTOM_CENTER = 'bottom_center',
    BOTTOM_RIGHT = 'bottom_right',
  }

  enum ConsentDialogState {
    UNKNOWN = 0,
    APPLIES = 1,
    DOES_NOT_APPLY = 2,
  }

  type AdEventInfo =
    | 'OnBannerAdLoadedEvent'
    | 'OnBannerAdClickedEvent'
    | 'OnBannerAdExpandedEvent'
    | 'OnBannerAdCollapsedEvent'
  export type AdInfo = {
    adUnitId: string
    creativeId: string
    networkName: string
    placement: AdViewPosition
    revenue: number
  }
  type AdEventError = 'OnBannerAdLoadFailedEvent'
  export type AdInfoError = Error & {
    code: string
    message: string
  }

  interface AdViewProps {
    adUnitId: string
    adFormat: AdFormat
    placement: AdViewPosition
    style?: StyleProp<ViewStyle>
  }
  type Configuration = {
    consentDialogState: 0 | 1 | 2
    countryCode: string
  }

  function addEventListener(eventName: AdEventInfo, callback: (info: AdInfo) => void): void
  function addEventListener(eventName: AdEventError, callback: (info: AdInfoError) => void): void

  interface AppLovinMAXInterface {
    AdFormat: typeof AdFormat
    AdView: React.FunctionComponent<AdViewProps>
    AdViewPosition: typeof AdViewPosition
    ConsentDialogState: typeof ConsentDialogState
    addEventListener: typeof addEventListener
    removeEventListener: (eventName: AdEventInfo | AdEventError) => void

    /*----------------*/
    /* INITIALIZATION */
    /*----------------*/
    isInitialized: () => void
    initialize: (apiKey: string, callback: (configuration: Configuration) => void) => void
    showMediationDebugger: () => void

    /*--------------*/
    /* PRIVACY APIs */
    /*--------------*/
    getConsentDialogState: () => ConsentDialogState
    setHasUserConsent: (hasUserConsent: boolean) => void
    hasUserConsent: () => boolean
    setIsAgeRestrictedUser: (isAgeRestrictedUser: boolean) => void
    isAgeRestrictedUser: () => boolean
    setDoNotSell: (doNotSell: boolean) => void
    isDoNotSell: () => boolean

    /*--------------------*/
    /* GENERAL PUBLIC API */
    /*--------------------*/
    isTablet: () => boolean
    setUserId: (userId: string) => void
    setMuted: (muted: boolean) => void
    isMuted: () => boolean
    setVerboseLogging: (verboseLoggingEnabled: boolean) => void
    setTestDeviceAdvertisingIds: (advertisingIds: string[]) => void
    setCreativeDebuggerEnabled: (enabled: boolean) => void
    setConsentFlowEnabled: (enabled: boolean) => void
    setPrivacyPolicyUrl: (urlString: string) => void
    setTermsOfServiceUrl: (urlString: string) => void

    /*----------------*/
    /* EVENT TRACKING */
    /*----------------*/
    trackEvent: (event: string, parameters: object) => void

    /*---------*/
    /* BANNERS */
    /*---------*/
    createBanner: (adUnitId: string, bannerPosition: AdViewPosition) => void
    createBannerWithOffsets: (
      adUnitId: string,
      bannerPosition: AdViewPosition,
      xOffset: number,
      yOffset: number,
    ) => void
    setBannerBackgroundColor: (adUnitId: string, hexColorCode: ColorValue) => void
    setBannerPlacement: (adUnitId: string, placement) => void
    setBannerWidth: (adUnitId: string, width) => void
    updateBannerPosition: (adUnitId: string, bannerPosition: AdViewPosition) => void
    updateBannerOffsets: (adUnitId: string, xOffset, yOffset) => void
    setBannerExtraParameter: (adUnitId: string, key, value) => void
    showBanner: (adUnitId: string) => void
    hideBanner: (adUnitId: string) => void
    destroyBanner: (adUnitId: string) => void
    getAdaptiveBannerHeightForWidth: (width: -1 | number) => number

    /*-------*/
    /* MRECS */
    /*-------*/
    createMRec: (adUnitId: string, mrecPosition) => void
    setMRecBackgroundColor: (adUnitId: string, hexColorCode: ColorValue) => void
    setMRecPlacement: (adUnitId: string, placement: AdViewPosition) => void
    updateMRecPosition: (adUnitId: string, mrecPosition: AdViewPosition) => void
    setMRecExtraParameter: (adUnitId: string, key, value) => void
    showMRec: (adUnitId: string) => void
    hideMRec: (adUnitId: string) => void
    destroyMRec: (adUnitId: string) => void

    /*---------------*/
    /* INTERSTITIALS */
    /*---------------*/
    loadInterstitial: (adUnitId: string) => void
    isInterstitialReady: (adUnitId: string) => void
    showInterstitial: (adUnitId: string, placement) => void
    setInterstitialExtraParameter: (adUnitId: string, key, value) => void

    /*----------*/
    /* REWARDED */
    /*----------*/
    loadRewardedAd: (adUnitId: string) => void
    isRewardedAdReady: (adUnitId: string) => void
    showRewardedAd: (adUnitId: string, placement) => void
    setRewardedAdExtraParameter: (adUnitId: string, key, value) => void
  }
  const AppLovinMAX: AppLovinMAXInterface
  export default AppLovinMAX
}
