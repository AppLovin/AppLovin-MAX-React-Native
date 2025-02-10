//
//  AppLovinMAXNativeAdView.m
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManagerUtils.h>
#import <React/RCTImageView.h>
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNAppLovinMAXSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNAppLovinMAXSpec/EventEmitters.h>
#import <react/renderer/components/RNAppLovinMAXSpec/Props.h>
#import <react/renderer/components/RNAppLovinMAXSpec/RCTComponentViewHelpers.h>
#import <React/RCTConversions.h>
#import "RCTFabricComponentsPlugins.h"

@interface RCTBridge (Private)
+ (RCTBridge *)currentBridge;
@end

using namespace facebook::react;

#endif

#define TITLE_LABEL_TAG          1
#define MEDIA_VIEW_CONTAINER_TAG 2
#define ICON_VIEW_TAG            3
#define BODY_VIEW_TAG            4
#define CALL_TO_ACTION_VIEW_TAG  5
#define ADVERTISER_VIEW_TAG      8

@interface MANativeAdLoader()
- (void)registerClickableViews:(NSArray<UIView *> *)clickableViews
                 withContainer:(UIView *)container
                         forAd:(MAAd *)ad;
- (void)handleNativeAdViewRenderedForAd:(MAAd *)ad;
@end

#ifdef RCT_NEW_ARCH_ENABLED
@interface AppLovinMAXNativeAdView()<RCTAppLovinMAXNativeAdViewViewProtocol, MANativeAdDelegate, MAAdRevenueDelegate>
#else
@interface AppLovinMAXNativeAdView()<MANativeAdDelegate, MAAdRevenueDelegate>
#endif

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong, nullable) MANativeAdLoader *adLoader;
@property (nonatomic, strong, nullable) MAAd *nativeAd;
@property (nonatomic, strong) ALAtomicBoolean *isLoading; // Guard against repeated ad loads
@property (nonatomic, strong) ALAtomicBoolean *isAdUnitIdSet;

// JavaScript properties
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSArray<NSDictionary *> *extraParameters;
@property (nonatomic, copy, nullable) NSArray<NSDictionary *> *localExtraParameters;

// Callback to `AppLovinNativeAdView.js`
@property (nonatomic, copy) RCTDirectEventBlock onAdLoadedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdLoadFailedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdClickedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdRevenuePaidEvent;

// TODO: Allow publisher to select which views are clickable and which isn't via prop
@property (nonatomic, strong) NSMutableArray<UIView *> *clickableViews;

@end

@implementation AppLovinMAXNativeAdView

#ifdef RCT_NEW_ARCH_ENABLED

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<AppLovinMAXNativeAdViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    
    _props = std::make_shared<const AppLovinMAXNativeAdViewProps>();
    
    if ( self )
    {
        self.bridge = [RCTBridge currentBridge];
        self.isLoading = [[ALAtomicBoolean alloc] init];
        self.isAdUnitIdSet = [[ALAtomicBoolean alloc] init];
        self.clickableViews = [NSMutableArray array];
        
        [self setupEventHandlers];
    }
    
    return self;
}

