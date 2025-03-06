//
//  AppLovinMAXAdView.m
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"
#import "AppLovinMAXAdViewUIComponent.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNAppLovinMAXSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNAppLovinMAXSpec/EventEmitters.h>
#import <react/renderer/components/RNAppLovinMAXSpec/Props.h>
#import <react/renderer/components/RNAppLovinMAXSpec/RCTComponentViewHelpers.h>
#import <React/RCTConversions.h>
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface AppLovinMAXAdView() <RCTAppLovinMAXAdViewViewProtocol>
#else
@interface AppLovinMAXAdView()
#endif

@property (nonatomic, strong, nullable) AppLovinMAXAdViewUIComponent *uiComponent; // nil when unmounted

// The following properties are updated from RN layer via the view manager
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, weak) MAAdFormat *adFormat;
@property (nonatomic, copy) NSNumber *adViewId;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, assign, readonly, getter=isAdaptiveBannerEnabled) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, readonly, getter=isAutoRefreshEnabled) BOOL autoRefresh;
@property (nonatomic, assign, readonly, getter=isLoadOnMount) BOOL loadOnMount;
@property (nonatomic, copy, nullable) NSArray<NSDictionary<NSString *, id> *> *extraParameters;
@property (nonatomic, copy, nullable) NSArray<NSDictionary<NSString *, id> *> *localExtraParameters;

@end

@implementation AppLovinMAXAdView

static NSMutableDictionary<NSNumber *, AppLovinMAXAdViewUIComponent *> *uiComponentInstances;
static NSMutableDictionary<NSNumber *, AppLovinMAXAdViewUIComponent *> *preloadedUIComponentInstances;

+ (void)initialize
{
    [super initialize];
    uiComponentInstances = [NSMutableDictionary dictionaryWithCapacity: 2];
    preloadedUIComponentInstances = [NSMutableDictionary dictionaryWithCapacity: 2];
}

// Returns an MAAdView to support Amazon integrations. This method returns the first instance that
// matches the Ad Unit ID, consistent with the behavior introduced when this feature was first
// implemented.
+ (nullable MAAdView *)sharedWithAdUnitIdentifier:(NSString *)adUnitIdentifier
{
    for ( id key in preloadedUIComponentInstances )
    {
        AppLovinMAXAdViewUIComponent *uiComponent = preloadedUIComponentInstances[key];
        if ( [uiComponent.adUnitIdentifier isEqualToString: adUnitIdentifier] )
        {
            return uiComponent.adView;
        }
    }
    
    for ( id key in uiComponentInstances )
    {
        AppLovinMAXAdViewUIComponent *uiComponent = uiComponentInstances[key];
        if ( [uiComponent.adUnitIdentifier isEqualToString: adUnitIdentifier] )
        {
            return uiComponent.adView;
        }
    }
    
    return nil;
}

+ (BOOL)hasPreloadedAdViewForIdentifier:(NSNumber *)adViewId
{
    return preloadedUIComponentInstances[adViewId];
}

