import { NativeModules } from "react-native";
import { addEventListener, removeEventListener } from "./EventEmitter"
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./types/AdInfo";
import type { MRecAdInterface } from "./types/MRecAd";
import type { AdViewPosition } from "./types/AdViewProps";

const { AppLovinMAX } = NativeModules;

const {
    ON_MREC_AD_LOADED_EVENT,
    ON_MREC_AD_LOAD_FAILED_EVENT,
    ON_MREC_AD_CLICKED_EVENT,
    ON_MREC_AD_COLLAPSED_EVENT,
    ON_MREC_AD_EXPANDED_EVENT,
    ON_MREC_AD_REVENUE_PAID,
} = AppLovinMAX.getConstants();

const create = (adUnitId: string, position: AdViewPosition): void => {
    AppLovinMAX.createMRec(adUnitId, position);
}

const setPlacement = (adUnitId: string, placement: string | null): void => {
    AppLovinMAX.setMRecPlacement(adUnitId, placement);
}

const setCustomData = (adUnitId: string, customData: string | null): void => {
    AppLovinMAX.setMRecCustomData(adUnitId, customData);
}

const updatePosition = (adUnitId: string, bannerPosition: AdViewPosition): void => {
    AppLovinMAX.updateMRecPosition(adUnitId, bannerPosition);
}

const setExtraParameter = (adUnitId: string, key: string, value: any): void => {
    AppLovinMAX.setMRecExtraParameter(adUnitId, key, value);
}

const setLocalExtraParameter = (adUnitId: string, key: string, value: any): void => {
    AppLovinMAX.setMRecLocalExtraParameter(adUnitId, { [key]: value });
}

const startAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.startMRecAutoRefresh(adUnitId);
}

const stopAutoRefresh = (adUnitId: string): void => {
    AppLovinMAX.stopMRecAutoRefresh(adUnitId);
}

const show = (adUnitId: string): void => {
    AppLovinMAX.showMRec(adUnitId);
}

const hide = (adUnitId: string): void => {
    AppLovinMAX.hideMRec(adUnitId);
}

const destroy = (adUnitId: string): void => {
    AppLovinMAX.destroyMRec(adUnitId);
}

const addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_LOADED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdLoadedEventListener = () => {
    removeEventListener(ON_MREC_AD_LOADED_EVENT);
}

const addAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void) => {
    addEventListener(ON_MREC_AD_LOAD_FAILED_EVENT, (errorInfo: AdLoadFailedInfo) => listener(errorInfo));
}

const removeAdLoadFailedEventListener = () => {
    removeEventListener(ON_MREC_AD_LOAD_FAILED_EVENT);
}

const addAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_CLICKED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdClickedEventListener = () => {
    removeEventListener(ON_MREC_AD_CLICKED_EVENT);
}

const addAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_COLLAPSED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdCollapsedEventListener = () => {
    removeEventListener(ON_MREC_AD_COLLAPSED_EVENT);
}

const addAdExpandedEventListener = (listener: (adInfo: AdInfo) => void) => {
    addEventListener(ON_MREC_AD_EXPANDED_EVENT, (adInfo: AdInfo) => listener(adInfo));
}

const removeAdExpandedEventListener = () => {
    removeEventListener(ON_MREC_AD_EXPANDED_EVENT);
}

const addAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
    addEventListener(ON_MREC_AD_REVENUE_PAID, (adInfo: AdRevenueInfo) => listener(adInfo));
}

const removeAdRevenuePaidListener = () => {
    removeEventListener(ON_MREC_AD_REVENUE_PAID);
}

export const MRecAd: MRecAdInterface = {
    create,
    setPlacement,
    setCustomData,
    updatePosition,

    setExtraParameter,
    setLocalExtraParameter,

    startAutoRefresh,
    stopAutoRefresh,
    show,
    hide,
    destroy,

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

export default MRecAd;