- (void)setupEventHandlers
{
    self.onAdLoadedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            NSDictionary *adInfo = [event valueForKey: @"adInfo"];
            NSDictionary *adInfoNativeAd = [adInfo valueForKey: @"nativeAd"];
            NSDictionary *nativeAd = [event valueForKey: @"nativeAd"];
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdLoadedEvent result =
            {
                .adInfo = {
                    .adUnitId = std::string([[adInfo valueForKey: @"adUnitId"] UTF8String]),
                    .adFormat = std::string([MAAdFormat.native.label UTF8String]),
                    .networkName = std::string([[adInfo valueForKey: @"networkName"] UTF8String]),
                    .networkPlacement = std::string([[adInfo valueForKey: @"networkPlacement"] UTF8String]),
                    .creativeId = std::string([[adInfo valueForKey: @"creativeId"] UTF8String]),
                    .placement = std::string([[adInfo valueForKey: @"placement"] UTF8String]),
                    .revenue = [[adInfo valueForKey: @"revenue"] doubleValue],
                    .revenuePrecision = std::string([[adInfo valueForKey: @"revenuePrecision"] UTF8String]),
                    .dspName = std::string([[adInfo valueForKey: @"dspName"] UTF8String]),
                    .latencyMillis = [[adInfo valueForKey: @"latencyMillis"] intValue],
                    .nativeAd = {
                        .title = std::string([[adInfoNativeAd valueForKey: @"title"] UTF8String]),
                        .advertiser = std::string([[adInfoNativeAd valueForKey: @"advertiser"] UTF8String]),
                        .body = std::string([[adInfoNativeAd valueForKey: @"body"] UTF8String]),
                        .callToAction = std::string([[adInfoNativeAd valueForKey: @"callToAction"] UTF8String]),
                        .starRating = [[adInfoNativeAd valueForKey: @"starRating"] doubleValue],
                        .mediaContentAspectRatio = [[adInfoNativeAd valueForKey: @"mediaContentAspectRatio"] doubleValue],
                        .isIconImageAvailable = [[adInfoNativeAd valueForKey: @"isIconImageAvailable"] boolValue],
                        .isOptionsViewAvailable = [[adInfoNativeAd valueForKey: @"isOptionsViewAvailable"] boolValue],
                        .isMediaViewAvailable = [[adInfoNativeAd valueForKey: @"isMediaViewAvailable"] boolValue],
                    }
                },
                .nativeAd = {
                    .title = std::string([[nativeAd valueForKey: @"title"] UTF8String]),
                    .advertiser = std::string([[nativeAd valueForKey: @"advertiser"] UTF8String]),
                    .body = std::string([[nativeAd valueForKey: @"body"] UTF8String]),
                    .callToAction = std::string([[nativeAd valueForKey: @"callToAction"] UTF8String]),
                    .image = [[nativeAd valueForKey: @"starRating"] boolValue],
                    .url = std::string([[nativeAd valueForKey: @"url"] UTF8String]),
                    .starRating = [[nativeAd valueForKey: @"starRating"] doubleValue],
                    .isOptionsViewAvailable = [[nativeAd valueForKey: @"isOptionsViewAvailable"] boolValue],
                    .isMediaViewAvailable = [[nativeAd valueForKey: @"isMediaViewAvailable"] boolValue],
                }
            };
            
            adViewEventEmitter->onAdLoadedEvent(result);
        }
    };
    
    self.onAdLoadFailedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdLoadFailedEvent result =
            {
                .adUnitId = std::string([[event valueForKey: @"adUnitId"] UTF8String]),
                .code = [[event valueForKey: @"code"] intValue],
                .message = std::string([[event valueForKey: @"message"] UTF8String]),
                .mediatedNetworkErrorCode = [[event valueForKey: @"mediatedNetworkErrorCode"] intValue],
                .mediatedNetworkErrorMessage = std::string([[event valueForKey: @"mediatedNetworkErrorMessage"] UTF8String]),
                .adLoadFailureInfo = std::string([[event valueForKey: @"adLoadFailureInfo"] UTF8String]),
            };
            
            adViewEventEmitter->onAdLoadFailedEvent(result);
        }
    };
    
    self.onAdClickedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdClickedEvent result =
            {
                .adUnitId = std::string([[event valueForKey: @"adUnitId"] UTF8String]),
                .adFormat = std::string([MAAdFormat.native.label UTF8String]),
                .networkName = std::string([[event valueForKey: @"networkName"] UTF8String]),
                .networkPlacement = std::string([[event valueForKey: @"networkPlacement"] UTF8String]),
                .creativeId = std::string([[event valueForKey: @"creativeId"] UTF8String]),
                .placement = std::string([[event valueForKey: @"placement"] UTF8String]),
                .revenue = [[event valueForKey: @"revenue"] doubleValue],
                .revenuePrecision = std::string([[event valueForKey: @"revenuePrecision"] UTF8String]),
                .dspName = std::string([[event valueForKey: @"dspName"] UTF8String]),
                .latencyMillis = [[event valueForKey: @"latencyMillis"] intValue],
            };
            
            adViewEventEmitter->onAdClickedEvent(result);
        }
    };
    
    self.onAdRevenuePaidEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdRevenuePaidEvent result =
            {
                .adUnitId = std::string([[event valueForKey: @"adUnitId"] UTF8String]),
                .adFormat = std::string([MAAdFormat.native.label UTF8String]),
                .networkName = std::string([[event valueForKey: @"networkName"] UTF8String]),
                .networkPlacement = std::string([[event valueForKey: @"networkPlacement"] UTF8String]),
                .creativeId = std::string([[event valueForKey: @"creativeId"] UTF8String]),
                .placement = std::string([[event valueForKey: @"placement"] UTF8String]),
                .revenue = [[event valueForKey: @"revenue"] doubleValue],
                .revenuePrecision = std::string([[event valueForKey: @"revenuePrecision"] UTF8String]),
                .dspName = std::string([[event valueForKey: @"dspName"] UTF8String]),
                .latencyMillis = [[event valueForKey: @"latencyMillis"] intValue],
            };
            
            adViewEventEmitter->onAdRevenuePaidEvent(result);
        }
    };
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<AppLovinMAXNativeAdViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<AppLovinMAXNativeAdViewProps const>(props);
    
    if ( oldViewProps.adUnitId != newViewProps.adUnitId )
    {
        [self setAdUnitId: RCTNSStringFromString(newViewProps.adUnitId)];
    }
    
    if ( oldViewProps.placement != newViewProps.placement )
    {
        _placement = RCTNSStringFromStringNilIfEmpty(newViewProps.placement);
    }
    
    if ( oldViewProps.customData != newViewProps.customData )
    {
        _customData = RCTNSStringFromStringNilIfEmpty(newViewProps.customData);
    }
    
    NSMutableArray *newExtraParameters = [NSMutableArray array];
    for ( const auto &extraParameter: newViewProps.extraParameters )
    {
        [newExtraParameters addObject:@{
            @"key": RCTNSStringFromString(extraParameter.key),
            @"value": RCTNSStringFromString(extraParameter.value),
        }];
    }
    _extraParameters = newExtraParameters;
    
    // TODO: string only for now
    NSMutableArray *newLocalExtraParameters = [NSMutableArray array];
    for ( const auto &localExtraParameter: newViewProps.localExtraParameters )
    {
        [newLocalExtraParameters addObject:@{
            @"key": RCTNSStringFromString(localExtraParameter.key),
            @"value": RCTNSStringFromString(localExtraParameter.value),
        }];
    }
    _localExtraParameters = newLocalExtraParameters;
    
    if ( [self.isAdUnitIdSet compareAndSet:YES update: NO] )
    {
        [self loadAd];
    }
    
    [super updateProps:props oldProps:oldProps];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    if ([commandName isEqualToString:@"loadAd"]) {
        [self loadAd];
    } else if ([commandName isEqualToString:@"updateAssetView"]) {
        NSNumber *assetViewTag = (NSNumber *) args[0];
        NSString *assetViewName = (NSString *) args[1];
        [self updateAssetView:assetViewTag.intValue assetViewName:assetViewName];
    } else if ([commandName isEqualToString:@"renderNativeAd"]) {
        [self renderNativeAd];
    }
}

