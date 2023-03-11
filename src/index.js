import { NativeModules } from "react-native";
import AdView, { AdFormat, AdViewPosition } from "./AppLovinMAXAdView";
import { TargetingData, AdContentRating, UserGender } from "./TargetingData";
import NativeAdView from "./NativeAdView";
import EventListeners from "./AppLovinMAXEventListeners";

const { AppLovinMAX } = NativeModules;

const VERSION = "4.1.7";

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
  /* setBannerExtraParameter */
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
  /* setMRecExtraParameter */
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
  /* setInterstitialExtraParameter */

  /*----------*/
  /* REWARDED */
  /*----------*/
  /* loadRewardedAd */
  /* isRewardedAdReady */
  /* setRewardedAdExtraParameter */

  /*----------*/
  /* APP OPEN */
  /*----------*/
  /* loadAppOpenAd */
  /* isAppOpenAdReady */
  /* setAppOpenAdExtraParameter */

  /*----------------*/
  /* EVENT TRACKING */
  /*----------------*/
  /* trackEvent(event, parameters) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* getAdaptiveBannerHeightForWidth(width, promise) */
};
