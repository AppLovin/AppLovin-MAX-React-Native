//
//  AppLovinMAX.m
//  AppLovin MAX React Native Module
//
//  Created by Thomas So on 7/4/20.
//  Copyright © 2020 AppLovin. All rights reserved.
//

#import "AppLovinMAX.h"

#define ROOT_VIEW_CONTROLLER (UIApplication.sharedApplication.keyWindow.rootViewController)

// Internal
@interface UIColor (ALUtils)
+ (nullable UIColor *)al_colorWithHexString:(NSString *)hexString;
@end

@interface NSNumber (ALUtils)
+ (NSNumber *)al_numberWithString:(NSString *)string;
@end

@interface NSDictionary (ALUtils)
- (BOOL)al_containsValueForKey:(id)key;
@end

@interface NSString (ALUtils)
@property (nonatomic, assign, readonly, getter=al_isValidString) BOOL al_validString;
@end

@interface AppLovinMAX()<MAAdDelegate, MAAdViewAdDelegate, MARewardedAdDelegate>

// Parent Fields
@property (nonatomic,  weak) ALSdk *sdk;
@property (nonatomic, assign, getter=isPluginInitialized) BOOL pluginInitialized;
@property (nonatomic, assign, getter=isSDKInitialized) BOOL sdkInitialized;
@property (nonatomic, strong) ALSdkConfiguration *sdkConfiguration;

// Store these values if pub attempts to set it before initializing
@property (nonatomic,   copy, nullable) NSString *userIdentifierToSet;
@property (nonatomic, strong, nullable) NSArray<NSString *> *testDeviceIdentifiersToSet;
@property (nonatomic, strong, nullable) NSNumber *verboseLoggingToSet;
@property (nonatomic, strong, nullable) NSNumber *creativeDebuggerEnabledToSet;

// Fullscreen Ad Fields
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAInterstitialAd *> *interstitials;
@property (nonatomic, strong) NSMutableDictionary<NSString *, MARewardedAd *> *rewardedAds;

// Banner Fields
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAAdView *> *adViews;
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAAdFormat *> *adViewAdFormats;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSString *> *adViewPositions;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSArray<NSLayoutConstraint *> *> *adViewConstraints;
@property (nonatomic, strong) NSMutableArray<NSString *> *adUnitIdentifiersToShowAfterCreate;
@property (nonatomic, strong) UIView *safeAreaBackground;
@property (nonatomic, strong, nullable) UIColor *publisherBannerBackgroundColor;

@property (nonatomic, strong) NSMutableDictionary<NSString *, MAAd *> *adInfoDict;
@property (nonatomic, strong) NSObject *adInfoDictLock;

// React Native's proposed optimizations to not emit events if no listeners
@property (nonatomic, assign) BOOL hasListeners;

@end

@implementation AppLovinMAX
static NSString *const SDK_TAG = @"AppLovinSdk";
static NSString *const TAG = @"AppLovinMAX";

static AppLovinMAX *AppLovinMAXShared; // Shared instance of this bridge module.

// To export a module named AppLovinMAX ("RCT" automatically removed)
RCT_EXPORT_MODULE()

// `init` requires main queue b/c of UI code
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

+ (AppLovinMAX *)shared
{
    return AppLovinMAXShared;
}

- (instancetype)init
{
    self = [super init];
    if ( self )
    {
        AppLovinMAXShared = self;
        
        self.interstitials = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.rewardedAds = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViews = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewAdFormats = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewPositions = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewConstraints = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adUnitIdentifiersToShowAfterCreate = [NSMutableArray arrayWithCapacity: 2];
        
        self.safeAreaBackground = [[UIView alloc] init];
        self.safeAreaBackground.hidden = YES;
        self.safeAreaBackground.backgroundColor = UIColor.clearColor;
        self.safeAreaBackground.translatesAutoresizingMaskIntoConstraints = NO;
        self.safeAreaBackground.userInteractionEnabled = NO;
        [ROOT_VIEW_CONTROLLER.view addSubview: self.safeAreaBackground];
        
        self.adInfoDict = [NSMutableDictionary dictionary];
        self.adInfoDictLock = [[NSObject alloc] init];
    }
    return self;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isInitialized)
{
    return @([self isPluginInitialized] && [self isSDKInitialized]);
}

