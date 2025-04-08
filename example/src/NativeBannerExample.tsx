import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AdView, AdFormat } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, AdViewId } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const NativeBannerExample = ({
    adUnitId,
    adViewId,
    isInitialized,
    log,
    isNativeUIBannerShowing,
    isProgrammaticBannerShowing,
    setIsNativeUIBannerShowing,
}: {
    adUnitId: string;
    adViewId?: AdViewId;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIBannerShowing: boolean;
    isProgrammaticBannerShowing: boolean;
    setIsNativeUIBannerShowing: (showing: boolean) => void;
}) => {
    return (
        <>
            <AppButton
                title={isNativeUIBannerShowing ? 'Hide Native UI Banner' : 'Show Native UI Banner'}
                enabled={isInitialized && !isProgrammaticBannerShowing}
                onPress={() => setIsNativeUIBannerShowing(!isNativeUIBannerShowing)}
            />
            {isNativeUIBannerShowing && (
                <View style={styles.container}>
                    <AdView
                        adUnitId={adUnitId}
                        adViewId={adViewId}
                        adFormat={AdFormat.BANNER}
                        style={styles.banner}
                        onAdLoaded={(adInfo: AdInfo) => {
                            log('Banner ad (' + adInfo.adViewId + ') loaded from ' + adInfo.networkName);
                        }}
                        onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                            log('Banner ad (' + errorInfo.adViewId + ') failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                        }}
                        onAdClicked={(adInfo: AdInfo) => {
                            log('Banner ad (' + adInfo.adViewId + ') clicked');
                        }}
                        onAdExpanded={(adInfo: AdInfo) => {
                            log('Banner ad (' + adInfo.adViewId + ') expanded');
                        }}
                        onAdCollapsed={(adInfo: AdInfo) => {
                            log('Banner ad (' + adInfo.adViewId + ') collapsed');
                        }}
                        onAdRevenuePaid={(adInfo: AdInfo) => {
                            log('Banner ad (' + adInfo.adViewId + ') revenue paid: ' + adInfo.revenue);
                        }}
                    />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        bottom: Platform.select({
            ios: 36, // Adjust for iOS safe area
            android: 0,
        }),
        // Set background color to ensure banner visibility on all layouts
        backgroundColor: '#000000',
    },
    banner: {
        alignSelf: 'center',
    },
});

export default NativeBannerExample;
