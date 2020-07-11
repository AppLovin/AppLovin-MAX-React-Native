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
  initialize(sdkKey) {
    AppLovinMAX.initialize(VERSION, sdkKey);
  },
  showInterstitial(adUnitId) {
    AppLovinMAX.showInterstitial(adUnitId, '');
  },
  showRewardedAd(adUnitId) {
    AppLovinMAX.showRewardedAd(adUnitId, '');
  },
};

// // const eventMap = {
// //     adLoaded: 'interstitialAdLoaded',
// //     adFailedToLoad: 'interstitialAdFailedToLoad',
// //     adOpened: 'interstitialAdOpened',
// //     adClosed: 'interstitialAdClosed',
// //     adLeftApplication: 'interstitialAdLeftApplication',
// //   };

// // //   const addEventListener = (event, handler) => {
// // //     const mappedEvent = eventMap[event];
// // //     if (mappedEvent) {
// // //       let listener;
// // //       if (event === 'adFailedToLoad') {
// // //         listener = eventEmitter.addListener(mappedEvent, (error) =>
// // //           handler(createErrorFromErrorData(error))
// // //         );
// // //       } else {
// // //         listener = eventEmitter.addListener(mappedEvent, handler);
// // //       }
// // //       _subscriptions.set(handler, listener);
// // //       return {
// // //         remove: () => removeEventListener(event, handler),
// // //       };
// // //     } else {
// // //       // eslint-disable-next-line no-console
// // //       console.warn(`Trying to subscribe to unknown event: "${event}"`);
// // //       return {
// // //         remove: () => {},
// // //       };
// // //     }
// // //   };
