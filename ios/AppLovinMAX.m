//
//  AppLovinMAX.m
//  AppLovin MAX React Native Module
//
//  Created by Thomas So on 7/4/20.
//  Copyright © 2020 AppLovin. All rights reserved.
//

#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"

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

@interface AppLovinMAX()

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
@property (nonatomic, strong, nullable) NSNumber *locationCollectionEnabledToSet;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSString *> *extraParametersToSet;

@property (nonatomic, strong, nullable) NSNumber *consentFlowEnabledToSet;
@property (nonatomic, strong, nullable) NSURL *privacyPolicyURLToSet;
@property (nonatomic, strong, nullable) NSURL *termsOfServiceURLToSet;

@property (nonatomic, strong, nullable) NSNumber *targetingYearOfBirthToSet;
@property (nonatomic,   copy, nullable) NSString *targetingGenderToSet;
@property (nonatomic, strong, nullable) NSNumber *targetingMaximumAdContentRatingToSet;
@property (nonatomic,   copy, nullable) NSString *targetingEmailToSet;
@property (nonatomic,   copy, nullable) NSString *targetingPhoneNumberToSet;
@property (nonatomic, strong, nullable) NSArray<NSString *> *targetingKeywordsToSet;
@property (nonatomic, strong, nullable) NSArray<NSString *> *targetingInterestsToSet;

// Fullscreen Ad Fields
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAInterstitialAd *> *interstitials;
@property (nonatomic, strong) NSMutableDictionary<NSString *, MARewardedAd *> *rewardedAds;
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAAppOpenAd *> *appOpenAds;

// Banner Fields
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAAdView *> *adViews;
@property (nonatomic, strong) NSMutableDictionary<NSString *, MAAdFormat *> *adViewAdFormats;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSString *> *adViewPositions;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSValue *> *adViewOffsets;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSNumber *> *adViewWidths;
@property (nonatomic, strong) NSMutableDictionary<NSString *, NSArray<NSLayoutConstraint *> *> *adViewConstraints;
@property (nonatomic, strong) NSMutableArray<NSString *> *adUnitIdentifiersToShowAfterCreate;
@property (nonatomic, strong) NSMutableSet<NSString *> *disabledAdaptiveBannerAdUnitIdentifiers;
@property (nonatomic, strong) UIView *safeAreaBackground;
@property (nonatomic, strong, nullable) UIColor *publisherBannerBackgroundColor;

// React Native's proposed optimizations to not emit events if no listeners
@property (nonatomic, assign) BOOL hasListeners;

@end

@implementation AppLovinMAX
static NSString *const SDK_TAG = @"AppLovinSdk";
static NSString *const TAG = @"AppLovinMAX";

static NSString *const ON_BANNER_AD_LOADED_EVENT = @"OnBannerAdLoadedEvent";
static NSString *const ON_BANNER_AD_LOAD_FAILED_EVENT = @"OnBannerAdLoadFailedEvent";
static NSString *const ON_BANNER_AD_CLICKED_EVENT = @"OnBannerAdClickedEvent";
static NSString *const ON_BANNER_AD_COLLAPSED_EVENT = @"OnBannerAdCollapsedEvent";
static NSString *const ON_BANNER_AD_EXPANDED_EVENT = @"OnBannerAdExpandedEvent";
static NSString *const ON_BANNER_AD_REVENUE_PAID = @"OnBannerAdRevenuePaid";

static NSString *const ON_MREC_AD_LOADED_EVENT = @"OnMRecAdLoadedEvent";
static NSString *const ON_MREC_AD_LOAD_FAILED_EVENT = @"OnMRecAdLoadFailedEvent";
static NSString *const ON_MREC_AD_CLICKED_EVENT= @"OnMRecAdClickedEvent";
static NSString *const ON_MREC_AD_COLLAPSED_EVENT = @"OnMRecAdCollapsedEvent";
static NSString *const ON_MREC_AD_EXPANDED_EVENT = @"OnMRecAdExpandedEvent";
static NSString *const ON_MREC_AD_REVENUE_PAID = @"OnMRecAdRevenuePaid";

static NSString *const ON_INTERSTITIAL_LOADED_EVENT = @"OnInterstitialLoadedEvent";
static NSString *const ON_INTERSTITIAL_LOAD_FAILED_EVENT = @"OnInterstitialLoadFailedEvent";
static NSString *const ON_INTERSTITIAL_CLICKED_EVENT = @"OnInterstitialClickedEvent";
static NSString *const ON_INTERSTITIAL_DISPLAYED_EVENT = @"OnInterstitialDisplayedEvent";
static NSString *const ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT = @"OnInterstitialAdFailedToDisplayEvent";
static NSString *const ON_INTERSTITIAL_HIDDEN_EVENT = @"OnInterstitialHiddenEvent";
static NSString *const ON_INTERSTITIAL_AD_REVENUE_PAID = @"OnInterstitialAdRevenuePaid";

static NSString *const ON_REWARDED_AD_LOADED_EVENT = @"OnRewardedAdLoadedEvent";
static NSString *const ON_REWARDED_AD_LOAD_FAILED_EVENT = @"OnRewardedAdLoadFailedEvent";
static NSString *const ON_REWARDED_AD_CLICKED_EVENT = @"OnRewardedAdClickedEvent";
static NSString *const ON_REWARDED_AD_DISPLAYED_EVENT = @"OnRewardedAdDisplayedEvent";
static NSString *const ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT = @"OnRewardedAdFailedToDisplayEvent";
static NSString *const ON_REWARDED_AD_HIDDEN_EVENT = @"OnRewardedAdHiddenEvent";
static NSString *const ON_REWARDED_AD_RECEIVED_REWARD_EVENT = @"OnRewardedAdReceivedRewardEvent";
static NSString *const ON_REWARDED_AD_REVENUE_PAID = @"OnRewardedAdRevenuePaid";

static NSString *const ON_APPOPEN_AD_LOADED_EVENT = @"OnAppOpenAdLoadedEvent";
static NSString *const ON_APPOPEN_AD_LOAD_FAILED_EVENT = @"OnAppOpenAdLoadFailedEvent";
static NSString *const ON_APPOPEN_AD_CLICKED_EVENT = @"OnAppOpenAdClickedEvent";
static NSString *const ON_APPOPEN_AD_DISPLAYED_EVENT = @"OnAppOpenAdDisplayedEvent";
static NSString *const ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT = @"OnAppOpenAdFailedToDisplayEvent";
static NSString *const ON_APPOPEN_AD_HIDDEN_EVENT = @"OnAppOpenAdHiddenEvent";
static NSString *const ON_APPOPEN_AD_REVENUE_PAID = @"OnAppOpenAdRevenuePaid";

static NSString *const TOP_CENTER = @"top_center";
static NSString *const TOP_LEFT = @"top_left";
static NSString *const TOP_RIGHT = @"top_right";
static NSString *const CENTERED = @"centered";
static NSString *const CENTER_LEFT = @"center_left";
static NSString *const CENTER_RIGHT = @"center_right";
static NSString *const BOTTOM_LEFT = @"bottom_left";
static NSString *const BOTTOM_CENTER = @"bottom_center";
static NSString *const BOTTOM_RIGHT = @"bottom_right";

static AppLovinMAX *AppLovinMAXShared; // Shared instance of this bridge module.

