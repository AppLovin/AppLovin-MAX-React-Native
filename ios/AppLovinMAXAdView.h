//
//  AppLovinMAXAdView.h
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManager.h>

@class MAAdView;

NS_ASSUME_NONNULL_BEGIN

@interface AppLovinMAXAdView : UIView

+ (MAAdView *)sharedWithAdUnitIdentifier:(NSString *)adUnitIdentifier;

@end

NS_ASSUME_NONNULL_END
