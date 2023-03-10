import { NativeModules } from "react-native";
import AdView, { AdFormat, AdViewPosition } from "./AppLovinMAXAdView";
import { TargetingData, AdContentRating, UserGender } from "./TargetingData";
import NativeAdView from "./NativeAdView";
import EventListeners from "./AppLovinMAXEventListeners";

const { AppLovinMAX } = NativeModules;

const VERSION = "4.1.7";

const runIfInitialized = (callingMethodName, callingMethod, ...params) => {
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
  return runIfInitialized(createBanner.name,
                          AppLovinMAX.createBanner,
                          adUnitId, bannerPosition);
}

const createBannerWithOffsets = (adUnitId, bannerPosition, xOffset, yOffset) => {
  return runIfInitialized(createBannerWithOffsets.name,
                          AppLovinMAX.createBannerWithOffsets,
                          adUnitId, bannerPosition, xOffset, yOffset);
}

const setBannerBackgroundColor = (adUnitId, hexColorCode) => {
  return runIfInitialized(setBannerBackgroundColor.name,
                          AppLovinMAX.setBannerBackgroundColor,
                          adUnitId, hexColorCode);
}

const setBannerPlacement = (adUnitId, placement) => {
  return runIfInitialized(setBannerPlacement.name,
                          AppLovinMAX.setBannerPlacement,
                          adUnitId, placement);
}

const setBannerWidth = (adUnitId, width) => {
  return runIfInitialized(setBannerWidth.name,
                          AppLovinMAX.setBannerWidth,
                          adUnitId, width);
}

const updateBannerPosition = (adUnitId, bannerPosition) => {
  return runIfInitialized(updateBannerPosition.name,
                          AppLovinMAX.updateBannerPosition,
                          adUnitId, bannerPosition);
}

const updateBannerOffsets = (adUnitId, xOffset, yOffset) => {
  return runIfInitialized(updateBannerOffsets.name,
                          AppLovinMAX.updateBannerOffsets,
                          adUnitId, xOffset, yOffset);
}

const setBannerExtraParameter = (adUnitId, key, value) => {
  return runIfInitialized(setBannerExtraParameter.name,
                          AppLovinMAX.setBannerExtraParameter,
                          adUnitId, key, value);
}

const startBannerAutoRefresh = (adUnitId) => {
  return runIfInitialized(startBannerAutoRefresh.name,
                          AppLovinMAX.startBannerAutoRefresh,
                          adUnitId);
}

const stopBannerAutoRefresh = (adUnitId) => {
  return runIfInitialized(stopBannerAutoRefresh.name,
                          AppLovinMAX.stopBannerAutoRefresh,
                          adUnitId);
}

const showBanner = (adUnitId) => {
  return runIfInitialized(showBanner.name,
                          AppLovinMAX.showBanner,
                          adUnitId);
}

const hideBanner = (adUnitId) => {
  return runIfInitialized(hideBanner.name,
                          AppLovinMAX.hideBanner,
                          adUnitId);
}

const destroyBanner = (adUnitId) => {
  return runIfInitialized(destroyBanner.name,
                          AppLovinMAX.destroyBanner,
                          adUnitId);
}

/*-------*/
/* MRECS */
/*-------*/

const createMRec = (adUnitId, mrecPosition) => {
  return runIfInitialized(createMRec.name,
                          AppLovinMAX.createMRec,
                          adUnitId, mrecPosition);
}

const setMRecBackgroundColor = (adUnitId, hexColorCode) => {
  return runIfInitialized(setMRecBackgroundColor.name,
                          AppLovinMAX.setMRecBackgroundColor,
                          adUnitId, hexColorCode);
}

const setMRecPlacement = (adUnitId, placement) => {
  return runIfInitialized(setMRecPlacement.name,
                          AppLovinMAX.setMRecPlacement,
                          adUnitId, placement);
}

const setMRecCustomData = (adUnitId, customData) => {
  return runIfInitialized(setMRecCustomData.name,
                          AppLovinMAX.setMRecCustomData,
                          adUnitId, customData);
}

const updateMRecPosition = (adUnitId, mrecPosition) => {
  return runIfInitialized(updateMRecPosition.name,
                          AppLovinMAX.updateMRecPosition,
                          adUnitId, mrecPosition);
}

const setMRecExtraParameter = (adUnitId, key, value) => {
  return runIfInitialized(setMRecExtraParameter.name,
                          AppLovinMAX.setMRecExtraParameter,
                          adUnitId, key, value);
}

const startMRecAutoRefresh = (adUnitId) => {
  return runIfInitialized(startMRecAutoRefresh.name,
                          AppLovinMAX.startMRecAutoRefresh,
                          adUnitId);
}

const stopMRecAutoRefresh = (adUnitId) => {
  return runIfInitialized(stopMRecAutoRefresh.name,
                          AppLovinMAX.stopMRecAutoRefresh,
                          adUnitId);
}

const showMRec = (adUnitId) => {
  return runIfInitialized(showMRec.name,
                          AppLovinMAX.showMRec,
                          adUnitId);
}

const hideMRec = (adUnitId) => {
  return runIfInitialized(hideMRec.name,
                          AppLovinMAX.hideMRec,
                          adUnitId);
}

const destroyMRec = (adUnitId) => {
  return runIfInitialized(destroyMRec.name,
                          AppLovinMAX.destroyMRec,
                          adUnitId);
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
  showInterstitial,

  /*----------*/
  /* REWARDED */
  /*----------*/
  showRewardedAd,

  /*----------*/
  /* APP OPEN */
  /*----------*/
  showAppOpenAd,

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
