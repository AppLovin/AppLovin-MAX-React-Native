#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"

@interface AppLovinMAXAdView ()

@property (nonatomic, strong) MAAdView *adView;

// Properties that are updated from the correspondig Javascript
// properties via ViewManager
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, weak) MAAdFormat *adFormat;
@property (nonatomic, copy) NSString *placement;
@property (nonatomic, copy) NSString *customData;
@property (nonatomic, assign, readonly, getter=isAdaptiveBannerEnabled) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, readonly, getter=isAutoRefreshEnabled) BOOL autoRefresh;

@end

@implementation AppLovinMAXAdView

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( self.adView ) return;
    
    _adUnitId = adUnitId;
    
    [self attachAdView];
}  

- (void)setAdFormat:(NSString *)adFormat
{
    if ( self.adView ) return;
    
    if ( [@"banner" isEqualToString: adFormat] )
    {
        _adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [@"mrec" isEqualToString: adFormat] )
    {
        _adFormat = MAAdFormat.mrec;
    }
    
    [self attachAdView];
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
        if ( adaptiveBannerEnabled )
        {
            [self.adView setExtraParameterForKey: @"adaptive_banner" value: @"true"];
        }
        else
        {
            [self.adView setExtraParameterForKey: @"adaptive_banner" value: @"false"];
        }
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

- (void)attachAdView
{
    // Run after 0.25 sec delay to allow all properties to set
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (NSEC_PER_SEC/4)), dispatch_get_main_queue(), ^{
        if ( self.adView ) return;
        
        RCTLogInfo(@"[AppLovinSdk] [AppLovinMAX] attempting to re-attach ad view %@", self.adUnitId);
        
        // If ad unit id and format has been set - create and attach AdView
        if ( !( [self.adUnitId al_isValidString] && self.adFormat )) return;
        
        self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: self.adUnitId adFormat: self.adFormat sdk: AppLovinMAX.shared.sdk];
        self.adView.frame = (CGRect) { CGPointZero, self.adFormat.size };
        self.adView.delegate = AppLovinMAX.shared; // Go through core class for callback forwarding to React Native layer
        self.adView.revenueDelegate = AppLovinMAX.shared;
        
        self.adView.placement = self.placement;
        
        self.adView.customData = self.customData;
        
        if ( [self isAdaptiveBannerEnabled] )
        {
            [self.adView setExtraParameterForKey: @"adaptive_banner" value: @"true"];
        }
        else
        {
            [self.adView setExtraParameterForKey: @"adaptive_banner" value: @"false"];
        }
        
        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        [self.adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
        
        if ( [self isAutoRefreshEnabled] )
        {
            [self.adView startAutoRefresh];
        }
        else
        {
            [self.adView stopAutoRefresh];
        }
        
        [self.adView loadAd];
        
        [self addSubview: self.adView];
        
        CGSize adViewSize = [self.adFormat adaptiveSizeForWidth: CGRectGetWidth(self.frame)];
        [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToConstant: adViewSize.width],
                                                   [self.adView.heightAnchor constraintEqualToConstant: adViewSize.height],
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
            self.adView.delegate = nil;
            self.adView.revenueDelegate = nil;
            
            [self.adView removeFromSuperview];
        }
    }
}

@end