#else // RCT_NEW_ARCH_ENABLED

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    self = [super init];
    if ( self )
    {
        self.bridge = bridge;
        self.isLoading = [[ALAtomicBoolean alloc] init];
        self.isAdUnitIdSet = [[ALAtomicBoolean alloc] init];
        self.clickableViews = [NSMutableArray array];
    }
    return self;
}

#endif // RCT_NEW_ARCH_ENABLED

// Lazily loaded for when Ad Unit ID is available
- (nullable MANativeAdLoader *)adLoader
{
    if ( ![self.adUnitId al_isValidString] ) return nil;
    
    if ( ![self.adUnitId isEqualToString: _adLoader.adUnitIdentifier] )
    {
        _adLoader = [[MANativeAdLoader alloc] initWithAdUnitIdentifier: self.adUnitId sdk: [AppLovinMAX shared].sdk];
        _adLoader.nativeAdDelegate = self;
        _adLoader.revenueDelegate = self;
    }
    
    return _adLoader;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    if ( !self.window )
    {
        [self destroyCurrentAdIfNeeded];
    }
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( ![adUnitId al_isValidString] ) return;
    
    _adUnitId = adUnitId;
    
    [self.isAdUnitIdSet set: YES];
}

// Called when Ad Unit ID is set, and via RN layer
- (void)loadAd
{
    if ( ![AppLovinMAX shared].sdk )
    {
        [[AppLovinMAX shared] logUninitializedAccessError: @"AppLovinMAXNativeAdView.loadAd"];
        return;
    }
    
    if ( [self.isLoading compareAndSet: NO update: YES] )
    {
        [[AppLovinMAX shared] log: @"Loading a native ad for Ad Unit ID: %@...", self.adUnitId];
        
        self.adLoader.placement = self.placement;
        self.adLoader.customData = self.customData;
        
        for ( NSDictionary *dict in self.extraParameters )
        {
            [self.adLoader setExtraParameterForKey: dict[@"key"] value: dict[@"value"]];
        }
        
        for ( NSDictionary *dict in self.localExtraParameters )
        {
            id value = dict[@"value"];
            [self.adLoader setLocalExtraParameterForKey: dict[@"key"] value: (value != [NSNull null] ? value : nil)];
        }
        
        [self.adLoader loadAd];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Ignoring request to load native ad for Ad Unit ID %@, another ad load in progress", self.adUnitId];
    }
}

