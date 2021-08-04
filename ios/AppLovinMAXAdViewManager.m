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
#import <React/RCTUIManager.h>

// Internal
@interface NSString (ALUtils)
@property (assign, readonly, getter=al_isValidString) BOOL al_validString;
@end

@interface AppLovinMAXAdViewManager()

// Dictionaries from id of the React view to the corresponding ad unit id and ad format.
// Both must be set before the MAAdView is created.
@property (nonatomic, strong) NSMutableDictionary<NSNumber *, NSString *> *adUnitIdRegistry;
@property (nonatomic, strong) NSMutableDictionary<NSNumber *, MAAdFormat *> *adFormatRegistry;

@end

@implementation AppLovinMAXAdViewManager
RCT_EXPORT_MODULE(AppLovinMAXAdView)

- (instancetype)init
{
    self = [super init];
    if ( self )
    {
        self.adUnitIdRegistry = [NSMutableDictionary dictionary];
        self.adFormatRegistry = [NSMutableDictionary dictionary];
    }
    return self;
}

- (UIView *)view
{
    // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
    return [[UIView alloc] init];
}

RCT_EXPORT_METHOD(setAdUnitId:(nonnull NSNumber *)viewTag toAdUnitId:(NSString *)value)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        UIView *view = viewRegistry[viewTag];
        if ( !view )
        {
            RCTLogError(@"Cannot find UIView with tag %@", viewTag);
            return;
        }

        // Store in case ad format has not been assigned.
        self.adUnitIdRegistry[viewTag] = value;
        
        [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdRegistry[viewTag]
                                             adFormat: self.adFormatRegistry[viewTag]
                                        containerView: view];
    }];
}

RCT_EXPORT_METHOD(setAdFormat:(nonnull NSNumber *)viewTag toAdFormat:(NSString *)value)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        UIView *view = viewRegistry[viewTag];
        if ( !view )
        {
            RCTLogError(@"Cannot find UIView with tag %@", viewTag);
            return;
        }
        
        // Store in case ad unit has not been assigned.
        if ( [@"banner" isEqualToString: value] )
        {
            self.adFormatRegistry[viewTag] = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
        }
        else if ( [@"mrec" isEqualToString: value] )
        {
            self.adFormatRegistry[viewTag] = MAAdFormat.mrec;
        }

        [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdRegistry[viewTag]
                                             adFormat: self.adFormatRegistry[viewTag]
                                        containerView: view];
    }];
}

- (void)attachAdViewIfNeededForAdUnitIdentifier:(NSString *)adUnitIdentifier adFormat:(MAAdFormat *)adFormat containerView:(UIView *)containerView
{
    // Run after delay to ensure SDK is attached to main module first
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        // If ad unit id and format has been set - create and attach AdView
        if ( [adUnitIdentifier al_isValidString] && adFormat )
        {
            MAAdView *adView = [self getMAAdViewFromContainer: containerView];
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
                                                       [adView.centerXAnchor constraintEqualToAnchor: containerView.centerXAnchor],
                                                       [adView.centerYAnchor constraintEqualToAnchor: containerView.centerYAnchor]]];
        }
    });
}

// MARK: - Helper Functions

- (nullable MAAdView *)getMAAdViewFromContainer:(UIView *)view
{
    return view.subviews.count > 0 ? ((MAAdView *) view.subviews.lastObject) : nil;
}

@end
