#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"

@interface AppLovinMAXAdView ()

@property (nonatomic, strong) MAAdView *mAdView;
@property (nonatomic, weak) MAAdFormat *mAdFormat;

@property (nonatomic, copy) NSString *mAdUnitId;
@property (nonatomic, copy) NSString *mPlacement;
@property (nonatomic, copy) NSString *mCustomData;
@property (nonatomic, assign) BOOL mAdaptiveBannerEnabled;
@property (nonatomic, assign) BOOL mAutoRefresh;

@end

@implementation AppLovinMAXAdView

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( self.mAdView ) return;
    
    self.mAdUnitId = adUnitId;
    
    [self attachAdView];
}  

- (void)setAdFormat:(NSString *)adFormat
{
    if ( self.mAdView ) return;
    
    if ( [@"banner" isEqualToString: adFormat] )
    {
        self.mAdFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [@"mrec" isEqualToString: adFormat] )
    {
        self.mAdFormat = MAAdFormat.mrec;
    }
    
    [self attachAdView];
}  

- (void)setPlacement:(NSString *)placement
{
    self.mPlacement = placement;
    
    if ( self.mAdView )
    {
        self.mAdView.placement = placement;
    }
}

- (void)setCustomData:(NSString *)customData
{
    self.mCustomData = customData;
    
    if ( self.mAdView )
    {
        self.mAdView.customData = customData;
    }
}

- (void)setAdaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    self.mAdaptiveBannerEnabled = adaptiveBannerEnabled;
    
    if ( self.mAdView )
    {
        [self.mAdView setExtraParameterForKey: @"adaptive_banner" value: (adaptiveBannerEnabled ? @"YES" : @"NO")];
    }
}

- (void)setAutoRefresh:(BOOL)autoRefresh
{
    self.mAutoRefresh = autoRefresh;
    
    if ( self.mAdView )
    {
        if ( autoRefresh )
        {
            [self.mAdView startAutoRefresh];
        }
        else
        {
            [self.mAdView stopAutoRefresh];
        }
    }
}

- (void)attachAdView
{
    // This dispatch_async allows finishing to get all properties
    dispatch_async(dispatch_get_main_queue(), ^{
        
        if ( self.mAdView ) return;

        // If ad unit id and format has been set - create and attach AdView
        if ( !( [self.mAdUnitId al_isValidString] && self.mAdFormat )) return;
        
        self.mAdView = [[MAAdView alloc] initWithAdUnitIdentifier: self.mAdUnitId adFormat: self.mAdFormat sdk: AppLovinMAX.shared.sdk];
        self.mAdView.frame = (CGRect) { CGPointZero, self.mAdFormat.size };
        self.mAdView.delegate = AppLovinMAX.shared; // Go through core class for callback forwarding to React Native layer
        self.mAdView.revenueDelegate = AppLovinMAX.shared;
        
        self.mAdView.placement = self.mPlacement;
        
        self.mAdView.customData = self.mCustomData;
        
        [self.mAdView setExtraParameterForKey: @"adaptive_banner" value: (self.mAdaptiveBannerEnabled ? @"true" : @"false")];
        
        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        [self.mAdView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
        
        if ( self.mAutoRefresh )
        {
            [self.mAdView startAutoRefresh];
        }
        else
        {
            [self.mAdView stopAutoRefresh];
        }
        
        [self.mAdView loadAd];
        
        [self addSubview: self.mAdView];
        
        CGSize adViewSize = [self.mAdFormat adaptiveSizeForWidth: CGRectGetWidth(self.frame)];
        [NSLayoutConstraint activateConstraints: @[[self.mAdView.widthAnchor constraintEqualToConstant: adViewSize.width],
                                                   [self.mAdView.heightAnchor constraintEqualToConstant: adViewSize.height],
                                                   [self.mAdView.centerXAnchor constraintEqualToAnchor: self.centerXAnchor],
                                                   [self.mAdView.centerYAnchor constraintEqualToAnchor: self.centerYAnchor]]];
        
    });
}

// Called when the subview’s superview changes or when the subview is
// removed from the view hierarchy completely.
- (void)willRemoveSubview:(UIView *)subview
{
    // This view is being removed
    if ( subview == nil )
    {
        if ( self.mAdView )
        {
            self.mAdView.delegate = nil;
            self.mAdView.revenueDelegate = nil;
            
            [self.mAdView removeFromSuperview];
        }
    }
}

@end
