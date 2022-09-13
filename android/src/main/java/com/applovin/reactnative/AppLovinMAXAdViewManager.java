package com.applovin.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.jetbrains.annotations.NotNull;

import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManager
        extends SimpleViewManager<AppLovinMAXAdView>
{
    public AppLovinMAXAdViewManager(final ReactApplicationContext reactApplicationContext) { }

    @NotNull
    @Override
    public String getName()
    {
        return "AppLovinMAXAdView";
    }

    @NotNull
    @Override
    protected AppLovinMAXAdView createViewInstance(@NotNull final ThemedReactContext reactContext)
    {
        // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
        return new AppLovinMAXAdView( reactContext );
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

    @Override
    public void onDropViewInstance(@NotNull AppLovinMAXAdView view)
    {
        view.destroy();

        super.onDropViewInstance( view );
    }
}
