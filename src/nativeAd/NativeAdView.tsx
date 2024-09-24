import * as React from 'react';
import { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { NativeModules, requireNativeComponent, UIManager, findNodeHandle, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { NativeAdViewContext, NativeAdViewProvider } from './NativeAdViewProvider';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from '../types/AdInfo';
import type { AdNativeEvent } from '../types/AdEvent';
import type { NativeAd } from '../types/NativeAd';
import type { NativeAdViewHandler, NativeAdViewProps } from '../types/NativeAdViewProps';
import type { NativeAdViewType, NativeAdViewContextType } from './NativeAdViewProvider';

const { AppLovinMAX } = NativeModules;

type NativeAdViewNativeEvents = {
    onAdLoadedEvent(event: { nativeEvent: { nativeAd: NativeAd; adInfo: AdInfo } }): void;
    onAdLoadFailedEvent(event: AdNativeEvent<AdLoadFailedInfo>): void;
    onAdClickedEvent(event: AdNativeEvent<AdInfo>): void;
    onAdRevenuePaidEvent(event: AdNativeEvent<AdRevenueInfo>): void;
};

const NativeAdViewComponent = requireNativeComponent<NativeAdViewProps & ViewProps & NativeAdViewNativeEvents>('AppLovinMAXNativeAdView');

/**
 * The {@link NativeAdView} component that you use building a native ad. This loads a native ad and
 * renders it with the asset views:
 *
 * - {@link IconView}
 * - {@link TitleView}
 * - {@link AdvertiserView}
 * - {@link StarRatingView}
 * - {@link BodyView}
 * - {@link MediaView}
 * - {@link CallToActionView}
 *
 * {@link NativeAdView} fills each asset view with the data of a native ad as soon as it loads the native
 * ad, but you need to provide the layout and style of the asset views.
 * {@link NativeAdView} can reload a new native ad by using the ref handler.
 *
 * ### Example:
 * ```js
 * <NativeAdView
 *   ref={nativeAdViewHandler}
 *   adUnitId={adUnitId}
 *   style={styles.nativead}
 *   onAdLoaded={(adInfo: AdInfo) => { ... }}
 * >
 *   <View style={ ... }>
 *     <IconView style={styles.icon} />
 *     <TitleView style={styles.title} />
 *     <AdvertiserView style={styles.advertiser} />
 *     <StarRatingView style={styles.starRatingView} />
 *     <OptionsView style={styles.optionsView} />
 *     <BodyView style={styles.body} />
 *     <MediaView style={styles.mediaView} />
 *     <CallToActionView style={styles.callToAction} />
 *   </View>
 * </NativeAdView>
 * ```
 */
export const NativeAdView = forwardRef<NativeAdViewHandler, NativeAdViewProps & ViewProps>(function NativeAdView(props, ref) {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const checkInitialization = async () => {
            const result = await AppLovinMAX.isInitialized();
            setIsInitialized(result);
            if (!result) {
                console.warn('NativeAdView is mounted before the initialization of the AppLovin MAX React Native module.');
            }
        };

        checkInitialization();
    }, []);

    // Avoid rendering the NativeAdView if the SDK is not initialized
    if (!isInitialized) {
        return <View {...props} />;
    }

    return (
        <NativeAdViewProvider>
            <NativeAdViewImpl {...props} ref={ref} />
        </NativeAdViewProvider>
    );
});

const NativeAdViewImpl = forwardRef<NativeAdViewHandler, NativeAdViewProps & ViewProps>(function NativeAdViewImpl(
    { adUnitId, placement, customData, extraParameters, localExtraParameters, onAdLoaded, onAdLoadFailed, onAdClicked, onAdRevenuePaid, children, style, ...otherProps },
    ref
) {
    // Context provides functions to manage native ad and native ad view state
    const { setNativeAd, setNativeAdView } = useContext(NativeAdViewContext) as NativeAdViewContextType;

    const nativeAdViewRef = useRef<NativeAdViewType | null>(null);

    // Load a new ad
    const loadAd = useCallback(() => {
        if (nativeAdViewRef.current) {
            UIManager.dispatchViewManagerCommand(
                findNodeHandle(nativeAdViewRef.current),
                // @ts-ignore: Issue in RN ts defs
                UIManager.getViewManagerConfig('AppLovinMAXNativeAdView').Commands.loadAd,
                undefined
            );
        }
    }, []);

    useImperativeHandle(ref, () => ({ loadAd }), [loadAd]);

    // Save the DOM element reference
    const saveElement = useCallback(
        (element: NativeAdViewType | null) => {
            if (element) {
                nativeAdViewRef.current = element;
                setNativeAdView(element);
            }
        },
        [setNativeAdView]
    );

    const onAdLoadedEvent = useCallback(
        (event: { nativeEvent: { nativeAd: NativeAd; adInfo: AdInfo } }) => {
            setNativeAd(event.nativeEvent.nativeAd);
            onAdLoaded?.(event.nativeEvent.adInfo);
        },
        [onAdLoaded, setNativeAd]
    );

    const onAdLoadFailedEvent = useCallback(
        (event: AdNativeEvent<AdLoadFailedInfo>) => {
            onAdLoadFailed?.(event.nativeEvent);
        },
        [onAdLoadFailed]
    );

    const onAdClickedEvent = useCallback(
        (event: AdNativeEvent<AdInfo>) => {
            onAdClicked?.(event.nativeEvent);
        },
        [onAdClicked]
    );

    const onAdRevenuePaidEvent = useCallback(
        (event: AdNativeEvent<AdRevenueInfo>) => {
            onAdRevenuePaid?.(event.nativeEvent);
        },
        [onAdRevenuePaid]
    );

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