#pragma mark - Views to Replace

- (void)updateAssetView:(NSInteger)assetViewTag assetViewName:(NSString *)assetViewName
{
    if ( [assetViewName isEqualToString: @("TitleView")] )
    {
        [self setTitleView: @(assetViewTag)];
    }
    else if ( [assetViewName isEqualToString: @("AdvertiserView")] )
    {
        [self setAdvertiserView: @(assetViewTag)];
    }
    else if ( [assetViewName isEqualToString: @("BodyView")] )
    {
        [self setBodyView: @(assetViewTag)];
    }
    else if ( [assetViewName isEqualToString: @("CallToActionView")] )
    {
        [self setCallToActionView: @(assetViewTag)];
    }
    else if ( [assetViewName isEqualToString: @("IconView")] )
    {
        [self setIconView: @(assetViewTag)];
    }
    else if ( [assetViewName isEqualToString: @("OptionsView")] )
    {
        [self setOptionsView: @(assetViewTag)];
    }
    else if ( [assetViewName isEqualToString: @("MediaView")] )
    {
        [self setMediaView: @(assetViewTag)];
    }
}

- (void)setTitleView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.title ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a title view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = TITLE_LABEL_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setAdvertiserView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.advertiser ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find an advertiser view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = ADVERTISER_VIEW_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setBodyView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.body ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a body view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = BODY_VIEW_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setCallToActionView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.callToAction ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a callToAction view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = CALL_TO_ACTION_VIEW_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setIconView:(NSNumber *)tag
{
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( ![view isKindOfClass: [RCTImageView class]] )
    {
        [[AppLovinMAX shared] log: @"Cannot find an icon image view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = ICON_VIEW_TAG;
    
    [self.clickableViews addObject: view];
    
    MANativeAdImage *icon = self.nativeAd.nativeAd.icon;
    if ( icon )
    {
        // Check if "URL" was missing and therefore need to set the image data
        if ( !icon.URL && icon.image )
        {
            RCTImageView *iconImageView = (RCTImageView *) view;
            if ( [iconImageView respondsToSelector: @selector(setImage:)] )
            {
                [iconImageView performSelector: @selector(setImage:) withObject: icon.image];
            }
            else
            {
                [[AppLovinMAX shared] log: @"Unable to set native ad IconView image"];
            }
        }
    }
    else
    {
        UIView *iconView = self.nativeAd.nativeAd.iconView;
        if ( iconView )
        {
            [view addSubview: iconView];
            [iconView al_pinToSuperview];
        }
    }
}

- (void)setOptionsView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.optionsView ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find an option view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    [view addSubview: self.nativeAd.nativeAd.optionsView];
    [self.nativeAd.nativeAd.optionsView al_pinToSuperview];
}

- (void)setMediaView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.mediaView ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a media view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = MEDIA_VIEW_CONTAINER_TAG;
    
    [self.clickableViews addObject: view];
    
    [view addSubview: self.nativeAd.nativeAd.mediaView];
    [self.nativeAd.nativeAd.mediaView al_pinToSuperview];
}

-(void)renderNativeAd
{
    if ( !self.adLoader ) return;
    
    [self.adLoader registerClickableViews: self.clickableViews withContainer: self forAd: self.nativeAd];
    [self.adLoader handleNativeAdViewRenderedForAd: self.nativeAd];
}

/**
 * Invoked:
 * 1. after all the JavaScript properties are set when mounting NativeAdView
 * 2. after all the user's asset views are mounted, following the 1st event
 */
- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ( [self.isAdUnitIdSet compareAndSet:YES update: NO] )
    {
        [self loadAd];
    }
}

#pragma mark - Ad Loader Delegate

- (void)didLoadNativeAd:(nullable MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    [[AppLovinMAX shared] log: @"Native ad loaded: %@", ad];
    
    // Log a warning if it is a template native ad returned - as our plugin will be responsible for re-rendering the native ad's assets
    if ( nativeAdView )
    {
        [self.isLoading set: NO];
        
        [[AppLovinMAX shared] log: @"Native ad is of template type, failing ad load..."];
        self.onAdLoadFailedEvent([[AppLovinMAX shared] adLoadFailedInfoForAd: self.adUnitId withError: nil]);
        
        return;
    }
    
    [self destroyCurrentAdIfNeeded];
    
    self.nativeAd = ad;
    
    // Notify `AppLovinNativeAdView.js`
    [self sendAdLoadedReactNativeEventForAd: ad.nativeAd];
    
    [self.isLoading set: NO];
}