// To export a module named AppLovinMAX ("RCT" automatically removed)
RCT_EXPORT_MODULE()

// `init` requires main queue b/c of UI code
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

// Invoke all exported methods from main queue
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
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
        self.appOpenAds = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewAdFormats = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewPositions = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewOffsets = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewWidths = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adViewConstraints = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.adUnitIdentifiersToShowAfterCreate = [NSMutableArray arrayWithCapacity: 2];
        self.disabledAdaptiveBannerAdUnitIdentifiers = [NSMutableSet setWithCapacity: 2];
        self.extraParametersToSet = [NSMutableDictionary dictionaryWithCapacity: 8];
        
        self.safeAreaBackground = [[UIView alloc] init];
        self.safeAreaBackground.hidden = YES;
        self.safeAreaBackground.backgroundColor = UIColor.clearColor;
        self.safeAreaBackground.translatesAutoresizingMaskIntoConstraints = NO;
        self.safeAreaBackground.userInteractionEnabled = NO;
        [ROOT_VIEW_CONTROLLER.view addSubview: self.safeAreaBackground];
    }
    return self;
}

RCT_EXPORT_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve(@([self isPluginInitialized] && [self isSDKInitialized]));
}

RCT_EXPORT_METHOD(initialize:(NSString *)pluginVersion :(NSString *)sdkKey :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    // Guard against running init logic multiple times
    if ( [self isPluginInitialized] ) return;
    
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
            reject(RCTErrorUnspecified, @"Unable to initialize AppLovin SDK - no SDK key provided and not found in Info.plist!", nil);
            return;
        }
    }
    
    ALSdkSettings *settings = [[ALSdkSettings alloc] init];
    settings.consentFlowSettings.enabled = self.consentFlowEnabledToSet.boolValue;
    settings.consentFlowSettings.privacyPolicyURL = self.privacyPolicyURLToSet;
    settings.consentFlowSettings.termsOfServiceURL = self.termsOfServiceURLToSet;
    
    self.consentFlowEnabledToSet = nil;
    self.privacyPolicyURLToSet = nil;
    self.termsOfServiceURLToSet = nil;
    
    // Initialize SDK
    self.sdk = [ALSdk sharedWithKey: sdkKey settings: settings];
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
        self.sdk.settings.verboseLoggingEnabled = self.verboseLoggingToSet.boolValue;
        self.verboseLoggingToSet = nil;
    }
    
    // Set creative debugger enabled if needed.
    if ( self.creativeDebuggerEnabledToSet )
    {
        self.sdk.settings.creativeDebuggerEnabled = self.creativeDebuggerEnabledToSet.boolValue;
        self.creativeDebuggerEnabledToSet = nil;
    }
    
    // Set location collection enabled if needed
    if ( self.locationCollectionEnabledToSet )
    {
        self.sdk.settings.locationCollectionEnabled = self.locationCollectionEnabledToSet.boolValue;
        self.locationCollectionEnabledToSet = nil;
    }
    
    if ( self.targetingYearOfBirthToSet )
    {
        self.sdk.targetingData.yearOfBirth = self.targetingYearOfBirthToSet.intValue <= 0 ? nil : self.targetingYearOfBirthToSet;
        self.targetingYearOfBirthToSet = nil;
    }
    
    if ( self.targetingGenderToSet )
    {
        self.sdk.targetingData.gender = [self toAppLovinGender: self.targetingGenderToSet];
        self.targetingGenderToSet = nil;
    }
    
    if ( self.targetingMaximumAdContentRatingToSet )
    {
        self.sdk.targetingData.maximumAdContentRating = [self toAppLovinAdContentRating: self.targetingMaximumAdContentRatingToSet];
        self.targetingMaximumAdContentRatingToSet = nil;
    }
    
    if ( self.targetingEmailToSet )
    {
        self.sdk.targetingData.email = self.targetingEmailToSet;
        self.targetingEmailToSet = nil;
    }
    
    if ( self.targetingPhoneNumberToSet )
    {
        self.sdk.targetingData.phoneNumber = self.targetingPhoneNumberToSet;
        self.targetingPhoneNumberToSet = nil;
    }
    
    if ( self.targetingKeywordsToSet )
    {
        self.sdk.targetingData.keywords = self.targetingKeywordsToSet;
        self.targetingKeywordsToSet = nil;
    }
    
    if ( self.targetingInterestsToSet )
    {
        self.sdk.targetingData.interests = self.targetingInterestsToSet;
        self.targetingInterestsToSet = nil;
    }
    
    [self setPendingExtraParametersIfNeeded: self.sdk.settings];

    [self.sdk initializeSdkWithCompletionHandler:^(ALSdkConfiguration *configuration) {
        
        [self log: @"SDK initialized"];
        
        self.sdkConfiguration = configuration;
        self.sdkInitialized = YES;
        
        resolve(@{@"countryCode" : self.sdk.configuration.countryCode});
    }];
}

#pragma mark - General Public API

