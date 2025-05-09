import type { AdProps, LocalExtraParameterValue } from './AdProps';
import type { AdInfo } from './AdInfo';
import type { AdFormat } from '../AdView';

/**
 * A reference to the {@link AdView} instance, allowing imperative control.
 */
export type AdViewHandler = {
    /**
     * Triggers a manual ad load starting.
     * This is only needed if {@link loadOnMount} is set to `false`.
     */
    loadAd(): void;
};

/**
 * A unique identifier for referencing a specific {@link AdView} instance.
 *
 * - A number represents the ID of a preloaded or managed AdView.
 * - `undefined` means the AdView is not preloaded or assigned an ID.
 */
export type AdViewId = number | undefined;

/**
 * Props used to configure and render an {@link AdView} (i.e. Banner or MREC).
 */
export type AdViewProps = AdProps & {
    /**
     * The ad format to load for this view.
     * Must be {@link AdFormat.BANNER} or {@link AdFormat.MREC}.
     */
    adFormat: AdFormat;

    /**
     * A unique identifier for the AdView instance.
     * Used for tracking and preloading specific ad views.
     */
    adViewId?: AdViewId;

    /**
     * Enables adaptive banner sizing if `true`.
     * Ignored for MREC ads.
     */
    adaptiveBannerEnabled?: boolean;

    /**
     * Enables or disables automatic ad refresh.
     * Defaults to `true`.
     */
    autoRefresh?: boolean;

    /**
     * If `true`, the ad will be loaded automatically when the component mounts.
     * Set to `false` for ads to be loaded manually using the ref after the component mounts.
     *
     * @default true
     */
    loadOnMount?: boolean;

    /**
     * Called when the ad is expanded.
     */
    onAdExpanded?: (adInfo: AdInfo) => void;

    /**
     * Called when the ad collapses back to its original state.
     */
    onAdCollapsed?: (adInfo: AdInfo) => void;
};

/**
 * Options used when preloading a native UI {@link AdView} component.
 */
export type NativeUIComponentAdViewOptions = {
    /**
     * Whether adaptive banner sizing is enabled. Defaults to `true`.
     */
    isAdaptive?: boolean;

    /**
     * The placement name used for analytics and reporting.
     */
    placement?: string | null;

    /**
     * Custom data to associate with the ad for postbacks or targeting.
     */
    customData?: string | null;

    /**
     * A dictionary of key-value pairs used to pass extra parameters
     * to the SDK (string-only values).
     */
    extraParameters?: { [key: string]: string | null };

    /**
     * A dictionary of key-value pairs used to pass local extra parameters
     * to the mediation adapter (string, boolean, number, etc.).
     */
    localExtraParameters?: { [key: string]: LocalExtraParameterValue };
};
