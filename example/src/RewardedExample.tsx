import React, { useState, useEffect, useRef } from 'react';
import AppLovinMAX from '../../src/index';
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

    const [rewardedAdLoadState, setRewardedAdLoadState] = useState<AdLoadState>(AdLoadState.notLoaded);

    const rewardedAdRetryAttempt = useRef(0);

    useEffect(() => {
        setupEventListeners();
    }, []);

    const setupEventListeners = () => {
        AppLovinMAX.addRewardedAdLoadedEventListener((adInfo: AdInfo) => {
            setRewardedAdLoadState(AdLoadState.loaded);

            // Rewarded ad is ready to be shown. AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID) will now return 'true'
            log('Rewarded ad loaded from ' + adInfo.networkName);

            // Reset retry attempt
            rewardedAdRetryAttempt.current = 0;
        });
        AppLovinMAX.addRewardedAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            setRewardedAdLoadState(AdLoadState.notLoaded);

            // Rewarded ad failed to load
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
            rewardedAdRetryAttempt.current += 1;

            const retryDelay = Math.pow(2, Math.min(6, rewardedAdRetryAttempt.current));
            log('Rewarded ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

            setTimeout(() => {
                setRewardedAdLoadState(AdLoadState.loading);
                AppLovinMAX.loadRewardedAd(adUnitId);
            }, retryDelay * 1000);
        });
        AppLovinMAX.addRewardedAdClickedEventListener((_adInfo: AdInfo) => {
            log('Rewarded ad clicked');
        });
        AppLovinMAX.addRewardedAdDisplayedEventListener((_adInfo: AdInfo) => {
            log('Rewarded ad displayed');
        });
        AppLovinMAX.addRewardedAdFailedToDisplayEventListener((_adInfo: AdDisplayFailedInfo) => {
            setRewardedAdLoadState(AdLoadState.notLoaded);
            log('Rewarded ad failed to display');
        });
        AppLovinMAX.addRewardedAdHiddenEventListener((_adInfo: AdInfo) => {
            setRewardedAdLoadState(AdLoadState.notLoaded);
            log('Rewarded ad hidden');
        });
        AppLovinMAX.addRewardedAdReceivedRewardEventListener((_adInfo: AdRewardInfo) => {
            log('Rewarded ad granted reward');
        });
        AppLovinMAX.addRewardedAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('Rewarded ad revenue paid: ' + adInfo.revenue);
        });
    }

    const getRewardedButtonTitle = () => {
        if (rewardedAdLoadState === AdLoadState.notLoaded) {
            return 'Load Rewarded Ad';
        } else if (rewardedAdLoadState === AdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Rewarded Ad'; // adLoadState.loaded
        }
    }

    return (
        <AppButton
            title={getRewardedButtonTitle()}
            enabled={
                isInitialized && rewardedAdLoadState !== AdLoadState.loading
            }
            onPress={async () => {
                try {
                    const isRewardedReady = await AppLovinMAX.isRewardedAdReady(adUnitId);
                    if (isRewardedReady) {
                        AppLovinMAX.showRewardedAd(adUnitId);
                    } else {
                        log('Loading rewarded ad...');
                        setRewardedAdLoadState(AdLoadState.loading);
                        AppLovinMAX.loadRewardedAd(adUnitId);
                    }
                } catch (error: any) {
                    log(error.toString());
                }
            }}
        />
    );
}

export default RewardedExample;
