/**
 * Provides context and state management for NativeAdView and its child asset views.
 * Shares asset view refs and native ad data between internal components and the native SDK.
 */

import * as React from 'react';
import { useState, createContext, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Image, NativeMethods, Text, View } from 'react-native';
import type { NativeAd } from '../types/NativeAd';
import type { NativeProps } from '../specs/AppLovinMAXNativeAdViewNativeComponent';

/**
 * Native component type for the rendered NativeAdView.
 */
export type NativeAdViewType = React.Component<NativeProps> & NativeMethods;

// Ref types for native views
type TextRef = React.ElementRef<typeof Text>;
type ImageRef = React.ElementRef<typeof Image>;
type ViewRef = React.ElementRef<typeof View>;

/**
 * Context type used internally by NativeAdView.
 * Stores references to asset views and the current native ad data.
 */
export type NativeAdViewContextType = {
    titleRef: React.RefObject<TextRef>;
    advertiserRef: React.RefObject<TextRef>;
    bodyRef: React.RefObject<TextRef>;
    callToActionRef: React.RefObject<TextRef>;
    imageRef: React.RefObject<ImageRef>;
    optionViewRef: React.RefObject<ViewRef>;
    mediaViewRef: React.RefObject<ViewRef>;
    nativeAd: NativeAd;
    setNativeAd: React.Dispatch<React.SetStateAction<NativeAd>>;
};

// Default for an uninitialized native ad
const defaultNativeAd: NativeAd = {
    isOptionsViewAvailable: false,
    isMediaViewAvailable: false,
};

/**
 * Internal context used by NativeAdView to provide access to asset view refs and native ad data.
 */
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

/**
 * React provider that wraps components requiring access to NativeAdViewContext.
 */
export const NativeAdViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const titleRef = useRef<TextRef | null>(null);
    const advertiserRef = useRef<TextRef | null>(null);
    const bodyRef = useRef<TextRef | null>(null);
    const callToActionRef = useRef<TextRef | null>(null);
    const imageRef = useRef<ImageRef | null>(null);
    const optionViewRef = useRef<ViewRef | null>(null);
    const mediaViewRef = useRef<ViewRef | null>(null);
    const [nativeAd, setNativeAd] = useState<NativeAd>(defaultNativeAd);

    /**
     * Memoized context value to avoid unnecessary renders.
     */
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
