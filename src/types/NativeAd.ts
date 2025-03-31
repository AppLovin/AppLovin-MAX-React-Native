/**
 * Represents the structure of a native ad used internally by {@link NativeAdView}.
 * This type is intended for internal use only.
 */
export type NativeAd = {
    /**
     * The ad title text.
     */
    title?: string | null;

    /**
     * The advertiser name.
     */
    advertiser?: string | null;

    /**
     * The ad body text.
     */
    body?: string | null;

    /**
     * The call-to-action text.
     */
    callToAction?: string | null;

    /**
     * Indicates whether an icon image is available.
     */
    image?: boolean;

    /**
     * The base64-encoded image source for the icon (if provided inline).
     */
    imageSource?: string | null;

    /**
     * The URL of the icon image.
     */
    url?: string;

    /**
     * The star rating of the ad, typically in the range [0.0 – 5.0].
     */
    starRating?: number;

    /**
     * Whether the native Options view is available.
     */
    isOptionsViewAvailable: boolean;

    /**
     * Whether the native Media view (video or image) is available.
     */
    isMediaViewAvailable: boolean;
};
