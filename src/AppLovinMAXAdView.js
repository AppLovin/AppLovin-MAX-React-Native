import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React from "react";
import AppLovinMAX from "./index.js";

class AdView extends React.Component {
  render() {
    let { style, ...otherProps } = this.props;
    return <AppLovinMAXAdView
            // This merges the pub-specified style with ours, but overwrites width/height.
            style={Object.assign({}, style, this.sizeForAdFormat(otherProps.adFormat))}
            {...otherProps} />;
  }
  
  sizeForAdFormat(adFormat) {
      if (adFormat == AppLovinMAX.AdFormat.BANNER) {
          return AppLovinMAX.isTablet() ? {width: 728, height: 90} : {width: 320, height: 50}
      } else {
          return {width: 300, height: 250}
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
};

// requireNativeComponent automatically resolves 'AppLovinMAXAdView' to 'AppLovinMAXAdViewManager'
var AppLovinMAXAdView = requireNativeComponent("AppLovinMAXAdView", AdView);

export default AdView;
