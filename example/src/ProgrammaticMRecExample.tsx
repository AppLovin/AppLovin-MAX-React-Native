import * as React from 'react';
import { useState, useEffect } from 'react';
import { MRecAd, AdViewPosition } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const ProgrammaticMRecExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeUIMRecShowing,
    isProgrammaticMRecShowing,
    setIsProgrammaticMRecShowing,
}: {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIMRecShowing: boolean;
    isProgrammaticMRecShowing: boolean;
    setIsProgrammaticMRecShowing: (showing: boolean) => void;
}) => {
    const [isProgrammaticMRecCreated, setIsProgrammaticMRecCreated] = useState(false);

    useEffect(() => {
        MRecAd.addAdLoadedEventListener((adInfo: AdInfo) => log('MRec ad loaded from ' + adInfo.networkName));
        MRecAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) =>
            log('MRec ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message)
        );
        MRecAd.addAdClickedEventListener(() => log('MRec ad clicked'));
        MRecAd.addAdExpandedEventListener(() => log('MRec ad expanded'));
        MRecAd.addAdCollapsedEventListener(() => log('MRec ad collapsed'));
        MRecAd.addAdRevenuePaidListener((adInfo: AdInfo) => log('MRec ad revenue paid: ' + adInfo.revenue));

        // Cleanup listeners on unmount
        return () => {
            MRecAd.removeAdLoadedEventListener();
            MRecAd.removeAdLoadFailedEventListener();
            MRecAd.removeAdClickedEventListener();
            MRecAd.removeAdExpandedEventListener();
            MRecAd.removeAdCollapsedEventListener();
            MRecAd.removeAdRevenuePaidListener();
        };
    }, [log]);

    const createAndToggleMRec = () => {
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
    };

    return (
        <AppButton
            title={isProgrammaticMRecShowing ? 'Hide Programmatic MREC' : 'Show Programmatic MREC'}
            enabled={isInitialized && !isNativeUIMRecShowing}
            onPress={createAndToggleMRec}
        />
    );
};

export default ProgrammaticMRecExample;
