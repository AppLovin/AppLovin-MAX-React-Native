//
//  AppLovinMAXNativeAdView.h
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManager.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

/**
 * Represents a container view for a native ad.
 */
#ifdef RCT_NEW_ARCH_ENABLED
@interface AppLovinMAXNativeAdView : RCTViewComponentView
#else
@interface AppLovinMAXNativeAdView : UIView
#endif

- (void)loadAd;
- (void)setTitleView:(NSNumber *)tag;
- (void)setAdvertiserView:(NSNumber *)tag;
- (void)setBodyView:(NSNumber *)tag;
- (void)setCallToActionView:(NSNumber *)tag;
- (void)setIconView:(NSNumber *)tag;
- (void)setOptionsView:(NSNumber *)tag;
- (void)setMediaView:(NSNumber *)tag;
- (void)renderNativeAd;

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@end

NS_ASSUME_NONNULL_END
