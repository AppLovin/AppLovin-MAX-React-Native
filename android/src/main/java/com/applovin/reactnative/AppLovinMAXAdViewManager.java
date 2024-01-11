package com.applovin.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManager
        extends SimpleViewManager<AppLovinMAXAdView>
{
    public final int COMMAND_LOAD_AD = 1;

    public AppLovinMAXAdViewManager(final ReactApplicationContext reactApplicationContext) { }

    @Override
    public String getName()
    {
        return "AppLovinMAXAdView";
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        // mapping Android events to JavaScript events
        return MapBuilder.<String, Object>builder()
                .put( "onAdLoadedEvent", MapBuilder.of( "registrationName", "onAdLoadedEvent" ) )
                .put( "onAdLoadFailedEvent", MapBuilder.of( "registrationName", "onAdLoadFailedEvent" ) )
                .put( "onAdDisplayFailedEvent", MapBuilder.of( "registrationName", "onAdDisplayFailedEvent" ) )
                .put( "onAdClickedEvent", MapBuilder.of( "registrationName", "onAdClickedEvent" ) )
                .put( "onAdExpandedEvent", MapBuilder.of( "registrationName", "onAdExpandedEvent" ) )
                .put( "onAdCollapsedEvent", MapBuilder.of( "registrationName", "onAdCollapsedEvent" ) )
                .put( "onAdRevenuePaidEvent", MapBuilder.of( "registrationName", "onAdRevenuePaidEvent" ) )
                .build();
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap()
    {
        return MapBuilder.of(
                "loadAd", COMMAND_LOAD_AD
        );
    }

    @Override
    public void receiveCommand(@NonNull final AppLovinMAXAdView adView, final int commandId, @Nullable final ReadableArray args)
    {
        switch ( commandId )
        {
            case COMMAND_LOAD_AD:
                adView.loadAd();
                break;
        }
    }

    @Override
    protected AppLovinMAXAdView createViewInstance(final ThemedReactContext reactContext)
    {
        // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
        return new AppLovinMAXAdView( reactContext );
    }

    @ReactProp(name = "adUnitId")
    public void setAdUnitId(final AppLovinMAXAdView view, final String adUnitId)
    {
        view.setAdUnitId( adUnitId );
    }

    @ReactProp(name = "adFormat")
    public void setAdFormat(final AppLovinMAXAdView view, final String adFormatStr)
    {
        view.setAdFormat( adFormatStr );
    }

    @ReactProp(name = "placement")
    public void setPlacement(final AppLovinMAXAdView view, @Nullable final String placement)
    {
        view.setPlacement( placement );
    }

    @ReactProp(name = "customData")
    public void setCustomData(final AppLovinMAXAdView view, @Nullable final String customData)
    {
        view.setCustomData( customData );
    }

    @ReactProp(name = "adaptiveBannerEnabled")
    public void setAdaptiveBannerEnabled(final AppLovinMAXAdView view, final boolean enabled)
    {
        view.setAdaptiveBannerEnabled( enabled );
    }

    @ReactProp(name = "autoRefresh")
    public void setAutoRefresh(final AppLovinMAXAdView view, final boolean enabled)
    {
        view.setAutoRefresh( enabled );
    }

    @ReactProp(name = "loadOnMount")
    public void setLoadOnMount(final AppLovinMAXAdView view, final boolean enabled)
    {
        view.setLoadOnMount( enabled );
    }

    @ReactProp(name = "extraParameters")
    public void setExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableMap value)
    {
        view.setExtraParameters( value );
    }

    @ReactProp(name = "localExtraParameters")
    public void setLocalExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableMap value)
    {
        view.setLocalExtraParameters( value );
    }

    @Override
    public void onDropViewInstance(AppLovinMAXAdView view)
    {
        view.destroy();

        super.onDropViewInstance( view );
    }
}
