import React, {forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppLovinMAX from '../../src/index';

export const NativeAdViewExample = forwardRef((props, ref) => {
  const { adUnitId } = props;

  return (
    <AppLovinMAX.NativeAdView adUnitId={adUnitId}
                              placement='myplacement'
                              customData='mycustomdata'
                              extraParameters={{
                                'key1': 'value1',
                                'key2': 'value2',
                              }}
                              ref={ref}
                              style={styles.nativead}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <AppLovinMAX.NativeAdView.IconView style={styles.icon}/>
          <View style={{flexDirection: 'column', flexGrow: 1}}>
            <AppLovinMAX.NativeAdView.TitleView style={styles.title}/>
            <View style={{flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 20}}>
              <AppLovinMAX.NativeAdView.AdvertiserView style={styles.advertiser}/>
              <Text style={styles.admark}>AD</Text>
            </View>
          </View>
        </View>
        <AppLovinMAX.NativeAdView.BodyView style={styles.body}/>
        <AppLovinMAX.NativeAdView.MediaView style={styles.mediaView}/>
        <AppLovinMAX.NativeAdView.CallToActionView style={styles.callToAction}/>
      </View>
    </AppLovinMAX.NativeAdView>
  );
});

const styles = StyleSheet.create({
  nativead: {
    width: '100%',
    height: 250,
    backgroundColor: '#12343b',
  },
  title: {
    height: 30,
    textAlignVertical: 'center', // android only
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    alignItems: 'center',
    color: 'white',
    backgroundColor: '#12343b',
  },
  icon: {
    margin: 5,
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: 'lime',
  },
  admark: {
    height: 15,
    width: 20,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  advertiser: {
    height: 15,
    marginRight: 10,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  body: {
    height: 'auto',
    fontSize: 14,
    backgroundColor: '#e1b382',
  },
  mediaView: {
    flexGrow: 1, 
    height: 'auto',
    width: '100%',
    backgroundColor: 'black',
  },
  callToAction: {
    width: '100%',
    height: 30,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlignVertical: 'center', // android only
    color: 'white',
    backgroundColor: '#2d545e',
  },
});

export default NativeAdViewExample;
