import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import AppLovinMAX from '../../src/index';
import AppLogo from './components/AppLogo';
import AppButton from './components/AppButton';

var adLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED',
};

const App = () => {
  // Create constants
  const SDK_KEY = 'YOUR_SDK_KEY_HERE';

  const INTERSTITIAL_AD_UNIT_ID = Platform.select({
    ios: 'ENTER_IOS_INTERSTITIAL_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_INTERSTITIAL_AD_UNIT_ID_HERE',
  });

  const REWARDED_AD_UNIT_ID = Platform.select({
    ios: 'ENTER_IOS_REWARDED_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_REWARDED_AD_UNIT_ID_HERE',
  });

  const BANNER_AD_UNIT_ID = Platform.select({
    ios: 'ENTER_IOS_BANNER_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_BANNER_AD_UNIT_ID_HERE',
  });

  // Create states
  const [isInitialized, setIsInitialized] = useState(false);
  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(adLoadState.notLoaded);
  const [interstitialRetryAttempt, setInterstitialRetryAttempt] = useState(0);
  const [rewardedAdLoadState, setRewardedAdLoadState] = useState(adLoadState.notLoaded);
  const [rewardedAdRetryAttempt, setRewardedAdRetryAttempt] = useState(0);
  const [isBannerShowing, setIsBannerShowing] = useState(false);
  const [statusText, setStatusText] = useState('Initializing SDK...');
  
  AppLovinMAX.setVerboseLogging(true);
  AppLovinMAX.initialize(SDK_KEY, () => {
    setIsInitialized(true);

    logStatus('SDK Initialized');

    // Attach ad listeners for interstitial ads, rewarded ads, and banner ads
    attachAdListeners();

    // Create banner - banners are automatically sized to 320x50 on phones and 728x90 on tablets
    AppLovinMAX.createBanner(
      BANNER_AD_UNIT_ID,
      AppLovinMAX.AdViewPosition.BOTTOM_CENTER
    );

    // Set background color for banners to be fully functional
    // In this case we are setting it to black - PLEASE USE HEX STRINGS ONLY
    AppLovinMAX.setBannerBackgroundColor(BANNER_AD_UNIT_ID, '#000000');
  });

  function attachAdListeners() {

    // Interstitial Listeners
    AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', () => {
      setInterstitialAdLoadState(adLoadState.loaded);

      // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
      var adInfo = AppLovinMAX.getAdInfo(INTERSTITIAL_AD_UNIT_ID);
      logStatus('Interstitial ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setInterstitialRetryAttempt(0)
    });
    AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', () => {

      // Interstitial ad failed to load 
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setInterstitialRetryAttempt(interstitialRetryAttempt + 1);

      var retryDelay = Math.pow(2, Math.min(6, interstitialRetryAttempt));
      logStatus('Interstitial ad failed to load - retrying in ' + retryDelay + 's');
      
      setTimeout(function() {
        AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnInterstitialClickedEvent', () => {
      logStatus('Interstitial ad clicked');
    });
    AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', () => {
      logStatus('Interstitial ad displayed');
    });
    AppLovinMAX.addEventListener('OnInterstitialAdFailedToDisplayEvent', () => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad failed to display');
    });
    AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', () => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad hidden');
    });

    // Rewarded Ad Listeners
    AppLovinMAX.addEventListener('OnRewardedAdLoadedEvent', () => {
      setRewardedAdLoadState(adLoadState.loaded);

      // Rewarded ad is ready to be shown. AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID) will now return 'true'
      var adInfo = AppLovinMAX.getAdInfo(REWARDED_AD_UNIT_ID);
      logStatus('Rewarded ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setRewardedAdRetryAttempt(0);
    });
    AppLovinMAX.addEventListener('OnRewardedAdLoadFailedEvent', () => {
      setRewardedAdLoadState(adLoadState.notLoaded);

      // Rewarded ad failed to load 
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setRewardedAdRetryAttempt(rewardedAdRetryAttempt + 1);

      var retryDelay = Math.pow(2, Math.min(6, rewardedAdRetryAttempt));
      logStatus('Rewarded ad failed to load - retrying in ' + retryDelay + 's');
      
      setTimeout(function() {
        AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnRewardedAdClickedEvent', () => {
      logStatus('Rewarded ad clicked');
    });
    AppLovinMAX.addEventListener('OnRewardedAdDisplayedEvent', () => {
      logStatus('Rewarded ad displayed');
    });
    AppLovinMAX.addEventListener('OnRewardedAdFailedToDisplayEvent', () => {
      setRewardedAdLoadState(adLoadState.notLoaded);
      logStatus('Rewarded ad failed to display');
    });
    AppLovinMAX.addEventListener('OnRewardedAdHiddenEvent', () => {
      setRewardedAdLoadState(adLoadState.notLoaded);
      logStatus('Rewarded ad hidden');
    });
    AppLovinMAX.addEventListener('OnRewardedAdReceivedRewardEvent', () => {
      logStatus('Rewarded ad granted reward');
    });

    // Banner Ad Listeners
    AppLovinMAX.addEventListener('OnBannerAdLoadedEvent', () => {
      var adInfo = AppLovinMAX.getAdInfo(BANNER_AD_UNIT_ID);
      logStatus('Banner ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addEventListener('OnBannerAdLoadFailedEvent', () => {
      logStatus('Banner ad failed to load');
    });
    AppLovinMAX.addEventListener('OnBannerAdClickedEvent', () => {
      logStatus('Banner ad clicked');
    });
    AppLovinMAX.addEventListener('OnBannerAdExpandedEvent', () => {
      logStatus('Banner ad expanded') 
    });
    AppLovinMAX.addEventListener('OnBannerAdCollapsedEvent', () => {
      logStatus('Banner ad collapsed') 
    });
  }

  function getInterstitialButtonTitle() {
    if (interstitialAdLoadState === adLoadState.notLoaded) {
      return 'Load Interstitial';
    } else if (interstitialAdLoadState === adLoadState.loading) {
      return 'Loading...';
    } else {
      return 'Show Interstitial'; // adLoadState.loaded
    }
  }

  function getRewardedButtonTitle() {
    if (rewardedAdLoadState === adLoadState.notLoaded) {
      return 'Load Rewarded Ad';
    } else if (rewardedAdLoadState === adLoadState.loading) {
      return 'Loading...';
    } else {
      return 'Show Rewarded Ad'; // adLoadState.loaded
    }
  }

  function logStatus(status) {
    console.log(status);
    setStatusText(status);
  }

  return (
    <View style={styles.container}>
      <AppLogo />
      <Text style={styles.statusText}>
        {statusText}
      </Text>
      <AppButton
        title="Mediation Debugger"
        enabled={isInitialized}
        onPress={() => {
          if (AppLovinMAX.isInitialized()) {
            AppLovinMAX.showMediationDebugger();
          }
        }}
      />
      <AppButton
        title={getInterstitialButtonTitle()}
        enabled={
          isInitialized && interstitialAdLoadState !== adLoadState.loading
        }
        onPress={() => {
          if (AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID)) {
            AppLovinMAX.showInterstitial(INTERSTITIAL_AD_UNIT_ID);
          } else {
            setInterstitialAdLoadState(adLoadState.loading);
            AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
          }
        }}
      />
      <AppButton
        title={getRewardedButtonTitle()}
        enabled={isInitialized && rewardedAdLoadState !== adLoadState.loading}
        onPress={() => {
          if (AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID)) {
            AppLovinMAX.showRewardedAd(REWARDED_AD_UNIT_ID);
          } else {
            setRewardedAdLoadState(adLoadState.loading);
            AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
          }
        }}
      />
      <AppButton
        title={isBannerShowing ? 'Hide Banner' : 'Show Banner Ad'}
        enabled={isInitialized}
        onPress={() => {
          if (isBannerShowing) {
            AppLovinMAX.hideBanner(BANNER_AD_UNIT_ID);
          } else {
            AppLovinMAX.showBanner(BANNER_AD_UNIT_ID);
          }

          setIsBannerShowing(!isBannerShowing);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
  },
  statusText: {
    marginBottom: 10,
    backgroundColor: 'green',
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default App;
