import type { HostComponent, ViewProps } from 'react-native';
import type { Double, DirectEventHandler, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/**
 * Payload for ad lifecycle events (e.g. load, display, click).
 */
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

/**
 * Payload for ad load failure events.
 */
export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    adViewId?: Double;
    code: Double;
    message?: string | null;
    mediatedNetworkErrorCode: Double;
    mediatedNetworkErrorMessage: string;
    adLoadFailureInfo?: string | null;
}>;

/**
 * Payload for ad display failure events.
 */
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

/**
 * Props passed to the {@link AppLovinMAXAdView} native component.
 */
export interface NativeProps extends ViewProps {
    /** Ad unit ID used to load the ad. */
    adUnitId: string;

    /** Ad format (e.g., "BANNER", "MREC"). */
    adFormat?: string;

    /** Unique identifier for this ad view. Defaults to 0. */
    adViewId?: WithDefault<Double, 0>;

    /** Optional placement name for ad tracking. */
    placement?: string | null;

    /** Optional custom data associated with the ad. */
    customData?: string | null;

    /** Enables adaptive banner sizing. Defaults to `true`. */
    adaptiveBannerEnabled?: WithDefault<boolean, true>;

    /** Enables automatic refresh of the ad. Defaults to `true`. */
    autoRefresh?: WithDefault<boolean, true>;

    /** Whether to automatically load the ad on mount. Defaults to `true`. */
    loadOnMount?: WithDefault<boolean, true>;

    /** Extra key-value string parameters passed to the SDK. */
    extraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;

    /** Local string parameters passed to the mediation adapter. */
    strLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }>;

    /** Local boolean parameters passed to the mediation adapter. */
    boolLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: boolean | null;
    }>;

    /** Called when an ad is successfully loaded. */
    onAdLoadedEvent: DirectEventHandler<AdInfoEvent>;

    /** Called when an ad fails to load. */
    onAdLoadFailedEvent: DirectEventHandler<AdLoadFailedEvent>;

    /** Called when an ad fails to display. */
    onAdDisplayFailedEvent: DirectEventHandler<AdDisplayFailedEvent>;

    /** Called when the ad is clicked. */
    onAdClickedEvent: DirectEventHandler<AdInfoEvent>;

    /** Called when the ad expands. */
    onAdExpandedEvent: DirectEventHandler<AdInfoEvent>;

    /** Called when the ad collapses. */
    onAdCollapsedEvent: DirectEventHandler<AdInfoEvent>;

    /** Called when ad revenue is reported. */
    onAdRevenuePaidEvent: DirectEventHandler<AdInfoEvent>;
}

type AppLovinMAXAdViewNativeComponentType = HostComponent<NativeProps>;

/**
 * Native commands callable from JS for managing {@link AppLovinMAXAdView}.
 */
interface NativeCommands {
    /**
     * Manually starts loading a new ad when `loadOnMount` is `false`.
     *
     * @param viewRef - Reference to the native ad view component.
     */
    loadAd(viewRef: React.ElementRef<AppLovinMAXAdViewNativeComponentType>): void;

    /**
     * Destroys the currently loaded ad.
     *
     * @param viewRef - Reference to the ad view.
     */
    destroy(viewRef: React.ElementRef<AppLovinMAXAdViewNativeComponentType>): void;
}

/**
 * JS interface to ad view commands for {@link AppLovinMAXAdView}.
 */
export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['loadAd', 'destroy'],
});

/**
 * Native view component for displaying a banner or MREC ad.
 */
export default codegenNativeComponent<NativeProps>('AppLovinMAXAdView') as HostComponent<NativeProps>;
