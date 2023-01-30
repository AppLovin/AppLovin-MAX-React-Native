import { NativeModules, NativeEventEmitter } from "react-native";
import AdView, { AdFormat, AdViewPosition } from "./AppLovinMAXAdView";
import { TargetingData, AdContentRating, UserGender } from "./TargetingData";
import NativeAdView from "./NativeAdView";

const { AppLovinMAX } = NativeModules;

const VERSION = "4.1.5";

/**
 * This enum represents whether or not the consent dialog should be shown for this user.
 * The state where no such determination could be made is represented by `Unknown`.
 */
const ConsentDialogState = {
  /**
   * The consent dialog state could not be determined. This is likely due to SDK failing to initialize.
   */
  UNKNOWN: 0,

  /**
   * This user should be shown a consent dialog.
   */
  APPLIES: 1,

  /**
   * This user should not be shown a consent dialog.
   */
  DOES_NOT_APPLY: 2,
};

const emitter = new NativeEventEmitter(AppLovinMAX);
const subscriptions = {};

const addEventListener = (event, handler) => {
  let subscription = emitter.addListener(event, handler);
  let currentSubscription = subscriptions[event];
  if (currentSubscription) {
    currentSubscription.remove();
  }
  subscriptions[event] = subscription;
};

const removeEventListener = (event) => {
  let currentSubscription = subscriptions[event];
  if (currentSubscription) {
    currentSubscription.remove();
    delete subscriptions[event];
  }
};

const logUninitializedAccessError = (callingMethod) => {
  console.warn( "ERROR: Failed to execute " + callingMethod + "() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!" );
}

/*---------*/
/* BANNERS */
/*---------*/

const createBanner = (adUnitId, bannerPosition) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('createBanner');
    return;
  }
  AppLovinMAX.createBanner(adUnitId, bannerPosition);
}

const createBannerWithOffsets = (adUnitId, bannerPosition, xOffset, yOffset) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('createBannerWithOffsets');
    return;
  }
  AppLovinMAX.createBannerWithOffsets(adUnitId, bannerPosition, xOffset, yOffset);
}

const setBannerBackgroundColor = (adUnitId, hexColorCode) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setBannerBackgroundColor');
    return;
  }
  AppLovinMAX.setBannerBackgroundColor(adUnitId, hexColorCode);
}

const setBannerPlacement = (adUnitId, placement) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setBannerPlacement');
    return;
  }
  AppLovinMAX.setBannerPlacement(adUnitId, placement);
}

const setBannerWidth = (adUnitId, width) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setBannerWidth');
    return;
  }
  AppLovinMAX.setBannerWidth(adUnitId, width);
}

const updateBannerPosition = (adUnitId, bannerPosition) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('updateBannerPosition');
    return;
  }
  AppLovinMAX.updateBannerPosition(adUnitId, bannerPosition);
}

const updateBannerOffsets = (adUnitId, xOffset, yOffset) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('updateBannerOffsets');
    return;
  }
  AppLovinMAX.updateBannerOffsets(adUnitId, xOffset, yOffset);
}

const setBannerExtraParameter = (adUnitId, key, value) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setBannerExtraParameter');
    return;
  }
  AppLovinMAX.setBannerExtraParameter(adUnitId, key, value);
}

const startBannerAutoRefresh = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('startBannerAutoRefresh');
    return;
  }
  AppLovinMAX.startBannerAutoRefresh(adUnitId);
}

const stopBannerAutoRefresh = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('stopBannerAutoRefresh');
    return;
  }
  AppLovinMAX.stopBannerAutoRefresh(adUnitId);
}

const showBanner = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('showBanner');
    return;
  }
  AppLovinMAX.showBanner(adUnitId);
}

const hideBanner = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('hideBanner');
    return;
  }
  AppLovinMAX.hideBanner(adUnitId);
}

const destroyBanner = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('destroyBanner');
    return;
  }
  AppLovinMAX.destroyBanner(adUnitId);
}

/*-------*/
/* MRECS */
/*-------*/

const createMRec = (adUnitId, mrecPosition) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('createMRec');
    return;
  }
  AppLovinMAX.createMRec(adUnitId, mrecPosition);
}

const setMRecBackgroundColor = (adUnitId, hexColorCode) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setMRecBackgroundColor');
    return;
  }
  AppLovinMAX.setMRecBackgroundColor(adUnitId, hexColorCode);
}

const setMRecPlacement = (adUnitId, placement) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setMRecPlacement');
    return;
  }
  AppLovinMAX.setMRecPlacement(adUnitId, placement);
}

const setMRecCustomData = (adUnitId, customData) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setMRecCustomData');
    return;
  }
  AppLovinMAX.setMRecCustomData(adUnitId, customData);
}

const updateMRecPosition = (adUnitId, mrecPosition) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('updateMRecPosition');
    return;
  }
  AppLovinMAX.updateMRecPosition(adUnitId, mrecPosition);
}

const setMRecExtraParameter = (adUnitId, key, value) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setMRecExtraParameter');
    return;
  }
  AppLovinMAX.setMRecExtraParameter(adUnitId, key, value);
}

const startMRecAutoRefresh = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('startMRecAutoRefresh');
    return;
  }
  AppLovinMAX.startMRecAutoRefresh(adUnitId);
}

const stopMRecAutoRefresh = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('stopMRecAutoRefresh');
    return;
  }
  AppLovinMAX.stopMRecAutoRefresh(adUnitId);
}

const showMRec = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('showMRec');
    return;
  }
  AppLovinMAX.showMRec(adUnitId);
}

const hideMRec = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('hideMRec');
    return;
  }
  AppLovinMAX.hideMRec(adUnitId);
}

const destroyMRec = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('destroyMRec');
    return;
  }
  AppLovinMAX.destroyMRec(adUnitId);
}