RCT_EXPORT_METHOD(initialize:(NSString *)pluginVersion :(NSString *)sdkKey :(RCTResponseSenderBlock)callback)
{
    // Guard against running init logic multiple times
    if ( [self isPluginInitialized] )
    {
        callback(@[@{@"consentDialogState" : @(self.sdk.configuration.consentDialogState)}]);
        return;
    }
    
    self.pluginInitialized = YES;
    
    [self log: @"Initializing AppLovin MAX React Native v%@...", pluginVersion];
    
    // If SDK key passed in is empty, check Info.plist
    if ( ![sdkKey al_isValidString] )
    {
        if ( [[NSBundle mainBundle].infoDictionary al_containsValueForKey: @"AppLovinSdkKey"] )
        {
            sdkKey = [NSBundle mainBundle].infoDictionary[@"AppLovinSdkKey"];
        }
        else
        {
            [NSException raise: NSInternalInconsistencyException
                        format: @"Unable to initialize AppLovin SDK - no SDK key provided and not found in Info.plist!"];
        }
    }
    
    // Initialize SDK
    self.sdk = [ALSdk sharedWithKey: sdkKey];
    [self.sdk setPluginVersion: [@"React-Native-" stringByAppendingString: pluginVersion]];
    [self.sdk setMediationProvider: ALMediationProviderMAX];
    
    // Set user id if needed
    if ( [self.userIdentifierToSet al_isValidString] )
    {
        self.sdk.userIdentifier = self.userIdentifierToSet;
        self.userIdentifierToSet = nil;
    }
    
    // Set test device ids if needed
    if ( self.testDeviceIdentifiersToSet )
    {
        self.sdk.settings.testDeviceAdvertisingIdentifiers = self.testDeviceIdentifiersToSet;
        self.testDeviceIdentifiersToSet = nil;
    }
    
    // Set verbose logging state if needed
    if ( self.verboseLoggingToSet )
    {
        self.sdk.settings.isVerboseLogging = self.verboseLoggingToSet.boolValue;
        self.verboseLoggingToSet = nil;
    }
    
    // Set creative debugger enabled if needed.
    if ( self.creativeDebuggerEnabledToSet )
    {
      self.sdk.settings.creativeDebuggerEnabled = self.creativeDebuggerEnabledToSet.boolValue;
      self.creativeDebuggerEnabledToSet = nil;
    }
    
    [self.sdk initializeSdkWithCompletionHandler:^(ALSdkConfiguration *configuration)
     {
        [self log: @"SDK initialized"];
        
        self.sdkConfiguration = configuration;
        self.sdkInitialized = YES;
        
        callback(@[@{@"consentDialogState" : @(configuration.consentDialogState)}]);
    }];
}

#pragma mark - General Public API

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isTablet)
{
    return @([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad);
}

RCT_EXPORT_METHOD(showMediationDebugger)
{
    if ( !_sdk )
    {
        [self log: @"Failed to show mediation debugger - please ensure the AppLovin MAX Unity Plugin has been initialized by calling 'AppLovinMAX.initialize(...);'!"];
        return;
    }
    
    [self.sdk showMediationDebugger];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getConsentDialogState)
{
    if ( ![self isInitialized] ) return @(ALConsentDialogStateUnknown);
    
    return @(self.sdkConfiguration.consentDialogState);
}

RCT_EXPORT_METHOD(setHasUserConsent:(BOOL)hasUserConsent)
{
    [ALPrivacySettings setHasUserConsent: hasUserConsent];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasUserConsent)
{
    return @([ALPrivacySettings hasUserConsent]);
}

RCT_EXPORT_METHOD(setIsAgeRestrictedUser:(BOOL)isAgeRestrictedUser)
{
    [ALPrivacySettings setIsAgeRestrictedUser: isAgeRestrictedUser];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isAgeRestrictedUser)
{
    return @([ALPrivacySettings isAgeRestrictedUser]);
}

RCT_EXPORT_METHOD(setDoNotSell:(BOOL)doNotSell)
{
    [ALPrivacySettings setDoNotSell: doNotSell];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isDoNotSell)
{
    return @([ALPrivacySettings isDoNotSell]);
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    if ( [self isPluginInitialized] )
    {
        self.sdk.userIdentifier = userId;
        self.userIdentifierToSet = nil;
    }
    else
    {
        self.userIdentifierToSet = userId;
    }
}

RCT_EXPORT_METHOD(setMuted:(BOOL)muted)
{
    if ( ![self isPluginInitialized] ) return;
    
    self.sdk.settings.muted = muted;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isMuted)
{
    if ( ![self isPluginInitialized] ) return @(NO);
    
    return @(self.sdk.settings.muted);
}

RCT_EXPORT_METHOD(setVerboseLogging:(BOOL)enabled)
{
    if ( [self isPluginInitialized] )
    {
        self.sdk.settings.isVerboseLogging = enabled;
        self.verboseLoggingToSet = nil;
    }
    else
    {
        self.verboseLoggingToSet = @(enabled);
    }
}

RCT_EXPORT_METHOD(setTestDeviceAdvertisingIds:(NSArray<NSString *> *)testDeviceAdvertisingIds)
{
    if ( [self isPluginInitialized] )
    {
        self.sdk.settings.testDeviceAdvertisingIdentifiers = testDeviceAdvertisingIds;
        self.testDeviceIdentifiersToSet = nil;
    }
    else
    {
        self.testDeviceIdentifiersToSet = testDeviceAdvertisingIds;
    }
}

RCT_EXPORT_METHOD(setCreativeDebuggerEnabled:(BOOL)enabled)
{
  if ( [self isPluginInitialized] )
  {
      self.sdk.settings.creativeDebuggerEnabled = enabled;
      self.creativeDebuggerEnabledToSet = nil;
  }
  else
  {
      self.creativeDebuggerEnabledToSet = @(enabled);
  }
}

#pragma mark - Event Tracking

RCT_EXPORT_METHOD(trackEvent:(NSString *)event :(NSDictionary<NSString *, id> *)parameters)
{
    [self.sdk.eventService trackEvent: event parameters: parameters];
}

#pragma mark - Ad Info

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAdInfo:(NSString *)adUnitIdentifier)
{
    if ( adUnitIdentifier.length == 0 ) return @"";
    
    MAAd *ad;
    @synchronized ( self.adInfoDictLock )
    {
        ad = self.adInfoDict[adUnitIdentifier];
    }
    
    if ( !ad ) return @"";
    
    return @{@"adUnitId" : adUnitIdentifier,
             @"networkName" : ad.networkName};
}

