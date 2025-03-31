import type { AdEventListener } from './AdEvent';
import type { AdRewardInfo } from './AdInfo';
import type { FullscreenAdType } from './FullscreenAd';

/**
 * Defines the interface for managing rewarded ads.
 * Extends {@link FullscreenAdType} with reward-specific callbacks.
 */
export type RewardedAdType = FullscreenAdType & {
    /**
     * Registers a listener for when a reward is granted to the user.
     *
     * @param listener - Callback to be notified with {@link AdRewardInfo}.
     */
    addAdReceivedRewardEventListener(listener: AdEventListener<AdRewardInfo>): void;

    /**
     * Unregisters the reward event listener.
     */
    removeAdReceivedRewardEventListener(): void;
};
