import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect, useCallback } from "react";
import { NativeModules, requireNativeComponent, UIManager, findNodeHandle } from "react-native";
import { NativeAdViewContext, NativeAdViewProvider } from "./NativeAdViewProvider";
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from "../types/AdInfo";
import type { AdNativeEvent } from "../types/AdEvent";
import type { NativeAd } from "../types/NativeAd";
import type { NativeAdViewHandler, NativeAdViewProps } from "../types/NativeAdViewProps";
import type { NativeAdViewType, NativeAdViewContextType } from "./NativeAdViewProvider";

const { AppLovinMAX } = NativeModules;

type NativeAdViewNativeEvents = {
    onAdLoadedEvent(event: { nativeEvent: { nativeAd: NativeAd; adInfo: AdInfo; } }): void
    onAdLoadFailedEvent(event: AdNativeEvent<AdLoadFailedInfo>): void
    onAdClickedEvent(event: AdNativeEvent<AdInfo>): void
    onAdRevenuePaidEvent(event: AdNativeEvent<AdRevenueInfo>): void
};

const NativeAdViewComponent = requireNativeComponent<NativeAdViewProps & NativeAdViewNativeEvents>('AppLovinMAXNativeAdView');

/**
 * The `NativeAdView` component for building a native ad. This loads an ad and renders it with the asset views:
 *
 * - `IconView`
 * - `TitleView`
 * - `AdvertiserView`
 * - `StarRatingView`
 * - `BodyView`
 * - `MediaView`
 * - `CallToActionView`
 *
 * Each asset view will be filled with its data when loading an ad but the layout and style of the
 * asset views need to be provided.  A new ad can be loaded via the ref handler.
 * 
 * ### Example:
 * ```js
 * <NativeAdView
 *   ref={nativeAdViewHandler}
 *   adUnitId={adUnitId}
 *   style={styles.nativead}
 *   onAdLoaded={(adInfo: AdInfo) => { ... }}
 * >
 *   <View style={ ... }}>
 *     <IconView style={styles.icon} />
 *     <TitleView style={styles.title} />
 *     <AdvertiserView style={styles.advertiser} />
 *     <StarRatingView style={styles.starRatingView} />
 *     <OptionsView style={styles.optionsView} />
 *     <BodyView style={styles.body} />
 *     <MediaView style={{styles.mediaView}} />
 *     <CallToActionView style={styles.callToAction} />
 *   </View>
 * </NativeAdView>
 * ```
 */
export const NativeAdView = forwardRef<NativeAdViewHandler, NativeAdViewProps>((props, ref) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        // check that AppLovinMAX has been initialized
        AppLovinMAX.isInitialized().then((result: boolean) => {
            setIsInitialized(result);
            if (!result) {
                console.warn("ERROR: AppLovinMAX.NativeAdView is mounted before the initialization of the AppLovin MAX React Native module");
            }
        });
    }, []);

    // Not ready to render NativeAdView
    if (!isInitialized) {
        return null;
    }

    return (
        <NativeAdViewProvider>
            <NativeAdViewImpl {...props} ref={ref} />
        </NativeAdViewProvider>
    );
});

// NativeAdView renders itself multiple times:
// 1. initial render
// 2. update of the nativeAdView context by saveElement, which locates and renders the all child 
//    components including the user's components without nativeAd
// 3. update of the nativeAd context by onNativeAdLoaded, which renders the ad components with nativeAd
const NativeAdViewImpl = forwardRef<NativeAdViewHandler, NativeAdViewProps>(({
    adUnitId,
    placement,
    customData,
    extraParameters,
    localExtraParameters,
    onAdLoaded,
    onAdLoadFailed,
    onAdClicked,
    onAdRevenuePaid,
    children,
    style,
    ...otherProps
}, ref) => {

    // context from NativeAdViewProvider
    const { setNativeAd, setNativeAdView } = useContext(NativeAdViewContext) as NativeAdViewContextType;

    // keep the nativeAdView ref
    const nativeAdViewRef = useRef<NativeAdViewType | null>(null);

    // invoke the native ad loader
    const loadAd = () => {
        if (nativeAdViewRef) {
            UIManager.dispatchViewManagerCommand(
                findNodeHandle(nativeAdViewRef.current),
                UIManager.getViewManagerConfig("AppLovinMAXNativeAdView").Commands.loadAd,
                undefined
            );
        }
    };

    // expose a list of functions via the provided ref
    useImperativeHandle(ref, () => ({ loadAd }), []);

    // save the DOM element via the ref callback
    const saveElement = useCallback((element: NativeAdViewType | null) => {
        if (element) {
            nativeAdViewRef.current = element;
            setNativeAdView(element);
        }
    }, []);

    const onAdLoadedEvent = (event: { nativeEvent: { nativeAd: NativeAd; adInfo: AdInfo; } }) => {
        setNativeAd(event.nativeEvent.nativeAd);
        if (onAdLoaded) onAdLoaded(event.nativeEvent.adInfo);
    };

    const onAdLoadFailedEvent = (event: AdNativeEvent<AdLoadFailedInfo>) => {
        if (onAdLoadFailed) onAdLoadFailed(event.nativeEvent);
    };

    const onAdClickedEvent = (event: AdNativeEvent<AdInfo>) => {
        if (onAdClicked) onAdClicked(event.nativeEvent);
    };

    const onAdRevenuePaidEvent = (event: AdNativeEvent<AdRevenueInfo>) => {
        if (onAdRevenuePaid) onAdRevenuePaid(event.nativeEvent);
    };

    return (
        <NativeAdViewComponent
            ref={saveElement}
            adUnitId={adUnitId}
            placement={placement}
            customData={customData}
            extraParameters={extraParameters}
            localExtraParameters={localExtraParameters}
            onAdLoadedEvent={onAdLoadedEvent}
            onAdLoadFailedEvent={onAdLoadFailedEvent}
            onAdClickedEvent={onAdClickedEvent}
            onAdRevenuePaidEvent={onAdRevenuePaidEvent}
            style={style}
            {...otherProps}
        >
            {children}
        </NativeAdViewComponent>
    );
});
