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

const runIfInit = (callingMethodName, callingMethod, ...params) => {
  return AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      return callingMethod(...params);
    } else {
      throw new Error("Failed to execute " + callingMethodName + "() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!");
    }
  });
}

/*---------*/
/* BANNERS */
/*---------*/

const createBanner = (adUnitId, bannerPosition) => {
  return runIfInit(createBanner.name,
                   AppLovinMAX.createBanner,
                   adUnitId, bannerPosition);
}

const createBannerWithOffsets = (adUnitId, bannerPosition, xOffset, yOffset) => {
  return runIfInit(createBannerWithOffsets.name,
                   AppLovinMAX.createBannerWithOffsets,
                   adUnitId, bannerPosition, xOffset, yOffset);
}

const setBannerBackgroundColor = (adUnitId, hexColorCode) => {
  return runIfInit(setBannerBackgroundColor.name,
                   AppLovinMAX.setBannerBackgroundColor,
                   adUnitId, hexColorCode);
}

const setBannerPlacement = (adUnitId, placement) => {
  return runIfInit(setBannerPlacement.name,
                   AppLovinMAX.setBannerPlacement,
                   adUnitId, placement);
}

const setBannerWidth = (adUnitId, width) => {
  return runIfInit(setBannerWidth.name,
                   AppLovinMAX.setBannerWidth,
                   adUnitId, width);
}

const updateBannerPosition = (adUnitId, bannerPosition) => {
  return runIfInit(updateBannerPosition.name,
                   AppLovinMAX.updateBannerPosition,
                   adUnitId, bannerPosition);
}

const updateBannerOffsets = (adUnitId, xOffset, yOffset) => {
  return runIfInit(updateBannerOffsets.name,
                   AppLovinMAX.updateBannerOffsets,
                   adUnitId, xOffset, yOffset);
}

const setBannerExtraParameter = (adUnitId, key, value) => {
  return runIfInit(setBannerExtraParameter.name,
                   AppLovinMAX.setBannerExtraParameter,
                   adUnitId, key, value);
}

const startBannerAutoRefresh = (adUnitId) => {
  return runIfInit(startBannerAutoRefresh.name,
                   AppLovinMAX.startBannerAutoRefresh,
                   adUnitId);
}

const stopBannerAutoRefresh = (adUnitId) => {
  return runIfInit(stopBannerAutoRefresh.name,
                   AppLovinMAX.stopBannerAutoRefresh,
                   adUnitId);
}

const showBanner = (adUnitId) => {
  return runIfInit(showBanner.name,
                   AppLovinMAX.showBanner,
                   adUnitId);
}

const hideBanner = (adUnitId) => {
  return runIfInit(hideBanner.name,
                   AppLovinMAX.hideBanner,
                   adUnitId);
}

const destroyBanner = (adUnitId) => {
  return runIfInit(destroyBanner.name,
                   AppLovinMAX.destroyBanner,
                   adUnitId);
}

/*-------*/
/* MRECS */
/*-------*/

const createMRec = (adUnitId, mrecPosition) => {
  return runIfInit(createMRec.name,
                   AppLovinMAX.createMRec,
                   adUnitId, mrecPosition);
}

const setMRecBackgroundColor = (adUnitId, hexColorCode) => {
  return runIfInit(setMRecBackgroundColor.name,
                   AppLovinMAX.setMRecBackgroundColor,
                   adUnitId, hexColorCode);
}

const setMRecPlacement = (adUnitId, placement) => {
  return runIfInit(setMRecPlacement.name,
                   AppLovinMAX.setMRecPlacement,
                   adUnitId, placement);
}

const setMRecCustomData = (adUnitId, customData) => {
  return runIfInit(setMRecCustomData.name,
                   AppLovinMAX.setMRecCustomData,
                   adUnitId, customData);
}

const updateMRecPosition = (adUnitId, mrecPosition) => {
  return runIfInit(updateMRecPosition.name,
                   AppLovinMAX.updateMRecPosition,
                   adUnitId, mrecPosition);
}

