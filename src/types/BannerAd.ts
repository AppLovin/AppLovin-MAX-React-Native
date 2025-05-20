import type { ViewAdType } from './ViewAd';
import type { AdViewPosition } from '../AdView';

/**
 * Defines the interface for managing banner ads.
 * Extends {@link ViewAdType} with banner-specific layout and customization methods.
 */
export type BannerAdType = ViewAdType & {
    /**
     * Creates a banner ad at the specified position and optional pixel offsets.
     *
     * @param adUnitId - The ad unit ID to load ads for.
     * @param position - The position of the banner on screen.
     * @param xOffset - Optional horizontal offset from the left (default: 0).
     * @param yOffset - Optional vertical offset from the top (default: 0).
     * @param isAdaptive - Optional flag to enable adaptive banners (default: true).
     */
    createAd(adUnitId: string, position: AdViewPosition, xOffset?: number, yOffset?: number, isAdaptive?: boolean): void;

    /**
     * Sets the background color of the banner.
     *
     * @param adUnitId - The ad unit ID of the banner.
     * @param hexColorCode - A hex color string (e.g. "#FFFFFF").
     */
    setBackgroundColor(adUnitId: string, hexColorCode: string): void;

    /**
     * Sets the width of the banner.
     *
     * @param adUnitId - The ad unit ID of the banner.
     * @param width - Desired width in pixels.
     */
    setWidth(adUnitId: string, width: number): void;

    /**
     * Updates the position offsets of the banner after creation.
     *
     * @param adUnitId - The ad unit ID of the banner.
     * @param xOffset - Horizontal offset from the left.
     * @param yOffset - Vertical offset from the top.
     */
    updateOffsets(adUnitId: string, xOffset: number, yOffset: number): void;

    /**
     * Calculates the adaptive banner height for the given width and current screen orientation.
     *
     * @param width - The banner width in pixels.
     * @returns A promise that resolves with the appropriate height.
     */
    getAdaptiveHeightForWidth(width: number): Promise<number>;
};
