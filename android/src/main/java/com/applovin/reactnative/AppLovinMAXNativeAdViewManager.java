package com.applovin.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdViewManager
        extends ViewGroupManager<AppLovinMAXNativeAdView>
{
    public static final String REACT_CLASS = "AppLovinMAXNativeAdView";

    public final int COMMAND_LOAD_AD                = 1;
    public final int COMMAND_PERFORM_CALL_TO_ACTION = 2;

    ReactApplicationContext mCallerContext;

    public AppLovinMAXNativeAdViewManager(final ReactApplicationContext mCallerContext)
    {
        this.mCallerContext = mCallerContext;
    }

    @NonNull
    @Override
    protected AppLovinMAXNativeAdView createViewInstance(@NonNull final ThemedReactContext reactContext)
    {
        return new AppLovinMAXNativeAdView( reactContext );
    }

    @NonNull
    @Override
    public String getName()
    {
        return REACT_CLASS;
    }

    /// Callback to JS

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        return MapBuilder.<String, Object>builder()
                .put( "onNativeAdLoaded", MapBuilder.of( "registrationName", "onNativeAdLoaded" ) )
                .build();
    }


    /// Call from JS

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap()
    {
        return MapBuilder.of(
                "loadAd", COMMAND_LOAD_AD,
                "performCallToAction", COMMAND_PERFORM_CALL_TO_ACTION
        );
    }

    // NOTE: the method is deprecated but the new version won't work
    @Override
    public void receiveCommand(@NonNull final AppLovinMAXNativeAdView root, final int commandId, @Nullable final ReadableArray args)
    {
        switch ( commandId )
        {
            case COMMAND_LOAD_AD:
                root.loadAd();
                break;
            case COMMAND_PERFORM_CALL_TO_ACTION:
                root.performCallToAction();
                break;
        }
    }

    /// Property Setters

    @ReactProp(name = "adUnitId")
    public void setAdUnitId(final AppLovinMAXNativeAdView view, final String value)
    {
        view.setAdUnitId( value );
    }

    @ReactProp(name = "placement")
    public void setPlacement(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        view.setPlacement( value );
    }

    @ReactProp(name = "customData")
    public void setCustomData(final AppLovinMAXNativeAdView view, @Nullable final String value)
    {
        view.setCustomData( value );
    }

    @ReactProp(name = "extraParameter")
    public void setExtraParameter(final AppLovinMAXNativeAdView view, @Nullable final ReadableMap value)
    {
        view.setExtraParameter( value );
    }

    @ReactProp(name = "advertiser")
    public void setAdvertiser(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setAdvertiser( value );
    }

    @ReactProp(name = "body")
    public void setBody(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setBody( value );
    }

    @ReactProp(name = "callToAction")
    public void setCallToAction(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setCallToAction( value );
    }

    @ReactProp(name = "icon")
    public void setIcon(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setIcon( value );
    }

    @ReactProp(name = "media")
    public void setMedia(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setMedia( value );
    }

    @ReactProp(name = "options")
    public void setOptions(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setOptions( value );
    }

    @ReactProp(name = "title")
    public void setTitle(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setTitle( value );
    }

    ///

    @Override
    public void onDropViewInstance(@NonNull final AppLovinMAXNativeAdView view)
    {
        super.onDropViewInstance( view );

        view.destroyCurrentAd();
    }
}
