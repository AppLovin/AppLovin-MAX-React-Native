import type { AdProps } from "./AdProps";
import type { AdInfo } from "./AdInfo";
import type { AdFormat } from "../AdView";

/**
 * Represents an `AdView` - Banner / MREC.
 */
export type AdViewProps = AdProps & { 

    /**
     * A string value representing the ad format to load ads for. Should be either `AppLovinMAX.AdFormat.BANNER` or `AppLovinMAX.AdFormat.MREC`.
     */
    adFormat: AdFormat;

    /**
     * A boolean value representing whether or not to enable adaptive banners.
     */
    adaptiveBannerEnabled?: boolean;

    /**
     * A boolean value representing whether or not to enable auto-refresh. Note that auto-refresh is enabled by default.
     */
    autoRefresh?: boolean;

    /**
     * A callback fuction to be fired when the ad view is expanded.
     */
    onAdExpanded?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction to be fired when the ad view is collapsed.
     */
    onAdCollapsed?: (adInfo: AdInfo) => void;
};
