import { NativeModules, requireNativeComponent } from "react-native";
import type { ViewProps, ViewStyle } from "react-native";
import React, { useEffect, useState } from "react";
import { AdFormat } from "./types/AdFormat";
import type { AdDisplayFailedInfo, AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "./types/AdInfo";
import type { AdNativeEvent } from "./types/AdEvent";
import type { AdViewProps } from "./types/AdViewProps";

const { AppLovinMAX } = NativeModules;

/**
 * Defines callback functions for receiving events from the native module.
 *
 * The received events are delivered to the app via the corresponding AdViewProps callbacks.
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
 * A native module of AdView
 */
const AdViewComponent = requireNativeComponent<AdViewProps & AdViewNativeEvents>("AppLovinMAXAdView");

/**
 * The AdView component for building a banner or a MRec.
 */
export const AdView = (props: AdViewProps) => {
    const {
        style,
        extraParameters,
        localExtraParameters,
        adaptiveBannerEnabled = true,
        autoRefresh = true,
        ...otherProps
    } = props;

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<{ width?: number, height?: number }>({});

    const viewWidth: string | number | undefined = (style as ViewStyle)?.width;
    const viewHeight: string | number | undefined = (style as ViewStyle)?.height;

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
            const width: number = isTablet ? 728 : 320;
            let height: number;
            if (props.adaptiveBannerEnabled) {
                height = await AppLovinMAX.getAdaptiveBannerHeightForWidth(-1);
            } else {
                height = isTablet ? 90 : 50;
            }
            setDimensions({
                width: (viewWidth && viewWidth !== 'auto') ? viewWidth as number : width,
                height: (viewHeight && viewHeight !== 'auto') ? viewHeight as number : height
            });
        }

        // Check whether or not app specifies both width and height but not with 'auto'
        const isSizeSpecified = ((viewWidth && viewWidth !== 'auto') &&
            (viewHeight && viewHeight !== 'auto'));

        if (!isSizeSpecified) {
            if (props.adFormat === AdFormat.BANNER) {
                sizeForBannerFormat();
            } else {
                setDimensions({
                    width: (viewWidth && viewWidth !== 'auto') ? viewWidth as number : 300,
                    height: (viewHeight && viewHeight !== 'auto') ? viewHeight as number : 250
                });
            }
        }
    }, [isInitialized]);

    const onAdLoadedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (props.onAdLoaded) props.onAdLoaded(event.nativeEvent);
    };

    const onAdLoadFailedEvent = (event: AdNativeEvent<AdLoadFailedInfo>) => {
        if (props.onAdLoadFailed) props.onAdLoadFailed(event.nativeEvent);
    };

    const onAdDisplayFailedEvent = (event: AdNativeEvent<AdDisplayFailedInfo>) => {
        if (props.onAdDisplayFailed) props.onAdDisplayFailed(event.nativeEvent);
    };

    const onAdClickedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (props.onAdClicked) props.onAdClicked(event.nativeEvent);
    };

    const onAdExpandedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (props.onAdExpanded) props.onAdExpanded(event.nativeEvent);
    };

    const onAdCollapsedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (props.onAdCollapsed) props.onAdCollapsed(event.nativeEvent);
    };

    const onAdRevenuePaidEvent = (event: AdNativeEvent<AdRevenueInfo>) => {
        if (props.onAdRevenuePaid) props.onAdRevenuePaid(event.nativeEvent);
    };

    // Not initialized
    if (!isInitialized) {
        return null;
    } else {
        const isSizeSpecified = ((viewWidth && viewWidth !== 'auto') &&
            (viewHeight && viewHeight !== 'auto'));
        const isDimensionsSet = (Object.keys(dimensions).length > 0);

        // Not sized yet
        if (!(isSizeSpecified || isDimensionsSet)) {
            return null;
        }
    }

    return (
        <AdViewComponent
            style={{ ...(style as ViewProps), ...dimensions }}
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
            {...otherProps}
        />
    );
};
