#import <React/RCTUIManager.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdLoader.h"
#import "AppLovinMAXNativeAdView.h"

@interface AppLovinMaxNativeAdLoader()  <MANativeAdDelegate>

@property (nonatomic, strong, nullable) MANativeAdLoader *nativeAdLoader;
@property (nonatomic, strong, nullable) MANativeAdView *nativeAdView;
@property (nonatomic, weak) AppLovinMAXNativeAdView *reactView;

@end

@implementation AppLovinMaxNativeAdLoader

- (void)destroy
{
    [self destroyNativeAdView];
}

- (void)load:(NSString *)adUnitIdentifier
   placement:(nullable NSString *)placement
  customData:(nullable NSString *)customData
extraParameters:(nullable NSDictionary *)extraParameters
   reactView:(AppLovinMAXNativeAdView *)reactView
{
    if ( !self.nativeAdLoader )
    {
        self.nativeAdLoader = [[MANativeAdLoader alloc] initWithAdUnitIdentifier: adUnitIdentifier
                                                                             sdk: [AppLovinMAX shared].sdk];
        self.nativeAdLoader.revenueDelegate = [AppLovinMAX shared];
        self.nativeAdLoader.nativeAdDelegate = self;
    }
    
    self.nativeAdLoader.placement = placement;
    self.nativeAdLoader.customData = customData;
    if ( extraParameters )
    {
        for ( NSString *key in extraParameters )
        {
            [self.nativeAdLoader setExtraParameterForKey: key value: extraParameters[key]];
        }
    }
    
    self.reactView = reactView;
    
    [self.nativeAdLoader loadAd];
}

- (void)didLoadNativeAd:(nullable MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    [self destroyNativeAdView];
    
    self.nativeAdView = nativeAdView;
    
    [self.reactView didLoadNativeAd: ad];
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    [self.reactView didFailToLoadNativeAd: error];
}

- (void)didClickNativeAd:(MAAd *)ad
{
    [[AppLovinMAX shared] didClickAd: ad];
}

- (void)performCallToAction
{
    if ( !self.nativeAdView )
    {
        [AppLovinMAX.shared log: @"Attempting to generate a CTA event without a native ad view: %@", self];
        return;
    }
    
    if ( !self.nativeAdView.callToActionButton )
    {
        [AppLovinMAX.shared log: @"callToActionButton is not found in MANativeAdView: %@", self.nativeAdView];
        return;
    }
    
    [self.nativeAdView.callToActionButton sendActionsForControlEvents:UIControlEventTouchUpInside];
}

- (void)addNativeAdview:(UIView *)view
{
    if ( !self.nativeAdView )
    {
        [AppLovinMAX.shared log: @"Attempting to add a non-existing native ad view: %@", self];
        return;
    }
    
    [self.nativeAdView setHidden: YES];
    
    [view addSubview: self.nativeAdView];
}

- (void)destroyAd:(MAAd *)ad
{
    if ( !self.nativeAdLoader )
    {
        [AppLovinMAX.shared log: @"Attempting to destroy a MAAd ad without nativeAdLoader: %@", self];
        return;
    }
    
    [self.nativeAdLoader destroyAd: ad];
}

-(void)destroyNativeAdView
{
    if ( self.nativeAdView )
    {
        [self.nativeAdView removeFromSuperview];
        self.nativeAdView = nil;
    }
}

@end
