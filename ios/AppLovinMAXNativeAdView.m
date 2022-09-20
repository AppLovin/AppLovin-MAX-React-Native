#import <React/RCTUIManagerUtils.h>
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"
#import "AppLovinMAXNativeAdLoader.h"

@interface AppLovinMAXNativeAdView()

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) AppLovinMaxNativeAdLoader *nativeAdLoader;
@property (nonatomic, strong, nullable) MAAd *nativeAd;
@property (nonatomic, assign, getter=isLoadingNativeAd, setter=setLoadingNativeAd:) BOOL loadingNativeAd;

// Javascript properties
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;

// Callback to Javascript
@property (nonatomic, copy) RCTDirectEventBlock onNativeAdLoaded;

@end

@implementation AppLovinMAXNativeAdView

// Ad Unit ID that has an error from loading a native ad
static NSString *NativeAdLoaderErrorAdUnitIdentifier;

+ (NSString *)loadErrorAdUnitIdentifier
{
    return NativeAdLoaderErrorAdUnitIdentifier;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    if ( self = [super init] )
    {
        self.bridge = bridge;
        self.nativeAdLoader = [[AppLovinMaxNativeAdLoader alloc] init];
        [self setLoadingNativeAd: NO];
    }
    return self;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    if ( !self.window )
    {
        [[AppLovinMAX shared] log: @"Destroy AppLovinMAXNativeAdView: %@", self];
        
        [self destroyAd];
        
        [self.nativeAdLoader destroy];
    }
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    _adUnitId = adUnitId;
    
    [self loadInitialNativeAd];
}

