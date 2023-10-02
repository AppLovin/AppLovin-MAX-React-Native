import React, { useState, useEffect, useRef } from 'react';
import { InterstitialAd } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdDisplayFailedInfo } from '../../src/index';
import AppButton from './components/AppButton';

enum AdLoadState {
    notLoaded = 'NOT_LOADED',
    loading = 'LOADING',
    loaded = 'LOADED',
};

const InterExample = (props: any) => {
    const {
        adUnitId,
        isInitialized,
        log,
    } = props;

    const [adLoadState, setAdLoadState] = useState<AdLoadState>(AdLoadState.notLoaded);

    const retryAttempt = useRef(0);

    useEffect(() => {
        setupEventListeners();
    }, []);

    const setupEventListeners = () => {
        InterstitialAd.addAdLoadedEventListener((adInfo: AdInfo) => {
            setAdLoadState(AdLoadState.loaded);

            // Interstitial ad is ready to be shown. AppLovinMAX.isReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
            log('Interstitial ad loaded from ' + adInfo.networkName);

            // Reset retry attempt
            retryAttempt.current = 0;
        });
        InterstitialAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            setAdLoadState(AdLoadState.notLoaded);

            // Interstitial ad failed to load
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
            retryAttempt.current += 1;

            const retryDelay = Math.pow(2, Math.min(6, retryAttempt.current));
            log('Interstitial ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

            setTimeout(() => {
                setAdLoadState(AdLoadState.loading);
                InterstitialAd.load(adUnitId);
            }, retryDelay * 1000);
        });
        InterstitialAd.addAdClickedEventListener((_adInfo: AdInfo) => {
            log('Interstitial ad clicked');
        });
        InterstitialAd.addAdDisplayedEventListener((_adInfo: AdInfo) => {
            log('Interstitial ad displayed');
        });
        InterstitialAd.addAdFailedToDisplayEventListener((_adInfo: AdDisplayFailedInfo) => {
            setAdLoadState(AdLoadState.notLoaded);
            log('Interstitial ad failed to display');
        });
        InterstitialAd.addAdHiddenEventListener((_adInfo: AdInfo) => {
            setAdLoadState(AdLoadState.notLoaded);
            log('Interstitial ad hidden');
        });
        InterstitialAd.addAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('Interstitial ad revenue paid: ' + adInfo.revenue);
        });
    }

    const getInterstitialButtonTitle = () => {
        if (adLoadState === AdLoadState.notLoaded) {
            return 'Load Interstitial';
        } else if (adLoadState === AdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Interstitial'; // adLoadState.loaded
        }
    }

    return (
        <AppButton
            title={getInterstitialButtonTitle()}
            enabled={
                isInitialized && adLoadState !== AdLoadState.loading
            }
            onPress={async () => {
                try {
                    const isInterstitialReady = await InterstitialAd.isReady(adUnitId);
                    if (isInterstitialReady) {
                        InterstitialAd.show(adUnitId);
                    } else {
                        log('Loading interstitial ad...');
                        setAdLoadState(AdLoadState.loading);
                        InterstitialAd.load(adUnitId);
                    }
                } catch (error: any) {
                    log(error.toString());
                }
            }}
        />
    );
}

export default InterExample;
