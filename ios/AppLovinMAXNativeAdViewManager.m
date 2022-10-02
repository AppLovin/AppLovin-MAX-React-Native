#import "AppLovinMAX.h"
#import "AppLovinMAXNativeAdViewManager.h"
#import "AppLovinMAXNativeAdView.h"

@implementation AppLovinMAXNativeAdViewManager

RCT_EXPORT_MODULE(AppLovinMAXNativeAdView)

RCT_EXPORT_VIEW_PROPERTY(adUnitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(placement, NSString)
RCT_EXPORT_VIEW_PROPERTY(customData, NSString)
RCT_EXPORT_VIEW_PROPERTY(extraParameters, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(iconImage, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(optionsView, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(mediaView, NSNumber)
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
        if ( ![view isKindOfClass:[AppLovinMAXNativeAdView class]] )
        {
            [[AppLovinMAX shared] log: @"Cannot find AppLovinMAXNativeAdView with tag %@", viewTag];
            return;
        }
        
        AppLovinMAXNativeAdView *nativeAdView = (AppLovinMAXNativeAdView *) view;
        [nativeAdView loadAd];
    }];
}

RCT_EXPORT_METHOD(performCallToAction:(nonnull NSNumber *)viewTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        
        UIView *view = viewRegistry[viewTag];
        if ( ![view isKindOfClass:[AppLovinMAXNativeAdView class]] )
        {
            [[AppLovinMAX shared] log: @"Cannot find AppLovinMAXNativeAdView with tag %@", viewTag];
            return;
        }
        
        AppLovinMAXNativeAdView *nativeAdView = (AppLovinMAXNativeAdView *) view;
        [nativeAdView performCallToAction];
    }];
}

@end
