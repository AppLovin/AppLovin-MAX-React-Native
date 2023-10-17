import type { ViewAdInterface } from "./ViewAd";
import type { AdViewPosition } from "./AdViewProps";

export interface MRecAdInterface extends ViewAdInterface {

    /**
     * Creates a MREC at the specified position.
     * 
     * @param adUnitId 
     * @param position 
     */
    createAd(adUnitId: string, position: AdViewPosition): void;
}
