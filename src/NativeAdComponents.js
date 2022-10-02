import React, { useContext, useRef, useEffect } from "react";
import { findNodeHandle, UIManager, Text, Image, View, TouchableOpacity } from "react-native";
import { NativeAdViewContext } from "./NativeAdViewProvider";

export const TitleView = (props) => {
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  return (
    nativeAdView ?
      <Text {...props}>
        {nativeAd.title || null}
      </Text>
    :
      null
  );
};

export const AdvertiserView = (props) => {
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  return (
    nativeAdView ?
      <Text {...props}>
        {nativeAd.advertiser || null}
      </Text>
    :
      null
  );
};

export const BodyView = (props) => {
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  return (
    nativeAdView ?
      <Text {...props}>
        {nativeAd.body || null}
      </Text>
    :
      null
  );
};

export const CallToActionView = (props) => {
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  const onPressButton = () => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(nativeAdView),
      UIManager.getViewManagerConfig("AppLovinMAXNativeAdView").Commands.performCallToAction,
      undefined
    );
  };

  return (
    nativeAdView ?
      <TouchableOpacity {...props} onPress={onPressButton}>
        <Text {...props}>
          {nativeAd.callToAction || null}
        </Text>
      </TouchableOpacity>
    :
      null
 );
};

export const IconView = (props) => {
  const imageRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;
    if (nativeAd.image) {
      nativeAdView.setNativeProps({
        iconImage: findNodeHandle(imageRef.current),
      });
    }
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <Image {...props} ref={imageRef} source={{ uri: nativeAd.url || null }}/>
    :
      null
  );
};

export const OptionsView = (props) => {
  const viewRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;
    nativeAdView.setNativeProps({
      optionsView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <View {...props} ref={viewRef}/>
    :
      null
  );
};

export const MediaView = (props) => {
  const viewRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;
    nativeAdView.setNativeProps({
      mediaView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <View {...props} ref={viewRef}/>
    :
      null
  );
};
