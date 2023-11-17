import type { AdProps } from './AdProps';

/**
 * A handler of {@link NativeAdView}.
 */
export type NativeAdViewHandler = {
    /**
     * Loads a native ad.
     */
    loadAd(): void;
};

/**
 * Represents a {@link NativeAdView}.
 */
export type NativeAdViewProps = AdProps;
