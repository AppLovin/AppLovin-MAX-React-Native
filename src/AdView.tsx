import { NativeModules, requireNativeComponent } from "react-native";
import type { ViewProps, ViewStyle } from "react-native";
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
const AD_SIZE = {
    banner: { width: 320, height: 50 },
    leader: { width: 728, height: 90 },
    mrec: { width: 300, height: 250 },
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

    const viewWidth = (style as ViewStyle)?.width;
    const viewHeight = (style as ViewStyle)?.height;
    const hasViewWidth = viewWidth && viewWidth !== 'auto';
    const hasViewHeight = viewHeight && viewHeight !== 'auto';

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

            let width;
            if (hasViewWidth) {
                width = viewWidth;
            } else {
                isTablet = await AppLovinMAX.isTablet();
                width = isTablet ? AD_SIZE.leader.width : AD_SIZE.banner.width;
            }

            let height;
            if (hasViewHeight) {
                height = viewHeight;
            } else {
                if (adaptiveBannerEnabled) {
                    height = await AppLovinMAX.getAdaptiveBannerHeightForWidth(width);
                } else {
                    isTablet ??= await AppLovinMAX.isTablet();
                    height = isTablet ? AD_SIZE.leader.height : AD_SIZE.banner.height;
                }
            }

            setDimensions({ width: width, height: height });
        }

        if (!(hasViewWidth && hasViewHeight)) {
            if (adFormat === AdFormat.BANNER) {
                sizeForBannerFormat();
            } else {
                setDimensions({
                    width: hasViewWidth ? viewWidth : AD_SIZE.mrec.width,
                    height: hasViewHeight ? viewHeight : AD_SIZE.mrec.height
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
        const isSizeSpecified = hasViewWidth && hasViewHeight;
        const isDimensionsSet = (Object.keys(dimensions).length > 0);

        // Not sized yet
        if (!(isSizeSpecified || isDimensionsSet)) {
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
