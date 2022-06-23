import React, {
  forwardRef,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
} from "react";
import { requireNativeComponent, UIManager, findNodeHandle } from "react-native";
import { NativeAdViewContext, NativeAdViewProvider } from "./NativeAdViewProvider";

export const NativeAdViewWrapper = forwardRef((props, ref) => {
  return (
    <NativeAdViewProvider>
      <NativeAdView {...props} ref={ref}/>
    </NativeAdViewProvider>
  );
});

const NativeAdView = forwardRef((props, ref) => {

  // keep the current ref
  const thisRef = useRef();

  // context setters work here, but values can be seen only inside the children
  const {nativeAd, nativeAdView, setNativeAd, setNativeAdView} = useContext(NativeAdViewContext);

  // invoke the native ad loader
  const loadAd = () => {
    if (!thisRef) {
      console.log('NativeAdView: loadAd: thisRef is null');
    }
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(thisRef.current),
      UIManager.getViewManagerConfig("AppLovinMAXNativeAdView").Commands.loadAd,
      undefined
    );
  };

  // expose functions to outside
  useImperativeHandle(ref, () => ({ loadAd }), []);

  // save ref to this function and the context
  const _saveRef = (ref) => {
    if (ref) {
      thisRef.current = ref;
      setNativeAdView(ref);
    }
  };

  // callback from the native module to set a loaded ad
  const _onNativeAdLoaded = (event) => {
    let ad = event.nativeEvent;
    setNativeAd(ad);
  };

  return (
    <AppLovinMAXNativeAdView {...props} ref={_saveRef} onNativeAdLoaded={_onNativeAdLoaded}>
        {props.children}
    </AppLovinMAXNativeAdView>
  );
});

export const AppLovinMAXNativeAdView = requireNativeComponent('AppLovinMAXNativeAdView');

export default NativeAdViewWrapper;

