import React, { useState, useEffect } from 'react';
import AppLovinMAX, { AdViewPosition } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from '../../src/index';
import AppButton from './components/AppButton';

const ProgrammaticBannerExample = (props: any) => {
    const {
        adUnitId,
        isInitialized,
        log,
        isNativeUIBannerShowing,
        isProgrammaticBannerShowing,
        setIsProgrammaticBannerShowing,
    } = props;

    const [isProgrammaticBannerCreated, setIsProgrammaticBannerCreated] = useState(false);

    useEffect(() => {
        setupEventListeners();
    }, []);

    const setupEventListeners = () => {
        AppLovinMAX.addBannerAdLoadedEventListener((adInfo: AdInfo) => {
            log('Banner ad loaded from ' + adInfo.networkName);
        });
        AppLovinMAX.addBannerAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            log('Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
        });
        AppLovinMAX.addBannerAdClickedEventListener((_adInfo: AdInfo) => {
            log('Banner ad clicked');
        });
        AppLovinMAX.addBannerAdExpandedEventListener((_adInfo: AdInfo) => {
            log('Banner ad expanded')
        });
        AppLovinMAX.addBannerAdCollapsedEventListener((_adInfo: AdInfo) => {
            log('Banner ad collapsed')
        });
        AppLovinMAX.addBannerAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('Banner ad revenue paid: ' + adInfo.revenue);
        });
    }

    return (
        <AppButton
            title={isProgrammaticBannerShowing ? 'Hide Programmatic Banner' : 'Show Programmatic Banner'}
            enabled={isInitialized && !isNativeUIBannerShowing}
            onPress={async () => {
                if (isProgrammaticBannerShowing) {
                    AppLovinMAX.hideBanner(adUnitId);
                } else {
                    if (!isProgrammaticBannerCreated) {
                        AppLovinMAX.createBannerWithOffsets(adUnitId, AdViewPosition.BOTTOM_CENTER, 0, 0);
                        AppLovinMAX.setBannerBackgroundColor(adUnitId, '#000000');

                        setIsProgrammaticBannerCreated(true);
                    }

                    AppLovinMAX.showBanner(adUnitId);
                }

                setIsProgrammaticBannerShowing(!isProgrammaticBannerShowing);
            }}
        />
    );
}

export default ProgrammaticBannerExample;
