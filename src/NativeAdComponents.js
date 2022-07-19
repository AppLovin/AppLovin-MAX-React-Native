import React, { useContext, useRef, useEffect } from "react";
import { findNodeHandle, UIManager, Text, Image, View, TouchableOpacity } from "react-native";
import { NativeAdViewContext } from "./NativeAdViewProvider";

export const TitleView = (props) => {
  const { nativeAd } = useContext(NativeAdViewContext);

  return (
    <Text {...props}>
      {nativeAd.title || null}
    </Text>
  );
};

export const AdvertiserView = (props) => {
  const { nativeAd } = useContext(NativeAdViewContext);

  return (
    <Text {...props}>
      {nativeAd.advertiser || null}
    </Text>
  );
};

export const BodyView = (props) => {
  const { nativeAd } = useContext(NativeAdViewContext);

  return (
    <Text {...props}>
      {nativeAd.body || null}
    </Text>
  );
};

export const CallToActionView = (props) => {
  const { nativeAd, nativeAdView } = useContext(NativeAdViewContext);

  const onPressButton = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(nativeAdView),
      UIManager.getViewManagerConfig("AppLovinMAXNativeAdView").Commands.performCallToAction,
      undefined
    );
  };

  return (
    <TouchableOpacity {...props} onPress={onPressButton}>
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
    if (nativeAd.image) {
      nativeAdView.setNativeProps({
        iconView: findNodeHandle(imageRef.current),
      });
    }
  }, [nativeAd]);

  return (
    <Image {...props} ref={imageRef} source={{ uri: nativeAd.icon || null }}/>
  );
};

export const OptionsView = (props) => {
  const viewRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    nativeAdView.setNativeProps({
      optionsView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd]);

  return (
    <View {...props} ref={viewRef}/>
  );
};

export const MediaView = (props) => {
  const viewRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    nativeAdView.setNativeProps({
      mediaView: findNodeHandle(viewRef.current),
    });
  }, [nativeAd]);

  return (
    <View {...props} ref={viewRef}/>
  );
};
