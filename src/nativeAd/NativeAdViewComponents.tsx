import * as React from 'react';
import { useContext, useRef, useEffect, useCallback, useMemo } from 'react';
import { findNodeHandle, Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import type { ViewProps, ImageProps, TextStyle, StyleProp, TextProps } from 'react-native';
import { NativeAdViewContext } from './NativeAdViewProvider';
import type { NativeAd } from '../types/NativeAd';

// Custom hook to handle setting native ad view properties and return nativeAd
const useNativeAdViewProps = (nativeAdProp: keyof NativeAd, ref: React.RefObject<any>, nativePropKey: string) => {
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    const setNativeProps = useCallback(() => {
        if (!nativeAd[nativeAdProp] || !ref.current) return;
        nativeAdView?.setNativeProps({
            [nativePropKey]: findNodeHandle(ref.current),
        });
    }, [nativeAd, nativeAdProp, nativeAdView, ref, nativePropKey]);

    useEffect(() => {
        setNativeProps();
    }, [setNativeProps]);

    return nativeAd;
};

export const TitleView = (props: TextProps) => {
    const titleRef = useRef<Text | null>(null);
    const nativeAd = useNativeAdViewProps('title', titleRef, 'titleView');

    return (
        <Text {...props} ref={titleRef}>
            {nativeAd.title || null}
        </Text>
    );
};

export const AdvertiserView = (props: TextProps) => {
    const advertiserRef = useRef<Text | null>(null);
    const nativeAd = useNativeAdViewProps('advertiser', advertiserRef, 'advertiserView');

    return (
        <Text {...props} ref={advertiserRef}>
            {nativeAd.advertiser || null}
        </Text>
    );
};

export const BodyView = (props: TextProps) => {
    const bodyRef = useRef<Text | null>(null);
    const nativeAd = useNativeAdViewProps('body', bodyRef, 'bodyView');

    return (
        <Text {...props} ref={bodyRef}>
            {nativeAd.body || null}
        </Text>
    );
};

export const CallToActionView = (props: TextProps) => {
    const callToActionRef = useRef<Text | null>(null);
    const nativeAd = useNativeAdViewProps('callToAction', callToActionRef, 'callToActionView');

    return (
        <TouchableOpacity>
            <Text {...props} ref={callToActionRef}>
                {nativeAd.callToAction || null}
            </Text>
        </TouchableOpacity>
    );
};

export const IconView = (props: Omit<ImageProps, 'source'>) => {
    const imageRef = useRef<Image | null>(null);
    const nativeAd = useNativeAdViewProps('image', imageRef, 'iconView');

    return nativeAd.url ? (
        <Image {...props} ref={imageRef} source={{ uri: nativeAd.url }} />
    ) : nativeAd.image ? (
        <Image {...props} ref={imageRef} source={0} />
    ) : (
        <View {...props} />
    );
};

export const OptionsView = (props: ViewProps) => {
    const viewRef = useRef<View | null>(null);
    useNativeAdViewProps('isOptionsViewAvailable', viewRef, 'optionsView');

    return <View {...props} ref={viewRef} />;
};

export const MediaView = (props: ViewProps) => {
    const viewRef = useRef<View | null>(null);
    useNativeAdViewProps('isMediaViewAvailable', viewRef, 'mediaView');

    return <View {...props} ref={viewRef} />;
};

export const StarRatingView = (props: ViewProps) => {
    const { style, ...restProps } = props;

    const maxStarCount = 5;
    const starColor = StyleSheet.flatten((style as StyleProp<TextStyle>) || {}).color ?? '#ffe234';
    const starSize = StyleSheet.flatten((style as StyleProp<TextStyle>) || {}).fontSize ?? 10;

    const { nativeAd } = useContext(NativeAdViewContext);

    // Memoize the star rendering process
    const stars = useMemo(() => {
        if (!nativeAd.starRating) {
            return Array.from({ length: maxStarCount }).map((_, index) => (
                <Text key={index} style={{ fontSize: starSize }}>
                    {' '}
                </Text>
            ));
        }

        return Array.from({ length: maxStarCount }).map((_, index) => {
            const starRating = nativeAd.starRating!;
            const width = (starRating - index) * starSize;
            return (
                <View key={index}>
                    <Text style={{ fontSize: starSize, color: starColor }}>{String.fromCodePoint(0x2606)}</Text>
                    {starRating > index && (
                        <View style={[{ width: width }, styles.starRating]}>
                            <Text style={{ fontSize: starSize, color: starColor }}>{String.fromCodePoint(0x2605)}</Text>
                        </View>
                    )}
                </View>
            );
        });
    }, [nativeAd.starRating, starColor, starSize]);

    return (
        <View {...restProps} style={[style, styles.starRatingContainer]}>
            {stars}
        </View>
    );
};

const styles = StyleSheet.create({
    starRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starRating: {
        overflow: 'hidden',
        position: 'absolute',
    },
});
