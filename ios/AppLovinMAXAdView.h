//
//  AppLovinMAXAdView.h
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

@class AppLovinMAXAdViewAdManager;

@interface AppLovinMAXAdView : UIView

- (instancetype)initWithAdViewAdManager:(AppLovinMAXAdViewAdManager *)manager;

@end

NS_ASSUME_NONNULL_END
