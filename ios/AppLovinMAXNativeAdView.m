#import <React/RCTUIManagerUtils.h>
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"

@interface AppLovinMAXNativeAdView () <MANativeAdDelegate>

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) MANativeAdLoader *nativeAdLoader;
@property (nonatomic, strong) MANativeAdView *nativeAdView;
@property (nonatomic, strong, nullable) MAAd *nativeAd;
@property (nonatomic, assign) BOOL loadingAd;

// properties
@property (nonatomic, copy) NSString *adUnitIdentifier;
@property (nonatomic, copy) NSString *placement;
@property (nonatomic, copy) NSString *customData;
@property (nonatomic, copy) NSDictionary *extraParameters;
@property (nonatomic, copy) RCTDirectEventBlock onNativeAdLoaded;

@end

@implementation AppLovinMAXNativeAdView

static NSString *NativeAdLoaderErrorAdUnitIdentifier;

+ (NSString *)errorAdUnitIdentifier
{
    return NativeAdLoaderErrorAdUnitIdentifier;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
    if ( self = [super init] )
    {
        RCTLogInfo( @"AppLovinMAX: NativeAdView: init: %p", self );
        
        self.bridge = bridge;
        self.loadingAd = NO;
    }
    return self;
}

- (void)dealloc
{
    RCTLogInfo( @"AppLovinMAX: NativeAdView: dealloc: %p", self );
    
    [self destroyAd];
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( self.loadingAd ) return;
    
    RCTLogInfo( @"AppLovinMAX: NativeAdView: setAdUnitId: %@", adUnitId );
    
    self.adUnitIdentifier = adUnitId;
    self.loadingAd = YES;
    [self loadAd];
}

- (void)setMediaView:(NSNumber *)tag
{
    if ( !self.nativeAd ) return;
    
    RCTLogInfo( @"AppLovinMAX: NativeAdView: %p setMediaView: %@ for %@", self, self.adUnitIdentifier, tag );
    
    [self addStretchView: self.nativeAd.nativeAd.mediaView toItem: [self getNativeView: tag]];
}

- (void)setOptionsView:(NSNumber *)tag
{
    if ( !self.nativeAd ) return;
    
    RCTLogInfo( @"AppLovinMAX: NativeAdView: setOptionsView: %@", self.adUnitIdentifier );
    
    [self addStretchView: self.nativeAd.nativeAd.optionsView toItem: [self getNativeView: tag]];
}

- (void)setIconImage:(NSNumber *)tag
{
    if ( !self.nativeAd ) return;
    
    RCTLogInfo( @"AppLovinMAX: NativeAdView: setIconImage: %@", self.adUnitIdentifier );
    
    UIView *view = [self getNativeView: tag];
    if ([view isKindOfClass:[UIImageView class]])
    {
        [self setImageView: self.nativeAd.nativeAd.icon.image toView: (UIImageView *) view];
    }
}

- (void)loadAd
{
    RCTLogInfo( @"AppLovinMAX: NativeAdView: %p loadAd: %@", self, self.adUnitIdentifier );
    
    [self load: self.adUnitIdentifier : self.placement : self.customData : self.extraParameters];
}

- (void)destroyAd
{
    if ( self.nativeAd )
    {
        RCTLogInfo( @"AppLovinMAX: NativeAdView: destroyCurrentAd: %p", self.nativeAd );
        
        if (self.nativeAd.nativeAd)
        {
            [self.nativeAd.nativeAd.mediaView removeFromSuperview];
            [self.nativeAd.nativeAd.optionsView removeFromSuperview];
        }
        
        [self.nativeAdLoader destroyAd: self.nativeAd];
    }
    
    if ( self.nativeAdView )
    {
        [self.nativeAdView removeFromSuperview];
    }
}

- (void)load:(NSString *)adUnitIdentifier :(NSString *)placement :(NSString *)customData :(NSDictionary *)extraParameters
{
    self.nativeAdLoader = [[MANativeAdLoader alloc] initWithAdUnitIdentifier: adUnitIdentifier
                                                                         sdk: AppLovinMAX.shared.sdk];
    self.nativeAdLoader.revenueDelegate = AppLovinMAX.shared;
    self.nativeAdLoader.nativeAdDelegate = self;
    self.nativeAdLoader.placement = placement;
    self.nativeAdLoader.customData = customData;
    for ( NSString* key in extraParameters )
    {
        [self.nativeAdLoader setExtraParameterForKey: key value: extraParameters[key]];
    }
    
    [self.nativeAdLoader loadAdIntoAdView: [self createNativeAdView]];
}

