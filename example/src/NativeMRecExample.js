import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

const NativeMRecExample = (props) => {
  const { adUnitId } = props;
  const { isInitialized } = props;
  const { log } = props;
  const { isNativeUIMRecShowing } = props;
  const { isProgrammaticMRecShowing } = props;
  const { setIsNativeUIMRecShowing } = props;

  return (
    <>
      <AppButton
        title={isNativeUIMRecShowing ? 'Hide Native UI MREC' : 'Show Native UI MREC'}
        enabled={isInitialized && !isProgrammaticMRecShowing}
        onPress={() => {
          setIsNativeUIMRecShowing(!isNativeUIMRecShowing);
        }}
      />
      {
        isNativeUIMRecShowing &&
          <AppLovinMAX.AdView
            adUnitId={adUnitId}
            adFormat={AppLovinMAX.AdFormat.MREC}
            style={styles.mrec}
            onAdLoaded={(adInfo) => {
              log('MREC ad loaded from ' + adInfo.networkName);
            }}
            onAdLoadFailed={(errorInfo) => {
              log('MREC ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
            }}
            onAdClicked={(_adInfo) => {
              log('MREC ad clicked');
            }}
            onAdExpanded={(_adInfo) => {
              log('MREC ad expanded')
            }}
            onAdCollapsed={(_adInfo) => {
              log('MREC ad collapsed')
            }}
            onAdRevenuePaid={(adInfo) => {
              log('MREC ad revenue paid: ' + adInfo.revenue);
            }}
          />
      }
    </>
  );
}

const styles = StyleSheet.create({
  mrec: {
    position: 'absolute',
    width: '100%',
    height: 250,
    bottom: Platform.select({
      ios: 36, // For bottom safe area
      android: 0,
    })
  },
});

export default NativeMRecExample;
