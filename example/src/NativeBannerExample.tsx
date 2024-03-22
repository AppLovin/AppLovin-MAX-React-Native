import * as React from 'react';
import { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AdView, AdFormat } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from '../../src/index';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIBannerShowing: boolean;
    isProgrammaticBannerShowing: boolean;
    setIsNativeUIBannerShowing: (showing: boolean) => void;
};

const NativeBannerExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeUIBannerShowing,
    isProgrammaticBannerShowing,
    setIsNativeUIBannerShowing,
}: Props) => {
    const [bannerSize, setBannerSize] = useState({});

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
                    adFormat={AdFormat.BANNER}
                    style={{ ...styles.banner, ...bannerSize }}
                    onAdLoaded={(adInfo: AdInfo) => {
                        log('Banner ad loaded from ' + adInfo.networkName);
                        setBannerSize({ width: adInfo.size.width, height: adInfo.size.height });
                    }}
                    onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
                        log(
                            'Banner ad failed to load with error code ' +
                                errorInfo.code +
                                ' and message: ' +
                                errorInfo.message
                        );
                    }}
                    onAdClicked={
                        (/* adInfo: AdInfo */) => {
                            log('Banner ad clicked');
                        }
                    }
                    onAdExpanded={
                        (/* adInfo: AdInfo */) => {
                            log('Banner ad expanded');
                        }
                    }
                    onAdCollapsed={
                        (/* adInfo: AdInfo */) => {
                            log('Banner ad collapsed');
                        }
                    }
                    onAdRevenuePaid={(adInfo: AdRevenueInfo) => {
                        log('Banner ad revenue paid: ' + adInfo.revenue);
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
        alignSelf: 'center',
        // Automatically sized to 50 on phones and 90 on tablets. When adaptiveBannerEnabled is on,
        // sized to AppLovinMAX.getAdaptiveBannerHeightForWidth().
        width: 'auto',
        height: 'auto',
        bottom: Platform.select({
            ios: 36, // For bottom safe area
            android: 0,
        }),
    },
});

export default NativeBannerExample;
