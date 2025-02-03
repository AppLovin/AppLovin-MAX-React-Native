import { NativeModules } from 'react-native';
import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo } from './types/AdInfo';
import type { LocalExtraParameterValue } from './types/AdProps';
import type { InterstitialAdType } from './types/InterstitialAd';

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

const isAdReady = (adUnitId: string): Promise<boolean> => {
    return AppLovinMAX.isInterstitialReady(adUnitId);
};

const loadAd = (adUnitId: string): void => {
    AppLovinMAX.loadInterstitial(adUnitId);
};

const showAd = (adUnitId: string, placement?: string | null, customData?: string | null): void => {
    AppLovinMAX.showInterstitial(adUnitId, placement ?? null, customData ?? null);
};

const setExtraParameter = (adUnitId: string, key: string, value: string | null): void => {
    AppLovinMAX.setInterstitialExtraParameter(adUnitId, key, value);
};

const setLocalExtraParameter = (adUnitId: string, key: string, value: LocalExtraParameterValue): void => {
    AppLovinMAX.setInterstitialLocalExtraParameter(adUnitId, { [key]: value });
};

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_LOADED_EVENT, listener);
};

const removeAdLoadedEventListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_LOADED_EVENT);
};

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT, listener);
};

const removeAdLoadFailedEventListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_LOAD_FAILED_EVENT);
};

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_CLICKED_EVENT, listener);
};

const removeAdClickedEventListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_CLICKED_EVENT);
};

const addAdDisplayedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT, listener);
};

const removeAdDisplayedEventListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_DISPLAYED_EVENT);
};

const addAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT, listener);
};

const removeAdFailedToDisplayEventListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT);
};

const addAdHiddenEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_HIDDEN_EVENT, listener);
};

const removeAdHiddenEventListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_HIDDEN_EVENT);
};

const addAdRevenuePaidListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID, listener);
};

const removeAdRevenuePaidListener = (): void => {
    removeEventListener(ON_INTERSTITIAL_AD_REVENUE_PAID);
};

export const InterstitialAd: InterstitialAdType = {
    isAdReady,
    loadAd,
    showAd,

    setExtraParameter,
    setLocalExtraParameter,

    addAdLoadedEventListener,
    removeAdLoadedEventListener,

    addAdLoadFailedEventListener,
    removeAdLoadFailedEventListener,

    addAdClickedEventListener,
    removeAdClickedEventListener,

    addAdDisplayedEventListener,
    removeAdDisplayedEventListener,

    addAdFailedToDisplayEventListener,
    removeAdFailedToDisplayEventListener,

    addAdHiddenEventListener,
    removeAdHiddenEventListener,

    addAdRevenuePaidListener,
    removeAdRevenuePaidListener,
};

export default InterstitialAd;