+ (void)preloadNativeUIComponentAdView:(NSString *)adUnitIdentifier
                              adFormat:(MAAdFormat *)adFormat
                             placement:(nullable NSString *)placement
                            customData:(nullable NSString *)customData
                       extraParameters:(nullable NSDictionary<NSString *, id> *)extraParameters
                  localExtraParameters:(nullable NSDictionary<NSString *, id> *)localExtraParameters
                   withPromiseResolver:(RCTPromiseResolveBlock)resolve
                   withPromiseRejecter:(RCTPromiseRejectBlock)reject
{
    AppLovinMAXAdViewUIComponent *preloadedUIComponent = [[AppLovinMAXAdViewUIComponent alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
    preloadedUIComponentInstances[@(preloadedUIComponent.hash)] = preloadedUIComponent;
    
    preloadedUIComponent.placement = placement;
    preloadedUIComponent.customData = customData;
    preloadedUIComponent.extraParameters = extraParameters;
    preloadedUIComponent.localExtraParameters = localExtraParameters;
    
    [preloadedUIComponent loadAd];
    
    resolve(@(preloadedUIComponent.hash));
}

+ (void)destroyNativeUIComponentAdView:(NSNumber *)adViewId
                   withPromiseResolver:(RCTPromiseResolveBlock)resolve
                   withPromiseRejecter:(RCTPromiseRejectBlock)reject
{
    AppLovinMAXAdViewUIComponent *preloadedUIComponent = preloadedUIComponentInstances[adViewId];
    if ( !preloadedUIComponent )
    {
        reject(RCTErrorUnspecified, @"No preloaded AdView found to destroy", nil);
        return;
    }
    
    if ( [preloadedUIComponent hasContainerView] )
    {
        reject(RCTErrorUnspecified, @"Cannot destroy - the preloaded AdView is currently in use", nil);
        return;
    }
    
    [preloadedUIComponentInstances removeObjectForKey: adViewId];
    
    [preloadedUIComponent detachAdView];
    [preloadedUIComponent destroy];
    
    resolve(nil);
}

#ifdef RCT_NEW_ARCH_ENABLED

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<AppLovinMAXAdViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if ( self )
    {
        static const auto defaultProps = std::make_shared<const AppLovinMAXAdViewProps>();
        _props = defaultProps;
        
        const auto &initProps = *std::static_pointer_cast<AppLovinMAXAdViewProps const>(_props);
        _adaptiveBannerEnabled = initProps.adaptiveBannerEnabled;
        _autoRefresh = initProps.autoRefresh;
        _loadOnMount = initProps.loadOnMount;
        
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
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdLoadedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
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
                }
            };
            
            adViewEventEmitter->onAdLoadedEvent(result);
        }
    };
    
    self.onAdLoadFailedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdLoadFailedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
                .code = [event[@"code"] doubleValue],
                .message = std::string([event[@"message"] ?: @"" UTF8String]),
                .mediatedNetworkErrorCode = [event[@"mediatedNetworkErrorCode"] doubleValue],
                .mediatedNetworkErrorMessage = std::string([event[@"mediatedNetworkErrorMessage"] ?: @"" UTF8String]),
                .adLoadFailureInfo = std::string([event[@"adLoadFailureInfo"] ?: @"" UTF8String])
            };
            
            adViewEventEmitter->onAdLoadFailedEvent(result);
        }
    };
    
    self.onAdDisplayFailedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdDisplayFailedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .code = [event[@"code"] doubleValue],
                .message = std::string([event[@"message"] ?: @"" UTF8String]),
                .mediatedNetworkErrorCode = [event[@"mediatedNetworkErrorCode"] doubleValue],
                .mediatedNetworkErrorMessage = std::string([event[@"mediatedNetworkErrorMessage"] ?: @"" UTF8String]),
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                }
            };
            
            adViewEventEmitter->onAdDisplayFailedEvent(result);
        }
    };
    
    self.onAdClickedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdClickedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                }
            };
            
            adViewEventEmitter->onAdClickedEvent(result);
        }
    };
    
    self.onAdExpandedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdExpandedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                }
            };
            
            adViewEventEmitter->onAdExpandedEvent(result);
        }
    };
    
    self.onAdCollapsedEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdCollapsedEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                }
            };
            
            adViewEventEmitter->onAdCollapsedEvent(result);
        }
    };
    
    self.onAdRevenuePaidEvent = [self](NSDictionary *event)
    {
        if ( _eventEmitter )
        {
            auto adViewEventEmitter = std::static_pointer_cast<AppLovinMAXAdViewEventEmitter const>(_eventEmitter);
            
            AppLovinMAXAdViewEventEmitter::OnAdRevenuePaidEvent result =
            {
                .adUnitId = std::string([event[@"adUnitId"] ?: @"" UTF8String]),
                .adFormat = std::string([event[@"adFormat"] ?: @"" UTF8String]),
                .adViewId = [event[@"adViewId"] doubleValue],
                .networkName = std::string([event[@"networkName"] ?: @"" UTF8String]),
                .networkPlacement = std::string([event[@"networkPlacement"] ?: @"" UTF8String]),
                .creativeId = std::string([event[@"creativeId"] ?: @"" UTF8String]),
                .placement = std::string([event[@"placement"] ?: @"" UTF8String]),
                .revenue = [event[@"revenue"] doubleValue],
                .revenuePrecision = std::string([event[@"revenuePrecision"] ?: @"" UTF8String]),
                .latencyMillis = [event[@"latencyMillis"] doubleValue],
                .size = {
                    .width = [event[@"size"][@"width"] doubleValue],
                    .height = [event[@"size"][@"height"] doubleValue],
                }
            };
            
            adViewEventEmitter->onAdRevenuePaidEvent(result);
        }
    };
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<AppLovinMAXAdViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<AppLovinMAXAdViewProps const>(props);
    
    BOOL isAdUnitIdSet;
    
    if ( oldViewProps.adUnitId != newViewProps.adUnitId )
    {
        [self setAdUnitId: RCTNSStringFromString(newViewProps.adUnitId)];
        isAdUnitIdSet = YES;
    }
    
    if ( oldViewProps.adFormat != newViewProps.adFormat )
    {
        NSString *adFormatStr = RCTNSStringFromString(newViewProps.adFormat);
        
        if ( [@"BANNER" al_isEqualToStringIgnoringCase: adFormatStr] )
        {
            _adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
        }
        else if ( [@"MREC" al_isEqualToStringIgnoringCase: adFormatStr] )
        {
            _adFormat = MAAdFormat.mrec;
        }
        else
        {
            [[AppLovinMAX shared] log: @"Attempting to set an invalid ad format of \"%@\" for %@", adFormatStr, self.adUnitId];
        }
    }
    
    if ( oldViewProps.adViewId != newViewProps.adViewId )
    {
        [self setAdViewId: @(newViewProps.adViewId)];
    }
    
    if ( oldViewProps.placement != newViewProps.placement )
    {
        [self setPlacement: RCTNSStringFromStringNilIfEmpty(newViewProps.placement)];
    }
    
    if ( oldViewProps.customData != newViewProps.customData )
    {
        [self setCustomData: RCTNSStringFromStringNilIfEmpty(newViewProps.customData)];
    }
    
    if ( oldViewProps.adaptiveBannerEnabled != newViewProps.adaptiveBannerEnabled )
    {
        [self setAdaptiveBannerEnabled: newViewProps.adaptiveBannerEnabled];
    }
    
    if ( oldViewProps.autoRefresh != newViewProps.autoRefresh )
    {
        [self setAutoRefresh: newViewProps.autoRefresh];
    }
    
    if ( oldViewProps.loadOnMount != newViewProps.loadOnMount )
    {
        [self setLoadOnMount: newViewProps.loadOnMount];
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
    
    if ( isAdUnitIdSet )
    {
        [self attachAdViewIfNeeded];
    }
    
    [super updateProps: props oldProps: oldProps];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    if ( [commandName isEqualToString: @"loadAd"] )
    {
        [self loadAd];
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    
    static const auto defaultProps = std::make_shared<const AppLovinMAXAdViewProps>();
    _props = defaultProps;
    
    [self destroyCurrentAdIfNeeded];
}

#endif // RCT_NEW_ARCH_ENABLED

- (void)setAdUnitId:(NSString *)adUnitId
{
    // Ad Unit ID must be set prior to creating MAAdView
    if ( self.uiComponent )
    {
        [[AppLovinMAX shared] log: @"Attempting to set Ad Unit ID %@ after the native UI component is created", adUnitId];
        return;
    }
    
    _adUnitId = adUnitId;
}

- (void)setAdFormat:(NSString *)adFormatStr
{
    // Ad format must be set prior to creating MAAdView
    if ( self.uiComponent )
    {
        [[AppLovinMAX shared] log: @"Attempting to set ad format %@ after the native UI component is created", adFormatStr];
        return;
    }
    
    if ( [@"BANNER" al_isEqualToStringIgnoringCase: adFormatStr] )
    {
        _adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [@"MREC" al_isEqualToStringIgnoringCase: adFormatStr] )
    {
        _adFormat = MAAdFormat.mrec;
    }
    else
    {
        [[AppLovinMAX shared] log: @"Attempting to set an invalid ad format of \"%@\" for %@", adFormatStr, self.adUnitId];
    }
}

- (void)setAdViewId:(NSNumber *)adViewId
{
    _adViewId = adViewId;
}

- (void)setPlacement:(NSString *)placement
{
    _placement = placement;
    
    if ( self.uiComponent )
    {
        self.uiComponent.placement = placement;
    }
}

- (void)setCustomData:(NSString *)customData
{
    _customData = customData;
    
    if ( self.uiComponent )
    {
        self.uiComponent.customData = customData;
    }
}

- (void)setAdaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    _adaptiveBannerEnabled = adaptiveBannerEnabled;
    
    if ( self.uiComponent )
    {
        self.uiComponent.adaptiveBannerEnabled = adaptiveBannerEnabled;
    }
}

