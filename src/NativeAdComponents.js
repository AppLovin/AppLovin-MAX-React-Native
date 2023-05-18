import React, {useContext, useRef, useEffect} from "react";
import {findNodeHandle, Text, Image, View, TouchableOpacity} from "react-native";
import {NativeAdViewContext} from "./NativeAdViewProvider";

export const TitleView = (props) => {
  const titleRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.title) return;

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

export const AdvertiserView = (props) => {
  const advertiserRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.advertiser) return;

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

export const BodyView = (props) => {
  const bodyRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.body) return;

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

export const CallToActionView = (props) => {
  const callToActionRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.callToAction) return;

    nativeAdView.setNativeProps({
      callToActionView: findNodeHandle(callToActionRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

  return (
    <TouchableOpacity {...props} ref={callToActionRef}>
      <Text {...props}>
        {nativeAd.callToAction || null}
      </Text>
    </TouchableOpacity>
  );
};

export const IconView = (props) => {
  const imageRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.image || !imageRef.current) return;

    nativeAdView.setNativeProps({
      iconView: findNodeHandle(imageRef.current),
    });
  }, [nativeAd, nativeAdView, imageRef.current]);

  if (!nativeAdView) return null;

  return (
    nativeAd.url ? <Image {...props} source={{uri: nativeAd.url}} /> :
      nativeAd.image ? <Image {...props} ref={imageRef} /> : 
      <View {...props} />
  );
};

export const OptionsView = (props) => {
  const viewRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.isOptionsViewAvailable) return;

    nativeAdView.setNativeProps({
      optionsView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

  return (
    <View {...props} ref={viewRef} />
  );
};

export const MediaView = (props) => {
  const viewRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.isMediaViewAvailable) return;

    nativeAdView.setNativeProps({
      mediaView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

  return (
    <View {...props} ref={viewRef} />
  );
};

export const StarRatingView = (props) => {
  const {style, ...otherProps} = props;

  const maxStarCount = 5;
  const starColor = style.color ?? "#ffe234";
  const starSize = style.fontSize ?? 10;

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const FilledStar = ({size,color}) => {
    return (
      // black star in unicode
      <Text style={{fontSize: size, color: color}}>{String.fromCodePoint(0x2605)}</Text>
    );
  };

  const EmptyStar = ({size,color}) => {
    return (
      // white star in unicode
      <Text style={{fontSize: size, color: color}}>{String.fromCodePoint(0x2606)}</Text>
    );
  };

  const StarView = ({index, rating, size, color}) => {
    const width = (rating - index) * size;
    return (
      <View>
        <EmptyStar size={size} color={color} />
        {
          (rating > index) &&
            <View style={{ width: width, overflow: 'hidden', position: 'absolute'}}>
              <FilledStar style={{top:0, left:0}} size={size} color={color} />
            </View>
        }
      </View>
    );
  };

  if (!nativeAdView) return null;

  return (
    <View style={[style, {flexDirection: 'row', alignItems: 'center'}]}>
      {(() => {
        let stars = [];
        for (let index = 0; index < maxStarCount; index++) {
          if (nativeAd.starRating) {
            stars.push(<StarView key={index} index={index} rating={nativeAd.starRating} size={starSize} color={starColor} />);
          } else {
            stars.push(<Text key={index} style={{fontSize: starSize}}> </Text>);
          }
        }
        return stars;
      })()}
    </View>
  );
};