- (void)didLoadNativeAd:(MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    RCTLogInfo( @"AppLovinMAX: NativeAdView: %p didLoadAd: %p", self, ad );
    
    [AppLovinMAX.shared didLoadAd: ad];
    
    [self destroyAd];
    
    self.nativeAdView = nativeAdView;
    
    [self sendNativeAd: ad];
    
    self.loadingAd = NO;
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    NativeAdLoaderErrorAdUnitIdentifier = adUnitIdentifier;
    [AppLovinMAX.shared didFailToLoadAdForAdUnitIdentifier: adUnitIdentifier withError: error];
    NativeAdLoaderErrorAdUnitIdentifier = @"";
    
    self.loadingAd = NO;
}

- (void)didClickNativeAd:(MAAd *)ad
{
    [AppLovinMAX.shared didClickAd: ad];
}

- (void)sendNativeAd:(MAAd *)ad
{
    self.nativeAd = ad;
    
    MANativeAd *nativeAd = self.nativeAd.nativeAd;
    
    // keep nativeAd to destroy
    if ( !nativeAd ) return;
    
    // calling a revenue delegate method by adding nativeAdView
    [self addSubview: self.nativeAdView];
    
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    event[@"title"] = nativeAd.title;
    event[@"advertiser"] = nativeAd.advertiser;
    event[@"body"] = nativeAd.body;
    event[@"callToAction"] = nativeAd.callToAction;
    
    if ( !isnan(nativeAd.mediaContentAspectRatio) )
    {
        event[@"mediaContentAspectRatio"] = @(nativeAd.mediaContentAspectRatio);
    }
    
    if ( nativeAd.icon.URL )
    {
        event[@"icon"] = [nativeAd.icon.URL absoluteString];
    }
    else if ( nativeAd.icon.image )
    {
        event[@"image"] = @YES;
    }
    
    //RCTLogInfo( @"AppLovinMAX: NativeAdView: sending a native ad to JavaScript: %@", event );
    
    // sending nativeAd to JavaScript
    self.onNativeAdLoaded(event);
}

- (void)addStretchView:(UIView *)view toItem:(UIView *)toItem
{
    if ( !view || !toItem ) return;
    
    view.translatesAutoresizingMaskIntoConstraints = NO;
    [toItem addSubview: view];
    [view.widthAnchor constraintEqualToAnchor: toItem.widthAnchor].active = YES;
    [view.heightAnchor constraintEqualToAnchor: toItem.heightAnchor].active = YES;
    [view.centerXAnchor constraintEqualToAnchor: toItem.centerXAnchor].active = YES;
    [view.centerYAnchor constraintEqualToAnchor: toItem.centerYAnchor].active = YES;
}

- (void)setImageView:(UIImage *)image toView:(UIImageView *)toView
{
    if ( !image || !toView ) return;
    
    [toView setImage: image];
}

- (void)performCallToAction
{
    if ( self.nativeAdView )
    {
        [self.nativeAdView.callToActionButton sendActionsForControlEvents:UIControlEventTouchUpInside];
    }
}

// won't be visible but used to generate a button event and a revenue event
- (MANativeAdView *)createNativeAdView
{
    MANativeAdView *nativeAdView = [[MANativeAdView alloc] initWithFrame: CGRectMake( 0, 0, 1, 1)];
    nativeAdView.hidden = true;
    
    UIButton *callToActionButton = [[UIButton alloc] initWithFrame: CGRectMake( 0, 0, 1, 1)];
    callToActionButton.backgroundColor = [UIColor systemBlueColor];
    callToActionButton.tag = 9007;
    
    [nativeAdView addSubview: callToActionButton];
    
    MANativeAdViewBinder *binder = [[MANativeAdViewBinder alloc] initWithBuilderBlock:^(MANativeAdViewBinderBuilder *builder) {
        builder.callToActionButtonTag = 9007;
    }];
    
    [nativeAdView bindViewsWithAdViewBinder: binder];
    
    return nativeAdView;
}

- (UIView *)getNativeView:(NSNumber *)tag
{
    return [self.bridge.uiManager viewForReactTag: tag];
}

@end
