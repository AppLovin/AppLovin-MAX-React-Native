import { NativeModules } from "react-native";
import AdView, { AdFormat, AdViewPosition } from "./AppLovinMAXAdView";
import { TargetingData, AdContentRating, UserGender } from "./TargetingData";
import NativeAdView from "./NativeAdView";
import EventListeners from "./AppLovinMAXEventListeners";

const { AppLovinMAX } = NativeModules;

const VERSION = "5.4.0";

/*---------*/
/* BANNERS */
/*---------*/

const setBannerExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setBannerExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setBannerExtraParameter(adUnitId, key, value);
}

const setBannerLocalExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setBannerLocalExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setBannerLocalExtraParameter(adUnitId, key, value);
}

/*-------*/
/* MRECS */
/*-------*/

const setMRecExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setMRecExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setMRecExtraParameter(adUnitId, key, value);
}

const setMRecLocalExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setMRecLocalExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setMRecLocalExtraParameter(adUnitId, key, value);
}

/*---------------*/
/* INTERSTITIALS */
/*---------------*/

const showInterstitial = (adUnitId, ...args) => {
  switch (args.length) {
  case 0:
    AppLovinMAX.showInterstitial(adUnitId, null, null);
    break;
  case 1:
    AppLovinMAX.showInterstitial(adUnitId, args[0], null);
    break;
  case 2:
    AppLovinMAX.showInterstitial(adUnitId, args[0], args[1]);
    break;
  default:
    // do nothing - unexpected number of arguments
    break;
  }
};

const setInterstitialExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setInterstitialExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setInterstitialExtraParameter(adUnitId, key, value);
}

const setInterstitialLocalExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setInterstitialLocalExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setInterstitialLocalExtraParameter(adUnitId, key, value);
}

/*----------*/
/* REWARDED */
/*----------*/

const showRewardedAd = (adUnitId, ...args) => {
  switch (args.length) {
  case 0:
    AppLovinMAX.showRewardedAd(adUnitId, null, null);
    break;
  case 1:
    AppLovinMAX.showRewardedAd(adUnitId, args[0], null);
    break;
  case 2:
    AppLovinMAX.showRewardedAd(adUnitId, args[0], args[1]);
    break;
  default:
    // do nothing - unexpected number of arguments
    break;
  }
};

const setRewardedAdExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setRewardedAdExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setRewardedAdExtraParameter(adUnitId, key, value);
}

const setRewardedAdLocalExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setRewardedAdLocalExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setRewardedAdLocalExtraParameter(adUnitId, key, value);
}

/*----------*/
/* APP OPEN */
/*----------*/

const showAppOpenAd = (adUnitId, ...args) => {
  switch (args.length) {
  case 0:
    AppLovinMAX.showAppOpenAd(adUnitId, null, null);
    break;
  case 1:
    AppLovinMAX.showAppOpenAd(adUnitId, args[0], null);
    break;
  case 2:
    AppLovinMAX.showAppOpenAd(adUnitId, args[0], args[1]);
    break;
  default:
    // do nothing - unexpected number of arguments
    break;
  }
};

const setAppOpenAdExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setAppOpenAdExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setAppOpenAdExtraParameter(adUnitId, key, value);
}

const setAppOpenAdLocalExtraParameter = (adUnitId, key, value) => {
  if ((value !== null) && (value !== undefined) && (typeof value !== 'string')) {
    console.warn("setAppOpenAdLocalExtraParameter() supports only string values: " + value);
    return;
  }

  AppLovinMAX.setAppOpenAdLocalExtraParameter(adUnitId, key, value);
}

export default {
  ...AppLovinMAX,
  ...EventListeners,
  AdView,
  get targetingData() {
    return TargetingData;
  },
  AdContentRating,
  UserGender,
  AdViewPosition,
  AdFormat,
  NativeAdView,
  initialize(sdkKey) {
    return AppLovinMAX.initialize(VERSION, sdkKey);
  },

  /*---------*/
  /* BANNERS */
  /*---------*/
  setBannerExtraParameter,
  setBannerLocalExtraParameter,

  /*-------*/
  /* MRECS */
  /*-------*/
  setMRecExtraParameter,
  setMRecLocalExtraParameter,

  /*---------------*/
  /* INTERSTITIALS */
  /*---------------*/
  showInterstitial,
  setInterstitialExtraParameter,
  setInterstitialLocalExtraParameter,

  /*----------*/
  /* REWARDED */
  /*----------*/
  showRewardedAd,
  setRewardedAdExtraParameter,
  setRewardedAdLocalExtraParameter,

  /*----------*/
  /* APP OPEN */
  /*----------*/
  showAppOpenAd,
  setAppOpenAdExtraParameter,
  setAppOpenAdLocalExtraParameter,

  /*----------------------*/
  /** AUTO-DECLARED APIs **/
  /*----------------------*/

  /*----------------*/
  /* INITIALIZATION */
  /*----------------*/
  /* isInitialized(promise) */
  /* initialize(pluginVersion, sdkKey, promise) */

  /*--------------*/
  /* PRIVACY APIs */
  /*--------------*/
  /* showConsentDialog(promise) */
  /* setHasUserConsent(hasUserConsent) */
  /* hasUserConsent(promise) */
  /* setIsAgeRestrictedUser(isAgeRestrictedUser) */
  /* isAgeRestrictedUser(promise) */
  /* setDoNotSell(doNotSell) */
  /* isDoNotSell(promise) */

  /*--------------------*/
  /* GENERAL PUBLIC API */
  /*--------------------*/
  /* showMediationDebugger() */
  /* isTablet(promise) */
  /* setUserId(userId) */
  /* setMuted(muted) */
  /* isMuted(promise) */
  /* setVerboseLogging(verboseLoggingEnabled) */
  /* setTestDeviceAdvertisingIds(advertisingIds) */
  /* setCreativeDebuggerEnabled(enabled) */
  /* setExtraParameter(key, value) */
  /* setConsentFlowEnabled(enabled) */
  /* setPrivacyPolicyUrl(urlString) */
  /* setTermsOfServiceUrl(urlString) */
  /* setLocationCollectionEnabled(locationCollectionEnabled) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* createBanner */
  /* createBannerWithOffsets */
  /* setBannerBackgroundColor */
  /* setBannerPlacement */
  /* setBannerWidth */
  /* updateBannerPosition */
  /* updateBannerOffsets */
  /* startBannerAutoRefresh */
  /* stopBannerAutoRefresh */
  /* showBanner */
  /* hideBanner */
  /* destroyBanner */

  /*-------*/
  /* MRECS */
  /*-------*/
  /* createMRec */
  /* setMRecBackgroundColor */
  /* setMRecPlacement */
  /* setMRecCustomData */
  /* updateMRecPosition */
  /* startMRecAutoRefresh */
  /* stopMRecAutoRefresh */
  /* showMRec */
  /* hideMRec */
  /* destroyMRec */

  /*---------------*/
  /* INTERSTITIALS */
  /*---------------*/
  /* loadInterstitial */
  /* isInterstitialReady */

  /*----------*/
  /* REWARDED */
  /*----------*/
  /* loadRewardedAd */
  /* isRewardedAdReady */

  /*----------*/
  /* APP OPEN */
  /*----------*/
  /* loadAppOpenAd */
  /* isAppOpenAdReady */

  /*----------------*/
  /* EVENT TRACKING */
  /*----------------*/
  /* trackEvent(event, parameters) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* getAdaptiveBannerHeightForWidth(width, promise) */
};
