#import <React/RCTUIManager.h>
#import <AppLovinSDK/AppLovinSDK.h>

NS_ASSUME_NONNULL_BEGIN

@interface AppLovinMAXAdView : UIView

+ (void)preloadAdView:(NSNumber *)count
             adUnitId:(NSString *)adUnitIdentifier
             adFormat:(MAAdFormat *)adFormat
            placement:(nullable NSString *)placement
           customData:(nullable NSString *)customData
adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
          autoRefresh:(BOOL)autoRefresh;

@end

NS_ASSUME_NONNULL_END
