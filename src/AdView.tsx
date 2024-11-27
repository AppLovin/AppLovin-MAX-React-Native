import * as React from 'react';
import { useEffect, useState, useRef, useCallback, useImperativeHandle, useReducer, forwardRef } from 'react';
import { NativeModules, requireNativeComponent, StyleSheet, UIManager, findNodeHandle, useWindowDimensions, View } from 'react-native';
import type { ViewProps, ViewStyle, StyleProp, NativeMethods, DimensionValue } from 'react-native';
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from './types/AdInfo';
import type { AdNativeEvent } from './types/AdEvent';
import type { AdViewProps, AdViewHandler, NativeUIComponentAdViewOptions, AdViewId } from './types/AdViewProps';
import { addEventListener, removeEventListener } from './EventEmitter';

const { AppLovinMAX } = NativeModules;

const {
    BANNER_AD_FORMAT_LABEL,
    MREC_AD_FORMAT_LABEL,

    TOP_CENTER_POSITION,
    TOP_LEFT_POSITION,
    TOP_RIGHT_POSITION,
    CENTERED_POSITION,
    CENTER_LEFT_POSITION,
    CENTER_RIGHT_POSITION,
    BOTTOM_LEFT_POSITION,
    BOTTOM_CENTER_POSITION,
    BOTTOM_RIGHT_POSITION,

    ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT,
    ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT,
} = AppLovinMAX.getConstants();

/**
 * Defines a format of an ad.
 */
export enum AdFormat {
    /**
     * Banner ad.
     */
    BANNER = BANNER_AD_FORMAT_LABEL,

    /**
     * MREC ad.
     */
    MREC = MREC_AD_FORMAT_LABEL,
}

/**
 * Defines a position of a banner or MREC ad.
 */
export enum AdViewPosition {
    TOP_CENTER = TOP_CENTER_POSITION,
    TOP_LEFT = TOP_LEFT_POSITION,
    TOP_RIGHT = TOP_RIGHT_POSITION,
    CENTERED = CENTERED_POSITION,
    CENTER_LEFT = CENTER_LEFT_POSITION,
    CENTER_RIGHT = CENTER_RIGHT_POSITION,
    BOTTOM_LEFT = BOTTOM_LEFT_POSITION,
    BOTTOM_CENTER = BOTTOM_CENTER_POSITION,
    BOTTOM_RIGHT = BOTTOM_RIGHT_POSITION,
}

type AdViewNativeEvents = {
    onAdLoadedEvent(event: AdNativeEvent<AdInfo>): void;
    onAdLoadFailedEvent(event: AdNativeEvent<AdLoadFailedInfo>): void;
    onAdDisplayFailedEvent(event: AdNativeEvent<AdDisplayFailedInfo>): void;
    onAdClickedEvent(event: AdNativeEvent<AdInfo>): void;
    onAdExpandedEvent(event: AdNativeEvent<AdInfo>): void;
    onAdCollapsedEvent(event: AdNativeEvent<AdInfo>): void;
    onAdRevenuePaidEvent(event: AdNativeEvent<AdRevenueInfo>): void;
};

const AdViewComponent = requireNativeComponent<AdViewProps & ViewProps & AdViewNativeEvents>('AppLovinMAXAdView');

type AdViewType = React.Component<AdViewProps> & NativeMethods;

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
    const adViewRef = useRef<AdViewType | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const sizeProps = useRef<SizeRecord>({});
    const dimensions = useRef<SizeRecord>({});

    const loadAd = useCallback(() => {
        if (adViewRef.current) {
            UIManager.dispatchViewManagerCommand(
                findNodeHandle(adViewRef.current),
                // @ts-ignore: Issue in RN ts defs
                UIManager.getViewManagerConfig('AppLovinMAXAdView').Commands.loadAd,
                undefined
            );
        }
    }, []);

    useImperativeHandle(ref, () => ({ loadAd }), [loadAd]);

    const saveElement = useCallback((element: AdViewType | null) => {
        adViewRef.current = element;
    }, []);

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
        (event: AdNativeEvent<AdInfo>) => {
            onAdLoaded?.(event.nativeEvent);
        },
        [onAdLoaded]
    );

    const onAdLoadFailedEvent = useCallback(
        (event: AdNativeEvent<AdLoadFailedInfo>) => {
            onAdLoadFailed?.(event.nativeEvent);
        },
        [onAdLoadFailed]
    );

    const onAdDisplayFailedEvent = useCallback(
        (event: AdNativeEvent<AdDisplayFailedInfo>) => {
            onAdDisplayFailed?.(event.nativeEvent);
        },
        [onAdDisplayFailed]
    );

    const onAdClickedEvent = useCallback(
        (event: AdNativeEvent<AdInfo>) => {
            onAdClicked?.(event.nativeEvent);
        },
        [onAdClicked]
    );

    const onAdExpandedEvent = useCallback(
        (event: AdNativeEvent<AdInfo>) => {
            onAdExpanded?.(event.nativeEvent);
        },
        [onAdExpanded]
    );

    const onAdCollapsedEvent = useCallback(
        (event: AdNativeEvent<AdInfo>) => {
            onAdCollapsed?.(event.nativeEvent);
        },
        [onAdCollapsed]
    );

    const onAdRevenuePaidEvent = useCallback(
        (event: AdNativeEvent<AdRevenueInfo>) => {
            onAdRevenuePaid?.(event.nativeEvent);
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
            extraParameters={extraParameters}
            localExtraParameters={localExtraParameters}
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
export const preloadNativeUIComponentAdView = async (adUnitId: string, adFormat: AdFormat, options?: NativeUIComponentAdViewOptions): Promise<AdViewId> => {
    return AppLovinMAX.preloadNativeUIComponentAdView(adUnitId, adFormat, options?.placement, options?.customData, options?.extraParameters, options?.localExtraParameters);
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
