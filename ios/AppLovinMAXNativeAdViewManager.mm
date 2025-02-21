//
//  AppLovinMAXNativeAdViewManager.m
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdViewManager.h"
#import "AppLovinMAXNativeAdView.h"

@implementation AppLovinMAXNativeAdViewManager

RCT_EXPORT_MODULE(AppLovinMAXNativeAdView)

// Props
RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(placement, NSString)
RCT_EXPORT_VIEW_PROPERTY(customData, NSString)
RCT_EXPORT_VIEW_PROPERTY(extraParameters, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(localExtraParameters, NSDictionary)

// Asset views
RCT_EXPORT_VIEW_PROPERTY(titleView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(advertiserView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(bodyView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(callToActionView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(iconView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(optionsView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(mediaView, NSNumber)

// Callback
RCT_EXPORT_VIEW_PROPERTY(onAdLoadedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdLoadFailedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdClickedEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdRevenuePaidEvent, RCTDirectEventBlock)

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    return [[AppLovinMAXNativeAdView alloc] initWithBridge: self.bridge];
}

RCT_EXPORT_METHOD(loadAd:(nonnull NSNumber *)viewTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        
        UIView *view = viewRegistry[viewTag];
        if ( ![view isKindOfClass: [AppLovinMAXNativeAdView class]] )
        {
            [[AppLovinMAX shared] log: @"Cannot find AppLovinMAXNativeAdView with tag %@", viewTag];
            return;
        }
        
        AppLovinMAXNativeAdView *nativeAdView = (AppLovinMAXNativeAdView *) view;
        [nativeAdView loadAd];
    }];
}

@end
