import type { AdProps } from './AdProps';

/**
 * A reference handler for the {@link NativeAdView} component.
 */
export type NativeAdViewHandler = {
    /**
     * Triggers a native ad load.
     */
    loadAd(): void;

    /**
     * Destroys the currently loaded native ad.
     */
    destroyAd(): void;
};

/**
 * Props passed to the {@link NativeAdView} component.
 * Extends the base {@link AdProps} used for all ad components.
 */
export type NativeAdViewProps = AdProps;
