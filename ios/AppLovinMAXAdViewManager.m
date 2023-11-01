#import "AppLovinMAXAdViewManager.h"
#import "AppLovinMAXAdViewAdManager.h"
#import "AppLovinMAXAdView.h"

@implementation AppLovinMAXAdViewManager

RCT_EXPORT_MODULE(AppLovinMAXAdView)

RCT_EXPORT_VIEW_PROPERTY(adViewAdId, NSNumber)

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    AppLovinMAXAdViewAdManager *manager = (AppLovinMAXAdViewAdManager *) [self.bridge moduleForName: @"AppLovinMAXAdViewAdManager"];
    return [[AppLovinMAXAdView alloc] initWithAdViewAdManager: manager];
}

@end
