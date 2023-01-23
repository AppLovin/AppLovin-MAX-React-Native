import { NativeModules, NativeEventEmitter } from "react-native";
import AdView, { AdFormat, AdViewPosition } from "./AppLovinMAXAdView";
import { TargetingData, AdContentRating, UserGender } from "./TargetingData";
import NativeAdView from "./NativeAdView";

const { AppLovinMAX } = NativeModules;

const VERSION = "4.1.4";

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
  console.warn("ERROR: Failed to execute " + callingMethod + "() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!");
}

/*---------*/
/* BANNERS */
/*---------*/

const createBanner = (adUnitId, bannerPosition) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.createBanner(adUnitId, bannerPosition);
    } else {
      logUninitializedAccessError('createBanner');
    }
  });
}

const createBannerWithOffsets = (adUnitId, bannerPosition, xOffset, yOffset) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.createBannerWithOffsets(adUnitId, bannerPosition, xOffset, yOffset);
    } else {
      logUninitializedAccessError('createBannerWithOffsets');
    }
  });
}

const setBannerBackgroundColor = (adUnitId, hexColorCode) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setBannerBackgroundColor(adUnitId, hexColorCode);
    } else {
      logUninitializedAccessError('setBannerBackgroundColor');
    }
  });
}

const setBannerPlacement = (adUnitId, placement) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setBannerPlacement(adUnitId, placement);
    } else {
      logUninitializedAccessError('setBannerPlacement');
    }
  });
}

const setBannerWidth = (adUnitId, width) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setBannerWidth(adUnitId, width);
    } else {
      logUninitializedAccessError('setBannerWidth');
    }
  });
}

const updateBannerPosition = (adUnitId, bannerPosition) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.updateBannerPosition(adUnitId, bannerPosition);
    } else {
      logUninitializedAccessError('updateBannerPosition');
    }
  });
}

const updateBannerOffsets = (adUnitId, xOffset, yOffset) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.updateBannerOffsets(adUnitId, xOffset, yOffset);
    } else {
      logUninitializedAccessError('updateBannerOffsets');
    }
  });
}

const setBannerExtraParameter = (adUnitId, key, value) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setBannerExtraParameter(adUnitId, key, value);
    } else {
      logUninitializedAccessError('setBannerExtraParameter');
    }
  });
}

const startBannerAutoRefresh = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.startBannerAutoRefresh(adUnitId);
    } else {
      logUninitializedAccessError('startBannerAutoRefresh');
    }
  });
}

const stopBannerAutoRefresh = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.stopBannerAutoRefresh(adUnitId);
    } else {
      logUninitializedAccessError('stopBannerAutoRefresh');
    }
  });
}

const showBanner = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.showBanner(adUnitId);
    } else {
      logUninitializedAccessError('showBanner');
    }
  });
}

const hideBanner = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.hideBanner(adUnitId);
    } else {
      logUninitializedAccessError('hideBanner');
    }
  });
}

const destroyBanner = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.destroyBanner(adUnitId);
    } else {
      logUninitializedAccessError('destroyBanner');
    }
  });
}

/*-------*/
/* MRECS */
/*-------*/

const createMRec = (adUnitId, mrecPosition) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.createMRec(adUnitId, mrecPosition);
    } else {
      logUninitializedAccessError('createMRec');
    }
  });
}

const setMRecBackgroundColor = (adUnitId, hexColorCode) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setMRecBackgroundColor(adUnitId, hexColorCode);
    } else {
      logUninitializedAccessError('setMRecBackgroundColor');
    }
  });
}

const setMRecPlacement = (adUnitId, placement) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setMRecPlacement(adUnitId, placement);
    } else {
      logUninitializedAccessError('setMRecPlacement');
    }
  });
}

const setMRecCustomData = (adUnitId, customData) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setMRecCustomData(adUnitId, customData);
    } else {
      logUninitializedAccessError('setMRecCustomData');
    }
  });
}

