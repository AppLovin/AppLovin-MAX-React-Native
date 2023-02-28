import React, {useState, useEffect, useRef} from 'react';
import {Platform, StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import AppLovinMAX from '../../src/index';
import AppLogo from './components/AppLogo';
import AppButton from './components/AppButton';
import NativeAdViewExample from './NativeAdViewExample';

const adLoadState = {
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

  const MREC_AD_UNIT_ID = Platform.select({
    ios: 'ENTER_IOS_MREC_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_MREC_AD_UNIT_ID_HERE',
  });

  const NATIVE_AD_UNIT_ID = Platform.select({
    ios: 'ENTER_IOS_NATIVE_AD_UNIT_ID_HERE',
    android: 'ENTER_ANDROID_NATIVE_AD_UNIT_ID_HERE',
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
  const [isNativeAdShowing, setIsNativeAdShowing] = useState(false);

  // Ref for NativeAdView
  const nativeAdViewRef = useRef();

  // Run once after mounting
  useEffect(() => {
    initAppLovinMax();
  }, []);

  // Run when statusText has changed
  useEffect(() => {
    console.log(statusText);
  }, [statusText]);

  const initAppLovinMax = () => {
    if (isInitialized) return;

    AppLovinMAX.setTestDeviceAdvertisingIds([]);
    AppLovinMAX.initialize(SDK_KEY).then(configuration => {
      setIsInitialized(true);
      setStatusText('SDK Initialized');

      // Attach ad listeners for interstitial ads, rewarded ads, and banner ads
      attachAdListeners();
    }).catch(error => {
      setStatusText(error.toString());
    });
  }

  const attachAdListeners = () => {
    // Interstitial Listeners
    AppLovinMAX.addInterstitialLoadedEventListener((adInfo) => {
      setInterstitialAdLoadState(adLoadState.loaded);

      // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'
      setStatusText('Interstitial ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setInterstitialRetryAttempt(0)
    });
    AppLovinMAX.addInterstitialLoadFailedEventListener((errorInfo) => {
      // Interstitial ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setInterstitialRetryAttempt(interstitialRetryAttempt + 1);

      let retryDelay = Math.pow(2, Math.min(6, interstitialRetryAttempt));
      setStatusText('Interstitial ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

      setTimeout(() => {
        AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addInterstitialClickedEventListener((adInfo) => {
      setStatusText('Interstitial ad clicked');
    });
    AppLovinMAX.addInterstitialDisplayedEventListener((adInfo) => {
      setStatusText('Interstitial ad displayed');
    });
    AppLovinMAX.addInterstitialAdFailedToDisplayEventListener((adInfo) => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      setStatusText('Interstitial ad failed to display');
    });
    AppLovinMAX.addInterstitialHiddenEventListener((adInfo) => {
      setInterstitialAdLoadState(adLoadState.notLoaded);
      setStatusText('Interstitial ad hidden');
    });
    AppLovinMAX.addInterstitialAdRevenuePaidListener((adInfo) => {
      setStatusText('Interstitial ad revenue paid: ' + adInfo.revenue);
    });

    // Rewarded Ad Listeners
    AppLovinMAX.addRewardedAdLoadedEventListener((adInfo) => {
      setRewardedAdLoadState(adLoadState.loaded);

      // Rewarded ad is ready to be shown. AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID) will now return 'true'
      setStatusText('Rewarded ad loaded from ' + adInfo.networkName);

      // Reset retry attempt
      setRewardedAdRetryAttempt(0);
    });
    AppLovinMAX.addRewardedAdLoadFailedEventListener((errorInfo) => {
      setRewardedAdLoadState(adLoadState.notLoaded);

      // Rewarded ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
      setRewardedAdRetryAttempt(rewardedAdRetryAttempt + 1);

      let retryDelay = Math.pow(2, Math.min(6, rewardedAdRetryAttempt));
      setStatusText('Rewarded ad failed to load with code ' + errorInfo.code + ' - retrying in ' + retryDelay + 's');

      setTimeout(() => {
        AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
      }, retryDelay * 1000);
    });
    AppLovinMAX.addRewardedAdClickedEventListener((adInfo) => {
      setStatusText('Rewarded ad clicked');
    });
    AppLovinMAX.addRewardedAdDisplayedEventListener((adInfo) => {
      setStatusText('Rewarded ad displayed');
    });
    AppLovinMAX.addRewardedAdFailedToDisplayEventListener((adInfo) => {
      setRewardedAdLoadState(adLoadState.notLoaded);
      setStatusText('Rewarded ad failed to display');
    });
    AppLovinMAX.addRewardedAdHiddenEventListener((adInfo) => {
      setRewardedAdLoadState(adLoadState.notLoaded);
      setStatusText('Rewarded ad hidden');
    });
    AppLovinMAX.addRewardedAdReceivedRewardEventListener((adInfo) => {
      setStatusText('Rewarded ad granted reward');
    });
    AppLovinMAX.addRewardedAdRevenuePaidListener((adInfo) => {
      setStatusText('Rewarded ad revenue paid: ' + adInfo.revenue);
    });

    // Banner Ad Listeners
    AppLovinMAX.addBannerAdLoadedEventListener((adInfo) => {
      setStatusText('Banner ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addBannerAdLoadFailedEventListener((errorInfo) => {
      setStatusText('Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
    });
    AppLovinMAX.addBannerAdClickedEventListener((adInfo) => {
      setStatusText('Banner ad clicked');
    });
    AppLovinMAX.addBannerAdExpandedEventListener((adInfo) => {
      setStatusText('Banner ad expanded')
    });
    AppLovinMAX.addBannerAdCollapsedEventListener((adInfo) => {
      setStatusText('Banner ad collapsed')
    });
    AppLovinMAX.addBannerAdRevenuePaidListener((adInfo) => {
      setStatusText('Banner ad revenue paid: ' + adInfo.revenue);
    });

    // MREC Ad Listeners
    AppLovinMAX.addMRecAdLoadedEventListener((adInfo) => {
      setStatusText('MREC ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addMRecAdLoadFailedEventListener((errorInfo) => {
      setStatusText('MREC ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
    });
    AppLovinMAX.addMRecAdClickedEventListener((adInfo) => {
      setStatusText('MREC ad clicked');
    });
    AppLovinMAX.addMRecAdExpandedEventListener((adInfo) => {
      setStatusText('MREC ad expanded')
    });
    AppLovinMAX.addMRecAdCollapsedEventListener((adInfo) => {
      setStatusText('MREC ad collapsed')
    });
    AppLovinMAX.addMRecAdRevenuePaidListener((adInfo) => {
      setStatusText('MREC ad revenue paid: ' + adInfo.revenue);
    });
  }

  const getInterstitialButtonTitle = () => {
    if (interstitialAdLoadState === adLoadState.notLoaded) {
      return 'Load Interstitial';
    } else if (interstitialAdLoadState === adLoadState.loading) {
      return 'Loading...';
    } else {
      return 'Show Interstitial'; // adLoadState.loaded
    }
  }

  const getRewardedButtonTitle = () => {
    if (rewardedAdLoadState === adLoadState.notLoaded) {
      return 'Load Rewarded Ad';
    } else if (rewardedAdLoadState === adLoadState.loading) {
      return 'Loading...';
    } else {
      return 'Show Rewarded Ad'; // adLoadState.loaded
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <AppLogo/>
        <Text style={styles.statusText}>
          {statusText}
        </Text>
        <AppButton
          title="Mediation Debugger"
          enabled={isInitialized}
          onPress={() => {
            AppLovinMAX.showMediationDebugger();
          }}
        />
        <AppButton
          title={getInterstitialButtonTitle()}
          enabled={
            isInitialized && interstitialAdLoadState !== adLoadState.loading
          }
          onPress={() => {
            AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID).then(isInterstitialReady => {
              if (isInterstitialReady) {
                AppLovinMAX.showInterstitial(INTERSTITIAL_AD_UNIT_ID);
              } else {
                setStatusText('Loading interstitial ad...');
                setInterstitialAdLoadState(adLoadState.loading);
                AppLovinMAX.loadInterstitial(INTERSTITIAL_AD_UNIT_ID);
              }
            }).catch(error => {
              setStatusText(error.toString());
            });
          }}
        />
        <AppButton
          title={getRewardedButtonTitle()}
          enabled={isInitialized && rewardedAdLoadState !== adLoadState.loading}
          onPress={() => {
            AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID).then(isRewardedAdReady => {
              if (isRewardedAdReady) {
                AppLovinMAX.showRewardedAd(REWARDED_AD_UNIT_ID);
              } else {
                setStatusText('Loading rewarded ad...');
                setRewardedAdLoadState(adLoadState.loading);
                AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
              }
            }).catch(error => {
              setStatusText(error.toString());
            });
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
          isNativeUIBannerShowing &&
            <AppLovinMAX.AdView adUnitId={BANNER_AD_UNIT_ID}
                                adFormat={AppLovinMAX.AdFormat.BANNER}
                                style={styles.banner}
                                onAdLoaded={(adInfo) => {
                                  setStatusText('Banner ad loaded from ' + adInfo.networkName);
                                }}
                                onAdLoadFailed={(errorInfo) => {
                                  setStatusText('Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                                }}
                                onAdClicked={(adInfo) => {
                                  setStatusText('Banner ad clicked');
                                }}
                                onAdExpanded={(adInfo) => {
                                  setStatusText('Banner ad expanded')
                                }}
                                onAdCollapsed={(adInfo) => {
                                  setStatusText('Banner ad collapsed')
                                }}
                                onAdRevenuePaid={(adInfo) => {
                                  setStatusText('Banner ad revenue paid: ' + adInfo.revenue);
                                }}
            />
        }
        <AppButton
          title={isNativeUIMRecShowing ? 'Hide Native UI MREC' : 'Show Native UI MREC'}
          enabled={isInitialized && !isProgrammaticMRecShowing}
          onPress={() => {
            setIsNativeUIMRecShowing(!isNativeUIMRecShowing);
          }}
        />
        {
          isNativeUIMRecShowing &&
            <AppLovinMAX.AdView adUnitId={MREC_AD_UNIT_ID}
                                adFormat={AppLovinMAX.AdFormat.MREC}
                                style={styles.mrec}
                                onAdLoaded={(adInfo) => {
                                  setStatusText('MREC ad loaded from ' + adInfo.networkName);
                                }}
                                onAdLoadFailed={(errorInfo) => {
                                  setStatusText('MREC ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                                }}
                                onAdClicked={(adInfo) => {
                                  setStatusText('MREC ad clicked');
                                }}
                                onAdExpanded={(adInfo) => {
                                  setStatusText('MREC ad expanded')
                                }}
                                onAdCollapsed={(adInfo) => {
                                  setStatusText('MREC ad collapsed')
                                }}
                                onAdRevenuePaid={(adInfo) => {
                                  setStatusText('MREC ad revenue paid: ' + adInfo.revenue);
                                }}
            />
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
        <AppButton
          title={isNativeAdShowing ? 'Hide Native Ad' : 'Show Native Ad'}
          enabled={isInitialized}
          onPress={() => {
            setIsNativeAdShowing(!isNativeAdShowing);
          }}
        />
        <AppButton
          title={'Load Native Ad'}
          enabled={isInitialized && isNativeAdShowing}
          onPress={() => {
            nativeAdViewRef.current?.loadAd();
          }}
        />
        {
          isNativeAdShowing &&
            <View style={{ position: 'absolute', top: '12%', width: '100%' }}>
              <NativeAdViewExample
                adUnitId={NATIVE_AD_UNIT_ID}
                ref={nativeAdViewRef}
                onStatusText={(text) => {
                  setStatusText(text);
                }}
              />
            </View>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.select({
      ios: Dimensions.get('window').height - 44, // For top safe area
      android: Dimensions.get('window').height,
    }),
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
    // Automatically sized to 50 on phones and 90 on tablets. When adaptiveBannerEnabled is on,
    // sized to AppLovinMAX.getAdaptiveBannerHeightForWidth().
    height: 'auto',
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
