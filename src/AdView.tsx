import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { NativeModules, requireNativeComponent, StyleSheet } from 'react-native';
import type { ViewProps, ViewStyle, StyleProp } from 'react-native';
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from './types/AdInfo';
import type { AdViewProps, LoadedAdViewProps } from './types/AdViewProps';
import { createAdViewAd } from './AdViewAd';
import type { AdViewAd } from './types/AdViewAd';
import type { AdViewAdId, AdViewAdWithId } from './AdViewAd';

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

const AdViewComponent = requireNativeComponent<ViewProps & AdViewAdId>('AppLovinMAXAdView');

const ADVIEW_SIZE = {
    banner: { width: 320, height: 50 },
    leader: { width: 728, height: 90 },
    mrec: { width: 300, height: 250 },
};

const getOutlineViewSize = (style: StyleProp<ViewStyle>) => {
    const viewStyle = StyleSheet.flatten(style || {});
    return [viewStyle?.width, viewStyle?.height];
};

const sizeAdViewDimensions = (
    ad: AdViewAd,
    width?: number | string | null,
    height?: number | string | null
): Promise<Record<string, number>> => {
    const sizeForBannerFormat = async () => {
        const isTablet = await AppLovinMAX.isTablet();

        const minWidth = isTablet ? ADVIEW_SIZE.leader.width : ADVIEW_SIZE.banner.width;

        let minHeight;
        if (ad.adaptiveBannerEnabled) {
            if (typeof width === 'number' && width > minWidth) {
                minHeight = await AppLovinMAX.getAdaptiveBannerHeightForWidth(width);
            } else {
                minHeight = await AppLovinMAX.getAdaptiveBannerHeightForWidth(minWidth);
            }
        } else {
            minHeight = isTablet ? ADVIEW_SIZE.leader.height : ADVIEW_SIZE.banner.height;
        }

        return Promise.resolve({
            ...(width === 'auto'
                ? {
                      width: minWidth,
                  }
                : {
                      minWidth: minWidth,
                  }),
            ...(height === 'auto'
                ? {
                      height: minHeight,
                  }
                : {
                      minHeight: minHeight,
                  }),
        });
    };

    if (ad.adFormat === AdFormat.BANNER) {
        return sizeForBannerFormat();
    } else {
        return Promise.resolve({
            ...(width === 'auto'
                ? {
                      width: ADVIEW_SIZE.mrec.width,
                  }
                : {
                      minWidth: ADVIEW_SIZE.mrec.width,
                  }),
            ...(height === 'auto'
                ? {
                      height: ADVIEW_SIZE.mrec.height,
                  }
                : {
                      minHeight: ADVIEW_SIZE.mrec.height,
                  }),
        });
    }
};

const setDefaultAdViewProps = (props: AdViewProps): AdViewProps => {
    let adaptiveBannerEnabled = {};
    if (props.adaptiveBannerEnabled === undefined) {
        adaptiveBannerEnabled = { adaptiveBannerEnabled: true };
    }

    let autoRefresh = {};
    if (props.autoRefresh === undefined) {
        autoRefresh = { autoRefresh: true };
    }

    return { ...props, ...adaptiveBannerEnabled, ...autoRefresh };
};

const updateAdViewAd = (ad: AdViewAd, props: AdViewProps) => {
    if (props.placement !== ad.placement) ad.placement = props.placement;
    if (props.customData !== ad.customData) ad.customData = props.customData;
    if (props.adaptiveBannerEnabled !== ad.adaptiveBannerEnabled)
        ad.adaptiveBannerEnabled = props.adaptiveBannerEnabled;
    if (props.autoRefresh !== ad.autoRefresh) ad.autoRefresh = props.autoRefresh;
    if (props.extraParameters !== ad.extraParameters) ad.extraParameters = props.extraParameters;
    if (props.localExtraParameters !== ad.localExtraParameters) ad.localExtraParameters = props.localExtraParameters;
    if (props.onAdLoaded) {
        ad.removeAdLoadedEventListener();
        ad.addAdLoadedEventListener((adInfo: AdInfo) => {
            props.onAdLoaded!(adInfo);
        });
    }
    if (props.onAdLoadFailed) {
        ad.removeAdLoadFailedEventListener();
        ad.addAdLoadFailedEventListener((adInfo: AdLoadFailedInfo) => {
            props.onAdLoadFailed!(adInfo);
        });
    }
    if (props.onAdDisplayFailed) {
        ad.removeAdDisplayFailedEventListener();
        ad.addAdDisplayFailedEventListener((adInfo: AdDisplayFailedInfo) => {
            props.onAdDisplayFailed!(adInfo);
        });
    }
    if (props.onAdClicked) {
        ad.removeAdClickedEventListener();
        ad.addAdClickedEventListener((adInfo: AdInfo) => {
            props.onAdClicked!(adInfo);
        });
    }
    if (props.onAdExpanded) {
        ad.removeAdExpandedEventListener();
        ad.addAdExpandedEventListener((adInfo: AdInfo) => {
            props.onAdExpanded!(adInfo);
        });
    }
    if (props.onAdCollapsed) {
        ad.removeAdCollapsedEventListener();
        ad.addAdCollapsedEventListener((adInfo: AdInfo) => {
            props.onAdCollapsed!(adInfo);
        });
    }
    if (props.onAdRevenuePaid) {
        ad.removeAdRevenuePaidListener();
        ad.addAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            props.onAdRevenuePaid!(adInfo);
        });
    }
};

