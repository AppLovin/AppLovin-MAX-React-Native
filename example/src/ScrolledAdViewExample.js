import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import AppLovinMAX from '../../src/index';
import AppButton from './components/AppButton';

const ScrolledAdViewExample = (props) => {
  const { bannerAdUnitId } = props;
  const { mrecAdUnitId } = props;
  const { isInitialized } = props;
  const { isNativeAdShowing } = props;

  const [enableAd, setEnableAd] = useState(true);
  const [isScrollViewShowing, setIsScrollViewShowing] = useState(false);

  return (
    <>
      <AppButton
        title={isScrollViewShowing ? 'Hide Scrolled AdViews' : 'Show Scrolled AdViews'}
        enabled={isInitialized && !isNativeAdShowing}
        onPress={() => {
          setIsScrollViewShowing(!isScrollViewShowing);
        }}
      />
      {
        isScrollViewShowing &&
          <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
              <AppButton
                title={'CLOSE'}
                enabled={true}
                onPress={() => {
                  setIsScrollViewShowing(false);
                }}
              />
              <AppButton
                title={enableAd ? "DISABLE ADS" : "ENABLE ADS"}
                enabled={true}
                onPress={() => {
                  setEnableAd(!enableAd);
                }}
              />
              {[...Array(4)].map((_, i)=> 
                (<View key={i}>
                   <Text style={styles.text} key={i+'-1'}>
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                     minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                     aliquip ex ea commodo consequat. Duis aute irure dolor in
                     reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                     pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                     culpa qui officia deserunt mollit anim id est laborum.
                   </Text>

                   {
                     isInitialized ?
                       enableAd ?
                         (i % 2 == 0) ? <AppLovinMAX.AdView
                                          adUnitId={bannerAdUnitId}
                                          adFormat={AppLovinMAX.AdFormat.BANNER}
                                          style={styles.adview}
                                          key={i+'-2'}
                                        />
                         :
                                        <AppLovinMAX.AdView
                                          adUnitId={mrecAdUnitId}
                                          adFormat={AppLovinMAX.AdFormat.MREC}
                                          style={styles.adview}
                                          key={i+'-2'}
                                        />
                       :
                       <Text style={styles.placeholder} key={i+'-2'}>AD PLACEHOLDER</Text>
                     :
                     <Text style={styles.placeholder} key={i+'-2'}>AD PLACEHOLDER</Text>
                   }

                   <Text style={styles.text} key={i+'-3'}>
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                     minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                     aliquip ex ea commodo consequat. Duis aute irure dolor in
                     reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                     pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                     culpa qui officia deserunt mollit anim id est laborum.
                   </Text>
                 </View>)
              )}
            </ScrollView>
            {
              isInitialized ?
                enableAd ? <AppLovinMAX.AdView
                             adUnitId={bannerAdUnitId}
                             adFormat={AppLovinMAX.AdFormat.BANNER}
                             style={styles.adviewBottom}
                           />
                :
                <Text style={styles.placeholder}>AD PLACEHOLDER</Text>
              :
              <Text style={styles.placeholder}>AD PLACEHOLDER</Text>
            }
          </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: Platform.select({
      ios: Dimensions.get('window').height - 36 - 50,
      android: Dimensions.get('window').height,
    }),
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  scrollView: {
    backgroundColor: 'pink',
  },
  text: {
    margin: 10,
    fontSize: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#008cba',
    elevation: 8,
    borderRadius: 10,
    marginTop: 5,
    marginHorizontal: 40,
  },
  adview: {
    width: '100%',
    height: 'auto',
  },
  adviewBottom: {
    width: '100%',
    height: 'auto',
  },
  placeholder: {
    marginTop: 10,
    backgroundColor: 'lightblue',
    fontSize: 40,
    textAlign: 'center',
    height: 50,
  },
});

export default ScrolledAdViewExample;