RCT_EXPORT_METHOD(isTablet:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve(@([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad));
}

RCT_EXPORT_METHOD(showMediationDebugger)
{
    if ( !self.sdk )
    {
        [self logUninitializedAccessError: @"showMediationDebugger"];
        return;
    }
    
    [self.sdk showMediationDebugger];
}

RCT_EXPORT_METHOD(showConsentDialog:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    reject(RCTErrorUnspecified, @"Failed to show consent dialog - Unavailable on iOS, please use the consent flow: https://dash.applovin.com/documentation/mediation/react-native/getting-started/consent-flow", nil);
}

RCT_EXPORT_METHOD(setHasUserConsent:(BOOL)hasUserConsent)
{
    [ALPrivacySettings setHasUserConsent: hasUserConsent];
}

RCT_EXPORT_METHOD(hasUserConsent:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve(@([ALPrivacySettings hasUserConsent]));
}

RCT_EXPORT_METHOD(setIsAgeRestrictedUser:(BOOL)isAgeRestrictedUser)
{
    [ALPrivacySettings setIsAgeRestrictedUser: isAgeRestrictedUser];
}

RCT_EXPORT_METHOD(isAgeRestrictedUser:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve(@([ALPrivacySettings isAgeRestrictedUser]));
}

RCT_EXPORT_METHOD(setDoNotSell:(BOOL)doNotSell)
{
    [ALPrivacySettings setDoNotSell: doNotSell];
}

RCT_EXPORT_METHOD(isDoNotSell:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve(@([ALPrivacySettings isDoNotSell]));
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

RCT_EXPORT_METHOD(isMuted:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve([self isPluginInitialized] ? @(self.sdk.settings.muted) : @(NO) );
}

RCT_EXPORT_METHOD(setVerboseLogging:(BOOL)enabled)
{
    if ( [self isPluginInitialized] )
    {
        self.sdk.settings.verboseLoggingEnabled = enabled;
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

RCT_EXPORT_METHOD(setExtraParameter:(NSString *)key :(nullable NSString *)value)
{
    if ( ![key al_isValidString] )
    {
        [self log: @"[%@] Failed to set extra parameter for nil or empty key: %@", TAG, key];
        return;
    }

    if ( self.sdk )
    {
        ALSdkSettings *settings = self.sdk.settings;
        [settings setExtraParameterForKey: key value: value];
        [self setPendingExtraParametersIfNeeded: settings];
    }
    else
    {
        self.extraParametersToSet[key] = value;
    }
}

RCT_EXPORT_METHOD(setConsentFlowEnabled:(BOOL)enabled)
{
    self.consentFlowEnabledToSet = @(enabled);
}

RCT_EXPORT_METHOD(setPrivacyPolicyUrl:(NSString *)urlString)
{
    self.privacyPolicyURLToSet = [NSURL URLWithString: urlString];
}

RCT_EXPORT_METHOD(setTermsOfServiceUrl:(NSString *)urlString)
{
    self.termsOfServiceURLToSet = [NSURL URLWithString: urlString];
}

#pragma mark - Data Passing

RCT_EXPORT_METHOD(setTargetingDataYearOfBirth:(nonnull NSNumber *)yearOfBirth)
{
    if ( !self.sdk )
    {
        self.targetingYearOfBirthToSet = yearOfBirth;
        return;
    }
    
    self.sdk.targetingData.yearOfBirth = yearOfBirth.intValue <= 0 ? nil : yearOfBirth;
}

RCT_EXPORT_METHOD(setTargetingDataGender:(nullable NSString *)gender)
{
    if ( !self.sdk )
    {
        self.targetingGenderToSet = gender;
        return;
    }
    
    self.sdk.targetingData.gender = [self toAppLovinGender: gender];
}

RCT_EXPORT_METHOD(setTargetingDataMaximumAdContentRating:(nonnull NSNumber *)maximumAdContentRating)
{
    if ( !self.sdk )
    {
        self.targetingMaximumAdContentRatingToSet = maximumAdContentRating;
        return;
    }
    
    self.sdk.targetingData.maximumAdContentRating = [self toAppLovinAdContentRating: maximumAdContentRating];
}

RCT_EXPORT_METHOD(setTargetingDataEmail:(nullable NSString *)email)
{
    if ( !self.sdk )
    {
        self.targetingEmailToSet = email;
        return;
    }
    
    self.sdk.targetingData.email = email;
}

RCT_EXPORT_METHOD(setTargetingDataPhoneNumber:(nullable NSString *)phoneNumber)
{
    if ( !self.sdk )
    {
        self.targetingPhoneNumberToSet = phoneNumber;
        return;
    }
    
    self.sdk.targetingData.phoneNumber = phoneNumber;
}

RCT_EXPORT_METHOD(setTargetingDataKeywords:(nullable NSArray<NSString *> *)keywords)
{
    if ( !self.sdk )
    {
        self.targetingKeywordsToSet = keywords;
        return;
    }
    
    self.sdk.targetingData.keywords = keywords;
}

RCT_EXPORT_METHOD(setTargetingDataInterests:(nullable NSArray<NSString *> *)interests)
{
    if ( !self.sdk )
    {
        self.targetingInterestsToSet = interests;
        return;
    }
    
    self.sdk.targetingData.interests = interests;
}

RCT_EXPORT_METHOD(clearAllTargetingData)
{
    if ( !self.sdk )
    {
        self.targetingYearOfBirthToSet = nil;
        self.targetingGenderToSet = nil;
        self.targetingMaximumAdContentRatingToSet = nil;
        self.targetingEmailToSet = nil;
        self.targetingPhoneNumberToSet = nil;
        self.targetingKeywordsToSet = nil;
        self.targetingInterestsToSet = nil;
        return;
    }
    
    [self.sdk.targetingData clearAll];
}

RCT_EXPORT_METHOD(setLocationCollectionEnabled:(BOOL)enabled)
{
    if ( [self isPluginInitialized] )
    {
        self.sdk.settings.locationCollectionEnabled = enabled;
        self.locationCollectionEnabledToSet = nil;
    }
    else
    {
        self.locationCollectionEnabledToSet = @(enabled);
    }
}

#pragma mark - Event Tracking

RCT_EXPORT_METHOD(trackEvent:(NSString *)event :(NSDictionary<NSString *, id> *)parameters)
{
    [self.sdk.eventService trackEvent: event parameters: parameters];
}

#pragma mark - Banners

RCT_EXPORT_METHOD(createBanner:(NSString *)adUnitIdentifier :(NSString *)bannerPosition)
{
    [self createAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT atPosition: bannerPosition withOffset: CGPointZero];
}

// NOTE: No function overloading in JS so we need new method signature
RCT_EXPORT_METHOD(createBannerWithOffsets:(NSString *)adUnitIdentifier :(NSString *)bannerPosition :(CGFloat)xOffset :(CGFloat)yOffset)
{
    [self createAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT atPosition: bannerPosition withOffset: CGPointMake(xOffset, yOffset)];
}

RCT_EXPORT_METHOD(setBannerBackgroundColor:(NSString *)adUnitIdentifier :(NSString *)hexColorCode)
{
    [self setAdViewBackgroundColorForAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT hexColorCode: hexColorCode];
}

RCT_EXPORT_METHOD(setBannerPlacement:(NSString *)adUnitIdentifier :(nullable NSString *)placement)
{
    [self setAdViewPlacement: placement forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(setBannerCustomData:(NSString *)adUnitIdentifier :(nullable NSString *)customData)
{
    [self setAdViewCustomData: customData forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(updateBannerPosition:(NSString *)adUnitIdentifier :(NSString *)bannerPosition)
{
    [self updateAdViewPosition: bannerPosition withOffset: CGPointZero forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(updateBannerOffsets:(NSString *)adUnitIdentifier :(CGFloat)xOffset :(CGFloat)yOffset)
{
    [self updateAdViewPosition: self.adViewPositions[adUnitIdentifier] withOffset: CGPointMake(xOffset, yOffset) forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(setBannerWidth:(NSString *)adUnitIdentifier :(CGFloat)width)
{
    [self setAdViewWidth: width forAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(setBannerExtraParameter:(NSString *)adUnitIdentifier :(NSString *)key :(nullable NSString *)value)
{
    [self setAdViewExtraParameterForAdUnitIdentifier: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT key: key value: value];
}

RCT_EXPORT_METHOD(startBannerAutoRefresh:(NSString *)adUnitIdentifier)
{
    [self startAutoRefresh: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
}

RCT_EXPORT_METHOD(stopBannerAutoRefresh:(NSString *)adUnitIdentifier)
{
    [self stopAutoRefresh: adUnitIdentifier adFormat: DEVICE_SPECIFIC_ADVIEW_AD_FORMAT];
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

RCT_EXPORT_METHOD(getAdaptiveBannerHeightForWidth:(CGFloat)width :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    resolve(@([DEVICE_SPECIFIC_ADVIEW_AD_FORMAT adaptiveSizeForWidth: width].height));
}

#pragma mark - MRECs

RCT_EXPORT_METHOD(createMRec:(NSString *)adUnitIdentifier :(NSString *)mrecPosition)
{
    [self createAdViewWithAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec atPosition: mrecPosition withOffset: CGPointZero];
}

RCT_EXPORT_METHOD(setMRecPlacement:(NSString *)adUnitIdentifier :(nullable NSString *)placement)
{
    [self setAdViewPlacement: placement forAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(setMRecCustomData:(NSString *)adUnitIdentifier :(nullable NSString *)customData)
{
    [self setAdViewCustomData: customData forAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(updateMRecPosition:(NSString *)mrecPosition :(NSString *)adUnitIdentifier)
{
    [self updateAdViewPosition: mrecPosition withOffset: CGPointZero forAdUnitIdentifier: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(startMRecAutoRefresh:(NSString *)adUnitIdentifier)
{
    [self startAutoRefresh: adUnitIdentifier adFormat: MAAdFormat.mrec];
}

RCT_EXPORT_METHOD(stopMRecAutoRefresh:(NSString *)adUnitIdentifier)
{
    [self stopAutoRefresh: adUnitIdentifier adFormat: MAAdFormat.mrec];
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

RCT_EXPORT_METHOD(isInterstitialReady:(NSString *)adUnitIdentifier :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    MAInterstitialAd *interstitial = [self retrieveInterstitialForAdUnitIdentifier: adUnitIdentifier];
    resolve(@([interstitial isReady]));
}

RCT_EXPORT_METHOD(showInterstitial:(NSString *)adUnitIdentifier :(nullable NSString *)placement :(nullable NSString *)customData)
{
    MAInterstitialAd *interstitial = [self retrieveInterstitialForAdUnitIdentifier: adUnitIdentifier];
    [interstitial showAdForPlacement: placement customData: customData];
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

RCT_EXPORT_METHOD(isRewardedAdReady:(NSString *)adUnitIdentifier :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    resolve(@([rewardedAd isReady]));
}

RCT_EXPORT_METHOD(showRewardedAd:(NSString *)adUnitIdentifier :(nullable NSString *)placement :(nullable NSString *)customData)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    [rewardedAd showAdForPlacement: placement customData: customData];
}

RCT_EXPORT_METHOD(setRewardedAdExtraParameter:(NSString *)adUnitIdentifier :(NSString *)key :(nullable NSString *)value)
{
    MARewardedAd *rewardedAd = [self retrieveRewardedAdForAdUnitIdentifier: adUnitIdentifier];
    [rewardedAd setExtraParameterForKey: key value: value];
}

#pragma mark - App Open Ad

RCT_EXPORT_METHOD(loadAppOpenAd:(NSString *)adUnitIdentifier)
{
    MAAppOpenAd *appOpenAd = [self retrieveAppOpenAdForAdUnitIdentifier: adUnitIdentifier];
    [appOpenAd loadAd];
}

RCT_EXPORT_METHOD(isAppOpenAdReady:(NSString *)adUnitIdentifier :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    MAAppOpenAd *appOpenAd = [self retrieveAppOpenAdForAdUnitIdentifier: adUnitIdentifier];
    resolve(@([appOpenAd isReady]));
}

RCT_EXPORT_METHOD(showAppOpenAd:(NSString *)adUnitIdentifier placement:(nullable NSString *)placement customData:(nullable NSString *)customData)
{
    MAAppOpenAd *appOpenAd = [self retrieveAppOpenAdForAdUnitIdentifier: adUnitIdentifier];
    [appOpenAd showAdForPlacement: placement customData: customData];
}

RCT_EXPORT_METHOD(setAppOpenAdExtraParameter:(NSString *)adUnitIdentifier key:(NSString *)key value:(nullable NSString *)value)
{
    MAAppOpenAd *appOpenAd = [self retrieveAppOpenAdForAdUnitIdentifier: adUnitIdentifier];
    [appOpenAd setExtraParameterForKey: key value: value];
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
        
        name = ( MAAdFormat.mrec == adFormat ) ? ON_MREC_AD_LOADED_EVENT : ON_BANNER_AD_LOADED_EVENT;
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
        name = ON_INTERSTITIAL_LOADED_EVENT;
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = ON_REWARDED_AD_LOADED_EVENT;
    }
    else if ( MAAdFormat.appOpen == adFormat )
    {
        name = ON_APPOPEN_AD_LOADED_EVENT;
    }
    else
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: name body: [self adInfoForAd: ad]];
}

- (void)didFailToLoadAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
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
        name = ON_INTERSTITIAL_LOAD_FAILED_EVENT;
    }
    else if ( self.rewardedAds[adUnitIdentifier] )
    {
        name = ON_REWARDED_AD_LOAD_FAILED_EVENT;
    }
    else if ( self.appOpenAds[adUnitIdentifier] )
    {
        name = ON_APPOPEN_AD_LOAD_FAILED_EVENT;
    }
    else
    {
        [self log: @"invalid adUnitId from %@", [NSThread callStackSymbols]];
        return;
    }
    
    [self sendReactNativeEventWithName: name body: [self adLoadFailedInfoForAd: adUnitIdentifier withError: error]];
}

- (void)didClickAd:(MAAd *)ad
{
    NSString *name;
    MAAdFormat *adFormat = ad.format;
    if ( MAAdFormat.banner == adFormat || MAAdFormat.leader == adFormat )
    {
        name = ON_BANNER_AD_CLICKED_EVENT;
    }
    else if ( MAAdFormat.mrec == adFormat )
    {
        name = ON_MREC_AD_CLICKED_EVENT;
    }
    else if ( MAAdFormat.interstitial == adFormat )
    {
        name = ON_INTERSTITIAL_CLICKED_EVENT;
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = ON_REWARDED_AD_CLICKED_EVENT;
    }
    else if ( MAAdFormat.appOpen == adFormat )
    {
        name = ON_APPOPEN_AD_CLICKED_EVENT;
    }
    else
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: name body: [self adInfoForAd: ad]];
}

- (void)didDisplayAd:(MAAd *)ad
{
    // BMLs do not support [DISPLAY] events in Unity
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.interstitial && adFormat != MAAdFormat.rewarded && adFormat != MAAdFormat.appOpen ) return;
    
    NSString *name;
    if ( MAAdFormat.interstitial == adFormat )
    {
        name = ON_INTERSTITIAL_DISPLAYED_EVENT;
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = ON_REWARDED_AD_DISPLAYED_EVENT;
    }
    else // APP OPEN
    {
        name = ON_APPOPEN_AD_DISPLAYED_EVENT;
    }
    
    [self sendReactNativeEventWithName: name body: [self adInfoForAd: ad]];
}

- (void)didFailToDisplayAd:(MAAd *)ad withError:(MAError *)error
{
    // BMLs do not support [DISPLAY] events in Unity
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.interstitial && adFormat != MAAdFormat.rewarded && adFormat != MAAdFormat.appOpen ) return;
    
    NSString *name;
    if ( MAAdFormat.interstitial == adFormat )
    {
        name = ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT;
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT;
    }
    else // APP OPEN
    {
        name = ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT;
    }
    
    [self sendReactNativeEventWithName: name body: [self adDisplayFailedInfoForAd: ad withError: error]];
}

- (void)didHideAd:(MAAd *)ad
{
    // BMLs do not support [HIDDEN] events in Unity
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.interstitial && adFormat != MAAdFormat.rewarded && adFormat != MAAdFormat.appOpen ) return;
    
    NSString *name;
    if ( MAAdFormat.interstitial == adFormat )
    {
        name = ON_INTERSTITIAL_HIDDEN_EVENT;
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = ON_REWARDED_AD_HIDDEN_EVENT;
    }
    else // APP OPEN
    {
        name = ON_APPOPEN_AD_HIDDEN_EVENT;
    }
    
    [self sendReactNativeEventWithName: name body: [self adInfoForAd: ad]];
}

- (void)didExpandAd:(MAAd *)ad
{
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.banner && adFormat != MAAdFormat.leader && adFormat != MAAdFormat.mrec )
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: ( MAAdFormat.mrec == adFormat ) ? ON_MREC_AD_EXPANDED_EVENT : ON_BANNER_AD_EXPANDED_EVENT
                                  body: [self adInfoForAd: ad]];
}

- (void)didCollapseAd:(MAAd *)ad
{
    MAAdFormat *adFormat = ad.format;
    if ( adFormat != MAAdFormat.banner && adFormat != MAAdFormat.leader && adFormat != MAAdFormat.mrec )
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: ( MAAdFormat.mrec == adFormat ) ? ON_MREC_AD_COLLAPSED_EVENT : ON_BANNER_AD_COLLAPSED_EVENT
                                  body: [self adInfoForAd: ad]];
}

- (void)didPayRevenueForAd:(MAAd *)ad
{
    NSString *name;
    MAAdFormat *adFormat = ad.format;
    if ( MAAdFormat.banner == adFormat || MAAdFormat.leader == adFormat )
    {
        name = ON_BANNER_AD_REVENUE_PAID;
    }
    else if ( MAAdFormat.mrec == adFormat )
    {
        name = ON_MREC_AD_REVENUE_PAID;
    }
    else if ( MAAdFormat.interstitial == adFormat )
    {
        name = ON_INTERSTITIAL_AD_REVENUE_PAID;
    }
    else if ( MAAdFormat.rewarded == adFormat )
    {
        name = ON_REWARDED_AD_REVENUE_PAID;
    }
    else if ( MAAdFormat.appOpen == adFormat )
    {
        name = ON_APPOPEN_AD_REVENUE_PAID;
    }
    else
    {
        [self logInvalidAdFormat: adFormat];
        return;
    }
    
    [self sendReactNativeEventWithName: name body: [self adRevenueInfoForAd: ad]];
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
    
    NSMutableDictionary *body = [@{@"rewardLabel": rewardLabel,
                                   @"rewardAmount": rewardAmount} mutableCopy];
    [body addEntriesFromDictionary: [self adInfoForAd: ad]];
    
    [self sendReactNativeEventWithName: ON_REWARDED_AD_RECEIVED_REWARD_EVENT body: body];
}

#pragma mark - Internal Methods

- (void)createAdViewWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat atPosition:(NSString *)adViewPosition withOffset:(CGPoint)offset
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Creating %@ with ad unit identifier \"%@\", position: \"%@\", and offset: %@", adFormat, adUnitIdentifier, adViewPosition, NSStringFromCGPoint(offset)];
        
        // Retrieve ad view from the map
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: adViewPosition withOffset: offset];
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
        
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: @"" withOffset: CGPointZero];
        adView.placement = placement;
    });
}

- (void)setAdViewCustomData:(nullable NSString *)customData forAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{

        [self log: @"Setting custom data \"%@\" for \"%@\" with ad unit identifier \"%@\"", customData, adFormat, adUnitIdentifier];

        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: @"" withOffset: CGPointZero];
        adView.customData = customData;
    });
}

- (void)setAdViewWidth:(CGFloat)width forAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self log: @"Setting width %f for \"%@\" with ad unit identifier \"%@\"", width, adFormat, adUnitIdentifier];
        
        CGFloat minWidth = adFormat.size.width;
        if ( width < minWidth )
        {
            [self log: @"The provided with: %f is smaller than the minimum required width: %f for ad format: %@. Please set the width higher than the minimum required.", width, minWidth, adFormat];
        }
        
        self.adViewWidths[adUnitIdentifier] = @(width);
        [self positionAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
    });
}

