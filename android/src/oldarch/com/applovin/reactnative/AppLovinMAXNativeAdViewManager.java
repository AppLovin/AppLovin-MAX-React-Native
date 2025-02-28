package com.applovin.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdViewManager
    extends ViewGroupManager<AppLovinMAXNativeAdView>
{
    public AppLovinMAXNativeAdViewManager() { }

    @NonNull
    @Override
    protected AppLovinMAXNativeAdView createViewInstance(@NonNull final ThemedReactContext reactContext)
    {
        return AppLovinMAXNativeAdViewManagerImpl.createViewInstance( reactContext );
    }

    @NonNull
    @Override
    public String getName()
    {
        return AppLovinMAXNativeAdViewManagerImpl.NAME;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        return AppLovinMAXNativeAdViewManagerImpl.getExportedCustomDirectEventTypeConstants();
    }

    @Override
    public void receiveCommand(@NonNull final AppLovinMAXNativeAdView view, final String commandId, @Nullable final ReadableArray args)
    {
        super.receiveCommand( view, commandId, args );
        AppLovinMAXNativeAdViewManagerImpl.receiveCommand( view, commandId, args );
    }

    @ReactProp(name = "adUnitId")
    public void setAdUnitId(final AppLovinMAXNativeAdView view, final String value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setAdUnitId( view, value );
    }

    @ReactProp(name = "placement")
    public void setPlacement(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setPlacement( view, value );
    }

    @ReactProp(name = "customData")
    public void setCustomData(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setCustomData( view, value );
    }

    @ReactProp(name = "extraParameters")
    public void setExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setExtraParameters( view, value );
    }

    @ReactProp(name = "strLocalExtraParameters")
    public void setStrLocalExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @ReactProp(name = "numLocalExtraParameters")
    public void setNumLocalExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @ReactProp(name = "boolLocalExtraParameters")
    public void setBoolLocalExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @Override
    public void onAfterUpdateTransaction(@NonNull final AppLovinMAXNativeAdView view)
    {
        super.onAfterUpdateTransaction( view );
        AppLovinMAXNativeAdViewManagerImpl.onSetProps( view );
    }

    @Override
    public void onDropViewInstance(@NonNull final AppLovinMAXNativeAdView view)
    {
        AppLovinMAXNativeAdViewManagerImpl.destroy( view );
        super.onDropViewInstance( view );
    }
}
