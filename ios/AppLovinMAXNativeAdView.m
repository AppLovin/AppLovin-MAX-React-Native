#import <React/RCTUIManagerUtils.h>
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"

// NOTE: Exposed publicly as of 11.5.1
@interface UIImageView (ALUtils)
- (void)al_setImageWithURL:(NSURL *)URL;
@end

@interface AppLovinMAXNativeAdView()<MANativeAdDelegate>

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong, nullable) MANativeAdLoader *adLoader;
@property (nonatomic, strong, nullable) MAAd *nativeAd;
@property (nonatomic, strong) MANativeAdView *nativeAdView;
@property (nonatomic, strong) ALAtomicBoolean *isLoading; // Guard against repeated ad loads

// JavaScript properties
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;

// Callback to `AppLovinNativeAdView.js`
@property (nonatomic, copy) RCTDirectEventBlock onNativeAdLoaded;

@end

@implementation AppLovinMAXNativeAdView

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    self = [super init];
    if ( self )
    {
        self.bridge = bridge;
        self.isLoading = [[ALAtomicBoolean alloc] init];
    }
    return self;
}

// Lazily loaded for when Ad Unit ID is available
- (nullable MANativeAdLoader *)adLoader
{
    if ( ![self.adUnitId al_isValidString] ) return nil;
    
    if ( ![self.adUnitId isEqualToString: _adLoader.adUnitIdentifier] )
    {
        _adLoader = [[MANativeAdLoader alloc] initWithAdUnitIdentifier: self.adUnitId sdk: [AppLovinMAX shared].sdk];
        _adLoader.nativeAdDelegate = self;
        _adLoader.revenueDelegate = [AppLovinMAX shared];
    }
    
    return _adLoader;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    if ( !self.window )
    {
        [self destroyCurrentAdIfNeeded];
    }
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( ![adUnitId al_isValidString] ) return;
        
    _adUnitId = adUnitId;
    
    // Explicitly invoke ad load now that Ad Unit ID is set, but do so after 0.25s to allow other props to set
    dispatchOnMainQueueAfter(0.25, ^{
        [self loadAd];
    });
}

// Called when Ad Unit ID is set, and via RN layer
- (void)loadAd
{
    if ( [self.isLoading compareAndSet: NO update: YES] )
    {
        [[AppLovinMAX shared] log: @"Loading a native ad for Ad Unit ID: %@...", self.adUnitId];
        
        self.adLoader.placement = self.placement;
        self.adLoader.customData = self.customData;
        
        for ( NSString *key in self.extraParameters )
        {
            [self.adLoader setExtraParameterForKey: key value: self.extraParameters[key]];
        }
        
        [self.adLoader loadAd];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Ignoring request to load native ad for Ad Unit ID %@, another ad load in progress", self.adUnitId];
    }
}

#pragma mark - Views to Replace
// TODO: I think next 3 calls are for custom... but setMediaView: is called...
// I think he actually only supports custom... but TBD
- (void)setMediaView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.mediaView ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a media view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
//    [view addSubview: self.nativeAd.nativeAd.mediaView];
//    [view al_pinToSuperview];
}

- (void)setOptionsView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.optionsView ) return;
       
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find an options view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
//    [view addSubview: self.nativeAd.nativeAd.optionsView];
//    [view al_pinToSuperview];
}

