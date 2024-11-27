import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AdView, AdFormat } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo, AdViewId } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    adViewId?: AdViewId;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIMRecShowing: boolean;
    isProgrammaticMRecShowing: boolean;
    setIsNativeUIMRecShowing: (showing: boolean) => void;
};

const NativeMRecExample = ({ adUnitId, adViewId, isInitialized, log, isNativeUIMRecShowing, isProgrammaticMRecShowing, setIsNativeUIMRecShowing }: Props) => {
    return (
        <>
            <AppButton
                title={isNativeUIMRecShowing ? 'Hide Native UI MREC' : 'Show Native UI MREC'}
                enabled={isInitialized && !isProgrammaticMRecShowing}
                onPress={() => {
                    setIsNativeUIMRecShowing(!isNativeUIMRecShowing);
                }}
            />
            {isNativeUIMRecShowing && (
                <AdView
                    adUnitId={adUnitId}
                    adFormat={AdFormat.MREC}
                    adViewId={adViewId}
                    style={styles.mrec}
                    onAdLoaded={(adInfo: AdInfo) => {
                        log('MREC ad ( ' + adInfo.adViewId + ' ) loaded from ' + adInfo.networkName);
                    }}
                    onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                        log('MREC ad ( ' + errorInfo.adViewId + ' ) failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                    }}
                    onAdClicked={(adInfo: AdInfo) => {
                        log('MREC ad ( ' + adInfo.adViewId + ' ) clicked');
                    }}
                    onAdExpanded={(adInfo: AdInfo) => {
                        log('MREC ad ( ' + adInfo.adViewId + ' ) expanded');
                    }}
                    onAdCollapsed={(adInfo: AdInfo) => {
                        log('MREC ad ( ' + adInfo.adViewId + ' ) collapsed');
                    }}
                    onAdRevenuePaid={(adInfo: AdRevenueInfo) => {
                        log('MREC ad ( ' + adInfo.adViewId + ' ) revenue paid: ' + adInfo.revenue);
                    }}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    mrec: {
        position: 'absolute',
        width: '100%',
        height: 'auto',
        bottom: Platform.select({
            ios: 36, // For bottom safe area
            android: 0,
        }),
    },
});

export default NativeMRecExample;
