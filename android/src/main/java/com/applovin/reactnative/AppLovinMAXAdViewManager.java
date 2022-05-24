package com.applovin.reactnative;

import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManager
        extends SimpleViewManager<AppLovinMAXAdView>
{
    // Parent fields
    private final ReactApplicationContext reactApplicationContext;

    // Maps from the view to the corresponding ad unit id and ad format.
    // Both must be set before the MaxAdView is created.
    private final Map<AppLovinMAXAdView, String>      adUnitIdRegistry = new HashMap<>();
    private final Map<AppLovinMAXAdView, MaxAdFormat> adFormatRegistry = new HashMap<>();

    // Storage for placement and extra parameters if set before the MAAdView is created
    private final Map<AppLovinMAXAdView, String> placementRegistry             = new HashMap<>();
    private final Map<AppLovinMAXAdView, String> customDataRegistry            = new HashMap<>();
    private final Map<AppLovinMAXAdView, String> adaptiveBannerEnabledRegistry = new HashMap<>();

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
        if ( args == null ) return;

        String arg = args.getString( 0 );
        if ( arg == null ) return;

        if ( "setPlacement".equals( commandId ) )
        {
            setPlacement( view, arg );
        }
        else if ( "setCustomData".equals( commandId ) )
        {
            setCustomData( view, arg );
        }
        else if ( "setAdaptiveBannerEnabled".equals( commandId ) )
        {
            setAdaptiveBannerEnabled( view, arg );
        }
        else if ( "setAdUnitId".equals( commandId ) )
        {
            setAdUnitId( view, arg );
        }
        else if ( "setAdFormat".equals( commandId ) )
        {
            setAdFormat( view, arg );
        }
        else
        {
            AppLovinMAXModule.e( "Unable to parse command: " + commandId + " for AdView: + " + view + " with args: " + args );
        }
    }

    public void setPlacement(final AppLovinMAXAdView view, final String placement)
    {
        // Post to main thread to avoid race condition with actual creation of MaxAdView in maybeAttachAdView()
        view.post( () -> {

            MaxAdView adView = view.getAdView();
            if ( adView != null )
            {
                adView.setPlacement( placement );
            }
            else
            {
                placementRegistry.put( view, placement );
            }
        } );
    }

    public void setCustomData(final AppLovinMAXAdView view, final String customData)
    {
        // Post to main thread to avoid race condition with actual creation of MaxAdView in maybeAttachAdView()
        view.post( () -> {

            MaxAdView adView = view.getAdView();
            if ( adView != null )
            {
                adView.setCustomData( customData );
            }
            else
            {
                customDataRegistry.put( view, customData );
            }
        } );
    }

    public void setAdaptiveBannerEnabled(final AppLovinMAXAdView view, final String enabledStr)
    {
        // Post to main thread to avoid race condition with actual creation of MaxAdView in maybeAttachAdView()
        view.post( () -> {

            MaxAdView adView = view.getAdView();
            if ( adView != null )
            {
                adView.setExtraParameter( "adaptive_banner", enabledStr );
            }
            else
            {
                adaptiveBannerEnabledRegistry.put( view, enabledStr );
            }
        } );
    }

    public void setAdUnitId(final AppLovinMAXAdView view, final String adUnitId)
    {
        adUnitIdRegistry.put( view, adUnitId );
        maybeAttachAdView( view );
    }

    public void setAdFormat(final AppLovinMAXAdView view, final String adFormatStr)
    {
        if ( "banner".equals( adFormatStr ) )
        {
            adFormatRegistry.put( view, AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactApplicationContext ) );
        }
        else if ( "mrec".equals( adFormatStr ) )
        {
            adFormatRegistry.put( view, MaxAdFormat.MREC );
        }

        maybeAttachAdView( view );
    }

    private void maybeAttachAdView(final AppLovinMAXAdView view)
    {
        String placement = placementRegistry.remove( view );
        String customData = customDataRegistry.remove( view );
        String adaptiveBannerEnabledStr = adaptiveBannerEnabledRegistry.remove( view );

        view.maybeAttachAdView( placement,
                                customData,
                                adaptiveBannerEnabledStr,
                                adUnitIdRegistry.get( view ),
                                adFormatRegistry.get( view ) );
    }

    @Override
    public void onDropViewInstance(@NotNull AppLovinMAXAdView view)
    {
        // NOTE: Android destroys the native MaxAdView and calls this method while iOS caches it when you remove it from screen
        adUnitIdRegistry.remove( view );

        // HACK ALERT: Since current SDK does not respect auto-refresh APIs until _after_ `onAdLoaded()`, explicitly expose view validity to the main module
        MaxAdView adView = view.getAdView();
        if ( adView != null )
        {
            AppLovinMAXModule.sAdViewsToRemove.put( adView.getAdUnitId(), adView );
        }

        super.onDropViewInstance( view );
    }
}
