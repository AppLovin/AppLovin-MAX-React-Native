/**
 * Represents a native ad that is internally applied to render the React UI components.
 */
export interface NativeAd {

    /**
     * The native ad title text.
     */
    title?: string | null;

    /**
     * The native ad advertiser text.
     */
    advertiser?: string | null;

    /**
     * The native ad body text.
     */
    body?: string | null;

    /**
     * The native ad CTA button text.
     */
    callToAction?: string | null;

    /**
     * Whether or not this has an image icon.
     */
    image?: boolean;

    /**
     * The URL string of the icon.
     */
    url?: string | null;

    /**
     * The star rating of the native ad.
     */
    starRating?: number | null;

    /**
     * Whether or not the Options view is available.
     */
    isOptionsViewAvailable: boolean;

    /**
     * Whether or not the Media view is available.
     */
    isMediaViewAvailable: boolean;
}