- (void)setAutoRefresh:(BOOL)autoRefresh
{
    _autoRefresh = autoRefresh;
    
    if ( self.uiComponent )
    {
        self.uiComponent.autoRefreshEnabled = autoRefresh;
    }
}

- (void)setLoadOnMount:(BOOL)loadOnMount
{
    _loadOnMount = loadOnMount;
}

- (void)setStrLocalExtraParameters:(NSArray<NSDictionary<NSString *, id> *> *)strLocalExtraParameters
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

- (void)setNumLocalExtraParameters:(NSArray<NSDictionary<NSString *, id> *> *)numLocalExtraParameters
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

- (void)setBoolLocalExtraParameters:(NSArray<NSDictionary<NSString *, id> *> *)boolLocalExtraParameters
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

#ifndef RCT_NEW_ARCH_ENABLED

// Invoked after all the JavaScript properties are set when mounting AdView
- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [self attachAdViewIfNeeded];
}

#endif // RCT_NEW_ARCH_ENABLED

- (void)attachAdViewIfNeeded
{
    // Re-assign in case of race condition
    NSString *adUnitId = self.adUnitId;
    MAAdFormat *adFormat = self.adFormat;
    
    dispatch_async(dispatch_get_main_queue(), ^{
        
        if ( ![AppLovinMAX shared].sdk )
        {
            [[AppLovinMAX shared] logUninitializedAccessError: @"AppLovinMAXAdView.attachAdViewIfNeeded"];
            return;
        }
        
        if ( ![adUnitId al_isValidString] )
        {
            [[AppLovinMAX shared] log: @"Attempting to attach a native UI component without Ad Unit ID"];
            return;
        }
        
        if ( !adFormat )
        {
            [[AppLovinMAX shared] log: @"Attempting to attach a native UI component without ad format"];
            return;
        }
        
        if ( self.uiComponent )
        {
            [[AppLovinMAX shared] log: @"Attempting to re-attach with existing AdView (%@) for Ad Unit ID %@", @(self.uiComponent.hash), self.adUnitId];
            return;
        }
        
        self.uiComponent = preloadedUIComponentInstances[self.adViewId];
        if ( self.uiComponent )
        {
            // Attach the preloaded uiComponent if possible, otherwise create a new one for the same adUnitId
            if ( ![self.uiComponent hasContainerView] )
            {
                [[AppLovinMAX shared] log: @"Mounting the preloaded AdView (%@) for Ad Unit ID %@", self.adViewId, self.adUnitId];
                
                self.uiComponent.adaptiveBannerEnabled = [self isAdaptiveBannerEnabled];
                self.uiComponent.autoRefreshEnabled = [self isAutoRefreshEnabled];
                [self.uiComponent attachAdView: self];
                return;
            }
        }
        
        self.uiComponent = [[AppLovinMAXAdViewUIComponent alloc] initWithAdUnitIdentifier: adUnitId adFormat: adFormat];
        self.adViewId = @(self.uiComponent.hash);
        uiComponentInstances[self.adViewId] = self.uiComponent;
        
        [[AppLovinMAX shared] log: @"Mounting a new AdView (%@) for Ad Unit ID %@", self.adViewId, self.adUnitId];
        
        NSMutableDictionary<NSString *, id> *flattenedExtraParameters;
        if ( self.extraParameters )
        {
            flattenedExtraParameters = [NSMutableDictionary dictionary];
            for ( NSDictionary *parameter in self.extraParameters )
            {
                flattenedExtraParameters[parameter[@"key"]] = parameter[@"value"];
            }
        }
        
        NSMutableDictionary<NSString *, id> *flattenedLocalExtraParameters;
        if ( self.localExtraParameters )
        {
            flattenedLocalExtraParameters = [NSMutableDictionary dictionary];
            for ( NSDictionary *parameter in self.localExtraParameters )
            {
                flattenedLocalExtraParameters[parameter[@"key"]] = parameter[@"value"];
            }
        }
        
        self.uiComponent.placement = self.placement;
        self.uiComponent.customData = self.customData;
        self.uiComponent.extraParameters = flattenedExtraParameters;
        self.uiComponent.localExtraParameters = flattenedLocalExtraParameters;
        self.uiComponent.adaptiveBannerEnabled = [self isAdaptiveBannerEnabled];
        self.uiComponent.autoRefreshEnabled = [self isAutoRefreshEnabled];
        
        [self.uiComponent attachAdView: self];
        
        if ( [self isLoadOnMount] )
        {
            [self.uiComponent loadAd];
        }
    });
}

