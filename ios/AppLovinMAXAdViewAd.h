#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class AppLovinMAXAdViewAdManager;

@interface AppLovinMAXAdViewAd : NSObject

@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, assign) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, getter=isAutoRefresh) BOOL autoRefresh;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;
@property (nonatomic, copy, nullable) NSDictionary *localExtraParameters;

- (instancetype)initWithManager:(AppLovinMAXAdViewAdManager *)manager;
- (NSNumber *)createAdView:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat;
- (void)destroyAdView;
- (void)loadAd;
- (void)attachView:(UIView *)view;
- (void)detachView;

@end

NS_ASSUME_NONNULL_END
