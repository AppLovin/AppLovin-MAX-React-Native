import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AdView, AdFormat } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from '../../src/index';
import AppButton from './components/AppButton';

const NativeMRecExample = (props: any) => {
    const {
        adUnitId,
        isInitialized,
        log,
        isNativeUIMRecShowing,
        isProgrammaticMRecShowing,
        setIsNativeUIMRecShowing
    } = props;

    return (
        <>
            <AppButton
                title={isNativeUIMRecShowing ? 'Hide Native UI MREC' : 'Show Native UI MREC'}
                enabled={isInitialized && !isProgrammaticMRecShowing}
                onPress={() => {
                    setIsNativeUIMRecShowing(!isNativeUIMRecShowing);
                }}
            />
            {
                isNativeUIMRecShowing &&
                <AdView
                    adUnitId={adUnitId}
                    adFormat={AdFormat.MREC}
                    style={styles.mrec}
                    onAdLoaded={(adInfo: AdInfo) => {
                        log('MREC ad loaded from ' + adInfo.networkName);
                    }}
                    onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                        log('MREC ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
                    }}
                    onAdClicked={(_adInfo: AdInfo) => {
                        log('MREC ad clicked');
                    }}
                    onAdExpanded={(_adInfo: AdInfo) => {
                        log('MREC ad expanded')
                    }}
                    onAdCollapsed={(_adInfo: AdInfo) => {
                        log('MREC ad collapsed')
                    }}
                    onAdRevenuePaid={(adInfo: AdRevenueInfo) => {
                        log('MREC ad revenue paid: ' + adInfo.revenue);
                    }}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    mrec: {
        position: 'absolute',
        width: '100%',
        height: 250,
        bottom: Platform.select({
            ios: 36, // For bottom safe area
            android: 0,
        })
    },
});

export default NativeMRecExample;
