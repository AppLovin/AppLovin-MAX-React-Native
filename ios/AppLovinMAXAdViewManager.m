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

// Overridding `init` requires main queue
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

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

// NOTE: `nonnull` must be annotated here for this RN export to work at runtime
RCT_EXPORT_METHOD(setAdUnitId:(nonnull NSNumber *)viewTag toAdUnitId:(NSString *)adUnitId)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        
        // NOTE: iOS caches the native view via `viewTag` when you remove it from screen (unlike Android)
        UIView *view = viewRegistry[viewTag];
        if ( !view )
        {
            RCTLogError(@"Cannot find UIView with tag %@", viewTag);
            return;
        }
        
        self.adUnitIdRegistry[viewTag] = adUnitId;
        
        [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdRegistry[viewTag]
                                             adFormat: self.adFormatRegistry[viewTag]
                                        containerView: view];
    }];
}

// NOTE: `nonnull` must be annotated here for this RN export to work at runtime
RCT_EXPORT_METHOD(setAdFormat:(nonnull NSNumber *)viewTag toAdFormat:(NSString *)adFormatString)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        
        // NOTE: iOS caches the native view via `viewTag` when you remove it from screen (unlike Android)
        UIView *view = viewRegistry[viewTag];
        if ( !view )
        {
            RCTLogError(@"Cannot find UIView with tag %@", viewTag);
            return;
        }
        
        if ( [@"banner" isEqualToString: adFormatString] )
        {
            self.adFormatRegistry[viewTag] = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
        }
        else if ( [@"mrec" isEqualToString: adFormatString] )
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
            MAAdView *adView = [self getMAAdViewFromContainerView: containerView];
            
            // Check if there's a previously-attached AdView
            if ( adView )
            {
                [adView removeFromSuperview];
                [adView stopAutoRefresh];
                
                adView = nil;
            }
            
            adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: adFormat sdk: AppLovinMAX.shared.sdk];
            adView.frame = (CGRect) { CGPointZero, adFormat.size };
            [adView loadAd];
            
            [containerView addSubview: adView];
            
            CGSize adViewSize = [adFormat adaptiveSizeForWidth: CGRectGetWidth(containerView.frame)];
            [NSLayoutConstraint activateConstraints: @[[adView.widthAnchor constraintEqualToConstant: adViewSize.width],
                                                       [adView.heightAnchor constraintEqualToConstant: adViewSize.height],
                                                       [adView.centerXAnchor constraintEqualToAnchor: containerView.centerXAnchor],
                                                       [adView.centerYAnchor constraintEqualToAnchor: containerView.centerYAnchor]]];
        }
    });
}

// MARK: - Helper Functions

- (nullable MAAdView *)getMAAdViewFromContainerView:(UIView *)view
{
    return view.subviews.count > 0 ? ((MAAdView *) view.subviews.lastObject) : nil;
}

@end
