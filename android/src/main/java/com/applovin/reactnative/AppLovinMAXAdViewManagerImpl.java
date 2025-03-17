package com.applovin.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManagerImpl
{
    public static final String NAME = "AppLovinMAXAdView";

    public static Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        return MapBuilder.<String, Object>builder()
                .put( AppLovinMAXAdEvents.ON_AD_LOADED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_LOADED_EVENT ) )
                .put( AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT ) )
                .put( AppLovinMAXAdEvents.ON_AD_DISPLAY_FAILED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_DISPLAY_FAILED_EVENT ) )
                .put( AppLovinMAXAdEvents.ON_AD_CLICKED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_CLICKED_EVENT ) )
                .put( AppLovinMAXAdEvents.ON_AD_EXPANDED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_EXPANDED_EVENT ) )
                .put( AppLovinMAXAdEvents.ON_AD_COLLAPSED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_COLLAPSED_EVENT ) )
                .put( AppLovinMAXAdEvents.ON_AD_REVENUE_PAID_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_REVENUE_PAID_EVENT ) )
                .build();
    }

    public static void receiveCommand(final AppLovinMAXAdView view, final String commandId, @Nullable final ReadableArray args)
    {
        if ( commandId.equals( "loadAd" ) )
        {
            loadAd( view );
        }
    }

    @NonNull
    public static AppLovinMAXAdView createViewInstance(@NonNull final ThemedReactContext reactContext)
    {
        return new AppLovinMAXAdView( reactContext );
    }

    public static void setAdUnitId(final AppLovinMAXAdView view, final String adUnitId)
    {
        view.setAdUnitId( adUnitId );
    }

    public static void setAdFormat(final AppLovinMAXAdView view, final String adFormatStr)
    {
        view.setAdFormat( adFormatStr );
    }

    public static void setAdViewId(final AppLovinMAXAdView view, final int adViewId)
    {
        view.setAdViewId( adViewId );
    }

    public static void setPlacement(final AppLovinMAXAdView view, @Nullable final String placement)
    {
        view.setPlacement( placement );
    }

    public static void setCustomData(final AppLovinMAXAdView view, @Nullable final String customData)
    {
        view.setCustomData( customData );
    }

    public static void setAdaptiveBannerEnabled(final AppLovinMAXAdView view, final boolean enabled)
    {
        view.setAdaptiveBannerEnabled( enabled );
    }

    public static void setAutoRefresh(final AppLovinMAXAdView view, final boolean enabled)
    {
        view.setAutoRefreshEnabled( enabled );
    }

    public static void setLoadOnMount(final AppLovinMAXAdView view, final boolean enabled)
    {
        view.setLoadOnMount( enabled );
    }

    public static void setExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        view.setExtraParameters( value );
    }

    public static void setLocalExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        view.setLocalExtraParameters( value );
    }

    public static void onAfterUpdateTransaction(final AppLovinMAXAdView view)
    {
        view.onSetProps();
    }

    public static void onDropViewInstance(AppLovinMAXAdView view)
    {
        view.destroy();
    }

    public static void loadAd(AppLovinMAXAdView view)
    {
        view.loadAd();
    }
}
