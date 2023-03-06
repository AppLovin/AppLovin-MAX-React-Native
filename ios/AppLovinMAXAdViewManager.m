//
//  AppLovinMAXAdViewManager.m
//  AppLovinMAX
//
//  Created by Thomas So on 9/24/20.
//  Copyright © 2020 AppLovin. All rights reserved.
//

#import "AppLovinMAXAdViewManager.h"
#import "AppLovinMAXAdview.h"

@implementation AppLovinMAXAdViewManager

RCT_EXPORT_MODULE(AppLovinMAXAdView)

RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(adFormat, NSString)
RCT_EXPORT_VIEW_PROPERTY(placement, NSString)
RCT_EXPORT_VIEW_PROPERTY(customData, NSString)
RCT_EXPORT_VIEW_PROPERTY(adaptiveBannerEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoRefresh, BOOL)
RCT_EXPORT_VIEW_PROPERTY(extraParameters, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(localExtraParameters, NSDictionary)

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

- (UIView *)view
{
    return [[AppLovinMAXAdView alloc] init];
}

@end
