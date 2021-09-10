import { requireNativeComponent, UIManager, findNodeHandle } from "react-native";
import PropTypes from "prop-types";
import React from "react";
import AppLovinMAX from "./index.js";

class AdView extends React.Component {

  componentDidMount() {
    this.setAdUnitId(this.props.adUnitId);
    this.setAdFormat(this.props.adFormat);
    this.setAdPlacement(this.props.adPlacement);
  }

  componentDidUpdate(prevProps) {
    // Only call setters for actual changes.
    if (prevProps.adUnitId !== this.props.adUnitId) {
      this.setAdUnitId(this.props.adUnitId);
    }

    if (prevProps.adFormat !== this.props.adFormat) {
      this.setAdFormat(this.props.adFormat);
    }
    
    if (prevProps.adPlacement !== this.props.adPlacement) {
      this.setAdPlacement(this.props.adPlacement);
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
    if (adFormat == AppLovinMAX.AdFormat.BANNER) {
      return AppLovinMAX.isTablet() ? { width: 728, height: 90 } : { width: 320, height: 50 }
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
  
  setAdPlacement(adPlacement) {
      var adUnitId = this.props.adUnitId;
      var adFormat = this.props.adFormat;
      
      // If the ad unit id or ad format are unset, we can't set the placement.
      if (adUnitId === null || adFormat === null) return;
      
      if (adFormat === AppLovinMAX.AdFormat.BANNER) {
        AppLovinMAX.setBannerPlacement(adUnitId, adPlacement);
      } else if (adFormat === AppLovinMAX.AdFormat.MREC) {
        AppLovinMAX.setMRecPlacement(adUnitId, adPlacement);
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
  adPlacement: PropTypes.string,
};

// requireNativeComponent automatically resolves 'AppLovinMAXAdView' to 'AppLovinMAXAdViewManager'
var AppLovinMAXAdView = requireNativeComponent("AppLovinMAXAdView", AdView);

export default AdView;
