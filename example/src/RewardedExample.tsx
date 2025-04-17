import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { RewardedAd } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const MAX_EXPONENTIAL_RETRY_COUNT = 6;
const MAX_RETRY_DELAY_SECONDS = 64;

enum RewardedAdLoadState {
    notLoaded = 'NOT_LOADED',
    loading = 'LOADING',
    loaded = 'LOADED',
}

const RewardedExample = ({ adUnitId, isInitialized, log }: { adUnitId: string; isInitialized: boolean; log: (str: string) => void }) => {
    const [adLoadState, setAdLoadState] = useState<RewardedAdLoadState>(RewardedAdLoadState.notLoaded);
    const retryAttempt = useRef(0);

    useEffect(() => {
        function onAdLoaded(adInfo: AdInfo) {
            setAdLoadState(RewardedAdLoadState.loaded);

            // Rewarded ad loaded and ready to show.
            log('Rewarded ad loaded from ' + adInfo.networkName);
            retryAttempt.current = 0; // Reset retry counter
        }

        function onAdLoadFailed(errorInfo: AdLoadFailedInfo) {
            setAdLoadState(RewardedAdLoadState.notLoaded);

            if (retryAttempt.current > MAX_EXPONENTIAL_RETRY_COUNT) {
                log('Rewarded ad failed to load. Max retry attempts reached. Code: ' + errorInfo.code);
                return;
            }

            // Retry with exponential backoff, capped at MAX_RETRY_DELAY_SECONDS.
            retryAttempt.current += 1;
            const retryDelay = Math.min(MAX_RETRY_DELAY_SECONDS, Math.pow(2, retryAttempt.current));
            log(`Rewarded ad failed to load (code: ${errorInfo.code}) - retrying in ${retryDelay}s`);

            setTimeout(() => {
                setAdLoadState(RewardedAdLoadState.loading);
                log('Retrying to load rewarded ad...');
                RewardedAd.loadAd(adUnitId);
            }, retryDelay * 1000);
        }

        RewardedAd.addAdLoadedEventListener(onAdLoaded);
        RewardedAd.addAdLoadFailedEventListener(onAdLoadFailed);
        RewardedAd.addAdClickedEventListener(() => log('Rewarded ad clicked'));
        RewardedAd.addAdDisplayedEventListener(() => log('Rewarded ad displayed'));
        RewardedAd.addAdFailedToDisplayEventListener(() => {
            setAdLoadState(RewardedAdLoadState.notLoaded);
            log('Rewarded ad failed to display');
        });
        RewardedAd.addAdHiddenEventListener(() => {
            setAdLoadState(RewardedAdLoadState.notLoaded);
            log('Rewarded ad hidden');
        });
        RewardedAd.addAdReceivedRewardEventListener(() => log('Rewarded ad granted reward'));
        RewardedAd.addAdRevenuePaidListener((adInfo: AdInfo) => log('Rewarded ad revenue paid: ' + adInfo.revenue));

        // Clean up listeners and retry timeout on unmount.
        return () => {
            RewardedAd.removeAdLoadedEventListener();
            RewardedAd.removeAdLoadFailedEventListener();
            RewardedAd.removeAdClickedEventListener();
            RewardedAd.removeAdDisplayedEventListener();
            RewardedAd.removeAdFailedToDisplayEventListener();
            RewardedAd.removeAdHiddenEventListener();
            RewardedAd.removeAdReceivedRewardEventListener();
            RewardedAd.removeAdRevenuePaidListener();
        };
    }, [adUnitId, log]);

    const getRewardedButtonTitle = () => {
        if (adLoadState === RewardedAdLoadState.notLoaded) {
            return 'Load Rewarded Ad';
        } else if (adLoadState === RewardedAdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Rewarded Ad'; // adLoadState.loaded
        }
    };

    const loadAndShowRewardedAd = async () => {
        const isRewardedReady = await RewardedAd.isAdReady(adUnitId);
        if (isRewardedReady) {
            RewardedAd.showAd(adUnitId);
        } else {
            log('Loading rewarded ad...');
            setAdLoadState(RewardedAdLoadState.loading);
            RewardedAd.loadAd(adUnitId);
        }
    };

    return <AppButton title={getRewardedButtonTitle()} enabled={isInitialized && adLoadState !== RewardedAdLoadState.loading} onPress={loadAndShowRewardedAd} />;
};

export default RewardedExample;
