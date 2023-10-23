import type { AdProps } from "./AdProps";

/**
 * A handler of `NativeAdView`.
 */
export type NativeAdViewHandler = {

    /**
     * Loads a native ad.
     */
    loadAd(): void;
};

/**
 * Represents a `NativeAdView`.
 */
export type NativeAdViewProps = AdProps;
