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

NS_ASSUME_NONNULL_BEGIN

/**
 * The primary bridge between JS <-> native code for the AppLovin MAX React Native module.
 */
@interface AppLovinMAX : RCTEventEmitter<RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
