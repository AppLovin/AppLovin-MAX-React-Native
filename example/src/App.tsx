import * as React from 'react';
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import AppLovinMAX, {
    preloadNativeUIComponentAdView,
    destroyNativeUIComponentAdView,
    addNativeUIComponentAdViewAdLoadFailedEventListener,
    removeNativeUIComponentAdViewAdLoadedEventListener,
    addNativeUIComponentAdViewAdLoadedEventListener,
    removeNativeUIComponentAdViewAdLoadFailedEventListener,
    AdFormat,
} from 'react-native-applovin-max';
import type { Configuration, AdInfo, AdLoadFailedInfo, AdViewId } from 'react-native-applovin-max';
import AppLogo from './components/AppLogo';
import AppButton from './components/AppButton';
import InterstitialExample from './InterExample';
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
        default: '',
    });
    const REWARDED_AD_UNIT_ID = Platform.select({
        ios: 'ENTER_IOS_REWARDED_AD_UNIT_ID_HERE',
        android: 'ENTER_ANDROID_REWARDED_AD_UNIT_ID_HERE',
        default: '',
    });
    const BANNER_AD_UNIT_ID = Platform.select({
        ios: 'ENTER_IOS_BANNER_AD_UNIT_ID_HERE',
        android: 'ENTER_ANDROID_BANNER_AD_UNIT_ID_HERE',
        default: '',
    });
    const MREC_AD_UNIT_ID = Platform.select({
        ios: 'ENTER_IOS_MREC_AD_UNIT_ID_HERE',
        android: 'ENTER_ANDROID_MREC_AD_UNIT_ID_HERE',
        default: '',
    });
    const NATIVE_AD_UNIT_ID = Platform.select({
        ios: 'ENTER_IOS_NATIVE_AD_UNIT_ID_HERE',
        android: 'ENTER_ANDROID_NATIVE_AD_UNIT_ID_HERE',
        default: '',
    });

    // App status
    const [isInitialized, setIsInitialized] = useState(false);
    const [isProgrammaticBannerShowing, setIsProgrammaticBannerShowing] = useState(false);
    const [isNativeUIBannerShowing, setIsNativeUIBannerShowing] = useState(false);
    const [isProgrammaticMRecShowing, setIsProgrammaticMRecShowing] = useState(false);
    const [isNativeUIMRecShowing, setIsNativeUIMRecShowing] = useState(false);
    const [isNativeAdShowing, setIsNativeAdShowing] = useState(false);

    // Preloaded native banner and MREC component ads
    const [preloadedBannerId, setPreloadedBannerId] = useState<AdViewId>();
    const [preloadedMRecId, setPreloadedMRecId] = useState<AdViewId>();
    const [preloadedBanner2Id, setPreloadedBanner2Id] = useState<AdViewId>();
    const [preloadedMRec2Id, setPreloadedMRec2Id] = useState<AdViewId>();

    const [statusText, setStatusText] = useState('Initializing SDK...');

    useEffect(() => {
        AppLovinMAX.setTermsAndPrivacyPolicyFlowEnabled(true);
        AppLovinMAX.setPrivacyPolicyUrl('https://your_company_name.com/privacy/'); // mandatory
        AppLovinMAX.setTermsOfServiceUrl('https://your_company_name.com/terms/'); // optional

        AppLovinMAX.initialize(SDK_KEY)
            .then((conf: Configuration) => {
                setIsInitialized(true);
                setStatusText('SDK Initialized in ' + conf.countryCode);
            })
            .catch((error) => {
                setStatusText('Failed to initialize SDK: ' + error);
            });
    }, []);

    // Optionally preload native banner and MREC component ads.  Comment out if preloading isn't needed.
    useEffect(() => {
        if (!isInitialized) return;

        addNativeUIComponentAdViewAdLoadedEventListener((adInfo: AdInfo) => {
            console.log(adInfo.adFormat + ' ad (' + adInfo.adViewId + ') preloaded from ' + adInfo.networkName);
        });
        addNativeUIComponentAdViewAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            console.log('Failed to preload (' + errorInfo.adViewId + ') with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
        });

        preloadNativeUIComponentAdView(BANNER_AD_UNIT_ID, AdFormat.BANNER).then(setPreloadedBannerId);
        preloadNativeUIComponentAdView(MREC_AD_UNIT_ID, AdFormat.MREC).then(setPreloadedMRecId);
        preloadNativeUIComponentAdView(BANNER_AD_UNIT_ID, AdFormat.BANNER).then(setPreloadedBanner2Id);
        preloadNativeUIComponentAdView(MREC_AD_UNIT_ID, AdFormat.MREC).then(setPreloadedMRec2Id);

        return () => {
            removeNativeUIComponentAdViewAdLoadedEventListener();
            removeNativeUIComponentAdViewAdLoadFailedEventListener();
            destroyNativeUIComponentAdView(preloadedBannerId);
            destroyNativeUIComponentAdView(preloadedMRecId);
            destroyNativeUIComponentAdView(preloadedBanner2Id);
            destroyNativeUIComponentAdView(preloadedMRec2Id);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialized]);

    useEffect(() => {
        console.log(statusText);
    }, [statusText]);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <AppLogo />
                <Text numberOfLines={1} style={styles.statusText}>
                    {statusText}
                </Text>
                <AppButton
                    title="Mediation Debugger"
                    enabled={isInitialized}
                    onPress={() => {
                        AppLovinMAX.showMediationDebugger();
                    }}
                />
                <InterstitialExample adUnitId={INTERSTITIAL_AD_UNIT_ID} log={setStatusText} isInitialized={isInitialized} />
                <RewardedExample adUnitId={REWARDED_AD_UNIT_ID} log={setStatusText} isInitialized={isInitialized} />
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
                    adViewId={preloadedBannerId}
                    log={setStatusText}
                    isInitialized={isInitialized}
                    isNativeUIBannerShowing={isNativeUIBannerShowing}
                    isProgrammaticBannerShowing={isProgrammaticBannerShowing}
                    setIsNativeUIBannerShowing={setIsNativeUIBannerShowing}
                />
                <NativeMRecExample
                    adUnitId={MREC_AD_UNIT_ID}
                    adViewId={preloadedMRecId}
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
                    bannerAdViewId={preloadedBannerId}
                    mrecAdViewId={preloadedMRecId}
                    bannerAdView2Id={preloadedBanner2Id}
                    mrecAdView2Id={preloadedMRec2Id}
                    isInitialized={isInitialized}
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
        backgroundColor: 'green',
        padding: 8,
        fontSize: 18,
        textAlign: 'center',
    },
});

export default App;
