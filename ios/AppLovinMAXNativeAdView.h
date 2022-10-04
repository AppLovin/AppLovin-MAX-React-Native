//
//  AppLovinMAXNativeAdView.h
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Represents a container view for a native ad.
 */
@interface AppLovinMAXNativeAdView : UIView

/**
 * Loads a native ad, called by JavaScript via the View Manager.
 */
- (void)loadAd;


- (instancetype)initWithBridge:(RCTBridge *)bridge;

@end

NS_ASSUME_NONNULL_END
