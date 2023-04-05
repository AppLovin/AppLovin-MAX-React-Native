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
    <TouchableOpacity {...props}>
      <Text {...props} ref={callToActionRef}>
        {nativeAd.callToAction || null}
      </Text>
    </TouchableOpacity>
  );
};

export const IconView = (props) => {
  const imageRef = useRef();

  const {nativeAd, nativeAdView} = useContext(NativeAdViewContext);

  useEffect(() => {
    if (!nativeAdView || !nativeAd.image) return;

    nativeAdView.setNativeProps({
      iconView: findNodeHandle(imageRef.current),
    });
  }, [nativeAd, nativeAdView]);

  if (!nativeAdView) return null;

  return (
    nativeAd.url ? <Image {...props} source={{uri: nativeAd.url}} /> :
      nativeAd.image ? <Image {...props} ref={imageRef} /> : 
      <Image {...props} />
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
    <View {...props} ref={viewRef}/>
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
    <View {...props} ref={viewRef}/>
  );
};
