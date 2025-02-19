import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRewardInfo } from './types/AdInfo';
import type { LocalExtraParameterValue } from './types/AdProps';
import type { RewardedAdType } from './types/RewardedAd';
import AppLovinMAX from './specs/NativeAppLovinMAXModule';

const {
    ON_REWARDED_AD_LOADED_EVENT,
    ON_REWARDED_AD_LOAD_FAILED_EVENT,
    ON_REWARDED_AD_CLICKED_EVENT,
    ON_REWARDED_AD_DISPLAYED_EVENT,
    ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT,
    ON_REWARDED_AD_HIDDEN_EVENT,
    ON_REWARDED_AD_RECEIVED_REWARD_EVENT,
    ON_REWARDED_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

const isAdReady = (adUnitId: string): Promise<boolean> => {
    return AppLovinMAX.isRewardedAdReady(adUnitId);
};

const loadAd = (adUnitId: string): void => {
    AppLovinMAX.loadRewardedAd(adUnitId);
};

const showAd = (adUnitId: string, placement?: string | null, customData?: string | null): void => {
    AppLovinMAX.showRewardedAd(adUnitId, placement ?? undefined, customData ?? undefined);
};

const setExtraParameter = (adUnitId: string, key: string, value: string | null): void => {
    AppLovinMAX.setRewardedAdExtraParameter(adUnitId, key, value);
};

const setLocalExtraParameter = (adUnitId: string, key: string, value: LocalExtraParameterValue): void => {
    AppLovinMAX.setRewardedAdLocalExtraParameter(adUnitId, { [key]: value });
};

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_LOADED_EVENT, listener);
};

const removeAdLoadedEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_LOADED_EVENT);
};

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_LOAD_FAILED_EVENT, listener);
};

const removeAdLoadFailedEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_LOAD_FAILED_EVENT);
};

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_CLICKED_EVENT, listener);
};

const removeAdClickedEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_CLICKED_EVENT);
};

const addAdDisplayedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_DISPLAYED_EVENT, listener);
};

const removeAdDisplayedEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_DISPLAYED_EVENT);
};

const addAdFailedToDisplayEventListener = (listener: (errorInfo: AdDisplayFailedInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT, listener);
};

const removeAdFailedToDisplayEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT);
};

const addAdHiddenEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_HIDDEN_EVENT, listener);
};

const removeAdHiddenEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_HIDDEN_EVENT);
};

const addAdRevenuePaidListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_REVENUE_PAID, listener);
};

const removeAdRevenuePaidListener = (): void => {
    removeEventListener(ON_REWARDED_AD_REVENUE_PAID);
};

// Rewarded specific APIs

const addAdReceivedRewardEventListener = (listener: (adInfo: AdRewardInfo) => void): void => {
    addEventListener(ON_REWARDED_AD_RECEIVED_REWARD_EVENT, listener);
};

const removeAdReceivedRewardEventListener = (): void => {
    removeEventListener(ON_REWARDED_AD_RECEIVED_REWARD_EVENT);
};

export const RewardedAd: RewardedAdType = {
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

    // Rewarded specific APIs

    addAdReceivedRewardEventListener,
    removeAdReceivedRewardEventListener,
};

export default RewardedAd;
