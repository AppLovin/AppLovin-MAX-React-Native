#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"
#import "AppLovinMAXAdViewUIComponent.h"

@interface AppLovinMAXAdViewUIComponent()<MAAdViewAdDelegate, MAAdRevenueDelegate>

@property (nonatomic, strong) MAAdView *adView;

@property (nonatomic, weak, nullable) AppLovinMAXAdView *containerView;

@end

@implementation AppLovinMAXAdViewUIComponent

- (instancetype)initWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat isAdaptive:(BOOL)isAdaptive
{
    self = [super init];
    if ( self )
    {
        MAAdViewConfiguration *config = [MAAdViewConfiguration configurationWithBuilderBlock:^(MAAdViewConfigurationBuilder *builder) {

            if ( [adFormat isBannerOrLeaderAd] )
            {
                if ( isAdaptive )
                {
                    builder.adaptiveType = MAAdViewAdaptiveTypeAnchored;
                }
                else
                {
                    builder.adaptiveType = MAAdViewAdaptiveTypeNone;
                }
            }
        }];

        self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat configuration: config];
        self.adView.delegate = self;
        self.adView.revenueDelegate = self;
                
        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        [self.adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
        
        [self.adView stopAutoRefresh];
        
        // Set a frame size to suppress an error of zero area for MAAdView
        self.adView.frame = (CGRect) { CGPointZero, adFormat.size };
    }
    return self;
}

- (NSString *)adUnitIdentifier
{
    return self.adView.adUnitIdentifier;
}

- (void)setPlacement:(nullable NSString *)placement
{
    self.adView.placement = placement;
}

- (void)setCustomData:(nullable NSString *)customData
{
    self.adView.customData = customData;
}

- (void)setAutoRefreshEnabled:(BOOL)autoRefresh
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

- (void)setExtraParameters:(nullable NSDictionary<NSString *, id> *)parameterDict
{
    for ( NSString *key in parameterDict )
    {
        id value = parameterDict[key];
        [self.adView setExtraParameterForKey: key value: (value != [NSNull null] ? value : nil)];
    }
}

- (void)setLocalExtraParameters:(nullable NSDictionary<NSString *, id> *)parameterDict
{
    for ( NSString *key in parameterDict )
    {
        id value = parameterDict[key];
        [self.adView setLocalExtraParameterForKey: key value: (value != [NSNull null] ? value : nil)];
    }
}

- (BOOL)hasContainerView
{
    return self.containerView != nil;
}

- (void)attachAdView:(AppLovinMAXAdView *)view
{
    self.containerView = view;
    
    self.adView.frame = (CGRect) { CGPointZero, view.frame.size };
    
    [view addSubview: self.adView];
    
    [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToAnchor: view.widthAnchor],
                                               [self.adView.heightAnchor constraintEqualToAnchor: view.heightAnchor],
                                               [self.adView.centerXAnchor constraintEqualToAnchor: view.centerXAnchor],
                                               [self.adView.centerYAnchor constraintEqualToAnchor: view.centerYAnchor]]];
}

- (void)detachAdView
{
    self.containerView = nil;
    
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
    NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
    [body addEntriesFromDictionary: [[AppLovinMAX shared] adInfoForAd: ad]];
    
    if ( [AppLovinMAXAdView hasPreloadedAdViewForIdentifier: @(self.hash)] )
    {
        [[AppLovinMAX shared] sendEventWithName: ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT body: body];
    }
    
    if ( self.containerView )
    {
        self.containerView.onAdLoadedEvent(body);
    }
}

- (void)didFailToLoadAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
    [body addEntriesFromDictionary: [[AppLovinMAX shared] adLoadFailedInfoForAd: adUnitIdentifier withError: error]];
    
    if ( [AppLovinMAXAdView hasPreloadedAdViewForIdentifier: @(self.hash)] )
    {
        [[AppLovinMAX shared] sendEventWithName: ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT body: body];
    }
    
    if ( self.containerView )
    {
        self.containerView.onAdLoadFailedEvent(body);
    }
}

- (void)didFailToDisplayAd:(MAAd *)ad withError:(MAError *)error
{
    if ( self.containerView )
    {
        NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
        [body addEntriesFromDictionary: [[AppLovinMAX shared] adDisplayFailedInfoForAd: ad withError: error]];
        
        self.containerView.onAdDisplayFailedEvent(body);
    }
}

- (void)didClickAd:(MAAd *)ad
{
    if ( self.containerView )
    {
        NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
        [body addEntriesFromDictionary: [[AppLovinMAX shared] adInfoForAd: ad]];
        
        self.containerView.onAdClickedEvent(body);
    }
}

#pragma mark - MAAdViewAdDelegate Protocol

- (void)didExpandAd:(MAAd *)ad
{
    if ( self.containerView )
    {
        NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
        [body addEntriesFromDictionary: [[AppLovinMAX shared] adInfoForAd: ad]];
        
        self.containerView.onAdExpandedEvent(body);
    }
}

- (void)didCollapseAd:(MAAd *)ad
{
    if ( self.containerView )
    {
        NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
        [body addEntriesFromDictionary: [[AppLovinMAX shared] adInfoForAd: ad]];
        
        self.containerView.onAdCollapsedEvent(body);
    }
}

#pragma mark - MAAdRevenueDelegate Protocol

- (void)didPayRevenueForAd:(MAAd *)ad
{
    if ( self.containerView )
    {
        NSMutableDictionary *body = [@{@"adViewId": @(self.hash)} mutableCopy];
        [body addEntriesFromDictionary: [[AppLovinMAX shared] adInfoForAd: ad]];
        
        self.containerView.onAdRevenuePaidEvent(body);
    }
}

#pragma mark - Deprecated Callbacks

- (void)didDisplayAd:(MAAd *)ad {}
- (void)didHideAd:(MAAd *)ad {}

@end
