package com.applovin.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdViewManagerImpl
{
    public static final String NAME = "AppLovinMAXNativeAdView";

    private static final int COMMAND_LOAD_AD = 1;

    public static AppLovinMAXNativeAdView createViewInstance(@NonNull final ThemedReactContext reactContext)
    {
        return new AppLovinMAXNativeAdView( reactContext );
    }

    public static Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        // mapping Android events to JavaScript events
        return MapBuilder.<String, Object>builder()
            .put( AppLovinMAXAdEvents.ON_AD_LOADED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_LOADED_EVENT ) )
            .put( AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT ) )
            .put( AppLovinMAXAdEvents.ON_AD_CLICKED_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_CLICKED_EVENT ) )
            .put( AppLovinMAXAdEvents.ON_AD_REVENUE_PAID_EVENT, MapBuilder.of( "registrationName", AppLovinMAXAdEvents.ON_AD_REVENUE_PAID_EVENT ) )
            .build();
    }

    public static void receiveCommand(final AppLovinMAXNativeAdView view, final String commandId, @Nullable final ReadableArray args)
    {
        if ( commandId.equals( "loadAd" ) )
        {
            loadAd( view );
        }
        else if ( commandId.equals( "updateAssetView" ) )
        {
            int assetViewTag = args.getInt( 0 );
            String assetViewName = args.getString( 1 );
            updateAssetView( view, assetViewTag, assetViewName );
        }
        else if ( commandId.equals( "renderNativeAd" ) )
        {
            renderNativeAd( view );
        }
    }

    public static void setAdUnitId(final AppLovinMAXNativeAdView view, final String value)
    {
        view.setAdUnitId( value );
    }

    public static void setPlacement(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        view.setPlacement( value );
    }

    public static void setCustomData(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        view.setCustomData( value );
    }

    public static void setExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        view.setExtraParameters( value );
    }

    public static void setLocalExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        view.setLocalExtraParameters( value );
    }

    public static void onSetProps(final AppLovinMAXNativeAdView view)
    {
        view.onSetProps();
    }

    public static void destroy(final AppLovinMAXNativeAdView view)
    {
        view.destroy();
    }

    public static void loadAd(final AppLovinMAXNativeAdView view)
    {
        view.loadAd();
    }

    public static void updateAssetView(final AppLovinMAXNativeAdView view, final int assetViewTag, final String assetViewName)
    {
        view.updateAssetView( assetViewTag, assetViewName );
    }

    public static void renderNativeAd(final AppLovinMAXNativeAdView view)
    {
        view.renderNativeAd();
    }
}
