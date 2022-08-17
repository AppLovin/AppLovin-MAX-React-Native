#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface AppLovinMAXAdView : UIView

@property (nonatomic, strong) MAAdView *adView;

- (MAAdView *)retrieveAdView:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat;

@end

NS_ASSUME_NONNULL_END
