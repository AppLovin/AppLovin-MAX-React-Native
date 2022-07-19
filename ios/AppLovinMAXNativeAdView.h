#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

@class AppLovinMAXNativeAdViewManager;

@interface AppLovinMAXNativeAdView : UIView

/**
 * Ad unit identifier for the current error
 */
@property (nonatomic, strong, readonly, class) NSString *errorAdUnitIdentifier;

- (instancetype)initWithBridge:(RCTBridge *)bridge;

- (void)loadAd;

- (void)performCallToAction;

@end

NS_ASSUME_NONNULL_END