#pragma mark - Banners

RCT_EXPORT_METHOD(createBanner:(NSString *)adUnitIdentifier :(NSString *)bannerPosition)
{
    [self createAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT atPosition: bannerPosition];
}

RCT_EXPORT_METHOD(setBannerBackgroundColor:(NSString *)adUnitIdentifier :(NSString *)hexColorCode)
{
    [self setAdViewBackgroundColorForAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT hexColorCode: hexColorCode];
}

RCT_EXPORT_METHOD(setBannerPlacement:(nullable NSString *)placement :(NSString *)adUnitIdentifier)
{
    [self setAdViewPlacement: placement forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(updateBannerPosition:(NSString *)bannerPosition :(NSString *)adUnitIdentifier)
{
    [self updateAdViewPosition: bannerPosition forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(setBannerExtraParameter:(NSString *)adUnitIdentifier :(NSString *)key :(nullable NSString *)value)
{
    [self setAdViewExtraParameterForAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT key: key value: value];
}

RCT_EXPORT_METHOD(showBanner:(NSString *)adUnitIdentifier)
{
    [self showAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(hideBanner:(NSString *)adUnitIdentifier)
{
    [self hideAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(destroyBanner:(NSString *)adUnitIdentifier)
{
    [self destroyAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

#pragma mark - MRECs

RCT_EXPORT_METHOD(createMRec:(NSString *)adUnitIdentifier :(NSString *)mrecPosition)
{
    [self createAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec atPosition: mrecPosition];
}

RCT_EXPORT_METHOD(setMRecPlacement:(nullable NSString *)placement :(NSString *)adUnitIdentifier)
{
    [self setAdViewPlacement: placement forAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(updateMRecPosition:(NSString *)mrecPosition :(NSString *)adUnitIdentifier)
{
    [self updateAdViewPosition: mrecPosition forAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(showMRec:(NSString *)adUnitIdentifier)
{
    [self showAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(hideMRec:(NSString *)adUnitIdentifier)
{
    [self hideAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(destroyMRec:(NSString *)adUnitIdentifier)
{
    [self destroyAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

#pragma mark - Interstitials

RCT_EXPORT_METHOD(loadInterstitial:(NSString *)adUnitIdentifier)
{
    MAInterstitialAd *interstitial = [self retrieveInterstitialForAdUnitIdentifier: adUnitIdentifier];
    [interstitial loadAd];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isInterstitialReady:(NSString *)adUnitIdentifier)
{
    MAInterstitialAd *interstitial = [self retrieveInterstitialForAdUnitIdentifier: adUnitIdentifier];
    return @([interstitial isReady]);
}

RCT_EXPORT_METHOD(showInterstitial:(NSString *)adUnitIdentifier :(NSString *)placement)
{
    MAInterstitialAd *interstitial = [self retrieveInterstitialForAdUnitIdentifier: adUnitIdentifier];
    [interstitial showAdForPlacement: placement];
}

RCT_EXPORT_METHOD(setInterstitialExtraParameter:(NSString *)adUnitIdentifier :(NSString *)key :(nullable NSString *)value)
{
    MAInterstitialAd *interstitial = [self retrieveInterstitialForAdUnitIdentifier: adUnitIdentifier];
    [interstitial setExtraParameterForKey: key value: value];
}

#pragma mark - Rewarded

RCT_EXPORT_METHOD(loadRewardedAd:(NSString *)adUnitIdentifier)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    [rewardedAd loadAd];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isRewardedAdReady:(NSString *)adUnitIdentifier)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    return @([rewardedAd isReady]);
}

RCT_EXPORT_METHOD(showRewardedAd:(NSString *)adUnitIdentifier :(NSString *)placement)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    [rewardedAd showAdForPlacement: placement];
}

RCT_EXPORT_METHOD(setRewardedAdExtraParameter:(NSString *)adUnitIdentifier :(NSString *)key :(nullable NSString *)value)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    [rewardedAd setExtraParameterForKey: key value: value];
}

#pragma mark - Ad Callbacks

- (void)didLoadAd:(MAAd *)ad
{
    NSString *name;
    MAAdFormat *adFormat = ad.format;
    if ( MAAdFormat.banner == adFormat || MAAdFormat.leader == adFormat || MAAdFormat.mrec == adFormat )
    {
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: ad.adUnitIdentifier adFormat: adFormat];
        // An ad is now being shown, enable user interaction.
        adView.userInteractionEnabled = YES;
        
        name = ( MAAdFormat.mrec == adFormat ) ? @"OnMRecAdLoadedEvent" : @"OnBannerAdLoadedEvent";
        [self positionAdViewForAd: ad];
        
        // Do not auto-refresh by default if the ad view is not showing yet (e.g. first load during app launch and publisher does not automatically show banner upon load success)
        // We will resume auto-refresh in -[MAUnityAdManager showBannerWithAdUnitIdentifier:].
        if ( adView && [adView isHidden] )
        {
            [adView stopAutoRefresh];
        }
    }
    else if ( MAAdFormat.interstitial == adFormat )
    {
        name = @"OnInterstitialLoadedEvent";
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = @"OnRewardedAdLoadedEvent";
    }
    else
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    @synchronized ( self.adInfoDictLock )
    {
        self.adInfoDict[ad.adUnitIdentifier] = ad;
    }
    
    [self sendReactNativeEventWithName: name body: @{@"adUnitId" : ad.adUnitIdentifier}];
}

- (void)didFailToLoadAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withErrorCode:(NSInteger)errorCode
{
    if ( !adUnitIdentifier )
    {
        [self log: @"adUnitIdentifier cannot be nil from %@", [NSThread callStackSymbols]];
        return;
    }
    
    NSString *name;
    if ( self.adViews[adUnitIdentifier] )
    {
        name = ( MAAdFormat.mrec == self.adViewAdFormats[adUnitIdentifier] ) ? @"OnMRecAdLoadFailedEvent" : @"OnBannerAdLoadFailedEvent";
    }
    else if ( self.interstitials[adUnitIdentifier] )
    {
        name = @"OnInterstitialLoadFailedEvent";
    }
    else if ( self.rewardedAds[adUnitIdentifier] )
    {
        name = @"OnRewardedAdLoadFailedEvent";
    }
    else
    {
        [self log: @"invalid adUnitId from %@", [NSThread callStackSymbols]];
        return;
    }
    
    @synchronized ( self.adInfoDictLock )
    {
        [self.adInfoDict removeObjectForKey: adUnitIdentifier];
    }
    
    NSString *errorCodeStr = [@(errorCode) stringValue];
    [self sendReactNativeEventWithName: name body: @{@"adUnitId" : adUnitIdentifier,
                                                     @"errorCode" : errorCodeStr}];
}

- (void)didClickAd:(MAAd *)ad
{
    NSString *name;
    MAAdFormat *adFormat = ad.format;
    if ( MAAdFormat.banner == adFormat || MAAdFormat.leader == adFormat )
    {
        name = @"OnBannerAdClickedEvent";
    }
    else if ( MAAdFormat.mrec == adFormat )
    {
        name = @"OnMRecAdClickedEvent";
    }
    else if ( MAAdFormat.interstitial == adFormat )
    {
        name = @"OnInterstitialClickedEvent";
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = @"OnRewardedAdClickedEvent";
    }
    else
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: name body: @{@"adUnitId" : ad.adUnitIdentifier}];
}

- (void)didDisplayAd:(MAAd *)ad
{
    // BMLs do not support [DISPLAY] events in Unity
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.interstitial && adFormat != MAAdFormat.rewarded ) return;
    
    NSString *name;
    if ( MAAdFormat.interstitial == adFormat )
    {
        name = @"OnInterstitialDisplayedEvent";
    }
    else // REWARDED
    {
        name = @"OnRewardedAdDisplayedEvent";
    }
    
    [self sendReactNativeEventWithName: name body: @{@"adUnitId" : ad.adUnitIdentifier}];
}

- (void)didFailToDisplayAd:(MAAd *)ad withErrorCode:(NSInteger)errorCode
{
    // BMLs do not support [DISPLAY] events in Unity
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.interstitial && adFormat != MAAdFormat.rewarded ) return;
    
    NSString *name;
    if ( MAAdFormat.interstitial == adFormat )
    {
        name = @"OnInterstitialAdFailedToDisplayEvent";
    }
    else // REWARDED
    {
        name = @"OnRewardedAdFailedToDisplayEvent";
    }
    
    NSString *errorCodeStr = [@(errorCode) stringValue];
    [self sendReactNativeEventWithName: name body: @{@"adUnitId" : ad.adUnitIdentifier,
                                                     @"errorCode" : errorCodeStr}];
}

- (void)didHideAd:(MAAd *)ad
{
    // BMLs do not support [HIDDEN] events in Unity
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.interstitial && adFormat != MAAdFormat.rewarded ) return;
    
    NSString *name;
    if ( MAAdFormat.interstitial == adFormat )
    {
        name = @"OnInterstitialHiddenEvent";
    }
    else // REWARDED
    {
        name = @"OnRewardedAdHiddenEvent";
    }
    
    [self sendReactNativeEventWithName: name body: @{@"adUnitId" : ad.adUnitIdentifier}];
}

- (void)didExpandAd:(MAAd *)ad
{
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.banner && adFormat != MAAdFormat.leader && adFormat != MAAdFormat.mrec )
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: ( MAAdFormat.mrec == adFormat ) ? @"OnMRecAdExpandedEvent" : @"OnBannerAdExpandedEvent"
                                  body: @{@"adUnitId": ad.adUnitIdentifier}];
}

- (void)didCollapseAd:(MAAd *)ad
{
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.banner && adFormat != MAAdFormat.leader && adFormat != MAAdFormat.mrec )
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: ( MAAdFormat.mrec == adFormat ) ? @"OnMRecAdCollapsedEvent" : @"OnBannerAdCollapsedEvent"
                                  body: @{@"adUnitId" : ad.adUnitIdentifier}];
}

- (void)didCompleteRewardedVideoForAd:(MAAd *)ad
{
    // This event is not forwarded
}

- (void)didStartRewardedVideoForAd:(MAAd *)ad
{
    // This event is not forwarded
}

- (void)didRewardUserForAd:(MAAd *)ad withReward:(MAReward *)reward
{
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.rewarded )
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    NSString *rewardLabel = reward ? reward.label : @"";
    NSInteger rewardAmountInt = reward ? reward.amount : 0;
    NSString *rewardAmount = [@(rewardAmountInt) stringValue];
    
    [self sendReactNativeEventWithName: @"OnRewardedAdReceivedRewardEvent" body: @{@"adUnitId": ad.adUnitIdentifier,
                                                                                   @"rewardLabel": rewardLabel,
                                                                                   @"rewardAmount": rewardAmount}];
}

#pragma mark - Internal Methods

- (void)createAdViewWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat atPosition:(NSString *)adViewPosition
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Creating %@ with ad unit identifier \"%@\" and position: \"%@\"", adFormat, adUnitIdentifier, adViewPosition];
        
        // Retrieve ad view from the map
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: adViewPosition];
        adView.hidden = YES;
        self.safeAreaBackground.hidden = YES;
        
        // Position ad view immediately so if publisher sets color before ad loads, it will not be the size of the screen
        self.adViewAdFormats[adUnitIdentifier] = adFormat;
        [self positionAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        
        [adView loadAd];
        
        // The publisher may have requested to show the banner before it was created. Now that the banner is created, show it.
        if ( [self.adUnitIdentifiersToShowAfterCreate containsObject: adUnitIdentifier] )
        {
            [self showAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
            [self.adUnitIdentifiersToShowAfterCreate removeObject: adUnitIdentifier];
        }
    });
}

- (void)setAdViewBackgroundColorForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat hexColorCode:(NSString *)hexColorCode
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Setting %@ with ad unit identifier \"%@\" to color: \"%@\"", adFormat, adUnitIdentifier, hexColorCode];
        
        // In some cases, black color may get redrawn on each frame update, resulting in an undesired flicker
        UIColor *convertedColor;
        if ( [hexColorCode containsString: @"FF000000"] )
        {
            convertedColor = [UIColor al_colorWithHexString: @"FF000001"];
        }
        else
        {
            convertedColor = [UIColor al_colorWithHexString: hexColorCode];
        }
        
        MAAdView *view = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        self.publisherBannerBackgroundColor = convertedColor;
        self.safeAreaBackground.backgroundColor = view.backgroundColor = convertedColor;
    });
}

