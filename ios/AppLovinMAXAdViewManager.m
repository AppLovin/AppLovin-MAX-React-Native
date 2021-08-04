//
//  AppLovinMAXAdViewManager.m
//  AppLovinMAX
//
//  Created by Thomas So on 9/24/20.
//  Copyright © 2020 AppLovin. All rights reserved.
//

#import "AppLovinMAXAdViewManager.h"
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"

// Internal
@interface NSString (ALUtils)
@property (assign, readonly, getter=al_isValidString) BOOL al_validString;
@end

@interface AppLovinMAXAdViewManager()

// View properties
// @property (nonatomic, strong) UIView *containerView;
// @property (nonatomic, strong) MAAdView *adView;

// Properties that need to be set before creating MAAdView
@property (nonatomic, copy) NSString *adUnitIdentifier;
@property (nonatomic, weak) MAAdFormat *adFormat;

@end

@implementation AppLovinMAXAdViewManager
RCT_EXPORT_MODULE(AppLovinMAXAdView)

- (UIView *)view
{
    // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
    return [[UIView alloc] init];
}

// RCT_EXPORT_METHOD(setAdUnitId:(NSNumber *)viewTag toValue:(NSString *)value)
// {
//     [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
//         UIView *view = viewRegistry[viewTag];
//     }];
// }

RCT_CUSTOM_VIEW_PROPERTY(adUnitId, NSString, MAAdView)
{
    self.adUnitIdentifier = [RCTConvert NSString: json];
    [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdentifier adFormat: self.adFormat containerView: view];
}

RCT_CUSTOM_VIEW_PROPERTY(adFormat, NSString, MAAdView)
{
    NSString *adFormatStr = [RCTConvert NSString: json];
    
    if ( [@"banner" isEqualToString: adFormatStr] )
    {
        self.adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [@"mrec" isEqualToString: adFormatStr] )
    {
        self.adFormat = MAAdFormat.mrec;
    }
    
    [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdentifier adFormat: self.adFormat containerView: view];
}

- (void)attachAdViewIfNeededForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat containerView:(UIView *)containerView
{
    // Run after delay to ensure SDK is attached to main module first
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        // If ad unit id and format has been set - create and attach AdView
        if ( [adUnitIdentifier al_isValidString] && adFormat )
        {
            UIView *adView = containerView.subviews[0];
            // Check if there's a previously-attached AdView
            if ( adView )
            {
                [adView removeFromSuperview];
                [adView stopAutoRefresh];
                
                adView = nil;
            }
            
            adView = [AppLovinMAX.shared retrieveAdViewForAdUnitIdentifier: adUnitIdentifier
                                                                       adFormat: adFormat
                                                                     atPosition: @""
                                                                     withOffset: CGPointZero
                                                                         attach: NO];
            [adView loadAd];
            
            [containerView addSubview: adView];
            
            CGSize adViewSize = [AppLovinMAX adViewSizeForAdFormat: adFormat];
            [NSLayoutConstraint activateConstraints: @[[adView.widthAnchor constraintEqualToConstant: adViewSize.width],
                                                       [adView.heightAnchor constraintEqualToConstant: adViewSize.height],
                                                       [adView.centerXAnchor constraintEqualToAnchor: self.containerView.centerXAnchor],
                                                       [adView.centerYAnchor constraintEqualToAnchor: self.containerView.centerYAnchor]]];
        }
    });
}

@end
