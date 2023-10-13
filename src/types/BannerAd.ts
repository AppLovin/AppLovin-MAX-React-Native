import type { AdViewAdInterface } from "./AdViewAd";
import type { AdViewPosition } from "./AdViewProps";

export interface BannerAdInterface extends AdViewAdInterface {

    /**
     * Creates a banner at the specified position and offsets.
     * 
     * @param adUnitId 
     * @param position 
     * @param xOffset 
     * @param yOffset 
     */
    createAd(adUnitId: string, position: AdViewPosition, xOffset?: number, yOffset?: number): void;

    /**
     * Sets a background color for the banner.  
     * 
     * @param adUnitId 
     * @param hexColorCode a hexadecimal color.
     */
    setBackgroundColor(adUnitId: string, hexColorCode: string): void;

    /**
     * Sets the banner width.
     * 
     * @param adUnitId 
     * @param width 
     */
    setWidth(adUnitId: string, width: number): void;

    /**
     * Updates the banner position offsets.
     * 
     * @param adUnitId 
     * @param xOffset 
     * @param yOffset 
     */
    updateOffsets(adUnitId: string, xOffset: number, yOffset: number): void;

    /**
     * Gets the adaptive banner size for the provided width at the current orientation.
     * 
     * @param width 
     */
    getAdaptiveHeightForWidth(width: number): Promise<number>;
}
