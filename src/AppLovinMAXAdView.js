import { requireNativeComponent, UIManager, findNodeHandle } from "react-native";
import PropTypes from "prop-types";
import React from "react";
import AppLovinMAX from "./index.js";

class AdView extends React.Component {

  static defaultProps = {
    adaptiveBannerEnabled: true
  }

  componentDidMount() {
    this.setAdUnitId(this.props.adUnitId);
    this.setAdFormat(this.props.adFormat);
    this.setPlacement(this.props.placement);
    this.setCustomData(this.props.customData);
    this.setAdaptiveBannerEnabled(this.props.adaptiveBannerEnabled);
  }

  componentDidUpdate(prevProps) {
    // Only call setters for actual changes.
    if (prevProps.adUnitId !== this.props.adUnitId) {
      this.setAdUnitId(this.props.adUnitId);
    }

    if (prevProps.adFormat !== this.props.adFormat) {
      this.setAdFormat(this.props.adFormat);
    }

    if (prevProps.placement !== this.props.placement) {
      this.setPlacement(this.props.placement);
    }

    if (prevProps.customData !== this.props.customData) {
      this.setCustomData(this.props.customData);
    }

    if (prevProps.adaptiveBannerEnabled !== this.props.adaptiveBannerEnabled) {
      this.setAdaptiveBannerEnabled(this.props.adaptiveBannerEnabled);
    }
  }

  render() {
    let { style, ...otherProps } = this.props;

    return <AppLovinMAXAdView
      // This merges the pub-specified style with ours, but overwrites width/height.
    style = { Object.assign({}, style, this.sizeForAdFormat(otherProps.adFormat)) } {...otherProps }
    />;
  }

  // Helper Functions

  sizeForAdFormat(adFormat) {
    if (adFormat === AppLovinMAX.AdFormat.BANNER) {

      var width = AppLovinMAX.isTablet() ? 728 : 320;
      var height;

      if (this.props.adaptiveBannerEnabled) {
        height = AppLovinMAX.getAdaptiveBannerHeightForWidth(-1);
      } else {
        height = AppLovinMAX.isTablet() ? 90 : 50;
      }

      return { width: width, height: height }
    } else {
      return { width: 300, height: 250 }
    }
  }

  setAdUnitId(adUnitId) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      Platform.OS === 'android' ? "setAdUnitId" : UIManager.getViewManagerConfig("AppLovinMAXAdView").Commands.setAdUnitId,
      [adUnitId]
    );
  }

  setAdFormat(adFormatStr) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      Platform.OS === 'android' ? "setAdFormat" : UIManager.getViewManagerConfig("AppLovinMAXAdView").Commands.setAdFormat,
      [adFormatStr]
    );
  }

  setPlacement(placement) {
    var adUnitId = this.props.adUnitId;
    var adFormat = this.props.adFormat;

    // If the ad unit id or ad format are unset, we can't set the placement.
    if (adUnitId == null || adFormat == null) return;

    UIManager.dispatchViewManagerCommand(
        findNodeHandle(this),
        Platform.OS === 'android' ? "setPlacement" : UIManager.getViewManagerConfig("AppLovinMAXAdView").Commands.setPlacement,
        [placement]
    );
  }

  setCustomData(customData) {
    var adUnitId = this.props.adUnitId;
    var adFormat = this.props.adFormat;

    // If the ad unit id or ad format are unset, we can't set the customData.
    if (adUnitId == null || adFormat == null) return;

    UIManager.dispatchViewManagerCommand(
        findNodeHandle(this),
        Platform.OS === 'android' ? "setCustomData" : UIManager.getViewManagerConfig("AppLovinMAXAdView").Commands.setCustomData,
        [customData]
    );
  }

  setAdaptiveBannerEnabled(enabled) {
    var adUnitId = this.props.adUnitId;
    var adFormat = this.props.adFormat;

    // If the ad unit id or ad format are unset, we can't set the value
    if (adUnitId == null || adFormat == null) return;

    if (adFormat === AppLovinMAX.AdFormat.BANNER) {
      if (enabled === true || enabled === false) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this),
            Platform.OS === 'android' ? "setAdaptiveBannerEnabled" : UIManager.getViewManagerConfig("AppLovinMAXAdView").Commands.setAdaptiveBannerEnabled,
            [enabled ? "true" : "false"]
        );
      }
    }
  }
}

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
};

// requireNativeComponent automatically resolves 'AppLovinMAXAdView' to 'AppLovinMAXAdViewManager'
var AppLovinMAXAdView = requireNativeComponent("AppLovinMAXAdView", AdView);

export default AdView;
