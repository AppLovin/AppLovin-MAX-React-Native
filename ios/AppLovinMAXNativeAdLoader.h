#import <Foundation/Foundation.h>
#import <AppLovinSDK/AppLovinSDK.h>

NS_ASSUME_NONNULL_BEGIN

@class AppLovinMaxNativeAdLoader;

@protocol AppLovinMAXNativeAdLoaderDelegate <NSObject>
- (void)didLoadAd:(MAAd *)ad;
@end

@interface AppLovinMaxNativeAdLoader : NSObject

/**
 * Returns an instance of this object.
 */
+ (AppLovinMaxNativeAdLoader*)shared;

/**
 * Loads a native ad and saves in the cache.
 */
- (void)preLoadAd:(NSString *)adUnitIdentifier :(NSString *)placement :(NSString *)customData :(NSDictionary *)extraParameter;

/**
 * Returns a native ad from the cache if it is available in the cache. Otherwise, loads a native ad and returns in the listner.
 */
- (MAAd *)getNativeAd:(NSString *)adUnitIdentifier
                     :(NSString *)placement
                     :(NSString *)customData
                     :(NSDictionary *)extraParameter
                     :(id<AppLovinMAXNativeAdLoaderDelegate>)delegate;

/**
 * destroys the ad.
 */
- (void)destroyAd:(NSString *)adUnitIdentifier :(MAAd *)ad;

/**
 * Keeps an ad unit identifier for the current error
 */
@property (nonatomic, strong, readonly) NSString *errorAdUnitIdentifier;

@end

NS_ASSUME_NONNULL_END
