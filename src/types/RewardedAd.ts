import type { AdEventListener } from "./AdEvent";
import type { AdRewardInfo } from "./AdInfo";
import type { FullscreenAdType } from "./FullscreenAd";

export type RewardedAdType = FullscreenAdType & {

    /**
     * Adds the specified event listener to receive `AdRewardInfo` when the ad is rewarded.
     * 
     * @param listener 
     */
    addAdReceivedRewardEventListener(listener: AdEventListener<AdRewardInfo>): void;

    /**
     * 
     */
    removeAdReceivedRewardEventListener(): void;
};
