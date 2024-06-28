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
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, assign, readonly, getter=isAdaptiveBannerEnabled) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, readonly, getter=isAutoRefresh) BOOL autoRefresh;
@property (nonatomic, assign, readonly, getter=isLoadOnMount) BOOL loadOnMount;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;
@property (nonatomic, copy, nullable) NSDictionary *localExtraParameters;

@end

@implementation AppLovinMAXAdView

static NSMutableDictionary<NSString *, AppLovinMAXAdViewUIComponent *> *uiComponentInstances;
static NSMutableDictionary<NSString *, AppLovinMAXAdViewUIComponent *> *preloadedUIComponentInstances;

+ (void)initialize
{
    [super initialize];
    uiComponentInstances = [NSMutableDictionary dictionaryWithCapacity: 2];
    preloadedUIComponentInstances = [NSMutableDictionary dictionaryWithCapacity: 2];
}

+ (MAAdView *)sharedWithAdUnitIdentifier:(NSString *)adUnitIdentifier
{
    AppLovinMAXAdViewUIComponent *uiComponent = preloadedUIComponentInstances[adUnitIdentifier];
    if ( !uiComponent ) uiComponent = uiComponentInstances[adUnitIdentifier];
    return uiComponent ? uiComponent.adView : nil;
}

+ (void) preloadNativeUIComponentAdView:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat placement:(NSString *)placement  customData:(NSString *)customData extraParameters:(NSDictionary<NSString *, NSString *> *)extraParameters localExtraParameters:(NSDictionary<NSString *, NSString *> *)localExtraParameters withPromiseResolver:(RCTPromiseResolveBlock)resolve withPromiseRejecter:(RCTPromiseRejectBlock)reject
{
    AppLovinMAXAdViewUIComponent *preloadedUIComponent = preloadedUIComponentInstances[ adUnitIdentifier];
    if ( preloadedUIComponent )
    {
        reject(RCTErrorUnspecified, @"Cannot preload more than one for a single Ad Unit ID.", nil);
        return;
    }
    
    preloadedUIComponent = [[AppLovinMAXAdViewUIComponent alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat];
    preloadedUIComponentInstances[adUnitIdentifier] = preloadedUIComponent;
    
    preloadedUIComponent.placement = placement;
    preloadedUIComponent.customData = customData;
    preloadedUIComponent.extraParameters = extraParameters;
    preloadedUIComponent.localExtraParameters = localExtraParameters;
    
    [preloadedUIComponent loadAd];
    
    resolve(nil);
}

+ (void) destroyNativeUIComponentAdView:(NSString *)adUnitIdentifier withPromiseResolver:(RCTPromiseResolveBlock)resolve withPromiseRejecter:(RCTPromiseRejectBlock)reject
{
    AppLovinMAXAdViewUIComponent *preloadedUIComponent = preloadedUIComponentInstances[adUnitIdentifier];
    if ( !preloadedUIComponent )
    {
        reject(RCTErrorUnspecified, @"No native UI component found to destroy", nil);
        return;
    }
    
    if ( [preloadedUIComponent isAttached] )
    {
        reject(RCTErrorUnspecified, @"Cannot destroy - currently in use", nil);
        return;
    }
    
    [preloadedUIComponentInstances removeObjectForKey: adUnitIdentifier];
    
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
        self.uiComponent.autoRefresh = autoRefresh;
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
            [[AppLovinMAX shared] logUninitializedAccessError: @"AppLovinMAXAdview.attachAdViewIfNeeded"];
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
            [[AppLovinMAX shared] log: @"Attempting to re-attach with existing native UI component: %@", self.uiComponent.adView];
            return;
        }
        
        [[AppLovinMAX shared] log: @"Attaching a native UI component for %@", adUnitId];
        
        self.uiComponent = preloadedUIComponentInstances[adUnitId];
        if ( self.uiComponent )
        {
            // Attach the preloaded uiComponent if possible, otherwise create a new one for the
            // same adUnitId
            if ( ![self.uiComponent isAttached] )
            {
                self.uiComponent.autoRefresh = self.isAutoRefresh;
                [self.uiComponent attachAdView: self];
                return;
            }
        }
        
        self.uiComponent = [[AppLovinMAXAdViewUIComponent alloc] initWithAdUnitIdentifier: adUnitId adFormat: adFormat];
        uiComponentInstances[adUnitId] = self.uiComponent;
        
        self.uiComponent.placement = self.placement;
        self.uiComponent.customData = self.customData;
        self.uiComponent.extraParameters = self.extraParameters;
        self.uiComponent.localExtraParameters = self.localExtraParameters;
        self.uiComponent.adaptiveBannerEnabled = self.isAdaptiveBannerEnabled;
        self.uiComponent.autoRefresh = self.isAutoRefresh;
        
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
            [[AppLovinMAX shared] log: @"Unmounting the native UI component: %@", self.uiComponent.adView];
            
            [self.uiComponent detachAdView];
            
            AppLovinMAXAdViewUIComponent *preloadedUIComponent = preloadedUIComponentInstances[self.adUnitId];
            
            if ( self.uiComponent == preloadedUIComponent )
            {
                self.uiComponent.autoRefresh = NO;
            }
            else
            {
                [uiComponentInstances removeObjectForKey: self.adUnitId];
                [self.uiComponent destroy];
            }
        }
    }
}

@end
