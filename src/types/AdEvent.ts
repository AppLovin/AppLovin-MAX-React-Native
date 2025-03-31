import type { AdInfo, AdLoadFailedInfo, AdDisplayFailedInfo, AdRewardInfo } from './AdInfo';

/**
 * Represents any ad event object that can be emitted by the native AppLovin MAX module.
 */
export type AdEventObject = AdInfo | AdLoadFailedInfo | AdDisplayFailedInfo | AdRewardInfo;

/**
 * A generic event listener for handling ad events in programmatic APIs.
 *
 * @template T - A specific ad event type.
 */
export type AdEventListener<T extends AdEventObject> = (event: T) => void;

/**
 * Wraps an ad event in a `nativeEvent` field, following the React Native synthetic event pattern.
 * Used for UI component props such as {@link AdView} and {@link NativeAdView}.
 *
 * @template T - A specific ad event type.
 */
export type AdNativeEvent<T extends AdEventObject> = { nativeEvent: T };
