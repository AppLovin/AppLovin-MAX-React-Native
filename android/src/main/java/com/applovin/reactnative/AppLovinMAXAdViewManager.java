package com.applovin.reactnative;

import com.applovin.mediation.MaxAdFormat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.jetbrains.annotations.NotNull;

import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManager
        extends ViewGroupManager<AppLovinMAXAdView>
{
    // Parent fields
    private ReactApplicationContext reactApplicationContext;

    // View fields
    private AppLovinMAXAdView adView;

    // Fields that need to be set before creating MaxAdView
    private String      adUnitId;
    private MaxAdFormat adFormat;

    public AppLovinMAXAdViewManager(final ReactApplicationContext reactApplicationContext)
    {
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public @NotNull String getName()
    {
        return "AppLovinMAXAdView";
    }

    @Override
    protected @NotNull AppLovinMAXAdView createViewInstance(@NotNull final ThemedReactContext reactContext)
    {
        // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
        adView = new AppLovinMAXAdView( reactContext );
        return adView;
    }

    @ReactProp(name = "adUnitId")
    public void setAdUnitId(final AppLovinMAXAdView view, final @Nullable String adUnitId)
    {
        this.adUnitId = adUnitId;
        adView.maybeAttachAdView( adUnitId, adFormat );
    }

    @ReactProp(name = "adFormat")
    public void setAdFormat(final AppLovinMAXAdView view, final @Nullable String adFormatStr)
    {
        if ( "banner".equals( adFormatStr ) )
        {
            adFormat = AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactApplicationContext );
        }
        else if ( "mrec".equals( adFormatStr ) )
        {
            adFormat = MaxAdFormat.MREC;
        }

        adView.maybeAttachAdView( adUnitId, adFormat );
    }
}
