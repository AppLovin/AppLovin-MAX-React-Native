import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AdView, AdFormat } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, AdViewId } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const NativeMRecExample = ({
    adUnitId,
    adViewId,
    isInitialized,
    log,
    isNativeUIMRecShowing,
    isProgrammaticMRecShowing,
    setIsNativeUIMRecShowing,
}: {
    adUnitId: string;
    adViewId?: AdViewId;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIMRecShowing: boolean;
    isProgrammaticMRecShowing: boolean;
    setIsNativeUIMRecShowing: (showing: boolean) => void;
}) => {
    return (
        <>
            <AppButton
                title={isNativeUIMRecShowing ? 'Hide Native UI MREC' : 'Show Native UI MREC'}
                enabled={isInitialized && !isProgrammaticMRecShowing}
                onPress={() => setIsNativeUIMRecShowing(!isNativeUIMRecShowing)}
            />
            {isNativeUIMRecShowing && (
                <View style={styles.container}>
                    <AdView
                        adUnitId={adUnitId}
                        adFormat={AdFormat.MREC}
                        adViewId={adViewId}
                        style={styles.mrec}
                        onAdLoaded={(adInfo: AdInfo) => {
                            log('MREC ad (' + adInfo.adViewId + ') loaded from ' + adInfo.networkName);
                        }}
                        onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                            log('MREC ad (' + errorInfo.adViewId + ') failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                        }}
                        onAdClicked={(adInfo: AdInfo) => {
                            log('MREC ad (' + adInfo.adViewId + ') clicked');
                        }}
                        onAdExpanded={(adInfo: AdInfo) => {
                            log('MREC ad (' + adInfo.adViewId + ') expanded');
                        }}
                        onAdCollapsed={(adInfo: AdInfo) => {
                            log('MREC ad (' + adInfo.adViewId + ') collapsed');
                        }}
                        onAdRevenuePaid={(adInfo: AdInfo) => {
                            log('MREC ad (' + adInfo.adViewId + ') revenue paid: ' + adInfo.revenue);
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
            ios: 36, // Adjust for bottom safe area on iOS
            android: 0,
        }),
    },
    mrec: {
        alignSelf: 'center',
    },
});

export default NativeMRecExample;
