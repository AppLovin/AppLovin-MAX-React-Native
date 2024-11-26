#import <React/RCTUIManager.h>

@class MAAdView;

NS_ASSUME_NONNULL_BEGIN

@interface AppLovinMAXAdViewUIComponent : NSObject

@property (nonatomic, strong, readonly) MAAdView *adView;
@property (nonatomic, copy,   readonly) NSString *adUnitIdentifier;
@property (nonatomic, assign, readonly) BOOL hasContainerView;

@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, id> *extraParameters;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, id> *localExtraParameters;
@property (nonatomic, assign, getter=isAdaptiveBannerEnabled) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, getter=isAutoRefreshEnabled) BOOL autoRefreshEnabled;

- (void)loadAd;
- (void)attachAdView:(AppLovinMAXAdView *)view;
- (void)detachAdView;
- (void)destroy;

- (instancetype)initWithAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat;

@end

NS_ASSUME_NONNULL_END
