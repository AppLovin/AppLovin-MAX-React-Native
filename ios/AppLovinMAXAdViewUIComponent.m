#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"
#import "AppLovinMAXAdViewUIComponent.h"

@interface AppLovinMAXAdViewUIComponent()<MAAdViewAdDelegate, MAAdRevenueDelegate>

@property (nonatomic, strong) MAAdView *adView;

@property (nonatomic, weak, nullable) AppLovinMAXAdView *containerReactView;

@end

@implementation AppLovinMAXAdViewUIComponent

- (instancetype)initWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    self = [super init];
    if ( self )
    {
        self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat sdk: [AppLovinMAX shared].sdk];
        self.adView.delegate = self;
        self.adView.revenueDelegate = self;
        
        [self.adView setExtraParameterForKey: @"adaptive_banner" value: @"true"];
        
        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        [self.adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
        
        // Set frame to supprss an error of zero Adview area
        self.adView.frame = (CGRect) { CGPointZero, adFormat.size };
    }
    return self;
}

- (BOOL)isAdViewAttached
{
    return self.containerReactView != nil;
}

- (void)setPlacement:(NSString *)placement
{
    self.adView.placement = placement;
}

- (void)setCustomData:(NSString *)customData
{
    self.adView.customData = customData;
}

- (void)setAdaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    [self.adView setExtraParameterForKey: @"adaptive_banner" value: adaptiveBannerEnabled ? @"true" : @"false"];
}

- (void)setAutoRefresh:(BOOL)autoRefresh
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

-(void)setExtraParameters:(NSDictionary<NSString *, id> *)parameterDict
{
    for (NSString *key in parameterDict)
    {
        NSString *value = (NSString *) parameterDict[key];
        [self.adView setExtraParameterForKey:key value:value];
    }
}

-(void)setLocalExtraParameters:(NSDictionary<NSString *, id> *)parameterDict
{
    for (NSString *key in parameterDict)
    {
        id value = parameterDict[key];
        [self.adView setLocalExtraParameterForKey:key value:value];
    }
}

- (void)attachAdView:(AppLovinMAXAdView *)view
{
    self.containerReactView = view;
    
    self.adView.frame = (CGRect) { CGPointZero, view.frame.size };
    
    [view addSubview: self.adView];
    
    [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToAnchor: view.widthAnchor],
                                               [self.adView.heightAnchor constraintEqualToAnchor: view.heightAnchor],
                                               [self.adView.centerXAnchor constraintEqualToAnchor: view.centerXAnchor],
                                               [self.adView.centerYAnchor constraintEqualToAnchor: view.centerYAnchor]]];
}

- (void)detachAdView
{
    self.containerReactView = nil;
    
    [self.adView removeFromSuperview];
}

- (void)loadAd
{
    [self.adView loadAd];
}

- (void)destroy
{
    [self detachAdView];
    
    self.adView.delegate = nil;
    self.adView.revenueDelegate = nil;
}

#pragma mark - MAAdDelegate Protocol

- (void)didLoadAd:(MAAd *)ad
{
    NSDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: ad];
    
    if ( self.onPromiseResolve )
    {
        self.onPromiseResolve(adInfo);
        self.onPromiseResolve = nil;
    }
    
    if ( self.containerReactView )
    {
        self.containerReactView.onAdLoadedEvent(adInfo);
    }
}

- (void)didFailToLoadAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    NSDictionary *adLoadFailedInfo = [[AppLovinMAX shared] adLoadFailedInfoForAd: adUnitIdentifier withError: error];
    
    if ( self.onPromiseResolve )
    {
        self.onPromiseResolve(adLoadFailedInfo);
        self.onPromiseResolve = nil;
    }
    
    if ( self.containerReactView )
    {
        self.containerReactView.onAdLoadFailedEvent(adLoadFailedInfo);
    }
}

- (void)didFailToDisplayAd:(MAAd *)ad withError:(MAError *)error
{
    if ( self.containerReactView )
    {
        self.containerReactView.onAdDisplayFailedEvent([[AppLovinMAX shared] adDisplayFailedInfoForAd: ad withError: error]);
    }
}

- (void)didClickAd:(MAAd *)ad
{
    if ( self.containerReactView )
    {
        self.containerReactView.onAdClickedEvent([[AppLovinMAX shared] adInfoForAd: ad]);
    }
}

#pragma mark - MAAdViewAdDelegate Protocol

- (void)didExpandAd:(MAAd *)ad
{
    if ( self.containerReactView )
    {
        self.containerReactView.onAdExpandedEvent([[AppLovinMAX shared] adInfoForAd: ad]);
    }
}

- (void)didCollapseAd:(MAAd *)ad
{
    if ( self.containerReactView )
    {
        self.containerReactView.onAdCollapsedEvent([[AppLovinMAX shared] adInfoForAd: ad]);
    }
}

#pragma mark - MAAdRevenueDelegate Protocol

- (void)didPayRevenueForAd:(MAAd *)ad
{
    if ( self.containerReactView )
    {
        self.containerReactView.onAdRevenuePaidEvent([[AppLovinMAX shared] adRevenueInfoForAd: ad]);
    }
}

#pragma mark - Deprecated Callbacks

- (void)didDisplayAd:(MAAd *)ad {}
- (void)didHideAd:(MAAd *)ad {}

@end
