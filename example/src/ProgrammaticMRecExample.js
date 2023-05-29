import React, { useState, useEffect } from 'react';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

const ProgrammaticMRecExample = (props) => {
  const { adUnitId } = props;
  const { isInitialized } = props;
  const { log } = props;
  const { isNativeUIMRecShowing } = props;
  const { isProgrammaticMRecShowing } = props;
  const { setIsProgrammaticMRecShowing } = props;

  const [isProgrammaticMRecCreated, setIsProgrammaticMRecCreated] = useState(false);

  useEffect(() => {
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    AppLovinMAX.addMRecAdLoadedEventListener((adInfo) => {
      log('MREC ad loaded from ' + adInfo.networkName);
    });
    AppLovinMAX.addMRecAdLoadFailedEventListener((errorInfo) => {
      log('MREC ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
    });
    AppLovinMAX.addMRecAdClickedEventListener((_adInfo) => {
      log('MREC ad clicked');
    });
    AppLovinMAX.addMRecAdExpandedEventListener((_adInfo) => {
      log('MREC ad expanded')
    });
    AppLovinMAX.addMRecAdCollapsedEventListener((_adInfo) => {
      log('MREC ad collapsed')
    });
    AppLovinMAX.addMRecAdRevenuePaidListener((adInfo) => {
      log('MREC ad revenue paid: ' + adInfo.revenue);
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
            AppLovinMAX.createMRec(
              adUnitId,
              AppLovinMAX.AdViewPosition.TOP_CENTER
            );

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
