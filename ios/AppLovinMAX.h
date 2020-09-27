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

#define DEVICE_SPECIFIC_ADVIEW_AD_FORMAT ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) ? MAAdFormat.leader : MAAdFormat.banner

NS_ASSUME_NONNULL_BEGIN

/**
 * The primary bridge between JS <-> native code for the AppLovin MAX React Native module.
 */
@interface AppLovinMAX : RCTEventEmitter<RCTBridgeModule>

/**
 * Shared instance of this bridge module.
 */
@property (nonatomic, strong, readonly, class) AppLovinMAX *shared;

/**
 * Utility method for getting the width and height for a given ad format.
 */
+ (CGSize)adViewSizeForAdFormat:(MAAdFormat *)adFormat;

/**
 * Dedicated method for retrieving a MAAdView.
 */
- (MAAdView *)retrieveAdViewForAdUnitIdentifier:(NSString *)adUnitIdentifier
                                       adFormat:(MAAdFormat *)adFormat
                                     atPosition:(NSString *)adViewPosition
                                         attach:(BOOL)attach;

@end

NS_ASSUME_NONNULL_END