- (void)sendAdLoadedReactNativeEventForAd:(MANativeAd *)ad
{
    // 1. AdInfo for publisher to be notified via `onAdLoaded`
    
    NSMutableDictionary<NSString *, id> *nativeAdInfo = [NSMutableDictionary dictionaryWithCapacity: 5];
    nativeAdInfo[@"title"] = ad.title;
    nativeAdInfo[@"advertiser"] = ad.advertiser;
    nativeAdInfo[@"body"] = ad.body;
    nativeAdInfo[@"callToAction"] = ad.callToAction;
    nativeAdInfo[@"starRating"] = ad.starRating;
    
    // The aspect ratio can be 0.0f when it is not provided by the network.
    if ( ad.mediaContentAspectRatio > 0 )
    {
        nativeAdInfo[@"mediaContentAspectRatio"] = @(ad.mediaContentAspectRatio);
    }
    
    nativeAdInfo[@"isIconImageAvailable"] = @(ad.icon != nil || ad.iconView != nil);
    nativeAdInfo[@"isOptionsViewAvailable"] = @(ad.optionsView != nil);
    nativeAdInfo[@"isMediaViewAvailable"] = @(ad.mediaView != nil);
    
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: self.nativeAd].mutableCopy;
    adInfo[@"nativeAd"] = nativeAdInfo;
    
    // 2. NativeAd for `AppLovinNativeAdView.js` to render the views
    
    NSMutableDictionary<NSString *, id> *jsNativeAd = [NSMutableDictionary dictionaryWithCapacity: 5];
    jsNativeAd[@"title"] = ad.title;
    jsNativeAd[@"advertiser"] = ad.advertiser;
    jsNativeAd[@"body"] = ad.body;
    jsNativeAd[@"callToAction"] = ad.callToAction;
    jsNativeAd[@"starRating"] = ad.starRating;
    
    if ( ad.icon )
    {
        if ( ad.icon.URL )
        {
            jsNativeAd[@"url"] = ad.icon.URL.absoluteString;
        }
        else if ( ad.icon.image )
        {
            jsNativeAd[@"image"] = @(YES);
        }
    }
    else if ( ad.iconView )
    {
        jsNativeAd[@"image"] = @(YES);
    }
    
    jsNativeAd[@"isOptionsViewAvailable"] = ad.optionsView ? @(YES) : @(NO);
    jsNativeAd[@"isMediaViewAvailable"] = ad.mediaView ? @(YES) : @(NO);
    
    NSMutableDictionary<NSString *, id> *arg = [NSMutableDictionary dictionaryWithCapacity: 2];
    arg[@"adInfo"] = adInfo;
    arg[@"nativeAd"] = jsNativeAd;
    
    // Send to `AppLovinNativeAdView.js`
    self.onAdLoadedEvent(arg);
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    [self.isLoading set: NO];
    
    [[AppLovinMAX shared] log: @"Failed to load native ad for Ad Unit ID %@ with error: %@", self.adUnitId, error];
    
    // Notify publisher
    self.onAdLoadFailedEvent([[AppLovinMAX shared] adLoadFailedInfoForAd: adUnitIdentifier withError: error]);
}

- (void)didClickNativeAd:(MAAd *)ad
{
    self.onAdClickedEvent([[AppLovinMAX shared] adInfoForAd: ad]);
}

#pragma mark - Ad Revenue Delegate

- (void)didPayRevenueForAd:(MAAd *)ad
{
    self.onAdRevenuePaidEvent([[AppLovinMAX shared] adInfoForAd: ad]);
}

- (void)destroyCurrentAdIfNeeded
{
    if ( self.nativeAd )
    {
        if ( self.nativeAd.nativeAd )
        {
            if ( self.nativeAd.nativeAd.mediaView )
            {
                [self.nativeAd.nativeAd.mediaView removeFromSuperview];
            }
            if ( self.nativeAd.nativeAd.optionsView )
            {
                [self.nativeAd.nativeAd.optionsView removeFromSuperview];
            }
        }
        
        [self.adLoader destroyAd: self.nativeAd];
        
        self.nativeAd = nil;
    }
    
    [self.clickableViews removeAllObjects];
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> AppLovinMAXNativeAdViewCls(void)
{
    return AppLovinMAXNativeAdView.class;
}
#endif
