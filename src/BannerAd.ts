import { NativeModules } from "react-native";
import { addEventListener, removeEventListener } from "./EventEmitter"
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./types/AdInfo";
import type { BannerAdInterface } from "./types/BannerAd";
import type { AdViewPosition } from "./types/AdViewProps";

const { AppLovinMAX } = NativeModules;

const {
    ON_BANNER_AD_LOADED_EVENT,
    ON_BANNER_AD_LOAD_FAILED_EVENT,
    ON_BANNER_AD_CLICKED_EVENT,
    ON_BANNER_AD_COLLAPSED_EVENT,
    ON_BANNER_AD_EXPANDED_EVENT,
    ON_BANNER_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

const create = (adUnitId: string, position: AdViewPosition, xOffset?: number, yOffset?: number): void => {
    AppLovinMAX.createBannerWithOffsets(adUnitId, position, xOffset ?? 0, yOffset ?? 0);
}

const setBackgroundColor = (adUnitId: string, hexColorCode: string): void => {
    AppLovinMAX.setBannerBackgroundColor(adUnitId, hexColorCode);
}

const setPlacement = (adUnitId: string, placement: string | null): void => {
    AppLovinMAX.setBannerPlacement(adUnitId, placement);
}

const setCustomData = (adUnitId: string, customData: string | null): void => {
    AppLovinMAX.setBannerCustomData(adUnitId, customData);
}

const setWidth = (adUnitId: string, width: number): void => {
    AppLovinMAX.setBannerWidth(adUnitId, width);
}

const updatePosition = (adUnitId: string, bannerPosition: AdViewPosition): void => {
    AppLovinMAX.updateBannerPosition(adUnitId, bannerPosition);
}

const updateOffsets = (adUnitId: string, xOffset: number, yOffset: number): void => {
    AppLovinMAX.updateBannerOffsets(adUnitId, xOffset, yOffset);
}

const setExtraParameter = (adUnitId: string, key: string, value: any): void => {
    AppLovinMAX.setBannerExtraParameter(adUnitId, key, value);
}

const setLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    AppLovinMAX.setBannerLocalExtraParameter(adUnitId, { [key]: value });
}

const startAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.startBannerAutoRefresh(adUnitId);
}

const stopAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.stopBannerAutoRefresh(adUnitId);
}

const show = (adUnitId: string): void => {
    AppLovinMAX.showBanner(adUnitId);
}

const hide = (adUnitId: string): void => {
    AppLovinMAX.hideBanner(adUnitId);
}

const destroy = (adUnitId: string): void => {
    AppLovinMAX.destroyBanner(adUnitId);
}

const getAdaptiveHeightForWidth = (width: number): Promise<number> => {
    return AppLovinMAX.getAdaptiveBannerHeightForWidth(width);
}

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdLoadedEventListener = () => {
    removeEventListener(ON_BANNER_AD_LOADED_EVENT);
}

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeAdLoadFailedEventListener = () => {
    removeEventListener(ON_BANNER_AD_LOAD_FAILED_EVENT);
}

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdClickedEventListener = () => {
    removeEventListener(ON_BANNER_AD_CLICKED_EVENT);
}

const addAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_COLLAPSED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdCollapsedEventListener = () => {
    removeEventListener(ON_BANNER_AD_COLLAPSED_EVENT);
}

const addAdExpandedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_BANNER_AD_EXPANDED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdExpandedEventListener = () => {
    removeEventListener(ON_BANNER_AD_EXPANDED_EVENT);
}

const addAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_BANNER_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeAdRevenuePaidListener = () => {
    removeEventListener(ON_BANNER_AD_REVENUE_PAID);
}

export const BannerAd: BannerAdInterface = {
    create,
    setBackgroundColor,
    setPlacement,
    setCustomData,
    setWidth,
    updatePosition,
    updateOffsets,

    setExtraParameter,
    setLocalExtraParameter,

    startAutoRefresh,
    stopAutoRefresh,
    show,
    hide,
    destroy,

    getAdaptiveHeightForWidth,

    addAdLoadedEventListener,
    addAdLoadFailedEventListener,
    addAdClickedEventListener,
    addAdCollapsedEventListener,
    addAdExpandedEventListener,
    addAdRevenuePaidListener,

    removeAdLoadedEventListener,
    removeAdLoadFailedEventListener,
    removeAdClickedEventListener,
    removeAdCollapsedEventListener,
    removeAdExpandedEventListener,
    removeAdRevenuePaidListener,
}

export default BannerAd;
