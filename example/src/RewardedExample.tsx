import React, { useState, useEffect, useRef } from 'react';
import { RewardedAd } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdDisplayFailedInfo, AdRewardInfo } from '../../src/index';
import AppButton from './components/AppButton';

enum AdLoadState {
    notLoaded = 'NOT_LOADED',
    loading = 'LOADING',
    loaded = 'LOADED',
};

const RewardedExample = (props: any) => {
    const {
        adUnitId,
        isInitialized,
        log
    } = props;

    const [adLoadState, setAdLoadState] = useState<AdLoadState>(AdLoadState.notLoaded);

    const retryAttempt = useRef(0);

    useEffect(() => {
        setupEventListeners();
    }, []);

    const setupEventListeners = () => {
        RewardedAd.addAdLoadedEventListener((adInfo: AdInfo) => {
            setAdLoadState(AdLoadState.loaded);

            // Rewarded ad is ready to be shown. AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID) will now return 'true'
            log('Rewarded ad loaded from ' + adInfo.networkName);

            // Reset retry attempt
            retryAttempt.current = 0;
        });
        RewardedAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            setAdLoadState(AdLoadState.notLoaded);

            // Rewarded ad failed to load
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
            retryAttempt.current += 1;

            const retryDelay = Math.pow(2, Math.min(6, retryAttempt.current));
            log('Rewarded ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

            setTimeout(() => {
                setAdLoadState(AdLoadState.loading);
                RewardedAd.load(adUnitId);
            }, retryDelay * 1000);
        });
        RewardedAd.addAdClickedEventListener((_adInfo: AdInfo) => {
            log('Rewarded ad clicked');
        });
        RewardedAd.addAdDisplayedEventListener((_adInfo: AdInfo) => {
            log('Rewarded ad displayed');
        });
        RewardedAd.addAdFailedToDisplayEventListener((_adInfo: AdDisplayFailedInfo) => {
            setAdLoadState(AdLoadState.notLoaded);
            log('Rewarded ad failed to display');
        });
        RewardedAd.addAdHiddenEventListener((_adInfo: AdInfo) => {
            setAdLoadState(AdLoadState.notLoaded);
            log('Rewarded ad hidden');
        });
        RewardedAd.addAdReceivedRewardEventListener((_adInfo: AdRewardInfo) => {
            log('Rewarded ad granted reward');
        });
        RewardedAd.addAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('Rewarded ad revenue paid: ' + adInfo.revenue);
        });
    }

    const getRewardedButtonTitle = () => {
        if (adLoadState === AdLoadState.notLoaded) {
            return 'Load Rewarded Ad';
        } else if (adLoadState === AdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Rewarded Ad'; // adLoadState.loaded
        }
    }

    return (
        <AppButton
            title={getRewardedButtonTitle()}
            enabled={
                isInitialized && adLoadState !== AdLoadState.loading
            }
            onPress={async () => {
                try {
                    const isRewardedReady = await RewardedAd.isReady(adUnitId);
                    if (isRewardedReady) {
                        RewardedAd.show(adUnitId);
                    } else {
                        log('Loading rewarded ad...');
                        setAdLoadState(AdLoadState.loading);
                        RewardedAd.load(adUnitId);
                    }
                } catch (error: any) {
                    log(error.toString());
                }
            }}
        />
    );
}

export default RewardedExample;
