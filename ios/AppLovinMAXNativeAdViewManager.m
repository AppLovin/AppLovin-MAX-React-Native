#import "AppLovinMAXNativeAdViewManager.h"
#import "AppLovinMAXNativeAdView.h"
#import <React/RCTUIManager.h>

@implementation AppLovinMAXNativeAdViewManager

RCT_EXPORT_MODULE(AppLovinMAXNativeAdView)

RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(placement, NSString)
RCT_EXPORT_VIEW_PROPERTY(customData, NSString)
RCT_EXPORT_VIEW_PROPERTY(extraParameter, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(advertiser, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(body, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(callToAction, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(icon, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(media, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(options, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(title, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(onNativeAdLoaded, RCTDirectEventBlock)

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
        if ( !view )
        {
            RCTLogError(@"Cannot find UIView with tag %@", viewTag);
            return;
        }
        
        if ( ![view isKindOfClass:[AppLovinMAXNativeAdView class]] )
        {
            RCTLogError(@"Cannot find AppLovinMAXNativeAdView with tag %@", viewTag);
        }
        else
        {
            AppLovinMAXNativeAdView *nativeAdView = (AppLovinMAXNativeAdView *) view;
            [nativeAdView loadAd];
        }
    }];
}

RCT_EXPORT_METHOD(performCallToAction:(nonnull NSNumber *)viewTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        UIView *view = viewRegistry[viewTag];
        if ( !view )
        {
            RCTLogError(@"Cannot find UIView with tag %@", viewTag);
            return;
        }
        
        if ( ![view isKindOfClass:[AppLovinMAXNativeAdView class]] )
        {
            RCTLogError(@"Cannot find AppLovinMAXNativeAdView with tag %@", viewTag);
        }
        else
        {
            AppLovinMAXNativeAdView *nativeAdView = (AppLovinMAXNativeAdView *) view;
            [nativeAdView performCallToAction];
        }
    }];
}

@end
