import React, { forwardRef, useContext, useImperativeHandle, useRef, useCallback } from "react";
import { NativeModules, requireNativeComponent, UIManager, findNodeHandle, View, StyleSheet } from "react-native";
import { NativeAdViewContext, NativeAdViewProvider } from "./NativeAdViewProvider";
import { TitleView, AdvertiserView, BodyView, CallToActionView, IconView, OptionsView, MediaView } from "./NativeAdComponents";

const { AppLovinMAX } = NativeModules;

export const NativeAdViewWrapper = forwardRef((props, ref) => {
  const {style, ...rest} = props;
  return (
    AppLovinMAX.isInitialized() ?
      <NativeAdViewProvider>
        <NativeAdView {...style} {...rest} ref={ref}/>
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

// Adds the child ad components
NativeAdViewWrapper.TitleView = TitleView;
NativeAdViewWrapper.AdvertiserView = AdvertiserView;
NativeAdViewWrapper.BodyView = BodyView;
NativeAdViewWrapper.CallToActionView = CallToActionView;
NativeAdViewWrapper.IconView = IconView;
NativeAdViewWrapper.OptionsView = OptionsView;
NativeAdViewWrapper.MediaView = MediaView;

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
  const onNativeAdLoaded = (event) => {
    const ad = event.nativeEvent;
    //console.log("AppLovinMAX: NativeAd: nativeAd=" + JSON.stringify(ad));
    setNativeAd(ad);
  };

  return (
    <AppLovinMAXNativeAdView {...props} ref={saveElement} onNativeAdLoaded={onNativeAdLoaded}>
      {props.children}
    </AppLovinMAXNativeAdView>
  );
});

export const AppLovinMAXNativeAdView = requireNativeComponent('AppLovinMAXNativeAdView');

export default NativeAdViewWrapper;

