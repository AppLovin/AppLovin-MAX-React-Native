package com.applovin.reactnative;

import com.facebook.react.bridge.ReadableArray;
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
    AppLovinMAXAdViewManager() { }

    @NonNull
    @Override
    public String getName()
    {
        return AppLovinMAXAdViewManagerImpl.NAME;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        return AppLovinMAXAdViewManagerImpl.getExportedCustomDirectEventTypeConstants();
    }

    @Override
    public void receiveCommand(@NonNull final AppLovinMAXAdView view, final String commandId, @Nullable final ReadableArray args)
    {
        super.receiveCommand( view, commandId, args );
        AppLovinMAXAdViewManagerImpl.receiveCommand( view, commandId, args );
    }

    @NonNull
    @Override
    protected AppLovinMAXAdView createViewInstance(@NonNull final ThemedReactContext reactContext)
    {
        return AppLovinMAXAdViewManagerImpl.createViewInstance( reactContext );
    }

    @ReactProp(name = "adUnitId")
    public void setAdUnitId(final AppLovinMAXAdView view, final String adUnitId)
    {
        AppLovinMAXAdViewManagerImpl.setAdUnitId( view, adUnitId );
    }

    @ReactProp(name = "adFormat")
    public void setAdFormat(final AppLovinMAXAdView view, final String adFormatStr)
    {
        AppLovinMAXAdViewManagerImpl.setAdFormat( view, adFormatStr );
    }

    @ReactProp(name = "adViewId")
    public void setAdViewId(final AppLovinMAXAdView view, final int adViewId)
    {
        AppLovinMAXAdViewManagerImpl.setAdViewId( view, adViewId );
    }

    @ReactProp(name = "placement")
    public void setPlacement(final AppLovinMAXAdView view, @Nullable final String placement)
    {
        AppLovinMAXAdViewManagerImpl.setPlacement( view, placement );
    }

    @ReactProp(name = "customData")
    public void setCustomData(final AppLovinMAXAdView view, @Nullable final String customData)
    {
        AppLovinMAXAdViewManagerImpl.setCustomData( view, customData );
    }

    @ReactProp(name = "adaptiveBannerEnabled")
    public void setAdaptiveBannerEnabled(final AppLovinMAXAdView view, final boolean enabled)
    {
        AppLovinMAXAdViewManagerImpl.setAdaptiveBannerEnabled( view, enabled );
    }

    @ReactProp(name = "autoRefresh")
    public void setAutoRefresh(final AppLovinMAXAdView view, final boolean enabled)
    {
        AppLovinMAXAdViewManagerImpl.setAutoRefresh( view, enabled );
    }

    @ReactProp(name = "loadOnMount")
    public void setLoadOnMount(final AppLovinMAXAdView view, final boolean value)
    {
        AppLovinMAXAdViewManagerImpl.setLoadOnMount( view, value );
    }

    @ReactProp(name = "extraParameters")
    public void setExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXAdViewManagerImpl.setExtraParameters( view, value );
    }

    @ReactProp(name = "strLocalExtraParameters")
    public void setStrLocalExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @ReactProp(name = "numLocalExtraParameters")
    public void setNumLocalExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @ReactProp(name = "boolLocalExtraParameters")
    public void setBoolLocalExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @Override
    public void onAfterUpdateTransaction(@NonNull final AppLovinMAXAdView view)
    {
        super.onAfterUpdateTransaction( view );
        AppLovinMAXAdViewManagerImpl.onAfterUpdateTransaction( view );
    }

    @Override
    public void onDropViewInstance(@NonNull AppLovinMAXAdView view)
    {
        AppLovinMAXAdViewManagerImpl.onDropViewInstance( view );
        super.onDropViewInstance( view );
    }
}
