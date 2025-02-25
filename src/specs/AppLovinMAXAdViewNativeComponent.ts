import type { HostComponent, ViewProps } from 'react-native';
import type { Double, DirectEventHandler, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type AdInfoEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    adViewId?: Double;
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
}>;

export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    adViewId?: Double;
    code: Double;
    message?: string | null;
    mediatedNetworkErrorCode: Double;
    mediatedNetworkErrorMessage: string;
    adLoadFailureInfo?: string | null;
}>;

export type AdDisplayFailedEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    adViewId?: Double;
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
    code: Double;
    message?: string | null;
    mediatedNetworkErrorCode: Double;
    mediatedNetworkErrorMessage: string;
}>;

export interface NativeProps extends ViewProps {
    adUnitId: string;
    adFormat?: string;
    adViewId?: WithDefault<Double, 0>;
    placement?: string | null;
    customData?: string | null;
    adaptiveBannerEnabled?: WithDefault<boolean, true>;
    autoRefresh?: WithDefault<boolean, true>;
    loadOnMount?: WithDefault<boolean, true>;
    extraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;
    strLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;
    numLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: Double | null;
    }>;
    boolLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: boolean | null;
    }>;
    onAdLoadedEvent: DirectEventHandler<AdInfoEvent>;
    onAdLoadFailedEvent: DirectEventHandler<AdLoadFailedEvent>;
    onAdDisplayFailedEvent: DirectEventHandler<AdDisplayFailedEvent>;
    onAdClickedEvent: DirectEventHandler<AdInfoEvent>;
    onAdExpandedEvent: DirectEventHandler<AdInfoEvent>;
    onAdCollapsedEvent: DirectEventHandler<AdInfoEvent>;
    onAdRevenuePaidEvent: DirectEventHandler<AdInfoEvent>;
}

type AppLovinMAXAdViewNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
    loadAd: (viewRef: React.ElementRef<AppLovinMAXAdViewNativeComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['loadAd'],
});

export default codegenNativeComponent<NativeProps>('AppLovinMAXAdView') as HostComponent<NativeProps>;
