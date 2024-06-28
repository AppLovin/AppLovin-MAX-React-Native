package com.applovin.reactnative;

import android.content.Context;
import android.text.TextUtils;

import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 27 2020
 */
class AppLovinMAXAdView
    extends ReactViewGroup
{
    private static final Map<String, AppLovinMAXAdViewUIComponent> uiComponentInstances          = new HashMap<>( 2 );
    private static final Map<String, AppLovinMAXAdViewUIComponent> preloadedUIComponentInstances = new HashMap<>( 2 );

    private final ReactContext reactContext;

    @Nullable
    private AppLovinMAXAdViewUIComponent uiComponent;

    private String              adUnitId;
    private MaxAdFormat         adFormat;
    @Nullable
    private String              placement;
    @Nullable
    private String              customData;
    private boolean             adaptiveBannerEnabled;
    private boolean             autoRefresh;
    private boolean             loadOnMount;
    @Nullable
    private Map<String, Object> extraParameters;
    @Nullable
    private Map<String, Object> localExtraParameters;

    public static MaxAdView getInstance(final String adUnitId)
    {
        AppLovinMAXAdViewUIComponent uiComponent = preloadedUIComponentInstances.get( adUnitId );
        if ( uiComponent == null ) uiComponent = uiComponentInstances.get( adUnitId );
        return ( uiComponent != null ) ? uiComponent.getAdView() : null;
    }

    public static void preloadNativeUIComponentAdView(final String adUnitId, final MaxAdFormat adFormat, final String placement, final String customData, final Map<String, Object> extraParameters, final Map<String, Object> localExtraParameters, final Promise promise, final ReactContext context)
    {
        AppLovinMAXAdViewUIComponent preloadedUIComponent = preloadedUIComponentInstances.get( adUnitId );
        if ( preloadedUIComponent != null )
        {
            promise.reject( new IllegalStateException( "Cannot preload more than one for a single Ad Unit ID" ) );
            return;
        }

        preloadedUIComponent = new AppLovinMAXAdViewUIComponent( adUnitId, adFormat, context );
        preloadedUIComponentInstances.put( adUnitId, preloadedUIComponent );

        preloadedUIComponent.setPlacement( placement );
        preloadedUIComponent.setCustomData( customData );
        preloadedUIComponent.setExtraParameters( extraParameters );
        preloadedUIComponent.setLocalExtraParameters( localExtraParameters );

        preloadedUIComponent.loadAd();

        promise.resolve( null );
    }

    public static void destroyNativeUIComponentAdView(final String adUnitId, final Promise promise)
    {
        AppLovinMAXAdViewUIComponent preloadedUIComponent = preloadedUIComponentInstances.get( adUnitId );
        if ( preloadedUIComponent == null )
        {
            promise.reject( new IllegalStateException( "No native UI component found to destroy" ) );
            return;
        }

        if ( preloadedUIComponent.hasContainerView() )
        {
            promise.reject( new IllegalStateException( "Cannot destroy - currently in use" ) );
            return;
        }

        preloadedUIComponentInstances.remove( adUnitId );

        preloadedUIComponent.detachAdView();
        preloadedUIComponent.destroy();

        promise.resolve( null );
    }

    public AppLovinMAXAdView(final Context context)
    {
        super( context );
        reactContext = (ReactContext) context;
    }

    public void setAdUnitId(final String value)
    {
        // Ad Unit ID must be set prior to creating MaxAdView
        if ( uiComponent != null )
        {
            AppLovinMAXModule.e( "Attempting to set Ad Unit ID " + value + " after the native UI component is created" );
            return;
        }

        adUnitId = value;
    }

    public void setAdFormat(final String value)
    {
        // Ad format must be set prior to creating MaxAdView
        if ( uiComponent != null )
        {
            AppLovinMAXModule.e( "Attempting to set ad format " + value + " after the native UI component is created" );
            return;
        }

        if ( MaxAdFormat.BANNER.getLabel().equals( value ) )
        {
            adFormat = AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactContext );
        }
        else if ( MaxAdFormat.MREC.getLabel().equals( value ) )
        {
            adFormat = MaxAdFormat.MREC;
        }
        else
        {
            AppLovinMAXModule.e( "Attempting to set an invalid ad format of \"" + value + "\" for " + adUnitId );
        }
    }

    public void setPlacement(@Nullable final String value)
    {
        placement = value;

        if ( uiComponent != null )
        {
            uiComponent.setPlacement( placement );
        }
    }

    public void setCustomData(@Nullable final String value)
    {
        customData = value;

        if ( uiComponent != null )
        {
            uiComponent.setCustomData( customData );
        }
    }

    public void setAdaptiveBannerEnabled(final boolean enabled)
    {
        adaptiveBannerEnabled = enabled;

        if ( uiComponent != null )
        {
            uiComponent.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
        }
    }

    public void setAutoRefresh(final boolean enabled)
    {
        autoRefresh = enabled;

        if ( uiComponent != null )
        {
            uiComponent.setAutoRefresh( enabled );
        }
    }

    public void setLoadOnMount(final boolean enabled)
    {
        loadOnMount = enabled;
    }

    public void setExtraParameters(@Nullable final ReadableMap readableMap)
    {
        if ( readableMap != null )
        {
            extraParameters = readableMap.toHashMap();
        }
    }

    public void setLocalExtraParameters(@Nullable final ReadableMap readableMap)
    {
        if ( readableMap != null )
        {
            localExtraParameters = readableMap.toHashMap();
        }
    }

    @Override
    public void requestLayout()
    {
        super.requestLayout();

        if ( uiComponent != null )
        {
            uiComponent.measureAndLayout( 0, 0, getWidth(), getHeight() );
        }
    }

    @Override
    protected void onDetachedFromWindow()
    {
        super.onDetachedFromWindow();

        if ( uiComponent != null )
        {
            uiComponent.setAutoRefresh( false );
        }
    }

    @Override
    protected void onAttachedToWindow()
    {
        super.onAttachedToWindow();

        if ( uiComponent != null )
        {
            uiComponent.setAutoRefresh( autoRefresh );
        }
    }

    // Invoked via ViewManager.onAfterUpdateTransaction() after all the JavaScript properties are
    // set when mounting AdView
    public void onSetProps()
    {
        maybeAttachAdView();
    }

    private void maybeAttachAdView()
    {
        // Re-assign in case of race condition
        final String adUnitId = this.adUnitId;
        final MaxAdFormat adFormat = this.adFormat;

        reactContext.runOnUiQueueThread( () -> {

            if ( AppLovinMAXModule.getInstance().getSdk() == null )
            {
                AppLovinMAXModule.logUninitializedAccessError( "AppLovinMAXAdView.maybeAttachAdView" );
                return;
            }

            if ( TextUtils.isEmpty( adUnitId ) )
            {
                AppLovinMAXModule.e( "Attempting to attach a native UI component without Ad Unit ID" );
                return;
            }

            if ( adFormat == null )
            {
                AppLovinMAXModule.e( "Attempting to attach a native UI component without ad format" );
                return;
            }

            if ( uiComponent != null )
            {
                AppLovinMAXModule.e( "Attempting to re-attach with existing native UI component: " + uiComponent.getAdView() );
                return;
            }

            AppLovinMAXModule.d( "Attaching a native UI component for " + adUnitId );

            uiComponent = preloadedUIComponentInstances.get( adUnitId );
            if ( uiComponent != null )
            {
                // Attach the preloaded uiComponent if possible, otherwise create a new one for the
                // same adUnitId
                if ( !uiComponent.hasContainerView() )
                {
                    uiComponent.setAutoRefresh( autoRefresh );
                    uiComponent.attachAdView( AppLovinMAXAdView.this );
                    return;
                }
            }

            uiComponent = new AppLovinMAXAdViewUIComponent( adUnitId, adFormat, reactContext );
            uiComponentInstances.put( adUnitId, uiComponent );

            uiComponent.setPlacement( placement );
            uiComponent.setCustomData( customData );
            uiComponent.setExtraParameters( extraParameters );
            uiComponent.setLocalExtraParameters( localExtraParameters );
            uiComponent.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
            uiComponent.setAutoRefresh( autoRefresh );

            uiComponent.attachAdView( AppLovinMAXAdView.this );

            if ( loadOnMount )
            {
                uiComponent.loadAd();
            }
        } );
    }

    public void loadAd()
    {
        if ( uiComponent == null )
        {
            AppLovinMAXModule.e( "Attempting to load uninitialized native UI component for " + adUnitId );
            return;
        }

        uiComponent.loadAd();
    }

    public void destroy()
    {
        if ( uiComponent != null )
        {
            AppLovinMAXModule.d( "Unmounting the native UI component: " + uiComponent.getAdView() );

            uiComponent.detachAdView();

            AppLovinMAXAdViewUIComponent preloadedUIComponent = preloadedUIComponentInstances.get( adUnitId );

            if ( uiComponent == preloadedUIComponent )
            {
                uiComponent.setAutoRefresh( false );
            }
            else
            {
                uiComponentInstances.remove( adUnitId );
                uiComponent.destroy();
            }
        }
    }
}
