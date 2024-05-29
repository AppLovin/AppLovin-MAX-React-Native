//
//  AppLovinMAXNativeAdView.m
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManagerUtils.h>
#import <React/RCTImageView.h>
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdView.h"

#define TITLE_LABEL_TAG          1
#define MEDIA_VIEW_CONTAINER_TAG 2
#define ICON_VIEW_TAG            3
#define BODY_VIEW_TAG            4
#define CALL_TO_ACTION_VIEW_TAG  5
#define ADVERTISER_VIEW_TAG      8

@interface MANativeAdLoader()
- (void)registerClickableViews:(NSArray<UIView *> *)clickableViews
                 withContainer:(UIView *)container
                         forAd:(MAAd *)ad;
- (void)handleNativeAdViewRenderedForAd:(MAAd *)ad;
@end

@interface AppLovinMAXNativeAdView()<MANativeAdDelegate, MAAdRevenueDelegate>

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong, nullable) MANativeAdLoader *adLoader;
@property (nonatomic, strong, nullable) MAAd *nativeAd;
@property (nonatomic, strong) ALAtomicBoolean *isLoading; // Guard against repeated ad loads
@property (nonatomic, strong) ALAtomicBoolean *isAdUnitIdSet;

// JavaScript properties
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;
@property (nonatomic, copy, nullable) NSDictionary *localExtraParameters;

// Callback to `AppLovinNativeAdView.js`
@property (nonatomic, copy) RCTDirectEventBlock onAdLoadedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdLoadFailedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdClickedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdRevenuePaidEvent;

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
        self.isAdUnitIdSet = [[ALAtomicBoolean alloc] init];
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
        _adLoader.revenueDelegate = self;
    }
    
    return _adLoader;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    if ( !self.window && !self.superview )
    {
        [self destroyCurrentAdIfNeeded];
    }
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    if ( ![adUnitId al_isValidString] ) return;
    
    _adUnitId = adUnitId;
    
    [self.isAdUnitIdSet set: YES];
}

