import { NativeModules } from 'react-native';
import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from './types/AdInfo';
import type { LocalExtraParameterValue } from './types/AdProps';
import type { AppOpenAdType } from './types/AppOpenAd';

const { AppLovinMAX } = NativeModules;

const {
    ON_APPOPEN_AD_LOADED_EVENT,
    ON_APPOPEN_AD_LOAD_FAILED_EVENT,
    ON_APPOPEN_AD_CLICKED_EVENT,
    ON_APPOPEN_AD_DISPLAYED_EVENT,
    ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT,
    ON_APPOPEN_AD_HIDDEN_EVENT,
    ON_APPOPEN_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

const isAdReady = (adUnitId: string): Promise<boolean> => {
    return AppLovinMAX.isAppOpenAdReady(adUnitId);
};

const loadAd = (adUnitId: string): void => {
    AppLovinMAX.loadAppOpenAd(adUnitId);
};

const showAd = (adUnitId: string, placement?: string | null, customData?: string | null): void => {
    AppLovinMAX.showAppOpenAd(adUnitId, placement ?? undefined, customData ?? undefined);
};

const setExtraParameter = (adUnitId: string, key: string, value: string | null): void => {
    AppLovinMAX.setAppOpenAdExtraParameter(adUnitId, key, value);
};

const setLocalExtraParameter = (adUnitId: string, key: string, value: LocalExtraParameterValue): void => {
    AppLovinMAX.setAppOpenAdLocalExtraParameter(adUnitId, { [key]: value });
};

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdLoadedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_LOADED_EVENT);
};

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
};

const removeAdLoadFailedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_LOAD_FAILED_EVENT);
};

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdClickedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_CLICKED_EVENT);
};

const addAdDisplayedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_DISPLAYED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdDisplayedEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_DISPLAYED_EVENT);
};

const addAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT, (errorInfo: AdDisplayFailedInfo) => listener(errorInfo));
};

const removeAdFailedToDisplayEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT);
};

const addAdHiddenEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_HIDDEN_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdHiddenEventListener = () => {
    removeEventListener(ON_APPOPEN_AD_HIDDEN_EVENT);
};

const addAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_APPOPEN_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
};

const removeAdRevenuePaidListener = () => {
    removeEventListener(ON_APPOPEN_AD_REVENUE_PAID);
};

export const AppOpenAd: AppOpenAdType = {
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

export default AppOpenAd;
