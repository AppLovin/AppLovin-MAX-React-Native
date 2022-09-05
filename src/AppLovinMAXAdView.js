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

/**
 * Returns AdView when AppLovinMax has been initialized or returns a black empty View as 
 * a placeholder of AdView when AppLovinMax has not been initialized.  
 *
 * The purpose of this AdView wrapper is for the application not to access AdView 
 * before the completion of the AppLovinMax initialization. 
 *
 * Note: this does not re-render itself when the status of the AppLovinMax initialization
 * has changed so that the black view may stay even after the completion of 
 * the AppLovinMax initialization.
 */
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
  const {style, ...otherProps} = props;

  const sizeForAdFormat = () => {
    if (props.adFormat === AdFormat.BANNER) {
      let width = AppLovinMAX.isTablet() ? 728 : 320;
      let height;

      if (props.adaptiveBannerEnabled) {
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
      style={[sizeForAdFormat(), style]}
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

// Defiens default values for the props.
AdView.defaultProps = {
  adaptiveBannerEnabled: true,
  autoRefresh: true,
};


// requireNativeComponent automatically resolves 'AppLovinMAXAdView' to 'AppLovinMAXAdViewManager'
const AppLovinMAXAdView = requireNativeComponent("AppLovinMAXAdView", AdView);

export default AdViewWrapper;
