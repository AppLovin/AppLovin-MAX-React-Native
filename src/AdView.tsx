import { NativeModules, requireNativeComponent, StyleSheet } from "react-native";
import type { ViewProps, ViewStyle, StyleProp } from "react-native";
import React, { useEffect, useState } from "react";
import { AdFormat } from "./types/AdViewProps";
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./types/AdInfo";
import type { AdNativeEvent } from "./types/AdEvent";
import type { AdViewProps } from "./types/AdViewProps";

const { AppLovinMAX } = NativeModules;

/**
 * Defines callback functions for receiving events from the native module.
 *
 * The received events are delivered to the app via the corresponding callbacks.
 */
type AdViewNativeEvents = {
    onAdLoadedEvent(event: AdNativeEvent<AdInfo>): void
    onAdLoadFailedEvent(event: AdNativeEvent<AdLoadFailedInfo>): void
    onAdDisplayFailedEvent(event: AdNativeEvent<AdDisplayFailedInfo>): void
    onAdClickedEvent(event: AdNativeEvent<AdInfo>): void
    onAdExpandedEvent(event: AdNativeEvent<AdInfo>): void
    onAdCollapsedEvent(event: AdNativeEvent<AdInfo>): void
    onAdRevenuePaidEvent(event: AdNativeEvent<AdRevenueInfo>): void
}

/**
 * The native `AdView` component.
 */
const AdViewComponent = requireNativeComponent<AdViewProps & AdViewNativeEvents>("AppLovinMAXAdView");

/**
 * Pre-defined sizes for banners and mrecs.
 */
const ADVIEW_SIZE = {
    banner: { width: 320, height: 50 },
    leader: { width: 728, height: 90 },
    mrec: { width: 300, height: 250 },
};

/**
 * Retrieves width and height from the style props
 */
const getFlattenedSize = (style: StyleProp<ViewStyle>) => {
    const viewStyle = StyleSheet.flatten(style || {});
    return [viewStyle?.width, viewStyle?.height];
};

/**
 * The `AdView` component for building a banner or a MRec.
 */
export const AdView = ({
    adUnitId,
    adFormat,
    placement,
    customData,
    adaptiveBannerEnabled,
    autoRefresh,
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
}: AdViewProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<{ width?: number | string, height?: number | string }>({});

    const [width, height] = getFlattenedSize(style);

    const isWidthSet = width && width !== 'auto';
    const isHeightSet = height && height !== 'auto';

    useEffect(() => {
        // check that AppLovinMAX has been initialized
        AppLovinMAX.isInitialized().then((result: boolean) => {
            setIsInitialized(result);
            if (!result) {
                console.warn("ERROR: AppLovinMAX.AdView is mounted before the initialization of the AppLovin MAX React Native module");
            }
        });
    }, []);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        const sizeForBannerFormat = async () => {
            let isTablet;

            let adViewWidth;
            if (isWidthSet) {
                adViewWidth = width;
            } else {
                isTablet = await AppLovinMAX.isTablet();
                adViewWidth = isTablet ? ADVIEW_SIZE.leader.width : ADVIEW_SIZE.banner.width;
            }

            let adViewHeight;
            if (isHeightSet) {
                adViewHeight = height;
            } else {
                if (adaptiveBannerEnabled) {
                    adViewHeight = await AppLovinMAX.getAdaptiveBannerHeightForWidth(adViewWidth);
                } else {
                    if (isTablet === undefined) isTablet = await AppLovinMAX.isTablet();
                    adViewHeight = isTablet ? ADVIEW_SIZE.leader.height : ADVIEW_SIZE.banner.height;
                }
            }

            setDimensions({ width: adViewWidth, height: adViewHeight });
        }

        // evaluate width or height if either one is not defined, also evaluate when it is 'auto'.
        if (!(isWidthSet && isHeightSet)) {
            if (adFormat === AdFormat.BANNER) {
                sizeForBannerFormat();
            } else {
                setDimensions({
                    width: isWidthSet ? width : ADVIEW_SIZE.mrec.width,
                    height: isHeightSet ? height : ADVIEW_SIZE.mrec.height
                });
            }
        }

    }, [isInitialized]);

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
        const isSizeSet = isWidthSet && isHeightSet;
        const isDimensionsSet = (Object.keys(dimensions).length > 0);

        // Not sized yet
        if (!(isSizeSet || isDimensionsSet)) {
            return null;
        }
    }

    return (
        <AdViewComponent
            adUnitId={adUnitId}
            adFormat={adFormat}
            placement={placement}
            customData={customData}
            adaptiveBannerEnabled={adaptiveBannerEnabled}
            autoRefresh={autoRefresh}
            extraParameters={extraParameters}
            localExtraParameters={localExtraParameters}
            onAdLoadedEvent={onAdLoadedEvent}
            onAdLoadFailedEvent={onAdLoadFailedEvent}
            onAdDisplayFailedEvent={onAdDisplayFailedEvent}
            onAdClickedEvent={onAdClickedEvent}
            onAdExpandedEvent={onAdExpandedEvent}
            onAdCollapsedEvent={onAdCollapsedEvent}
            onAdRevenuePaidEvent={onAdRevenuePaidEvent}
            style={{ ...(style as ViewProps), ...dimensions }}
            {...otherProps}
        />
    );
};