- (void)updateAdViewPosition:(NSString *)adViewPosition withOffset:(CGPoint)offset forAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        self.adViewPositions[adUnitIdentifier] = adViewPosition;
        self.adViewOffsets[adUnitIdentifier] = [NSValue valueWithCGPoint: offset];
        [self positionAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
    });
}

- (void)setAdViewExtraParameterForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat key:(NSString *)key value:(nullable NSString *)value
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Setting %@ extra with key: \"%@\" value: \"%@\"", adFormat, key, value];
        
        MAAdView *adView = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        [adView setExtraParameterForKey: key value: value];
        
        if ( [@"force_banner" isEqualToString: key] && MAAdFormat.mrec != adFormat )
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
        else if ( [@"adaptive_banner" isEqualToString: key] )
        {
            BOOL shouldUseAdaptiveBanner = [NSNumber al_numberWithString: value].boolValue;
            if ( shouldUseAdaptiveBanner )
            {
                [self.disabledAdaptiveBannerAdUnitIdentifiers removeObject: adUnitIdentifier];
            }
            else
            {
                [self.disabledAdaptiveBannerAdUnitIdentifiers addObject: adUnitIdentifier];
            }
            
            [self positionAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        }
    });
}

- (void)startAutoRefresh:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Starting auto refresh \"%@\" with ad unit identifier \"%@\"", adFormat, adUnitIdentifier];
        
        MAAdView *view = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        [view startAutoRefresh];
    });
}

