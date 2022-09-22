#import <Foundation/Foundation.h>
#import <AppLovinSDK/AppLovinSDK.h>

NS_ASSUME_NONNULL_BEGIN

@class AppLovinMAXNativeAdView;

/**
 * Encapsulate a native ad loader.
 */
@interface AppLovinMaxNativeAdLoader : NSObject

/**
 * Loads a native ad with the specified properties that are set by JavaScript.
 */
- (void)load:(NSString *)adUnitIdentifier
   placement:(nullable NSString *)placement
  customData:(nullable NSString *)customData
extraParameters:(nullable NSDictionary *)extraParameters
   reactView:(AppLovinMAXNativeAdView *)reactView;

/**
 * Adds a current native ad view on the specified view.
 *
 * When a new native ad is loaded, a native ad view is internally created and given to the native ad
 * loader.  Adding a native ad view will generate a reward event.
 */
- (void)addNativeAdview:(UIView *)view;

/**
 * Performs a click event on the Call-To-Action button.
 */
- (void)performCallToAction;

/**
 * Destroys a current native ad loader.
 */
- (void)destroy;

/**
 * Destroys the specified ad.
 */
- (void)destroyAd:(MAAd *)ad;

@end

NS_ASSUME_NONNULL_END
