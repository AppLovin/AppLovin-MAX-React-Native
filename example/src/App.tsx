import * as React from 'react';
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import AppLovinMAX, {
    ConsentFlowUserGeography,
    AppTrackingStatus,
    preloadNativeUIComponentAdView,
    destroyNativeUIComponentAdView,
    addNativeUIComponentAdViewAdLoadFailedEventListener,
    removeNativeUIComponentAdViewAdLoadedEventListener,
    addNativeUIComponentAdViewAdLoadedEventListener,
    removeNativeUIComponentAdViewAdLoadFailedEventListener,
    AdFormat,
} from 'react-native-applovin-max';
import type { Configuration, AdInfo, AdLoadFailedInfo, NativeUIComponentAdViewOptions, AdViewId } from 'react-native-applovin-max';
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

    // Create states
    const [isInitialized, setIsInitialized] = useState(false);
    const [isProgrammaticBannerShowing, setIsProgrammaticBannerShowing] = useState(false);
    const [isNativeUIBannerShowing, setIsNativeUIBannerShowing] = useState(false);
    const [isProgrammaticMRecShowing, setIsProgrammaticMRecShowing] = useState(false);
    const [isNativeUIMRecShowing, setIsNativeUIMRecShowing] = useState(false);
    const [isNativeAdShowing, setIsNativeAdShowing] = useState(false);
    const [statusText, setStatusText] = useState('Initializing SDK...');
    const [preloadedBannerId, setPreloadedBannerId] = useState<AdViewId>();
    const [preloadedMRecId, setPreloadedMRecId] = useState<AdViewId>();
    const [preloadedBanner2Id, setPreloadedBanner2Id] = useState<AdViewId>();
    const [preloadedMRec2Id, setPreloadedMRec2Id] = useState<AdViewId>();

    // Run once after mounting
    useEffect(() => {
        // MAX Consent Flow - https://dash.applovin.com/documentation/mediation/react-native/getting-started/terms-and-privacy-policy-flow
        AppLovinMAX.setTermsAndPrivacyPolicyFlowEnabled(true);
        AppLovinMAX.setPrivacyPolicyUrl('https://your_company_name.com/privacy/'); // mandatory
        AppLovinMAX.setTermsOfServiceUrl('https://your_company_name.com/terms/'); // optional

        AppLovinMAX.setTestDeviceAdvertisingIds([]);
        AppLovinMAX.initialize(SDK_KEY)
            .then((conf: Configuration) => {
                setIsInitialized(true);
                setStatusText('SDK Initialized in ' + conf.countryCode);

                console.log('isTestModeEnabled: ' + conf.isTestModeEnabled);

                console.log('consentFlowUserGeography: ' + Object.keys(ConsentFlowUserGeography)[Object.values(ConsentFlowUserGeography).indexOf(conf.consentFlowUserGeography)]);

                // AppTrackingStatus for iOS
                if (conf.appTrackingStatus) {
                    console.log('appTrackingStatus: ' + Object.keys(AppTrackingStatus)[Object.values(AppTrackingStatus).indexOf(conf.appTrackingStatus)]);
                }
            })
            .catch((error) => {
                setStatusText(error.message);
            });
    }, []);

    // Run when statusText has changed
    useEffect(() => {
        console.log(statusText);
    }, [statusText]);

    // Preload AdView for banner and MREC ads
    useEffect(() => {
        if (!isInitialized) return;

        addNativeUIComponentAdViewAdLoadedEventListener((adInfo: AdInfo) => {
            if (adInfo.adUnitId === BANNER_AD_UNIT_ID) {
                console.log('Banner ad ( ' + adInfo.adViewId + ' ) preloaded from ' + adInfo.networkName);
            } else if (adInfo.adUnitId === MREC_AD_UNIT_ID) {
                console.log('MREC ad ( ' + adInfo.adViewId + ' ) preloaded from ' + adInfo.networkName);
            } else {
                console.log('Error: unexpected ad ( ' + adInfo.adViewId + ' ) preloaded for ' + adInfo.adUnitId);
            }
        });

        addNativeUIComponentAdViewAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            if (errorInfo.adUnitId === BANNER_AD_UNIT_ID) {
                console.log('Banner ad ( ' + errorInfo.adViewId + ' ) failed to preload with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
            } else if (errorInfo.adUnitId === MREC_AD_UNIT_ID) {
                console.log('MREC ad ( ' + errorInfo.adViewId + ' ) failed to preload with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
            } else {
                console.log('Error: unexpected ad ( ' + errorInfo.adViewId + ' ) failed to preload for ' + errorInfo.adUnitId);
            }
        });

        preloadNativeUIComponentAdView(BANNER_AD_UNIT_ID, AdFormat.BANNER)
            .then((adViewId: AdViewId) => {
                setPreloadedBannerId(adViewId);
                console.log('Started preloading a banner ad for ' + BANNER_AD_UNIT_ID + ' with ' + adViewId);
            })
            .catch((error) => {
                console.log('Failed to preaload a banner ad: ' + error.message);
            });

        const mrecOptions: NativeUIComponentAdViewOptions = {
            placement: 'placement',
            customData: 'customData',
            extraParameters: { key1: 'value1', key2: 'value2' },
            localExtraParameters: { key1: 1, key2: 'two' },
        };

        preloadNativeUIComponentAdView(MREC_AD_UNIT_ID, AdFormat.MREC, mrecOptions)
            .then((adViewId: AdViewId) => {
                setPreloadedMRecId(adViewId);
                console.log('Started preloading a MREC ad for ' + MREC_AD_UNIT_ID + ' with ' + adViewId);
            })
            .catch((error) => {
                console.log('Failed to preaload a MREC ad: ' + error.message);
            });

        preloadNativeUIComponentAdView(BANNER_AD_UNIT_ID, AdFormat.BANNER)
            .then((adViewId: AdViewId) => {
                setPreloadedBanner2Id(adViewId);
                console.log('Started preloading a banner ad for ' + BANNER_AD_UNIT_ID + ' with ' + adViewId);
            })
            .catch((error) => {
                console.log('Failed to preaload a banner ad: ' + error.message);
            });

        preloadNativeUIComponentAdView(MREC_AD_UNIT_ID, AdFormat.MREC)
            .then((adViewId: AdViewId) => {
                setPreloadedMRec2Id(adViewId);
                console.log('Started preloading a MREC ad for ' + MREC_AD_UNIT_ID + ' with ' + adViewId);
            })
            .catch((error) => {
                console.log('Failed to preaload a MREC ad: ' + error.message);
            });

        return () => {
            removeNativeUIComponentAdViewAdLoadedEventListener();
            removeNativeUIComponentAdViewAdLoadFailedEventListener();

            destroyNativeUIComponentAdView(preloadedBannerId)
                .then(() => {
                    console.log('Destroyed the preloaded banner ad ( ' + preloadedBannerId + ' )');
                })
                .catch((error) => {
                    console.log('Cannot destroy the preloaded banner ad ( ' + preloadedBannerId + ' ): ' + error.message);
                });

            destroyNativeUIComponentAdView(preloadedMRecId)
                .then(() => {
                    console.log('Destroyed the preloaded MREC ad ( ' + preloadedMRecId + ' )');
                })
                .catch((error) => {
                    console.log('Cannot destroy the preloaded MREC ad ( ' + preloadedMRecId + ' ): ' + error.message);
                });

            destroyNativeUIComponentAdView(preloadedBanner2Id)
                .then(() => {
                    console.log('Destroyed the preloaded banner ad ( ' + preloadedBanner2Id + ' )');
                })
                .catch((error) => {
                    console.log('Cannot destroy the preloaded banner ad ( ' + preloadedBanner2Id + ' ): ' + error.message);
                });

            destroyNativeUIComponentAdView(preloadedMRec2Id)
                .then(() => {
                    console.log('Destroyed the preloaded MREC ad ( ' + preloadedMRec2Id + ' )');
                })
                .catch((error) => {
                    console.log('Cannot destroy the preloaded MREC ad ( ' + preloadedMRec2Id + ' ): ' + error.message);
                });
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialized]);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <AppLogo />
                <Text style={styles.statusText}>{statusText}</Text>
                <AppButton
                    title="Mediation Debugger"
                    enabled={isInitialized}
                    onPress={() => {
                        AppLovinMAX.showMediationDebugger();
                    }}
                />
                <InterExample adUnitId={INTERSTITIAL_AD_UNIT_ID} log={setStatusText} isInitialized={isInitialized} />
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
        padding: 10,
        fontSize: 20,
        textAlign: 'center',
    },
});

export default App;