- (void)stopAutoRefresh:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self log: @"Stopping auto refresh \"%@\" with ad unit identifier \"%@\"", adFormat, adUnitIdentifier];
        
        MAAdView *view = [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
        [view stopAutoRefresh];
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
        view.revenueDelegate = nil;
        
        [view removeFromSuperview];
        
        [self.adViews removeObjectForKey: adUnitIdentifier];
        [self.adViewPositions removeObjectForKey: adUnitIdentifier];
        [self.adViewOffsets removeObjectForKey: adUnitIdentifier];
        [self.adViewWidths removeObjectForKey: adUnitIdentifier];
        [self.adViewAdFormats removeObjectForKey: adUnitIdentifier];
    });
}

- (MAInterstitialAd *)retrieveInterstitialForAdUnitIdentifier:(NSString *)adUnitIdentifier
{
    MAInterstitialAd *result = self.interstitials[adUnitIdentifier];
    if ( !result )
    {
        result = [[MAInterstitialAd alloc] initWithAdUnitIdentifier: adUnitIdentifier sdk: self.sdk];
        result.delegate = self;
        result.revenueDelegate = self;
        
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
        result.revenueDelegate = self;
        
        self.rewardedAds[adUnitIdentifier] = result;
    }
    
    return result;
}

- (MAAppOpenAd *)retrieveAppOpenAdForAdUnitIdentifier:(NSString *)adUnitIdentifier
{
    MAAppOpenAd *result = self.appOpenAds[adUnitIdentifier];
    if ( !result )
    {
        result = [[MAAppOpenAd alloc] initWithAdUnitIdentifier: adUnitIdentifier sdk: self.sdk];
        result.delegate = self;
        result.revenueDelegate = self;
        
        self.appOpenAds[adUnitIdentifier] = result;
    }
    
    return result;
}

- (MAAdView *)retrieveAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    return [self retrieveAdViewForAdUnitIdentifier: adUnitIdentifier adFormat: adFormat atPosition: nil withOffset: CGPointZero];
}

