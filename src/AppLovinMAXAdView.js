import { NativeModules, requireNativeComponent, UIManager, findNodeHandle, View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import React from "react";

const { AppLovinMAX } = NativeModules;

export const AdFormat = {
  BANNER: "banner",
  MREC: "mrec",
};

export const AdViewPosition = {
  TOP_CENTER: "top_center",
  TOP_LEFT: "top_left",
  TOP_RIGHT: "top_right",
  CENTERED: "centered",
  CENTER_LEFT: "center_left",
  CENTER_RIGHT: "center_right",
  BOTTOM_LEFT: "bottom_left",
  BOTTOM_CENTER: "bottom_center",
  BOTTOM_RIGHT: "bottom_right",
};

const AdViewWrapper = (props) => {
  const {style, ...rest} = props;
  return (
    AppLovinMAX.isInitialized() ?
      <AdView {...style} {...rest}/>
    :
      <View style={[styles.container, style]} {...rest}>
        {
          console.warn('[AppLovinSdk] [AppLovinMAX] <AdView/> has been mounted before AppLovin initialization')
        } 
      </View>
  );
};

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

const AdView = (props) => {
  const { adaptiveBannerEnabled, style, ...otherProps } = props;

  // Default value for adaptiveBannerEnabled is true
  const isAdaptiveBannerEnabled = adaptiveBannerEnabled ?? true;

  const sizeForAdFormat = (adFormat) => {
    if (adFormat === AdFormat.BANNER) {

      let width = AppLovinMAX.isTablet() ? 728 : 320;
      let height;

      if (isAdaptiveBannerEnabled) {
        height = AppLovinMAX.getAdaptiveBannerHeightForWidth(-1);
      } else {
        height = AppLovinMAX.isTablet() ? 90 : 50;
      }

      return { width: width, height: height }
    } else {
      return { width: 300, height: 250 }
    }
  };

  return (
    <AppLovinMAXAdView
      style = { [sizeForAdFormat(otherProps.adFormat), style] }
      adaptiveBannerEnabled={isAdaptiveBannerEnabled}
      {...otherProps }
    />
  );
};

AdView.propTypes = {
  /**
   * A string value representing the ad unit id to load ads for.
   */
  adUnitId: PropTypes.string.isRequired,

  /**
   * A string value representing the ad format to load ads for. Should be either `AppLovinMAX.AdFormat.BANNER` or `AppLovinMAX.AdFormat.MREC`.
   */
  adFormat: PropTypes.string.isRequired,

  /**
   * A string value representing the placement name that you assign when you integrate each ad format, for granular reporting in ad events.
   */
  placement: PropTypes.string,

  /**
   * A string value representing the customData name that you assign when you integrate each ad format, for granular reporting in ad events.
   */
  customData: PropTypes.string,

  /**
   * A boolean value representing whether or not to enable adaptive banners. Note that adaptive banners are enabled by default as of v2.3.0.
   */
  adaptiveBannerEnabled: PropTypes.bool,

  /**
   * A boolean value representing whether or not to enable auto-refresh. Note that auto-refresh is enabled by default.
   */
  autoRefresh: PropTypes.bool,
};

// requireNativeComponent automatically resolves 'AppLovinMAXAdView' to 'AppLovinMAXAdViewManager'
const AppLovinMAXAdView = requireNativeComponent("AppLovinMAXAdView", AdView);

export default AdViewWrapper;
