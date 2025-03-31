import type { ViewAdType } from './ViewAd';
import type { AdViewPosition } from '../AdView';

/**
 * Defines the interface for managing MREC ads.
 * Extends {@link ViewAdType} with MREC-specific creation logic.
 */
export type MRecAdType = ViewAdType & {
    /**
     * Creates an MREC ad at the specified screen position.
     *
     * @param adUnitId - The ad unit ID to load the ad for.
     * @param position - The desired position for the MREC, defined by {@link AdViewPosition}.
     */
    createAd(adUnitId: string, position: AdViewPosition): void;
};
