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
} NativeAdView;

static NSMutableDictionary<MAAdFormat *, NSMutableArray *> *AdViewCache;
static NSObject *AdViewCacheLock;

+ (void)initialize
{
    AdViewCache = [NSMutableDictionary dictionaryWithCapacity: 2];
    AdViewCacheLock = [[NSObject alloc] init];
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
        
        self.adView = [AppLovinMAXAdView retrieveAdView: self.adUnitId
                                               adFormat: self.adFormat
                                              placement: self.placement
                                             customData: self.customData
                                  adaptiveBannerEnabled: self.adaptiveBannerEnabled
                                            autoRefresh: self.autoRefresh];
        
        
        if ( !self.adView )
        {
            isNewAdView = YES;
            
            self.adView = [AppLovinMAXAdView createAdView: adUnitId
                                                 adFormat: adFormat
                                                placement: self.placement
                                               customData: self.customData
                                    adaptiveBannerEnabled: self.adaptiveBannerEnabled];
        }
        else
        {
            [[AppLovinMAX shared] log: @"Using a cached MAAdView for %@", adUnitId];
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
            
            [self.adView removeFromSuperview];
            [self.adView stopAutoRefresh];
            self.adView.delegate = nil;
            self.adView.revenueDelegate = nil;
            
            [AppLovinMAXAdView saveAdView: self.adView
                                 adUnitId: self.adUnitId
                                 adFormat: self.adFormat
                                placement: self.placement
                               customData: self.customData
                    adaptiveBannerEnabled: self.adaptiveBannerEnabled
                              autoRefresh: self.autoRefresh];
            
            self.adView = nil;
        }
    }
}

+ (MAAdView *)createAdView:(NSString *)adUnitIdentifier
                  adFormat:(MAAdFormat *)adFormat
                 placement:(nullable NSString *)placement
                customData:(nullable NSString *)customData
     adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
{
    MAAdView *adView = [[MAAdView alloc] initWithAdUnitIdentifier: adUnitIdentifier
                                                         adFormat: adFormat
                                                              sdk: [AppLovinMAX shared].sdk];
    adView.delegate = [AppLovinMAX shared];
    adView.revenueDelegate = [AppLovinMAX shared];
    [adView setPlacement: placement];
    [adView setCustomData: customData];
    [adView setExtraParameterForKey: @"adaptive_banner" value: adaptiveBannerEnabled ? @"true" : @"false"];
    // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
    [adView setExtraParameterForKey: @"allow_pause_auto_refresh_immediately" value: @"true"];
    // Disable autoRefresh until mounted
    [adView stopAutoRefresh];
    return adView;
}

+ (MAAdView *)retrieveAdView:adUnitIdentifier
                    adFormat:(MAAdFormat *)adFormat
                   placement:(nullable NSString *)placement
                  customData:(nullable NSString *)customData
       adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
                 autoRefresh:(BOOL)autoRefresh
{
    NSMutableArray *adViews = AdViewCache[adFormat];
    if ( !adViews )
    {
        return nil;
    }
    
    @synchronized ( AdViewCacheLock )
    {
        MAAdView *adView = nil;
        NSMutableData *discardedData = nil;
        
        for ( NSMutableData *data in adViews )
        {
            NativeAdView *cachedAdView = (NativeAdView *) data.mutableBytes;
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
        
        // when found, removes from the cache
        if ( discardedData )
        {
            [adViews removeObject: discardedData];
        }
        
        return adView;
    }
    
    return nil;
}

+ (void)saveAdView:(MAAdView *)adView
          adUnitId:(NSString *)adUnitIdentifier
          adFormat:(MAAdFormat *)adFormat
         placement:(nullable NSString *)placement
        customData:(nullable NSString *)customData
adaptiveBannerEnabled:(BOOL)adaptiveBannerEnabled
       autoRefresh:(BOOL)autoRefresh
{
    NSMutableData *data = [[NSMutableData alloc] initWithLength:sizeof(NativeAdView)];
    NativeAdView *nativeAdView = (NativeAdView *) data.mutableBytes;
    nativeAdView->adView = adView;
    nativeAdView->adUnitId = adUnitIdentifier;
    nativeAdView->adFormat = adFormat;
    nativeAdView->placement = placement;
    nativeAdView->customData = customData;
    nativeAdView->adaptiveBannerEnabled = adaptiveBannerEnabled;
    nativeAdView->autoRefresh = autoRefresh;
    
    @synchronized ( AdViewCacheLock )
    {
        NSMutableArray *adViews = AdViewCache[adFormat];
        if ( !adViews )
        {
            adViews = [NSMutableArray array];
            AdViewCache[adFormat] = adViews;
        }
        
        [adViews addObject: data];
    }
}

@end
