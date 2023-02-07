import React, { useContext, useRef, useEffect } from "react";
import type { ViewProps, ImageProps } from "react-native";
import { findNodeHandle, Text, Image, View, TouchableOpacity } from "react-native";
import { NativeAdViewContext } from "./NativeAdViewProvider";

export const TitleView = (props: ViewProps) => {
  const titleRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.title || !titleRef.current) return;

    nativeAdView.setNativeProps({
      titleView: findNodeHandle(titleRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

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
    if (!nativeAdView || !nativeAd.advertiser || !advertiserRef.current) return;

    nativeAdView.setNativeProps({
      advertiserView: findNodeHandle(advertiserRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

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
    if (!nativeAdView || !nativeAd.body || !bodyRef.current) return;

    nativeAdView.setNativeProps({
      bodyView: findNodeHandle(bodyRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

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
    if (!nativeAdView || !nativeAd.callToAction || !callToActionRef.current) return;

    nativeAdView.setNativeProps({
      callToActionView: findNodeHandle(callToActionRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

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
    if (!nativeAdView || !nativeAd.image || !imageRef.current) return;

    nativeAdView.setNativeProps({
      iconView: findNodeHandle(imageRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

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
    if (!nativeAdView || !nativeAd.isOptionsViewAvailable || !viewRef.current) return;

    nativeAdView.setNativeProps({
      optionsView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

  return (
    <View {...props} ref={viewRef} />
  );
};

export const MediaView = (props: ViewProps) => {
  const viewRef = useRef(null);
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.isMediaViewAvailable || !viewRef.current) return;

    nativeAdView.setNativeProps({
      mediaView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

  return (
    <View {...props} ref={viewRef} />
  );
};

// FIXME: should not be `any`
export const StarRatingView = (props: any) => {
  const { style, ...restProps } = props;

  const maxStarCount: number = 5;
  const starColor: string = style?.color ?? "#ffe234";
  const starSize: number = style?.fontSize ?? 10;

  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

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

  if (!nativeAdView) return null;

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
