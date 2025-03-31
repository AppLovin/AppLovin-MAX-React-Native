import type { HostComponent, ViewProps } from 'react-native';
import type { Double, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/**
 * Payload for native ad lifecycle events (e.g., load, click, revenue).
 */
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

    /**
     * Optional native ad content for display in asset views.
     */
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

    /**
     * Full internal native ad payload used for runtime rendering and view mapping.
     */
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

/**
 * Payload for native ad load failure events.
 */
export type AdLoadFailedEvent = Readonly<{
    adUnitId: string;
    code: Double;
    message?: string | null;
    mediatedNetworkErrorCode: Double;
    mediatedNetworkErrorMessage: string;
    adLoadFailureInfo?: string | null;
}>;

/**
 * Props passed to the {@link AppLovinMAXNativeAdView} native component.
 */
export interface NativeProps extends ViewProps {
    /** Ad unit ID used to load the ad. */
    adUnitId: string;

    /** Optional placement name for ad tracking. */
    placement?: string | null;

    /** Optional custom data associated with the ad. */
    customData?: string | null;

    /** Extra key-value string parameters passed to the SDK. */
    extraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }> | null;

    /** Local string parameters passed to the mediation adapter. */
    strLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: string | null;
    }> | null;

    /** Local boolean parameters passed to the mediation adapter. */
    boolLocalExtraParameters?: ReadonlyArray<{
        key: string;
        value: boolean | null;
    }> | null;

    /** Called when a native ad is successfully loaded. */
    onAdLoadedEvent: DirectEventHandler<AdInfoEvent>;

    /** Called when ad loading fails. */
    onAdLoadFailedEvent: DirectEventHandler<AdLoadFailedEvent>;

    /** Called when the ad is clicked. */
    onAdClickedEvent: DirectEventHandler<AdInfoEvent>;

    /** Called when ad revenue is reported. */
    onAdRevenuePaidEvent: DirectEventHandler<AdInfoEvent>;
}

type AppLovinMAXNativeAdViewNativeComponentType = HostComponent<NativeProps>;

/**
 * Native commands callable from JS for managing {@link NativeAdView}.
 */
interface NativeCommands {
    /**
     * Manually loads a new native ad.
     *
     * @param viewRef - Reference to the native ad view.
     */
    loadAd(viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>): void;

    /**
     * Binds a React Native child view to a native asset (e.g. TitleView, IconView).
     *
     * @param viewRef - Reference to the native ad view.
     * @param assetViewTag - React tag for the asset view (via `findNodeHandle()`).
     * @param assetViewName - Name of the asset (e.g., "MediaView", "CallToActionView").
     */
    updateAssetView(viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>, assetViewTag: Double, assetViewName: string): void;

    /**
     * Instructs the native view to render the bound native ad after all asset views are set.
     *
     * @param viewRef - Reference to the native ad view.
     */
    renderNativeAd(viewRef: React.ElementRef<AppLovinMAXNativeAdViewNativeComponentType>): void;
}

/**
 * JS interface to native ad view commands for {@link AppLovinMAXNativeAdView}.
 */
export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['loadAd', 'updateAssetView', 'renderNativeAd'],
});

/**
 * Native component for rendering a custom native ad layout using bound asset views.
 */
export default codegenNativeComponent<NativeProps>('AppLovinMAXNativeAdView') as HostComponent<NativeProps>;
