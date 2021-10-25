import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AppLovinMAX from '../../src/index';
import AppLogo from './components/AppLogo';
import AppButton from './components/AppButton';
import 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";

var adLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED',
};

const App = () => {

  // Create constants
  const SDK_KEY = 'hBDh6tzZrp-fWye63N4nhbgw8umnTzD99QsGIpq8bpo7lRDppHZVuEQ17Bpa80lIRaTlONt-Af6v5JiubGOUVp';

  const INTERSTITIAL_AD_UNIT_ID = Platform.select({
    ios: '65d8d0195e50bda6',
    android: '6bf752cf76bc7f3b',
  });

  const REWARDED_AD_UNIT_ID = Platform.select({
    ios: '82076aefed4737ed',
    android: 'a880dbdb58c811d5',
  });

  const BANNER_AD_UNIT_ID = Platform.select({
    ios: '35858295296a8c80',
    android: 'cb5529a55a443f83',
  });

  const MREC_AD_UNIT_ID = Platform.select({
    ios: 'f865a23962fa00e5',
    android: 'e12ca346bdbddaef',
  });

  // Create states
  const [isInitialized, setIsInitialized] = useState(false);
  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(adLoadState.notLoaded);
  const [interstitialRetryAttempt, setInterstitialRetryAttempt] = useState(0);
  const [rewardedAdLoadState, setRewardedAdLoadState] = useState(adLoadState.notLoaded);
  const [rewardedAdRetryAttempt, setRewardedAdRetryAttempt] = useState(0);
  const [isProgrammaticBannerCreated, setIsProgrammaticBannerCreated] = useState(false);
  const [isProgrammaticBannerShowing, setIsProgrammaticBannerShowing] = useState(false);
  const [isNativeUIBannerShowing, setIsNativeUIBannerShowing] = useState(false);
  const [isProgrammaticMRecCreated, setIsProgrammaticMRecCreated] = useState(false);
  const [isProgrammaticMRecShowing, setIsProgrammaticMRecShowing] = useState(false);
  const [isNativeUIMRecShowing, setIsNativeUIMRecShowing] = useState(false);
  const [statusText, setStatusText] = useState('Initializing SDK...');

  AppLovinMAX.setTestDeviceAdvertisingIds([]);
  AppLovinMAX.initialize(SDK_KEY, () => {
    setIsInitialized(true);

    logStatus('SDK Initialized');

    // Attach ad listeners for interstitial ads, rewarded ads, and banner ads
    attachAdListeners();
  });

  function attachAdListeners() {
    // Interstitial Listeners
    AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', (adInfo) => {
      setInterstitialAdLoadState(adLoadState.loaded);

      // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
      logStatus('Interstitial ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setInterstitialRetryAttempt(0)
    });
    AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', (errorInfo) => {
      // Interstitial ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setInterstitialRetryAttempt(interstitialRetryAttempt + 1);

      var retryDelay = Math.pow(2, Math.min(6, interstitialRetryAttempt));
      logStatus('Interstitial ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

      setTimeout(function () {
        AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnInterstitialClickedEvent', (adInfo) => {
      logStatus('Interstitial ad clicked');
    });
    AppLovinMAX.addEventListener('OnInterstitialDisplayedEvent', (adInfo) => {
      logStatus('Interstitial ad displayed');
    });
    AppLovinMAX.addEventListener('OnInterstitialAdFailedToDisplayEvent', (adInfo) => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad failed to display');
    });
    AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', (adInfo) => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      logStatus('Interstitial ad hidden');
    });

    // Rewarded Ad Listeners
    AppLovinMAX.addEventListener('OnRewardedAdLoadedEvent', (adInfo) => {
      setRewardedAdLoadState(adLoadState.loaded);

      // Rewarded ad is ready to be shown. AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID) will now return 'true'
      logStatus('Rewarded ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setRewardedAdRetryAttempt(0);
    });
    AppLovinMAX.addEventListener('OnRewardedAdLoadFailedEvent', (errorInfo) => {
      setRewardedAdLoadState(adLoadState.notLoaded);

      // Rewarded ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setRewardedAdRetryAttempt(rewardedAdRetryAttempt + 1);

      var retryDelay = Math.pow(2, Math.min(6, rewardedAdRetryAttempt));
      logStatus('Rewarded ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

      setTimeout(function () {
        AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addEventListener('OnRewardedAdClickedEvent', (adInfo) => {
      logStatus('Rewarded ad clicked');
    });
    AppLovinMAX.addEventListener('OnRewardedAdDisplayedEvent', (adInfo) => {
      logStatus('Rewarded ad displayed');
    });
    AppLovinMAX.addEventListener('OnRewardedAdFailedToDisplayEvent', (adInfo) => {
      setRewardedAdLoadState(adLoadState.notLoaded);
      logStatus('Rewarded ad failed to display');
    });
    AppLovinMAX.addEventListener('OnRewardedAdHiddenEvent', (adInfo) => {
      setRewardedAdLoadState(adLoadState.notLoaded);
      logStatus('Rewarded ad hidden');
    });
    AppLovinMAX.addEventListener('OnRewardedAdReceivedRewardEvent', (adInfo) => {
      logStatus('Rewarded ad granted reward');
    });

    // Banner Ad Listeners
    AppLovinMAX.addEventListener('OnBannerAdLoadedEvent', (adInfo) => {
      logStatus('Banner ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addEventListener('OnBannerAdLoadFailedEvent', (errorInfo) => {
      logStatus('Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
    });
    AppLovinMAX.addEventListener('OnBannerAdClickedEvent', (adInfo) => {
      logStatus('Banner ad clicked');
    });
    AppLovinMAX.addEventListener('OnBannerAdExpandedEvent', (adInfo) => {
      logStatus('Banner ad expanded')
    });
    AppLovinMAX.addEventListener('OnBannerAdCollapsedEvent', (adInfo) => {
      logStatus('Banner ad collapsed')
    });

    // MREC Ad Listeners
    AppLovinMAX.addEventListener('OnMRecAdLoadedEvent', (adInfo) => {
      logStatus('MREC ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addEventListener('OnMRecAdLoadFailedEvent', (errorInfo) => {
      logStatus('MREC ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
    });
    AppLovinMAX.addEventListener('OnMRecAdClickedEvent', (adInfo) => {
      logStatus('MREC ad clicked');
    });
    AppLovinMAX.addEventListener('OnMRecAdExpandedEvent', (adInfo) => {
      logStatus('MREC ad expanded')
    });
    AppLovinMAX.addEventListener('OnMRecAdCollapsedEvent', (adInfo) => {
      logStatus('MREC ad collapsed')
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
    <NavigationContainer>
      <View style={styles.container}>
        <AppLogo/>
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
              logStatus('Loading interstitial ad...');
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
              logStatus('Loading rewarded ad...');
              setRewardedAdLoadState(adLoadState.loading);
              AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
            }
          }}
        />
        <AppButton
          title={isProgrammaticBannerShowing ? 'Hide Programmatic Banner' : 'Show Programmatic Banner'}
          enabled={isInitialized && !isNativeUIBannerShowing}
          onPress={() => {
            if (isProgrammaticBannerShowing) {
              AppLovinMAX.hideBanner(BANNER_AD_UNIT_ID);
            } else {

              if (!isProgrammaticBannerCreated) {

                //
                // Programmatic banner creation - banners are automatically sized to 320x50 on phones and 728x90 on tablets
                //
                AppLovinMAX.createBannerWithOffsets(
                  BANNER_AD_UNIT_ID,
                  AppLovinMAX.AdViewPosition.BOTTOM_CENTER, 0, 50
                );

                // Set background color for banners to be fully functional
                // In this case we are setting it to black - PLEASE USE HEX STRINGS ONLY
                AppLovinMAX.setBannerBackgroundColor(BANNER_AD_UNIT_ID, '#000000');

                setIsProgrammaticBannerCreated(true);
              }

              AppLovinMAX.showBanner(BANNER_AD_UNIT_ID);
            }

            setIsProgrammaticBannerShowing(!isProgrammaticBannerShowing);
          }}
        />
        <AppButton
          title={isNativeUIBannerShowing ? 'Hide Native UI Banner' : 'Show Native UI Banner'}
          enabled={isInitialized && !isProgrammaticBannerShowing}
          onPress={() => {
            setIsNativeUIBannerShowing(!isNativeUIBannerShowing);
          }}
        />
        {
          (() => {
            if (isNativeUIBannerShowing) {
              return (
                <AppLovinMAX.AdView adUnitId={BANNER_AD_UNIT_ID}
                                    adFormat={AppLovinMAX.AdFormat.BANNER}
                                    adaptiveBannerEnabled={false}
                                    style={styles.banner}/>
              );
            }
          })()
        }
        <AppButton
          title={isNativeUIMRecShowing ? 'Hide Native UI MREC' : 'Show Native UI MREC'}
          enabled={isInitialized && !isProgrammaticMRecShowing}
          onPress={() => {
            setIsNativeUIMRecShowing(!isNativeUIMRecShowing);
          }}
        />
        {
          (() => {
            if (isNativeUIMRecShowing) {
              return (
                <AppLovinMAX.AdView adUnitId={MREC_AD_UNIT_ID}
                                    adFormat={AppLovinMAX.AdFormat.MREC}
                                    adaptiveBannerEnabled={false}
                                    style={styles.mrec}/>
              );
            }
          })()
        }
        <AppButton
          title={isProgrammaticMRecShowing ? 'Hide Programmatic MREC' : 'Show Programmatic MREC'}
          enabled={isInitialized && !isNativeUIMRecShowing}
          onPress={() => {
            if (isProgrammaticMRecShowing) {
              AppLovinMAX.hideMRec(MREC_AD_UNIT_ID);
            } else {

              if (!isProgrammaticMRecCreated) {
                AppLovinMAX.createMRec(
                  MREC_AD_UNIT_ID,
                  AppLovinMAX.AdViewPosition.TOP_CENTER
                );

                setIsProgrammaticMRecCreated(true);
              }

              AppLovinMAX.showMRec(MREC_AD_UNIT_ID);
            }

            setIsProgrammaticMRecShowing(!isProgrammaticMRecShowing);
          }}
        />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    paddingTop: 80,
    flex: 1, // Enables flexbox column layout
  },
  statusText: {
    marginBottom: 10,
    backgroundColor: 'green',
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  banner: {
    // Set background color for banners to be fully functional
    backgroundColor: '#000000',
    position: 'absolute',
    width: '100%',
    height: 200,//AppLovinMAX.getAdaptiveBannerHeightForWidth(-1),
    bottom: Platform.select({
      ios: 36, // For bottom safe area
      android: 0,
    })
  },
  mrec: {
    position: 'absolute',
    width: '100%',
    height: 250,
    bottom: Platform.select({
      ios: 36, // For bottom safe area
      android: 0,
    })
  }
});

export default App;
