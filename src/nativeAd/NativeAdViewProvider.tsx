import * as React from 'react';
import { useState, createContext, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Image, NativeMethods, Text, View } from 'react-native';
import type { NativeAd } from '../types/NativeAd';
import type { NativeProps } from '../specs/AppLovinMAXNativeAdViewNativeComponent';

export type NativeAdViewType = React.Component<NativeProps> & NativeMethods;

export type NativeAdViewContextType = {
    titleRef: React.RefObject<React.ElementRef<typeof Text>>;
    advertiserRef: React.RefObject<React.ElementRef<typeof Text>>;
    bodyRef: React.RefObject<React.ElementRef<typeof Text>>;
    callToActionRef: React.RefObject<React.ElementRef<typeof Text>>;
    imageRef: React.RefObject<React.ElementRef<typeof Image>>;
    optionViewRef: React.RefObject<React.ElementRef<typeof View>>;
    mediaViewRef: React.RefObject<React.ElementRef<typeof View>>;
    nativeAd: NativeAd;
    setNativeAd: React.Dispatch<React.SetStateAction<NativeAd>>;
};

const defaultNativeAd: NativeAd = {
    isOptionsViewAvailable: false,
    isMediaViewAvailable: false,
};

export const NativeAdViewContext = createContext<NativeAdViewContextType>({
    titleRef: { current: null },
    advertiserRef: { current: null },
    bodyRef: { current: null },
    callToActionRef: { current: null },
    imageRef: { current: null },
    optionViewRef: { current: null },
    mediaViewRef: { current: null },
    nativeAd: defaultNativeAd,
    setNativeAd: () => {},
});

export const NativeAdViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const titleRef = useRef<React.ElementRef<typeof Text> | null>(null);
    const advertiserRef = useRef<React.ElementRef<typeof Text> | null>(null);
    const bodyRef = useRef<React.ElementRef<typeof Text> | null>(null);
    const callToActionRef = useRef<React.ElementRef<typeof Text> | null>(null);
    const imageRef = useRef<React.ElementRef<typeof Image> | null>(null);
    const optionViewRef = useRef<React.ElementRef<typeof View> | null>(null);
    const mediaViewRef = useRef<React.ElementRef<typeof View> | null>(null);
    const [nativeAd, setNativeAd] = useState<NativeAd>(defaultNativeAd);

    const providerValue = React.useMemo(
        () => ({
            titleRef,
            advertiserRef,
            bodyRef,
            callToActionRef,
            imageRef,
            optionViewRef,
            mediaViewRef,
            nativeAd,
            setNativeAd,
        }),
        [nativeAd]
    );

    return <NativeAdViewContext.Provider value={providerValue}>{children}</NativeAdViewContext.Provider>;
};