const setMRecExtraParameter = (adUnitId, key, value) => {
  return runIfInit(setMRecExtraParameter.name,
                   AppLovinMAX.setMRecExtraParameter,
                   adUnitId, key, value);
}

const startMRecAutoRefresh = (adUnitId) => {
  return runIfInit(startMRecAutoRefresh.name,
                   AppLovinMAX.startMRecAutoRefresh,
                   adUnitId);
}

const stopMRecAutoRefresh = (adUnitId) => {
  return runIfInit(stopMRecAutoRefresh.name,
                   AppLovinMAX.stopMRecAutoRefresh,
                   adUnitId);
}

const showMRec = (adUnitId) => {
  return runIfInit(showMRec.name,
                   AppLovinMAX.showMRec,
                   adUnitId);
}

const hideMRec = (adUnitId) => {
  return runIfInit(hideMRec.name,
                   AppLovinMAX.hideMRec,
                   adUnitId);
}

const destroyMRec = (adUnitId) => {
  return runIfInit(destroyMRec.name,
                   AppLovinMAX.destroyMRec,
                   adUnitId);
}

/*---------------*/
/* INTERSTITIALS */
/*---------------*/

const loadInterstitial = (adUnitId) => {
  return runIfInit(loadInterstitial.name,
                   AppLovinMAX.loadInterstitial,
                   adUnitId);
}

const isInterstitialReady = (adUnitId) => {
  return runIfInit(isInterstitialReady.name,
                   AppLovinMAX.isInterstitialReady,
                   adUnitId);
}

const showInterstitial = (adUnitId, ...params) => {
  return runIfInit(showInterstitial.name,
                   AppLovinMAX.showInterstitial,
                   adUnitId, params[0], params[1]);
};

const setInterstitialExtraParameter = (adUnitId, key, value) => {
  return runIfInit(setInterstitialExtraParameter.name,
                   AppLovinMAX.setInterstitialExtraParameter,
                   adUnitId, key, value);
}

/*----------*/
/* REWARDED */
/*----------*/

const loadRewardedAd = (adUnitId) => {
  return runIfInit(loadRewardedAd.name,
                   AppLovinMAX.loadRewardedAd,
                   adUnitId);
}

const isRewardedAdReady = (adUnitId) => {
  return runIfInit(isRewardedAdReady.name,
                   AppLovinMAX.isRewardedAdReady,
                   adUnitId);
}

const showRewardedAd = (adUnitId, ...params) => {
  return runIfInit(showRewardedAd.name,
                   AppLovinMAX.showRewardedAd,
                   adUnitId, params[0], params[1]);
};

const setRewardedAdExtraParameter = (adUnitId, key, value) => {
  return runIfInit(setRewardedAdExtraParameter.name,
                   AppLovinMAX.setRewardedAdExtraParameter,
                   adUnitId, key, value);
}

/*----------*/
/* APP OPEN */
/*----------*/

const loadAppOpenAd = (adUnitId) => {
  return runIfInit(loadAppOpenAd.name,
                   AppLovinMAX.loadAppOpenAd,
                   adUnitId);
}

const isAppOpenAdReady = (adUnitId) => {
  return runIfInit(isAppOpenAdReady.name,
                   AppLovinMAX.isAppOpenAdReady,
                   adUnitId);
}

const showAppOpenAd = (adUnitId, ...params) => {
  return runIfInit(showAppOpenAd.name,
                   AppLovinMAX.showAppOpenAd,
                   adUnitId, params[0], params[1]);
};

const setAppOpenAdExtraParameter = (adUnitId, key, value) => {
  return runIfInit(setAppOpenAdExtraParameter.name,
                   AppLovinMAX.setAppOpenAdExtraParameter,
                   adUnitId, key, value);
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
  initialize(sdkKey) {
    return AppLovinMAX.initialize(VERSION, sdkKey);
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

  /*----------------*/
  /* EVENT TRACKING */
  /*----------------*/
  /* trackEvent(event, parameters) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* getAdaptiveBannerHeightForWidth(width, promise) */
};
