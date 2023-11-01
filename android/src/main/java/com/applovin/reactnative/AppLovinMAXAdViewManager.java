package com.applovin.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import androidx.annotation.NonNull;

class AppLovinMAXAdViewManager
        extends SimpleViewManager<AppLovinMAXAdView>
{
    public AppLovinMAXAdViewManager(final ReactApplicationContext reactApplicationContext) { }

    @NonNull
    @Override
    public String getName()
    {
        return "AppLovinMAXAdView";
    }

    @NonNull
    @Override
    protected AppLovinMAXAdView createViewInstance(final ThemedReactContext reactContext)
    {
        AppLovinMAXAdViewAdManager manager = reactContext.getNativeModule( AppLovinMAXAdViewAdManager.class );
        return new AppLovinMAXAdView( reactContext, manager );
    }

    @ReactProp(name = "adViewAdId")
    public void setAdViewAdId(final AppLovinMAXAdView view, final int adViewAdId)
    {
        view.attachAdView( adViewAdId );
    }

    @Override
    public void onDropViewInstance(AppLovinMAXAdView view)
    {
        view.detachAdView();

        super.onDropViewInstance( view );
    }
}
