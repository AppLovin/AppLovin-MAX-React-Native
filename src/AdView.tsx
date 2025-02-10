import * as React from 'react';
import { useEffect, useState, useRef, useCallback, useImperativeHandle, useReducer, forwardRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { NativeSyntheticEvent, ViewProps, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import AppLovinMAX from './specs/NativeAppLovinMAXMoudle';
import AdViewComponent, { Commands } from './specs/AppLovinMAXAdViewNativeComponent';
import type { AdInfoEvent, AdLoadFailedEvent, AdDisplayFailedEvent } from './specs/AppLovinMAXAdViewNativeComponent';
import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdInfo, AdLoadFailedInfo } from './types/AdInfo';
import type { AdViewProps, AdViewHandler, NativeUIComponentAdViewOptions, AdViewId } from './types/AdViewProps';
import type { LocalExtraParameterValue } from './types/AdProps';

const { ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT } = AppLovinMAX.getConstants();

/**
 * Defines a format of an ad.
 */
export enum AdFormat {
    /**
     * Banner ad.
     */
    BANNER = 'BANNER',

    /**
     * MREC ad.
     */
    MREC = 'MREC',
}

/**
 * Defines a position of a banner or MREC ad.
 */
export enum AdViewPosition {
    TOP_CENTER = 'top_center',
    TOP_LEFT = 'top_left',
    TOP_RIGHT = 'top_right',
    CENTERED = 'centered',
    CENTER_LEFT = 'center_left',
    CENTER_RIGHT = 'center_right',
    BOTTOM_LEFT = 'bottom_left',
    BOTTOM_CENTER = 'bottom_center',
    BOTTOM_RIGHT = 'bottom_right',
}

type SizeKey = 'width' | 'height';
type SizeRecord = Partial<Record<SizeKey, DimensionValue>>;

const ADVIEW_SIZE = {
    banner: { width: 320, height: 50 },
    leader: { width: 728, height: 90 },
    mrec: { width: 300, height: 250 },
};

// Returns 'auto' for unspecified width / height
const getOutlineViewSize = (style: StyleProp<ViewStyle>): [DimensionValue, DimensionValue] => {
    const viewStyle = StyleSheet.flatten(style) || {};
    return [viewStyle.width ?? 'auto', viewStyle.height ?? 'auto'];
};

const sizeBannerDimensions = async (sizeProps: SizeRecord, adaptiveBannerEnabled: boolean, screenWidth: number, bannerFormatSize: SizeRecord): Promise<SizeRecord> => {
    const width = sizeProps.width === 'auto' ? screenWidth : sizeProps.width;

    let height;
    if (sizeProps.height === 'auto') {
        if (adaptiveBannerEnabled) {
            try {
                height = await AppLovinMAX.getAdaptiveBannerHeightForWidth(screenWidth);
            } catch (error) {
                console.error('Error getting adaptive banner height:', error);
                height = bannerFormatSize.height;
            }
        } else {
            height = bannerFormatSize.height;
        }
    } else {
        height = sizeProps.height;
    }

    return { width, height };
};

const makeExtraParametersArray = (input?: { [key: string]: string | null }): Array<{ key: string; value: string | null }> => {
    if (!input) return [];
    return Object.entries(input).map(([key, value]) => ({
        key,
        value,
    }));
};

// TODO: only string works for now
const makeLocalExtraParametersArray = (input?: { [key: string]: LocalExtraParameterValue }): Array<{ key: string; value: string | null }> => {
    if (!input) return [];
    return Object.entries(input)
        .filter(([_, value]) => typeof value === 'string' || value === null) // Keep only strings and null
        .map(([key, value]) => ({
            key,
            value: value as string | null, // Type assertion to match the expected output type
        }));
};

/**
 * The {@link AdView} component renders banner or MREC ads with responsive sizing.
 * - **Banners**: 320x50 on phones, 728x90 on tablets.
 * - **MRECs**: 300x250 on all devices.
 *
 * Use {@link AppLovinMAX.isTablet()} to determine device type for layout adjustments.
 * For adaptive banners, use {@link BannerAd.getAdaptiveHeightForWidth()} for precise sizing.
 *
 * **Preloading**:
 * When preloading an {@link AdView} using {@link preloadNativeUIComponentAdView},
 * the returned {@link AdViewId} must be passed to identify the preloaded instance.
 *
 * ### Example:
 * ```js
 * <AdView
 *   adUnitId={adUnitId}
 *   adFormat={AdFormat.BANNER}
 *   placement="my_placement"
 *   customData="my_customData"
 *   extraParameters={{"key1":"value1", "key2":"value2"}}
 *   localExtraParameters={{"key1":123", "key2":object}}
 *   adaptiveBannerEnabled={false}
 *   autoRefresh={false}
 *   style={styles.banner}
 *   onAdLoaded={(adInfo: AdInfo) => { ... }}
 * />
 * ```
 */
export const AdView = forwardRef<AdViewHandler, AdViewProps & ViewProps>(function AdView(
    {
        adUnitId,
        adFormat,
        adViewId,
        placement,
        customData,
        adaptiveBannerEnabled = true,
        autoRefresh = true,
        loadOnMount = true,
        extraParameters,
        localExtraParameters,
        onAdLoaded,
        onAdLoadFailed,
        onAdDisplayFailed,
        onAdClicked,
        onAdExpanded,
        onAdCollapsed,
        onAdRevenuePaid,
        style,
        ...otherProps
    },
    ref
) {
    const { width: screenWidth } = useWindowDimensions();
    const adFormatSize = useRef<SizeRecord>({});
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const adViewRef = useRef<React.ElementRef<typeof AdViewComponent> | undefined>();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const sizeProps = useRef<SizeRecord>({});
    const dimensions = useRef<SizeRecord>({});

    useImperativeHandle(ref, () => ({ loadAd: () => Commands.loadAd(adViewRef.current!) }), []);

    const saveElement = (element: React.ElementRef<typeof AdViewComponent> | null) => {
        adViewRef.current = element ?? undefined;
    };

    useEffect(() => {
        (async () => {
            if (adFormat === AdFormat.BANNER) {
                const isTablet = await AppLovinMAX.isTablet();
                adFormatSize.current = isTablet
                    ? { width: ADVIEW_SIZE.leader.width, height: ADVIEW_SIZE.leader.height }
                    : { width: ADVIEW_SIZE.banner.width, height: ADVIEW_SIZE.banner.height };
            } else {
                adFormatSize.current = { width: ADVIEW_SIZE.mrec.width, height: ADVIEW_SIZE.mrec.height };
            }

            const initialized = await AppLovinMAX.isInitialized();
            setIsInitialized(initialized);
            if (!initialized) {
                console.warn('AdView is mounted before the initialization of the AppLovin MAX React Native module');
            }
        })();
    }, [adFormat]);

    useEffect(() => {
        const [width, height] = getOutlineViewSize(style);

        if (sizeProps.current.width === width && sizeProps.current.height === height) return;

        sizeProps.current = { width, height };

        (async () => {
            if (adFormat === AdFormat.BANNER) {
                const adaptedSize = await sizeBannerDimensions(sizeProps.current, adaptiveBannerEnabled, screenWidth, adFormatSize.current);

                if (dimensions.current.width !== adaptedSize.width || dimensions.current.height !== adaptedSize.height) {
                    dimensions.current = adaptedSize;
                    forceUpdate();
                }
            } else {
                dimensions.current = {
                    width: width === 'auto' ? adFormatSize.current.width : width,
                    height: height === 'auto' ? adFormatSize.current.height : height,
                };
                forceUpdate();
            }
        })();
    }, [adFormat, adaptiveBannerEnabled, isInitialized, screenWidth, style]);

    const onAdLoadedEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdLoaded?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                adViewId: event.nativeEvent.adViewId,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                size: {
                    width: event.nativeEvent.size?.width ?? 0,
                    height: event.nativeEvent.size?.height ?? 0,
                },
            });
        },
        [onAdLoaded]
    );

    const onAdLoadFailedEvent = useCallback(
        (event: NativeSyntheticEvent<AdLoadFailedEvent>) => {
            onAdLoadFailed?.({
                adUnitId: event.nativeEvent.adUnitId,
                adViewId: event.nativeEvent.adViewId,
                code: event.nativeEvent.code,
                message: event.nativeEvent.message,
                mediatedNetworkErrorCode: event.nativeEvent.mediatedNetworkErrorCode,
                mediatedNetworkErrorMessage: event.nativeEvent.mediatedNetworkErrorMessage,
            });
        },
        [onAdLoadFailed]
    );

    const onAdDisplayFailedEvent = useCallback(
        (event: NativeSyntheticEvent<AdDisplayFailedEvent>) => {
            onAdDisplayFailed?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                adViewId: event.nativeEvent.adViewId,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                size: {
                    width: event.nativeEvent.size?.width ?? 0,
                    height: event.nativeEvent.size?.height ?? 0,
                },
                code: event.nativeEvent.code,
                mediatedNetworkErrorCode: event.nativeEvent.mediatedNetworkErrorCode,
                mediatedNetworkErrorMessage: event.nativeEvent.mediatedNetworkErrorMessage,
            });
        },
        [onAdDisplayFailed]
    );

    const onAdClickedEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdClicked?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                adViewId: event.nativeEvent.adViewId,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                size: {
                    width: event.nativeEvent.size?.width ?? 0,
                    height: event.nativeEvent.size?.height ?? 0,
                },
            });
        },
        [onAdClicked]
    );

    const onAdExpandedEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdExpanded?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                adViewId: event.nativeEvent.adViewId,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                size: {
                    width: event.nativeEvent.size?.width ?? 0,
                    height: event.nativeEvent.size?.height ?? 0,
                },
            });
        },
        [onAdExpanded]
    );

    const onAdCollapsedEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdCollapsed?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                adViewId: event.nativeEvent.adViewId,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                size: {
                    width: event.nativeEvent.size?.width ?? 0,
                    height: event.nativeEvent.size?.height ?? 0,
                },
            });
        },
        [onAdCollapsed]
    );

    const onAdRevenuePaidEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdRevenuePaid?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                adViewId: event.nativeEvent.adViewId,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                size: {
                    width: event.nativeEvent.size?.width ?? 0,
                    height: event.nativeEvent.size?.height ?? 0,
                },
            });
        },
        [onAdRevenuePaid]
    );

    if (!isInitialized || Object.keys(dimensions.current).length === 0) {
        // Early return if not initialized or dimensions are not set
        return <View style={Object.assign({}, style, dimensions.current)} {...otherProps} />;
    }

    return (
        <AdViewComponent
            ref={saveElement}
            adUnitId={adUnitId}
            adFormat={adFormat}
            adViewId={adViewId || 0}
            placement={placement}
            customData={customData}
            adaptiveBannerEnabled={adaptiveBannerEnabled}
            autoRefresh={autoRefresh}
            loadOnMount={loadOnMount}
            extraParameters={makeExtraParametersArray(extraParameters)}
            localExtraParameters={makeLocalExtraParametersArray(localExtraParameters)}
            onAdLoadedEvent={onAdLoadedEvent}
            onAdLoadFailedEvent={onAdLoadFailedEvent}
            onAdDisplayFailedEvent={onAdDisplayFailedEvent}
            onAdClickedEvent={onAdClickedEvent}
            onAdExpandedEvent={onAdExpandedEvent}
            onAdCollapsedEvent={onAdCollapsedEvent}
            onAdRevenuePaidEvent={onAdRevenuePaidEvent}
            style={Object.assign({}, style, dimensions.current)}
            {...otherProps}
        />
    );
});

