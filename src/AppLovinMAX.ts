import { NativeModules, NativeEventEmitter } from "react-native";
import type { EventSubscription } from "react-native";
import type { AdEventObject, AdEventListener } from "./types/AdEvent";
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdRewardInfo } from "./types/AdInfo";
import type { Configuration, AppLovinMAXType } from "./types/AppLovinMAX";

const NativeModule = NativeModules.AppLovinMAX;

const VERSION = "6.0.0";

const {
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

    ON_BANNER_AD_LOADED_EVENT,
    ON_BANNER_AD_LOAD_FAILED_EVENT,
    ON_BANNER_AD_CLICKED_EVENT,
    ON_BANNER_AD_COLLAPSED_EVENT,
    ON_BANNER_AD_EXPANDED_EVENT,
    ON_BANNER_AD_REVENUE_PAID,

    ON_MREC_AD_LOADED_EVENT,
    ON_MREC_AD_LOAD_FAILED_EVENT,
    ON_MREC_AD_CLICKED_EVENT,
    ON_MREC_AD_COLLAPSED_EVENT,
    ON_MREC_AD_EXPANDED_EVENT,
    ON_MREC_AD_REVENUE_PAID,
} = NativeModule.getConstants();

/*----------------*/
/* Event listener */
/*----------------*/

const emitter = new NativeEventEmitter(NativeModule);
const subscriptions: Record<string, EventSubscription> = {};

const addEventListener = <T extends AdEventObject>(event: string, handler: AdEventListener<T>) => {
    let subscription: EventSubscription = emitter.addListener(event, handler);
    let currentSubscription = subscriptions[event];
    if (currentSubscription) {
        currentSubscription.remove();
    }
    subscriptions[event] = subscription;
}

const removeEventListener = (event: string) => {
    let currentSubscription = subscriptions[event];
    if (currentSubscription) {
        currentSubscription.remove();
        delete subscriptions[event];
    }
}

/*--------------*/
/* Interstitial */
/*--------------*/

const showInterstitial = (
    adUnitId: string,
    placement?: string | null,
    customData?: string | null
): void => {
    NativeModule.showInterstitial(adUnitId, placement ?? undefined, customData ?? undefined);
}

const setInterstitialLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    NativeModule.setInterstitialLocalExtraParameter(adUnitId, { [key]: value });
}

const addInterstitialLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeInterstitialLoadedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_LOADED_EVENT);
}

const addInterstitialLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeInterstitialLoadFailedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT);
}

const addInterstitialClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeInterstitialClickedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_CLICKED_EVENT);
}

const addInterstitialDisplayedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeInterstitialDisplayedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT);
}

const addInterstitialAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT, (errorInfo: AdDisplayFailedInfo) => listener(errorInfo));
}

const removeInterstitialAdFailedToDisplayEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT);
}

const addInterstitialHiddenEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_HIDDEN_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeInterstitialHiddenEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_HIDDEN_EVENT);
}

const addInterstitialAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeInterstitialAdRevenuePaidListener = () => {
    removeEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID);
}

/*----------*/
/* Rewarded */
/*----------*/

const showRewardedAd = (
    adUnitId: string,
    placement?: string | null,
    customData?: string | null
): void => {
    NativeModule.showRewardedAd(adUnitId, placement ?? undefined, customData ?? undefined);
}

const setRewardedAdLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    NativeModule.setRewardedAdLocalExtraParameter(adUnitId, { [key]: value });
}

const addRewardedAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_REWARDED_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeRewardedAdLoadedEventListener = () => {
    removeEventListener(ON_REWARDED_AD_LOADED_EVENT);
}

const addRewardedAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_REWARDED_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeRewardedAdLoadFailedEventListener = () => {
    removeEventListener(ON_REWARDED_AD_LOAD_FAILED_EVENT);
}

const addRewardedAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_REWARDED_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeRewardedAdClickedEventListener = () => {
    removeEventListener(ON_REWARDED_AD_CLICKED_EVENT);
}

const addRewardedAdDisplayedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_REWARDED_AD_DISPLAYED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeRewardedAdDisplayedEventListener = () => {
    removeEventListener(ON_REWARDED_AD_DISPLAYED_EVENT);
}

const addRewardedAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void) => {
    addEventListener(ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT, (errorInfo: AdDisplayFailedInfo) => listener(errorInfo));
}

const removeRewardedAdFailedToDisplayEventListener = () => {
    removeEventListener(ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT);
}

const addRewardedAdHiddenEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_REWARDED_AD_HIDDEN_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeRewardedAdHiddenEventListener = () => {
    removeEventListener(ON_REWARDED_AD_HIDDEN_EVENT);
}

const addRewardedAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_REWARDED_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeRewardedAdRevenuePaidListener = () => {
    removeEventListener(ON_REWARDED_AD_REVENUE_PAID);
}

const addRewardedAdReceivedRewardEventListener = (listener: (adInfo: AdRewardInfo) => void) => {
    addEventListener(ON_REWARDED_AD_RECEIVED_REWARD_EVENT, (adInfo: AdRewardInfo) => listener(adInfo));
}

