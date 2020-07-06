import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import AppLogo from './components/AppLogo';
import AppButton from './components/AppButton';

// import {
//   Appodeal,
//   AppodealAdType,
//   AppodealLogLevel,
// } from 'react-native-appodeal';

import AppLovinMAX from 'react-native-applovin-max';

// Suyash
// import Interstitials from '../AppLovin/Interstitials';
// import { NativeModules, NativeEventEmitter } from 'react-native';

var adLoadState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED',
};

const App = () => {
  // Create constants
  const SDK_KEY = 'ENTER_MAX_SDK_KEY_HERE';

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
  const [interstitialAdLoadState, setInterstitialAdLoadState] = useState(
    adLoadState.notLoaded,
  );
  const [rewardedAdLoadState, setRewardedAdLoadState] = useState(
    adLoadState.notLoaded,
  );
  const [isBannerShowing, setIsBannerShowing] = useState(false);

  // MaxSdkCallbacks.OnSdkInitializedEvent += sdkConfiguration => {
  //   // AppLovin SDK is initialized, configure and start loading ads.
  //   Debug.Log('MAX SDK Initialized');

  //   InitializeInterstitialAds();
  //   InitializeRewardedAds();
  //   InitializeBannerAds();
  //   InitializeMRecAds();
  // };

  // AppLovinMAX.initialize(SDK_KEY, )

  // Set ad auto caching enabled or disabled
  // By default autocache is enabled for all ad types
  // Call this method before or after initilisation
  // Appodeal.setAutoCache(AppodealAdType.INTERSTITIAL, false);
  // // Set testing mode
  // // Call this method before initilisation
  // Appodeal.setTesting(bool);
  // // Set Appodeal SDK logging level
  // // Call this method before initilisation
  // Appodeal.setLogLevel(AppodealLogLevel.DEBUG);
  // // Enable or disable child direct threatment
  // // Call this method before initilisation
  // Appodeal.setChildDirectedTreatment(false);
  // // Disable network:
  // // Call this method before initilisation
  // Appodeal.disableNetwork('some_network');
  // // Disable network for specific ad type:
  // // Call this method before initilisation
  // Appodeal.disableNetwork('some_network ', AppodealAdType.INTERSTITIAL);
  // // Enable or disable triggering show for precache ads
  // // Call this method before or after initilisation
  // Appodeal.setOnLoadedTriggerBoth(true);
  // // Disable location permission
  // // Call this method before initilisation
  // Appodeal.disableLocationPermissionCheck();

  // const adTypes =
  //   AppodealAdType.INTERSTITIAL |
  //   AppodealAdType.REWARDED_VIDEO |
  //   AppodealAdType.BANNER;
  // const consent = true;

  // Appodeal.initialize('Your app key', adTypes, consent);

  //   import {
  //     Appodeal,
  //     AppodealBannerEvent
  // } from 'react-native-appodeal';

  // Appodeal.addEventListener(AppodealBannerEvent.LOADED, (event: any) =>
  //     console.log("Banner loaded. Height: ", event.height + ", precache: " + event.isPrecache)
  // )
  // Appodeal.addEventListener(AppodealBannerEvent.SHOWN, () =>
  //     console.log("Banner shown")
  // )
  // Appodeal.addEventListener(AppodealBannerEvent.EXPIRED, () =>
  //     console.log("Banner expired")
  // )
  // Appodeal.addEventListener(AppodealBannerEvent.CLICKED, () =>
  //     console.log("Banner clicked")
  // )
  // Appodeal.addEventListener(AppodealBannerEvent.FAILED_TO_LOAD, () =>
  //     console.log("Banner failed to load")
  // )

  // import {
  //   Appodeal,
  //   AppodealInterstitialEvent
  // } from 'react-native-appodeal';

  // Appodeal.addEventListener(AppodealInterstitialEvent.LOADED, (event: any) =>
  //   console.log("Interstitial loaded. Precache: ", event.isPrecache)
  // )
  // Appodeal.addEventListener(AppodealInterstitialEvent.SHOWN, () => {
  //   console.log("Interstitial shown")
  // })
  // Appodeal.addEventListener(AppodealInterstitialEvent.EXPIRED, () =>
  //   console.log("Interstitial expired")
  // )
  // Appodeal.addEventListener(AppodealInterstitialEvent.CLICKED, () =>
  //   console.log("Interstitial clicked")
  // )
  // Appodeal.addEventListener(AppodealInterstitialEvent.CLOSED, () =>
  //   console.log("Interstitial closed")
  // )
  // Appodeal.addEventListener(AppodealInterstitialEvent.FAILED_TO_LOAD, () =>
  //   console.log("Interstitial failed to load")
  // )
  // Appodeal.addEventListener(AppodealInterstitialEvent.FAILED_TO_SHOW, () =>
  //   console.log("Interstitial failed to show")
  // )

  // import {
  //   Appodeal,
  //   AppodealRewardedEvent
  // } from 'react-native-appodeal';

  // Appodeal.addEventListener(AppodealRewardedEvent.LOADED, (event: any) =>
  //   console.log("Rewarded video loaded. Precache: ", event.isPrecache)
  // )
  // Appodeal.addEventListener(AppodealRewardedEvent.SHOWN, () =>
  //   console.log("Rewarded video shown")
  // )
  // Appodeal.addEventListener(AppodealRewardedEvent.EXPIRED, () =>
  //   console.log("Rewarded video expired")
  // )
  // Appodeal.addEventListener(AppodealRewardedEvent.REWARD, (event: any) =>
  //   console.log("Rewarded video finished. Amount: ", event.amount + ", currency: " + event.currency)
  // )
  // Appodeal.addEventListener(AppodealRewardedEvent.CLOSED, (event: any) =>
  //   console.log("Rewarded video closed: ", event.isFinished)
  // )
  // Appodeal.addEventListener(AppodealRewardedEvent.FAILED_TO_LOAD, () =>
  //   console.log("Rewarded video failed to load")
  // )
  // Appodeal.addEventListener(AppodealRewardedEvent.FAILED_TO_SHOW, () =>
  //   console.log("Rewarded video failed to show")
  // )

  /*
      IronSourceRewardedVideo.addEventListener('rewardedVideoInitializationFailed',
      () => {
        console.log('rewardedVideoInitializationFailed event');
        this.setState({rewardedVideoState: 'error'})
      });

    IronSourceRewardedVideo.addEventListener('rewardedVideoAvailabilityStatus',
      (hasAvailableVideo) => {
        console.log('rewardedVideoAvailabilityStatus ----', hasAvailableVideo);
        if (hasAvailableVideo) {
          this.setState({rewardedVideoState: 'ready'})
        }
      });
  */

  // RCT_EXPORT_METHOD exposes methods to JS
/*
 in JS we can call
 
 import { NativeModules } from 'react-native';
 var AppLovinMAX = NativeModules.AppLovinMAX;
 AppLovinMAX.sampleMethod(
 'Birthday Party',
 '4',
 new function() {
 
 } // realy
 );
 */

/*
 
 CalendarManager.addEvent('Birthday Party', {
 location: '4 Privet Drive, Surrey',
 time: date.getTime(),
 description: '...'
 });
 dictionary of events paramt^
 */
// NOTE: The name of the method exported to JavaScript is the native method's name up to the first colon
// `RCT_REMAP_METHOD` is available for mapping if too many methods conflict if same name up to first colon

  // AppLovinMAX.initialize("", "");
  setTimeout(function() {
    setIsInitialized(true);
  }, 2000);

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
          AppLovinMAX.showMediationDebugger();
        }}
      />
      <AppButton
        title={getInterstitialButtonTitle()}
        enabled={
          isInitialized && interstitialAdLoadState !== adLoadState.loading
        }
        onPress={() => {
          if (interstitialAdLoadState === adLoadState.loaded) {
            // AppLovinMAX.showInterstitialAd();
          } else {
            setInterstitialAdLoadState(adLoadState.loading);
            // AppLovinMAX.loadInterstitialAd();
          }
        }}
      />
      <AppButton
        title={getRewardedButtonTitle()}
        enabled={isInitialized && rewardedAdLoadState !== adLoadState.loading}
        onPress={() => {
          if (rewardedAdLoadState === adLoadState.loaded) {
            // AppLovinMAX.showRewardedAd();
          } else {
            setRewardedAdLoadState(adLoadState.loading);
            // AppLovinMAX.loadInterstitialAd();
          }
        }}
      />
      <AppButton
        title={isBannerShowing ? 'Hide Banner' : 'Load and Show Banner Ad'}
        enabled={isInitialized}
        onPress={() => {
          if (isBannerShowing) {
            // AppLovinMAX.hideBanner();
          } else {
            // Banners are automatically sized to 320x50 on phones and 728x90 on tablets.
            // You may use the utility method `MaxSdkUtils.isTablet()` to help with view sizing adjustments.
            // AppLovinMAX.createBanner(BannerAdUnitId, MaxSdkBase.BannerPosition.TopCenter,);
            // Set background or background color for banners to be fully functional.
            // AppLovinMAX.setBannerBackgroundColor(BannerAdUnitId, Color.black);
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
    backgroundColor: 'green',
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default App;
