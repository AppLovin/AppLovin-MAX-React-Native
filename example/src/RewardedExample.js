import React, { useState, useEffect } from 'react';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

const AdLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED'
};

const RewardedExample = (props) => {
  const { adUnitId } = props;
  const { isInitialized } = props;
  const { log } = props;

  const [rewardedAdLoadState, setRewardedAdLoadState] = useState(AdLoadState.notLoaded);

  useEffect(() => {
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    AppLovinMAX.addRewardedAdLoadedEventListener((adInfo) => {
      setRewardedAdLoadState(AdLoadState.loaded);
      log('Rewarded ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addRewardedAdLoadFailedEventListener((errorInfo) => {
      log('Rewarded ad failed to load with code ' + errorInfo.code + ' with ' + errorInfo.message);
    });
    AppLovinMAX.addRewardedAdClickedEventListener((_adInfo) => {
      log('Rewarded ad clicked');
    });
    AppLovinMAX.addRewardedAdDisplayedEventListener((_adInfo) => {
      log('Rewarded ad displayed');
    });
    AppLovinMAX.addRewardedAdFailedToDisplayEventListener((_adInfo) => {
      setRewardedAdLoadState(AdLoadState.notLoaded);
      log('Rewarded ad failed to display');
    });
    AppLovinMAX.addRewardedAdHiddenEventListener((_adInfo) => {
      setRewardedAdLoadState(AdLoadState.notLoaded);
      log('Rewarded ad hidden');
    });
    AppLovinMAX.addRewardedAdReceivedRewardEventListener((_adInfo) => {
      log('Rewarded ad granted reward');
    });
    AppLovinMAX.addRewardedAdRevenuePaidListener((adInfo) => {
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
        } catch (error) {
          log(error.toString());
        }
      }}
    />
  );
}

export default RewardedExample;
