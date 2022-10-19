import React, { forwardRef, useContext, useImperativeHandle, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { NativeModules, requireNativeComponent, UIManager, findNodeHandle, View, StyleSheet } from "react-native";
import { NativeAdViewContext, NativeAdViewProvider } from "./NativeAdViewProvider";
import { TitleView, AdvertiserView, BodyView, CallToActionView, IconView, OptionsView, MediaView } from "./NativeAdComponents";

const { AppLovinMAX } = NativeModules;

// Returns NativeAdView if AppLovinMAX has been initialized, or returns an empty black view if
// AppLovinMAX has not been initialized
const NativeAdViewWrapper = forwardRef((props, ref) => {
  const {style, ...rest} = props;
  return (
    AppLovinMAX.isInitialized() ?
      <NativeAdViewProvider>
        <NativeAdView {...props} ref={ref}/>
      </NativeAdViewProvider>
    :
      <View style={[styles.container, style]} {...rest}>
        {
          console.warn('[AppLovinSdk] [AppLovinMAX] <NativeAdView/> has been mounted before AppLovin initialization')
        } 
      </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'whitesmoke',
    borderWidth: 1,
  },
});

const AppLovinMAXNativeAdView = requireNativeComponent('AppLovinMAXNativeAdView', NativeAdView);

// NativeAdView renders itself multiple times:
// 1. initial render
// 2. update of the nativeAdView context by saveElement, which locates and renders the all child 
//    components including the user's components without nativeAd
// 3. update of the nativeAd context by onNativeAdLoaded, which renders the ad components with nativeAd
const NativeAdView = forwardRef((props, ref) => {

  // context from NativeAdViewProvider
  const {nativeAd, nativeAdView, setNativeAd, setNativeAdView} = useContext(NativeAdViewContext);

  // keep the nativeAdView ref
  const nativeAdViewRef = useRef();

  // invoke the native ad loader
  const loadAd = () => {
    if (nativeAdViewRef) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(nativeAdViewRef.current),
        UIManager.getViewManagerConfig("AppLovinMAXNativeAdView").Commands.loadAd,
        undefined
      );
    }
  };

  // expose a list of functions via the provided ref
  useImperativeHandle(ref, () => ({ loadAd }), []);

  // save the DOM element via the ref callback
  const saveElement = useCallback((element) => {
    if (element) {
      nativeAdViewRef.current = element;
      setNativeAdView(element);
    }
  }, [nativeAdViewRef]);

  // callback from the native module to set a loaded ad
  const onAdLoaded = useCallback((event) => {
    setNativeAd(event.nativeEvent);
  }, []);

  return (
    <AppLovinMAXNativeAdView {...props} ref={saveElement} onAdLoaded={onAdLoaded}>
      {props.children}
    </AppLovinMAXNativeAdView>
  );
});

NativeAdView.propTypes = {
  /**
   * A string value representing the ad unit id to load ads for.
   */
  adUnitId: PropTypes.string.isRequired,

  /**
   * A string value representing the placement name that you assign when you integrate each ad format, for granular reporting in ad events.
   */
  placement: PropTypes.string,

  /**
   * A string value representing the customData name that you assign when you integrate each ad format, for granular reporting in ad events.
   */
  customData: PropTypes.string,

  /**
   * A dictionary value representing the extra parameters to set a list of key-value string pairs.
   */
  extraParameters: PropTypes.object,
};

// Add the child ad components
NativeAdViewWrapper.TitleView = TitleView;
NativeAdViewWrapper.AdvertiserView = AdvertiserView;
NativeAdViewWrapper.BodyView = BodyView;
NativeAdViewWrapper.CallToActionView = CallToActionView;
NativeAdViewWrapper.IconView = IconView;
NativeAdViewWrapper.OptionsView = OptionsView;
NativeAdViewWrapper.MediaView = MediaView;

export default NativeAdViewWrapper;
