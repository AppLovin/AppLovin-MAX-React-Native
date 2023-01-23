import { NativeModules, requireNativeComponent, UIManager, findNodeHandle, View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

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

const AdView = (props) => {
  const {style, ...otherProps} = props;
  const [isInitialized, setIsInitialized] = useState(false);
  const [dimensions, setDimensions] = useState({});

  useEffect(() => {
    // check that AppLovinMAX has been initialized
    AppLovinMAX.isInitialized().then(result => {
      setIsInitialized(result);
      if (!result) {
        console.warn("ERROR: AppLovinMAX.AdView is mounted before the initialization of the AppLovin MAX React Native module");
      }
    });
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const sizeForBannerFormat = async () => {
      const isTablet = await AppLovinMAX.isTablet();
      const width = isTablet ? 728 : 320;
      let height;
      if (props.adaptiveBannerEnabled) {
        height = await AppLovinMAX.getAdaptiveBannerHeightForWidth(-1);
      } else {
        height = isTablet ? 90 : 50;
      }
      setDimensions({width: (style.width && style.width !== 'auto') ? style.width : width,
                     height: (style.height && style.height !== 'auto') ? style.height : height});
    }

    // Check whether or not app specifies both width and height but not with 'auto'
    const isSizeSpecified = ((style.width && style.width !== 'auto') &&
                             (style.height && style.height !== 'auto'));

    if (!isSizeSpecified) {
      if (props.adFormat === AdFormat.BANNER) {
        sizeForBannerFormat();
      } else {
        setDimensions({width: (style.width && style.width !== 'auto') ? style.width : 300,
                       height: (style.height && style.height !== 'auto') ? style.height : 250});
      }
    }
  }, [isInitialized]);

  // Not initialized
  if (!isInitialized) {
    return null;
  } else {
    const isSizeSpecified = ((style.width && style.width !== 'auto') &&
                             (style.height && style.height !== 'auto'));
    const isDimensionsSet = (Object.keys(dimensions).length > 0);

    // Not sized yet
    if (!(isSizeSpecified || isDimensionsSet)) {
      return null;
    }
  }

  return (
    <AppLovinMAXAdView
      style={{ ...style, ...dimensions}}
      {...otherProps}
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

export default AdView;
