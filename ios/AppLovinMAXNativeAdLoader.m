#import <React/RCTUIManager.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdLoader.h"

@interface AppLovinMaxNativeAdLoader ()  <MANativeAdDelegate>

@property (nonatomic, strong, nullable) MANativeAdLoader *nativeAdLoader;
@property (nonatomic, strong, nullable) MANativeAdView *nativeAdView;
@property (nonatomic, weak) id<AppLovinMAXNativeAdLoaderDelegate> nativeAdLoaderDelegate;

@end

@implementation AppLovinMaxNativeAdLoader

- (void)destroy
{
    [self destroyNativeAdView];
}

- (void)load:(NSString *)adUnitIdentifier placement:(nullable NSString *)placement customData:(nullable NSString *)customData extraParameters:(nullable NSDictionary *)extraParameters delegate:(id<AppLovinMAXNativeAdLoaderDelegate>)delegate
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
    
    self.nativeAdLoaderDelegate = delegate;
    
    [self.nativeAdLoader loadAdIntoAdView: [self createNativeAdView]];
}

- (void)didLoadNativeAd:(nullable MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    [self destroyNativeAdView];
    
    self.nativeAdView = nativeAdView;
    
    [self.nativeAdLoaderDelegate didLoadNativeAd: ad];
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    [self.nativeAdLoaderDelegate didFailToLoadNativeAdForAdUnitIdentifier: adUnitIdentifier withError: error];
}

- (void)didClickNativeAd:(MAAd *)ad
{
    [self.nativeAdLoaderDelegate didClickNativeAd: ad];
}

- (void)performCallToAction
{
    if ( !self.nativeAdView )
    {
        [AppLovinMAX.shared log: @"Attempting to generate a CTA event without a native ad view: %@", self];
        return;
    }
    
    if ( self.nativeAdView.callToActionButton )
    {
        [self.nativeAdView.callToActionButton sendActionsForControlEvents:UIControlEventTouchUpInside];
    }
    else
    {
        [AppLovinMAX.shared log: @"callToActionButton is not found in MANativeAdView: %@", self.nativeAdView];
    }
}

- (void)addNativeAdview:(UIView *)view
{
    if ( !self.nativeAdView )
    {
        [AppLovinMAX.shared log: @"Attempting to add a non-existing native ad view: %@", self];
        return;
    }
    
    [view addSubview: self.nativeAdView];
}

- (void)destroyAd:(MAAd *)ad
{
    if ( self.nativeAdLoader )
    {
        [self.nativeAdLoader destroyAd: ad];
    }
    else
    {
        [AppLovinMAX.shared log: @"Attempting to destroy a MAAd ad without nativeAdLoader: %@", self];
    }
}

// Creates a MANativeAdView native ad view that won't be visible but used to generate a button event
// and a revenue event
- (MANativeAdView *)createNativeAdView
{
    MANativeAdView *nativeAdView = [[MANativeAdView alloc] initWithFrame: CGRectMake( 0, 0, 1, 1)];
    nativeAdView.hidden = true;
    
    int min = 10000;
    int max = 100000;
    int tag = min + arc4random_uniform((uint32_t)(max - min + 1));
    
    UIButton *callToActionButton = [[UIButton alloc] initWithFrame: CGRectMake( 0, 0, 1, 1)];
    callToActionButton.backgroundColor = [UIColor systemBlueColor];
    callToActionButton.tag = tag;
    
    [nativeAdView addSubview: callToActionButton];
    
    MANativeAdViewBinder *binder = [[MANativeAdViewBinder alloc] initWithBuilderBlock:^(MANativeAdViewBinderBuilder *builder) {
        builder.callToActionButtonTag = tag;
    }];
    
    [nativeAdView bindViewsWithAdViewBinder: binder];
    
    return nativeAdView;
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
