import type { AdProps } from "./AdProps";
import type { AdInfo } from "./AdInfo";
import type { AdFormat } from "../AdView";

/**
 * Represents an {@link AdView} - Banner / MREC.
 */
export type AdViewProps = AdProps & {

    /**
     * An enum value representing the ad format to load ads for. Should be either 
     * {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
     */
    adFormat: AdFormat;

    /**
     * A boolean value representing whether or not to enable adaptive banners.
     */
    adaptiveBannerEnabled?: boolean;

    /**
     * A boolean value representing whether or not to enable auto-refresh. Note that auto-refresh is
     * enabled by default.
     */
    autoRefresh?: boolean;

    /**
     * A callback fuction that {@link AdView} fires when it expands the ad.
     */
    onAdExpanded?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction that {@link AdView} fires when it collapses the ad.
     */
    onAdCollapsed?: (adInfo: AdInfo) => void;
};
