function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { NativeModules, NativeEventEmitter } from 'react-native';
const {
  AppLovinMAX
} = NativeModules;
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
  DOES_NOT_APPLY: 2
};
const AdViewPosition = {
  TOP_CENTER: 'TopCenter',
  TOP_RIGHT: 'TopRight',
  CENTERED: 'Centered',
  CENTER_LEFT: 'CenterLeft',
  CENTER_RIGHT: 'CenterRight',
  BOTTOM_LEFT: 'BottomLeft',
  BOTTOM_CENTER: 'BottomCenter',
  BOTTOM_RIGHT: 'BottomRight'
};
const emitter = new NativeEventEmitter(AppLovinMAX);
const subscriptions = {};

const addEventListener = (event, handler) => {
  let subscription = emitter.addListener(event, handler);
  subscriptions[event] = subscription;
};

const removeEventListener = event => {
  let subscription = subscriptions[event];
  if (subscription == null) return;
  subscriptions.delete(event);
  delete subscription[event];
};

export default _objectSpread(_objectSpread({}, AppLovinMAX), {}, {
  ConsentDialogState,
  AdViewPosition,
  addEventListener,
  removeEventListener,

  // Use callback to avoid need for attaching listeners at top level on each re-render
  initialize(sdkKey, callback) {
    AppLovinMAX.initialize(VERSION, sdkKey, callback); // Inject VERSION into native code
  },

  // Support for showing ad without placement
  showInterstitial(adUnitId) {
    AppLovinMAX.showInterstitial(adUnitId, '');
  },

  // Support for showing ad without placement
  showRewardedAd(adUnitId) {
    AppLovinMAX.showRewardedAd(adUnitId, '');
  }

});
//# sourceMappingURL=index.js.map