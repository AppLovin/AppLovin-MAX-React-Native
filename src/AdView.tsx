import * as React from 'react';
import { useEffect, useState, useRef, useCallback, useImperativeHandle, useReducer, forwardRef } from 'react';
import {
    NativeModules,
    requireNativeComponent,
    StyleSheet,
    UIManager,
    findNodeHandle,
    useWindowDimensions,
} from 'react-native';
import type { ViewProps, ViewStyle, StyleProp, NativeMethods, DimensionValue } from 'react-native';
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from './types/AdInfo';
import type { AdNativeEvent } from './types/AdEvent';
import type { AdViewProps, AdViewHandler } from './types/AdViewProps';

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
const getOutlineViewSize = (style: StyleProp<ViewStyle>) => {
    const viewStyle = StyleSheet.flatten(style || {});
    return [viewStyle?.width ?? 'auto', viewStyle?.height ?? 'auto'];
};

const sizeBannerDimensions = (
    sizeProps: SizeRecord,
    adaptiveBannerEnabled: boolean,
    screenWidth: number,
    bannerFormatSize: SizeRecord
): Promise<SizeRecord> => {
    const sizeForBannerFormat = async () => {
        const width = sizeProps.width === 'auto' ? screenWidth : sizeProps.width;

        let height;
        if (sizeProps.height === 'auto') {
            if (adaptiveBannerEnabled) {
                height = await AppLovinMAX.getAdaptiveBannerHeightForWidth(screenWidth);
            } else {
                height = bannerFormatSize.height;
            }
        } else {
            height = sizeProps.height;
        }

        return Promise.resolve({ width: width, height: height });
    };

    return sizeForBannerFormat();
};

/**
 * The {@link AdView} component that you use building a banner or an MREC. Phones
 * sizes banners to 320x50 and MRECs to 300x250. Tablets sizes banners to 728x90 and MRECs to
 * 300x250. You may use the utility method {@link AppLovinMAX.isTablet()} to help with view sizing
 * adjustments. For adaptive banners, call {@link BannerAd.getAdaptiveHeightForWidth()} to get
 * the banner height, and then adjust your content accordingly.
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

    const loadAd = () => {
        if (adViewRef.current) {
            UIManager.dispatchViewManagerCommand(
                findNodeHandle(adViewRef.current),
                // @ts-ignore: Issue in RN ts defs
                UIManager.getViewManagerConfig('AppLovinMAXAdView').Commands.loadAd,
                undefined
            );
        }
    };

    useImperativeHandle(ref, () => ({ loadAd }), []);

    const saveElement = useCallback((element: AdViewType | null) => {
        if (element) {
            adViewRef.current = element;
        }
    }, []);

    useEffect(() => {
        if (adFormat === AdFormat.BANNER) {
            AppLovinMAX.isTablet().then((result: boolean) => {
                if (result) {
                    adFormatSize.current = { width: ADVIEW_SIZE.leader.width, height: ADVIEW_SIZE.leader.height };
                } else {
                    adFormatSize.current = { width: ADVIEW_SIZE.banner.width, height: ADVIEW_SIZE.banner.height };
                }
            });
        } else {
            adFormatSize.current = { width: ADVIEW_SIZE.mrec.width, height: ADVIEW_SIZE.mrec.height };
        }

        AppLovinMAX.isInitialized().then((result: boolean) => {
            setIsInitialized(result);
            if (!result) {
                console.warn('AdView is mounted before the initialization of the AppLovin MAX React Native module');
            }
        });
    }, []); // Run once when mounted

    useEffect(() => {
        if (!isInitialized) return;

        const [width, height] = getOutlineViewSize(style);

        if (sizeProps.current.width === width && sizeProps.current.height === height) return;

        sizeProps.current = { width: width, height: height };

        if (adFormat === AdFormat.BANNER) {
            sizeBannerDimensions(sizeProps.current, adaptiveBannerEnabled, screenWidth, adFormatSize.current).then(
                (adaptedSize: SizeRecord) => {
                    if (
                        dimensions.current.width !== adaptedSize.width ||
                        dimensions.current.height !== adaptedSize.height
                    ) {
                        dimensions.current = adaptedSize;
                        forceUpdate();
                    }
                }
            );
        } else {
            dimensions.current = {
                width: width === 'auto' ? adFormatSize.current.width : width,
                height: height === 'auto' ? adFormatSize.current.height : height,
            };
            forceUpdate();
        }
    }); // Run every render

    const onAdLoadedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (onAdLoaded) onAdLoaded(event.nativeEvent);
    };

    const onAdLoadFailedEvent = (event: AdNativeEvent<AdLoadFailedInfo>) => {
        if (onAdLoadFailed) onAdLoadFailed(event.nativeEvent);
    };

    const onAdDisplayFailedEvent = (event: AdNativeEvent<AdDisplayFailedInfo>) => {
        if (onAdDisplayFailed) onAdDisplayFailed(event.nativeEvent);
    };

    const onAdClickedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (onAdClicked) onAdClicked(event.nativeEvent);
    };

    const onAdExpandedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (onAdExpanded) onAdExpanded(event.nativeEvent);
    };

    const onAdCollapsedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (onAdCollapsed) onAdCollapsed(event.nativeEvent);
    };

    const onAdRevenuePaidEvent = (event: AdNativeEvent<AdRevenueInfo>) => {
        if (onAdRevenuePaid) onAdRevenuePaid(event.nativeEvent);
    };

    // Not initialized
    if (!isInitialized) {
        return null;
    } else {
        const isDimensionsSet = Object.keys(dimensions.current).length > 0;

        // Not sized yet
        if (!isDimensionsSet) {
            return null;
        }
    }

    return (
        <AdViewComponent
            ref={saveElement}
            adUnitId={adUnitId}
            adFormat={adFormat}
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