- (void)setAdViewPlacement:(nullable NSString *)placement forAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Setting placement \"%@\" for \"%@\" with ad unit identifier \"%@\"", placement, adFormat, adUnitIdentifier];
        
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        adView.placement = placement;
    });
}

- (void)updateAdViewPosition:(NSString *)adViewPosition forAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        // Check if the previous position is same as the new position. If so, no need to update the position again.
        NSString *previousPosition = self.adViewPositions[adUnitIdentifier];
        if ( !adViewPosition || [adViewPosition isEqualToString: previousPosition] ) return;
        
        self.adViewPositions[adUnitIdentifier] = adViewPosition;
        [self positionAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
    });
}

- (void)setAdViewExtraParameterForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat key:(NSString *)key value:(nullable NSString *)value
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Setting %@ extra with key: \"%@\" value: \"%@\"", adFormat, key, value];
        
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        [adView setExtraParameterForKey: key value: value];
        
        if (  [@"force_banner" isEqualToString: key] && MAAdFormat.mrec != adFormat )
        {
            // Handle local changes as needed
            MAAdFormat *adFormat;
            
            BOOL shouldForceBanner = [NSNumber al_numberWithString: value].boolValue;
            if ( shouldForceBanner )
            {
                adFormat = MAAdFormat.banner;
            }
            else
            {
                adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
            }
            
            self.adViewAdFormats[adUnitIdentifier] = adFormat;
            [self positionAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        }
    });
}

