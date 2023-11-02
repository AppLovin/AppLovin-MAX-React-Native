import type { AdEventListener } from "./AdEvent";
import type { AdRewardInfo } from "./AdInfo";
import type { FullscreenAdType } from "./FullscreenAd";

export type RewardedAdType = FullscreenAdType & {

    /**
     * Adds the specified event listener to receive {@link AdRewardInfo} when {@link RewardedAd}
     * rewards the user.
     * 
     * @param listener Listener to be notified.
     */
    addAdReceivedRewardEventListener(listener: AdEventListener<AdRewardInfo>): void;

    /**
     * Removes the event listener to receive {@link AdRewardInfo} when {@link RewardedAd} rewards
     * the user.
     */
    removeAdReceivedRewardEventListener(): void;
};
