#import "AppLovinMAXNativeAdLoader.h"
#import <AppLovinSDK/AppLovinSDK.h>
#import "AppLovinMAX.h"

@interface AppLovinMaxNativeAdLoader ()  <MANativeAdDelegate>

@property (nonatomic, strong) NSMutableDictionary<NSString *, NSMutableArray<MAAd *> *> *nativeAds;
@property (nonatomic, strong) NSMutableDictionary<NSString *, MANativeAdLoader *> *loaders;
@property (nonatomic, strong) NSMutableDictionary<NSString *, id<AppLovinMAXNativeAdLoaderDelegate>> *delegates;

@end

@implementation AppLovinMaxNativeAdLoader

static const int MAX_PRELOADED_ADS = 2;

+ (AppLovinMaxNativeAdLoader*)shared
{
    static AppLovinMaxNativeAdLoader *_sharedInstance = nil;
    static dispatch_once_t oncePredecate;
    
    dispatch_once(&oncePredecate,^{
        _sharedInstance = [[AppLovinMaxNativeAdLoader alloc] init];
    });
    
    return _sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if ( self )
    {
        self.nativeAds = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.loaders = [NSMutableDictionary dictionaryWithCapacity: 2];
        self.delegates = [NSMutableDictionary dictionaryWithCapacity: 2];
    }
    return self;
}

- (MANativeAdLoader *)getNativeAdLoader:(NSString *)adUnitIdentifier
{
    MANativeAdLoader *loader = self.loaders[adUnitIdentifier];
    if ( !loader )
    {
        loader = [[MANativeAdLoader alloc] initWithAdUnitIdentifier: adUnitIdentifier
                                                                sdk: AppLovinMAX.shared.sdk];
        self.loaders[adUnitIdentifier] = loader;
    }
    return loader;
}

- (MAAd *)getNativeAd:(NSString *)adUnitIdentifier :(NSString *)placement :(NSString *)customData :(NSDictionary *)extraParameter :(id<AppLovinMAXNativeAdLoaderDelegate>)delegate
{
    NSMutableArray *list = self.nativeAds[adUnitIdentifier];
    if ( list && list.count > 0 )
    {
        MAAd* ad = [list objectAtIndex: 0];
        if (ad) {
            [list removeObjectAtIndex: 0];
            return ad;
        }
    }
    
    [self load: adUnitIdentifier : placement : customData : extraParameter : delegate];
    
    return nil;
}

- (void)load:(NSString *)adUnitIdentifier :(NSString *)placement :(NSString *)customData :(NSDictionary *)extraParameter :(id<AppLovinMAXNativeAdLoaderDelegate>)delegate
{
    MANativeAdLoader * loader = [self getNativeAdLoader: adUnitIdentifier];
    
    loader.nativeAdDelegate = self;
    // FIXME: revenueDelegate not working
    loader.revenueDelegate = AppLovinMAX.shared;
    loader.placement = placement;
    loader.customData = customData;
    for ( NSString* key in extraParameter )
    {
        [loader setExtraParameterForKey: key value: extraParameter[key]];
    }
    
    self.delegates[adUnitIdentifier] = delegate;
    
    [loader loadAd];
}

- (void)preLoadAd:(NSString *)adUnitIdentifier :(NSString *)placement :(NSString *)customData :(NSDictionary *)extraParameter
{
    NSMutableArray *queue = self.nativeAds[adUnitIdentifier];
    if ( queue && queue.count > MAX_PRELOADED_ADS )
    {
        return;
    }
    [self load: adUnitIdentifier : placement : customData : extraParameter : nil];
}

- (void)didLoadNativeAd:(MANativeAdView *)nativeAdView forAd:(MAAd *)ad
{
    [AppLovinMAX.shared didLoadAd: ad];
    
    id<AppLovinMAXNativeAdLoaderDelegate> delegate = self.delegates[ad.adUnitIdentifier];
    
    if ( delegate )
    {
        [delegate didLoadAd: ad];
    }
    else
    {
        NSMutableArray *list = self.nativeAds[ad.adUnitIdentifier];
        if ( !list )
        {
            list = [NSMutableArray array];
            self.nativeAds[ad.adUnitIdentifier] = list;
        }
        [list addObject: ad];
    }
}

- (void)didFailToLoadNativeAdForAdUnitIdentifier:(NSString *)adUnitIdentifier withError:(MAError *)error
{
    _errorAdUnitIdentifier = adUnitIdentifier;
    [AppLovinMAX.shared didFailToLoadAdForAdUnitIdentifier: adUnitIdentifier withError: error];
    // should retry
}

- (void)didClickNativeAd:(MAAd *)ad
{
    [AppLovinMAX.shared didClickAd: ad];
}

- (void)destroyAd:(NSString *)adUnitIdentifier :(MAAd *)ad
{
    MANativeAdLoader * loader = [self getNativeAdLoader: adUnitIdentifier];
    
    [loader destroyAd: ad];
}

@end
