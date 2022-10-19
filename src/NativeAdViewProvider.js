import React, { useState, createContext } from "react";

export const NativeAdViewContext = createContext();

export const NativeAdViewProvider = props => {

  const [nativeAd, setNativeAd] = useState({});
  const [nativeAdView, setNativeAdView] = useState();

  const providerValue = {
    nativeAd, nativeAdView, setNativeAd, setNativeAdView,
  };

  return (
    <NativeAdViewContext.Provider value={providerValue}>
      {props.children}
    </NativeAdViewContext.Provider>
  );
};