/*---------------*/
/* INTERSTITIALS */
/*---------------*/

const loadInterstitial = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('loadInterstitial');
    return;
  }
  AppLovinMAX.loadInterstitial(adUnitId);
}

const isInterstitialReady = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('isInterstitialReady');
    return false;
  }
  return AppLovinMAX.isInterstitialReady(adUnitId);
}

const showInterstitial = (adUnitId, ...args) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('showInterstitial');
    return;
  }

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
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setInterstitialExtraParameter');
    return;
  }
  AppLovinMAX.setInterstitialExtraParameter(adUnitId, key, value);
}

/*----------*/
/* REWARDED */
/*----------*/

const loadRewardedAd = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('loadRewardedAd');
    return;
  }
  AppLovinMAX.loadRewardedAd(adUnitId);
}

const isRewardedAdReady = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('isRewardedAdReady');
    return false;
  }
  return AppLovinMAX.isRewardedAdReady(adUnitId);
}

const showRewardedAd = (adUnitId, ...args) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('showRewardedAd');
    return;
  }

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
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setRewardedAdExtraParameter');
    return;
  }
  AppLovinMAX.setRewardedAdExtraParameter(adUnitId, key, value);
}

/*----------*/
/* APP OPEN */
/*----------*/

const loadAppOpenAd = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('loadAppOpenAd');
    return;
  }
  AppLovinMAX.loadAppOpenAd(adUnitId);
}

const isAppOpenAdReady = (adUnitId) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('isAppOpenAdReady');
    return false;
  }
  return AppLovinMAX.isAppOpenAdReady(adUnitId);
}

const showAppOpenAd = (adUnitId, ...args) => {
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('showAppOpenAd');
    return;
  }

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
  if (!AppLovinMAX.isInitialized()) {
    logUninitializedAccessError('setAppOpenAdExtraParameter');
    return;
  }
  AppLovinMAX.setAppOpenAdExtraParameter(adUnitId, key, value);
}

const getConsentDialogState = () => {
  console.warn("getConsentDialogState() has been deprecated and will be removed in a future release.");
  return AppLovinMAX.getConsentDialogState();
};

export default {
  ...AppLovinMAX,
  AdView,
  get targetingData() {
    return TargetingData;
  },
  AdContentRating,
  UserGender,
  ConsentDialogState,
  AdViewPosition,
  AdFormat,
  NativeAdView,
  addEventListener,
  removeEventListener,
  // Use callback to avoid need for attaching listeners at top level on each re-render
  initialize(sdkKey, callback) {
    AppLovinMAX.initialize(VERSION, sdkKey, callback); // Inject VERSION into native code
  },

  /*---------*/
  /* BANNERS */
  /*---------*/
  createBanner,
  createBannerWithOffsets,
  setBannerBackgroundColor,
  setBannerPlacement,
  setBannerWidth,
  updateBannerPosition,
  updateBannerOffsets,
  setBannerExtraParameter,
  startBannerAutoRefresh,
  stopBannerAutoRefresh,
  showBanner,
  hideBanner,
  destroyBanner,

  /*-------*/
  /* MRECS */
  /*-------*/
  createMRec,
  setMRecBackgroundColor,
  setMRecPlacement,
  setMRecCustomData,
  updateMRecPosition,
  setMRecExtraParameter,
  startMRecAutoRefresh,
  stopMRecAutoRefresh,
  showMRec,
  hideMRec,
  destroyMRec,

  /*---------------*/
  /* INTERSTITIALS */
  /*---------------*/
  loadInterstitial,
  isInterstitialReady,
  showInterstitial,
  setInterstitialExtraParameter,

  /*----------*/
  /* REWARDED */
  /*----------*/
  loadRewardedAd,
  isRewardedAdReady,
  showRewardedAd,
  setRewardedAdExtraParameter,

  /*----------*/
  /* APP OPEN */
  /*----------*/
  loadAppOpenAd,
  isAppOpenAdReady,
  showAppOpenAd,
  setAppOpenAdExtraParameter,

  /*--------------------------------------------------*/
  /* DEPRECATED (will be removed in a future release) */
  /*--------------------------------------------------*/
  getConsentDialogState,

  /*----------------------*/
  /** AUTO-DECLARED APIs **/
  /*----------------------*/

  /*----------------*/
  /* INITIALIZATION */
  /*----------------*/
  /* isInitialized() */
  /* initialize(pluginVersion, sdkKey, callback) */

  /*--------------*/
  /* PRIVACY APIs */
  /*--------------*/
  /* showConsentDialog(callback) */
  /* setHasUserConsent(hasUserConsent) */
  /* hasUserConsent() */
  /* setIsAgeRestrictedUser(isAgeRestrictedUser) */
  /* isAgeRestrictedUser() */
  /* setDoNotSell(doNotSell) */
  /* isDoNotSell() */

  /*--------------------*/
  /* GENERAL PUBLIC API */
  /*--------------------*/
  /* showMediationDebugger() */
  /* isTablet() */
  /* setUserId(userId) */
  /* setMuted(muted) */
  /* isMuted() */
  /* setVerboseLogging(verboseLoggingEnabled) */
  /* setTestDeviceAdvertisingIds(advertisingIds) */
  /* setCreativeDebuggerEnabled(enabled) */
  /* setExtraParameter(key, value) */
  /* setConsentFlowEnabled(enabled) */
  /* setPrivacyPolicyUrl(urlString) */
  /* setTermsOfServiceUrl(urlString) */
  /* setLocationCollectionEnabled(locationCollectionEnabled) */

  /*----------------*/
  /* EVENT TRACKING */
  /*----------------*/
  /* trackEvent(event, parameters) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* getAdaptiveBannerHeightForWidth(width) */
};
