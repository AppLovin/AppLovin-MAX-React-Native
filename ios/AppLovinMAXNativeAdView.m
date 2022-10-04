#import <React/RCTUIManagerUtils.h>
#import <React/RCTImageView.h>
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"

@interface MANativeAdLoader()
- (void)registerClickableViews:(NSArray<UIView *> *)clickableViews
                 withContainer:(UIView *)container
                         forAd:(MAAd *)ad;
- (void)handleNativeAdViewRenderedForAd:(MAAd *)ad;
@end

@interface AppLovinMAXNativeAdView()<MANativeAdDelegate>

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong, nullable) MANativeAdLoader *adLoader;
@property (nonatomic, strong, nullable) MAAd *nativeAd;
@property (nonatomic, strong) ALAtomicBoolean *isLoading; // Guard against repeated ad loads

// JavaScript properties
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;

// Callback to `AppLovinNativeAdView.js`
@property (nonatomic, copy) RCTDirectEventBlock onNativeAdLoaded;

// TODO: Allow publisher to select which views are clickable and which isn't via prop
@property (nonatomic, strong) NSMutableArray<UIView *> *clickableViews;

@end

@implementation AppLovinMAXNativeAdView

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    self = [super init];
    if ( self )
    {
        self.bridge = bridge;
        self.isLoading = [[ALAtomicBoolean alloc] init];
        self.clickableViews = [NSMutableArray array];
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

- (void)setTitleView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.title ) return;
  
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    [self.clickableViews addObject: view];
}

- (void)setAdvertiserView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.advertiser ) return;
  
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    [self.clickableViews addObject: view];
}

- (void)setBodyView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.body ) return;
  
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    [self.clickableViews addObject: view];
}

- (void)setCallToActionView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.callToAction ) return;
  
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    [self.clickableViews addObject: view];
}

- (void)setMediaView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.mediaView ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    [self.clickableViews addObject: view];
  
    [view addSubview: self.nativeAd.nativeAd.mediaView];
    [self.nativeAd.nativeAd.mediaView al_pinToSuperview];
}

- (void)setOptionsView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.optionsView ) return;
       
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
  
    [view addSubview: self.nativeAd.nativeAd.optionsView];
    [self.nativeAd.nativeAd.optionsView al_pinToSuperview];
}

- (void)setIconView:(NSNumber *)tag
{
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( ![view isKindOfClass: [RCTImageView class]] )
    {
        [[AppLovinMAX shared] log: @"Cannot find an icon image view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
 
  [self.clickableViews addObject: view];
  
  MANativeAdImage *icon = self.nativeAd.nativeAd.icon;
  
    // Check if "URL" was missing and therefore need to set the image data
    if ( !icon.URL && icon.image )
    {
        RCTImageView *iconImageView = (RCTImageView *) view;
        iconImageView.defaultImage = self.nativeAd.nativeAd.icon.image;
    }
}

#pragma mark - Ad Loader Delegate

- (void)didLoadNativeAd:(nullable MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    [[AppLovinMAX shared] log: @"Native ad loaded: %@", ad];
 
    // Log a warning if it is a template native ad returned - as our plugin will be responsible for re-rendering the native ad's assets
    if ( nativeAdView )
    {
        [self.isLoading set: NO];
        
        [[AppLovinMAX shared] log: @"Native ad is of template type, failing ad load..."];
        [[AppLovinMAX shared] handleNativeAdLoadFailureForAdUnitIdentifier: self.adUnitId error: nil];
        
        return;
    }
    
    [self destroyCurrentAdIfNeeded];
    
    self.nativeAd = ad;
    
    // Notify `AppLovinNativeAdView.js`
    [self sendAdLoadedReactNativeEventForAd: ad.nativeAd];
    
    // Notify publisher
    [[AppLovinMAX shared] didLoadAd: ad]; 
    
    [self.adLoader registerClickableViews: self.clickableViews withContainer: self forAd: ad];
    [self.adLoader handleNativeAdViewRenderedForAd: ad];
  
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
  
    [self.clickableViews removeAllObjects];
}

@end
