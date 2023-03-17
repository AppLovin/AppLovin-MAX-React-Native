//
//  AppLovinMAX.h
//  AppLovin MAX React Native Module
//
//  Created by Thomas So on 7/4/20.
//  Copyright © 2020 AppLovin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <AppLovinSDK/AppLovinSDK.h>

#define KEY_WINDOW [UIApplication sharedApplication].keyWindow
#define DEVICE_SPECIFIC_ADVIEW_AD_FORMAT ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) ? MAAdFormat.leader : MAAdFormat.banner

NS_ASSUME_NONNULL_BEGIN

/**
 * The primary bridge between JS <-> native code for the AppLovin MAX React Native module.
 */
@interface AppLovinMAX : RCTEventEmitter<RCTBridgeModule, MAAdDelegate, MARewardedAdDelegate, MAAdViewAdDelegate, MAAdRevenueDelegate>

/**
 * Shared instance of this bridge module.
 */
@property (nonatomic, strong, readonly, class) AppLovinMAX *shared;

/**
 * The instance of the AppLovin SDK the module is using.
 */
@property (nonatomic, weak, readonly) ALSdk *sdk;

/**
 * Convenience method for unified logging in the AppLovin module.
 */
- (void)log:(NSString *)format, ...;

/**
 * Convenience method for logging of access to the calling method before initialization.
 */
- (void)logUninitializedAccessError:(NSString *)callingMethod;

/**
 * Returns a dictionay value of adInfo for the specified ad.
 */
- (NSDictionary<NSString *, id> *)adInfoForAd:(MAAd *)ad;

/**
 * Returns a dictionay value of adLoadFailedInfo for the specified error.
 */
- (NSDictionary<NSString *, id> *)adLoadFailedInfoForAd:(NSString *)adUnitIdentifier withError:(MAError *)error;

/**
 * Returns a dictionay value of adDisplayFailedInfo for the specified ad and error.
 */
- (NSDictionary<NSString *, id> *)adDisplayFailedInfoForAd:(MAAd *)ad withError:(MAError *)error;

/**
 * Returns a dictionay value of adRevenuInfo for the specified ad.
 */
- (NSDictionary<NSString *, id> *)adRevenueInfoForAd:(MAAd *)ad;

@end

NS_ASSUME_NONNULL_END
