import React, { useState, useEffect } from 'react';
import { MRecAd, AdViewPosition } from '../../src/index';
import type { AdInfo, AdLoadFailedInfo, AdRevenueInfo } from '../../src/index';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIMRecShowing: boolean;
    isProgrammaticMRecShowing: boolean;
    setIsProgrammaticMRecShowing: (showing: boolean) => void;
};

const ProgrammaticMRecExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeUIMRecShowing,
    isProgrammaticMRecShowing,
    setIsProgrammaticMRecShowing,
}: Props) => {
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
        MRecAd.addAdClickedEventListener((/* adInfo: AdInfo */) => {
            log('MRec ad clicked');
        });
        MRecAd.addAdExpandedEventListener((/* adInfo: AdInfo */) => {
            log('MRec ad expanded');
        });
        MRecAd.addAdCollapsedEventListener((/* adInfo: AdInfo */) => {
            log('MRec ad collapsed');
        });
        MRecAd.addAdRevenuePaidListener((adInfo: AdRevenueInfo) => {
            log('MRec ad revenue paid: ' + adInfo.revenue);
        });
    };

    return (
        <AppButton
            title={isProgrammaticMRecShowing ? 'Hide Programmatic MREC' : 'Show Programmatic MREC'}
            enabled={isInitialized && !isNativeUIMRecShowing}
            onPress={() => {
                if (isProgrammaticMRecShowing) {
                    MRecAd.hideAd(adUnitId);
                } else {
                    if (!isProgrammaticMRecCreated) {
                        MRecAd.createAd(adUnitId, AdViewPosition.TOP_CENTER);

                        setIsProgrammaticMRecCreated(true);
                    }

                    MRecAd.showAd(adUnitId);
                }

                setIsProgrammaticMRecShowing(!isProgrammaticMRecShowing);
            }}
        />
    );
};

export default ProgrammaticMRecExample;
