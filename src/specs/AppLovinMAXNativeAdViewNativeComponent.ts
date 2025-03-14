import type { HostComponent, ViewProps } from 'react-native';
import type { Double, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type AdInfoEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    networkName: string;
    networkPlacement: string;
    creativeId?: string | null;
    placement?: string | null;
    revenue: Double;
    revenuePrecision: string;
    latencyMillis: Double;
    dspName?: string | null;
    size: Readonly<{
        width: Double;
        height: Double;
    }>;
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
    nativeAdImpl: Readonly<{
        title?: string | null;
        advertiser?: string | null;
        body?: string | null;
        callToAction?: string | null;
        image?: boolean;
        imageSource?: string | null;
        url?: string;
        starRating?: Double;
        isOptionsViewAvailable: boolean;
        isMediaViewAvailable: boolean;
    }>;
}>;

export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    code: Double;
    message?: string | null;
    mediatedNetworkErrorCode: Double;
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
    }> | null;
    strLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }> | null;
    boolLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: boolean | null;
    }> | null;
    onAdLoadedEvent: DirectEventHandler<AdInfoEvent>;
    onAdLoadFailedEvent: DirectEventHandler<AdLoadFailedEvent>;
    onAdClickedEvent: DirectEventHandler<AdInfoEvent>;
    onAdRevenuePaidEvent: DirectEventHandler<AdInfoEvent>;
}

type AppLovinMAXNativeAdViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
    loadAd: (viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>) => void;
    updateAssetView: (viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>, assetViewTag: Double, assetViewName: string) => void;
    renderNativeAd: (viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['loadAd', 'updateAssetView', 'renderNativeAd'],
});

export default codegenNativeComponent<NativeProps>('AppLovinMAXNativeAdView') as HostComponent<NativeProps>;
