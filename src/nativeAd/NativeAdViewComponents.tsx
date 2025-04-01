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
import type { ViewProps, ImageProps, TextProps } from 'react-native';
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

    const imageSource = useMemo(() => {
        if (nativeAd?.url) {
            return { uri: nativeAd.url };
        }
        if (nativeAd?.imageSource) {
            return { uri: `data:image/jpeg;base64,${nativeAd.imageSource}` };
        }
        return defaultIcon;
    }, [nativeAd.url, nativeAd.imageSource, defaultIcon]);

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
 * Props for the {@link StarRatingView} component, which displays a star rating
 * using Unicode stars (★ and ☆) styled with color, shadow, and size.
 */
type StarRatingViewProps = ViewProps & {
    /**
     * The color used for filled (active) stars.
     * Defaults to gold (#ffe234).
     */
    color?: string;

    /**
     * The color used for empty (inactive) stars.
     * Defaults to light gray (#dedede).
     */
    shadowColor?: string;

    /**
     * The size of each star, which also determines their visual size.
     * Defaults to 10.
     */
    size?: number;
};

/**
 * Renders the star rating of the ad, using Unicode stars (★ and ☆).
 * Filled stars are rendered over hollow stars using a clipped view.
 */
export const StarRatingView = ({ color = '#ffe234', shadowColor = '#dedede', size = 10, style }: StarRatingViewProps) => {
    const { nativeAd } = useContext(NativeAdViewContext);
    const maxStarCount = 5;

    const containerStyle = useMemo(() => StyleSheet.flatten([style, styles.starRatingContainer]), [style]);

    const stars = useMemo(() => {
        const starRating = Math.max(0, Math.min(maxStarCount, nativeAd.starRating ?? 0));

        return Array.from({ length: maxStarCount }).map((_, index) => {
            const isFull = starRating > index;
            const width = Math.min(size, Math.max(0, (starRating - index) * size));

            return (
                <View key={index}>
                    <Text style={{ fontSize: size, color: isFull ? color : shadowColor }}>{String.fromCodePoint(0x2606)}</Text>
                    {isFull && (
                        <View style={[{ width }, styles.starRating]}>
                            <Text style={{ fontSize: size, color }}>{String.fromCodePoint(0x2605)}</Text>
                        </View>
                    )}
                </View>
            );
        });
    }, [nativeAd.starRating, color, shadowColor, size]);

    if (!nativeAd.starRating) {
        return <View style={containerStyle} />;
    }

    return <View style={containerStyle}>{stars}</View>;
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