- (MAAdView *)retrieveAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat atPosition:(NSString *)adViewPosition withOffset:(CGPoint)offset
{
    MAAdView *result = self.adViews[adUnitIdentifier];
    if ( !result && adViewPosition )
    {
        result = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat sdk: self.sdk];
        result.delegate = self;
        result.revenueDelegate = self;
        result.userInteractionEnabled = NO;
        result.translatesAutoresizingMaskIntoConstraints = NO;
        
        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        [result setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];

        self.adViews[adUnitIdentifier] = result;
        self.adViewPositions[adUnitIdentifier] = adViewPosition;
        self.adViewOffsets[adUnitIdentifier] = [NSValue valueWithCGPoint: offset];
        [ROOT_VIEW_CONTROLLER.view addSubview: result];
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
    BOOL isAdaptiveBannerDisabled = [self.disabledAdaptiveBannerAdUnitIdentifiers containsObject: adUnitIdentifier];
    BOOL isWidthPtsOverridden = self.adViewWidths[adUnitIdentifier] != nil;
    
    NSValue *adViewPositionValue = self.adViewOffsets[adUnitIdentifier];
    CGPoint adViewOffset = [adViewPositionValue CGPointValue];
    CGFloat xOffset = adViewOffset.x;
    CGFloat yOffset = adViewOffset.y;
    
    // Y offset needs to be inverted (eg 50 -> -50) to pad from right
    if ( [adViewPosition containsString: @"right" ] )
    {
        xOffset = -xOffset;
    }
    
    // Y offset needs to be inverted (eg 50 -> -50) to pad from bottom
    if ( [adViewPosition containsString: @"bottom" ] )
    {
        yOffset = -yOffset;
    }
    
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
    
    //
    // Determine ad width
    //
    CGFloat adViewWidth;
    
    // Check if publisher has overridden width as points
    if ( isWidthPtsOverridden )
    {
        adViewWidth = self.adViewWidths[adUnitIdentifier].floatValue;
    }
    // Top center / bottom center stretches full screen
    else if ( [adViewPosition isEqual: TOP_CENTER] || [adViewPosition isEqual: BOTTOM_CENTER] )
    {
        adViewWidth = CGRectGetWidth(KEY_WINDOW.bounds);
    }
    // Else use standard widths of 320, 728, or 300
    else
    {
        adViewWidth = adFormat.size.width;
    }
    
    //
    // Determine ad height
    //
    CGFloat adViewHeight;
    
    if ( (adFormat == MAAdFormat.banner || adFormat == MAAdFormat.leader) && !isAdaptiveBannerDisabled )
    {
        adViewHeight = [adFormat adaptiveSizeForWidth: adViewWidth].height;
    }
    else
    {
        adViewHeight = adFormat.size.height;
    }
    
    CGSize adViewSize = CGSizeMake(adViewWidth, adViewHeight);
    
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
    if ( [adViewPosition isEqual: TOP_CENTER] || [adViewPosition isEqual: BOTTOM_CENTER] )
    {
        // Non AdMob banners will still be of 50/90 points tall. Set the auto sizing mask such that the inner ad view is pinned to the bottom or top according to the ad view position.
        if ( !isAdaptiveBannerDisabled )
        {
            adView.autoresizingMask = UIViewAutoresizingFlexibleWidth;
            
            if ( [TOP_CENTER isEqual: adViewPosition] )
            {
                adView.autoresizingMask |= UIViewAutoresizingFlexibleBottomMargin;
            }
            else // bottom_center
            {
                adView.autoresizingMask |= UIViewAutoresizingFlexibleTopMargin;
            }
        }
        
        // If publisher actually provided a banner background color, span the banner across the realm
        if ( self.publisherBannerBackgroundColor && adFormat != MAAdFormat.mrec && CGPointEqualToPoint(adViewOffset, CGPointZero) )
        {
            [constraints addObjectsFromArray: @[[adView.widthAnchor constraintEqualToConstant: adViewWidth],
                                                [adView.centerXAnchor constraintEqualToAnchor: layoutGuide.centerXAnchor],
                                                [self.safeAreaBackground.widthAnchor constraintEqualToConstant: adViewWidth],
                                                [self.safeAreaBackground.centerXAnchor constraintEqualToAnchor: layoutGuide.centerXAnchor]]];
            
            if ( [adViewPosition isEqual: TOP_CENTER] )
            {
                [constraints addObjectsFromArray: @[[adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor],
                                                    [self.safeAreaBackground.topAnchor constraintEqualToAnchor: superview.topAnchor],
                                                    [self.safeAreaBackground.bottomAnchor constraintEqualToAnchor: adView.topAnchor]]];
            }
            else // bottom_center
            {
                [constraints addObjectsFromArray: @[[adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor],
                                                    [self.safeAreaBackground.topAnchor constraintEqualToAnchor: adView.bottomAnchor],
                                                    [self.safeAreaBackground.bottomAnchor constraintEqualToAnchor: superview.bottomAnchor]]];
            }
        }
        // If pub does not have a background color set - we shouldn't span the banner the width of the realm (there might be user-interactable UI on the sides)
        else
        {
            self.safeAreaBackground.hidden = YES;
            
            // Assign constant width of 320 or 728
            [constraints addObjectsFromArray: @[[adView.widthAnchor constraintEqualToConstant: adViewWidth],
                                                [adView.centerXAnchor constraintEqualToAnchor: layoutGuide.centerXAnchor]]];
            
            if ( [adViewPosition isEqual: TOP_CENTER] )
            {
                [constraints addObject: [adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor constant: yOffset]];
            }
            else // BottomCenter
            {
                [constraints addObject: [adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor constant: yOffset]];
            }
        }
    }
    // Otherwise, publisher will likely construct his own views around the adview
    else
    {
        self.safeAreaBackground.hidden = YES;
        
        // Assign constant width of 320 or 728
        [constraints addObject: [adView.widthAnchor constraintEqualToConstant: adViewWidth]];
        
        if ( [adViewPosition isEqual: TOP_LEFT] )
        {
            [constraints addObjectsFromArray: @[[adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor constant: yOffset],
                                                [adView.leftAnchor constraintEqualToAnchor: superview.leftAnchor constant: xOffset]]];
        }
        else if ( [adViewPosition isEqual: TOP_RIGHT] )
        {
            [constraints addObjectsFromArray: @[[adView.topAnchor constraintEqualToAnchor: layoutGuide.topAnchor constant: yOffset],
                                                [adView.rightAnchor constraintEqualToAnchor: superview.rightAnchor constant: xOffset]]];
        }
        else if ( [adViewPosition isEqual: CENTERED] )
        {
            [constraints addObjectsFromArray: @[[adView.centerXAnchor constraintEqualToAnchor: layoutGuide.centerXAnchor],
                                                [adView.centerYAnchor constraintEqualToAnchor: layoutGuide.centerYAnchor]]];
        }
        else if ( [adViewPosition isEqual: BOTTOM_LEFT] )
        {
            [constraints addObjectsFromArray: @[[adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor constant: yOffset],
                                                [adView.leftAnchor constraintEqualToAnchor: superview.leftAnchor constant: xOffset]]];
        }
        else if ( [adViewPosition isEqual: BOTTOM_RIGHT] )
        {
            [constraints addObjectsFromArray: @[[adView.bottomAnchor constraintEqualToAnchor: layoutGuide.bottomAnchor constant: yOffset],
                                                [adView.rightAnchor constraintEqualToAnchor: superview.rightAnchor constant: xOffset]]];
        }
    }
    
    self.adViewConstraints[adUnitIdentifier] = constraints;
    
    [NSLayoutConstraint activateConstraints: constraints];
}

