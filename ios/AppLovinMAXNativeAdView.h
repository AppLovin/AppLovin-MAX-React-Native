#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Represents a container view for a native ad.
 */
@interface AppLovinMAXNativeAdView : UIView

/**
 * Loads a native ad, called by JavaScript via the View Manager.
 */
- (void)loadAd;

/**
 * Generates a click event on the Call-To-Action button of the native ad view.
 */
- (void)performCallToAction;


- (instancetype)initWithBridge:(RCTBridge *)bridge;

@end

NS_ASSUME_NONNULL_END
