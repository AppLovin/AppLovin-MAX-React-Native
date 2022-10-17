import React, {useContext, useRef, useEffect} from "react";
import {findNodeHandle, UIManager, Text, Image, View, TouchableOpacity} from "react-native";
import {NativeAdViewContext} from "./NativeAdViewProvider";

export const TitleView = (props) => {
  const titleRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;

    nativeAdView.setNativeProps({
      titleView: findNodeHandle(titleRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <Text {...props} ref={titleRef}>
        {nativeAd.title || null}
      </Text>
      :
      null
  );
};

export const AdvertiserView = (props) => {
  const advertiserRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;

    nativeAdView.setNativeProps({
      advertiserView: findNodeHandle(advertiserRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <Text {...props} ref={advertiserRef}>
        {nativeAd.advertiser || null}
      </Text>
      :
      null
  );
};

export const BodyView = (props) => {
  const bodyRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;

    nativeAdView.setNativeProps({
      bodyView: findNodeHandle(bodyRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <Text {...props} ref={bodyRef}>
        {nativeAd.body || null}
      </Text>
      :
      null
  );
};

export const CallToActionView = (props) => {
  const callToActionRef = useRef();
  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (Object.keys(nativeAd).length === 0 || !nativeAdView) return;

    nativeAdView.setNativeProps({
      callToActionView: findNodeHandle(callToActionRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <TouchableOpacity {...props}>
        <Text {...props} ref={callToActionRef}>
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

    nativeAdView.setNativeProps({
      iconView: findNodeHandle(imageRef.current),
    });
  }, [nativeAd, nativeAdView]);

  return (
    nativeAdView ?
      <Image {...props} ref={imageRef} source={{uri: nativeAd.url || null}}/>
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