const updateMRecPosition = (adUnitId, mrecPosition) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.updateMRecPosition(adUnitId, mrecPosition);
    } else {
      logUninitializedAccessError('updateMRecPosition');
    }
  });
}

const setMRecExtraParameter = (adUnitId, key, value) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setMRecExtraParameter(adUnitId, key, value);
    } else {
      logUninitializedAccessError('setMRecExtraParameter');
    }
  });
}

const startMRecAutoRefresh = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.startMRecAutoRefresh(adUnitId);
    } else {
      logUninitializedAccessError('startMRecAutoRefresh');
    }
  });
}

const stopMRecAutoRefresh = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.stopMRecAutoRefresh(adUnitId);
    } else {
      logUninitializedAccessError('stopMRecAutoRefresh');
    }
  });
}

const showMRec = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.showMRec(adUnitId);
    } else {
      logUninitializedAccessError('showMRec');
    }
  });
}

const hideMRec = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.hideMRec(adUnitId);
    } else {
      logUninitializedAccessError('hideMRec');
    }
  });
}

const destroyMRec = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.destroyMRec(adUnitId);
    } else {
      logUninitializedAccessError('destroyMRec');
    }
  });
}

/*---------------*/
/* INTERSTITIALS */
/*---------------*/

const loadInterstitial = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.loadInterstitial(adUnitId);
    } else {
      logUninitializedAccessError('loadInterstitial');
    }
  });
}

const isInterstitialReady = (adUnitId) => {
  return AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      return AppLovinMAX.isInterstitialReady(adUnitId);
    } else {
      throw new Error("Failed to execute isInterstitialReady() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!");
    }
  });
}

const showInterstitial = (adUnitId, ...args) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
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
    } else {
      logUninitializedAccessError('showInterstitial');
    }
  });
};

const setInterstitialExtraParameter = (adUnitId, key, value) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setInterstitialExtraParameter(adUnitId, key, value);
    } else {
      logUninitializedAccessError('setInterstitialExtraParameter');
    }
  });
}

/*----------*/
/* REWARDED */
/*----------*/

const loadRewardedAd = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.loadRewardedAd(adUnitId);
    } else {
      logUninitializedAccessError('loadRewardedAd');
    }
  });
}

const isRewardedAdReady = (adUnitId) => {
  return AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      return AppLovinMAX.isRewardedAdReady(adUnitId);
    } else {
      throw new Error("Failed to execute isRewardedAdReady() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!");
    }
  });
}

const showRewardedAd = (adUnitId, ...args) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
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
    } else {
      logUninitializedAccessError('showRewardedAd');
    }
  });
};

const setRewardedAdExtraParameter = (adUnitId, key, value) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setRewardedAdExtraParameter(adUnitId, key, value);
    } else {
      logUninitializedAccessError('setRewardedAdExtraParameter');
    }
  });
}

/*----------*/
/* APP OPEN */
/*----------*/

const loadAppOpenAd = (adUnitId) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.loadAppOpenAd(adUnitId);
    } else {
      logUninitializedAccessError('loadAppOpenAd');
    }
  });
}

const isAppOpenAdReady = (adUnitId) => {
  return AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      return AppLovinMAX.isAppOpenAdReady(adUnitId);
    } else {
      throw new Error("Failed to execute isAppOpenAdReady() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!");
    }
  });
}

const showAppOpenAd = (adUnitId, ...args) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
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
    } else {
      logUninitializedAccessError('showAppOpenAd');
    }
  });
};

const setAppOpenAdExtraParameter = (adUnitId, key, value) => {
  AppLovinMAX.isInitialized().then(isInitialized => {
    if (isInitialized) {
      AppLovinMAX.setAppOpenAdExtraParameter(adUnitId, key, value);
    } else {
      logUninitializedAccessError('setAppOpenAdExtraParameter');
    }
  });
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