const removeRewardedAdReceivedRewardEventListener = () => {
    removeEventListener(ON_REWARDED_AD_RECEIVED_REWARD_EVENT);
}

/*---------*/
/* AppOpen */
/*---------*/

const showAppOpenAd = (
    adUnitId: string,
    placement?: string | null,
    customData?: string | null
): void => {
    NativeModule.showAppOpenAd(adUnitId, placement ?? undefined, customData ?? undefined);
}

const setAppOpenAdLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    NativeModule.setAppOpenAdLocalExtraParameter(adUnitId, { [key]: value });
}

const addAppOpenAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAppOpenAdLoadedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_LOADED_EVENT);
}

const addAppOpenAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeAppOpenAdLoadFailedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_LOAD_FAILED_EVENT);
}

const addAppOpenAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAppOpenAdClickedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_CLICKED_EVENT);
}

const addAppOpenAdDisplayedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_DISPLAYED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAppOpenAdDisplayedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_DISPLAYED_EVENT);
}

const addAppOpenAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT, (errorInfo: AdDisplayFailedInfo) => listener(errorInfo));
}

const removeAppOpenAdFailedToDisplayEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT);
}

const addAppOpenAdHiddenEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_HIDDEN_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAppOpenAdHiddenEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_HIDDEN_EVENT);
}

const addAppOpenAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeAppOpenAdRevenuePaidListener = () => {
    removeEventListener(ON_APPOPEN_AD_REVENUE_PAID);
}

/*--------*/
/* Banner */
/*--------*/

const setBannerLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    NativeModule.setBannerLocalExtraParameter(adUnitId, { [key]: value });
}

const addBannerAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeBannerAdLoadedEventListener = () => {
    removeEventListener(ON_BANNER_AD_LOADED_EVENT);
}

const addBannerAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeBannerAdLoadFailedEventListener = () => {
    removeEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT);
}

const addBannerAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeBannerAdClickedEventListener = () => {
    removeEventListener(ON_BANNER_AD_CLICKED_EVENT);
}

const addBannerAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_COLLAPSED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeBannerAdCollapsedEventListener = () => {
    removeEventListener(ON_BANNER_AD_COLLAPSED_EVENT);
}

const addBannerAdExpandedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_EXPANDED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeBannerAdExpandedEventListener = () => {
    removeEventListener(ON_BANNER_AD_EXPANDED_EVENT);
}

const addBannerAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_BANNER_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeBannerAdRevenuePaidListener = () => {
    removeEventListener(ON_BANNER_AD_REVENUE_PAID);
}

/*------*/
/* MREC */
/*------*/

const setMRecLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    NativeModule.setMRecLocalExtraParameter(adUnitId, { [key]: value });
}

const addMRecAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeMRecAdLoadedEventListener = () => {
    removeEventListener(ON_MREC_AD_LOADED_EVENT);
}

const addMRecAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_MREC_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeMRecAdLoadFailedEventListener = () => {
    removeEventListener(ON_MREC_AD_LOAD_FAILED_EVENT);
}

const addMRecAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeMRecAdClickedEventListener = () => {
    removeEventListener(ON_MREC_AD_CLICKED_EVENT);
}

const addMRecAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_COLLAPSED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeMRecAdCollapsedEventListener = () => {
    removeEventListener(ON_MREC_AD_COLLAPSED_EVENT);
}

const addMRecAdExpandedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_EXPANDED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeMRecAdExpandedEventListener = () => {
    removeEventListener(ON_MREC_AD_EXPANDED_EVENT);
}

const addMRecAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_MREC_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeMRecAdRevenuePaidListener = () => {
    removeEventListener(ON_MREC_AD_REVENUE_PAID);
}

/*------------*/
/* initialize */
/*------------*/

const initialize = async (
    sdkKey: string
): Promise<Configuration> => {
    return NativeModule.initialize(VERSION, sdkKey);
}

/*-------------*/
/* AppLovinMAX */
/*-------------*/

type NativeAppLovinMAXType = Omit<
    AppLovinMAXType,
    | 'initialize'
    | 'showInterstitial'
    | 'showRewardedAd'
    | 'showAppOpenAd'
    | 'setInterstitialLocalExtraParameter'
    | 'setRewardedAdLocalExtraParameter'
    | 'setAppOpenAdLocalExtraParameter'
    | 'setBannerLocalExtraParameter'
    | 'setMRecLocalExtraParameter'
>;

const nativeMethods: NativeAppLovinMAXType = NativeModule;

export const AppLovinMAX: AppLovinMAXType = {
    ...nativeMethods,

    initialize,

    showInterstitial,
    setInterstitialLocalExtraParameter,

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

    showRewardedAd,
    setRewardedAdLocalExtraParameter,

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

    showAppOpenAd,
    setAppOpenAdLocalExtraParameter,

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

    setBannerLocalExtraParameter,

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

    setMRecLocalExtraParameter,

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
}

export default AppLovinMAX;