- (void)showAdViewWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Showing %@ with ad unit identifier \"%@\"", adFormat, adUnitIdentifier];
        
        MAAdView *view = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        if ( !view )
        {
            [self log: @"%@ does not exist for ad unit identifier %@.", adFormat, adUnitIdentifier];
            
            // The adView has not yet been created. Store the ad unit ID, so that it can be displayed once the banner has been created.
            [self.adUnitIdentifiersToShowAfterCreate addObject: adUnitIdentifier];
        }
        
        self.safeAreaBackground.hidden = NO;
        view.hidden = NO;
        
        [view startAutoRefresh];
    });
}

- (void)hideAdViewWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Hiding %@ with ad unit identifier \"%@\"", adFormat, adUnitIdentifier];
        [self.adUnitIdentifiersToShowAfterCreate removeObject: adUnitIdentifier];
        
        MAAdView *view = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        view.hidden = YES;
        self.safeAreaBackground.hidden = YES;
        
        [view stopAutoRefresh];
    });
}

- (void)destroyAdViewWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Destroying %@ with ad unit identifier \"%@\"", adFormat, adUnitIdentifier];
        
        MAAdView *view = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        view.delegate = nil;
        
        [view removeFromSuperview];
        
        [self.adViews removeObjectForKey: adUnitIdentifier];
        [self.adViewPositions removeObjectForKey: adUnitIdentifier];
        [self.adViewAdFormats removeObjectForKey: adUnitIdentifier];
    });
}

