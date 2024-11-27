import type { AdProps, LocalExtraParameterValue } from './AdProps';
import type { AdInfo } from './AdInfo';
import type { AdFormat } from '../AdView';

/**
 * A handler of {@link AdView}.
 */
export type AdViewHandler = {
    /**
     * If the {@link loadOnMount} attribute is set to false, you can call this API to start loading ads in this AdView.
     */
    loadAd(): void;
};

/**
 * A unique identifier for referencing a specific AdView instance.
 *
 * - If the value is a number, it represents the ID of a preloaded or assigned AdView.
 * - A value of `undefined` indicates that the AdView has not been preloaded or assigned an ID yet.
 */
export type AdViewId = number | undefined;

/**
 * Represents an {@link AdView} - Banner / MREC.
 */
export type AdViewProps = AdProps & {
    /**
     * An enum value representing the ad format to load ads for. Must be either
     * {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
     */
    adFormat: AdFormat;

    /**
     * A unique identifier representing the AdView instance.
     * Used to manage and track the specific AdView.
     */
    adViewId?: AdViewId;

    /**
     * A boolean indicating whether adaptive banners are enabled.
     */
    adaptiveBannerEnabled?: boolean;

    /**
     * A boolean indicating whether auto-refresh is enabled.
     * Auto-refresh is enabled by default.
     */
    autoRefresh?: boolean;

    /**
     * A boolean indicating whether an ad should load automatically
     * when the {@link AdView} is mounted. Defaults to `true`.
     */
    loadOnMount?: boolean;

    /**
     * A callback function triggered when the {@link AdView} expands the ad.
     *
     * @param adInfo - Information about the ad that was expanded.
     */
    onAdExpanded?: (adInfo: AdInfo) => void;

    /**
     * A callback function triggered when the {@link AdView} collapses the ad.
     *
     * @param adInfo - Information about the ad that was collapsed.
     */
    onAdCollapsed?: (adInfo: AdInfo) => void;
};

/**
 * A list of options to create a native UI component for preloading {@link AdView}.
 */
export type NativeUIComponentAdViewOptions = {
    /**
     * A string value representing the placement name that you assign when you integrate each ad
     * format, for granular reporting in ad events.
     */
    placement?: string | null;

    /**
     * The custom data to tie the showing ad to.
     */
    customData?: string | null;

    /**
     * A dictionary value representing the extra parameters to set a list of key-value string pairs
     * for the ad.
     */
    extraParameters?: { [key: string]: string | null };

    /**
     * A dictionary value representing the local extra parameters to set a list of key-value pairs
     * to pass to the adapter instances.
     */
    localExtraParameters?: { [key: string]: LocalExtraParameterValue };
};
