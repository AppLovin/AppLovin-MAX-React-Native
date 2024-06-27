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
    private static final Map<String, AppLovinMAXAdViewUIComponent> uiComponentInstances = new HashMap<>( 2 );

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
    private boolean             deleteNativeUIComponent;
    @Nullable
    private Map<String, Object> extraParameters;
    @Nullable
    private Map<String, Object> localExtraParameters;

    public static MaxAdView getInstance(final String adUnitId)
    {
        AppLovinMAXAdViewUIComponent uiComponent = uiComponentInstances.get( adUnitId );
        return ( uiComponent != null ) ? uiComponent.getAdView() : null;
    }

    public static void preloadNativeUIComponentAdView(final String adUnitId, final MaxAdFormat adFormat, final String placement, final String customData, final Map<String, Object> extraParameters, final Map<String, Object> localExtraParameters, final Promise promise, final ReactContext context)
    {
        AppLovinMAXAdViewUIComponent preloadedUIComponent = uiComponentInstances.get( adUnitId );
        if ( preloadedUIComponent != null )
        {
            promise.reject( new IllegalStateException( "Cannot preload more than one for a single Ad Unit ID" ) );
            return;
        }

        preloadedUIComponent = new AppLovinMAXAdViewUIComponent( adUnitId, adFormat, context );
        uiComponentInstances.put( adUnitId, preloadedUIComponent );

        preloadedUIComponent.setPromise( promise );
        preloadedUIComponent.setPlacement( placement );
        preloadedUIComponent.setCustomData( customData );
        preloadedUIComponent.setExtraParameters( extraParameters );
        preloadedUIComponent.setLocalExtraParameters( localExtraParameters );
        // Disable autoRefresh in the beginning until it is mounted
        preloadedUIComponent.setAutoRefresh( false );

        preloadedUIComponent.loadAd();
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
            AppLovinMAXModule.e( "Attempting to set Ad Unit ID " + value + " after MaxAdView is created" );
            return;
        }

        adUnitId = value;
    }

    public void setAdFormat(final String value)
    {
        // Ad format must be set prior to creating MaxAdView
        if ( uiComponent != null )
        {
            AppLovinMAXModule.e( "Attempting to set ad format " + value + " after MaxAdView is created" );
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

    public void setDeleteNativeUIComponent(final boolean enabled)
    {
        deleteNativeUIComponent = enabled;
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
        reactContext.runOnUiQueueThread( this::maybeAttachAdView );
    }

    private void maybeAttachAdView()
    {
        if ( AppLovinMAXModule.getInstance().getSdk() == null )
        {
            AppLovinMAXModule.logUninitializedAccessError( "AppLovinMAXAdView.maybeAttachAdView" );
            return;
        }

        if ( TextUtils.isEmpty( adUnitId ) )
        {
            AppLovinMAXModule.e( "Attempting to attach MaxAdView without Ad Unit ID" );
            return;
        }

        if ( adFormat == null )
        {
            AppLovinMAXModule.e( "Attempting to attach MaxAdView without ad format" );
            return;
        }

        if ( uiComponent != null )
        {
            AppLovinMAXModule.e( "Attempting to re-attach with existing MaxAdView: " + uiComponent.getAdView() );
            return;
        }

        uiComponent = uiComponentInstances.get( adUnitId );

        if ( uiComponent != null )
        {
            // Attach if uiComponent is available, otherwise create a new uiComponent that won't be
            // cached for later use.
            if ( !uiComponent.isAttached() )
            {
                uiComponent.setAutoRefresh( autoRefresh );
                uiComponent.attachAdView( this );
                return;
            }
        }

        uiComponent = new AppLovinMAXAdViewUIComponent( adUnitId, adFormat, reactContext );
        uiComponent.setPlacement( placement );
        uiComponent.setCustomData( customData );
        uiComponent.setExtraParameters( extraParameters );
        uiComponent.setLocalExtraParameters( localExtraParameters );
        uiComponent.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
        uiComponent.setAutoRefresh( autoRefresh );

        uiComponent.attachAdView( this );

        if ( loadOnMount )
        {
            uiComponent.loadAd();
        }
    }

    public void loadAd()
    {
        if ( uiComponent == null )
        {
            AppLovinMAXModule.e( "Attempting to load uninitialized MaxAdView for " + adUnitId );
            return;
        }

        uiComponent.loadAd();
    }

    public void destroy()
    {
        if ( uiComponent != null )
        {
            AppLovinMAXModule.d( "Unmounting MaxAdView: " + uiComponent.getAdView() );

            uiComponent.detachAdView();

            AppLovinMAXAdViewUIComponent preloadedUIComponent = uiComponentInstances.get( adUnitId );

            if ( uiComponent == preloadedUIComponent )
            {
                if ( deleteNativeUIComponent )
                {
                    uiComponentInstances.remove( adUnitId );
                    uiComponent.destroy();
                }
                else
                {
                    uiComponent.setAutoRefresh( false );
                }
            }
            else
            {
                uiComponent.destroy();
            }
        }
    }
}