type Props = (LoadedAdViewProps | AdViewProps) & ViewProps;

/**
 * The {@link AdView} component that you use building a banner or an MREC. Phones
 * sizes banners to 320x50 and MRECs to 300x250. Tablets sizes banners to 728x90 and MRECs to
 * 300x250. You may use the utility method {@link AppLovinMAX.isTablet()} to help with view sizing
 * adjustments. For adaptive banners, call {@link BannerAd.getAdaptiveHeightForWidth()} to get
 * the banner height, and then adjust your content accordingly.
 *
 * You can use {@link createAdView()} to load ads in advance.  {@link createAdView()} returns
 * {@link AdViewAd} that can be passed to AdView.
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
 * ### Example with createAdViewAd:
 * ```js
 * const bannerAd:AdViewAd = await createAdViewAd(adUnitId, AdFormat.BANNER);
 * ...
 * <AdView
 *   ad={bannerAd}
 *   style={styles.banner}
 * />
 * ```
 *
 */
export const AdView = (props: Props) => {
    const { style, ...otherProps } = props as ViewProps;

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState({});
    const [adViewAd, setAdViewAd] = useState<AdViewAdWithId>();

    const uiAd = useRef<AdViewAdWithId>();

    useEffect(() => {
        AppLovinMAX.isInitialized().then((result: boolean) => {
            setIsInitialized(result);
            if (!result) {
                console.warn('AdView is mounted before the initialization of the AppLovin MAX React Native module');
            }
        });

        return () => {
            uiAd.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (!isInitialized || uiAd.current) return;

        // props can be casted to either LoadedAdViewProps or AdViewProps
        const loadedAdViewProps = props as LoadedAdViewProps;
        const adViewProps = props as AdViewProps;

        if (loadedAdViewProps.ad) {
            // Set the user provided ad.
            setAdViewAd(loadedAdViewProps.ad as AdViewAdWithId);
        } else if (adViewProps.adUnitId && adViewProps.adFormat) {
            // Create a new ad which needs to be deleted when unmounted.
            const createUIAd = async () => {
                const ad: AdViewAdWithId = (await createAdViewAd(
                    adViewProps.adUnitId,
                    adViewProps.adFormat
                )) as AdViewAdWithId;
                updateAdViewAd(ad, setDefaultAdViewProps(adViewProps));
                setAdViewAd(ad);
                uiAd.current = ad;
            };
            createUIAd();
        } else {
            console.error('ERROR: Cannot create AdView with missing argument');
        }
    }, [isInitialized]);

    useEffect(() => {
        if (!adViewAd) return;
        const [width, height] = getOutlineViewSize(style);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: width and height should be of type DimensionValue in react-native 0.72.0 and above
        sizeAdViewDimensions(adViewAd, width, height).then((value: Record<string, number>) => {
            setDimensions(value);
        });
    }, [adViewAd]);

    useEffect(() => {
        if (!uiAd.current) return;
        updateAdViewAd(uiAd.current, props as AdViewProps);
    }, [props]);

    // Not initialized
    if (!isInitialized) {
        return null;
    } else {
        const isDimensionsSet = Object.keys(dimensions).length > 0;

        // Not sized yet
        if (!isDimensionsSet) {
            return null;
        }

        // Not ad ready yet
        if (!adViewAd) {
            return null;
        }
    }

    return (
        <AdViewComponent
            adViewAdId={adViewAd.adViewAdId}
            style={Object.assign({}, style, dimensions)}
            {...otherProps}
        />
    );
};
