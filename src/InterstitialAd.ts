import { NativeModules } from "react-native";
import { addEventListener, removeEventListener } from "./EventEmitter"
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./types/AdInfo";
import type { InterstitialAdInterface } from "./types/InterstitialAd";

const { AppLovinMAX } = NativeModules;

const {
    ON_INTERSTITIAL_LOADED_EVENT,
    ON_INTERSTITIAL_LOAD_FAILED_EVENT,
    ON_INTERSTITIAL_CLICKED_EVENT,
    ON_INTERSTITIAL_DISPLAYED_EVENT,
    ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT,
    ON_INTERSTITIAL_HIDDEN_EVENT,
    ON_INTERSTITIAL_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

const load = (adUnitId: string): void => {
    AppLovinMAX.loadInterstitial(adUnitId);
}

const isReady = (adUnitId: string): Promise<boolean> => {
    return AppLovinMAX.isInterstitialReady(adUnitId);
}

const show = (
    adUnitId: string,
    placement?: string | null,
    customData?: string | null
): void => {
    AppLovinMAX.showInterstitial(adUnitId, placement ?? null, customData ?? null);
}

const setExtraParameter = (adUnitId: string, key: string, value: any): void => {
    AppLovinMAX.setInterstitialExtraParameter(adUnitId, key, value);
}

const setLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    AppLovinMAX.setInterstitialLocalExtraParameter(adUnitId, { [key]: value });
}

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdLoadedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_LOADED_EVENT);
}

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeAdLoadFailedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT);
}

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdClickedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_CLICKED_EVENT);
}

const addAdDisplayedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdDisplayedEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT);
}

const addAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT, (errorInfo: AdDisplayFailedInfo) => listener(errorInfo));
}

const removeAdFailedToDisplayEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT);
}

const addAdHiddenEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_HIDDEN_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdHiddenEventListener = () => {
    removeEventListener(ON_INTERSTITIAL_HIDDEN_EVENT);
}

const addAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeAdRevenuePaidListener = () => {
    removeEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID);
}

export const InterstitialAd: InterstitialAdInterface = {
    load,
    isReady,
    show,

    setExtraParameter,
    setLocalExtraParameter,

    addAdLoadedEventListener,
    addAdLoadFailedEventListener,
    addAdClickedEventListener,
    addAdDisplayedEventListener,
    addAdFailedToDisplayEventListener,
    addAdHiddenEventListener,
    addAdRevenuePaidListener,

    removeAdLoadedEventListener,
    removeAdLoadFailedEventListener,
    removeAdClickedEventListener,
    removeAdDisplayedEventListener,
    removeAdFailedToDisplayEventListener,
    removeAdHiddenEventListener,
    removeAdRevenuePaidListener,
}

export default InterstitialAd;
