import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { InterstitialAd, ErrorCode } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const MAX_EXPONENTIAL_RETRY_COUNT = 6;

enum AdLoadState {
    notLoaded = 'NOT_LOADED',
    loading = 'LOADING',
    loaded = 'LOADED',
}

type Props = {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
};

const InterExample = ({ adUnitId, isInitialized, log }: Props) => {
    const [adLoadState, setAdLoadState] = useState<AdLoadState>(AdLoadState.notLoaded);

    const retryAttempt = useRef(0);

    useEffect(() => {
        InterstitialAd.addAdLoadedEventListener((adInfo: AdInfo) => {
            setAdLoadState(AdLoadState.loaded);

            // Interstitial ad is ready to be shown. AppLovinMAX.isReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
            log('Interstitial ad loaded from ' + adInfo.networkName);

            // Reset retry attempt
            retryAttempt.current = 0;
        });
        InterstitialAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            setAdLoadState(AdLoadState.notLoaded);

            if (errorInfo.code === ErrorCode.FULLSCREEN_AD_ALREADY_LOADING) {
                log('Interstitial ad failed: ad is already loading');
                return;
            } else if (errorInfo.code === ErrorCode.FULLSCREEN_AD_LOAD_WHILE_SHOWING) {
                log('Interstitial ad failed: ad is currently shown for this ad unit');
                return;
            }

            if (retryAttempt.current > MAX_EXPONENTIAL_RETRY_COUNT) {
                log('Interstitial ad failed to load with code ' + errorInfo.code);
                return;
            }

            // Interstitial ad failed to load
            // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
            retryAttempt.current += 1;

            const retryDelay = Math.pow(2, Math.min(MAX_EXPONENTIAL_RETRY_COUNT, retryAttempt.current));
            log('Interstitial ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

            setTimeout(() => {
                setAdLoadState(AdLoadState.loading);
                log('Interstitial ad retrying to load...');
                InterstitialAd.loadAd(adUnitId);
            }, retryDelay * 1000);
        });
        InterstitialAd.addAdClickedEventListener((/* adInfo: AdInfo */) => {
            log('Interstitial ad clicked');
        });
        InterstitialAd.addAdDisplayedEventListener((/* adInfo: AdInfo */) => {
            log('Interstitial ad displayed');
        });
        InterstitialAd.addAdFailedToDisplayEventListener((/* adInfo: AdDisplayFailedInfo */) => {
            setAdLoadState(AdLoadState.notLoaded);
            log('Interstitial ad failed to display');
        });
        InterstitialAd.addAdHiddenEventListener((/* adInfo: AdInfo */) => {
            setAdLoadState(AdLoadState.notLoaded);
            log('Interstitial ad hidden');
        });
        InterstitialAd.addAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('Interstitial ad revenue paid: ' + adInfo.revenue);
        });
    }, [adUnitId, log]);

    const getInterstitialButtonTitle = () => {
        if (adLoadState === AdLoadState.notLoaded) {
            return 'Load Interstitial';
        } else if (adLoadState === AdLoadState.loading) {
            return 'Loading...';
        } else {
            return 'Show Interstitial'; // adLoadState.loaded
        }
    };

    return (
        <AppButton
            title={getInterstitialButtonTitle()}
            enabled={isInitialized && adLoadState !== AdLoadState.loading}
            onPress={async () => {
                const isInterstitialReady = await InterstitialAd.isAdReady(adUnitId);
                if (isInterstitialReady) {
                    InterstitialAd.showAd(adUnitId);
                } else {
                    log('Loading interstitial ad...');
                    setAdLoadState(AdLoadState.loading);
                    InterstitialAd.loadAd(adUnitId);
                }
            }}
        />
    );
};

export default InterExample;
