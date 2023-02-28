package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdRevenueListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 27 2020
 */
class AppLovinMAXAdView
        extends ReactViewGroup
        implements MaxAdListener, MaxAdViewAdListener, MaxAdRevenueListener
{
    private final ThemedReactContext reactContext;

    private @Nullable MaxAdView adView;

    private           String      adUnitId;
    private           MaxAdFormat adFormat;
    private @Nullable String      placement;
    private @Nullable String      customData;
    private           boolean     adaptiveBannerEnabled;
    private           boolean     autoRefresh;

    public AppLovinMAXAdView(final Context context)
    {
        super( context );
        reactContext = (ThemedReactContext) context;
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

        maybeAttachAdView();
    }

    public void setAdFormat(final String value)
    {
        // Ad format must be set prior to creating MaxAdView
        if ( adView != null )
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
            return;
        }

        maybeAttachAdView();
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

        // Run after 0.25 sec delay to allow all properties to set
        postDelayed( () -> {

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
            adView.setListener( this );
            adView.setRevenueListener( this );
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
        }, 250 );
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
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdLoadedEvent", adInfo );
    }

    @Override
    public void onAdLoadFailed(final String adUnitId, final MaxError error)
    {
        WritableMap adLoadFailedInfo = AppLovinMAXModule.getInstance().getAdLoadFailedInfo( adUnitId, error );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdLoadFailedEvent", adLoadFailedInfo );
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, final MaxError error)
    {
        WritableMap adDisplayFailedInfo = AppLovinMAXModule.getInstance().getAdDisplayFailedInfo( ad, error );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdDisplayFailedEvent", adDisplayFailedInfo );
    }

    @Override
    public void onAdClicked(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdClickedEvent", adInfo );
    }

    @Override
    public void onAdExpanded(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdExpandedEvent", adInfo );
    }

    @Override
    public void onAdCollapsed(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdCollapsedEvent", adInfo );
    }

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        WritableMap adRevenueInfo = AppLovinMAXModule.getInstance().getAdRevenueInfo( ad );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdRevenuePaidEvent", adRevenueInfo );
    }

    /// Deprecated Callbacks

    @Override
    public void onAdDisplayed(final MaxAd ad) { }

    @Override
    public void onAdHidden(final MaxAd ad) { }
}
