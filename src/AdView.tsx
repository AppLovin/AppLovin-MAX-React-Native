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
    const [dimensions, setDimensions] = useState<{ minWidth?: number | string, minHeight?: number | string }>({});

    const [width, _height] = getFlattenedSize(style);

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
            const isTablet = await AppLovinMAX.isTablet();

            const minWidth = isTablet ? ADVIEW_SIZE.leader.width : ADVIEW_SIZE.banner.width;

            let minHeight;
            if (adaptiveBannerEnabled) {
                if ( typeof width === "number" && width > minWidth)
                    minHeight = await AppLovinMAX.getAdaptiveBannerHeightForWidth(width);
                else
                    minHeight = await AppLovinMAX.getAdaptiveBannerHeightForWidth(minWidth);
            } else {
                minHeight = isTablet ? ADVIEW_SIZE.leader.height : ADVIEW_SIZE.banner.height;
            }

            setDimensions({minWidth: minWidth, minHeight: minHeight});
        }

        if (adFormat === AdFormat.BANNER) {
            sizeForBannerFormat();
        } else {
            setDimensions({minWidth: ADVIEW_SIZE.mrec.width, minHeight: ADVIEW_SIZE.mrec.height});
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
        const isDimensionsSet = (Object.keys(dimensions).length > 0);

        // Not sized yet
        if (!isDimensionsSet) {
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
