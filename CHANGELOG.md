## Versions

## x.x.x
    * Depend on Android SDK 11.6.0 and iOS SDK 11.6.0.
    * Fix banner and MREC native UI components unmounting when fullscreen ad is displayed. 
## 4.1.0
    * Depend on Android SDK 11.5.5 and iOS SDK 11.5.5.
    * Add support for App Open ads.
    * Fix NPE for accessing the MAX components before the SDK initialization.
    * Fix media view not sizing correctly when the React Native view is initially not sized when native ad is loaded.
    * Fix NPE for accessing the unmounted child views in the native ad.
    * Fix not emitting an `"OnBannerAdLoadFailedEvent"` or `"OnMRecAdLoadFailedEvent"` event for native UI component banners and MRECs.
    * Allow data passing APIs to be invoked before plugin initialization.
## 4.0.0
    * Add support for native ads - [docs](https://dash.applovin.com/documentation/mediation/react-native/ad-formats/native-manual).
    * Depend on Android SDK 11.5.3 and iOS SDK 11.5.3.
## 3.3.1
    * Depend on Android SDK 11.5.1 and iOS SDK 11.5.1.
    * Update Android Gradle plugin to v3.5.4 to be compatible with <queries> element in manifest files.
## 3.3.0
    * Add autorefresh support for banner and MREC native UI components: `<AppLovinMAX.AdView autoRefresh={true/false} .../>`
    * Add API for setting SDK extra parameters via `AppLovinMAX.setExtraParameter(<key>, <value>)`.
    * Fix crash of accessing banner and MREC native UI components before AppLovin initialization by showing black views.
    * Fix `java.lang.ClassCastException` in Android when ad is loaded due to processing `ad.waterfall` object.
    * Fix not being able to show subsequent fullscreen ads if app is re-launched from app icon while in middle of an ad.
## 3.2.2
    * Depend on Android SDK 11.4.4 and iOS SDK 11.4.3.
## 3.2.1
    * Add support for getting DSP name if the ad is served by AppLovin Exchange via `ad.dspName`.
## 3.2.0
    * Depend on Android SDK 11.4.3 and iOS SDK 11.4.2.
    * Add support for custom data.
    * Add support for impression-level user revenue api.
    * Add support for waterfall info API.
    * Add support for setting user segment via `AppLovinMAX.userSegment.name`.
## 3.1.0
    * Add support for data passing.
    * Add API for Android to provide a built-in consent flow that sets the user consent flag.
## 3.0.2
    * Depend on Android SDK 11.3.2 and iOS SDK 11.3.2.
## 3.0.1
    * Depend on Android SDK 11.3.1 and iOS SDK 11.3.1.
    * Fix safe area blocked if y offset used. (https://github.com/AppLovin/AppLovin-MAX-React-Native/issues/59)
## 3.0.0
    * Depend on Android SDK 11.3.0 and iOS SDK 11.3.0.
## 2.5.3
    * Add API to set Terms of Service URL for iOS' MAX consent flow.
## 2.5.2
    * Depend on Android SDK 10.3.5 and iOS SDK 10.3.7.
## 2.5.1
    * Stop auto-refresh for native AdViews that have been removed from screen on Android. 
## 2.5.0
    * Update APIs for showing interstitials and rewarded ads. To show _without_ a placement, use `AppLovinMAX.showInterstitial(<Ad Unit ID>)` and `AppLovinMAX.showRewardedAd(<Ad Unit ID>)`. To show _with_ a placement, use `AppLovinMAX.showInterstitialWithPlacement(<Ad Unit ID>, <Placement>)` and `AppLovinMAX.showRewardedAdWithPlacement(<Ad Unit ID>, <Placement>)`.  
## 2.4.2
    * Fix placements not being passed correctly. 
## 2.4.1
    * Remove test code on iOS using hard-coded credentials.
## 2.4.0
    * Allow loading of multiple native UI AdView with same Ad Unit IDs.
## 2.3.2
    * Fix `ClassCastException` related to Android native AdViews.
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
