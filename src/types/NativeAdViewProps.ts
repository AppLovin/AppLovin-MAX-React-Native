import type { AdProps } from "./AdProps";

/**
 * A handler of `NativeAdView`.
 */
export interface NativeAdViewHandler {

    /**
     * Loads a native ad.
     */
    loadAd(): void;
}

/**
 * Represents a `NativeAdView`.
 */
export interface NativeAdViewProps extends AdProps { }
