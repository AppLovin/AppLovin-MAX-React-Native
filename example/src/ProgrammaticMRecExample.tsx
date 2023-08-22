import React, { useState, useEffect } from 'react';
import AppLovinMAX, { AdViewPosition } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from '../../src/index';
import AppButton from './components/AppButton';

const ProgrammaticMRecExample = (props: any) => {
    const {
        adUnitId,
        isInitialized,
        log,
        isNativeUIMRecShowing,
        isProgrammaticMRecShowing,
        setIsProgrammaticMRecShowing,
    } = props;

    const [isProgrammaticMRecCreated, setIsProgrammaticMRecCreated] = useState(false);

    useEffect(() => {
        setupEventListeners();
    }, []);

    const setupEventListeners = () => {
        AppLovinMAX.addMRecAdLoadedEventListener((adInfo: AdInfo) => {
            log('MRec ad loaded from ' + adInfo.networkName);
        });
        AppLovinMAX.addMRecAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            log('MRec ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
        });
        AppLovinMAX.addMRecAdClickedEventListener((_adInfo: AdInfo) => {
            log('MRec ad clicked');
        });
        AppLovinMAX.addMRecAdExpandedEventListener((_adInfo: AdInfo) => {
            log('MRec ad expanded')
        });
        AppLovinMAX.addMRecAdCollapsedEventListener((_adInfo: AdInfo) => {
            log('MRec ad collapsed')
        });
        AppLovinMAX.addMRecAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('MRec ad revenue paid: ' + adInfo.revenue);
        });
    }

    return (
        <AppButton
            title={isProgrammaticMRecShowing ? 'Hide Programmatic MREC' : 'Show Programmatic MREC'}
            enabled={isInitialized && !isNativeUIMRecShowing}
            onPress={() => {
                if (isProgrammaticMRecShowing) {
                    AppLovinMAX.hideMRec(adUnitId);
                } else {

                    if (!isProgrammaticMRecCreated) {
                        AppLovinMAX.createMRec(adUnitId, AdViewPosition.TOP_CENTER);

                        setIsProgrammaticMRecCreated(true);
                    }

                    AppLovinMAX.showMRec(adUnitId);
                }

                setIsProgrammaticMRecShowing(!isProgrammaticMRecShowing);
            }}
        />
    );
}

export default ProgrammaticMRecExample;
