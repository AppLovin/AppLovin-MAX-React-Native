import { NativeModules } from 'react-native';
import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from './types/AdInfo';
import type { LocalExtraParameterValue } from './types/AdProps';
import type { BannerAdType } from './types/BannerAd';
import type { AdViewPosition } from './AdView';

const { AppLovinMAX } = NativeModules;

const {
    ON_BANNER_AD_LOADED_EVENT,
    ON_BANNER_AD_LOAD_FAILED_EVENT,
    ON_BANNER_AD_CLICKED_EVENT,
    ON_BANNER_AD_COLLAPSED_EVENT,
    ON_BANNER_AD_EXPANDED_EVENT,
    ON_BANNER_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

const createAd = (adUnitId: string, position: AdViewPosition, xOffset?: number, yOffset?: number): void => {
    AppLovinMAX.createBannerWithOffsets(adUnitId, position, xOffset ?? 0, yOffset ?? 0);
    AppLovinMAX.setBannerExtraParameter(adUnitId, 'adaptive_banner', 'true');
};

const destroyAd = (adUnitId: string): void => {
    AppLovinMAX.destroyBanner(adUnitId);
};

const showAd = (adUnitId: string): void => {
    AppLovinMAX.showBanner(adUnitId);
};

const hideAd = (adUnitId: string): void => {
    AppLovinMAX.hideBanner(adUnitId);
};

const setPlacement = (adUnitId: string, placement: string | null): void => {
    AppLovinMAX.setBannerPlacement(adUnitId, placement);
};

const setCustomData = (adUnitId: string, customData: string | null): void => {
    AppLovinMAX.setBannerCustomData(adUnitId, customData);
};

const updatePosition = (adUnitId: string, bannerPosition: AdViewPosition): void => {
    AppLovinMAX.updateBannerPosition(adUnitId, bannerPosition);
};

const setExtraParameter = (adUnitId: string, key: string, value: string | null): void => {
    AppLovinMAX.setBannerExtraParameter(adUnitId, key, value);
};

const setLocalExtraParameter = (adUnitId: string, key: string, value: LocalExtraParameterValue): void => {
    AppLovinMAX.setBannerLocalExtraParameter(adUnitId, { [key]: value });
};

const startAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.startBannerAutoRefresh(adUnitId);
};

const stopAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.stopBannerAutoRefresh(adUnitId);
};

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_BANNER_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdLoadedEventListener = (): void => {
    removeEventListener(ON_BANNER_AD_LOADED_EVENT);
};

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void): void => {
    addEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
};

const removeAdLoadFailedEventListener = (): void => {
    removeEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT);
};

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_BANNER_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdClickedEventListener = (): void => {
    removeEventListener(ON_BANNER_AD_CLICKED_EVENT);
};

const addAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_BANNER_AD_COLLAPSED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdCollapsedEventListener = (): void => {
    removeEventListener(ON_BANNER_AD_COLLAPSED_EVENT);
};

const addAdExpandedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_BANNER_AD_EXPANDED_EVENT, (adInfo: AdInfo) => listener(adInfo));
};

const removeAdExpandedEventListener = (): void => {
    removeEventListener(ON_BANNER_AD_EXPANDED_EVENT);
};

const addAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void): void => {
    addEventListener(ON_BANNER_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
};

const removeAdRevenuePaidListener = (): void => {
    removeEventListener(ON_BANNER_AD_REVENUE_PAID);
};

// Banner specific APIs

const setBackgroundColor = (adUnitId: string, hexColorCode: string): void => {
    AppLovinMAX.setBannerBackgroundColor(adUnitId, hexColorCode);
};

const setWidth = (adUnitId: string, width: number): void => {
    AppLovinMAX.setBannerWidth(adUnitId, width);
};

const updateOffsets = (adUnitId: string, xOffset: number, yOffset: number): void => {
    AppLovinMAX.updateBannerOffsets(adUnitId, xOffset, yOffset);
};

const getAdaptiveHeightForWidth = (width: number): Promise<number> => {
    return AppLovinMAX.getAdaptiveBannerHeightForWidth(width);
};

export const BannerAd: BannerAdType = {
    createAd,
    destroyAd,

    showAd,
    hideAd,

    setPlacement,
    setCustomData,

    updatePosition,

    setExtraParameter,
    setLocalExtraParameter,

    startAutoRefresh,
    stopAutoRefresh,

    addAdLoadedEventListener,
    removeAdLoadedEventListener,

    addAdLoadFailedEventListener,
    removeAdLoadFailedEventListener,

    addAdClickedEventListener,
    removeAdClickedEventListener,

    addAdCollapsedEventListener,
    removeAdCollapsedEventListener,

    addAdExpandedEventListener,
    removeAdExpandedEventListener,

    addAdRevenuePaidListener,
    removeAdRevenuePaidListener,

    // Banner specific APIs

    setBackgroundColor,

    setWidth,

    updateOffsets,

    getAdaptiveHeightForWidth,
};

export default BannerAd;
