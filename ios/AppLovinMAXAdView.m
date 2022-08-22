#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"
#import "AppLovinMAXAdView.h"

@interface AppLovinMAXAdView()

@property (nonatomic, strong, nullable) MAAdView *adView; // nil when unmounted

// The following properties are updated from RN layer via the view manager
@property (nonatomic, copy) NSString *adUnitId;
@property (nonatomic, weak) MAAdFormat *adFormat;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *customData;
@property (nonatomic, assign, readonly, getter=isAdaptiveBannerEnabled) BOOL adaptiveBannerEnabled;
@property (nonatomic, assign, readonly, getter=isAutoRefresh) BOOL autoRefresh;

@end

@implementation AppLovinMAXAdView

typedef struct {
    MAAdView *adView;
    NSString *adUnitId;
    MAAdFormat *adFormat;
    NSString *placement;
    NSString *customData;
    BOOL adaptiveBannerEnabled;
    BOOL autoRefresh;
} CachedAdView;

static NSMutableArray<NSMutableData *> *cachedAdViews;

- (instancetype)init
{
    if( !cachedAdViews )
    {
        cachedAdViews = [NSMutableArray arrayWithCapacity: 2];
    }
    return [super init];
}

- (void)setAdUnitId:(NSString *)adUnitId
{
    // Ad Unit ID must be set prior to creating MAAdView
    if ( self.adView )
    {
        [[AppLovinMAX shared] log: @"Attempting to set Ad Unit ID %@ after MAAdView is created", adUnitId];
        return;
    }
    
    _adUnitId = adUnitId;
    
    [self attachAdViewIfNeeded];
}  

- (void)setAdFormat:(NSString *)adFormat
{
    // Ad format must be set prior to creating MAAdView
    if ( self.adView )
    {
        [[AppLovinMAX shared] log: @"Attempting to set ad format %@ after MAAdView is created", adFormat];
        return;
    }
    
    if ( [@"banner" isEqualToString: adFormat] )
    {
        _adFormat = DEVICE_SPECIFIC_ADVIEW_AD_FORMAT;
    }
    else if ( [@"mrec" isEqualToString: adFormat] )
    {
        _adFormat = MAAdFormat.mrec;
    }
    else
    {
        [[AppLovinMAX shared] log: @"Attempting to set an invalid ad format of \"%@\" for %@", adFormat, self.adUnitId];
        return;
    }
    
    [self attachAdViewIfNeeded];
}  

- (void)setPlacement:(NSString *)placement
{
    _placement = placement;
    
    if ( self.adView )
    {
        self.adView.placement = placement;
    }
}

- (void)setCustomData:(NSString *)customData
{
    _customData = customData;
    
    if ( self.adView )
    {
        self.adView.customData = customData;
    }
}

- (void)setAdaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    _adaptiveBannerEnabled = adaptiveBannerEnabled;
    
    if ( self.adView )
    {
        [self.adView setExtraParameterForKey: @"adaptive_banner" value: adaptiveBannerEnabled ? @"true" : @"false"];
    }
}

- (void)setAutoRefresh:(BOOL)autoRefresh
{
    _autoRefresh = autoRefresh;
    
    if ( self.adView )
    {
        if ( autoRefresh )
        {
            [self.adView startAutoRefresh];
        }
        else
        {
            [self.adView stopAutoRefresh];
        }
    }
}

- (void)attachAdViewIfNeeded
{
    // Re-assign in case of race condition
    NSString *adUnitId = self.adUnitId;
    MAAdFormat *adFormat = self.adFormat;
    
    // Run after 0.25 sec delay to allow all properties to set
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (0.25 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        if ( ![adUnitId al_isValidString] )
        {
            [[AppLovinMAX shared] log: @"Attempting to attach MAAdView without Ad Unit ID"];
            return;
        }
        
        if ( !adFormat )
        {
            [[AppLovinMAX shared] log: @"Attempting to attach MAAdView without ad format"];
            return;
        }
        
        if ( self.adView )
        {
            [[AppLovinMAX shared] log: @"Attempting to re-attach with existing MAAdView: %@", self.adView];
            return;
        }
        
        [[AppLovinMAX shared] log: @"Attaching MAAdView for %@", adUnitId];
        
        bool isNewAdView = NO;
        
        self.adView = [self retrieveAdView];
        
        if ( !self.adView )
        {
            [[AppLovinMAX shared] log: @"Creating a new MAAdView of %@ for %@", adFormat, adUnitId];
            
            isNewAdView = YES;
            self.adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitId
                                                            adFormat: adFormat
                                                                 sdk: [AppLovinMAX shared].sdk];
            self.adView.delegate = [AppLovinMAX shared]; // Go through core class for callback forwarding to React Native layer
            self.adView.revenueDelegate = [AppLovinMAX shared];
            self.adView.placement = self.placement;
            self.adView.customData = self.customData;
            [self.adView setExtraParameterForKey: @"adaptive_banner" value: [self isAdaptiveBannerEnabled] ? @"true" : @"false"];
            // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
            [self.adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
        }
        
        self.adView.frame = (CGRect) { CGPointZero, self.frame.size };
        
        if ( [self isAutoRefresh] )
        {
            [self.adView startAutoRefresh];
        }
        else
        {
            [self.adView stopAutoRefresh];
        }
        
        if ( isNewAdView )
        {
            [self.adView loadAd];
        }
        
        [self addSubview: self.adView];
        
        [NSLayoutConstraint activateConstraints: @[[self.adView.widthAnchor constraintEqualToAnchor: self.widthAnchor],
                                                   [self.adView.heightAnchor constraintEqualToAnchor: self.heightAnchor],
                                                   [self.adView.centerXAnchor constraintEqualToAnchor: self.centerXAnchor],
                                                   [self.adView.centerYAnchor constraintEqualToAnchor: self.centerYAnchor]]];
    });
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];
    
    // This view is unmounted
    if ( !self.window )
    {
        if ( self.adView )
        {
            [[AppLovinMAX shared] log: @"Unmounting MAAdView: %@", self.adView];
            
            self.adView.delegate = nil;
            self.adView.revenueDelegate = nil;
            
            [self.adView stopAutoRefresh];
            [self.adView removeFromSuperview];
            [self saveAdView];
            
            self.adView = nil;
        }
    }
}

