import { NativeModules, NativeEventEmitter } from "react-native";

const { AppLovinMAX } = NativeModules;

const {
  ON_MREC_AD_LOADED_EVENT,
  ON_MREC_AD_LOAD_FAILED_EVENT,
  ON_MREC_AD_CLICKED_EVENT,
  ON_MREC_AD_COLLAPSED_EVENT,
  ON_MREC_AD_EXPANDED_EVENT,
  ON_MREC_AD_REVENUE_PAID,

  ON_BANNER_AD_LOADED_EVENT,
  ON_BANNER_AD_LOAD_FAILED_EVENT,
  ON_BANNER_AD_CLICKED_EVENT,
  ON_BANNER_AD_COLLAPSED_EVENT,
  ON_BANNER_AD_EXPANDED_EVENT,
  ON_BANNER_AD_REVENUE_PAID,

  ON_INTERSTITIAL_LOADED_EVENT,
  ON_INTERSTITIAL_LOAD_FAILED_EVENT,
  ON_INTERSTITIAL_CLICKED_EVENT,
  ON_INTERSTITIAL_DISPLAYED_EVENT,
  ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT,
  ON_INTERSTITIAL_HIDDEN_EVENT,
  ON_INTERSTITIAL_AD_REVENUE_PAID,
  
  ON_REWARDED_AD_LOADED_EVENT,
  ON_REWARDED_AD_LOAD_FAILED_EVENT,
  ON_REWARDED_AD_CLICKED_EVENT,
  ON_REWARDED_AD_DISPLAYED_EVENT,
  ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT,
  ON_REWARDED_AD_HIDDEN_EVENT,
  ON_REWARDED_AD_RECEIVED_REWARD_EVENT,
  ON_REWARDED_AD_REVENUE_PAID,
  
  ON_APPOPEN_AD_LOADED_EVENT,
  ON_APPOPEN_AD_LOAD_FAILED_EVENT,
  ON_APPOPEN_AD_CLICKED_EVENT,
  ON_APPOPEN_AD_DISPLAYED_EVENT,
  ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT,
  ON_APPOPEN_AD_HIDDEN_EVENT,
  ON_APPOPEN_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

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

const addMRecAdLoadedEventListener = (listener) => {
  addEventListener(ON_MREC_AD_LOADED_EVENT, (adInfo) => listener(adInfo));
};

const removeMRecAdLoadedEventListener = () => {
  removeEventListener(ON_MREC_AD_LOADED_EVENT);  
};

const addMRecAdLoadFailedEventListener = (listener) => {
  addEventListener(ON_MREC_AD_LOAD_FAILED_EVENT, (errorInfo) => listener(errorInfo));
};

const removeMRecAdLoadFailedEventListener = () => {
  removeEventListener(ON_MREC_AD_LOAD_FAILED_EVENT);  
};

const addMRecAdClickedEventListener = (listener) => {
  addEventListener(ON_MREC_AD_CLICKED_EVENT, (adInfo) => listener(adInfo));
};

const removeMRecAdClickedEventListener = () => {
  removeEventListener(ON_MREC_AD_CLICKED_EVENT);  
};

const addMRecAdCollapsedEventListener = (listener) => {
  addEventListener(ON_MREC_AD_COLLAPSED_EVENT, (adInfo) => listener(adInfo));
};

const removeMRecAdCollapsedEventListener = () => {
  removeEventListener(ON_MREC_AD_COLLAPSED_EVENT);  
};

const addMRecAdExpandedEventListener = (listener) => {
  addEventListener(ON_MREC_AD_EXPANDED_EVENT, (adInfo) => listener(adInfo));
};

const removeMRecAdExpandedEventListener = () => {
  removeEventListener(ON_MREC_AD_EXPANDED_EVENT);  
};

const addMRecAdRevenuePaidListener = (listener) => {
  addEventListener(ON_MREC_AD_REVENUE_PAID, (adInfo) => listener(adInfo));
};

const removeMRecAdRevenuePaidListener = () => {
  removeEventListener(ON_MREC_AD_REVENUE_PAID);  
};

const addBannerAdLoadedEventListener = (listener) => {
  addEventListener(ON_BANNER_AD_LOADED_EVENT, (adInfo) => listener(adInfo));
};

const removeBannerAdLoadedEventListener = () => {
  removeEventListener(ON_BANNER_AD_LOADED_EVENT);  
};

const addBannerAdLoadFailedEventListener = (listener) => {
  addEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT, (errorInfo) => listener(errorInfo));
};

const removeBannerAdLoadFailedEventListener = () => {
  removeEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT);  
};

const addBannerAdClickedEventListener = (listener) => {
  addEventListener(ON_BANNER_AD_CLICKED_EVENT, (adInfo) => listener(adInfo));
};

const removeBannerAdClickedEventListener = () => {
  removeEventListener(ON_BANNER_AD_CLICKED_EVENT);  
};