- (void)setPendingExtraParametersIfNeeded:(ALSdkSettings *)settings
{
    if ( self.extraParametersToSet.count <= 0 ) return;
    
    for ( NSString *key in self.extraParametersToSet.allKeys )
    {
        [settings setExtraParameterForKey: key value: self.extraParametersToSet[key]];
    }

    [self.extraParametersToSet removeAllObjects];
}

- (void)logInvalidAdFormat:(MAAdFormat *)adFormat
{
    [self log: @"invalid ad format: %@, from %@", adFormat, [NSThread callStackSymbols]];
}

- (void)logUninitializedAccessError:(NSString *)callingMethod
{
    [self log: @"ERROR: Failed to execute %@() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!", callingMethod];
}

- (void)log:(NSString *)format, ...
{
    va_list valist;
    va_start(valist, format);
    NSString *message = [[NSString alloc] initWithFormat: format arguments: valist];
    va_end(valist);
    
    NSLog(@"[%@] [%@] %@", SDK_TAG, TAG, message);
}

- (ALGender)toAppLovinGender:(nullable NSString *)gender
{
    if ( gender )
    {
        if ( [@"F" al_isEqualToStringIgnoringCase: gender] )
        {
            return ALGenderFemale;
        }
        else if ( [@"M" al_isEqualToStringIgnoringCase: gender] )
        {
            return ALGenderMale;
        }
        else if ( [@"O" al_isEqualToStringIgnoringCase: gender] )
        {
            return ALGenderOther;
        }
    }
    
    return ALGenderUnknown;
}

- (ALAdContentRating)toAppLovinAdContentRating:(nullable NSNumber *)maximumAdContentRating
{
    if ( maximumAdContentRating )
    {
        int intVal = maximumAdContentRating.intValue;
        
        if ( intVal == 1 )
        {
            return ALAdContentRatingAllAudiences;
        }
        else if ( intVal == 2 )
        {
            return ALAdContentRatingEveryoneOverTwelve;
        }
        else if ( intVal == 3 )
        {
            return ALAdContentRatingMatureAudiences;
        }
    }
    
    return ALAdContentRatingNone;
}

#pragma mark - Ad Info

- (NSDictionary<NSString *, id> *)adInfoForAd:(MAAd *)ad
{
    return @{@"adUnitId" : ad.adUnitIdentifier,
             @"creativeId" : ad.creativeIdentifier ?: @"",
             @"networkName" : ad.networkName,
             @"placement" : ad.placement ?: @"",
             @"revenue" : @(ad.revenue),
             @"waterfall": [self createAdWaterfallInfo: ad.waterfall],
             @"dspName" : ad.DSPName ?: @""};
}

- (NSDictionary<NSString *, id> *)adLoadFailedInfoForAd:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    return ( error ) ?
        @{@"adUnitId": adUnitIdentifier,
          @"code" : @(error.code),
          @"message" : error.message,
          @"adLoadFailureInfo" : error.adLoadFailureInfo ?: @"",
          @"waterfall": [self createAdWaterfallInfo: error.waterfall]}
    :
        @{@"adUnitId": adUnitIdentifier,
          @"code" : @(MAErrorCodeUnspecified)};
}

- (NSDictionary<NSString *, id> *)adDisplayFailedInfoForAd:(MAAd *)ad withError:(MAError *)error
{
    NSMutableDictionary *body = [@{@"code" : @(error.code),
                                   @"message" : error.message} mutableCopy];
    [body addEntriesFromDictionary: [self adInfoForAd: ad]];
    return body;
}

- (NSDictionary<NSString *, id> *)adRevenueInfoForAd:(MAAd *)ad
{
    NSMutableDictionary *body = [self adInfoForAd: ad].mutableCopy;
    body[@"networkPlacement"] = ad.networkPlacement;
    body[@"revenuePrecision"] = ad.revenuePrecision;
    body[@"countryCode"] = self.sdk.configuration.countryCode;
    return body;
}

#pragma mark - Waterfall Information

- (NSDictionary<NSString *, id> *)createAdWaterfallInfo:(MAAdWaterfallInfo *)waterfallInfo
{
    NSMutableDictionary<NSString *, NSObject *> *waterfallInfoDict = [NSMutableDictionary dictionary];
    if ( !waterfallInfo ) return waterfallInfoDict;
    
    waterfallInfoDict[@"name"] = waterfallInfo.name;
    waterfallInfoDict[@"testName"] = waterfallInfo.testName;
    
    NSMutableArray<NSDictionary<NSString *, NSObject *> *> *networkResponsesArray = [NSMutableArray arrayWithCapacity: waterfallInfo.networkResponses.count];
    for ( MANetworkResponseInfo *response in  waterfallInfo.networkResponses )
    {
        [networkResponsesArray addObject: [self createNetworkResponseInfo: response]];
    }
    waterfallInfoDict[@"networkResponses"] = networkResponsesArray;
    
    // Convert latency from seconds to milliseconds to match Android.
    long long latencyMillis = waterfallInfo.latency * 1000;
    waterfallInfoDict[@"latencyMillis"] = @(latencyMillis);
    
    return waterfallInfoDict;
}

- (NSDictionary<NSString *, id> *)createNetworkResponseInfo:(MANetworkResponseInfo *)response
{
    NSMutableDictionary<NSString *, NSObject *> *networkResponseDict = [NSMutableDictionary dictionary];
    
    networkResponseDict[@"adLoadState"] = @(response.adLoadState);
    
    MAMediatedNetworkInfo *mediatedNetworkInfo = response.mediatedNetwork;
    if ( mediatedNetworkInfo )
    {
        NSMutableDictionary <NSString *, NSObject *> *networkInfoObject = [NSMutableDictionary dictionary];
        networkInfoObject[@"name"] = mediatedNetworkInfo.name;
        networkInfoObject[@"adapterClassName"] = mediatedNetworkInfo.adapterClassName;
        networkInfoObject[@"adapterVersion"] = mediatedNetworkInfo.adapterVersion;
        networkInfoObject[@"sdkVersion"] = mediatedNetworkInfo.sdkVersion;
        
        networkResponseDict[@"mediatedNetwork"] = networkInfoObject;
    }
    
    networkResponseDict[@"credentials"] = response.credentials;
    
    MAError *error = response.error;
    if ( error )
    {
        NSMutableDictionary<NSString *, NSObject *> *errorObject = [NSMutableDictionary dictionary];
        errorObject[@"message"] = error.message;
        errorObject[@"adLoadFailure"] = error.adLoadFailureInfo;
        errorObject[@"code"] = @(error.code);
        
        networkResponseDict[@"error"] = errorObject;
    }
    
    // Convert latency from seconds to milliseconds to match Android.
    long long latencySeconds = response.latency * 1000;
    networkResponseDict[@"latencyMillis"] = @(latencySeconds);
    
    return networkResponseDict;
}

#pragma mark - React Native Event Bridge

- (void)sendReactNativeEventWithName:(NSString *)name body:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: name body: body];
}

