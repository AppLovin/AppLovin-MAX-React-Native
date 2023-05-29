import React, { useState, useEffect } from 'react';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

const ProgrammaticBannerExample = (props) => {
  const { adUnitId } = props;
  const { isInitialized } = props;
  const { log } = props;
  const { isNativeUIBannerShowing } = props;
  const { isProgrammaticBannerShowing } = props;
  const { setIsProgrammaticBannerShowing } = props;

  const [isProgrammaticBannerCreated, setIsProgrammaticBannerCreated] = useState(false);

  useEffect(() => {
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    AppLovinMAX.addBannerAdLoadedEventListener((adInfo) => {
      log('Banner ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addBannerAdLoadFailedEventListener((errorInfo) => {
      log('Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
    });
    AppLovinMAX.addBannerAdClickedEventListener((_adInfo) => {
      log('Banner ad clicked');
    });
    AppLovinMAX.addBannerAdExpandedEventListener((_adInfo) => {
      log('Banner ad expanded')
    });
    AppLovinMAX.addBannerAdCollapsedEventListener((_adInfo) => {
      log('Banner ad collapsed')
    });
    AppLovinMAX.addBannerAdRevenuePaidListener((adInfo) => {
      log('Banner ad revenue paid: ' + adInfo.revenue);
    });
  }

  return (
    <AppButton
      title={isProgrammaticBannerShowing ? 'Hide Programmatic Banner' : 'Show Programmatic Banner'}
      enabled={isInitialized && !isNativeUIBannerShowing}
      onPress={() => {
        if (isProgrammaticBannerShowing) {
          AppLovinMAX.hideBanner(adUnitId);
        } else {
          if (!isProgrammaticBannerCreated) {

            //
            // Programmatic banner creation - banners are automatically sized to 320x50 on phones
            // and 728x90 on tablets
            //
            AppLovinMAX.createBannerWithOffsets(
              adUnitId,
              AppLovinMAX.AdViewPosition.BOTTOM_CENTER, 0, 50
            );

            // Set background color for banners to be fully functional In this case we are setting
            // it to black - PLEASE USE HEX STRINGS ONLY
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
