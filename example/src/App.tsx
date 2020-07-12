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
  const SDK_KEY =
    '05TMDQ5tZabpXQ45_UTbmEGNUtVAzSTzT6KmWQc5_CuWdzccS4DCITZoL3yIWUG3bbq60QC_d4WF28tUC4gVTF';

  const INTERSTITIAL_AD_UNIT_ID = Platform.select({
    ios: '669b9232b93315b8', //'ENTER_IOS_INTERSTITIAL_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_INTERSTITIAL_AD_UNIT_ID_HERE',
  });

  const REWARDED_AD_UNIT_ID = Platform.select({
    ios: '72948f99c2065dfa', //'ENTER_IOS_REWARDED_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_REWARDED_AD_UNIT_ID_HERE',
  });

  const BANNER_AD_UNIT_ID = Platform.select({
    ios: 'ee3f36bb0f16e195', //'ENTER_IOS_BANNER_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_BANNER_AD_UNIT_ID_HERE',
  });

  // Create states
  const [isInitialized, setIsInitialized] = useState(false);
  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(
    adLoadState.notLoaded
  );
  const [rewardedAdLoadState, setRewardedAdLoadState] = useState(
    adLoadState.notLoaded
  );
  const [isBannerShowing, setIsBannerShowing] = useState(false);

  // Attach Listeners
  AppLovinMAX.addEventListener('OnSdkInitializedEvent', () => {
    setIsInitialized(true);

    // Create banner - banners are automatically sized to 320x50 on phones and 728x90 on tablets
    AppLovinMAX.createBanner(
      BANNER_AD_UNIT_ID,
      AppLovinMAX.AdViewPosition.BOTTOM_CENTER
    );

    // Set background color for banners to be fully functional
    AppLovinMAX.setBannerBackgroundColor(BANNER_AD_UNIT_ID, '000000');
  });

  // Interstitial Listeners
  AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', () => {
    setInterstitialAdLoadState(adLoadState.loaded);
  });
  AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', () => {
    setInterstitialAdLoadState(adLoadState.notLoaded);
  });
  AppLovinMAX.addEventListener('OnInterstitialClickedEvent', () => {});
  AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', () => {});
  AppLovinMAX.addEventListener('OnInterstitialAdFailedToDisplayEvent', () => {
    setInterstitialAdLoadState(adLoadState.notLoaded);
  });
  AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', () => {
    setInterstitialAdLoadState(adLoadState.notLoaded);
  });

  // Rewarded Ad Listeners
  AppLovinMAX.addEventListener('OnRewardedAdLoadedEvent', () => {
    setRewardedAdLoadState(adLoadState.loaded);
  });
  AppLovinMAX.addEventListener('OnRewardedAdLoadFailedEvent', () => {
    setRewardedAdLoadState(adLoadState.notLoaded);
  });
  AppLovinMAX.addEventListener('OnRewardedAdClickedEvent', () => {});
  AppLovinMAX.addEventListener('OnRewardedAdDisplayedEvent', () => {});
  AppLovinMAX.addEventListener('OnRewardedAdFailedToDisplayEvent', () => {
    setInterstitialAdLoadState(adLoadState.notLoaded);
  });
  AppLovinMAX.addEventListener('OnRewardedAdHiddenEvent', () => {
    setInterstitialAdLoadState(adLoadState.notLoaded);
  });
  AppLovinMAX.addEventListener('OnRewardedAdReceivedRewardEvent', () => {});

  // Banner Ad Listeners
  AppLovinMAX.addEventListener('OnBannerAdLoadedEvent', () => {});
  AppLovinMAX.addEventListener('OnBannerAdLoadFailedEvent', () => {
    setRewardedAdLoadState(adLoadState.notLoaded);
  });
  AppLovinMAX.addEventListener('OnBannerAdClickedEvent', () => {});
  AppLovinMAX.addEventListener('OnBannerAdCollapsedEvent', () => {});
  AppLovinMAX.addEventListener('OnBannerAdExpandedEvent', () => {});

  AppLovinMAX.setVerboseLogging(true);
  AppLovinMAX.initialize(SDK_KEY);

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

  return (
    <View style={styles.container}>
      <AppLogo />
      <Text style={styles.statusText}>
        {isInitialized ? 'SDK Initialized' : 'Initializing SDK...'}
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

          // Toggle banner show state
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
