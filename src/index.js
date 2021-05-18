import { NativeModules, NativeEventEmitter } from "react-native";
import AdView from "./AppLovinMAXAdView";

const { AppLovinMAX } = NativeModules;

const VERSION = "2.0.4";

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

const AdFormat = {
  BANNER: "banner",
  MREC: "mrec",
};

const AdViewPosition = {
  TOP_CENTER: "top_center",
  TOP_RIGHT: "top_right",
  CENTERED: "centered",
  CENTER_LEFT: "center_left",
  CENTER_RIGHT: "center_right",
  BOTTOM_LEFT: "bottom_left",
  BOTTOM_CENTER: "bottom_center",
  BOTTOM_RIGHT: "bottom_right",
};

// const AdView = AppLovinMAXAdView;

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

export default {
  ...AppLovinMAX,
  AdView,
  ConsentDialogState,
  AdViewPosition,
  AdFormat,
  addEventListener,
  removeEventListener,
  // Use callback to avoid need for attaching listeners at top level on each re-render
  initialize(sdkKey, callback) {
    AppLovinMAX.initialize(VERSION, sdkKey, callback); // Inject VERSION into native code
  },
  // Support for showing ad without placement
  showInterstitial(adUnitId) {
    AppLovinMAX.showInterstitial(adUnitId, "");
  },
  // Support for showing ad without placement
  showRewardedAd(adUnitId) {
    AppLovinMAX.showRewardedAd(adUnitId, "");
  },

  /*----------------------*/
  /** AUTO-DECLARED APIs **/
  /*----------------------*/

  /*----------------*/
  /* INITIALIZATION */
  /*----------------*/
  /* isInitialized() */
  /* initialize(pluginVersion, sdkKey, callback) */
  /* showMediationDebugger() */

  /*--------------*/
  /* PRIVACY APIs */
  /*--------------*/
  /* getConsentDialogState() */
  /* setHasUserConsent(hasUserConsent) */
  /* hasUserConsent() */
  /* setIsAgeRestrictedUser(isAgeRestrictedUser) */
  /* isAgeRestrictedUser() */
  /* setDoNotSell(doNotSell) */
  /* isDoNotSell() */

  /*--------------------*/
  /* GENERAL PUBLIC API */
  /*--------------------*/
  /* isTablet() */
  /* setUserId(userId) */
  /* setMuted(muted) */
  /* isMuted() */
  /* setVerboseLogging(verboseLoggingEnabled) */
  /* setTestDeviceAdvertisingIds(advertisingIds) */
  /* setCreativeDebuggerEnabled(enabled) */
  /* setConsentFlowEnabled(enabled) */
  /* setPrivacyPolicyUrl(urlString) */

  /*----------------*/
  /* EVENT TRACKING */
  /*----------------*/
  /* trackEvent(event, parameters) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* createBanner(adUnitId, bannerPosition) */
  /* setBannerBackgroundColor(adUnitId, hexColorCode) */
  /* setBannerPlacement(adUnitId, placement) */
  /* setBannerWidth(adUnitId, width) */
  /* updateBannerPosition(adUnitId, bannerPosition) */
  /* setBannerExtraParameter(adUnitId, key, value) */
  /* showBanner(adUnitId) */
  /* hideBanner(adUnitId) */
  /* destroyBanner(adUnitId) */

  /*-------*/
  /* MRECS */
  /*-------*/
  /* createMRec(adUnitId, mrecPosition) */
  /* setMRecBackgroundColor(adUnitId, hexColorCode) */
  /* setMRecPlacement(adUnitId, placement) */
  /* updateMRecPosition(adUnitId, mrecPosition) */
  /* setMRecExtraParameter(adUnitId, key, value) */
  /* showMRec(adUnitId) */
  /* hideMRec(adUnitId) */
  /* destroyMRec
  
  /*---------------*/
  /* INTERSTITIALS */
  /*---------------*/
  /* loadInterstitial(adUnitId) */
  /* isInterstitialReady(adUnitId) */
  /* showInterstitial(adUnitId, placement) */
  /* setInterstitialExtraParameter(adUnitId, key, value) */

  /*----------*/
  /* REWARDED */
  /*----------*/
  /* loadRewardedAd(adUnitId) */
  /* isRewardedAdReady(adUnitId) */
  /* showRewardedAd(adUnitId, placement) */
  /* setRewardedAdExtraParameter(adUnitId, key, value) */
};
