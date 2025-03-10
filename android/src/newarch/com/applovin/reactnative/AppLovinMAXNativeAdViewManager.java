package com.applovin.reactnative;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.AppLovinMAXNativeAdViewManagerDelegate;
import com.facebook.react.viewmanagers.AppLovinMAXNativeAdViewManagerInterface;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

@ReactModule(name = AppLovinMAXNativeAdViewManagerImpl.NAME)
public class AppLovinMAXNativeAdViewManager
    extends ViewGroupManager<AppLovinMAXNativeAdView>
    implements AppLovinMAXNativeAdViewManagerInterface<AppLovinMAXNativeAdView>
{
    private final ViewManagerDelegate<AppLovinMAXNativeAdView> mDelegate;

    AppLovinMAXNativeAdViewManager()
    {
        mDelegate = new AppLovinMAXNativeAdViewManagerDelegate<>( this );
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<AppLovinMAXNativeAdView> getDelegate()
    {
        return mDelegate;
    }

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

    @Override
    public void setAdUnitId(final AppLovinMAXNativeAdView view, final String value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setAdUnitId( view, value );
    }

    @Override
    public void setPlacement(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setPlacement( view, value );
    }

    @Override
    public void setCustomData(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setCustomData( view, value );
    }

    @Override
    public void setExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setExtraParameters( view, value );
    }

    @Override
    public void setStrLocalExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableArray value)
    {
        AppLovinMAXNativeAdViewManagerImpl.setLocalExtraParameters( view, value );
    }

    @Override
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

    @Override
    public void loadAd(final AppLovinMAXNativeAdView view)
    {
        AppLovinMAXNativeAdViewManagerImpl.loadAd( view );
    }

    @Override
    public void updateAssetView(final AppLovinMAXNativeAdView view, final double assetViewTag, final String assetViewName)
    {
        AppLovinMAXNativeAdViewManagerImpl.updateAssetView( view, (int) Math.round( assetViewTag ), assetViewName );
    }

    @Override
    public void renderNativeAd(final AppLovinMAXNativeAdView view)
    {
        AppLovinMAXNativeAdViewManagerImpl.renderNativeAd( view );
    }
}
