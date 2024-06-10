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
     * A boolean value representing whether or not to load an ad as soon as {@link AdView} is
     * mounted. Note that the default value is true.
     */
    loadOnMount?: boolean;

    /**
     * A boolean value representing whether or not to delete the native UI component that is
     *  internally allocated by {@link preloadNativeUIComponentAdView()} when {@link AdView} is
     *  unmounted. Note that the default value is false, where the native UI component will be reused.
     */
    deleteNativeUIComponent?: boolean;

    /**
     * A callback fuction that {@link AdView} fires when it expands the ad.
     */
    onAdExpanded?: (adInfo: AdInfo) => void;

    /**
     * A callback fuction that {@link AdView} fires when it collapses the ad.
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
