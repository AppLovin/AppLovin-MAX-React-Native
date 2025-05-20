import * as React from 'react';
import { useEffect, useState, useRef, useCallback, useImperativeHandle, useReducer, forwardRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { NativeSyntheticEvent, ViewProps, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import AppLovinMAX from './specs/NativeAppLovinMAXModule';
import AdViewComponent, { Commands } from './specs/AppLovinMAXAdViewNativeComponent';
import type { AdInfoEvent, AdLoadFailedEvent, AdDisplayFailedEvent } from './specs/AppLovinMAXAdViewNativeComponent';
import { addEventListener, removeEventListener } from './EventEmitter';
import type { AdInfo, AdLoadFailedInfo } from './types/AdInfo';
import type { AdViewProps, AdViewHandler, NativeUIComponentAdViewOptions, AdViewId } from './types/AdViewProps';
import { makeExtraParametersArray, makeLocalExtraParametersArray } from './Utils';

const { ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT } = AppLovinMAX.getConstants();

/**
 * Defines the format of an ad.
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
 * Defines the position for rendering a banner or MREC ad within its container.
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

// Extracts width and height from the style prop, defaulting to 'auto' when unspecified.
const getOutlineViewSize = (style: StyleProp<ViewStyle>): [DimensionValue, DimensionValue] => {
    const viewStyle = StyleSheet.flatten(style) || {};
    return [viewStyle.width ?? 'auto', viewStyle.height ?? 'auto'];
};

const handleAdViewEvent = <T extends AdInfoEvent | AdLoadFailedEvent | AdDisplayFailedEvent>(event: NativeSyntheticEvent<T>, callback?: (adInfo: T) => void) => {
    if (!callback) return;
    callback(event.nativeEvent);
};

/**
 * Renders a banner or MREC ad using a native view, with adaptive or responsive sizing.
 *
 * - **Banners**: 320×50 on phones, 728×90 on tablets.
 * - **MRECs**: Fixed size of 300×250 on all devices.
 *
 * Internally uses {@link AppLovinMAX.isTablet()} to determine banner size on tablets.
 * You can also use this method externally to assist with layout decisions.
 *
 * For adaptive banners, use {@link BannerAd.getAdaptiveHeightForWidth()} to determine the appropriate height.
 *
 * **Preloading**:
 * If you preload an ad for AdView using {@link preloadNativeUIComponentAdView},
 * pass the returned {@link AdViewId} to this component to display the preloaded instance.
 *
 * **Note:** The AppLovin SDK must be initialized before using this component.
 *
 * ### Example:
 * ```tsx
 * <AdView
 *   adUnitId={adUnitId}
 *   adFormat={AdFormat.BANNER}
 *   placement="my_placement"
 *   customData="my_customData"
 *   extraParameters={{ key1: "value1", key2: "value2" }}
 *   localExtraParameters={{ key1: "value1", key2: true }}
 *   adaptiveBannerEnabled={false}
 *   autoRefresh={false}
 *   style={styles.banner}
 *   onAdLoaded={(adInfo: AdInfo) => { ... }}
 * />
 * ```
 *
 * For complete implementation examples, see:
 * - https://github.com/AppLovin/AppLovin-MAX-React-Native/blob/master/example/src/NativeBannerExample.tsx
 * - https://github.com/AppLovin/AppLovin-MAX-React-Native/blob/master/example/src/NativeMRecExample.tsx
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
    const dimensions = useRef<SizeRecord>({});

    const loadAd = useCallback(() => {
        adViewRef.current && Commands.loadAd(adViewRef.current);
    }, []);

    useImperativeHandle(ref, () => ({ loadAd }), [loadAd]);

    useEffect(() => {
        (async () => {
            const isTablet = adFormat === AdFormat.BANNER ? await AppLovinMAX.isTablet() : false;
            adFormatSize.current = adFormat === AdFormat.BANNER ? (isTablet ? ADVIEW_SIZE.leader : ADVIEW_SIZE.banner) : ADVIEW_SIZE.mrec;

            const initialized = await AppLovinMAX.isInitialized();
            setIsInitialized(initialized);
            if (!initialized) {
                console.warn('AdView was mounted before the AppLovin MAX React Native module was initialized.');
            }
        })();
    }, [adFormat]);

    useEffect(() => {
        const [width, height] = getOutlineViewSize(style);

        if (dimensions.current.width === width && dimensions.current.height === height) return;

        (async () => {
            const isBanner = adFormat === AdFormat.BANNER;
            const isWidthAuto = width === 'auto';
            const isHeightAuto = height === 'auto';

            const resolvedWidth = isWidthAuto ? (isBanner ? screenWidth : adFormatSize.current.width) : width;

            let resolvedHeight: DimensionValue | undefined = height;

            if (isHeightAuto) {
                if (isBanner && adaptiveBannerEnabled) {
                    try {
                        resolvedHeight = await AppLovinMAX.getAdaptiveBannerHeightForWidth(screenWidth);
                    } catch (error) {
                        console.error('Error getting adaptive banner height:', error);
                        resolvedHeight = adFormatSize.current.height;
                    }
                } else {
                    resolvedHeight = adFormatSize.current.height;
                }
            }

            const newSize = { width: resolvedWidth, height: resolvedHeight };

            if (dimensions.current.width !== newSize.width || dimensions.current.height !== newSize.height) {
                dimensions.current = newSize;
                forceUpdate();
            }
        })();
    }, [adFormat, adaptiveBannerEnabled, isInitialized, screenWidth, style]);

    const onAdLoadedEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleAdViewEvent(event, onAdLoaded), [onAdLoaded]);
    const onAdLoadFailedEvent = useCallback((event: NativeSyntheticEvent<AdLoadFailedEvent>) => handleAdViewEvent(event, onAdLoadFailed), [onAdLoadFailed]);
    const onAdDisplayFailedEvent = useCallback((event: NativeSyntheticEvent<AdDisplayFailedEvent>) => handleAdViewEvent(event, onAdDisplayFailed), [onAdDisplayFailed]);
    const onAdClickedEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleAdViewEvent(event, onAdClicked), [onAdClicked]);
    const onAdExpandedEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleAdViewEvent(event, onAdExpanded), [onAdExpanded]);
    const onAdCollapsedEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleAdViewEvent(event, onAdCollapsed), [onAdCollapsed]);
    const onAdRevenuePaidEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleAdViewEvent(event, onAdRevenuePaid), [onAdRevenuePaid]);

    if (!isInitialized || Object.keys(dimensions.current).length === 0) {
        // Early return if not initialized or dimensions are not set
        return <View style={style} {...otherProps} />;
    }

    return (
        <AdViewComponent
            ref={(element) => (adViewRef.current = element ?? undefined)}
            adUnitId={adUnitId}
            adFormat={adFormat}
            adViewId={adViewId || 0}
            placement={placement}
            customData={customData}
            adaptiveBannerEnabled={adaptiveBannerEnabled}
            autoRefresh={autoRefresh}
            loadOnMount={loadOnMount}
            extraParameters={makeExtraParametersArray(extraParameters)}
            strLocalExtraParameters={makeLocalExtraParametersArray(localExtraParameters, 'str')}
            boolLocalExtraParameters={makeLocalExtraParametersArray(localExtraParameters, 'bool')}
            onAdLoadedEvent={onAdLoadedEvent}
            onAdLoadFailedEvent={onAdLoadFailedEvent}
            onAdDisplayFailedEvent={onAdDisplayFailedEvent}
            onAdClickedEvent={onAdClickedEvent}
            onAdExpandedEvent={onAdExpandedEvent}
            onAdCollapsedEvent={onAdCollapsedEvent}
            onAdRevenuePaidEvent={onAdRevenuePaidEvent}
            style={[style, dimensions.current]}
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
 * @param adUnitId - The Ad Unit ID for which ads should be preloaded.
 * @param adFormat - The ad format to preload. Must be either {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
 * @param options - Optional properties to configure the native UI component (e.g., placement, custom data).
 * @returns A promise that resolves to an {@link AdViewId}, uniquely identifying the preloaded component instance.
 * @throws An error if the preload request fails.
 */
export const preloadNativeUIComponentAdView = async (adUnitId: string, adFormat: AdFormat, options: NativeUIComponentAdViewOptions = {}): Promise<AdViewId> => {
    const { isAdaptive = true, placement = null, customData = null, extraParameters = {}, localExtraParameters = {} } = options;
    return AppLovinMAX.preloadNativeUIComponentAdView(adUnitId, adFormat, isAdaptive, placement, customData, extraParameters, localExtraParameters);
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
        return Promise.reject(new Error('adViewId is not provided'));
    }
    return AppLovinMAX.destroyNativeUIComponentAdView(adViewId);
};

/**
 * Adds the specified event listener to receive {@link AdInfo} when a native UI component loads a new ad.
 *
 * @param listener Listener to be notified.
 */
export const addNativeUIComponentAdViewAdLoadedEventListener = (listener: (adInfo: AdInfo) => void): void => {
    addEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, listener);
};

/**
 * Removes the event listener registered to receive {@link AdInfo} when a native UI component loads a new ad.
 */
export const removeNativeUIComponentAdViewAdLoadedEventListener = (): void => {
    removeEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT);
};

/**
 * Adds the specified event listener to receive {@link AdLoadFailedInfo} when a native UI component could not load a new ad.
 *
 * @param listener Listener to be notified.
 */
export const addNativeUIComponentAdViewAdLoadFailedEventListener = (listener: (errorInfo: AdLoadFailedInfo) => void): void => {
    addEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT, listener);
};

/**
 * Removes the event listener registered to receive {@link AdLoadFailedInfo} when a native UI component could not load a new ad.
 */
export const removeNativeUIComponentAdViewAdLoadFailedEventListener = (): void => {
    removeEventListener(ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT);
};
