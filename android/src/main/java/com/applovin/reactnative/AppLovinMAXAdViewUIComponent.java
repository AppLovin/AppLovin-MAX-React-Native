package com.applovin.reactnative;

import android.view.View;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdRevenueListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import androidx.annotation.Nullable;

class AppLovinMAXAdViewUIComponent
    implements MaxAdListener, MaxAdViewAdListener, MaxAdRevenueListener
{
    private final ReactContext reactContext;
    private final MaxAdView    adView;

    @Nullable
    private AppLovinMAXAdView containerReactView;
    @Nullable
    private Promise           promiseCallback;

    public AppLovinMAXAdViewUIComponent(final String adUnitId, final MaxAdFormat adFormat, final ReactContext context)
    {
        reactContext = context;

        adView = new MaxAdView( adUnitId, adFormat, AppLovinMAXModule.getInstance().getSdk(), context );
        adView.setListener( this );
        adView.setRevenueListener( this );

        adView.setExtraParameter( "adaptive_banner", "true" );

        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        adView.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );
    }

    public void setPromise(Promise promise)
    {
        this.promiseCallback = promise;
    }

    public MaxAdView getAdView()
    {
        return adView;
    }

    public boolean isAdViewAttached()
    {
        return containerReactView != null;
    }

    public void setPlacement(@Nullable final String value)
    {
        adView.setPlacement( value );
    }

    public void setCustomData(@Nullable final String value)
    {
        adView.setCustomData( value );
    }

    public void setAdaptiveBannerEnabled(final boolean enabled)
    {
        adView.setExtraParameter( "adaptive_banner", Boolean.toString( enabled ) );
    }

    public void setAutoRefresh(final boolean enabled)
    {
        if ( enabled )
        {
            adView.startAutoRefresh();
        }
        else
        {
            adView.stopAutoRefresh();
        }
    }

    public void setExtraParameters(@Nullable final Map<String, Object> extraParameters)
    {
        if ( extraParameters == null ) return;

        for ( Map.Entry<String, Object> entry : extraParameters.entrySet() )
        {
            adView.setExtraParameter( entry.getKey(), (String) entry.getValue() );
        }
    }

    public void setLocalExtraParameters(@Nullable final Map<String, Object> localExtraParameters)
    {
        if ( localExtraParameters == null ) return;

        for ( Map.Entry<String, Object> entry : localExtraParameters.entrySet() )
        {
            adView.setLocalExtraParameter( entry.getKey(), entry.getValue() );
        }
    }

    public void attachAdView(AppLovinMAXAdView view)
    {
        containerReactView = view;
        containerReactView.addView( adView );
    }

    public void detachAdView()
    {
        if ( containerReactView != null )
        {
            containerReactView.removeView( adView );
            containerReactView = null;
        }
    }

    public void loadAd()
    {
        adView.loadAd();
    }

    public void destroy()
    {
        detachAdView();

        adView.setListener( null );
        adView.setRevenueListener( null );
        adView.destroy();
    }

    public void measureAndLayout(int x, int y, int width, int height)
    {
        // https://stackoverflow.com/a/39838774/5477988
        // This is required to ensure ad refreshes render correctly in RN Android due to known issue where `getWidth()` and `getHeight()` return 0 on attach
        adView.measure(
            View.MeasureSpec.makeMeasureSpec( width, View.MeasureSpec.EXACTLY ),
            View.MeasureSpec.makeMeasureSpec( height, View.MeasureSpec.EXACTLY )
        );

        adView.layout( x, y, width, height );
    }

    @Override
    public void onAdLoaded(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );

        if ( promiseCallback != null )
        {
            promiseCallback.resolve( adInfo );
            promiseCallback = null;
        }

        if ( containerReactView != null )
        {
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdLoadedEvent", adInfo );
        }
    }

    @Override
    public void onAdLoadFailed(final String adUnitId, final MaxError error)
    {
        WritableMap adLoadFailedInfo = AppLovinMAXModule.getInstance().getAdLoadFailedInfo( adUnitId, error );

        if ( promiseCallback != null )
        {
            promiseCallback.resolve( adLoadFailedInfo );
            promiseCallback = null;
        }

        if ( containerReactView != null )
        {
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdLoadFailedEvent", adLoadFailedInfo );
        }
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, final MaxError error)
    {
        if ( containerReactView != null )
        {
            WritableMap adDisplayFailedInfo = AppLovinMAXModule.getInstance().getAdDisplayFailedInfo( ad, error );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdDisplayFailedEvent", adDisplayFailedInfo );
        }
    }

    @Override
    public void onAdClicked(final MaxAd ad)
    {
        if ( containerReactView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdClickedEvent", adInfo );
        }
    }

    @Override
    public void onAdExpanded(final MaxAd ad)
    {
        if ( containerReactView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdExpandedEvent", adInfo );
        }
    }

    @Override
    public void onAdCollapsed(final MaxAd ad)
    {
        if ( containerReactView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdCollapsedEvent", adInfo );
        }
    }

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        if ( containerReactView != null )
        {
            WritableMap adRevenueInfo = AppLovinMAXModule.getInstance().getAdRevenueInfo( ad );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerReactView.getId(), "onAdRevenuePaidEvent", adRevenueInfo );
        }
    }

    /// Deprecated Callbacks

    @Override
    public void onAdDisplayed(final MaxAd ad) { }

    @Override
    public void onAdHidden(final MaxAd ad) { }
}