const addBannerAdCollapsedEventListener = (listener) => {
  addEventListener(ON_BANNER_AD_COLLAPSED_EVENT, (adInfo) => listener(adInfo));
};

const removeBannerAdCollapsedEventListener = () => {
  removeEventListener(ON_BANNER_AD_COLLAPSED_EVENT);  
};

const addBannerAdExpandedEventListener = (listener) => {
  addEventListener(ON_BANNER_AD_EXPANDED_EVENT, (adInfo) => listener(adInfo));
};

const removeBannerAdExpandedEventListener = () => {
  removeEventListener(ON_BANNER_AD_EXPANDED_EVENT);  
};

const addBannerAdRevenuePaidListener = (listener) => {
  addEventListener(ON_BANNER_AD_REVENUE_PAID, (adInfo) => listener(adInfo));
};

const removeBannerAdRevenuePaidListener = () => {
  removeEventListener(ON_BANNER_AD_REVENUE_PAID);  
};

const addInterstitialLoadedEventListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_LOADED_EVENT, (adInfo) => listener(adInfo));
};

const removeInterstitialLoadedEventListener = () => {
  removeEventListener(ON_INTERSTITIAL_LOADED_EVENT);  
};

const addInterstitialLoadFailedEventListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT, (errorInfo) => listener(errorInfo));
};

const removeInterstitialLoadFailedEventListener = () => {
  removeEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT);  
};

const addInterstitialClickedEventListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_CLICKED_EVENT, (adInfo) => listener(adInfo));
};

const removeInterstitialClickedEventListener = () => {
  removeEventListener(ON_INTERSTITIAL_CLICKED_EVENT);  
};

const addInterstitialDisplayedEventListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT, (adInfo) => listener(adInfo));
};

const removeInterstitialDisplayedEventListener = () => {
  removeEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT);  
};

const addInterstitialAdFailedToDisplayEventListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT, (adInfo) => listener(adInfo));
};

const removeInterstitialAdFailedToDisplayEventListener = () => {
  removeEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT);  
};

const addInterstitialHiddenEventListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_HIDDEN_EVENT, (adInfo) => listener(adInfo));
};

const removeInterstitialHiddenEventListener = () => {
  removeEventListener(ON_INTERSTITIAL_HIDDEN_EVENT);  
};

const addInterstitialAdRevenuePaidListener = (listener) => {
  addEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID, (adInfo) => listener(adInfo));
};

const removeInterstitialAdRevenuePaidListener = () => {
  removeEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID);  
};

const addRewardedAdLoadedEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_LOADED_EVENT, (adInfo) => listener(adInfo));
};

const removeRewardedAdLoadedEventListener = () => {
  removeEventListener(ON_REWARDED_AD_LOADED_EVENT);  
};

const addRewardedAdLoadFailedEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_LOAD_FAILED_EVENT, (errorInfo) => listener(errorInfo));
};

const removeRewardedAdLoadFailedEventListener = () => {
  removeEventListener(ON_REWARDED_AD_LOAD_FAILED_EVENT);  
};

const addRewardedAdClickedEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_CLICKED_EVENT, (adInfo) => listener(adInfo));
};

const removeRewardedAdClickedEventListener = () => {
  removeEventListener(ON_REWARDED_AD_CLICKED_EVENT);  
};

const addRewardedAdDisplayedEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_DISPLAYED_EVENT, (adInfo) => listener(adInfo));
};

const removeRewardedAdDisplayedEventListener = () => {
  removeEventListener(ON_REWARDED_AD_DISPLAYED_EVENT);  
};

const addRewardedAdFailedToDisplayEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT, (adInfo) => listener(adInfo));
};

const removeRewardedAdFailedToDisplayEventListener = () => {
  removeEventListener(ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT);  
};

const addRewardedAdHiddenEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_HIDDEN_EVENT, (adInfo) => listener(adInfo));
};

const removeRewardedAdHiddenEventListener = () => {
  removeEventListener(ON_REWARDED_AD_HIDDEN_EVENT);  
};

const addRewardedAdReceivedRewardEventListener = (listener) => {
  addEventListener(ON_REWARDED_AD_RECEIVED_REWARD_EVENT, (adInfo) => listener(adInfo));
};

const removeRewardedAdReceivedRewardEventListener = () => {
  removeEventListener(ON_REWARDED_AD_RECEIVED_REWARD_EVENT);  
};

const addRewardedAdRevenuePaidListener = (listener) => {
  addEventListener(ON_REWARDED_AD_REVENUE_PAID, (adInfo) => listener(adInfo));
};

const removeRewardedAdRevenuePaidListener = () => {
  removeEventListener(ON_REWARDED_AD_REVENUE_PAID);  
};

const addAppOpenAdLoadedEventListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_LOADED_EVENT, (adInfo) => listener(adInfo));
};

const removeAppOpenAdLoadedEventListener = () => {
  removeEventListener(ON_APPOPEN_AD_LOADED_EVENT);  
};

const addAppOpenAdLoadFailedEventListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_LOAD_FAILED_EVENT, (errorInfo) => listener(errorInfo));
};

const removeAppOpenAdLoadFailedEventListener = () => {
  removeEventListener(ON_APPOPEN_AD_LOAD_FAILED_EVENT);  
};

const addAppOpenAdClickedEventListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_CLICKED_EVENT, (adInfo) => listener(adInfo));
};

const removeAppOpenAdClickedEventListener = () => {
  removeEventListener(ON_APPOPEN_AD_CLICKED_EVENT);  
};

const addAppOpenAdDisplayedEventListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_DISPLAYED_EVENT, (adInfo) => listener(adInfo));
};

const removeAppOpenAdDisplayedEventListener = () => {
  removeEventListener(ON_APPOPEN_AD_DISPLAYED_EVENT);  
};

const addAppOpenAdFailedToDisplayEventListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT, (adInfo) => listener(adInfo));
};

const removeAppOpenAdFailedToDisplayEventListener = () => {
  removeEventListener(ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT);  
};

const addAppOpenAdHiddenEventListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_HIDDEN_EVENT, (adInfo) => listener(adInfo));
};

const removeAppOpenAdHiddenEventListener = () => {
  removeEventListener(ON_APPOPEN_AD_HIDDEN_EVENT);  
};

const addAppOpenAdRevenuePaidListener = (listener) => {
  addEventListener(ON_APPOPEN_AD_REVENUE_PAID, (adInfo) => listener(adInfo));
};

const removeAppOpenAdRevenuePaidListener = () => {
  removeEventListener(ON_APPOPEN_AD_REVENUE_PAID);  
};

export default {
  addEventListener,
  removeEventListener,

  addMRecAdLoadedEventListener,
  addMRecAdLoadFailedEventListener,
  addMRecAdClickedEventListener,
  addMRecAdCollapsedEventListener,
  addMRecAdExpandedEventListener,
  addMRecAdRevenuePaidListener,

  removeMRecAdLoadedEventListener,
  removeMRecAdLoadFailedEventListener,
  removeMRecAdClickedEventListener,
  removeMRecAdCollapsedEventListener,
  removeMRecAdExpandedEventListener,
  removeMRecAdRevenuePaidListener,

  addBannerAdLoadedEventListener,
  addBannerAdLoadFailedEventListener,
  addBannerAdClickedEventListener,
  addBannerAdCollapsedEventListener,
  addBannerAdExpandedEventListener,
  addBannerAdRevenuePaidListener,

  removeBannerAdLoadedEventListener,
  removeBannerAdLoadFailedEventListener,
  removeBannerAdClickedEventListener,
  removeBannerAdCollapsedEventListener,
  removeBannerAdExpandedEventListener,
  removeBannerAdRevenuePaidListener,

  addInterstitialLoadedEventListener,
  addInterstitialLoadFailedEventListener,
  addInterstitialClickedEventListener,
  addInterstitialDisplayedEventListener,
  addInterstitialAdFailedToDisplayEventListener,
  addInterstitialHiddenEventListener,
  addInterstitialAdRevenuePaidListener,

  removeInterstitialLoadedEventListener,
  removeInterstitialLoadFailedEventListener,
  removeInterstitialClickedEventListener,
  removeInterstitialDisplayedEventListener,
  removeInterstitialAdFailedToDisplayEventListener,
  removeInterstitialHiddenEventListener,
  removeInterstitialAdRevenuePaidListener,

  addRewardedAdLoadedEventListener,
  addRewardedAdLoadFailedEventListener,
  addRewardedAdClickedEventListener,
  addRewardedAdDisplayedEventListener,
  addRewardedAdFailedToDisplayEventListener,
  addRewardedAdHiddenEventListener,
  addRewardedAdReceivedRewardEventListener,
  addRewardedAdRevenuePaidListener,

  removeRewardedAdLoadedEventListener,
  removeRewardedAdLoadFailedEventListener,
  removeRewardedAdClickedEventListener,
  removeRewardedAdDisplayedEventListener,
  removeRewardedAdFailedToDisplayEventListener,
  removeRewardedAdHiddenEventListener,
  removeRewardedAdReceivedRewardEventListener,
  removeRewardedAdRevenuePaidListener,

  addAppOpenAdLoadedEventListener,
  addAppOpenAdLoadFailedEventListener,
  addAppOpenAdClickedEventListener,
  addAppOpenAdDisplayedEventListener,
  addAppOpenAdFailedToDisplayEventListener,
  addAppOpenAdHiddenEventListener,
  addAppOpenAdRevenuePaidListener,

  removeAppOpenAdLoadedEventListener,
  removeAppOpenAdLoadFailedEventListener,
  removeAppOpenAdClickedEventListener,
  removeAppOpenAdDisplayedEventListener,
  removeAppOpenAdFailedToDisplayEventListener,
  removeAppOpenAdHiddenEventListener,
  removeAppOpenAdRevenuePaidListener,
};
