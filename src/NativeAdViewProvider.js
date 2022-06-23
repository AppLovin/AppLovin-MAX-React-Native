import React, { useState, createContext, useMemo } from "react";

export const NativeAdViewContext = createContext();

export const NativeAdViewProvider = props => {

  const [nativeAd, setNativeAd] = useState({});
  const [nativeAdView, setNativeAdView] = useState();

  const providerValue = useMemo(() => ({
    nativeAd, nativeAdView, setNativeAd, setNativeAdView,
  }), [nativeAd, nativeAdView]);

  return (
    <NativeAdViewContext.Provider value={providerValue}>
      {props.children}
    </NativeAdViewContext.Provider>
  );
};