- (void)setIconImage:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.icon ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view || ![view isKindOfClass: [UIImageView class]] )
    {
        [[AppLovinMAX shared] log: @"Cannot find an icon image view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    UIImageView *iconImageView = (UIImageView *) view;
    UIImage *iconImage = self.nativeAd.nativeAd.icon.image;
    NSURL *iconURL = self.nativeAd.nativeAd.icon.URL;
    
    if ( iconImage )
    {
        iconImageView.image = iconImage;
    }
    else // iconURL
    {
        [iconImageView al_setImageWithURL: iconURL];
    }
}

#pragma mark - Ad Loader Delegate

- (void)didLoadNativeAd:(nullable MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    [[AppLovinMAX shared] log: @"Native ad loaded: %@", ad];
    
    // NOTE: For v1, we only support template native ads
    if ( !nativeAdView )
    {
        [[AppLovinMAX shared] log: @"Attempting to load native ad of non-template type, ignoring..."];
        return;
    }
    
    // TODO(Hiroshi): Why did we previously (in `AppLovinMaxNativeAdLoader` remove this `AppLovinMAXNativeAdView` from superview?)
    // [self destroyNativeAdView];
    
    [self destroyCurrentAdIfNeeded];
    
    self.nativeAd = ad;
    
    self.nativeAdView = nativeAdView;
    [self addSubview: nativeAdView];
    
    // Notify `AppLovinNativeAdView.js`
    [self sendAdLoadedReactNativeEventForAd: ad.nativeAd];
    
    // Notify publisher
    [[AppLovinMAX shared] didLoadAd: ad]; 
    
    [self.isLoading set: NO];
}

- (void)sendAdLoadedReactNativeEventForAd:(MANativeAd *)ad
{
    NSMutableDictionary<NSString *, id> *jsNativeAd = [NSMutableDictionary dictionaryWithCapacity: 6];
    
    if ( ad.title )
    {
        jsNativeAd[@"title"] = ad.title;
    }
    if ( ad.advertiser )
    {
        jsNativeAd[@"advertiser"] = ad.advertiser;
    }
    if ( ad.body )
    {
        jsNativeAd[@"body"] = ad.body;
    }
    if ( ad.callToAction )
    {
        jsNativeAd[@"callToAction"] = ad.callToAction;
    }
    if ( ad.icon )
    {
        if ( ad.icon.URL )
        {
            jsNativeAd[@"url"] = ad.icon.URL.absoluteString;
        }
        else if ( ad.icon.image )
        {
            jsNativeAd[@"image"] = @(YES);
        }
    }
    if ( !isnan(ad.mediaContentAspectRatio) )
    {
        jsNativeAd[@"mediaContentAspectRatio"] = @(ad.mediaContentAspectRatio);
    }
     
    // Send to `AppLovinNativeAdView.js` to render the views
    self.onNativeAdLoaded(jsNativeAd);
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    [self.isLoading set: NO];
    
    [[AppLovinMAX shared] log: @"Failed to load native ad for Ad Unit ID %@ with error: %@", self.adUnitId, error];
    
    // Notify publisher
    [[AppLovinMAX shared] handleNativeAdLoadFailureForAdUnitIdentifier: self.adUnitId error: error];
}

- (void)didClickNativeAd:(MAAd *)ad
{
    [[AppLovinMAX shared] didClickAd: ad];
}

- (void)performCallToAction
{
    // TODO(Thomas): Figure out implementation
//    if ( !self.nativeAdView )
//    {
//        [AppLovinMAX.shared log: @"Attempting to generate a CTA event without a native ad view: %@", self];
//        return;
//    }
//
//    if ( !self.nativeAdView.callToActionButton )
//    {
//        [AppLovinMAX.shared log: @"callToActionButton is not found in MANativeAdView: %@", self.nativeAdView];
//        return;
//    }
//
//    [self.nativeAdView.callToActionButton sendActionsForControlEvents:UIControlEventTouchUpInside];
}

- (void)destroyCurrentAdIfNeeded
{
    if ( self.nativeAd )
    {
        if ( self.nativeAd.nativeAd )
        {
            if ( self.nativeAd.nativeAd.mediaView )
            {
                [self.nativeAd.nativeAd.mediaView removeFromSuperview];
            }
            if ( self.nativeAd.nativeAd.optionsView )
            {
                [self.nativeAd.nativeAd.optionsView removeFromSuperview];
            }
        }
        
        [self.adLoader destroyAd: self.nativeAd];
        
        self.nativeAd = nil;
    }
}

@end
