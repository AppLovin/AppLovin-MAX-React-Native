import React, { useContext, useRef, useCallback } from "react";
import { findNodeHandle, UIManager, Text, Image, View, TouchableOpacity } from "react-native";
import { NativeAdViewContext } from "./NativeAdViewProvider";

export const AdvertiserView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        advertiser: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  return (
    <Text {...props} nativeID="almAdvertiserView" ref={ref} onLayout={_onLayout}>
      {nativeAd ? nativeAd.advertiser : null}
    </Text>
  );
};

export const BodyView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        body: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  return (
    <Text {...props} nativeID="almBodyView" ref={ref} onLayout={_onLayout}>
      {nativeAd ? nativeAd.body : null}
    </Text>
  );
};

export const CallToActionView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        callToAction: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  const _onPressButton = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(nativeAdView),
      UIManager.getViewManagerConfig("AppLovinMAXNativeAdView").Commands.performCallToAction,
      undefined
    );
  };

  return (
    <TouchableOpacity {...props} nativeID="almCallToActionView" ref={ref} onPress={_onPressButton} onLayout={_onLayout}>
      <Text {...props}>
        {nativeAd ? nativeAd.callToAction : null}
      </Text>
    </TouchableOpacity>
  );
};

export const IconView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        icon: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  return (
    <Image {...props} nativeID="almIconView" ref={ref} source={{ uri: nativeAd.icon || null }} onLayout={_onLayout}/>
  );
};

export const MediaView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        media: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  return (
    <View {...props} nativeID="almMediaView" ref={ref} onLayout={_onLayout}/>
  );
};

export const OptionsView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        options: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  return (
    <View {...props} nativeID="almOptionsView" ref={ref} onLayout={_onLayout}/>
  );
};

export const TitleView = (props) => {

  const ref = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  const _onLayout = useCallback(() => {
    if (nativeAdView) {
      nativeAdView.setNativeProps({
        title: findNodeHandle(ref.current),
      });
    }
  }, [nativeAdView, ref]);

  return (
    <Text {...props} nativeID="almTitleView" ref={ref} onLayout={_onLayout}>
      {nativeAd ? nativeAd.title : null}
    </Text>
  );
};
