/**
 * Provides the NativeAdView component, which manages loading and rendering of native ads using the
 * AppLovin MAX SDK in React Native.
 */

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
 * The {@link NativeAdView} component renders a native ad and binds it to asset views:
 *
 * - {@link IconView}
 * - {@link TitleView}
 * - {@link AdvertiserView}
 * - {@link StarRatingView}
 * - {@link BodyView}
 * - {@link MediaView}
 * - {@link CallToActionView}
 *
 * Each asset view must be manually laid out and styled.
 * The component automatically populates content once an ad is loaded.
 * You can reload the ad using the component’s ref via `loadAd()`.
 *
 * **Note:** The AppLovin SDK must be initialized before using this component.
 *
 * ### Example:
 * ```tsx
 * <NativeAdView
 *   ref={nativeAdViewHandler}
 *   adUnitId={adUnitId}
 *   style={styles.nativead}
 *   onAdLoaded={(adInfo: AdInfo) => { ... }}
 * >
 *   <View style={...}>
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
 *
 * For a complete implementation example, see:
 * https://github.com/AppLovin/AppLovin-MAX-React-Native/blob/master/example/src/NativeAdViewExample.tsx
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

/**
 * Extracts native ad info from a synthetic event and invokes the provided callback, if any.
 * Ensures optional native ad fields have fallback defaults.
 */
const handleNativeAdViewEvent = <T extends AdInfoEvent | AdLoadFailedEvent>(event: NativeSyntheticEvent<T>, callback?: (adInfo: T) => void) => {
    if (!callback) return;
    callback(event.nativeEvent);
};

const NativeAdViewImpl = forwardRef<NativeAdViewHandler, NativeAdViewProps & ViewProps>(function NativeAdViewImpl(
    { adUnitId, placement, customData, extraParameters, localExtraParameters, onAdLoaded, onAdLoadFailed, onAdClicked, onAdRevenuePaid, children, style, ...otherProps },
    ref
) {
    // Context provides functions to manage native ad and native ad view state
    const { titleRef, advertiserRef, bodyRef, callToActionRef, imageRef, optionViewRef, mediaViewRef, setNativeAd } = useContext(NativeAdViewContext) as NativeAdViewContextType;

    const nativeAdViewRef = useRef<React.ElementRef<typeof NativeAdViewComponent> | undefined>();

    // Triggers a native ad load via the native command
    const loadAd = useCallback(() => {
        nativeAdViewRef.current && Commands.loadAd(nativeAdViewRef.current);
    }, []);

    const destroyAd = useCallback(() => {
        nativeAdViewRef.current && Commands.destroyAd(nativeAdViewRef.current);
    }, []);

    useImperativeHandle(ref, () => ({ loadAd, destroyAd }), [loadAd, destroyAd]);

    /**
     * Updates the native asset view binding for a given view type (e.g., TitleView, MediaView).
     */
    const updateAssetView = useCallback((assetViewRef: React.RefObject<View>, type: string) => {
        if (!nativeAdViewRef.current || !assetViewRef.current) return;

        const node = findNodeHandle(assetViewRef.current);
        if (node) {
            Commands.updateAssetView(nativeAdViewRef.current, node, type);
        }
    }, []);

    /**
     * Handles native ad load event:
     * - Updates context with the new native ad data
     * - Notifies native module of updated asset view mappings
     * - Triggers native rendering after all asset views are registered
     */
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
            strLocalExtraParameters={makeLocalExtraParametersArray(localExtraParameters, 'str')}
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
