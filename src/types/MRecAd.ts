import type { ViewAdType } from "./ViewAd";
import type { AdViewPosition } from "../AdView";

export type MRecAdType = ViewAdType & {

    /**
     * Creates a MREC at the specified position.
     * 
     * @param adUnitId 
     * @param position 
     */
    createAd(adUnitId: string, position: AdViewPosition): void;
};
