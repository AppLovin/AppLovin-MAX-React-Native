#import "AppLovinMAXNativeAdView.h"
#import "AppLovinMaxNativeAdLoader.h"
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import <React/RCTUIManagerUtils.h>

@interface AppLovinMAXNativeAdView () <AppLovinMAXNativeAdLoaderDelegate>

// properties
@property (nonatomic, copy) NSString *adUnitIdentifier;
@property (nonatomic, copy) NSString *placement;
@property (nonatomic, copy) NSString *customData;
@property (nonatomic, copy) NSDictionary *extraParameter;
@property (nonatomic, copy) RCTDirectEventBlock onNativeAdLoaded;

// applovin native objects
@property (nonatomic, strong, nullable) MAAd *currentAd;

@end

@implementation AppLovinMAXNativeAdView {
    __weak RCTBridge *bridge;
}

- (instancetype)initWithBridge:(RCTBridge *)_bridge
{
    if ( self = [super init] )
    {
        bridge = _bridge;
    }
    return self;
}

- (void)dealloc
{
    [self destroyCurrentAd];
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( self.adUnitIdentifier && [adUnitId isEqualToString: self.adUnitIdentifier] )
    {
        [self destroyCurrentAd];
    }
    
    self.adUnitIdentifier = adUnitId;
    
    [self loadAd];
}

- (void)setAdvertiser:(NSNumber *)advertiser
{
    [self sendCurrentAd];
}

- (void)setBody:(NSNumber *)body
{
    [self sendCurrentAd];
}

- (void)setCallToAction:(NSNumber *)callToAction
{
    [self sendCurrentAd];
}

- (void)setIcon:(NSNumber *)icon
{
    [self sendCurrentAd];
}

- (void)setMedia:(NSNumber *)media
{
    [self sendCurrentAd];
}

- (void)setOptions:(NSNumber *)options
{
    [self sendCurrentAd];
}

- (void)setTitle:(NSNumber *)title
{
    [self sendCurrentAd];
}

- (void)sendCurrentAd
{
    if ( self.currentAd )
    {
        [self convertNativeAd];
    }
}

- (void)loadAd
{
    MAAd *ad = [[AppLovinMaxNativeAdLoader shared] getNativeAd: self.adUnitIdentifier : self.placement : self.customData : self.extraParameter : self];
    if ( ad )
    {
        [self destroyCurrentAd];
        self.currentAd = ad;
        [self convertNativeAd];
    }
}

- (void)didLoadAd:(MAAd *)ad
{
    [self destroyCurrentAd];
    self.currentAd = ad;
    [self convertNativeAd];
}

- (void)convertNativeAd
{
    MANativeAd *nativeAd = self.currentAd.nativeAd;
    if ( !nativeAd )
    {
        return;
    }
    
    // make sure that the view is attached before sending nativeAd up to JS
    if ( ![self rootTag] )
    {
        return;
    }
    
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    event[@"title"] = nativeAd.title;
    event[@"advertiser"] = nativeAd.advertiser;
    event[@"body"] = nativeAd.body;
    event[@"callToAction"] = nativeAd.callToAction;
    event[@"aspectRatio"] = @(nativeAd.mediaContentAspectRatio).stringValue;
    
    if ( nativeAd.icon.URL )
    {
        event[@"icon"] = [nativeAd.icon.URL absoluteString];
    }
    else if ( nativeAd.icon.image )
    {
        UIImageView *iconImageView = [self getImageView];
        if ( iconImageView )
        {
            [iconImageView setImage: nativeAd.icon.image];
        }
    }
    
    UIView *mediaContentView = [self getMediaView];
    if ( mediaContentView )
    {
        [self addStretchView: nativeAd.mediaView toItem: mediaContentView];
    }
    
    UIView *optionsContentView = [self getOptionsView];
    if ( optionsContentView )
    {
        [self addStretchView: nativeAd.mediaView toItem: optionsContentView];
    }
    
    // notify React for a new native ad
    self.onNativeAdLoaded(event);
}

- (void)addStretchView:(UIView *)view toItem:(UIView *)toItem
{
    view.translatesAutoresizingMaskIntoConstraints = NO;
    [toItem addSubview: view];
    [view.widthAnchor constraintEqualToAnchor: toItem.widthAnchor].active = YES;
    [view.heightAnchor constraintEqualToAnchor: toItem.heightAnchor].active = YES;
    [view.centerXAnchor constraintEqualToAnchor: toItem.centerXAnchor].active = YES;
    [view.centerYAnchor constraintEqualToAnchor: toItem.centerYAnchor].active = YES;
}

- (void)performCallToAction
{
    if ( self.currentAd )
    {
        // FIXME: not working
        [self.currentAd.nativeAd performClick];
    }
}

- (UIView *)getMediaView
{
    return [bridge.uiManager viewForNativeID: @"almMediaView" withRootTag: [self rootTag]];
}

- (UIView *)getOptionsView
{
    return [bridge.uiManager viewForNativeID: @"almOptionsView" withRootTag: [self rootTag]];
}

- (UIImageView *)getImageView
{
    return (UIImageView *) [bridge.uiManager viewForNativeID: @"almIconView" withRootTag: [self rootTag]];
}

- (void)destroyCurrentAd
{
    if ( self.currentAd )
    {
        if (self.currentAd.nativeAd)
        {
            [self.currentAd.nativeAd.mediaView removeFromSuperview];
            [self.currentAd.nativeAd.optionsView removeFromSuperview];
        }
        [[AppLovinMaxNativeAdLoader shared] destroyAd:self.adUnitIdentifier :self.currentAd];
    }
}

@end
