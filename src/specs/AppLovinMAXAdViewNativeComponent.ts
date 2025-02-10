import type { HostComponent, ViewProps } from 'react-native';
import type { Int32, Double, DirectEventHandler, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type AdInfoEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    adViewId?: Int32;
    networkName: string;
    networkPlacement: string;
    creativeId?: string | null;
    placement?: string | null;
    revenue: Double;
    revenuePrecision: string;
    latencyMillis: Int32;
    dspName?: string | null;
    size?: Readonly<{
        width: Int32;
        height: Int32;
    }>;
}>;

export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    adViewId?: Int32;
    code: Int32;
    message?: string | null;
    mediatedNetworkErrorCode: Int32;
    mediatedNetworkErrorMessage: string;
    adLoadFailureInfo?: string | null;
}>;

export type AdDisplayFailedEvent = Readonly<{
    adUnitId: string;
    adFormat: string;
    adViewId?: Int32;
    networkName: string;
    networkPlacement: string;
    creativeId?: string | null;
    placement?: string | null;
    revenue: Double;
    revenuePrecision: string;
    dspName?: string | null;
    latencyMillis: Int32;
    size?: Readonly<{
        width: Int32;
        height: Int32;
    }>;
    code: Int32;
    message?: string | null;
    mediatedNetworkErrorCode: Int32;
    mediatedNetworkErrorMessage: string;
}>;

export interface NativeProps extends ViewProps {
    adUnitId: string;
    adFormat?: string;
    adViewId?: WithDefault<Int32, 0>;
    placement?: string | null;
    customData?: string | null;
    adaptiveBannerEnabled?: WithDefault<boolean, true>;
    autoRefresh?: WithDefault<boolean, true>;
    loadOnMount?: WithDefault<boolean, true>;
    extraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;
    localExtraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
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