- (void)logInvalidAdFormat:(MAAdFormat *)adFormat
{
    [self log: @"invalid ad format: %@, from %@", adFormat, [NSThread callStackSymbols]];
}

- (void)log:(NSString *)format, ...
{
    va_list valist;
    va_start(valist, format);
    NSString *message = [[NSString alloc] initWithFormat: format arguments: valist];
    va_end(valist);
    
    NSLog(@"[%@] [%@] %@", SDK_TAG, TAG, message);
}

- (MAInterstitialAd *)retrieveInterstitialForAdUnitIdentifier:(NSString *)adUnitIdentifier
{
    MAInterstitialAd *result = self.interstitials[adUnitIdentifier];
    if ( !result )
    {
        result = [[MAInterstitialAd alloc] initWithAdUnitIdentifier: adUnitIdentifier sdk: self.sdk];
        result.delegate = self;
        
        self.interstitials[adUnitIdentifier] = result;
    }
    
    return result;
}

- (MARewardedAd *)retrieveRewardedAdForAdUnitIdentifier:(NSString *)adUnitIdentifier
{
    MARewardedAd *result = self.rewardedAds[adUnitIdentifier];
    if ( !result )
    {
        result = [MARewardedAd sharedWithAdUnitIdentifier: adUnitIdentifier sdk: self.sdk];
        result.delegate = self;
        
        self.rewardedAds[adUnitIdentifier] = result;
    }
    
    return result;
}

