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
public class AppLovinMAXAdView
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
    private boolean             autoRefreshEnabled;
    private boolean             loadOnMount;
    @Nullable
    private Map<String, Object> extraParameters;
    @Nullable
    private Map<String, Object> localExtraParameters;

    // Returns an MaxAdView to support Amazon integrations. This method returns the first instance
    // that matches the Ad Unit ID, consistent with the behavior introduced when this feature was
    // first implemented.
    @Nullable
    public static MaxAdView getInstance(final String adUnitId)
    {
        for ( Map.Entry<Integer, AppLovinMAXAdViewUiComponent> entry : preloadedUiComponentInstances.entrySet() )
        {
            if ( entry.getValue().getAdUnitId().equals ( adUnitId ) )
            {
                return entry.getValue().getAdView();
            }
        }

        for ( Map.Entry<Integer, AppLovinMAXAdViewUiComponent> entry : uiComponentInstances.entrySet() )
        {
            if ( entry.getValue().getAdUnitId().equals( adUnitId ) )
            {
                return entry.getValue().getAdView();
            }
        }

        return null;
    }

    public static boolean hasPreloadedAdView(final int adViewId)
    {
        return preloadedUiComponentInstances.get( adViewId ) != null;
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
        preloadedUiComponentInstances.put( preloadedUiComponent.hashCode(), preloadedUiComponent );

        preloadedUiComponent.setPlacement( placement );
        preloadedUiComponent.setCustomData( customData );
        preloadedUiComponent.setExtraParameters( extraParameters );
        preloadedUiComponent.setLocalExtraParameters( localExtraParameters );

        preloadedUiComponent.loadAd();

        promise.resolve( preloadedUiComponent.hashCode() );
    }

    public static void destroyNativeUIComponentAdView(final int adViewId, final Promise promise)
    {
        AppLovinMAXAdViewUiComponent preloadedUiComponent = preloadedUiComponentInstances.get( adViewId );

        if ( preloadedUiComponent == null )
        {
            promise.reject( new IllegalStateException( "No preloaded AdView found to destroy" ) );
            return;
        }

        if ( preloadedUiComponent.hasContainerView() )
        {
            promise.reject( new IllegalStateException( "Cannot destroy - the preloaded AdView is currently in use" ) );
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
            AppLovinMAXModuleImpl.e( "Attempting to set Ad Unit ID " + value + " after the native UI component is created" );
            return;
        }

        adUnitId = value;
    }

    public void setAdFormat(final String value)
    {
        // Ad format must be set prior to creating MaxAdView
        if ( uiComponent != null )
        {
            AppLovinMAXModuleImpl.e( "Attempting to set ad format " + value + " after the native UI component is created" );
            return;
        }

        if ( MaxAdFormat.BANNER.getLabel().equals( value ) )
        {
            adFormat = AppLovinMAXModuleImpl.getDeviceSpecificBannerAdViewAdFormat( reactContext );
        }
        else if ( MaxAdFormat.MREC.getLabel().equals( value ) )
        {
            adFormat = MaxAdFormat.MREC;
        }
        else
        {
            AppLovinMAXModuleImpl.e( "Attempting to set an invalid ad format of \"" + value + "\" for " + adUnitId );
        }
    }

    public void setAdViewId(final int value)
    {
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

    public void setAutoRefreshEnabled(final boolean enabled)
    {
        autoRefreshEnabled = enabled;

        if ( uiComponent != null )
        {
            uiComponent.setAutoRefreshEnabled( enabled );
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
            uiComponent.setAutoRefreshEnabled( false );
        }
    }

    @Override
    protected void onAttachedToWindow()
    {
        super.onAttachedToWindow();

        if ( uiComponent != null )
        {
            uiComponent.setAutoRefreshEnabled( autoRefreshEnabled );
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

            if ( AppLovinMAXModuleImpl.getInstance().getSdk() == null )
            {
                AppLovinMAXModuleImpl.logUninitializedAccessError( "AppLovinMAXAdView.maybeAttachAdView" );
                return;
            }

            if ( TextUtils.isEmpty( adUnitId ) )
            {
                AppLovinMAXModuleImpl.e( "Attempting to attach a native UI component without Ad Unit ID" );
                return;
            }

            if ( adFormat == null )
            {
                AppLovinMAXModuleImpl.e( "Attempting to attach a native UI component without ad format" );
                return;
            }

            if ( uiComponent != null )
            {
                AppLovinMAXModuleImpl.e( "Attempting to re-attach with existing AdView (" + uiComponent.hashCode() + ") for Ad Unit ID " + adUnitId );
                return;
            }

            uiComponent = preloadedUiComponentInstances.get( adViewId );
            if ( uiComponent != null )
            {
                // Attach the preloaded uiComponent if possible, otherwise create a new one for the same adUnitId
                if ( !( uiComponent.hasContainerView() || uiComponent.isAdViewAttached() ) )
                {
                    AppLovinMAXModuleImpl.d( "Mounting the preloaded AdView (" + adViewId + ") for Ad Unit ID " + adUnitId );

                    uiComponent.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
                    uiComponent.setAutoRefreshEnabled( autoRefreshEnabled );
                    uiComponent.attachAdView( AppLovinMAXAdView.this );
                    return;
                }
            }

            uiComponent = new AppLovinMAXAdViewUiComponent( adUnitId, adFormat, reactContext );
            adViewId = uiComponent.hashCode();
            uiComponentInstances.put( adViewId, uiComponent );

            AppLovinMAXModuleImpl.d( "Mounting a new AdView (" + adViewId + ") for Ad Unit ID " + adUnitId );

            uiComponent.setPlacement( placement );
            uiComponent.setCustomData( customData );
            uiComponent.setExtraParameters( extraParameters );
            uiComponent.setLocalExtraParameters( localExtraParameters );
            uiComponent.setAdaptiveBannerEnabled( adaptiveBannerEnabled );
            uiComponent.setAutoRefreshEnabled( autoRefreshEnabled );

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
            AppLovinMAXModuleImpl.e( "Attempting to load uninitialized native UI component for " + adUnitId );
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
                AppLovinMAXModuleImpl.d( "Unmounting the preloaded AdView (" + adViewId + ") for Ad Unit ID " + adUnitId );

                uiComponent.setAutoRefreshEnabled( false );
            }
            else
            {
                AppLovinMAXModuleImpl.d( "Unmounting the AdView (" + adViewId + ") to destroy for Ad Unit ID " + adUnitId );

                uiComponentInstances.remove( adViewId );
                uiComponent.destroy();
            }
        }
    }
}
