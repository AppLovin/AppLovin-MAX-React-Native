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

#define IS_IPAD ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad)

// Internal
@interface NSString (ALUtils)
@property (assign, readonly, getter=al_isValidString) BOOL al_validString;
@end

@interface AppLovinMAXAdViewManager()

// View properties
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) MAAdView *adView;

// Properties that need to be set before creating MAAdView
@property (nonatomic, weak) ALSdk *sdk;
@property (nonatomic, copy) NSString *adUnitIdentifier;
@property (nonatomic, weak) MAAdFormat *adFormat;

@end

@implementation AppLovinMAXAdViewManager
RCT_EXPORT_MODULE(AppLovinMAXAdView)

- (instancetype)init
{
    self = [super init];
    if ( self )
    {
        [[NSNotificationCenter defaultCenter] addObserver: self
                                                 selector: @selector(handleSDKInitialized:)
                                                     name: AppLovinMAXNotificationNameSDKInitialized
                                                   object: nil];
    }
    return self;
}

- (UIView *)view
{
    // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
    self.containerView = [[UIView alloc] init];
    
    return self.containerView;
}

RCT_CUSTOM_VIEW_PROPERTY(adUnitId, NSString, MAAdView)
{
    self.adUnitIdentifier = [RCTConvert NSString: json];
    
    [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdentifier format: self.adFormat sdk: self.sdk];
}

RCT_CUSTOM_VIEW_PROPERTY(adFormat, NSString, MAAdView)
{
    NSString *adFormatStr = [RCTConvert NSString: json];
    
    if ( [@"banner" isEqualToString: adFormatStr] )
    {
        self.adFormat = IS_IPAD ? MAAdFormat.leader : MAAdFormat.banner;
    }
    else if ( [@"mrec" isEqualToString: adFormatStr] )
    {
        self.adFormat = MAAdFormat.mrec;
    }
    
    [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdentifier format: self.adFormat sdk: self.sdk];
}

- (void)handleSDKInitialized:(NSNotification *)notification
{
    [[NSNotificationCenter defaultCenter] removeObserver: self];
    
    self.sdk = notification.object;
    
    [self attachAdViewIfNeededForAdUnitIdentifier: self.adUnitIdentifier format: self.adFormat sdk: self.sdk];
}

- (void)attachAdViewIfNeededForAdUnitIdentifier:(NSString *)adUnitIdentifier format:(MAAdFormat *)format sdk:(ALSdk *)sdk
{
    dispatch_async(dispatch_get_main_queue(), ^{
        
        // If both ad unit id and format has been set - create and attach AdView
        if ( [adUnitIdentifier al_isValidString] && format && sdk )
        {
            // Check if there's a previously-attached AdView
            if ( self.adView )
            {
                [self.adView removeFromSuperview];
                [self.adView stopAutoRefresh];
                
                self.adView = nil;
            }
            
            self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier adFormat: format sdk: sdk];
            self.adView.translatesAutoresizingMaskIntoConstraints = NO;
            self.adView.delegate = (id<MAAdDelegate, MAAdViewAdDelegate>) AppLovinMAX.shared;
            
            [self.adView loadAd];
            
            [self.containerView addSubview: self.adView];
            
            CGSize adViewSize = [AppLovinMAX adViewSizeForAdFormat: format];
            [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToConstant: adViewSize.width],
                                                       [self.adView.heightAnchor constraintEqualToConstant: adViewSize.height],
                                                       [self.adView.centerXAnchor constraintEqualToAnchor: self.containerView.centerXAnchor],
                                                       [self.adView.centerYAnchor constraintEqualToAnchor: self.containerView.centerYAnchor]]];
        }
    });
}

@end
