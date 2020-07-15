import { NativeModules, NativeEventEmitter } from 'react-native';

const { AppLovinMAX } = NativeModules;

const VERSION = '1.0.0';

/**
 * This enum represents whether or not the consent dialog should be shown for this user.
 * The state where no such determination could be made is represented by `Unknown`.
 */
const ConsentDialogState = {
  /**
   * The consent dialog state could not be determined. This is likely due to SDK failing to initialize.
   */
  UNKNOWN: 0,

  /**
   * This user should be shown a consent dialog.
   */
  APPLIES: 1,

  /**
   * This user should not be shown a consent dialog.
   */
  DOES_NOT_APPLY: 2,
};

const AdViewPosition = {
  TOP_CENTER: 'TopCenter',
  TOP_RIGHT: 'TopRight',
  CENTERED: 'Centered',
  CENTER_LEFT: 'CenterLeft',
  CENTER_RIGHT: 'CenterRight',
  BOTTOM_LEFT: 'BottomLeft',
  BOTTOM_CENTER: 'BottomCenter',
  BOTTOM_RIGHT: 'BottomRight',
};

const emitter = new NativeEventEmitter(AppLovinMAX);
const subscriptions = {};

const addEventListener = (event, handler) => {
  let subscription = emitter.addListener(event, handler);
  subscriptions[event] = subscription;
};

const removeEventListener = (event) => {
  let subscription = subscriptions[event];
  if (subscription == null) return;

  subscriptions.delete(event);
  delete subscription[event];
};

export default {
  ...AppLovinMAX,
  ConsentDialogState,
  AdViewPosition,
  addEventListener,
  removeEventListener,
  initialize(sdkKey, callback) {
    // Use callback to avoid need for attaching listeners at top level on each re-render
    AppLovinMAX.initialize(VERSION, sdkKey, callback);
  },
  showInterstitial(adUnitId) {
    AppLovinMAX.showInterstitial(adUnitId, '');
  },
  showRewardedAd(adUnitId) {
    AppLovinMAX.showRewardedAd(adUnitId, '');
  },
};