/**
 * Preloads a native UI component for {@link AdView}, enabling faster ad display on first mount.
 *
 * - When you mount {@link AdView} with the preloaded Ad Unit ID, it uses the preloaded native UI component.
 * - Unmounting {@link AdView} does not destroy the preloaded component—it will be reused on the next mount.
 * - You must manually destroy the preloaded component when it is no longer needed using {@link destroyNativeUIComponentAdView}.
 *
 * @param adUnitId - The Ad Unit ID for which the ads should be preloaded.
 * @param adFormat - The ad format to preload. Must be either {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
 * @param options - Optional properties to configure the native UI component (e.g., placement, custom data).
 * @returns A promise resolving to an {@link AdViewId}, which uniquely identifies the preloaded component.
 * @throws An error if the preload request fails.
 */
export const preloadNativeUIComponentAdView = async (adUnitId: string, adFormat: AdFormat, options: NativeUIComponentAdViewOptions = {}): Promise<AdViewId> => {
    const { placement = null, customData = null, extraParameters = {}, localExtraParameters = {} } = options;
    return AppLovinMAX.preloadNativeUIComponentAdView(adUnitId, adFormat, placement, customData, extraParameters, localExtraParameters);
};

/**
 * Destroys a preloaded native UI component identified by its {@link AdViewId}.
 *
 * - This method should be called when the preloaded component is no longer needed to free resources.
 *
 * @param adViewId - The {@link AdViewId} of the native UI component to be destroyed.
 * @returns A promise that resolves when the native UI component is successfully destroyed.
 * @throws An error if the destruction process fails.
 */
export const destroyNativeUIComponentAdView = async (adViewId: AdViewId): Promise<void> => {
    if (adViewId === undefined) {
        return Promise.reject(new Error('adViewId is undefined'));
    }
    return AppLovinMAX.destroyNativeUIComponentAdView(adViewId);
};

/**
 * Adds the specified event listener to receive {@link AdInfo} when a native UI component loads a
 * new ad.
 *
 * @param listener Listener to be notified.
 */
export const addNativeUIComponentAdViewAdLoadedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, listener);
};

/**
 * Removes the event listener to receive {@link AdInfo} when a native UI component loads a new ad.
 */
export const removeNativeUIComponentAdViewAdLoadedEventListener = (): void => {
    removeEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT);
};

/**
 * Adds the specified event listener to receive {@link AdLoadFailedInfo} when a native UI component
 * could not load a new ad.
 *
 * @param listener Listener to be notified.
 */
export const addNativeUIComponentAdViewAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void): void => {
    addEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT, listener);
};

/**
 * Removes the event listener to receive {@link AdLoadFailedInfo} when a native UI component could
 * not load a new ad.
 */
export const removeNativeUIComponentAdViewAdLoadFailedEventListener = (): void => {
    removeEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT);
};
