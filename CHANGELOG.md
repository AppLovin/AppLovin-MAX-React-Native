## Versions

## x.x.x
    * Add `AppLovinMAX.setCreativeDebuggerEnabled()` API to enable the creative debugger button.
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
