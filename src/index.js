import { NativeModules, NativeEventEmitter } from "react-native";
import AdView, { AdFormat, AdViewPosition } from "./AppLovinMAXAdView";
import { TargetingData as targetingData, AdContentRating, UserGender } from "./TargetingData";

const { AppLovinMAX } = NativeModules;

const VERSION = "3.3.1";

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

export default {
  ...AppLovinMAX,
  AdView,
  targetingData,
  AdContentRating,
  UserGender,
  ConsentDialogState,
  AdViewPosition,
  AdFormat,
  addEventListener,
  removeEventListener,
  // Use callback to avoid need for attaching listeners at top level on each re-render
  initialize(sdkKey, callback) {
    AppLovinMAX.initialize(VERSION, sdkKey, callback); // Inject VERSION into native code
  },
  showInterstitial,
  showRewardedAd,

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
  /* showConsentDialog(callback) */
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
  /* setTermsOfServiceUrl(urlString) */
  /* setLocationCollectionEnabled(locationCollectionEnabled) */

  /*----------------*/
  /* DATA PASSING */
  /*----------------*/
  /* setTargetingDataYearOfBirth(yearOfBirth) */
  /* setTargetingDataGender(gender) */
  /* setTargetingDataMaximumAdContentRating(maximumAdContentRating) */
  /* setTargetingDataEmail(email) */
  /* setTargetingDataPhoneNumber(phoneNumber) */
  /* setTargetingDataKeywords(keywords) */
  /* setTargetingDataInterests(interests) */
  /* clearAllTargetingData() */

  /*----------------*/
  /* EVENT TRACKING */
  /*----------------*/
  /* trackEvent(event, parameters) */

  /*---------*/
  /* BANNERS */
  /*---------*/
  /* createBanner(adUnitId, bannerPosition) */
  /* createBannerWithOffsets(adUnitId, bannerPosition, xOffset, yOffset) */
  /* setBannerBackgroundColor(adUnitId, hexColorCode) */
  /* setBannerPlacement(adUnitId, placement) */
  /* setBannerWidth(adUnitId, width) */
  /* updateBannerPosition(adUnitId, bannerPosition) */
  /* updateBannerOffsets(adUnitId, xOffset, yOffset) */
  /* setBannerExtraParameter(adUnitId, key, value) */
  /* showBanner(adUnitId) */
  /* hideBanner(adUnitId) */
  /* destroyBanner(adUnitId) */
  /* getAdaptiveBannerHeightForWidth(width) */

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
