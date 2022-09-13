#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"

@interface AppLovinMAXAdView()

@property (nonatomic, strong, nullable) MAAdView *adView; // nil when unmounted

// The following properties are updated from RN layer via the view manager
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, weak) MAAdFormat *adFormat;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, assign, readonly, getter=isAdaptiveBannerEnabled) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, readonly, getter=isAutoRefresh) BOOL autoRefresh;

@end

@implementation AppLovinMAXAdView

- (void)setAdUnitId:(NSString *)adUnitId
{
    // Ad Unit ID must be set prior to creating MAAdView
    if ( self.adView )
    {
        [[AppLovinMAX shared] log: @"Attempting to set Ad Unit ID %@ after MAAdView is created", adUnitId];
        return;
    }
    
    _adUnitId = adUnitId;
    
    [self attachAdViewIfNeeded];
}  

- (void)setAdFormat:(NSString *)adFormat
{
    // Ad format must be set prior to creating MAAdView
    if ( self.adView )
    {
        [[AppLovinMAX shared] log: @"Attempting to set ad format %@ after MAAdView is created", adFormat];
        return;
    }
    
    if ( [@"banner" isEqualToString: adFormat] )
    {
        _adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [@"mrec" isEqualToString: adFormat] )
    {
        _adFormat = MAAdFormat.mrec;
    }
    else
    {
        [[AppLovinMAX shared] log: @"Attempting to set an invalid ad format of \"%@\" for %@", adFormat, self.adUnitId];
        return;
    }
    
    [self attachAdViewIfNeeded];
}  

- (void)setPlacement:(NSString *)placement
{
    _placement = placement;
    
    if ( self.adView )
    {
        self.adView.placement = placement;
    }
}

- (void)setCustomData:(NSString *)customData
{
    _customData = customData;
    
    if ( self.adView )
    {
        self.adView.customData = customData;
    }
}

- (void)setAdaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    _adaptiveBannerEnabled = adaptiveBannerEnabled;
    
    if ( self.adView )
    {
        [self.adView setExtraParameterForKey: @"adaptive_banner" value: adaptiveBannerEnabled ? @"true" : @"false"];
    }
}

- (void)setAutoRefresh:(BOOL)autoRefresh
{
    _autoRefresh = autoRefresh;
    
    if ( self.adView )
    {
        if ( autoRefresh )
        {
            [self.adView startAutoRefresh];
        }
        else
        {
            [self.adView stopAutoRefresh];
        }
    }
}

- (void)attachAdViewIfNeeded
{
    // Re-assign in case of race condition
    NSString *adUnitId = self.adUnitId;
    MAAdFormat *adFormat = self.adFormat;
    
    // Run after 0.25 sec delay to allow all properties to set
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (0.25 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        if ( ![adUnitId al_isValidString] )
        {
            [[AppLovinMAX shared] log: @"Attempting to attach MAAdView without Ad Unit ID"];
            return;
        }
        
        if ( !adFormat )
        {
            [[AppLovinMAX shared] log: @"Attempting to attach MAAdView without ad format"];
            return;
        }
        
        if ( self.adView )
        {
            [[AppLovinMAX shared] log: @"Attempting to re-attach with existing MAAdView: %@", self.adView];
            return;
        }
        
        [[AppLovinMAX shared] log: @"Attaching MAAdView for %@", adUnitId];
        
        self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitId
                                                        adFormat: adFormat
                                                             sdk: [AppLovinMAX shared].sdk];
        self.adView.frame = (CGRect) { CGPointZero, self.frame.size };
        self.adView.delegate = [AppLovinMAX shared]; // Go through core class for callback forwarding to React Native layer
        self.adView.revenueDelegate = [AppLovinMAX shared];
        self.adView.placement = self.placement;
        self.adView.customData = self.customData;
        [self.adView setExtraParameterForKey: @"adaptive_banner" value: [self isAdaptiveBannerEnabled] ? @"true" : @"false"];
        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        [self.adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
        
        if ( [self isAutoRefresh] )
        {
            [self.adView startAutoRefresh];
        }
        else
        {
            [self.adView stopAutoRefresh];
        }
        
        [self.adView loadAd];
        
        [self addSubview: self.adView];
        
        [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToAnchor: self.widthAnchor],
                                                   [self.adView.heightAnchor constraintEqualToAnchor: self.heightAnchor],
                                                   [self.adView.centerXAnchor constraintEqualToAnchor: self.centerXAnchor],
                                                   [self.adView.centerYAnchor constraintEqualToAnchor: self.centerYAnchor]]];
    });
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    // This view is unmounted
    if ( !self.window )
    {
        if ( self.adView )
        {
            [[AppLovinMAX shared] log: @"Unmounting MAAdView: %@", self.adView];
            
            self.adView.delegate = nil;
            self.adView.revenueDelegate = nil;
            
            [self.adView removeFromSuperview];
            
            self.adView = nil;
        }
    }
}

@end
