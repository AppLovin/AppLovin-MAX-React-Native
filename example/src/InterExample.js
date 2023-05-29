import React, { useState, useEffect } from 'react';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

const AdLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED'
};

const InterExample = (props) => {
  const { adUnitId } = props;
  const { isInitialized } = props;
  const { log } = props;

  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(AdLoadState.notLoaded);

  useEffect(() => {
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    AppLovinMAX.addInterstitialLoadedEventListener((adInfo) => {
      setInterstitialAdLoadState(AdLoadState.loaded);
      log('Interstitial ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addInterstitialLoadFailedEventListener((errorInfo) => {
      log('Interstitial ad failed to load with code ' + errorInfo.code + ' with ' + errorInfo.message);
    });
    AppLovinMAX.addInterstitialClickedEventListener((_adInfo) => {
      log('Interstitial ad clicked');
    });
    AppLovinMAX.addInterstitialDisplayedEventListener((_adInfo) => {
      log('Interstitial ad displayed');
    });
    AppLovinMAX.addInterstitialAdFailedToDisplayEventListener((_adInfo) => {
      setInterstitialAdLoadState(AdLoadState.notLoaded);
      log('Interstitial ad failed to display');
    });
    AppLovinMAX.addInterstitialHiddenEventListener((_adInfo) => {
      setInterstitialAdLoadState(AdLoadState.notLoaded);
      log('Interstitial ad hidden');
    });
    AppLovinMAX.addInterstitialAdRevenuePaidListener((adInfo) => {
      log('Interstitial ad revenue paid: ' + adInfo.revenue);
    });
  }

  const getInterstitialButtonTitle = () => {
    if (interstitialAdLoadState === AdLoadState.notLoaded) {
      return 'Load Interstitial';
    } else if (interstitialAdLoadState === AdLoadState.loading) {
      return 'Loading...';
    } else {
      return 'Show Interstitial'; // AdLoadState.loaded
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
        } catch (error) {
          log(error.toString());
        }
      }}
    />
  );
}

export default InterExample;
