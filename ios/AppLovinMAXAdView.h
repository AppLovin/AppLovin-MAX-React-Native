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

@property (nonatomic, copy) RCTDirectEventBlock onAdLoadedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdLoadFailedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdDisplayFailedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdClickedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdExpandedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdCollapsedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdRevenuePaidEvent;

+ (MAAdView *)sharedWithAdUnitIdentifier:(NSString *)adUnitIdentifier;

+ (void)preloadNativeUIComponentAdView:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat placement:(NSString *)placement  customData:(NSString *)customData extraParameters:(NSDictionary<NSString *, NSString *> *)extraParameters localExtraParameters:(NSDictionary<NSString *, NSString *> *)localExtraParameters withPromiseResolver:(RCTPromiseResolveBlock)resolve withPromiseRejecter:(RCTPromiseRejectBlock)reject;

+ (void)destroyNativeUIComponentAdView:(NSString *)adUnitIdentifier withPromiseResolver:(RCTPromiseResolveBlock)resolve withPromiseRejecter:(RCTPromiseRejectBlock)reject;

- (void)loadAd;

@end

NS_ASSUME_NONNULL_END
