import * as React from 'react';
import { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { findNodeHandle, View } from 'react-native';
import type { NativeSyntheticEvent, ViewProps } from 'react-native';
import AppLovinMAX from '../specs/NativeAppLovinMAXModule';
import NativeAdViewComponent, { Commands } from '../specs/AppLovinMAXNativeAdViewNativeComponent';
import type { AdInfoEvent, AdLoadFailedEvent } from '../specs/AppLovinMAXNativeAdViewNativeComponent';
import { NativeAdViewContext, NativeAdViewProvider } from './NativeAdViewProvider';
import type { NativeAdViewContextType } from './NativeAdViewProvider';
import type { NativeAdViewHandler, NativeAdViewProps } from '../types/NativeAdViewProps';
import { makeExtraParametersArray, makeLocalExtraParametersArray } from '../Utils';

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
        (async () => {
            const result = await AppLovinMAX.isInitialized();
            setIsInitialized(result);
            if (!result) {
                console.warn('NativeAdView is mounted before the initialization of the AppLovin MAX React Native module.');
            }
        })();
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

const handleNativeAdViewEvent = <T extends AdInfoEvent | AdLoadFailedEvent>(event: NativeSyntheticEvent<T>, callback?: (adInfo: T) => void) => {
    if (!callback) return;

    let adInfo: any = { ...event.nativeEvent };

    if ('nativeAd' in event.nativeEvent) {
        adInfo.nativeAd = {
            ...event.nativeEvent.nativeAd,
            isIconImageAvailable: event.nativeEvent.nativeAd?.isIconImageAvailable ?? false,
            isOptionsViewAvailable: event.nativeEvent.nativeAd?.isOptionsViewAvailable ?? false,
            isMediaViewAvailable: event.nativeEvent.nativeAd?.isMediaViewAvailable ?? false,
        };
    }

    callback(adInfo);
};

const NativeAdViewImpl = forwardRef<NativeAdViewHandler, NativeAdViewProps & ViewProps>(function NativeAdViewImpl(
    { adUnitId, placement, customData, extraParameters, localExtraParameters, onAdLoaded, onAdLoadFailed, onAdClicked, onAdRevenuePaid, children, style, ...otherProps },
    ref
) {
    // Context provides functions to manage native ad and native ad view state
    const { titleRef, advertiserRef, bodyRef, callToActionRef, imageRef, optionViewRef, mediaViewRef, setNativeAd } = useContext(NativeAdViewContext) as NativeAdViewContextType;

    const nativeAdViewRef = useRef<React.ElementRef<typeof NativeAdViewComponent> | undefined>();

    // Load a new ad
    const loadAd = useCallback(() => {
        nativeAdViewRef.current && Commands.loadAd(nativeAdViewRef.current);
    }, []);

    useImperativeHandle(ref, () => ({ loadAd }), [loadAd]);

    const updateAssetView = useCallback((assetViewRef: React.RefObject<View>, type: string) => {
        if (!nativeAdViewRef.current || !assetViewRef.current) return;

        const node = findNodeHandle(assetViewRef.current);
        if (node) {
            Commands.updateAssetView(nativeAdViewRef.current, node, type);
        }
    }, []);

    const onAdLoadedEvent = useCallback(
        (event: NativeSyntheticEvent<AdInfoEvent>) => {
            const nativeAdImpl = event.nativeEvent.nativeAdImpl;

            if (nativeAdImpl) {
                setNativeAd({ ...nativeAdImpl });

                if (nativeAdImpl.title) updateAssetView(titleRef, 'TitleView');
                if (nativeAdImpl.advertiser) updateAssetView(advertiserRef, 'AdvertiserView');
                if (nativeAdImpl.body) updateAssetView(bodyRef, 'BodyView');
                if (nativeAdImpl.callToAction) updateAssetView(callToActionRef, 'CallToActionView');
                if (nativeAdImpl.url || nativeAdImpl.image || nativeAdImpl.imageSource) updateAssetView(imageRef, 'IconView');
                if (nativeAdImpl.isOptionsViewAvailable) updateAssetView(optionViewRef, 'OptionsView');
                if (nativeAdImpl.isMediaViewAvailable) updateAssetView(mediaViewRef, 'MediaView');
            }

            if (nativeAdViewRef.current) {
                Commands.renderNativeAd(nativeAdViewRef.current);
            }

            handleNativeAdViewEvent(event, onAdLoaded);
        },
        [setNativeAd, onAdLoaded, updateAssetView, titleRef, advertiserRef, bodyRef, callToActionRef, imageRef, optionViewRef, mediaViewRef]
    );

    const onAdLoadFailedEvent = useCallback((event: NativeSyntheticEvent<AdLoadFailedEvent>) => handleNativeAdViewEvent(event, onAdLoadFailed), [onAdLoadFailed]);

    const onAdClickedEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleNativeAdViewEvent(event, onAdClicked), [onAdClicked]);

    const onAdRevenuePaidEvent = useCallback((event: NativeSyntheticEvent<AdInfoEvent>) => handleNativeAdViewEvent(event, onAdRevenuePaid), [onAdRevenuePaid]);

    return (
        <NativeAdViewComponent
            ref={(element) => (nativeAdViewRef.current = element ?? undefined)}
            adUnitId={adUnitId}
            placement={placement}
            customData={customData}
            extraParameters={makeExtraParametersArray(extraParameters)}
            strLocalExtraParameters={makeLocalExtraParametersArray(localExtraParameters, 'string')}
            numLocalExtraParameters={makeLocalExtraParametersArray(localExtraParameters, 'number')}
            boolLocalExtraParameters={makeLocalExtraParametersArray(localExtraParameters, 'bool')}
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
