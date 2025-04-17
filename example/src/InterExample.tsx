import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { InterstitialAd } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const MAX_EXPONENTIAL_RETRY_COUNT = 6;
const MAX_RETRY_DELAY_SECONDS = 64;

enum InterstitialAdLoadState {
    notLoaded = 'NOT_LOADED',
    loading = 'LOADING',
    loaded = 'LOADED',
}

const InterstitialExample = ({ adUnitId, isInitialized, log }: { adUnitId: string; isInitialized: boolean; log: (str: string) => void }) => {
    const [adLoadState, setAdLoadState] = useState<InterstitialAdLoadState>(InterstitialAdLoadState.notLoaded);
    const retryAttempt = useRef(0);

    useEffect(() => {
        function onAdLoaded(adInfo: AdInfo) {
            setAdLoadState(InterstitialAdLoadState.loaded);

            // Interstitial ad loaded and ready to show.
            log('Interstitial ad loaded from ' + adInfo.networkName);
            retryAttempt.current = 0;
        }

        function onAdLoadFailed(errorInfo: AdLoadFailedInfo) {
            setAdLoadState(InterstitialAdLoadState.notLoaded);

            if (retryAttempt.current > MAX_EXPONENTIAL_RETRY_COUNT) {
                log('Interstitial ad failed to load with code ' + errorInfo.code);
                return;
            }

            // Interstitial ad failed to load.
            // Retry with exponential backoff, capped at MAX_RETRY_DELAY_SECONDS.
            retryAttempt.current += 1;

            const retryDelay = Math.min(MAX_RETRY_DELAY_SECONDS, Math.pow(2, retryAttempt.current));
            log(`Interstitial ad failed to load (code: ${errorInfo.code}) - retrying in ${retryDelay}s`);

            setTimeout(() => {
                setAdLoadState(InterstitialAdLoadState.loading);
                log('Retrying to load interstitial ad...');
                InterstitialAd.loadAd(adUnitId);
            }, retryDelay * 1000);
        }

        InterstitialAd.addAdLoadedEventListener(onAdLoaded);
        InterstitialAd.addAdLoadFailedEventListener(onAdLoadFailed);
        InterstitialAd.addAdClickedEventListener(() => log('Interstitial ad clicked'));
        InterstitialAd.addAdDisplayedEventListener(() => log('Interstitial ad displayed'));
        InterstitialAd.addAdFailedToDisplayEventListener(() => {
            setAdLoadState(InterstitialAdLoadState.notLoaded);
            log('Interstitial ad failed to display');
        });
        InterstitialAd.addAdHiddenEventListener(() => {
            setAdLoadState(InterstitialAdLoadState.notLoaded);
            log('Interstitial ad hidden');
        });
        InterstitialAd.addAdRevenuePaidListener((adInfo: AdInfo) => log('Interstitial ad revenue paid: ' + adInfo.revenue));

        // Cleanup listeners on unmount
        return () => {
            InterstitialAd.removeAdLoadedEventListener();
            InterstitialAd.removeAdLoadFailedEventListener();
            InterstitialAd.removeAdClickedEventListener();
            InterstitialAd.removeAdDisplayedEventListener();
            InterstitialAd.removeAdFailedToDisplayEventListener();
            InterstitialAd.removeAdHiddenEventListener();
            InterstitialAd.removeAdRevenuePaidListener();
        };
    }, [adUnitId, log]);

    const getInterstitialButtonTitle = () => {
        if (adLoadState === InterstitialAdLoadState.notLoaded) {
            return 'Load Interstitial';
        } else if (adLoadState === InterstitialAdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Interstitial'; // adLoadState.loaded
        }
    };

    const loadAndShowInterstitialAd = async () => {
        const isInterstitialReady = await InterstitialAd.isAdReady(adUnitId);
        if (isInterstitialReady) {
            InterstitialAd.showAd(adUnitId);
        } else {
            log('Loading interstitial ad...');
            setAdLoadState(InterstitialAdLoadState.loading);
            InterstitialAd.loadAd(adUnitId);
        }
    };

    return <AppButton title={getInterstitialButtonTitle()} enabled={isInitialized && adLoadState !== InterstitialAdLoadState.loading} onPress={loadAndShowInterstitialAd} />;
};

export default InterstitialExample;