- (MAAdView *)retrieveAdView
{
    return [AppLovinMAXAdView retrievedAdViewImpl: self.adUnitId
                                         adFormat: self.adFormat
                                        placement: self.placement
                                       customData: self.customData
                            adaptiveBannerEnabled: self.adaptiveBannerEnabled
                                      autoRefresh: self.autoRefresh];
}

+ (MAAdView *)retrievedAdViewImpl:adUnitIdentifier
                         adFormat:(MAAdFormat *)adFormat
                        placement:(nullable NSString *)placement
                       customData:(nullable NSString *)customData
            adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
                      autoRefresh:(BOOL)autoRefresh
{
    MAAdView *adView = nil;
    NSMutableData *discardedData = nil;
    
    for ( NSMutableData *data in cachedAdViews )
    {
        CachedAdView *cachedAdView = (CachedAdView *) data.mutableBytes;
        if ( [cachedAdView->adUnitId isEqualToString: adUnitIdentifier] &&
            cachedAdView->adFormat == adFormat &&
            (cachedAdView->placement == placement ||
             [cachedAdView->placement isEqualToString: placement]) &&
            (cachedAdView->customData == customData ||
             [cachedAdView->customData isEqualToString: customData]) &&
            cachedAdView->adaptiveBannerEnabled == adaptiveBannerEnabled &&
            cachedAdView->autoRefresh == autoRefresh)
        {
            adView = cachedAdView->adView;
            discardedData = data;
            break;
        }
    }
    
    if ( discardedData )
    {
        [cachedAdViews removeObject: discardedData];
    }
    
    return adView;
}

- (void)saveAdView
{
    [AppLovinMAXAdView saveAdViewImpl: self.adView
                             adUnitId: self.adUnitId
                             adFormat: self.adFormat
                            placement: self.placement
                           customData: self.customData
                adaptiveBannerEnabled: self.adaptiveBannerEnabled
                          autoRefresh: self.autoRefresh];
}

+ (void)saveAdViewImpl:(MAAdView *)adView
              adUnitId:(NSString *)adUnitIdentifier
              adFormat:(MAAdFormat *)adFormat
             placement:(nullable NSString *)placement
            customData:(nullable NSString *)customData
 adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
           autoRefresh:(BOOL)autoRefresh
{
    NSMutableData *data = [[NSMutableData alloc] initWithLength:sizeof(CachedAdView)];
    CachedAdView *cachedAdView = (CachedAdView *) data.mutableBytes;
    cachedAdView->adView = adView;
    cachedAdView->adUnitId = adUnitIdentifier;
    cachedAdView->adFormat = adFormat;
    cachedAdView->placement = placement;
    cachedAdView->customData = customData;
    cachedAdView->adaptiveBannerEnabled = adaptiveBannerEnabled;
    cachedAdView->autoRefresh = autoRefresh;
    [cachedAdViews addObject: data];
}

+ (void)preloadAdView:(NSNumber *)count
             adUnitId:(NSString *)adUnitIdentifier
             adFormat:(MAAdFormat *)adFormat
            placement:(nullable NSString *)placement
           customData:(nullable NSString *)customData
adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
          autoRefresh:(BOOL)autoRefresh
{
    if( !cachedAdViews )
    {
        cachedAdViews = [NSMutableArray arrayWithCapacity: 2];
    }

    int numCachedAdView = (int) cachedAdViews.count;
    
    for ( int i = 0; i < count.intValue; i++ )
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            
            MAAdView *adView = nil;

            if ( ( numCachedAdView - i ) > 0 ) {
                adView = [AppLovinMAXAdView retrievedAdViewImpl: adUnitIdentifier
                                                       adFormat: adFormat
                                                      placement: placement
                                                     customData: customData
                                          adaptiveBannerEnabled: adaptiveBannerEnabled
                                                    autoRefresh: autoRefresh];
            }
          
            if ( !adView )
            {
                [[AppLovinMAX shared] log: @"Creating a new MAAdView of %@ for %@", adFormat, adUnitIdentifier];
                
                adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier
                                                           adFormat: adFormat
                                                                sdk: [AppLovinMAX shared].sdk];
                adView.placement = placement;
                adView.customData = customData;
                [adView setExtraParameterForKey: @"adaptive_banner" value: adaptiveBannerEnabled ? @"true" : @"false"];
                [adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
            }
            
            adView.delegate = [AppLovinMAX shared];
            adView.revenueDelegate = [AppLovinMAX shared];
            
            [adView loadAd];
            
            [AppLovinMAXAdView saveAdViewImpl: adView adUnitId: adUnitIdentifier adFormat: adFormat placement: placement customData: customData adaptiveBannerEnabled: adaptiveBannerEnabled autoRefresh: autoRefresh];
        });
    }
}

@end
