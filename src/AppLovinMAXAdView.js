import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React from "react";

class AdView extends React.Component {
  render() {
    return <AppLovinMAXAdView {...this.props} />;
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
