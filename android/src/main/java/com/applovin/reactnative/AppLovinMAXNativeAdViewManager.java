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

    public final int COMMAND_LOAD_AD = 1;

    public AppLovinMAXNativeAdViewManager(final ReactApplicationContext callerContext) { }

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

    /// Callback to JavaScript

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants()
    {
        // mapping Android events to JavaScript events
        return MapBuilder.<String, Object>builder()
                .put( "onAdLoadedEvent", MapBuilder.of( "registrationName", "onAdLoadedEvent" ) )
                .put( "onAdLoadFailedEvent", MapBuilder.of( "registrationName", "onAdLoadFailedEvent" ) )
                .put( "onAdClickedEvent", MapBuilder.of( "registrationName", "onAdClickedEvent" ) )
                .put( "onAdRevenuePaidEvent", MapBuilder.of( "registrationName", "onAdRevenuePaidEvent" ) )
                .build();
    }

    /// Call from JavaScript

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap()
    {
        return MapBuilder.of(
                "loadAd", COMMAND_LOAD_AD
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

    @ReactProp(name = "extraParameters")
    public void setExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableMap value)
    {
        view.setExtraParameters( value );
    }

    @ReactProp(name = "localExtraParameters")
    public void setLocalExtraParameters(final AppLovinMAXNativeAdView view, @Nullable final ReadableMap value)
    {
        view.setLocalExtraParameters( value );
    }

    @ReactProp(name = "titleView")
    public void setTitleView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setTitleView( value );
    }

    @ReactProp(name = "advertiserView")
    public void setAdvertiserView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setAdvertiserView( value );
    }

    @ReactProp(name = "bodyView")
    public void setBodyView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setBodyView( value );
    }

    @ReactProp(name = "callToActionView")
    public void setCallToActionView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setCallToActionView( value );
    }

    @ReactProp(name = "iconView")
    public void setIconView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setIconView( value );
    }

    @ReactProp(name = "optionsView")
    public void setOptionsView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setOptionsView( value );
    }

    @ReactProp(name = "mediaView")
    public void setMediaView(final AppLovinMAXNativeAdView view, final int value)
    {
        view.setMediaView( value );
    }

    @Override
    public void onDropViewInstance(@NonNull final AppLovinMAXNativeAdView view)
    {
        view.destroy();

        super.onDropViewInstance( view );
    }
}
