## Versions

## 2.3.1
    * Fix NPE in `positionAdView()`.
## 2.3.0
    * Enable adaptive banners by default.
    * Add support for native ad placements. Docs can be found [here](https://dash.applovin.com/documentation/mediation/react-native/getting-started/advanced-settings#banners-/-mrecs-(native-ui-component-method)).
    * Fix thread warning with native component AdViews.
## 2.2.0
    * Allow for multiple native `AppLovinMAX.AdView`s at once on a screen (e.g. a banner and a mrec).
## 2.1.3
    * Add support for latest SDKs v10.3.1 with new callbacks.
## 2.1.2
    * Fix banners and MRECs native UI components not clicking if not styled by parent dom.
## 2.1.1
    * Fix iOS projects not building.
## 2.1.0
    * Add API for passing in `errorInfo` for ad load failure callbacks with parameters "code", "message", and "adLoadFailureInfo".
    * Add API for passing in `errorInfo` for ad display failure callbacks with parameters "code" and "message".
    * Add API for creating and updating banner X and Y offsets. For example, to offset banner 50px from a bottom center position: `AppLovinMAX.createBannerWithOffsets(adUnitId, AppLovinMAX.AdViewPosition.BOTTOM_CENTER, 0, 50);`.
## 2.0.6
    * Add support for latest SDKs v10.3.0 with new callbacks.
## 2.0.5
    * Fallback to SDK key in Android Manifest and Info.plist if not passed programmatically.
    * Add support for setting banner width.
## 2.0.4
    * Pass `"countryCode"` in initialization callback.
## 2.0.3
    * Fix ad callbacks not returning.
## 2.0.2
    * Remove `getAdInfo(adUnitId)` API in lieu of ad callbacks.
    * Return more data in ad callbacks in addition to `ad.adUnitId` (e.g. `adInfo.creativeId`, `adInfo.networkName`, `adInfo.placement`, `adInfo.revenue`).
## 2.0.1
    * Ensure exported iOS methods are invoked on the main queue.
## 2.0.0
    * Initial support for MAX consent flow. Please see our documentation for instructions on enabling it.
    * Add `AppLovinMAX.setCreativeDebuggerEnabled()` API to enable the creative debugger button.
    * Revert from using the hardcoded SDK value of 10.1.1 to using +.
    * Fix MRec ad expanded event not working on Android.
## 1.1.10
    * Hardcode Android SDK version to 10.1.1.
## 1.1.9
    * Fix React Native version not being passed through to native SDKs.
## 1.1.8
    * Remove need to define Android product flavors in `build.gradle`.
## 1.1.7
    * Fix Android native UI banners rendering issues when mounting / unmounting.
    * Add support for setting test device(s) using the advertising identifier (GAID / IDFA) printed in the initialization logs.
## 1.1.6
    * Attempt fix for `loadInterstitial()` or `loadRewardedAd()` due to current Activity being null.
## 1.1.5
    * Fix `removeEventListener()` not working by explicitly calling `remove()`.
## 1.1.4
    * Fix Android banners not working for fast refreshes.
    * FIx iOS module's podspec pointing to invalid tag.
## 1.1.3
    * Ensure values such as user id is set before initializing SDK.
    * Add workaround for `getCurrentActivity()` returning `null`.
## 1.1.2
    * Fix `ConsentDialogState.UNKNOWN` being returned for `getConsentDialogState()` on iOS.
## 1.1.1
    * Fix `AppLovinMAX.removeEventListener()` crash.
## 1.1.0
    * Add support for native banner / MREC UI components via `<AppLovinMAX.AdView adUnitId={...} adFormat={...} />`.
## 1.0.0
    * Initial release with support for interstitials, rewarded ads, banners, and MRECs.
