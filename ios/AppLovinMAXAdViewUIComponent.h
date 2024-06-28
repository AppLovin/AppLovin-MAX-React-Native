#import <React/RCTUIManager.h>

@class MAAdView;

NS_ASSUME_NONNULL_BEGIN

@interface AppLovinMAXAdViewUIComponent : NSObject

@property (nonatomic, strong, readonly) MAAdView *adView;

@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSDictionary *extraParameters;
@property (nonatomic, copy, nullable) NSDictionary *localExtraParameters;
@property (nonatomic, assign) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign) BOOL autoRefresh;

- (instancetype)initWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat;
- (void)loadAd;
- (BOOL)isAttached;
- (void)attachAdView:(AppLovinMAXAdView *)view;
- (void)detachAdView;
- (void)destroy;

@end

NS_ASSUME_NONNULL_END
