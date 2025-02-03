import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AdView, AdFormat } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, AdViewId } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    adViewId?: AdViewId;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIBannerShowing: boolean;
    isProgrammaticBannerShowing: boolean;
    setIsNativeUIBannerShowing: (showing: boolean) => void;
};

const NativeBannerExample = ({ adUnitId, adViewId, isInitialized, log, isNativeUIBannerShowing, isProgrammaticBannerShowing, setIsNativeUIBannerShowing }: Props) => {
    return (
        <>
            <AppButton
                title={isNativeUIBannerShowing ? 'Hide Native UI Banner' : 'Show Native UI Banner'}
                enabled={isInitialized && !isProgrammaticBannerShowing}
                onPress={() => {
                    setIsNativeUIBannerShowing(!isNativeUIBannerShowing);
                }}
            />
            {isNativeUIBannerShowing && (
                <AdView
                    adUnitId={adUnitId}
                    adViewId={adViewId}
                    adFormat={AdFormat.BANNER}
                    style={styles.banner}
                    onAdLoaded={(adInfo: AdInfo) => {
                        log('Banner ad ( ' + adInfo.adViewId + ' ) loaded from ' + adInfo.networkName);
                    }}
                    onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                        log('Banner ad ( ' + errorInfo.adViewId + ' ) failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                    }}
                    onAdClicked={(adInfo: AdInfo) => {
                        log('Banner ad ( ' + adInfo.adViewId + ' ) clicked');
                    }}
                    onAdExpanded={(adInfo: AdInfo) => {
                        log('Banner ad ( ' + adInfo.adViewId + ' ) expanded');
                    }}
                    onAdCollapsed={(adInfo: AdInfo) => {
                        log('Banner ad ( ' + adInfo.adViewId + ' ) collapsed');
                    }}
                    onAdRevenuePaid={(adInfo: AdInfo) => {
                        log('Banner ad ( ' + adInfo.adViewId + ' ) revenue paid: ' + adInfo.revenue);
                    }}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
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
        }),
    },
});

export default NativeBannerExample;