// From RCTBridgeModule protocol
- (NSArray<NSString *> *)supportedEvents
{
    return @[ON_MREC_AD_LOADED_EVENT,
             ON_MREC_AD_LOAD_FAILED_EVENT,
             ON_MREC_AD_CLICKED_EVENT,
             ON_MREC_AD_COLLAPSED_EVENT,
             ON_MREC_AD_EXPANDED_EVENT,
             ON_MREC_AD_REVENUE_PAID,
             
             ON_BANNER_AD_LOADED_EVENT,
             ON_BANNER_AD_LOAD_FAILED_EVENT,
             ON_BANNER_AD_CLICKED_EVENT,
             ON_BANNER_AD_COLLAPSED_EVENT,
             ON_BANNER_AD_EXPANDED_EVENT,
             ON_BANNER_AD_REVENUE_PAID,
             
             ON_INTERSTITIAL_LOADED_EVENT,
             ON_INTERSTITIAL_LOAD_FAILED_EVENT,
             ON_INTERSTITIAL_CLICKED_EVENT,
             ON_INTERSTITIAL_DISPLAYED_EVENT,
             ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT,
             ON_INTERSTITIAL_HIDDEN_EVENT,
             ON_INTERSTITIAL_AD_REVENUE_PAID,
             
             ON_REWARDED_AD_LOADED_EVENT,
             ON_REWARDED_AD_LOAD_FAILED_EVENT,
             ON_REWARDED_AD_CLICKED_EVENT,
             ON_REWARDED_AD_DISPLAYED_EVENT,
             ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT,
             ON_REWARDED_AD_HIDDEN_EVENT,
             ON_REWARDED_AD_RECEIVED_REWARD_EVENT,
             ON_REWARDED_AD_REVENUE_PAID,
             
             ON_APPOPEN_AD_LOADED_EVENT,
             ON_APPOPEN_AD_LOAD_FAILED_EVENT,
             ON_APPOPEN_AD_CLICKED_EVENT,
             ON_APPOPEN_AD_DISPLAYED_EVENT,
             ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT,
             ON_APPOPEN_AD_HIDDEN_EVENT,
             ON_APPOPEN_AD_REVENUE_PAID];
}

- (NSDictionary *)constantsToExport
{
    return @{@"ON_MREC_AD_LOADED_EVENT": ON_MREC_AD_LOADED_EVENT,
             @"ON_MREC_AD_LOAD_FAILED_EVENT" : ON_MREC_AD_LOAD_FAILED_EVENT,
             @"ON_MREC_AD_CLICKED_EVENT" : ON_MREC_AD_CLICKED_EVENT,
             @"ON_MREC_AD_COLLAPSED_EVENT" : ON_MREC_AD_COLLAPSED_EVENT,
             @"ON_MREC_AD_EXPANDED_EVENT" : ON_MREC_AD_EXPANDED_EVENT,
             @"ON_MREC_AD_REVENUE_PAID" : ON_MREC_AD_REVENUE_PAID,
             
             @"ON_BANNER_AD_LOADED_EVENT" : ON_BANNER_AD_LOADED_EVENT,
             @"ON_BANNER_AD_LOAD_FAILED_EVENT" : ON_BANNER_AD_LOAD_FAILED_EVENT,
             @"ON_BANNER_AD_CLICKED_EVENT" : ON_BANNER_AD_CLICKED_EVENT,
             @"ON_BANNER_AD_COLLAPSED_EVENT" : ON_BANNER_AD_COLLAPSED_EVENT,
             @"ON_BANNER_AD_EXPANDED_EVENT" : ON_BANNER_AD_EXPANDED_EVENT,
             @"ON_BANNER_AD_REVENUE_PAID" : ON_BANNER_AD_REVENUE_PAID,
             
             @"ON_INTERSTITIAL_LOADED_EVENT" : ON_INTERSTITIAL_LOADED_EVENT,
             @"ON_INTERSTITIAL_LOAD_FAILED_EVENT" : ON_INTERSTITIAL_LOAD_FAILED_EVENT,
             @"ON_INTERSTITIAL_CLICKED_EVENT" : ON_INTERSTITIAL_CLICKED_EVENT,
             @"ON_INTERSTITIAL_DISPLAYED_EVENT" : ON_INTERSTITIAL_DISPLAYED_EVENT,
             @"ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT" : ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT,
             @"ON_INTERSTITIAL_HIDDEN_EVENT" : ON_INTERSTITIAL_HIDDEN_EVENT,
             @"ON_INTERSTITIAL_AD_REVENUE_PAID" : ON_INTERSTITIAL_AD_REVENUE_PAID,
             
             @"ON_REWARDED_AD_LOADED_EVENT" : ON_REWARDED_AD_LOADED_EVENT,
             @"ON_REWARDED_AD_LOAD_FAILED_EVENT" : ON_REWARDED_AD_LOAD_FAILED_EVENT,
             @"ON_REWARDED_AD_CLICKED_EVENT" : ON_REWARDED_AD_CLICKED_EVENT,
             @"ON_REWARDED_AD_DISPLAYED_EVENT" : ON_REWARDED_AD_DISPLAYED_EVENT,
             @"ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT" : ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT,
             @"ON_REWARDED_AD_HIDDEN_EVENT" : ON_REWARDED_AD_HIDDEN_EVENT,
             @"ON_REWARDED_AD_RECEIVED_REWARD_EVENT" : ON_REWARDED_AD_RECEIVED_REWARD_EVENT,
             @"ON_REWARDED_AD_REVENUE_PAID" : ON_REWARDED_AD_REVENUE_PAID,
             
             @"ON_APPOPEN_AD_LOADED_EVENT" : ON_APPOPEN_AD_LOADED_EVENT,
             @"ON_APPOPEN_AD_LOAD_FAILED_EVENT" : ON_APPOPEN_AD_LOAD_FAILED_EVENT,
             @"ON_APPOPEN_AD_CLICKED_EVENT" : ON_APPOPEN_AD_CLICKED_EVENT,
             @"ON_APPOPEN_AD_DISPLAYED_EVENT" : ON_APPOPEN_AD_DISPLAYED_EVENT,
             @"ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT" : ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT,
             @"ON_APPOPEN_AD_HIDDEN_EVENT" : ON_APPOPEN_AD_HIDDEN_EVENT,
             @"ON_APPOPEN_AD_REVENUE_PAID" : ON_APPOPEN_AD_REVENUE_PAID,
             
             @"TOP_CENTER_POSITION" : TOP_CENTER,
             @"TOP_LEFT_POSITION" : TOP_LEFT,
             @"TOP_RIGHT_POSITION" : TOP_RIGHT,
             @"CENTERED_POSITION" : CENTERED,
             @"CENTER_LEFT_POSITION" : CENTER_LEFT,
             @"CENTER_RIGHT_POSITION" : CENTER_RIGHT,
             @"BOTTOM_LEFT_POSITION" : BOTTOM_LEFT,
             @"BOTTOM_CENTER_POSITION" : BOTTOM_CENTER,
             @"BOTTOM_RIGHT_POSITION" : BOTTOM_RIGHT,
             
             @"BANNER_AD_FORMAT_LABEL" : MAAdFormat.banner.label,
             @"MREC_AD_FORMAT_LABEL" : MAAdFormat.mrec.label};
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
