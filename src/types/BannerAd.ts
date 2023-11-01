import type { ViewAdType } from "./ViewAd";
import type { AdViewPosition } from "../AdView";

export type BannerAdType = ViewAdType & {

    /**
     * Creates a banner at the specified position and offsets.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param position {@ AdViewPosition} position.
     * @param xOffset Offset from the left corner.
     * @param yOffset Offset from the top corner.
     */
    createAd(adUnitId: string, position: AdViewPosition, xOffset?: number, yOffset?: number): void;

    /**
     * Sets a background color for the banner.  
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param hexColorCode Hexadecimal color (#rrggbb).
     */
    setBackgroundColor(adUnitId: string, hexColorCode: string): void;

    /**
     * Sets the banner width.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param width The desired banner width.
     */
    setWidth(adUnitId: string, width: number): void;

    /**
     * Updates the banner position offsets.
     * 
     * @param adUnitId The Ad Unit ID to load ads for.
     * @param xOffset Offset from the left corner.
     * @param yOffset Offset from the top corner.
     */
    updateOffsets(adUnitId: string, xOffset: number, yOffset: number): void;

    /**
     * Gets the adaptive banner size for the provided width at the current orientation.
     * 
     * @param width The banner width.
     */
    getAdaptiveHeightForWidth(width: number): Promise<number>;
};
