import * as React from 'react';
import { useState, useEffect } from 'react';
import { MRecAd, AdViewPosition } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

type Props = {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIMRecShowing: boolean;
    isProgrammaticMRecShowing: boolean;
    setIsProgrammaticMRecShowing: (showing: boolean) => void;
};

const ProgrammaticMRecExample = ({ adUnitId, isInitialized, log, isNativeUIMRecShowing, isProgrammaticMRecShowing, setIsProgrammaticMRecShowing }: Props) => {
    const [isProgrammaticMRecCreated, setIsProgrammaticMRecCreated] = useState(false);

    useEffect(() => {
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
        MRecAd.addAdRevenuePaidListener((adInfo: AdInfo) => {
            log('MRec ad revenue paid: ' + adInfo.revenue);
        });
    }, [log]);

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
