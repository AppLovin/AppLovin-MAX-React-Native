//
//  AppLovinMAXAdView.m
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"
#import "AppLovinMAXAdViewAd.h"
#import "AppLovinMAXAdViewAdManager.h"

@interface AppLovinMAXAdView()
@property (nonatomic, weak) AppLovinMAXAdViewAdManager *manager;
@property (nonatomic, copy) NSNumber *adViewAdId;
@end

@implementation AppLovinMAXAdView

- (instancetype)initWithAdViewAdManager:(AppLovinMAXAdViewAdManager *)manager
{
    self = [super init];
    if ( self )
    {
        self.manager = manager;
    }
    return self;
}

// Called when AdView is mounted with AdViewAd in JavaScript
- (void)setAdViewAdId:(NSNumber *)adViewAdId
{
    _adViewAdId = adViewAdId;
    
    AppLovinMAXAdViewAd *adViewAd = [self.manager adViewAd: adViewAdId];
    if ( adViewAd )
    {
        [adViewAd attachView: self];
    }
    else
    {
        [[AppLovinMAX shared] log: @"Cannot find AdViewAd with id %@ for adding to AdView", adViewAdId];
    }
}

// Called when AdView is unmounted in JavaScript
- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    // This view is unmounted
    if ( !self.window )
    {
        AppLovinMAXAdViewAd *adViewAd = [self.manager adViewAd: self.adViewAdId];
        if ( adViewAd )
        {
            [adViewAd detachView];
        }
    }
}

@end
