package com.applovin.reactnative;

import android.text.TextUtils;

import com.applovin.mediation.MaxAdFormat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

@ReactModule(name = "AppLovinMAXAdViewAdManager")
class AppLovinMAXAdViewAdManager
        extends ReactContextBaseJavaModule
{
    private static final String ON_ADVIEW_AD_LOADED_EVENT         = "OnAdViewAdLoadedEvent";
    private static final String ON_ADVIEW_AD_LOAD_FAILED_EVENT    = "OnAdViewAdLoadFailedEvent";
    private static final String ON_ADVIEW_AD_CLICKED_EVENT        = "OnAdViewAdClickedEvent";
    private static final String ON_ADVIEW_AD_COLLAPSED_EVENT      = "OnAdViewAdCollapsedEvent";
    private static final String ON_ADVIEW_AD_EXPANDED_EVENT       = "OnAdViewAdExpandedEvent";
    private static final String ON_ADVIEW_AD_DISPLAY_FAILED_EVENT = "OnAdViewAdDisplayFailedEvent";
    private static final String ON_ADVIEW_AD_REVENUE_PAID         = "OnAdViewAdRevenuePaid";

    private final Map<Integer, AppLovinMAXAdViewAd> adViewAds = new HashMap<>( 2 );

    AppLovinMAXAdViewAdManager(final ReactApplicationContext context)
    {
        super( context );
    }

    @NonNull
    @Override
    public String getName()
    {
        return "AppLovinMAXAdViewAdManager";
    }

    public AppLovinMAXAdViewAd getAdViewAd(final int adViewAdId)
    {
        return adViewAds.get( adViewAdId );
    }

    @ReactMethod
    public void createAdView(final String adUnitId, final String adFormatStr, final Promise promise)
    {
        if ( TextUtils.isEmpty( adUnitId ) )
        {
            promise.reject( new IllegalStateException( "Attempting to create MaxAdView without Ad Unit ID" ) );
            return;
        }

        MaxAdFormat adFormat;

        if ( MaxAdFormat.BANNER.getLabel().equals( adFormatStr ) )
        {
            adFormat = AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( getReactApplicationContext() );
        }
        else if ( MaxAdFormat.MREC.getLabel().equals( adFormatStr ) )
        {
            adFormat = MaxAdFormat.MREC;
        }
        else
        {
            promise.reject( new IllegalStateException( "Attempting to set an invalid ad format of \"" + adFormatStr + "\" for " + adUnitId ) );
            return;
        }

        AppLovinMAXAdViewAd adViewAd = new AppLovinMAXAdViewAd( getReactApplicationContext(), this );
        int adViewAdId = adViewAd.createAdView( adUnitId, adFormat );
        adViewAds.put( adViewAdId, adViewAd );
        promise.resolve( adViewAdId );
    }

    @ReactMethod
    public void destroyAdView(final int adViewAdId, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.destroyAdView();
        adViewAds.remove( adViewAdId );
        promise.resolve( null );
    }

    @ReactMethod
    public void loadAd(final int adViewAdId, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.loadAd();
        promise.resolve( null );
    }

    @ReactMethod
    public void setPlacement(final int adViewAdId, final String placement, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.setPlacement( placement );
        promise.resolve( null );
    }

    @ReactMethod
    public void setCustomData(final int adViewAdId, final String customData, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.setCustomData( customData );
        promise.resolve( null );
    }

    @ReactMethod
    public void setAdaptiveBannerEnabled(final int adViewAdId, final boolean adaptiveBannerEnabled, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
        promise.resolve( null );
    }

    @ReactMethod
    public void setAutoRefresh(final int adViewAdId, final boolean autoRefresh, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.setAutoRefresh( autoRefresh );
        promise.resolve( null );
    }

    @ReactMethod
    public void setExtraParameters(final int adViewAdId, final ReadableMap parameterMap, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.setExtraParameters( parameterMap );
        promise.resolve( null );
    }

    @ReactMethod
    public void setLocalExtraParameters(final int adViewAdId, final ReadableMap parameterMap, final Promise promise)
    {
        AppLovinMAXAdViewAd adViewAd = adViewAds.get( adViewAdId );
        adViewAd.setLocalExtraParameters( parameterMap );
        promise.resolve( null );
    }

    public void sendLoadAdEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_LOADED_EVENT, params );
    }

    public void sendFailToDisplayAEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_DISPLAY_FAILED_EVENT, params );
    }

    public void sendFailToLoadAdEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_LOAD_FAILED_EVENT, params );
    }

    public void sendClickAdEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_CLICKED_EVENT, params );
    }

    public void sendCollapseAdEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_COLLAPSED_EVENT, params );
    }

    public void sendExpandAdEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_EXPANDED_EVENT, params );
    }

    public void sendPayRevenueEvent(@Nullable final WritableMap params)
    {
        sendReactNativeEvent( ON_ADVIEW_AD_REVENUE_PAID, params );
    }

    private void sendReactNativeEvent(final String name, @Nullable final WritableMap params)
    {
        getReactApplicationContext()
                .getJSModule( DeviceEventManagerModule.RCTDeviceEventEmitter.class )
                .emit( name, params );
    }

    @Override
    @Nullable
    public Map<String, Object> getConstants()
    {
        final Map<String, Object> constants = new HashMap<>();

        constants.put( "ON_ADVIEW_AD_LOADED_EVENT", ON_ADVIEW_AD_LOADED_EVENT );
        constants.put( "ON_ADVIEW_AD_LOAD_FAILED_EVENT", ON_ADVIEW_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_ADVIEW_AD_CLICKED_EVENT", ON_ADVIEW_AD_CLICKED_EVENT );
        constants.put( "ON_ADVIEW_AD_COLLAPSED_EVENT", ON_ADVIEW_AD_COLLAPSED_EVENT );
        constants.put( "ON_ADVIEW_AD_EXPANDED_EVENT", ON_ADVIEW_AD_EXPANDED_EVENT );
        constants.put( "ON_ADVIEW_AD_DISPLAY_FAILED_EVENT", ON_ADVIEW_AD_DISPLAY_FAILED_EVENT );
        constants.put( "ON_ADVIEW_AD_REVENUE_PAID", ON_ADVIEW_AD_REVENUE_PAID );

        return constants;
    }
}
