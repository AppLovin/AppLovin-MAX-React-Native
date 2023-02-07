import React, { useState, useEffect, useRef } from 'react';
import AppLovinMAX from '../../src/index';
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

    const [interstitialAdLoadState, setInterstitialAdLoadState] = useState<AdLoadState>(AdLoadState.notLoaded);

    const interstitialRetryAttempt = useRef(0);

    useEffect(() => {
        setupEventListeners();
    }, []);

    const setupEventListeners = () => {
        AppLovinMAX.addInterstitialLoadedEventListener((adInfo: AdInfo) => {
            setInterstitialAdLoadState(AdLoadState.loaded);

            // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
            log('Interstitial ad loaded from ' + adInfo.networkName);

            // Reset retry attempt
            interstitialRetryAttempt.current = 0;
        });
        AppLovinMAX.addInterstitialLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            setInterstitialAdLoadState(AdLoadState.notLoaded);

            // Interstitial ad failed to load
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
            interstitialRetryAttempt.current += 1;

            const retryDelay = Math.pow(2, Math.min(6, interstitialRetryAttempt.current));
            log('Interstitial ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

            setTimeout(() => {
                setInterstitialAdLoadState(AdLoadState.loading);
                AppLovinMAX.loadInterstitial(adUnitId);
            }, retryDelay * 1000);
        });
        AppLovinMAX.addInterstitialClickedEventListener((_adInfo: AdInfo) => {
            log('Interstitial ad clicked');
        });
        AppLovinMAX.addInterstitialDisplayedEventListener((_adInfo: AdInfo) => {
            log('Interstitial ad displayed');
        });
        AppLovinMAX.addInterstitialAdFailedToDisplayEventListener((_adInfo: AdDisplayFailedInfo) => {
            setInterstitialAdLoadState(AdLoadState.notLoaded);
            log('Interstitial ad failed to display');
        });
        AppLovinMAX.addInterstitialHiddenEventListener((_adInfo: AdInfo) => {
            setInterstitialAdLoadState(AdLoadState.notLoaded);
            log('Interstitial ad hidden');
        });
        AppLovinMAX.addInterstitialAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('Interstitial ad revenue paid: ' + adInfo.revenue);
        });
    }

    const getInterstitialButtonTitle = () => {
        if (interstitialAdLoadState === AdLoadState.notLoaded) {
            return 'Load Interstitial';
        } else if (interstitialAdLoadState === AdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Interstitial'; // adLoadState.loaded
        }
    }

    return (
        <AppButton
            title={getInterstitialButtonTitle()}
            enabled={
                isInitialized && interstitialAdLoadState !== AdLoadState.loading
            }
            onPress={async () => {
                try {
                    const isInterstitialReady = await AppLovinMAX.isInterstitialReady(adUnitId);
                    if (isInterstitialReady) {
                        AppLovinMAX.showInterstitial(adUnitId);
                    } else {
                        log('Loading interstitial ad...');
                        setInterstitialAdLoadState(AdLoadState.loading);
                        AppLovinMAX.loadInterstitial(adUnitId);
                    }
                } catch (error: any) {
                    log(error.toString());
                }
            }}
        />
    );
}

export default InterExample;
