package com.applovin.reactnative;

import android.util.Log;

import java.util.Map;
import java.util.HashMap;

import com.applovin.mediation.MaxAdFormat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.jetbrains.annotations.NotNull;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManager
        extends SimpleViewManager<AppLovinMAXAdView>
{
    // Parent fields
    private ReactApplicationContext reactApplicationContext;

    private Map<AppLovinMAXAdView, String> adUnitIdRegistry = new HashMap<>();
    private Map<AppLovinMAXAdView, MaxAdFormat> adFormatRegistry = new HashMap<>();

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
        return new AppLovinMAXAdView( reactContext );
    }

     @Override
     public void receiveCommand(@NonNull AppLovinMAXAdView view, String commandId, @Nullable ReadableArray args)
     {
         Log.d("HARRY", commandId);
         if ( "setAdUnitId".equals(commandId) && args != null)
         {
            setAdUnitId(view, args.getString( 0 ));
         }
         else if ( "setAdFormat".equals(commandId) && args != null)
         {
             setAdFormat(view, args.getString( 0 ));
         }
     }

    public void setAdUnitId(final AppLovinMAXAdView view, final String adUnitId)
    {
        adUnitIdRegistry.put(view, adUnitId);

        Log.d("HARRY", adUnitIdRegistry.get(view));
        Log.d( "HARRY", String.valueOf( adFormatRegistry.get( view) ) );

        view.maybeAttachAdView( adUnitIdRegistry.get(view), adFormatRegistry.get(view) );
    }

     public void setAdFormat(final AppLovinMAXAdView view, @Nullable final String adFormatStr)
     {
         if ( "banner".equals( adFormatStr ) )
         {
             adFormatRegistry.put(view, AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactApplicationContext ));
         }
         else if ( "mrec".equals( adFormatStr ) )
         {
             adFormatRegistry.put(view, MaxAdFormat.MREC);
         }

         Log.d("HARRY", adUnitIdRegistry.get(view));
         Log.d( "HARRY", String.valueOf( adFormatRegistry.get( view) ) );

         view.maybeAttachAdView( adUnitIdRegistry.get(view), adFormatRegistry.get(view) );
     }
}
