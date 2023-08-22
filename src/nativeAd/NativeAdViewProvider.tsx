import React, { useState, createContext } from "react";
import type { NativeMethods } from "react-native";
import type { NativeAd } from "../types/NativeAd";
import type { NativeAdViewProps } from "../types/NativeAdViewProps";

export type NativeAdViewType = React.Component<NativeAdViewProps> & NativeMethods;

export type NativeAdViewContextType = {
    nativeAd: NativeAd;
    nativeAdView: NativeAdViewType | null;
    setNativeAd: React.Dispatch<React.SetStateAction<NativeAd>>;
    setNativeAdView: React.Dispatch<React.SetStateAction<NativeAdViewType>>;
};

export const NativeAdViewContext = createContext<NativeAdViewContextType>({
    nativeAd: { isOptionsViewAvailable: false, isMediaViewAvailable: false },
    nativeAdView: null,
    setNativeAd: () => { },
    setNativeAdView: () => { }
});

export const NativeAdViewProvider: React.FC<{ children: React.ReactNode }> = (props) => {

    const [nativeAd, setNativeAd] = useState({ isOptionsViewAvailable: false, isMediaViewAvailable: false });
    const [nativeAdView, setNativeAdView] = useState(Object);

    const providerValue = {
        nativeAd, nativeAdView, setNativeAd, setNativeAdView,
    };

    return (
        <NativeAdViewContext.Provider value={providerValue}>
            {props.children}
        </NativeAdViewContext.Provider>
    );
};
