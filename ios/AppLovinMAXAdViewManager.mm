//
//  AppLovinMAXAdViewManager.m
//  AppLovinMAX
//
//  Created by Thomas So on 9/24/20.
//  Copyright © 2020 AppLovin. All rights reserved.
//

#import "AppLovinMAX.h"
#import "AppLovinMAXAdViewManager.h"
#import "AppLovinMAXAdView.h"

@implementation AppLovinMAXAdViewManager

RCT_EXPORT_MODULE(AppLovinMAXAdView)

RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(adFormat, NSString)
RCT_EXPORT_VIEW_PROPERTY(adViewId, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(placement, NSString)
RCT_EXPORT_VIEW_PROPERTY(customData, NSString)
RCT_EXPORT_VIEW_PROPERTY(adaptiveBannerEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoRefresh, BOOL)
RCT_EXPORT_VIEW_PROPERTY(loadOnMount, BOOL)
RCT_EXPORT_VIEW_PROPERTY(extraParameters, NSArray)
RCT_EXPORT_VIEW_PROPERTY(strLocalExtraParameters, NSArray)
RCT_EXPORT_VIEW_PROPERTY(boolLocalExtraParameters, NSArray)

RCT_EXPORT_VIEW_PROPERTY(onAdLoadedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdLoadFailedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdDisplayFailedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdClickedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdExpandedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdCollapsedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdRevenuePaidEvent, RCTDirectEventBlock)

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

#ifndef RCT_NEW_ARCH_ENABLED

- (UIView *)view
{
    return [[AppLovinMAXAdView alloc] init];
}

RCT_EXPORT_METHOD(loadAd:(nonnull NSNumber *)viewTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        
        UIView *view = viewRegistry[viewTag];
        if ( ![view isKindOfClass: [AppLovinMAXAdView class]] )
        {
            [[AppLovinMAX shared] log: @"Cannot find AppLovinMAXAdView with tag %@", viewTag];
            return;
        }
        
        AppLovinMAXAdView *adView = (AppLovinMAXAdView *) view;
        [adView loadAd];
    }];
}

#endif // RCT_NEW_ARCH_ENABLED

@end
