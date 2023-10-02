import React, { useState, useEffect } from 'react';
import { MRecAd, AdViewPosition } from '../../src/index';
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
        MRecAd.addAdLoadedEventListener((adInfo: AdInfo) => {
            log('MRec ad loaded from ' + adInfo.networkName);
        });
        MRecAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) => {
            log('MRec ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
        });
        MRecAd.addAdClickedEventListener((_adInfo: AdInfo) => {
            log('MRec ad clicked');
        });
        MRecAd.addAdExpandedEventListener((_adInfo: AdInfo) => {
            log('MRec ad expanded')
        });
        MRecAd.addAdCollapsedEventListener((_adInfo: AdInfo) => {
            log('MRec ad collapsed')
        });
        MRecAd.addAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('MRec ad revenue paid: ' + adInfo.revenue);
        });
    }

    return (
        <AppButton
            title={isProgrammaticMRecShowing ? 'Hide Programmatic MREC' : 'Show Programmatic MREC'}
            enabled={isInitialized && !isNativeUIMRecShowing}
            onPress={() => {
                if (isProgrammaticMRecShowing) {
                    MRecAd.hide(adUnitId);
                } else {

                    if (!isProgrammaticMRecCreated) {
                        MRecAd.create(adUnitId, AdViewPosition.TOP_CENTER);

                        setIsProgrammaticMRecCreated(true);
                    }

                    MRecAd.show(adUnitId);
                }

                setIsProgrammaticMRecShowing(!isProgrammaticMRecShowing);
            }}
        />
    );
}

export default ProgrammaticMRecExample;
