import type { ViewAdType } from "./ViewAd";
import type { AdViewPosition } from "../AdView";

export type MRecAdType = ViewAdType & {

    /**
     * Creates a MREC at the specified position.
     * 
     * @param adUnitId The Ad Unit ID to  to load ads for.
     * @param position {@link AdViewPosition} position.
     */
    createAd(adUnitId: string, position: AdViewPosition): void;
};
