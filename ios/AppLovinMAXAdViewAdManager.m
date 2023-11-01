#import "AppLovinMAX.h"
#import "AppLovinMAXAdViewAdManager.h"
#import "AppLovinMAXAdViewAd.h"

static NSString *const ON_ADVIEW_AD_LOADED_EVENT = @"OnAdViewAdLoadedEvent";
static NSString *const ON_ADVIEW_AD_LOAD_FAILED_EVENT = @"OnAdViewAdLoadFailedEvent";
static NSString *const ON_ADVIEW_AD_CLICKED_EVENT = @"OnAdViewAdClickedEvent";
static NSString *const ON_ADVIEW_AD_COLLAPSED_EVENT = @"OnAdViewAdCollapsedEvent";
static NSString *const ON_ADVIEW_AD_EXPANDED_EVENT = @"OnAdViewAdExpandedEvent";
static NSString *const ON_ADVIEW_AD_DISPLAY_FAILED_EVENT = @"OnAdViewAdDisplayFailedEvent";
static NSString *const ON_ADVIEW_AD_REVENUE_PAID = @"OnAdViewAdRevenuePaid";

@interface AppLovinMAXAdViewAdManager()
@property (nonatomic, strong) NSMutableDictionary<NSNumber *, AppLovinMAXAdViewAd *> *adViewAds;
@end

@implementation AppLovinMAXAdViewAdManager

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (instancetype)init
{
    self = [super init];
    if ( self )
    {
        self.adViewAds = [NSMutableDictionary dictionaryWithCapacity: 2];
    }
    return self;
}

- (AppLovinMAXAdViewAd *)adViewAd:(nonnull NSNumber *)adViewAdId
{
    return self.adViewAds[adViewAdId];
}

RCT_EXPORT_METHOD(createAdView:(NSString *)adUnitIdentifier :(NSString *)adFormatStr :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    if ( ![adUnitIdentifier al_isValidString] )
    {
        reject(RCTErrorUnspecified, @"Attempting to attach MAAdView without Ad Unit ID", nil);
        return;
    }

    MAAdFormat *adFormat;
    
    if ( [MAAdFormat.banner.label isEqualToString: adFormatStr] )
    {
        adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [MAAdFormat.mrec.label isEqualToString: adFormatStr] )
    {
        adFormat = MAAdFormat.mrec;
    }
    else
    {
        NSString *error = [NSString stringWithFormat: @"Attempting to set an invalid ad format of %@ for %@!", adFormatStr, adUnitIdentifier];
        reject(RCTErrorUnspecified, error, nil);
        return;
    }
    
    AppLovinMAXAdViewAd *adViewAd = [[AppLovinMAXAdViewAd alloc] initWithManager: self];
    NSNumber *adViewAdId = [adViewAd createAdView: adUnitIdentifier adFormat: adFormat];
    self.adViewAds[adViewAdId] = adViewAd;
    resolve(adViewAdId);
}

RCT_EXPORT_METHOD(destroyAdView:(nonnull NSNumber *)adViewAdId :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    [adViewAd destroyAdView];
    [self.adViewAds removeObjectForKey: adViewAdId];
    resolve(nil);
}

RCT_EXPORT_METHOD(loadAd:(nonnull NSNumber *)adViewAdId :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    [adViewAd loadAd];
    resolve(nil);
}

RCT_EXPORT_METHOD(setPlacement:(nonnull NSNumber *)adViewAdId :(nullable NSString *)placement :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    adViewAd.placement = placement;
    resolve(nil);
}

RCT_EXPORT_METHOD(setCustomData:(nonnull NSNumber *)adViewAdId :(nullable NSString *)customData :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    adViewAd.customData = customData;
    resolve(nil);
}

RCT_EXPORT_METHOD(setAdaptiveBannerEnabled:(nonnull NSNumber *)adViewAdId :(BOOL)adaptiveBannerEnabled :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    adViewAd.adaptiveBannerEnabled = adaptiveBannerEnabled;
    resolve(nil);
}

RCT_EXPORT_METHOD(setAutoRefresh:(nonnull NSNumber *)adViewAdId :(BOOL)autoRefresh :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    adViewAd.autoRefresh = autoRefresh;
    resolve(nil);
}

RCT_EXPORT_METHOD(setExtraParameters:(nonnull NSNumber *)adViewAdId :(NSDictionary<NSString *, id> *)parameterDict :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    adViewAd.extraParameters = parameterDict;
    resolve(nil);
}

RCT_EXPORT_METHOD(setLocalExtraParameters:(nonnull NSNumber *)adViewAdId :(NSDictionary<NSString *, id> *)parameterDict :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    AppLovinMAXAdViewAd *adViewAd = self.adViewAds[adViewAdId];
    adViewAd.localExtraParameters = parameterDict;
    resolve(nil);
}

- (void)sendLoadAdEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_LOADED_EVENT body: body];
}

- (void)sendFailToDisplayAEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_DISPLAY_FAILED_EVENT body: body];
}

- (void)sendFailToLoadAdEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_LOAD_FAILED_EVENT body: body];
}

- (void)sendClickAdEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_CLICKED_EVENT body: body];
}

- (void)sendCollapseAdEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_COLLAPSED_EVENT body: body];
}

- (void)sendExpandAdEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_EXPANDED_EVENT body: body];
}

- (void)sendPayRevenueEvent:(NSDictionary<NSString *, id> *)body
{
    [self sendEventWithName: ON_ADVIEW_AD_REVENUE_PAID body: body];
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[ON_ADVIEW_AD_LOADED_EVENT,
             ON_ADVIEW_AD_LOAD_FAILED_EVENT,
             ON_ADVIEW_AD_CLICKED_EVENT,
             ON_ADVIEW_AD_COLLAPSED_EVENT,
             ON_ADVIEW_AD_EXPANDED_EVENT,
             ON_ADVIEW_AD_DISPLAY_FAILED_EVENT,
             ON_ADVIEW_AD_REVENUE_PAID];
}

- (NSDictionary *)constantsToExport
{
    return @{@"ON_ADVIEW_AD_LOADED_EVENT" : ON_ADVIEW_AD_LOADED_EVENT,
             @"ON_ADVIEW_AD_LOAD_FAILED_EVENT" : ON_ADVIEW_AD_LOAD_FAILED_EVENT,
             @"ON_ADVIEW_AD_CLICKED_EVENT" : ON_ADVIEW_AD_CLICKED_EVENT,
             @"ON_ADVIEW_AD_COLLAPSED_EVENT" : ON_ADVIEW_AD_COLLAPSED_EVENT,
             @"ON_ADVIEW_AD_EXPANDED_EVENT" : ON_ADVIEW_AD_EXPANDED_EVENT,
             @"ON_ADVIEW_AD_DISPLAY_FAILED_EVENT" : ON_ADVIEW_AD_DISPLAY_FAILED_EVENT,
             @"ON_ADVIEW_AD_REVENUE_PAID" : ON_ADVIEW_AD_REVENUE_PAID};
}

@end
