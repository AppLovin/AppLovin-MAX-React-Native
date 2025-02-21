import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdInfo, AdLoadFailedInfo } from './types/AdInfo';
import type { LocalExtraParameterValue } from './types/AdProps';
import type { MRecAdType } from './types/MRecAd';
import type { AdViewPosition } from './AdView';
import AppLovinMAX from './specs/NativeAppLovinMAXModule';

const { ON_MREC_AD_LOADED_EVENT, ON_MREC_AD_LOAD_FAILED_EVENT, ON_MREC_AD_CLICKED_EVENT, ON_MREC_AD_COLLAPSED_EVENT, ON_MREC_AD_EXPANDED_EVENT, ON_MREC_AD_REVENUE_PAID } =
    AppLovinMAX.getConstants();

const createAd = (adUnitId: string, position: AdViewPosition): void => {
    AppLovinMAX.createMRec(adUnitId, position);
};

const destroyAd = (adUnitId: string): void => {
    AppLovinMAX.destroyMRec(adUnitId);
};

const showAd = (adUnitId: string): void => {
    AppLovinMAX.showMRec(adUnitId);
};

const hideAd = (adUnitId: string): void => {
    AppLovinMAX.hideMRec(adUnitId);
};

const setPlacement = (adUnitId: string, placement: string | null): void => {
    AppLovinMAX.setMRecPlacement(adUnitId, placement);
};

const setCustomData = (adUnitId: string, customData: string | null): void => {
    AppLovinMAX.setMRecCustomData(adUnitId, customData);
};

const updatePosition = (adUnitId: string, bannerPosition: AdViewPosition): void => {
    AppLovinMAX.updateMRecPosition(adUnitId, bannerPosition);
};

const setExtraParameter = (adUnitId: string, key: string, value: string | null): void => {
    AppLovinMAX.setMRecExtraParameter(adUnitId, key, value);
};

const setLocalExtraParameter = (adUnitId: string, key: string, value: LocalExtraParameterValue): void => {
    AppLovinMAX.setMRecLocalExtraParameter(adUnitId, { [key]: value });
};

const startAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.startMRecAutoRefresh(adUnitId);
};

const stopAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.stopMRecAutoRefresh(adUnitId);
};

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_MREC_AD_LOADED_EVENT, listener);
};

const removeAdLoadedEventListener = (): void => {
    removeEventListener(ON_MREC_AD_LOADED_EVENT);
};

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void): void => {
    addEventListener(ON_MREC_AD_LOAD_FAILED_EVENT, listener);
};

const removeAdLoadFailedEventListener = (): void => {
    removeEventListener(ON_MREC_AD_LOAD_FAILED_EVENT);
};

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_MREC_AD_CLICKED_EVENT, listener);
};

const removeAdClickedEventListener = (): void => {
    removeEventListener(ON_MREC_AD_CLICKED_EVENT);
};

const addAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_MREC_AD_COLLAPSED_EVENT, listener);
};

const removeAdCollapsedEventListener = (): void => {
    removeEventListener(ON_MREC_AD_COLLAPSED_EVENT);
};

const addAdExpandedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_MREC_AD_EXPANDED_EVENT, listener);
};

const removeAdExpandedEventListener = (): void => {
    removeEventListener(ON_MREC_AD_EXPANDED_EVENT);
};

const addAdRevenuePaidListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_MREC_AD_REVENUE_PAID, listener);
};

const removeAdRevenuePaidListener = (): void => {
    removeEventListener(ON_MREC_AD_REVENUE_PAID);
};

export const MRecAd: MRecAdType = {
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
};

export default MRecAd;
