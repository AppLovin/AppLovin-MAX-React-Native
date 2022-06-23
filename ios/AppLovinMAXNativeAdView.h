#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface AppLovinMAXNativeAdView : UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

- (void)loadAd;

- (void)performCallToAction;

@end

NS_ASSUME_NONNULL_END
