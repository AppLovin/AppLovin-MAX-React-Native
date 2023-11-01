import { NativeModules, NativeEventEmitter } from 'react-native';
import type { EventSubscription } from 'react-native';
import AppLovinMAX from './AppLovinMAX';
import { AdFormat } from './AdView';
import type { AdEventObject, AdEventListener } from './types/AdEvent';
import type { AdInfo, AdLoadFailedInfo, AdDisplayFailedInfo, AdRevenueInfo } from './types/AdInfo';
import type { AdViewAd } from './types/AdViewAd';
import type { LocalExtraParameterValue } from './types/AdProps';

const { AppLovinMAXAdViewAdManager } = NativeModules;

const {
    ON_ADVIEW_AD_LOADED_EVENT,
    ON_ADVIEW_AD_LOAD_FAILED_EVENT,
    ON_ADVIEW_AD_CLICKED_EVENT,
    ON_ADVIEW_AD_COLLAPSED_EVENT,
    ON_ADVIEW_AD_EXPANDED_EVENT,
    ON_ADVIEW_AD_DISPLAY_FAILED_EVENT,
    ON_ADVIEW_AD_REVENUE_PAID,
} = AppLovinMAXAdViewAdManager.getConstants();

type AdViewAdNativeModules = {
    createAdView(adUnitId: string, adFormat: AdFormat): Promise<number>;

    destroyAdView(adViewAdId: number): Promise<void>;

    loadAd(adViewAdId: number): Promise<void>;

    setPlacement(adViewAdId: number, placement: string | null): Promise<void>;

    setCustomData(adViewAdId: number, placement: string | null): Promise<void>;

    setAdaptiveBannerEnabled(adViewAdId: number, adaptiveBannerEnabled: boolean): Promise<void>;

    setAutoRefresh(adViewAdId: number, autoRefresh: boolean): Promise<void>;

    setExtraParameters(adViewAdId: number, extraParameters: Record<string, string | null>): Promise<void>;

    setLocalExtraParameters(
        adViewAdId: number,
        localExtraParameters: Record<string, LocalExtraParameterValue>
    ): Promise<void>;
};

const nativeMethods: AdViewAdNativeModules = AppLovinMAXAdViewAdManager;

const nativeEmitter = new NativeEventEmitter(AppLovinMAXAdViewAdManager);

const addEventListener = <T extends AdEventObject>(event: string, handler: AdEventListener<T>): EventSubscription => {
    return nativeEmitter.addListener(event, handler);
};

export type AdViewAdId = {
    // hidden from the user
    adViewAdId: number;
};

export type AdViewAdWithId = AdViewAd & AdViewAdId;

class AdViewAdImpl implements AdViewAdWithId {
    private _adViewAdId: number;
    private _adUnitId: string;
    private _adFormat: AdFormat;
    private _loadedEventListener: EventSubscription | null;
    private _loadFailedEventListener: EventSubscription | null;
    private _displayFailedEventListener: EventSubscription | null;
    private _clickedventListener: EventSubscription | null;
    private _collapsedEventListener: EventSubscription | null;
    private _expandedEventListener: EventSubscription | null;
    private _revenuePaidEventListener: EventSubscription | null;

    constructor(adUnitId: string, adFormat: AdFormat) {
        this._adViewAdId = 0;
        this._adUnitId = adUnitId;
        this._adFormat = adFormat;
        this._loadedEventListener = null;
        this._loadFailedEventListener = null;
        this._displayFailedEventListener = null;
        this._clickedventListener = null;
        this._collapsedEventListener = null;
        this._expandedEventListener = null;
        this._revenuePaidEventListener = null;
    }

    static async build(adUnitId: string, adFormat: AdFormat): Promise<AdViewAd> {
        const isInitialized = await AppLovinMAX.isInitialized();
        if (isInitialized) {
            const adView: AdViewAdWithId = new AdViewAdImpl(adUnitId, adFormat);
            adView.adViewAdId = await nativeMethods.createAdView(adView.adUnitId, adView.adFormat);
            adView.autoRefresh = true;
            adView.adaptiveBannerEnabled = true;
            return adView as AdViewAd;
        }
        return Promise.reject(new Error('Not initialized the AppLovinMAX React Native Module'));
    }

    set adViewAdId(adViewAdId: number) {
        this._adViewAdId = adViewAdId;
    }

    get adViewAdId(): number {
        return this._adViewAdId;
    }

    get adUnitId(): string {
        return this._adUnitId;
    }

    get adFormat(): AdFormat {
        return this._adFormat;
    }

    set placement(placement: string | null) {
        (async () => {
            return await nativeMethods.setPlacement(this._adViewAdId, placement);
        })();
    }

    set customData(customData: string | null) {
        (async () => {
            return await nativeMethods.setCustomData(this._adViewAdId, customData);
        })();
    }

    set adaptiveBannerEnabled(adaptiveBannerEnabled: boolean) {
        (async () => {
            return await nativeMethods.setAdaptiveBannerEnabled(this._adViewAdId, adaptiveBannerEnabled);
        })();
    }

