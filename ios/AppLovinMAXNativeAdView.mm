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
@property (nonatomic, copy, nullable) NSArray<NSDictionary<NSString *, id> *> *extraParameters;
@property (nonatomic, copy, nullable) NSArray<NSDictionary<NSString *, id> *> *localExtraParameters;

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
    if ( self )
    {
        static const auto defaultProps = std::make_shared<const AppLovinMAXNativeAdViewProps>();
        _props = defaultProps;
        
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
            auto nativeAdViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            NSDictionary *nativeAd = event[@"nativeAd"];
            NSDictionary *nativeAdImpl = event[@"nativeAdImpl"];
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdLoadedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .dspName = std::string([event[@"dspName"] ?: @"" UTF8String]),
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                },
                .nativeAd = {
                    .title = std::string([nativeAd[@"title"] ?: @"" UTF8String]),
                    .advertiser = std::string([nativeAd[@"advertiser"] ?: @"" UTF8String]),
                    .body = std::string([nativeAd[@"body"] ?: @"" UTF8String]),
                    .callToAction = std::string([nativeAd[@"callToAction"] ?: @"" UTF8String]),
                    .starRating = [nativeAd[@"starRating"] doubleValue],
                    .mediaContentAspectRatio = [nativeAd[@"mediaContentAspectRatio"] doubleValue],
                    .isIconImageAvailable = [nativeAd[@"isIconImageAvailable"] boolValue],
                    .isOptionsViewAvailable = [nativeAd[@"isOptionsViewAvailable"] boolValue],
                    .isMediaViewAvailable = [nativeAd[@"isMediaViewAvailable"] boolValue],
                },
                .nativeAdImpl = {
                    .title = std::string([nativeAdImpl[@"title"] ?: @"" UTF8String]),
                    .advertiser = std::string([nativeAdImpl[@"advertiser"] ?: @"" UTF8String]),
                    .body = std::string([nativeAdImpl[@"body"] ?: @"" UTF8String]),
                    .callToAction = std::string([nativeAdImpl[@"callToAction"] ?: @"" UTF8String]),
                    .image = [nativeAdImpl[@"image"] boolValue],
                    .imageSource = std::string([nativeAdImpl[@"imageSource"] ?: @"" UTF8String]),
                    .url = std::string([nativeAdImpl[@"url"] ?: @"" UTF8String]),
                    .starRating = [nativeAdImpl[@"starRating"] doubleValue],
                    .isOptionsViewAvailable = [nativeAdImpl[@"isOptionsViewAvailable"] boolValue],
                    .isMediaViewAvailable = [nativeAdImpl[@"isMediaViewAvailable"] boolValue],
                }
            };
            
            nativeAdViewEventEmitter->onAdLoadedEvent(result);
        }
    };
    
    self.onAdLoadFailedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto nativeAdViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdLoadFailedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .code = [event[@"code"] doubleValue],
                .message = std::string([event[@"message"] ?: @"" UTF8String]),
                .mediatedNetworkErrorCode = [event[@"mediatedNetworkErrorCode"] doubleValue],
                .mediatedNetworkErrorMessage = std::string([event[@"mediatedNetworkErrorMessage"] ?: @"" UTF8String]),
                .adLoadFailureInfo = std::string([event[@"adLoadFailureInfo"] ?: @"" UTF8String])
            };
            
            nativeAdViewEventEmitter->onAdLoadFailedEvent(result);
        }
    };
    
    self.onAdClickedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto nativeAdViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdClickedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .dspName = std::string([event[@"dspName"] ?: @"" UTF8String]),
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                },
            };
            
            nativeAdViewEventEmitter->onAdClickedEvent(result);
        }
    };
    
    self.onAdRevenuePaidEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto nativeAdViewEventEmitter = std::static_pointer_cast<AppLovinMAXNativeAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXNativeAdViewEventEmitter::OnAdRevenuePaidEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .dspName = std::string([event[@"dspName"] ?: @"" UTF8String]),
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                },
            };
            
            nativeAdViewEventEmitter->onAdRevenuePaidEvent(result);
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
        [self setPlacement: RCTNSStringFromStringNilIfEmpty(newViewProps.placement)];
    }
    
    if ( oldViewProps.customData != newViewProps.customData )
    {
        [self setCustomData: RCTNSStringFromStringNilIfEmpty(newViewProps.customData)];
    }
    
    if ( newViewProps.extraParameters.size() > 0 )
    {
        NSMutableArray *extraParameters = [NSMutableArray array];
        
        for ( const auto &parameter: newViewProps.extraParameters )
        {
            NSDictionary *dict = @{@"key": RCTNSStringFromString(parameter.key),
                                   @"value": RCTNSStringFromString(parameter.value)};
            [extraParameters addObject: dict];
        }
        
        _extraParameters = extraParameters;
    }
    
    if ( newViewProps.strLocalExtraParameters.size() > 0 )
    {
        NSMutableArray *strLocalExtraParameters = [NSMutableArray array];
        
        for ( const auto &parameter: newViewProps.strLocalExtraParameters )
        {
            NSDictionary *dict = @{@"key": RCTNSStringFromString(parameter.key),
                                   @"value": RCTNSStringFromString(parameter.value)};
            [strLocalExtraParameters addObject: dict];
        }
        
        [self setStrLocalExtraParameters: strLocalExtraParameters];
    }
    
    if ( newViewProps.numLocalExtraParameters.size() > 0 )
    {
        NSMutableArray *numLocalExtraParameters = [NSMutableArray array];
        
        for ( const auto &parameter: newViewProps.numLocalExtraParameters )
        {
            NSDictionary *dict = @{@"key": RCTNSStringFromString(parameter.key),
                                   @"value": @(parameter.value)};
            [numLocalExtraParameters addObject: dict];
        }
        
        [self setNumLocalExtraParameters: numLocalExtraParameters];
    }
    
    if ( newViewProps.boolLocalExtraParameters.size() > 0 )
    {
        NSMutableArray *boolLocalExtraParameters = [NSMutableArray array];
        
        for ( const auto &parameter: newViewProps.boolLocalExtraParameters )
        {
            NSDictionary *dict = @{@"key": RCTNSStringFromString(parameter.key),
                                   @"value": @(parameter.value)};
            [boolLocalExtraParameters addObject: dict];
        }
        
        [self setBoolLocalExtraParameters: boolLocalExtraParameters];
    }
    
    if ( [self.isAdUnitIdSet compareAndSet: YES update: NO] )
    {
        [self loadAd];
    }
    
    [super updateProps: props oldProps: oldProps];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    if ( [commandName isEqualToString: @"loadAd"] )
    {
        [self loadAd];
    }
    else if ( [commandName isEqualToString: @"updateAssetView"] )
    {
        NSNumber *assetViewTag = (NSNumber *) args[0];
        NSString *assetViewName = (NSString *) args[1];
        [self updateAssetView: assetViewTag.doubleValue assetViewName: assetViewName];
    }
    else if ( [commandName isEqualToString: @"renderNativeAd"] )
    {
        [self renderNativeAd];
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    
    static const auto defaultProps = std::make_shared<const AppLovinMAXNativeAdViewProps>();
    _props = defaultProps;
    
    [self destroyCurrentAdIfNeeded];
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

- (void)setStrLocalExtraParameters:(NSArray<NSDictionary *> *)strLocalExtraParameters
{
    if ( !_localExtraParameters )
    {
        _localExtraParameters = [strLocalExtraParameters mutableCopy];
    }
    else
    {
        NSMutableArray *updatedArray = [_localExtraParameters mutableCopy];
        [updatedArray addObjectsFromArray: strLocalExtraParameters];
        _localExtraParameters = [updatedArray copy];
    }
}

- (void)setNumLocalExtraParameters:(NSArray<NSDictionary *> *)numLocalExtraParameters
{
    if ( !_localExtraParameters )
    {
        _localExtraParameters = [numLocalExtraParameters mutableCopy];
    }
    else
    {
        NSMutableArray *updatedArray = [_localExtraParameters mutableCopy];
        [updatedArray addObjectsFromArray: numLocalExtraParameters];
        _localExtraParameters = [updatedArray copy];
    }
}

- (void)setBoolLocalExtraParameters:(NSArray<NSDictionary *> *)boolLocalExtraParameters
{
    if ( !_localExtraParameters )
    {
        _localExtraParameters = [boolLocalExtraParameters mutableCopy];
    }
    else
    {
        NSMutableArray *updatedArray = [_localExtraParameters mutableCopy];
        [updatedArray addObjectsFromArray: boolLocalExtraParameters];
        _localExtraParameters = [updatedArray copy];
    }
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
        
        for ( NSDictionary *parameter in self.extraParameters )
        {
            NSString *key = parameter[@"key"];
            [self.adLoader setExtraParameterForKey: key value: [parameter al_stringForKey: key]];
        }
        
        for ( NSDictionary *parameter in self.localExtraParameters )
        {
            NSString *key = parameter[@"key"];
            id value = parameter[@"value"];
            [self.adLoader setLocalExtraParameterForKey: key value: (value != [NSNull null] ? value : nil)];
        }
        
        [self.adLoader loadAd];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Ignoring request to load native ad for Ad Unit ID %@, another ad load in progress", self.adUnitId];
    }
}

#pragma mark - Views to Replace

- (void)updateAssetView:(double)assetViewTag assetViewName:(NSString *)assetViewName
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

#ifdef RCT_NEW_ARCH_ENABLED
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find an icon image view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
     }

    view.tag = ICON_VIEW_TAG;

    [self.clickableViews addObject: view];
#else
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
#endif
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
#ifdef RCT_NEW_ARCH_ENABLED
            NSData *imageData = UIImagePNGRepresentation(ad.icon.image);
            jsNativeAd[@"imageSource"] = [imageData base64EncodedStringWithOptions: 0];
#else
            jsNativeAd[@"image"] = @(YES);
#endif
        }
    }
    
    jsNativeAd[@"isOptionsViewAvailable"] = ad.optionsView ? @(YES) : @(NO);
    jsNativeAd[@"isMediaViewAvailable"] = ad.mediaView ? @(YES) : @(NO);
    
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: self.nativeAd].mutableCopy;
    adInfo[@"nativeAd"] = nativeAdInfo;
    adInfo[@"nativeAdImpl"] = jsNativeAd;
    
    // Send to `AppLovinNativeAdView.js`
    self.onAdLoadedEvent(adInfo);
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