- (MAAdView *)retrieveAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    return [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: nil];
}

- (MAAdView *)retrieveAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat atPosition:(NSString *)adViewPosition
{
    return [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: adViewPosition attach: YES];
}

- (MAAdView *)retrieveAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat atPosition:(NSString *)adViewPosition attach:(BOOL)attach
{
    MAAdView *result = self.adViews[adUnitIdentifier];
    if ( !result && adViewPosition )
    {
        result = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat sdk: self.sdk];
        result.delegate = self;
        result.userInteractionEnabled = NO;
        result.translatesAutoresizingMaskIntoConstraints = NO;
        
        self.adViews[adUnitIdentifier] = result;
        
        // If this is programmatic (non native RN)
        if ( attach )
        {
            self.adViewPositions[adUnitIdentifier] = adViewPosition;
            [ROOT_VIEW_CONTROLLER.view addSubview: result];
        }
    }
    
    return result;
}

- (void)positionAdViewForAd:(MAAd *)ad
{
    [self positionAdViewForAdUnitIdentifier: ad.adUnitIdentifier adFormat: ad.format];
}

- (void)positionAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
    NSString *adViewPosition = self.adViewPositions[adUnitIdentifier];
    
    UIView *superview = adView.superview;
    if ( !superview ) return;
    
    // Deactivate any previous constraints so that the banner can be positioned again.
    NSArray<NSLayoutConstraint *> *activeConstraints = self.adViewConstraints[adUnitIdentifier];
    [NSLayoutConstraint deactivateConstraints: activeConstraints];
    
    // Ensure superview contains the safe area background.
    if ( ![superview.subviews containsObject: self.safeAreaBackground] )
    {
        [self.safeAreaBackground removeFromSuperview];
        [superview insertSubview: self.safeAreaBackground belowSubview: adView];
    }
    
    // Deactivate any previous constraints and reset visibility state so that the safe area background can be positioned again.
    [NSLayoutConstraint deactivateConstraints: self.safeAreaBackground.constraints];
    self.safeAreaBackground.hidden = NO;
    
    CGSize adViewSize = [[self class] adViewSizeForAdFormat: adFormat];
    
    // All positions have constant height
    NSMutableArray<NSLayoutConstraint *> *constraints = [NSMutableArray arrayWithObject: [adView.heightAnchor constraintEqualToConstant: adViewSize.height]];
    
    UILayoutGuide *layoutGuide;
    if ( @available(iOS 11.0, *) )
    {
        layoutGuide = superview.safeAreaLayoutGuide;
    }
    else
    {
        layoutGuide = superview.layoutMarginsGuide;
    }
    
    // If top of bottom center, stretch width of screen
    if ( [adViewPosition isEqual: @"top_center"] || [adViewPosition isEqual: @"bottom_center"] )
    {
        // If publisher actually provided a banner background color, span the banner across the realm
        if ( self.publisherBannerBackgroundColor && adFormat != MAAdFormat.mrec )
        {
            [constraints addObjectsFromArray: @[[self.safeAreaBackground.leftAnchor constraintEqualToAnchor: superview.leftAnchor],
                                                [self.safeAreaBackground.rightAnchor constraintEqualToAnchor: superview.rightAnchor]]];
            
            if ( [adViewPosition isEqual: @"top_center"] )
            {
                [constraints addObjectsFromArray: @[[adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor],
                                                    [adView.leftAnchor constraintEqualToAnchor: superview.leftAnchor],
                                                    [adView.rightAnchor constraintEqualToAnchor: superview.rightAnchor]]];
                [constraints addObjectsFromArray: @[[self.safeAreaBackground.topAnchor constraintEqualToAnchor: superview.topAnchor],
                                                    [self.safeAreaBackground.bottomAnchor constraintEqualToAnchor: adView.topAnchor]]];
            }
            else // BottomCenter
            {
                [constraints addObjectsFromArray: @[[adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor],
                                                    [adView.leftAnchor constraintEqualToAnchor: superview.leftAnchor],
                                                    [adView.rightAnchor constraintEqualToAnchor: superview.rightAnchor]]];
                [constraints addObjectsFromArray: @[[self.safeAreaBackground.topAnchor constraintEqualToAnchor: adView.bottomAnchor],
                                                    [self.safeAreaBackground.bottomAnchor constraintEqualToAnchor: superview.bottomAnchor]]];
            }
        }
        // If pub does not have a background color set - we shouldn't span the banner the width of the realm (there might be user-interactable UI on the sides)
        else
        {
            self.safeAreaBackground.hidden = YES;
            
            // Assign constant width of 320 or 728
            [constraints addObject: [adView.widthAnchor constraintEqualToConstant: adViewSize.width]];
            [constraints addObject: [adView.centerXAnchor constraintEqualToAnchor: layoutGuide.centerXAnchor]];
            
            if ( [adViewPosition isEqual: @"top_center"] )
            {
                [constraints addObject: [adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor]];
            }
            else // BottomCenter
            {
                [constraints addObject: [adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor]];
            }
        }
    }
    // Otherwise, publisher will likely construct his own views around the adview
    else
    {
        self.safeAreaBackground.hidden = YES;
        
        // Assign constant width of 320 or 728
        [constraints addObject: [adView.widthAnchor constraintEqualToConstant: adViewSize.width]];
        
        if ( [adViewPosition isEqual: @"top_left"] )
        {
            [constraints addObjectsFromArray: @[[adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor],
                                                [adView.leftAnchor constraintEqualToAnchor: superview.leftAnchor]]];
        }
        else if ( [adViewPosition isEqual: @"top_right"] )
        {
            [constraints addObjectsFromArray: @[[adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor],
                                                [adView.rightAnchor constraintEqualToAnchor: superview.rightAnchor]]];
        }
        else if ( [adViewPosition isEqual: @"centered"] )
        {
            [constraints addObjectsFromArray: @[[adView.centerXAnchor constraintEqualToAnchor: layoutGuide.centerXAnchor],
                                                [adView.centerYAnchor constraintEqualToAnchor: layoutGuide.centerYAnchor]]];
        }
        else if ( [adViewPosition isEqual: @"bottom_left"] )
        {
            [constraints addObjectsFromArray: @[[adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor],
                                                [adView.leftAnchor constraintEqualToAnchor: superview.leftAnchor]]];
        }
        else if ( [adViewPosition isEqual: @"bottom_right"] )
        {
            [constraints addObjectsFromArray: @[[adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor],
                                                [adView.rightAnchor constraintEqualToAnchor: superview.rightAnchor]]];
        }
    }
    
    self.adViewConstraints[adUnitIdentifier] = constraints;
    
    [NSLayoutConstraint activateConstraints: constraints];
}