    set autoRefresh(autoRefresh: boolean) {
        (async () => {
            return await nativeMethods.setAutoRefresh(this._adViewAdId, autoRefresh);
        })();
    }

    set extraParameters(extraParameters: { [key: string]: string | null }) {
        (async () => {
            return await nativeMethods.setExtraParameters(this._adViewAdId, extraParameters);
        })();
    }

    set localExtraParameters(localExtraParameters: { [key: string]: LocalExtraParameterValue }) {
        (async () => {
            return await nativeMethods.setLocalExtraParameters(this._adViewAdId, localExtraParameters);
        })();
    }

    loadAd(): void {
        nativeMethods.loadAd(this._adViewAdId);
    }

    destroy(): void {
        nativeMethods.destroyAdView(this._adViewAdId);
    }

    addAdLoadedEventListener = (listener: (adInfo: AdInfo) => void) => {
        this._loadedEventListener = addEventListener(ON_ADVIEW_AD_LOADED_EVENT, (adInfo: AdInfo & AdViewAdId) => {
            // Need to filter the event since the event name is global
            if (adInfo.adViewAdId == this._adViewAdId) {
                listener(adInfo);
            }
        });
    };

    addAdLoadFailedEventListener = (listener: (adInfo: AdLoadFailedInfo) => void) => {
        this._loadFailedEventListener = addEventListener(
            ON_ADVIEW_AD_LOAD_FAILED_EVENT,
            (adInfo: AdLoadFailedInfo & AdViewAdId) => {
                if (adInfo.adViewAdId == this._adViewAdId) {
                    listener(adInfo);
                }
            }
        );
    };

    addAdDisplayFailedEventListener(listener: AdEventListener<AdDisplayFailedInfo>): void {
        this._displayFailedEventListener = addEventListener(
            ON_ADVIEW_AD_DISPLAY_FAILED_EVENT,
            (adInfo: AdDisplayFailedInfo & AdViewAdId) => {
                if (adInfo.adViewAdId == this._adViewAdId) {
                    listener(adInfo);
                }
            }
        );
    }

    addAdClickedEventListener = (listener: (adInfo: AdInfo) => void) => {
        this._clickedventListener = addEventListener(ON_ADVIEW_AD_CLICKED_EVENT, (adInfo: AdInfo & AdViewAdId) => {
            if (adInfo.adViewAdId == this._adViewAdId) {
                listener(adInfo);
            }
        });
    };

    addAdCollapsedEventListener = (listener: (adInfo: AdInfo) => void) => {
        this._collapsedEventListener = addEventListener(ON_ADVIEW_AD_COLLAPSED_EVENT, (adInfo: AdInfo & AdViewAdId) => {
            if (adInfo.adViewAdId == this._adViewAdId) {
                listener(adInfo);
            }
        });
    };

    addAdExpandedEventListener = (listener: (adInfo: AdInfo) => void) => {
        this._expandedEventListener = addEventListener(ON_ADVIEW_AD_EXPANDED_EVENT, (adInfo: AdInfo & AdViewAdId) => {
            if (adInfo.adViewAdId == this._adViewAdId) {
                listener(adInfo);
            }
        });
    };

    addAdRevenuePaidListener = (listener: (adInfo: AdRevenueInfo) => void) => {
        this._revenuePaidEventListener = addEventListener(
            ON_ADVIEW_AD_REVENUE_PAID,
            (adInfo: AdRevenueInfo & AdViewAdId) => {
                if (adInfo.adViewAdId == this._adViewAdId) {
                    listener(adInfo);
                }
            }
        );
    };

    removeAdLoadedEventListener() {
        this._loadedEventListener?.remove();
    }

    removeAdLoadFailedEventListener() {
        this._loadFailedEventListener?.remove();
    }

    removeAdDisplayFailedEventListener() {
        this._displayFailedEventListener?.remove();
    }

    removeAdClickedEventListener() {
        this._clickedventListener?.remove();
    }

    removeAdCollapsedEventListener() {
        this._collapsedEventListener?.remove();
    }

    removeAdExpandedEventListener() {
        this._expandedEventListener?.remove();
    }

    removeAdRevenuePaidListener() {
        this._revenuePaidEventListener?.remove();
    }
}

/**
 * Creates {@link AdViewAd} that loads a view-based ad (i.e. Banner or MREC) for {@link AdView}.
 *
 * You can create {@link AdViewAd} earlier and pass it to {@link AdView} when you mount
 * {@link AdView} for quick ad display.
 *
 * @param adUnitId The ad unit ID to load an ad for.
 * @param adFormat An enum value representing the ad format to load ads for. Should be either {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
 * @returns AdViewAd An ad object for you to pass to {@link AdView}.
 */
export const createAdViewAd = (adUnitId: string, adFormat: AdFormat): Promise<AdViewAd> => {
    return AdViewAdImpl.build(adUnitId, adFormat);
};
