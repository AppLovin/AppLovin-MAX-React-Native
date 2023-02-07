import { NativeModules } from "react-native";

const { AppLovinMAX } = NativeModules;

const {
  BANNER_AD_FORMAT_LABEL,
  MREC_AD_FORMAT_LABEL,
} = AppLovinMAX.getConstants();

/**
 * Defines a format of an ad.
 */
export enum AdFormat {

  /**
   * Banner ad.
   */
  BANNER = BANNER_AD_FORMAT_LABEL,

  /**
   * MRec ad.
   */
  MREC = MREC_AD_FORMAT_LABEL,
}
