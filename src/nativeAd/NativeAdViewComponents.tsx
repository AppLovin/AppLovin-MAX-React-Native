/**
 * Provides pre-styled React Native components for each native ad asset view:
 *
 * - TitleView
 * - AdvertiserView
 * - BodyView
 * - CallToActionView
 * - IconView
 * - OptionsView
 * - MediaView
 * - StarRatingView
 *
 * Each component pulls ad content and view refs from NativeAdView context,
 * and must be rendered inside a {@link NativeAdView}.
 */

import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import type { ViewProps, ImageProps, TextStyle, TextProps } from 'react-native';
import { NativeAdViewContext } from './NativeAdViewProvider';

/**
 * Renders the native ad’s title.
 */
export const TitleView = (props: TextProps) => {
    const { titleRef, nativeAd } = useContext(NativeAdViewContext);
    return (
        <Text {...props} ref={titleRef}>
            {nativeAd.title ?? ''}
        </Text>
    );
};

/**
 * Renders the advertiser name.
 */
export const AdvertiserView = (props: TextProps) => {
    const { advertiserRef, nativeAd } = useContext(NativeAdViewContext);
    return (
        <Text {...props} ref={advertiserRef}>
            {nativeAd.advertiser ?? ''}
        </Text>
    );
};

/**
 * Renders the ad’s body text (description).
 */
export const BodyView = (props: TextProps) => {
    const { bodyRef, nativeAd } = useContext(NativeAdViewContext);
    return (
        <Text {...props} ref={bodyRef}>
            {nativeAd.body ?? ''}
        </Text>
    );
};

/**
 * Renders the call-to-action label.
 * On iOS, wraps the text with a TouchableOpacity for better click behavior.
 */
export const CallToActionView = (props: TextProps) => {
    const { callToActionRef, nativeAd } = useContext(NativeAdViewContext);

    if (Platform.OS === 'android') {
        return (
            <Text {...props} ref={callToActionRef}>
                {nativeAd.callToAction ?? ''}
            </Text>
        );
    }

    return (
        <TouchableOpacity>
            <Text {...props} ref={callToActionRef}>
                {nativeAd.callToAction ?? ''}
            </Text>
        </TouchableOpacity>
    );
};

/**
 * Renders the icon image for the native ad.
 * Falls back to a blank placeholder if not available.
 */
export const IconView = (props: Omit<ImageProps, 'source'>) => {
    const { imageRef, nativeAd } = useContext(NativeAdViewContext);
    const defaultIcon = require('./img/blank_icon.png');

    const imageSource = (() => {
        if (nativeAd?.url) {
            return { uri: nativeAd.url };
        }
        if (nativeAd?.imageSource) {
            return { uri: `data:image/jpeg;base64,${nativeAd.imageSource}` };
        }
        return defaultIcon;
    })();

    return <Image {...props} ref={imageRef} source={imageSource} />;
};

/**
 * Renders the native ad’s options view.
 */
export const OptionsView = (props: ViewProps) => {
    const { optionViewRef } = useContext(NativeAdViewContext);
    return <View {...props} ref={optionViewRef} />;
};

/**
 * Renders the native ad’s media content.
 */
export const MediaView = (props: ViewProps) => {
    const { mediaViewRef } = useContext(NativeAdViewContext);
    return <View {...props} ref={mediaViewRef} />;
};

/**
 * Renders the star rating of the ad, using Unicode stars (★ and ☆).
 * Filled stars are rendered over hollow stars using a clipped view.
 */
export const StarRatingView = (props: ViewProps) => {
    const { style, ...restProps } = props;
    const maxStarCount = 5;
    const starTextStyle = useMemo(() => StyleSheet.flatten(style) as TextStyle, [style]);
    const starColor = starTextStyle.color ?? '#ffe234';
    const starSize = starTextStyle.fontSize ?? 10;
    const { nativeAd } = useContext(NativeAdViewContext);

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
