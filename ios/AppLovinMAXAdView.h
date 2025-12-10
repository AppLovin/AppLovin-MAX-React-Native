//
//  AppLovinMAXAdView.h
//  AppLovin MAX React Native Module
//
//  Copyright © 2022 AppLovin. All rights reserved.
//

#import <React/RCTUIManager.h>

@class MAAdView;

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
@interface AppLovinMAXAdView : RCTViewComponentView
#else
@interface AppLovinMAXAdView : UIView
#endif

NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, copy) RCTDirectEventBlock onAdLoadedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdLoadFailedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdDisplayFailedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdClickedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdExpandedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdCollapsedEvent;
@property (nonatomic, copy) RCTDirectEventBlock onAdRevenuePaidEvent;

+ (nullable MAAdView *)sharedWithAdUnitIdentifier:(NSString *)adUnitIdentifier;

+ (BOOL)hasPreloadedAdViewForIdentifier:(NSNumber *)adViewId;

+ (void)preloadNativeUIComponentAdView:(NSString *)adUnitIdentifier 
                              adFormat:(MAAdFormat *)adFormat
                            isAdaptive:(BOOL)isAdaptive
                             placement:(nullable NSString *)placement
                            customData:(nullable NSString *)customData
                       extraParameters:(nullable NSDictionary<NSString *, id> *)extraParameters
                  localExtraParameters:(nullable NSDictionary<NSString *, id> *)localExtraParameters
                   withPromiseResolver:(RCTPromiseResolveBlock)resolve
                   withPromiseRejecter:(RCTPromiseRejectBlock)reject;

+ (void)destroyNativeUIComponentAdView:(NSNumber *)adViewId
                   withPromiseResolver:(RCTPromiseResolveBlock)resolve
                   withPromiseRejecter:(RCTPromiseRejectBlock)reject;

- (void)loadAd;
- (void)destroyAd;

@end

NS_ASSUME_NONNULL_END