- (void)setMediaView:(NSNumber *)tag
{
    if ( !self.nativeAd )
    {
        [[AppLovinMAX shared] log: @"Attempting to set a media view without a MAAd ad with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    if ( !self.nativeAd.nativeAd )
    {
        [[AppLovinMAX shared] log: @"Attempting to set a media view without a MANativeAd native ad with tag \"%@\" for %@", tag, self.nativeAd];
        return;
    }
    
    if ( !self.nativeAd.nativeAd.mediaView )
    {
        [[AppLovinMAX shared] log: @"mediaView is not found in MANativeAd with tag \"%@\" for %@", tag, self.nativeAd.nativeAd];
        return;
    }
    
    UIView *view = [self getNativeView: tag];
    if ( view )
    {
        [self addViewStretched: self.nativeAd.nativeAd.mediaView parent: view];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Cannot find a media view with tag \"%@\" for %@", tag, self.adUnitId];
    }
}

- (void)setOptionsView:(NSNumber *)tag
{
    if ( !self.nativeAd )
    {
        [[AppLovinMAX shared] log: @"Attempting to set an options view without a MAAd ad with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    if ( !self.nativeAd.nativeAd )
    {
        [[AppLovinMAX shared] log: @"Attempting to set an options view without a MANativeAd native ad with tag \"%@\" for %@", tag, self.nativeAd];
        return;
    }
    
    if ( !self.nativeAd.nativeAd.optionsView )
    {
        [[AppLovinMAX shared] log: @"optionsView is not found in MANativeAd with tag \"%@\" for %@", tag, self.nativeAd.nativeAd];
        return;
    }
    
    UIView *view = [self getNativeView: tag];
    if ( view )
    {
        [self addViewStretched: self.nativeAd.nativeAd.optionsView parent: view];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Cannot find an options view with tag \"%@\" for %@", tag, self.adUnitId];
    }
}

- (void)setIconImage:(NSNumber *)tag
{
    if ( !self.nativeAd )
    {
        [[AppLovinMAX shared] log: @"Attempting to set an icon image without a MAAd ad with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    if ( !self.nativeAd.nativeAd )
    {
        [[AppLovinMAX shared] log: @"Attempting to set an icon image without a MANativeAd native ad with tag \"%@\" for %@", tag, self.nativeAd];
        return;
    }
    
    if ( !self.nativeAd.nativeAd.icon )
    {
        [[AppLovinMAX shared] log: @"icon is not found in MANativeAd with tag \"%@\" for %@", tag, self.nativeAd.nativeAd];
        return;
    }
    
    if ( !self.nativeAd.nativeAd.icon.image )
    {
        [[AppLovinMAX shared] log: @"image is not found in the MANativeAd icon with tag \"%@\" for %@", tag, self.nativeAd.nativeAd.icon];
        return;
    }
    
    UIView *view = [self getNativeView: tag];
    if ([view isKindOfClass:[UIImageView class]])
    {
        [self setImageView: self.nativeAd.nativeAd.icon.image view: (UIImageView *) view];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Cannot find an icon view with tag \"%@\" for %@", tag, self.adUnitId];
    }
}

// Loads an initial native ad when this view is mounted
- (void)loadInitialNativeAd
{
    if ( ![self.adUnitId al_isValidString] )
    {
        [[AppLovinMAX shared] log: @"Attempting to load a native ad without Ad Unit ID"];
        return;
    }
    
    // Run after 0.25 sec delay to allow all properties to set
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (0.25 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self loadNativeAd];
    });
}

// Loads a next native ad with the current properties when this is called by Javascript via the View Manager
- (void)loadNativeAd
{
    if ( [self isLoadingNativeAd] )
    {
        [[AppLovinMAX shared] log: @"Attempting to load a native ad before completing previous loading: %@", self.adUnitId];
        return;
    }
    
    [self setLoadingNativeAd: YES];
    
    [[AppLovinMAX shared] log: @"Loading a native ad for %@", self.adUnitId];
    
    [self.nativeAdLoader load: self.adUnitId placement: self.placement customData: self.customData extraParameters: self.extraParameters reactView: self];
}

- (void)didLoadNativeAd:(MAAd *)ad
{
    [[AppLovinMAX shared] log: @"Loaded a native ad: %@", ad];
    
    // Destory the current ad
    [self destroyAd];
    
    self.nativeAd = ad;
    
    // Send this native ad to Javascript
    [self sendNativeAd: ad];
    
    // Inform the app
    [[AppLovinMAX shared] didLoadAd: ad];
    
    // Adding nativeAdView will trigger a revenue delegate
    [self.nativeAdLoader addNativeAdview: self];
    
    [self setLoadingNativeAd: NO];
}

- (void)didFailToLoadNativeAd:(MAError *)error
{
    [[AppLovinMAX shared] log: @"Failed to Load a native ad for %@ with error: %@", self.adUnitId, error];
    
    // Inform the app
    NativeAdLoaderErrorAdUnitIdentifier = self.adUnitId;
    [[AppLovinMAX shared] didFailToLoadAdForAdUnitIdentifier: self.adUnitId withError: error];
    NativeAdLoaderErrorAdUnitIdentifier = @"";
    
    [self setLoadingNativeAd: NO];
}

- (void)sendNativeAd:(MAAd *)ad
{
    MANativeAd *nativeAd = ad.nativeAd;
    
    if ( !nativeAd )
    {
        [[AppLovinMAX shared] log: @"MANativeAd not having a native ad: %@", ad];
        return;
    }
    
    NSMutableDictionary *jsNativeAd = [NSMutableDictionary dictionary];
    
    if ( nativeAd.title )
    {
        jsNativeAd[@"title"] = nativeAd.title;
    }
    if ( nativeAd.advertiser )
    {
        jsNativeAd[@"advertiser"] = nativeAd.advertiser;
    }
    if ( nativeAd.body )
    {
        jsNativeAd[@"body"] = nativeAd.body;
    }
    if ( nativeAd.callToAction )
    {
        jsNativeAd[@"callToAction"] = nativeAd.callToAction;
    }
    if ( nativeAd.icon )
    {
        if ( nativeAd.icon.URL )
        {
            jsNativeAd[@"icon"] = [nativeAd.icon.URL absoluteString];
        }
        else if ( nativeAd.icon.image )
        {
            jsNativeAd[@"image"] = @YES;
        }
    }
    if ( !isnan(nativeAd.mediaContentAspectRatio) )
    {
        jsNativeAd[@"mediaContentAspectRatio"] = @(nativeAd.mediaContentAspectRatio);
    }
    
    // Sending jsNativeAd to Javascript as an event, then Javascript will render the views with jsNativeAd
    self.onNativeAdLoaded(jsNativeAd);
}

// Adds a view to a parent, and stretches it to the size of the parent
- (void)addViewStretched:(UIView *)view parent:(UIView *)parent
{
    view.translatesAutoresizingMaskIntoConstraints = NO;
    [parent addSubview: view];
    
    [view.widthAnchor constraintEqualToAnchor: parent.widthAnchor].active = YES;
    [view.heightAnchor constraintEqualToAnchor: parent.heightAnchor].active = YES;
    [view.centerXAnchor constraintEqualToAnchor: parent.centerXAnchor].active = YES;
    [view.centerYAnchor constraintEqualToAnchor: parent.centerYAnchor].active = YES;
}

- (void)setImageView:(UIImage *)image view:(UIImageView *)view
{
    [view setImage: image];
}

- (void)performCallToAction
{
    [self.nativeAdLoader performCallToAction];
}

// Finds a native UIView from the specified tag (ref)
- (UIView *)getNativeView:(NSNumber *)tag
{
    return [self.bridge.uiManager viewForReactTag: tag];
}

- (void)destroyAd
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
        
        [self.nativeAdLoader destroyAd: self.nativeAd];
        
        self.nativeAd = nil;
    }
}

@end
