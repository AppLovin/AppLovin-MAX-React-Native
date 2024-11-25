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

@interface AppLovinMAXAdView()

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
@property (nonatomic, copy, nullable) NSDictionary<NSString *, id> *extraParameters;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, id> *localExtraParameters;

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

- (void)setAdFormat:(NSString *)adFormat
{
    // Ad format must be set prior to creating MAAdView
    if ( self.uiComponent )
    {
        [[AppLovinMAX shared] log: @"Attempting to set ad format %@ after the native UI component is created", adFormat];
        return;
    }
    
    if ( [MAAdFormat.banner.label isEqualToString: adFormat] )
    {
        _adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [MAAdFormat.mrec.label isEqualToString: adFormat] )
    {
        _adFormat = MAAdFormat.mrec;
    }
    else
    {
        [[AppLovinMAX shared] log: @"Attempting to set an invalid ad format of \"%@\" for %@", adFormat, self.adUnitId];
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

// Invoked after all the JavaScript properties are set when mounting AdView
- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    [self attachAdViewIfNeeded];
}

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
        
        self.uiComponent.placement = self.placement;
        self.uiComponent.customData = self.customData;
        self.uiComponent.extraParameters = self.extraParameters;
        self.uiComponent.localExtraParameters = self.localExtraParameters;
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

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    // This view is unmounted
    if ( !self.window && !self.superview )
    {
        if ( self.uiComponent )
        {
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
        }
    }
}

@end
