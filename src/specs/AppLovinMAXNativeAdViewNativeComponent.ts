import type { HostComponent, ViewProps } from 'react-native';
import type { Int32, Double, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type AdNativeInfoEvent = Readonly<{
    nativeAd: Readonly<{
        title?: string;
        advertiser?: string;
        body?: string;
        callToAction?: string;
        image?: boolean;
        url?: string;
        starRating?: Double;
        isOptionsViewAvailable: boolean;
        isMediaViewAvailable: boolean;
    }>;
    adInfo: Readonly<{
        adUnitId: string;
        adFormat: string;
        networkName: string;
        networkPlacement: string;
        creativeId?: string | null;
        placement?: string | null;
        revenue: Double;
        revenuePrecision: string;
        dspName?: string | null;
        latencyMillis: Int32;
        nativeAd?: Readonly<{
            title?: string;
            advertiser?: string;
            body?: string;
            callToAction?: string;
            starRating?: Double;
            mediaContentAspectRatio?: Double;
            isIconImageAvailable: boolean;
            isOptionsViewAvailable: boolean;
            isMediaViewAvailable: boolean;
        }>;
    }>;
}>;

export type AdInfoEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    networkName: string;
    networkPlacement: string;
    creativeId?: string | null;
    placement?: string | null;
    revenue: Double;
    revenuePrecision: string;
    dspName?: string | null;
    latencyMillis: Int32;
    nativeAd?: Readonly<{
        title?: string;
        advertiser?: string;
        body?: string;
        callToAction?: string;
        starRating?: Double;
        mediaContentAspectRatio?: Double;
        isIconImageAvailable: boolean;
        isOptionsViewAvailable: boolean;
        isMediaViewAvailable: boolean;
    }>;
}>;

export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    code: Int32;
    message?: string | null;
    mediatedNetworkErrorCode: Int32;
    mediatedNetworkErrorMessage: string;
    adLoadFailureInfo?: string | null;
}>;

export interface NativeProps extends ViewProps {
    adUnitId: string;
    placement?: string | null;
    customData?: string | null;
    extraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;
    localExtraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;
    onAdLoadedEvent: DirectEventHandler<AdNativeInfoEvent>;
    onAdLoadFailedEvent: DirectEventHandler<AdLoadFailedEvent>;
    onAdClickedEvent: DirectEventHandler<AdInfoEvent>;
    onAdRevenuePaidEvent: DirectEventHandler<AdInfoEvent>;
}

type AppLovinMAXNativeAdViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
    loadAd: (viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>) => void;
    updateAssetView: (viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>, assetViewTag: Int32, assetViewName: string) => void;
    renderNativeAd: (viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['loadAd', 'updateAssetView', 'renderNativeAd'],
});

export default codegenNativeComponent<NativeProps>('AppLovinMAXNativeAdView') as HostComponent<NativeProps>;
