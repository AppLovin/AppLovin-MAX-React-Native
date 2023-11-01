#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

@class AppLovinMAXAdViewAd;

@interface AppLovinMAXAdViewAdManager : RCTEventEmitter<RCTBridgeModule>

- (AppLovinMAXAdViewAd *)adViewAd:(nonnull NSNumber *)adViewAdId;

- (void)sendLoadAdEvent:(NSDictionary<NSString *, id> *)body;
- (void)sendFailToDisplayAEvent:(NSDictionary<NSString *, id> *)body;
- (void)sendFailToLoadAdEvent:(NSDictionary<NSString *, id> *)body;
- (void)sendClickAdEvent:(NSDictionary<NSString *, id> *)body;
- (void)sendCollapseAdEvent:(NSDictionary<NSString *, id> *)body;
- (void)sendExpandAdEvent:(NSDictionary<NSString *, id> *)body;
- (void)sendPayRevenueEvent:(NSDictionary<NSString *, id> *)body;

@end

NS_ASSUME_NONNULL_END
