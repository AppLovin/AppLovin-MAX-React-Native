import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NativeModules, requireNativeComponent, UIManager, findNodeHandle } from "react-native";
import { NativeAdViewContext, NativeAdViewProvider } from "./NativeAdViewProvider";
import { TitleView, AdvertiserView, BodyView, CallToActionView, IconView, OptionsView, MediaView } from "./NativeAdComponents";

const { AppLovinMAX } = NativeModules;

const NativeAdViewWrapper = forwardRef((props, ref) => {
  return (
    <NativeAdViewProvider>
      <NativeAdView {...props} ref={ref}/>
    </NativeAdViewProvider>
  );
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
  const saveElement = (element) => {
    if (element) {
      nativeAdViewRef.current = element;
      setNativeAdView(element);
    }
  };

  const onAdLoadedEvent = (event) => {
    setNativeAd(event.nativeEvent.nativeAd);
    if (props.onAdLoaded) props.onAdLoaded(event.nativeEvent.adInfo);
  };

  const onAdLoadFailedEvent = (event) => {
    if (props.onAdLoadFailed) props.onAdLoadFailed(event.nativeEvent);
  };

  const onAdClickedEvent = (event) => {
    if (props.onAdClicked) props.onAdClicked(event.nativeEvent);
  };

  const onAdRevenuePaidEvent = (event) => {
    if (props.onAdRevenuePaid) props.onAdRevenuePaid(event.nativeEvent);
  };

  return (
    <AppLovinMAXNativeAdView
      ref={saveElement}
      onAdLoadedEvent={onAdLoadedEvent}
      onAdLoadFailedEvent={onAdLoadFailedEvent}
      onAdClickedEvent={onAdClickedEvent}
      onAdRevenuePaidEvent={onAdRevenuePaidEvent}
      {...props}
    >
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

  /**
   * A callback fuction to be fired when a new ad has been loaded.
   */
  onAdLoaded: PropTypes.func,

  /**
   * A callback fuction to be fired when an ad could not be retrieved.
   */
  onAdLoadFailed: PropTypes.func,

  /**
   * A callback fuction to be fired when ad is clicked.
   */
  onAdClicked: PropTypes.func,

  /**
   * A callback fuction to be fired when the revenue event is detected.
   */
  onAdRevenuePaid: PropTypes.func,
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
