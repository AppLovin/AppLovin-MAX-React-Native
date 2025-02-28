import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import type { ViewProps, ImageProps, TextStyle, TextProps } from 'react-native';
import { NativeAdViewContext } from './NativeAdViewProvider';

export const TitleView = (props: TextProps) => {
    const { titleRef, nativeAd } = useContext(NativeAdViewContext);
    return (
        <Text {...props} ref={titleRef}>
            {nativeAd.title ?? ''}
        </Text>
    );
};

export const AdvertiserView = (props: TextProps) => {
    const { advertiserRef, nativeAd } = useContext(NativeAdViewContext);
    return (
        <Text {...props} ref={advertiserRef}>
            {nativeAd.advertiser ?? ''}
        </Text>
    );
};

export const BodyView = (props: TextProps) => {
    const { bodyRef, nativeAd } = useContext(NativeAdViewContext);
    return (
        <Text {...props} ref={bodyRef}>
            {nativeAd.body ?? ''}
        </Text>
    );
};

export const CallToActionView = (props: TextProps) => {
    const { callToActionRef, nativeAd } = useContext(NativeAdViewContext);
    // TouchableOpacity disables clicking on certain Android devices.
    if (Platform.OS === 'android') {
        return (
            <Text {...props} ref={callToActionRef}>
                {nativeAd.callToAction ?? ''}
            </Text>
        );
    } else {
        return (
            <TouchableOpacity>
                <Text {...props} ref={callToActionRef}>
                    {nativeAd.callToAction ?? ''}
                </Text>
            </TouchableOpacity>
        );
    }
};

export const IconView = (props: Omit<ImageProps, 'source'>) => {
    const { imageRef, nativeAd } = useContext(NativeAdViewContext);
    const defaultIcon = require('./img/blank_icon.png');
    const imageSource =
        (nativeAd?.url && { uri: nativeAd.url }) || (nativeAd.image ? defaultIcon : nativeAd.imageSource ? { uri: `data:image/jpeg;base64,${nativeAd.imageSource}` } : defaultIcon);
    return <Image {...props} ref={imageRef} source={imageSource} />;
};

export const OptionsView = (props: ViewProps) => {
    const { optionViewRef } = useContext(NativeAdViewContext);
    return <View {...props} ref={optionViewRef} />;
};

export const MediaView = (props: ViewProps) => {
    const { mediaViewRef } = useContext(NativeAdViewContext);
    return <View {...props} ref={mediaViewRef} />;
};

export const StarRatingView = (props: ViewProps) => {
    const { style, ...restProps } = props;
    const maxStarCount = 5;
    const starTextStyle = StyleSheet.flatten(style) as TextStyle;
    const starColor = starTextStyle.color ?? '#ffe234';
    const starSize = starTextStyle.fontSize ?? 10;
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
