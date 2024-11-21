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
    private static final Map<Integer, AppLovinMAXAdViewUiComponent> uiComponentInstances          = new HashMap<>( 2 );
    private static final Map<Integer, AppLovinMAXAdViewUiComponent> preloadedUiComponentInstances = new HashMap<>( 2 );

    private final ReactContext reactContext;

    @Nullable
    private AppLovinMAXAdViewUiComponent uiComponent;

    private String              adUnitId;
    private MaxAdFormat         adFormat;
    private int                 adViewId;
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
        for ( Map.Entry<Integer, AppLovinMAXAdViewUiComponent> entry : preloadedUiComponentInstances.entrySet() )
        {
            if ( adUnitId.equals( entry.getValue().getAdView().getAdUnitId() ) )
            {
                return entry.getValue().getAdView();
            }
        }

        for ( Map.Entry<Integer, AppLovinMAXAdViewUiComponent> entry : uiComponentInstances.entrySet() )
        {
            if ( adUnitId.equals( entry.getValue().getAdView().getAdUnitId() ) )
            {
                return entry.getValue().getAdView();
            }
        }

        return null;
    }

    public static boolean isNativeUIComponentPreloaded(final int adViewId)
    {
        return preloadedUiComponentInstances.containsKey( adViewId );
    }

    public static void preloadNativeUIComponentAdView(final String adUnitId,
                                                      final MaxAdFormat adFormat,
                                                      @Nullable final String placement,
                                                      @Nullable final String customData,
                                                      @Nullable final Map<String, Object> extraParameters,
                                                      @Nullable final Map<String, Object> localExtraParameters,
                                                      final Promise promise,
                                                      final ReactContext context)
    {
        AppLovinMAXAdViewUiComponent preloadedUiComponent = new AppLovinMAXAdViewUiComponent( adUnitId, adFormat, context );
        preloadedUiComponentInstances.put( preloadedUiComponent.getAdView().hashCode(), preloadedUiComponent );

        preloadedUiComponent.setPlacement( placement );
        preloadedUiComponent.setCustomData( customData );
        preloadedUiComponent.setExtraParameters( extraParameters );
        preloadedUiComponent.setLocalExtraParameters( localExtraParameters );

        preloadedUiComponent.loadAd();

        promise.resolve( preloadedUiComponent.getAdView().hashCode() );
    }

    public static void destroyNativeUIComponentAdView(final int adViewId, final Promise promise)
    {
        AppLovinMAXAdViewUiComponent preloadedUiComponent = preloadedUiComponentInstances.get( adViewId );

        if ( preloadedUiComponent == null )
        {
            promise.reject( new IllegalStateException( "No native UI component found to destroy" ) );
            return;
        }

        if ( preloadedUiComponent.hasContainerView() )
        {
            promise.reject( new IllegalStateException( "Cannot destroy - currently in use" ) );
            return;
        }

        preloadedUiComponentInstances.remove( adViewId );

        preloadedUiComponent.detachAdView();
        preloadedUiComponent.destroy();

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

    public void setAdViewId(final int value)
    {
        if ( uiComponent != null )
        {
            AppLovinMAXModule.e( "Attempting to set an AdView ID with " + value + " after the native UI component is created" );
            return;
        }

        adViewId = value;
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

            uiComponent = preloadedUiComponentInstances.get( adViewId );
            if ( uiComponent != null )
            {
                // Attach the preloaded uiComponent if possible, otherwise create a new one for the
                // same adUnitId
                if ( !( uiComponent.hasContainerView() || uiComponent.isAdViewAttached() ) )
                {
                    AppLovinMAXModule.d( "Mounting the preloaded native UI component for " + adUnitId + " using AdView " + adViewId );

                    uiComponent.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
                    uiComponent.setAutoRefresh( autoRefresh );
                    uiComponent.attachAdView( AppLovinMAXAdView.this );
                    return;
                }
            }

            uiComponent = new AppLovinMAXAdViewUiComponent( adUnitId, adFormat, reactContext );
            adViewId = uiComponent.getAdView().hashCode();
            uiComponentInstances.put( adViewId, uiComponent );

            AppLovinMAXModule.d( "Mounting a new native UI component for " + adUnitId + " using AdView " + adViewId );

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
            uiComponent.detachAdView();

            AppLovinMAXAdViewUiComponent preloadedUiComponent = preloadedUiComponentInstances.get( adViewId );

            if ( uiComponent == preloadedUiComponent )
            {
                AppLovinMAXModule.d( "Unmounting the preloaded native UI component for " + adUnitId + " using AdView " + adViewId );

                uiComponent.setAutoRefresh( false );
            }
            else
            {
                AppLovinMAXModule.d( "Unmounting the native UI component to destroy for " + adUnitId + " using AdView " + adViewId );

                uiComponentInstances.remove( adViewId );
                uiComponent.destroy();
            }
        }
    }
}
