## Versions

## 5.7.2
* Fix a warning of `key` in the local extra parameter not enclosing in brackets.
## 5.7.1
* Fix Anrdoid build issue.
## 5.7.0
* Depend on Android SDK 11.11.3 and iOS SDK 11.11.3.
* Add support for retrieving the `errorInfo.mediatedNetworkErrorCode` and `errorInfo.mediatedNetworkErrorMessage` for ad load and ad display failures. For more info, check out our docs here: https://dash.applovin.com/documentation/mediation/react-native/getting-started/errorcodes#error-object.
* Fix `java.lang.IllegalStateException` when rendering native ads. (https://github.com/AppLovin/AppLovin-MAX-React-Native/issues/238)
## 5.6.1
* Add support for local extra parameters API with non-String values for the programmatical methods.
## 5.6.0
* Depend on Android SDK 11.11.2 and iOS SDK 11.11.2.
## 5.5.3
* Add support for local extra parameters API with non-String values.
## 5.5.2
* Fix NPE in NativeAdView when it's closed before shown. (https://github.com/AppLovin/AppLovin-MAX-React-Native/issues/224)
## 5.5.1
* Depend on Android SDK 11.10.1 and iOS SDK 11.10.1.
## 5.5.0
* Depend on Android SDK 11.10.0 and iOS SDK 11.10.0.
## 5.4.0
* Add support for Google native ads on Android, starting with adapter version v22.1.0.1 and up.
* Fix InMobi media view not showing due to lack of sizing.
## 5.3.0
* Remove the default media view aspect ratio of `1.0` when a mediated network does not provide it.
* Fix LINE media view not showing.
* Fix IconView not being displayed when setting it up with an empty DOM node.
## 5.2.3
* Fix banner/MREC crashes related to previous release.
* Fix privacy states potentially not setting if called without an active `Activity`.
## 5.2.2
* Fix NPE when loading banners/MRECs.
## 5.2.1
* Increase the `minSdk` required to build the project's build script (e.g. `./gradlew build`) from 16 to 21.
## 5.2.0
* Depend on Android SDK 11.9.0 and iOS SDK 11.9.0.
* Add support for Star Ratings in native ads through `AppLovinMAX.NativeAdView.StarRatingView` and `adInfo.nativeAd.starRating` accessible via `onAdLoaded(adInfo)`.
* Add support for AdMob and Google Ad Manager native ads on iOS.
* Fix NPE in `onLayoutChange()` for accessing a null options/media view of the native ads.
## 5.1.0
* Add back Terms flow.
* Add `title`, `advertiser`, `body`, `callToAction`, `isIconImageAvailable`, `isOptionsViewAvailable`, and `isMediaViewAvailable`  to ad object of native ad UI callbacks.
* Fix a warning of `image source of null` with `AppLovinMAX.NativeAdView.IconView`.
## 5.0.2
* Gracefully handle inter and rewarded ad calls when current `Activity` is null.
## 5.0.1
* Depend on Android SDK 11.8.2 and iOS SDK 11.8.2.
## 5.0.0
* Update synchronous APIs to use the `Promise` pattern.
* Allow API calls even before plugin had finished initialization. Previously, this would result in an error thrown or in older plugins, a no-op.
* Add APIs for retrieving current targeting data values.
* Add APIs for setting local extra parameters.
* Remove kotlin dependency from build.
* Add support for `AppLovinAdView` and `AppLovinNativeAdView` native UI component callbacks.
## 4.1.7
* Fix compilation errors in v4.1.6.
## 4.1.6
* Depend on Android SDK 11.8.0 and iOS SDK 11.8.0.
## 4.1.5
* Depend on Android SDK 11.7.0 and iOS SDK 11.7.0.
* Deprecated `getConsentDialogState()`.
## 4.1.4
* Fix NPE for accessing a null icon in the native ad on Android.
## 4.1.3
* Fix `AppLovinMax.initialize(sdkKey, callback)` firing its callback multiple times on iOS.
## 4.1.2
* Fix native ad UI components unmounting when fullscreen ad is displayed. 
## 4.1.1
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