// Called when Ad Unit ID is set, and via RN layer
- (void)loadAd
{
    if ( ![AppLovinMAX shared].sdk )
    {
        [[AppLovinMAX shared] logUninitializedAccessError: @"AppLovinMAXNativeAdview.loadAd"];
        return;
    }
    
    if ( [self.isLoading compareAndSet: NO update: YES] )
    {
        [[AppLovinMAX shared] log: @"Loading a native ad for Ad Unit ID: %@...", self.adUnitId];
        
        self.adLoader.placement = self.placement;
        self.adLoader.customData = self.customData;
        
        for ( NSString *key in self.extraParameters )
        {
            [self.adLoader setExtraParameterForKey: key value: self.extraParameters[key]];
        }
        
        for ( NSString *key in self.localExtraParameters )
        {
            id value = self.localExtraParameters[key];
            [self.adLoader setLocalExtraParameterForKey: key value: (value != [NSNull null] ? value : nil)];
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
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a title view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = TITLE_LABEL_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setAdvertiserView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.advertiser ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find an advertiser view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = ADVERTISER_VIEW_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setBodyView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.body ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a body view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = BODY_VIEW_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setCallToActionView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.callToAction ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a callToAction view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = CALL_TO_ACTION_VIEW_TAG;
    
    [self.clickableViews addObject: view];
}

- (void)setIconView:(NSNumber *)tag
{
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( ![view isKindOfClass: [RCTImageView class]] )
    {
        [[AppLovinMAX shared] log: @"Cannot find an icon image view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = ICON_VIEW_TAG;
    
    [self.clickableViews addObject: view];
    
    MANativeAdImage *icon = self.nativeAd.nativeAd.icon;
    if ( icon )
    {
        // Check if "URL" was missing and therefore need to set the image data
        if ( !icon.URL && icon.image )
        {
            RCTImageView *iconImageView = (RCTImageView *) view;
            if ( [iconImageView respondsToSelector: @selector(setImage:)] )
            {
                [iconImageView performSelector: @selector(setImage:) withObject: icon.image];
            }
            else
            {
                [[AppLovinMAX shared] log: @"Unable to set native ad IconView image"];
            }
        }
    }
}

- (void)setOptionsView:(NSNumber *)tag
{
    if ( !self.nativeAd.nativeAd.optionsView ) return;
    
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find an option view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    [view addSubview: self.nativeAd.nativeAd.optionsView];
    [self.nativeAd.nativeAd.optionsView al_pinToSuperview];
}

- (void)setMediaView:(NSNumber *)tag
{
    UIView *view = [self.bridge.uiManager viewForReactTag: tag];
    if ( !view )
    {
        [[AppLovinMAX shared] log: @"Cannot find a media view with tag \"%@\" for %@", tag, self.adUnitId];
        return;
    }
    
    view.tag = MEDIA_VIEW_CONTAINER_TAG;
    
    [self.clickableViews addObject: view];
    
    if ( !self.nativeAd.nativeAd.mediaView ) return;

    [view addSubview: self.nativeAd.nativeAd.mediaView];
    [self.nativeAd.nativeAd.mediaView al_pinToSuperview];
}

/**
 * Invoked:
 * 1. after all the JavaScript properties are set when mounting NativeAdView
 * 2. after all the user's asset views are mounted, following the 1st event
 */
- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
    if ( [self.isAdUnitIdSet compareAndSet:YES update: NO] )
    {
        [self loadAd];
    }
    else
    {
        if ( !self.adLoader ) return;     

        [self.adLoader registerClickableViews: self.clickableViews withContainer: self forAd: self.nativeAd];
        [self.adLoader handleNativeAdViewRenderedForAd: self.nativeAd];
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
        self.onAdLoadFailedEvent([[AppLovinMAX shared] adLoadFailedInfoForAd: self.adUnitId withError: nil]);
        
        return;
    }
    
    [self destroyCurrentAdIfNeeded];
    
    self.nativeAd = ad;
    
    // Notify `AppLovinNativeAdView.js`
    [self sendAdLoadedReactNativeEventForAd: ad.nativeAd];
    
    [self.isLoading set: NO];
}

- (void)sendAdLoadedReactNativeEventForAd:(MANativeAd *)ad
{
    // 1. AdInfo for publisher to be notified via `onAdLoaded`
    
    NSMutableDictionary<NSString *, id> *nativeAdInfo = [NSMutableDictionary dictionaryWithCapacity: 5];
    nativeAdInfo[@"title"] = ad.title;
    nativeAdInfo[@"advertiser"] = ad.advertiser;
    nativeAdInfo[@"body"] = ad.body;
    nativeAdInfo[@"callToAction"] = ad.callToAction;
    nativeAdInfo[@"starRating"] = ad.starRating;
    
    // The aspect ratio can be 0.0f when it is not provided by the network.
    if ( ad.mediaContentAspectRatio > 0 )
    {
        nativeAdInfo[@"mediaContentAspectRatio"] = @(ad.mediaContentAspectRatio);
    }
    
    nativeAdInfo[@"isIconImageAvailable"] = @(ad.icon != nil);
    nativeAdInfo[@"isOptionsViewAvailable"] = @(ad.optionsView != nil);
    nativeAdInfo[@"isMediaViewAvailable"] = @(ad.mediaView != nil);
    
    NSMutableDictionary *adInfo = [[AppLovinMAX shared] adInfoForAd: self.nativeAd].mutableCopy;
    adInfo[@"nativeAd"] = nativeAdInfo;
    
    // 2. NativeAd for `AppLovinNativeAdView.js` to render the views
    
    NSMutableDictionary<NSString *, id> *jsNativeAd = [NSMutableDictionary dictionaryWithCapacity: 5];
    jsNativeAd[@"title"] = ad.title;
    jsNativeAd[@"advertiser"] = ad.advertiser;
    jsNativeAd[@"body"] = ad.body;
    jsNativeAd[@"callToAction"] = ad.callToAction;
    jsNativeAd[@"starRating"] = ad.starRating;
    
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
    
    jsNativeAd[@"isOptionsViewAvailable"] = ad.optionsView ? @(YES) : @(NO);
    jsNativeAd[@"isMediaViewAvailable"] = ad.mediaView ? @(YES) : @(NO);
    
    NSMutableDictionary<NSString *, id> *arg = [NSMutableDictionary dictionaryWithCapacity: 2];
    arg[@"adInfo"] = adInfo;
    arg[@"nativeAd"] = jsNativeAd;
    
    // Send to `AppLovinNativeAdView.js`
    self.onAdLoadedEvent(arg);
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    [self.isLoading set: NO];
    
    [[AppLovinMAX shared] log: @"Failed to load native ad for Ad Unit ID %@ with error: %@", self.adUnitId, error];
    
    // Notify publisher
    self.onAdLoadFailedEvent([[AppLovinMAX shared] adLoadFailedInfoForAd: adUnitIdentifier withError: error]);
}

- (void)didClickNativeAd:(MAAd *)ad
{
    self.onAdClickedEvent([[AppLovinMAX shared] adInfoForAd: ad]);
}

#pragma mark - Ad Revenue Delegate

- (void)didPayRevenueForAd:(MAAd *)ad
{
    self.onAdRevenuePaidEvent([[AppLovinMAX shared] adRevenueInfoForAd: ad]);
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
