import * as React from 'react';
import { useState, useEffect } from 'react';
import { BannerAd, AdViewPosition } from 'react-native-applovin-max';
import type { AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';
import AppButton from './components/AppButton';

const ProgrammaticBannerExample = ({
    adUnitId,
    isInitialized,
    log,
    isNativeUIBannerShowing,
    isProgrammaticBannerShowing,
    setIsProgrammaticBannerShowing,
}: {
    adUnitId: string;
    isInitialized: boolean;
    log: (str: string) => void;
    isNativeUIBannerShowing: boolean;
    isProgrammaticBannerShowing: boolean;
    setIsProgrammaticBannerShowing: (showing: boolean) => void;
}) => {
    const [isProgrammaticBannerCreated, setIsProgrammaticBannerCreated] = useState(false);

    useEffect(() => {
        BannerAd.addAdLoadedEventListener((adInfo: AdInfo) => log('Banner ad loaded from ' + adInfo.networkName));
        BannerAd.addAdLoadFailedEventListener((errorInfo: AdLoadFailedInfo) =>
            log('Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message)
        );
        BannerAd.addAdClickedEventListener(() => log('Banner ad clicked'));
        BannerAd.addAdExpandedEventListener(() => log('Banner ad expanded'));
        BannerAd.addAdCollapsedEventListener(() => log('Banner ad collapsed'));
        BannerAd.addAdRevenuePaidListener((adInfo: AdInfo) => log('Banner ad revenue paid: ' + adInfo.revenue));

        return () => {
            BannerAd.removeAdLoadedEventListener();
            BannerAd.removeAdLoadFailedEventListener();
            BannerAd.removeAdClickedEventListener();
            BannerAd.removeAdExpandedEventListener();
            BannerAd.removeAdCollapsedEventListener();
            BannerAd.removeAdRevenuePaidListener();
        };
    }, [log]);

    const createAndToggleBanner = () => {
        if (isProgrammaticBannerShowing) {
            BannerAd.hideAd(adUnitId);
        } else {
            if (!isProgrammaticBannerCreated) {
                // Create programmatic banner — auto-sized (320x50 for phones, 728x90 for tablets)
                BannerAd.createAd(adUnitId, AdViewPosition.BOTTOM_CENTER, 0, 50);

                // Set banner background color (must be hex string). Using black in this case.
                BannerAd.setBackgroundColor(adUnitId, '#000000');

                setIsProgrammaticBannerCreated(true);
            }

            BannerAd.showAd(adUnitId);
        }

        setIsProgrammaticBannerShowing(!isProgrammaticBannerShowing);
    };

    return (
        <AppButton
            title={isProgrammaticBannerShowing ? 'Hide Programmatic Banner' : 'Show Programmatic Banner'}
            enabled={isInitialized && !isNativeUIBannerShowing}
            onPress={createAndToggleBanner}
        />
    );
};

export default ProgrammaticBannerExample;