+ (CGSize)adViewSizeForAdFormat:(MAAdFormat *)adFormat
{
    if ( MAAdFormat.leader == adFormat )
    {
        return CGSizeMake(728.0f, 90.0f);
    }
    else if ( MAAdFormat.banner == adFormat )
    {
        return CGSizeMake(320.0f, 50.0f);
    }
    else if ( MAAdFormat.mrec == adFormat )
    {
        return CGSizeMake(300.0f, 250.0f);
    }
    else
    {
        [NSException raise: NSInvalidArgumentException format: @"Invalid ad format"];
        return CGSizeZero;
    }
}

#pragma mark - React Native Event Bridge

- (void)sendReactNativeEventWithName:(NSString *)name body:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: name body: body];
}

// From RCTBridgeModule protocol
- (NSArray<NSString *> *)supportedEvents
{
    return @[@"OnMRecAdLoadedEvent",
             @"OnMRecAdLoadFailedEvent",
             @"OnMRecAdClickedEvent",
             @"OnMRecAdCollapsedEvent",
             @"OnMRecAdExpandedEvent",
             
             @"OnBannerAdLoadedEvent",
             @"OnBannerAdLoadFailedEvent",
             @"OnBannerAdClickedEvent",
             @"OnBannerAdCollapsedEvent",
             @"OnBannerAdExpandedEvent",
             
             @"OnInterstitialLoadedEvent",
             @"OnInterstitialLoadFailedEvent",
             @"OnInterstitialClickedEvent",
             @"OnInterstitialDisplayedEvent",
             @"OnInterstitialAdFailedToDisplayEvent",
             @"OnInterstitialHiddenEvent",
             
             @"OnRewardedAdLoadedEvent",
             @"OnRewardedAdLoadFailedEvent",
             @"OnRewardedAdClickedEvent",
             @"OnRewardedAdDisplayedEvent",
             @"OnRewardedAdFailedToDisplayEvent",
             @"OnRewardedAdHiddenEvent",
             @"OnRewardedAdReceivedRewardEvent"];
}

- (void)startObserving
{
    self.hasListeners = YES;
}

- (void)stopObserving
{
    self.hasListeners = NO;
}

@end
