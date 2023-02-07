import type {
    AdInfo,
    AdLoadFailedInfo,
    AdDisplayFailedInfo,
    AdRevenueInfo,
    AdRewardInfo
} from "./AdInfo";

/**
 * Defines an event object that is generated in the native modules.
 */
export type AdEventObject =
    AdInfo |
    AdLoadFailedInfo |
    AdDisplayFailedInfo |
    AdRevenueInfo |
    AdRewardInfo;

/**
 * Defines a generic event listener for the pragrammatic methods to receive an event from the native
 * module.
 */
export type AdEventListener<T extends AdEventObject> = (event: T) => void;

/**
 * Defines a generic event object for the UI components i.e. AdView and NativeAdView to receive an
 * event from the native module.
 */
export interface AdNativeEvent<T extends AdEventObject> { nativeEvent: T }
