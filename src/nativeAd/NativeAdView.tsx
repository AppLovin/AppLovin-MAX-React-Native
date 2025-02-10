import * as React from 'react';
import { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { findNodeHandle, View } from 'react-native';
import type { NativeSyntheticEvent, ViewProps } from 'react-native';
import AppLovinMAX from '../specs/NativeAppLovinMAXMoudle';
import NativeAdViewComponent, { Commands } from '../specs/AppLovinMAXNativeAdViewNativeComponent';
import type { AdNativeInfoEvent, AdInfoEvent, AdLoadFailedEvent } from '../specs/AppLovinMAXNativeAdViewNativeComponent';
import { NativeAdViewContext, NativeAdViewProvider } from './NativeAdViewProvider';
import type { NativeAdViewContextType } from './NativeAdViewProvider';
import type { NativeAdViewHandler, NativeAdViewProps } from '../types/NativeAdViewProps';
import type { LocalExtraParameterValue } from '../types/AdProps';

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

const makeExtraParametersArray = (input?: { [key: string]: string | null }): Array<{ key: string; value: string | null }> => {
    if (!input) return [];
    return Object.entries(input).map(([key, value]) => ({
        key,
        value,
    }));
};

// TODO: only string works for now
const makeLocalExtraParametersArray = (input?: { [key: string]: LocalExtraParameterValue }): Array<{ key: string; value: string | null }> => {
    if (!input) return [];
    return Object.entries(input)
        .filter(([_, value]) => typeof value === 'string' || value === null) // Keep only strings and null
        .map(([key, value]) => ({
            key,
            value: value as string | null, // Type assertion to match the expected output type
        }));
};

const NativeAdViewImpl = forwardRef<NativeAdViewHandler, NativeAdViewProps & ViewProps>(function NativeAdViewImpl(
    { adUnitId, placement, customData, extraParameters, localExtraParameters, onAdLoaded, onAdLoadFailed, onAdClicked, onAdRevenuePaid, children, style, ...otherProps },
    ref
) {
    // Context provides functions to manage native ad and native ad view state
    const { titleRef, advertiserRef, bodyRef, callToActionRef, imageRef, optionViewRef, mediaViewRef, setNativeAd, setNativeAdView } = useContext(
        NativeAdViewContext
    ) as NativeAdViewContextType;

    const nativeAdViewRef = useRef<React.ElementRef<typeof NativeAdViewComponent> | undefined>();

    // Load a new ad
    const loadAd = useCallback(() => {
        if (nativeAdViewRef.current) {
            Commands.loadAd(nativeAdViewRef.current);
        }
    }, []);

    useImperativeHandle(ref, () => ({ loadAd }), [loadAd]);

    // Save the DOM element reference
    const saveElement = (element: React.ElementRef<typeof NativeAdViewComponent>) => {
        if (element === null) {
            return;
        }
        nativeAdViewRef.current = element;
        setNativeAdView(element);
    };

    const onAdLoadedEvent = useCallback(
        (event: NativeSyntheticEvent<AdNativeInfoEvent>) => {
            setNativeAd({
                title: event.nativeEvent.nativeAd.title,
                advertiser: event.nativeEvent.nativeAd.advertiser,
                body: event.nativeEvent.nativeAd.body,
                callToAction: event.nativeEvent.nativeAd.callToAction,
                image: event.nativeEvent.nativeAd.image,
                url: event.nativeEvent.nativeAd.url,
                starRating: event.nativeEvent.nativeAd.starRating,
                isOptionsViewAvailable: event.nativeEvent.nativeAd.isOptionsViewAvailable,
                isMediaViewAvailable: event.nativeEvent.nativeAd.isMediaViewAvailable,
            });

            if (titleRef.current && event.nativeEvent.nativeAd.title) {
                const node = findNodeHandle(titleRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'TitleView');
                }
            }
            if (advertiserRef.current && event.nativeEvent.nativeAd.advertiser) {
                const node = findNodeHandle(advertiserRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'AdvertiserView');
                }
            }
            if (bodyRef.current && event.nativeEvent.nativeAd.body) {
                const node = findNodeHandle(bodyRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'BodyView');
                }
            }
            if (callToActionRef.current && event.nativeEvent.nativeAd.callToAction) {
                const node = findNodeHandle(callToActionRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'CallToActionView');
                }
            }
            if (imageRef.current && (event.nativeEvent.nativeAd.image || event.nativeEvent.nativeAd.url)) {
                const node = findNodeHandle(imageRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'IconView');
                }
            }
            if (optionViewRef.current && event.nativeEvent.nativeAd.isOptionsViewAvailable) {
                const node = findNodeHandle(optionViewRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'OptionsView');
                }
            }
            if (mediaViewRef.current && event.nativeEvent.nativeAd.isMediaViewAvailable) {
                const node = findNodeHandle(mediaViewRef.current);
                if (node) {
                    Commands.updateAssetView(nativeAdViewRef.current!, node, 'MediaView');
                }
            }

            Commands.renderNativeAd(nativeAdViewRef.current!);

            onAdLoaded?.({
                adUnitId: event.nativeEvent.adInfo.adUnitId,
                adFormat: event.nativeEvent.adInfo.adFormat,
                creativeId: event.nativeEvent.adInfo.creativeId,
                networkName: event.nativeEvent.adInfo.networkName,
                networkPlacement: event.nativeEvent.adInfo.networkPlacement,
                placement: event.nativeEvent.adInfo.placement,
                revenue: event.nativeEvent.adInfo.revenue,
                revenuePrecision: event.nativeEvent.adInfo.revenuePrecision,
                dspName: event.nativeEvent.adInfo.dspName,
                latencyMillis: event.nativeEvent.adInfo.latencyMillis,
                nativeAd: {
                    title: event.nativeEvent.adInfo.nativeAd?.title,
                    advertiser: event.nativeEvent.adInfo.nativeAd?.advertiser,
                    body: event.nativeEvent.adInfo.nativeAd?.body,
                    callToAction: event.nativeEvent.adInfo.nativeAd?.callToAction,
                    starRating: event.nativeEvent.adInfo.nativeAd?.starRating,
                    mediaContentAspectRatio: event.nativeEvent.adInfo.nativeAd?.mediaContentAspectRatio,
                    isIconImageAvailable: event.nativeEvent.adInfo.nativeAd?.isIconImageAvailable ?? false,
                    isOptionsViewAvailable: event.nativeEvent.adInfo.nativeAd?.isOptionsViewAvailable ?? false,
                    isMediaViewAvailable: event.nativeEvent.adInfo.nativeAd?.isMediaViewAvailable ?? false,
                },
            });
        },
        [onAdLoaded, setNativeAd, titleRef, advertiserRef, bodyRef, callToActionRef, imageRef, optionViewRef, mediaViewRef]
    );

    const onAdLoadFailedEvent = useCallback(
        (event: NativeSyntheticEvent<AdLoadFailedEvent>) => {
            onAdLoadFailed?.({
                adUnitId: event.nativeEvent.adUnitId,
                code: event.nativeEvent.code,
                message: event.nativeEvent.message,
                mediatedNetworkErrorCode: event.nativeEvent.mediatedNetworkErrorCode,
                mediatedNetworkErrorMessage: event.nativeEvent.mediatedNetworkErrorMessage,
            });
        },
        [onAdLoadFailed]
    );

    const onAdClickedEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdClicked?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                nativeAd: {
                    title: event.nativeEvent.nativeAd?.title,
                    advertiser: event.nativeEvent.nativeAd?.advertiser,
                    body: event.nativeEvent.nativeAd?.body,
                    callToAction: event.nativeEvent.nativeAd?.callToAction,
                    starRating: event.nativeEvent.nativeAd?.starRating,
                    mediaContentAspectRatio: event.nativeEvent.nativeAd?.mediaContentAspectRatio,
                    isIconImageAvailable: event.nativeEvent.nativeAd?.isIconImageAvailable ?? false,
                    isOptionsViewAvailable: event.nativeEvent.nativeAd?.isOptionsViewAvailable ?? false,
                    isMediaViewAvailable: event.nativeEvent.nativeAd?.isMediaViewAvailable ?? false,
                },
            });
        },
        [onAdClicked]
    );

    const onAdRevenuePaidEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            onAdRevenuePaid?.({
                adUnitId: event.nativeEvent.adUnitId,
                adFormat: event.nativeEvent.adFormat,
                creativeId: event.nativeEvent.creativeId,
                networkName: event.nativeEvent.networkName,
                networkPlacement: event.nativeEvent.networkPlacement,
                placement: event.nativeEvent.placement,
                revenue: event.nativeEvent.revenue,
                revenuePrecision: event.nativeEvent.revenuePrecision,
                dspName: event.nativeEvent.dspName,
                latencyMillis: event.nativeEvent.latencyMillis,
                nativeAd: {
                    title: event.nativeEvent.nativeAd?.title,
                    advertiser: event.nativeEvent.nativeAd?.advertiser,
                    body: event.nativeEvent.nativeAd?.body,
                    callToAction: event.nativeEvent.nativeAd?.callToAction,
                    starRating: event.nativeEvent.nativeAd?.starRating,
                    mediaContentAspectRatio: event.nativeEvent.nativeAd?.mediaContentAspectRatio,
                    isIconImageAvailable: event.nativeEvent.nativeAd?.isIconImageAvailable ?? false,
                    isOptionsViewAvailable: event.nativeEvent.nativeAd?.isOptionsViewAvailable ?? false,
                    isMediaViewAvailable: event.nativeEvent.nativeAd?.isMediaViewAvailable ?? false,
                },
            });
        },
        [onAdRevenuePaid]
    );

    return (
        <NativeAdViewComponent
            ref={saveElement}
            adUnitId={adUnitId}
            placement={placement}
            customData={customData}
            extraParameters={makeExtraParametersArray(extraParameters)}
            localExtraParameters={makeLocalExtraParametersArray(localExtraParameters)}
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
