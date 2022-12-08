package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.concurrent.atomic.AtomicBoolean;

import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 27 2020
 */
class AppLovinMAXAdView
        extends ReactViewGroup
        implements MaxAdListener, MaxAdViewAdListener
{
    private final ThemedReactContext reactContext;

    private @Nullable MaxAdView adView;

    private           String      adUnitId;
    private           MaxAdFormat adFormat;
    private @Nullable String      placement;
    private @Nullable String      customData;
    private           boolean     adaptiveBannerEnabled;
    private           boolean     autoRefresh;

    private final AtomicBoolean shouldAdViewAttach = new AtomicBoolean();

    public AppLovinMAXAdView(final Context context)
    {
        super( context );
        this.reactContext = (ThemedReactContext) context;
    }

    public void setAdUnitId(final String value)
    {
        // Ad Unit ID must be set prior to creating MaxAdView
        if ( adView != null )
        {
            AppLovinMAXModule.e( "Attempting to set Ad Unit ID " + value + " after MaxAdView is created" );
            return;
        }

        adUnitId = value;

        shouldAdViewAttach.set( true );
    }

    public void setAdFormat(final String value)
    {
        // Ad format must be set prior to creating MaxAdView
        if ( adView != null )
        {
            AppLovinMAXModule.e( "Attempting to set ad format " + value + " after MaxAdView is created" );
            return;
        }

        if ( "banner".equals( value ) )
        {
            adFormat = AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactContext );
        }
        else if ( "mrec".equals( value ) )
        {
            adFormat = MaxAdFormat.MREC;
        }
        else
        {
            AppLovinMAXModule.e( "Attempting to set an invalid ad format of \"" + value + "\" for " + adUnitId );
            return;
        }

        shouldAdViewAttach.set( true );
    }

    public void setPlacement(@Nullable final String value)
    {
        placement = value;

        if ( adView != null )
        {
            adView.setPlacement( placement );
        }
    }

    public void setCustomData(@Nullable final String value)
    {
        customData = value;

        if ( adView != null )
        {
            adView.setCustomData( customData );
        }
    }

    public void setAdaptiveBannerEnabled(final boolean enabled)
    {
        adaptiveBannerEnabled = enabled;

        if ( adView != null )
        {
            adView.setExtraParameter( "adaptive_banner", Boolean.toString( enabled ) );
        }
    }

    public void setAutoRefresh(final boolean enabled)
    {
        autoRefresh = enabled;

        if ( adView != null )
        {
            if ( autoRefresh )
            {
                adView.startAutoRefresh();
            }
            else
            {
                adView.stopAutoRefresh();
            }
        }
    }

    // Called after all properties are set to the widget during its creation, but after the widget
    // is created, this is called either when each property is updated or when a bulk of properties
    // are updated.
    public void onSetProps()
    {
        if ( adUnitId != null && adFormat != null && shouldAdViewAttach.compareAndSet( true, false ) )
        {
            maybeAttachAdView();
        }
    }

    @Override
    public void requestLayout()
    {
        super.requestLayout();

        // https://stackoverflow.com/a/39838774/5477988
        // This is required to ensure ad refreshes render correctly in RN Android due to known issue where `getWidth()` and `getHeight()` return 0 on attach
        if ( adView != null )
        {
            int currentWidthPx = getWidth();
            int currentHeightPx = getHeight();

            adView.measure(
                    MeasureSpec.makeMeasureSpec( currentWidthPx, MeasureSpec.EXACTLY ),
                    MeasureSpec.makeMeasureSpec( currentHeightPx, MeasureSpec.EXACTLY )
            );
            adView.layout( 0, 0, currentWidthPx, currentHeightPx );
        }
    }

    @Override
    protected void onDetachedFromWindow()
    {
        super.onDetachedFromWindow();

        if ( adView != null )
        {
            adView.stopAutoRefresh();
        }
    }

    @Override
    protected void onAttachedToWindow()
    {
        super.onAttachedToWindow();

        if ( adView != null )
        {
            adView.startAutoRefresh();
        }
    }

    private void maybeAttachAdView()
    {
        final Activity currentActivity = reactContext.getCurrentActivity();
        if ( currentActivity == null )
        {
            AppLovinMAXModule.e( "Unable to attach AdView - no current Activity found" );
            return;
        }

        // Re-assign in case of race condition
        final String adUnitId = this.adUnitId;
        final MaxAdFormat adFormat = this.adFormat;

        reactContext.runOnUiQueueThread( () -> {
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

            if ( adView != null )
            {
                AppLovinMAXModule.e( "Attempting to re-attach with existing MaxAdView: " + adView );
                return;
            }

            AppLovinMAXModule.d( "Attaching MaxAdView for " + adUnitId );

            adView = new MaxAdView( adUnitId, adFormat, AppLovinMAXModule.getInstance().getSdk(), currentActivity );
            adView.setListener( AppLovinMAXAdView.this );
            adView.setRevenueListener( AppLovinMAXModule.getInstance() );
            adView.setPlacement( placement );
            adView.setCustomData( customData );
            adView.setExtraParameter( "adaptive_banner", Boolean.toString( adaptiveBannerEnabled ) );
            // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
            adView.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );

            if ( autoRefresh )
            {
                adView.startAutoRefresh();
            }
            else
            {
                adView.stopAutoRefresh();
            }

            adView.loadAd();

            addView( adView );
        } );
    }

    public void destroy()
    {
        if ( adView != null )
        {
            AppLovinMAXModule.d( "Unmounting MaxAdView: " + adView );

            removeView( adView );

            adView.setListener( null );
            adView.setRevenueListener( null );
            adView.destroy();

            adView = null;
        }
    }

    @Override
    public void onAdLoaded(final MaxAd ad)
    {
        AppLovinMAXModule.getInstance().onAdLoaded( ad );
    }

    @Override
    public void onAdLoadFailed(final String adUnitId, final MaxError error)
    {
        String name = ( adFormat == MaxAdFormat.MREC ) ? "OnMRecAdLoadFailedEvent" : "OnBannerAdLoadFailedEvent";
        
        AppLovinMAXModule.getInstance().sendReactNativeEventForAdLoadFailed( name, adUnitId, error );
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, final MaxError error)
    {
        AppLovinMAXModule.getInstance().onAdDisplayFailed( ad, error );
    }

    @Override
    public void onAdClicked(final MaxAd ad)
    {
        AppLovinMAXModule.getInstance().onAdClicked( ad );
    }

    @Override
    public void onAdExpanded(final MaxAd ad)
    {
        AppLovinMAXModule.getInstance().onAdExpanded( ad );
    }

    @Override
    public void onAdCollapsed(final MaxAd ad)
    {
        AppLovinMAXModule.getInstance().onAdCollapsed( ad );
    }

    /// Deprecated Callbacks

    @Override
    public void onAdDisplayed(final MaxAd ad) { }

    @Override
    public void onAdHidden(final MaxAd ad) { }
}
