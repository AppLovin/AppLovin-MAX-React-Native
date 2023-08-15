import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';

import AppLovinMAX from '../../src/index';
import AppLogo from './components/AppLogo';
import AppButton from './components/AppButton';
import InterExample from './InterExample';
import RewardedExample from './RewardedExample';
import ProgrammaticBannerExample from './ProgrammaticBannerExample';
import ProgrammaticMRecExample from './ProgrammaticMRecExample';
import NativeBannerExample from './NativeBannerExample';
import NativeMRecExample from './NativeMRecExample';
import NativeAdViewExample from './NativeAdViewExample';
import ScrolledAdViewExample from './ScrolledAdViewExample';

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
  const [isProgrammaticBannerShowing, setIsProgrammaticBannerShowing] = useState(false);
  const [isNativeUIBannerShowing, setIsNativeUIBannerShowing] = useState(false);
  const [isProgrammaticMRecShowing, setIsProgrammaticMRecShowing] = useState(false);
  const [isNativeUIMRecShowing, setIsNativeUIMRecShowing] = useState(false);
  const [isNativeAdShowing, setIsNativeAdShowing] = useState(false);
  const [statusText, setStatusText] = useState('Initializing SDK...');

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

    // MAX Consent Flow for iOS 14.5+
    if (Platform.OS === 'ios' && parseFloat(Platform.Version) >= 14.5) {
      // Enable the iOS consent flow programmatically - NSUserTrackingUsageDescription must be added to the Info.plist
      AppLovinMAX.setConsentFlowEnabled(true);
      AppLovinMAX.setPrivacyPolicyUrl('https://your_company_name.com/privacy/'); // mandatory
      AppLovinMAX.setTermsOfServiceUrl('https://your_company_name.com/terms/'); // optional
    }

    AppLovinMAX.setTestDeviceAdvertisingIds([]);
    AppLovinMAX.initialize(SDK_KEY).then(configuration => {
      setIsInitialized(true);
      setStatusText('SDK Initialized in ' + configuration?.countryCode);
    }).catch(error => {
      setStatusText(error.toString());
    });
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
        <InterExample
          adUnitId={INTERSTITIAL_AD_UNIT_ID}
          log={setStatusText}
          isInitialized={isInitialized}
        />
        <RewardedExample
          adUnitId={REWARDED_AD_UNIT_ID}
          log={setStatusText}
          isInitialized={isInitialized}
        />
        <ProgrammaticBannerExample
          adUnitId={BANNER_AD_UNIT_ID}
          log={setStatusText}
          isInitialized={isInitialized}
          isNativeUIBannerShowing={isNativeUIBannerShowing}
          isProgrammaticBannerShowing={isProgrammaticBannerShowing}
          setIsProgrammaticBannerShowing={setIsProgrammaticBannerShowing}
        />
        <ProgrammaticMRecExample
          adUnitId={MREC_AD_UNIT_ID}
          log={setStatusText}
          isInitialized={isInitialized}
          isNativeUIMRecShowing={isNativeUIMRecShowing}
          isProgrammaticMRecShowing={isProgrammaticMRecShowing}
          setIsProgrammaticMRecShowing={setIsProgrammaticMRecShowing}
        />
        <NativeBannerExample
          adUnitId={BANNER_AD_UNIT_ID}
          log={setStatusText}
          isInitialized={isInitialized}
          isNativeUIBannerShowing={isNativeUIBannerShowing}
          isProgrammaticBannerShowing={isProgrammaticBannerShowing}
          setIsNativeUIBannerShowing={setIsNativeUIBannerShowing}
        />
        <NativeMRecExample
          adUnitId={MREC_AD_UNIT_ID}
          log={setStatusText}
          isInitialized={isInitialized}
          isNativeUIMRecShowing={isNativeUIMRecShowing}
          isProgrammaticMRecShowing={isProgrammaticMRecShowing}
          setIsNativeUIMRecShowing={setIsNativeUIMRecShowing}
        />
        <NativeAdViewExample
          adUnitId={NATIVE_AD_UNIT_ID}
          isInitialized={isInitialized}
          log={setStatusText}
          isNativeAdShowing={isNativeAdShowing}
          setIsNativeAdShowing={setIsNativeAdShowing}
        />
        <ScrolledAdViewExample
          bannerAdUnitId={BANNER_AD_UNIT_ID}
          mrecAdUnitId={MREC_AD_UNIT_ID}
          isInitialized={isInitialized}
          log={setStatusText}
          isNativeAdShowing={isNativeAdShowing}
        />
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
});

export default App;
