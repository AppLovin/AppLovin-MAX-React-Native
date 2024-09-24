import * as React from 'react';
import { useState, createContext } from 'react';
import type { ReactNode } from 'react';
import type { NativeMethods } from 'react-native';
import type { NativeAd } from '../types/NativeAd';
import type { NativeAdViewProps } from '../types/NativeAdViewProps';

export type NativeAdViewType = React.Component<NativeAdViewProps> & NativeMethods;

export type NativeAdViewContextType = {
    nativeAd: NativeAd;
    nativeAdView: NativeAdViewType | null;
    setNativeAd: React.Dispatch<React.SetStateAction<NativeAd>>;
    setNativeAdView: React.Dispatch<React.SetStateAction<NativeAdViewType | null>>;
};

const defaultNativeAd: NativeAd = {
    isOptionsViewAvailable: false,
    isMediaViewAvailable: false,
};

export const NativeAdViewContext = createContext<NativeAdViewContextType>({
    nativeAd: defaultNativeAd,
    nativeAdView: null,
    setNativeAd: () => {},
    setNativeAdView: () => {},
});

export const NativeAdViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nativeAd, setNativeAd] = useState<NativeAd>(defaultNativeAd);
    const [nativeAdView, setNativeAdView] = useState<NativeAdViewType | null>(null);

    const providerValue = React.useMemo(
        () => ({
            nativeAd,
            nativeAdView,
            setNativeAd,
            setNativeAdView,
        }),
        [nativeAd, nativeAdView]
    );

    return <NativeAdViewContext.Provider value={providerValue}>{children}</NativeAdViewContext.Provider>;
};
