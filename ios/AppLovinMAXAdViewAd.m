#import "AppLovinMAX.h"
#import "AppLovinMAXAdViewAdManager.h"
#import "AppLovinMAXAdViewAd.h"

@interface AppLovinMAXAdViewAd()<MAAdViewAdDelegate, MAAdRevenueDelegate>
@property (nonatomic, weak) AppLovinMAXAdViewAdManager *manager;
@property (nonatomic, strong) MAAdView *adView;
@end

@implementation AppLovinMAXAdViewAd

- (instancetype)initWithManager:(AppLovinMAXAdViewAdManager *)manager
{
    self = [super init];
    if ( self )
    {
        self.manager = manager;
    }
    
    return self;
}

- (NSNumber *)createAdView:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat
{
    self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat sdk: [AppLovinMAX shared].sdk];
    
    self.adView.delegate = self;
    self.adView.revenueDelegate = self;
    self.adView.userInteractionEnabled = NO;
    self.adView.translatesAutoresizingMaskIntoConstraints = NO;

    [self.adView setExtraParameterForKey: @"adaptive_banner" value: @"true"];
    
    // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
    [self.adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
    
    // Hide AdView until it is attached to the parent view
    self.adView.hidden = YES;
    
    // Set frame to supprss an error of zero Adview area
    self.adView.frame = (CGRect) { CGPointZero, adFormat.size };

    [self.adView stopAutoRefresh];

    [self.adView loadAd];

    [[AppLovinMAX shared] log: @"Ad Unit ID %@ MAAdView is created with id %@", adUnitIdentifier, self.hash];
    
    return @(self.hash);
}

-(void)destroyAdView
{
    [self.adView removeFromSuperview];
    
    [[AppLovinMAX shared] log: @"Ad Unit ID %@ MAAdView is destroyed with id %@", self.adView.adUnitIdentifier, self.hash];

    self.adView.delegate = nil;
    self.adView.revenueDelegate = nil;

    self.adView = nil;
}

-(void)loadAd
{
    [self.adView loadAd];
}

-(void)setPlacement:(nullable NSString *)placement
{
    self.adView.placement = placement;
}

-(void)setCustomData:(nullable NSString *)customData
{
    self.adView.customData = customData;
}

-(void)setAdaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    [self.adView setExtraParameterForKey: @"adaptive_banner" value: adaptiveBannerEnabled ? @"true" : @"false"];
}

-(void)setAutoRefresh:(BOOL)autoRefresh
{
    _autoRefresh = autoRefresh;

    if ( self.adView.isHidden ) return;
    
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

-(void)attachView:(UIView *)view
{
    self.adView.hidden = NO;
    self.adView.userInteractionEnabled = YES;

    if ( self.isAutoRefresh )
    {
        [self.adView startAutoRefresh];
    }

    self.adView.frame = (CGRect) { CGPointZero, view.frame.size };

    [view addSubview: self.adView];
    
    [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToAnchor: view.widthAnchor],
                                               [self.adView.heightAnchor constraintEqualToAnchor: view.heightAnchor],
                                               [self.adView.centerXAnchor constraintEqualToAnchor: view.centerXAnchor],
                                               [self.adView.centerYAnchor constraintEqualToAnchor: view.centerYAnchor]]];
}

-(void)detachView
{
    [self.adView removeFromSuperview];

    self.adView.hidden = YES;
    self.adView.userInteractionEnabled = NO;

    [self.adView stopAutoRefresh];
}

#pragma mark - MAAdDelegate Protocol

- (void)didLoadAd:(nonnull MAAd *)ad
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: ad].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendLoadAdEvent: adInfo];
}

- (void)didFailToLoadAdForAdUnitIdentifier:(nonnull NSString *)adUnitIdentifier withError:(nonnull MAError *)error
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adLoadFailedInfoForAd: adUnitIdentifier withError: error].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendFailToLoadAdEvent: adInfo];
}

- (void)didFailToDisplayAd:(nonnull MAAd *)ad withError:(nonnull MAError *)error
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adDisplayFailedInfoForAd: ad withError: error].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendFailToDisplayAEvent: adInfo];
}

- (void)didClickAd:(nonnull MAAd *)ad
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: ad].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendClickAdEvent: adInfo];
}

#pragma mark - MAAdViewAdDelegate Protocol

- (void)didExpandAd:(nonnull MAAd *)ad
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: ad].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendExpandAdEvent: adInfo];
}

- (void)didCollapseAd:(nonnull MAAd *)ad
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: ad].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendCollapseAdEvent: adInfo];
}

#pragma mark - MAAdRevenueDelegate Protocol

- (void)didPayRevenueForAd:(nonnull MAAd *)ad
{
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adRevenueInfoForAd: ad].mutableCopy;
    adInfo[@"adViewAdId"] = @(self.hash);
    [self.manager sendPayRevenueEvent: adInfo];
}

#pragma mark - Deprecated Callbacks

- (void)didDisplayAd:(nonnull MAAd *)ad {}
- (void)didHideAd:(nonnull MAAd *)ad {}

@end
