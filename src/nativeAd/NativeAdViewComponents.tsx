import React, { useContext, useRef, useEffect } from "react";
import type { ViewProps, ImageProps, TextStyle, StyleProp } from "react-native";
import { findNodeHandle, Text, Image, View, TouchableOpacity, StyleSheet } from "react-native";
import { NativeAdViewContext } from "./NativeAdViewProvider";

export const TitleView = (props: ViewProps) => {
    const titleRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.title || !titleRef.current) return;

        nativeAdView?.setNativeProps({
            titleView: findNodeHandle(titleRef.current),
        });
    }, [nativeAd]);

    return (
        <Text {...props} ref={titleRef}>
            {nativeAd.title || null}
        </Text>
    );
};

export const AdvertiserView = (props: ViewProps) => {
    const advertiserRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.advertiser || !advertiserRef.current) return;

        nativeAdView?.setNativeProps({
            advertiserView: findNodeHandle(advertiserRef.current),
        });
    }, [nativeAd]);

    return (
        <Text {...props} ref={advertiserRef}>
            {nativeAd.advertiser || null}
        </Text>
    );
};

export const BodyView = (props: ViewProps) => {
    const bodyRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.body || !bodyRef.current) return;

        nativeAdView?.setNativeProps({
            bodyView: findNodeHandle(bodyRef.current),
        });
    }, [nativeAd]);

    return (
        <Text {...props} ref={bodyRef}>
            {nativeAd.body || null}
        </Text>
    );
};

export const CallToActionView = (props: ViewProps) => {
    const callToActionRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.callToAction || !callToActionRef.current) return;

        nativeAdView?.setNativeProps({
            callToActionView: findNodeHandle(callToActionRef.current),
        });
    }, [nativeAd]);

    return (
        <TouchableOpacity {...props}>
            <Text {...props} ref={callToActionRef}>
                {nativeAd.callToAction || null}
            </Text>
        </TouchableOpacity>
    );
};

export const IconView = (props: Omit<ImageProps, | 'source'>) => {
    const imageRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.image || !imageRef.current) return;

        nativeAdView?.setNativeProps({
            iconView: findNodeHandle(imageRef.current),
        });
    }, [nativeAd]);

    return (
        nativeAd.url ? <Image {...props} source={{ uri: nativeAd.url }} /> :
            nativeAd.image ? <Image {...props} ref={imageRef} source={0} /> :
                <View {...props} />
    );
};

export const OptionsView = (props: ViewProps) => {
    const viewRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.isOptionsViewAvailable || !viewRef.current) return;
        nativeAdView?.setNativeProps({
            optionsView: findNodeHandle(viewRef.current),
        });
    }, [nativeAd]);

    return (
        <View {...props} ref={viewRef} />
    );
};

export const MediaView = (props: ViewProps) => {
    const viewRef = useRef(null);
    const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

    useEffect(() => {
        if (!nativeAd.isMediaViewAvailable || !viewRef.current) return;

        nativeAdView?.setNativeProps({
            mediaView: findNodeHandle(viewRef.current),
        });
    }, [nativeAd]);

    return (
        <View {...props} ref={viewRef} />
    );
};

export const StarRatingView = (props: ViewProps) => {
    const { style, ...restProps } = props;

    const maxStarCount = 5;
    const starColor = StyleSheet.flatten(style as StyleProp<TextStyle> || {}).color ?? "#ffe234";
    const starSize = StyleSheet.flatten(style as StyleProp<TextStyle> || {}).fontSize ?? 10;

    const { nativeAd } = useContext(NativeAdViewContext);

    const FilledStar = () => {
        return (
            // black star in unicode
            <Text style={{ fontSize: starSize, color: starColor }}>{String.fromCodePoint(0x2605)}</Text>
        );
    };

    const EmptyStar = () => {
        return (
            // white star in unicode
            <Text style={{ fontSize: starSize, color: starColor }}>{String.fromCodePoint(0x2606)}</Text>
        );
    };

    return (
        <View {...restProps} style={[style, { flexDirection: 'row', alignItems: 'center' }]}>
            {(() => {
                let stars = [];
                for (let index = 0; index < maxStarCount; index++) {
                    if (nativeAd.starRating) {
                        const width = (nativeAd.starRating - index) * starSize;
                        stars.push(
                            <View key={index}>
                                <EmptyStar />
                                {
                                    (nativeAd.starRating > index) &&
                                    <View style={{ width: width, overflow: 'hidden', position: 'absolute' }}>
                                        <FilledStar />
                                    </View>
                                }
                            </View>
                        );
                    } else {
                        stars.push(<Text key={index} style={{ fontSize: starSize }}> </Text>);
                    }
                }
                return stars;
            })()}
        </View>
    );
};
