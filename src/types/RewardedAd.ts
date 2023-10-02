import type { AdEventListener } from "./AdEvent";
import type { AdRewardInfo } from "./AdInfo";
import type { FullscreenAdInterface } from "./FullscreenAd";

export interface RewardedAdInterface extends FullscreenAdInterface {

    /**
     * Adds the specified event listener to receive `AdRewardInfo` when the ad is rewarded.
     * 
     * @param listener 
     */
    addAdReceivedRewardEventListener(listener: AdEventListener<AdRewardInfo>): void;

    removeAdReceivedRewardEventListener(): void;
}
