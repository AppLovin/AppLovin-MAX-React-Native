#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Represents a container view for a native ad.
 */
@interface AppLovinMAXNativeAdView : UIView

/**
 * Ad Unit ID that has an error from loading a native ad
 */
@property (nonatomic, strong, readonly, class) NSString *loadErrorAdUnitIdentifier;

/**
 * Initializes with a bridge.
 */
- (instancetype)initWithBridge:(RCTBridge *)bridge;

/**
 * Loads a native ad, called by Javascript via the View Manager.
 */
- (void)loadNativeAd;

/**
 * Generates a click event on the Call-To-Action button of the native ad view.
 */
- (void)performCallToAction;

@end

NS_ASSUME_NONNULL_END