- (void)loadAd
{
    if ( !self.uiComponent )
    {
        [[AppLovinMAX shared] log: @"Attempting to load uninitialized native UI component for %@", self.adUnitId];
        return;
    }
    
    [self.uiComponent loadAd];
}

- (void)destroyCurrentAdIfNeeded
{
    if ( !self.uiComponent ) return;
    
    [self.uiComponent detachAdView];
    
    AppLovinMAXAdViewUIComponent *preloadedUIComponent = preloadedUIComponentInstances[self.adViewId];
    
    if ( self.uiComponent == preloadedUIComponent )
    {
        [[AppLovinMAX shared] log: @"Unmounting the preloaded AdView (%@) for Ad Unit ID %@", self.adViewId, self.adUnitId];
        
        self.uiComponent.autoRefreshEnabled = NO;
    }
    else
    {
        [[AppLovinMAX shared] log: @"Unmounting the AdView (%@) to destroy for Ad Unit ID %@", self.adViewId, self.adUnitId];
        
        [uiComponentInstances removeObjectForKey: self.adViewId];
        [self.uiComponent destroy];
    }
    
    self.uiComponent = nil;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    // This view is unmounted
    if ( !self.window )
    {
        [self destroyCurrentAdIfNeeded];
    }
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> AppLovinMAXAdViewCls(void)
{
    return AppLovinMAXAdView.class;
}
#endif

