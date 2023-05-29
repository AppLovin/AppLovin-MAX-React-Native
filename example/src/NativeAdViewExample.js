import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

export const NativeAdViewExample = (props) => {
  const { adUnitId } = props;
  const { isInitialized } = props;
  const { log } = props;
  const { isNativeAdShowing } = props;
  const { setIsNativeAdShowing } = props;

  const DEFAULT_ASPECT_RATIO = (16/9);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
  const [mediaViewSize, setMediaViewSize] = useState({});
  const [isNativeAdLoaded, setIsNativeAdLoaded] = useState(false);

  const nativeAdViewRef = useRef(null);

  // adjust the size of MediaView when `aspectRatio` changes
  useEffect(() => {
    if (aspectRatio > 1) {
      // landscape 
      setMediaViewSize({aspectRatio: aspectRatio, width: '80%', height: undefined});
    } else {
      // portrait or square
      setMediaViewSize({aspectRatio: aspectRatio, width: undefined, height: 180});
    }
  }, [aspectRatio]);

  const NativeAdView = useCallback(() => {
    return (
      <AppLovinMAX.NativeAdView
        adUnitId={adUnitId}
        placement='myplacement'
        customData='mycustomdata'
        ref={nativeAdViewRef}
        style={styles.nativead}
        onAdLoaded={(adInfo) => {
          setIsNativeAdLoaded(true);
          if (adInfo.nativeAd.mediaContentAspectRatio) {
            setAspectRatio(adInfo.nativeAd.mediaContentAspectRatio);
          } else {
            setAspectRatio(DEFAULT_ASPECT_RATIO);
          }
          log('Native ad loaded from ' + adInfo.networkName);
        }}
        onAdLoadFailed={(errorInfo) => {
          log('Native ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
        }}
        onAdClicked={(_adInfo) => {
          log('Native ad clicked');
        }}
        onAdRevenuePaid={(adInfo) => {
          log('Native ad revenue paid: ' + adInfo.revenue);
        }}
      >
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppLovinMAX.NativeAdView.IconView style={styles.icon}/>
            <View style={{flexDirection: 'column', flexGrow: 1}}>
              <AppLovinMAX.NativeAdView.TitleView style={styles.title}/>
              <AppLovinMAX.NativeAdView.StarRatingView style={styles.starRatingView}/>
              <AppLovinMAX.NativeAdView.AdvertiserView style={styles.advertiser}/>
            </View>
            <AppLovinMAX.NativeAdView.OptionsView style={styles.optionsView}/>
          </View>
          <AppLovinMAX.NativeAdView.BodyView style={styles.body}/>
          <AppLovinMAX.NativeAdView.MediaView style={{...styles.mediaView, ...mediaViewSize}}/>
          <AppLovinMAX.NativeAdView.CallToActionView style={styles.callToAction}/>
        </View>
      </AppLovinMAX.NativeAdView>
    );
  }, []);

  return (
    <>
      <AppButton
        title={isNativeAdShowing ? 'Hide Native Ad' : 'Show Native Ad'}
        enabled={isInitialized}
        onPress={() => {
          setIsNativeAdShowing(!isNativeAdShowing);
        }}
      />
      {
        isNativeAdShowing &&
          <View style={styles.container}>
            <NativeAdView/>
            <AppButton
              title={'RELOAD NATIVE AD'}
              enabled={isNativeAdLoaded}
              onPress={() => {
                setIsNativeAdLoaded(false);
                nativeAdViewRef.current?.loadAd();
              }}
            />
            <AppButton
              title={'CLOSE'}
              enabled={isNativeAdLoaded}
              onPress={() => {
                setIsNativeAdShowing(!isNativeAdShowing);
              }}
            />
          </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#0583aa',
    position: 'absolute',
    top: '15%',
    width: '100%',
    paddingBottom: 10,
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  nativead: {
    margin: 10,
    padding: 10,
    backgroundColor: '#EFEFEF',
  },
  title: {
    fontSize: 16,
    marginTop: 4,
    marginHorizontal: 5,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    margin: 5,
    height: 48,
    aspectRatio: 1,
    borderRadius: 5,
  },
  optionsView: {
    height: 20,
    width: 20,
    backgroundColor: '#EFEFEF',
  },
  starRatingView: {
    marginHorizontal: 5,
    fontSize: 10, // size of each star as unicode symbol
    color: '#ffe234',
    backgroundColor: '#EFEFEF',
  },
  advertiser: {
    marginHorizontal: 5,
    textAlign: 'left',
    fontSize: 12,
    fontWeight: '400',
    color: 'gray',
  },
  body: {
    fontSize: 14,
    marginVertical: 4,
  },
  mediaView: {
    alignSelf: 'center',
    height: 200,
    width: '100%',
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  callToAction: {
    padding: 5,
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'white',
    backgroundColor: '#2d545e',
  },
});

export default NativeAdViewExample;
