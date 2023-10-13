import type { AdViewAdInterface } from "./AdViewAd";
import type { AdViewPosition } from "./AdViewProps";

export interface MRecAdInterface extends AdViewAdInterface {

    /**
     * Creates a MREC at the specified position.
     * 
     * @param adUnitId 
     * @param position 
     */
    createAd(adUnitId: string, position: AdViewPosition): void;
}
