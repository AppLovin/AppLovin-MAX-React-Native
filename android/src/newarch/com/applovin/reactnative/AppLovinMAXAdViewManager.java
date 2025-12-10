package com.applovin.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.AppLovinMAXAdViewManagerDelegate;
import com.facebook.react.viewmanagers.AppLovinMAXAdViewManagerInterface;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
@ReactModule(name = AppLovinMAXAdViewManagerImpl.NAME)
class AppLovinMAXAdViewManager
    extends SimpleViewManager<AppLovinMAXAdView>
    implements AppLovinMAXAdViewManagerInterface<AppLovinMAXAdView>
{
    private final ViewManagerDelegate<AppLovinMAXAdView> mDelegate;

    AppLovinMAXAdViewManager()
    {
        mDelegate = new AppLovinMAXAdViewManagerDelegate<>( this );
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<AppLovinMAXAdView> getDelegate()
    {
        return mDelegate;
    }

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

    @Override
    public void setAdUnitId(final AppLovinMAXAdView view, final String adUnitId)
    {
        AppLovinMAXAdViewManagerImpl.setAdUnitId( view, adUnitId );
    }

    @Override
    public void setAdFormat(final AppLovinMAXAdView view, final String adFormatStr)
    {
        AppLovinMAXAdViewManagerImpl.setAdFormat( view, adFormatStr );
    }

    @Override
    public void setAdViewId(final AppLovinMAXAdView view, final double adViewId)
    {
        AppLovinMAXAdViewManagerImpl.setAdViewId( view, (int) Math.round( adViewId ) );
    }

    @Override
    public void setPlacement(final AppLovinMAXAdView view, @Nullable final String placement)
    {
        AppLovinMAXAdViewManagerImpl.setPlacement( view, placement );
    }

    @Override
    public void setCustomData(final AppLovinMAXAdView view, @Nullable final String customData)
    {
        AppLovinMAXAdViewManagerImpl.setCustomData( view, customData );
    }

    @Override
    public void setAdaptiveBannerEnabled(final AppLovinMAXAdView view, final boolean enabled)
    {
        AppLovinMAXAdViewManagerImpl.setAdaptiveBannerEnabled( view, enabled );
    }

    @Override
    public void setAutoRefresh(final AppLovinMAXAdView view, final boolean enabled)
    {
        AppLovinMAXAdViewManagerImpl.setAutoRefresh( view, enabled );
    }

    @Override
    public void setLoadOnMount(final AppLovinMAXAdView view, final boolean value)
    {
        AppLovinMAXAdViewManagerImpl.setLoadOnMount( view, value );
    }

    @Override
    public void setExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXAdViewManagerImpl.setExtraParameters( view, value );
    }

    @Override
    public void setStrLocalExtraParameters(final AppLovinMAXAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @Override
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

    @Override
    public void loadAd(final AppLovinMAXAdView view)
    {
        AppLovinMAXAdViewManagerImpl.loadAd( view );
    }

    @Override
    public void destroyAd(final AppLovinMAXNativeAdView view)
    {
        AppLovinMAXAdViewManagerImpl.destroy( view );
    }
}
