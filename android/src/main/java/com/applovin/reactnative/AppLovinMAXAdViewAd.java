package com.applovin.reactnative;

import android.view.View;
import android.view.ViewGroup;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdRevenueListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.lang.ref.WeakReference;
import java.util.Iterator;
import java.util.Map;

import androidx.annotation.Nullable;

class AppLovinMAXAdViewAd
        implements MaxAdListener, MaxAdViewAdListener, MaxAdRevenueListener
{
    private final ReactApplicationContext context;

    private final WeakReference<AppLovinMAXAdViewAdManager> managerRef;

    private boolean autoRefresh;

    @Nullable
    private MaxAdView adView;

    public AppLovinMAXAdViewAd(final ReactApplicationContext context, final AppLovinMAXAdViewAdManager manager)
    {
        this.context = context;
        this.managerRef = new WeakReference<>( manager );
    }

    public int createAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        context.runOnUiQueueThread( () -> {

            adView = new MaxAdView( adUnitId, adFormat, AppLovinMAXModule.getInstance().getSdk(), context );
            adView.setListener( this );
            adView.setRevenueListener( this );

            adView.setExtraParameter( "adaptive_banner", "true" );

            // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
            adView.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );

            // Hide AdView until it is attached to the parent view
            adView.setVisibility( View.GONE );

            adView.stopAutoRefresh();

            adView.loadAd();

            AppLovinMAXModule.d( "Ad Unit ID " + adUnitId + " MaxAdView is created with id " + AppLovinMAXAdViewAd.this.hashCode() );
        } );

        return hashCode();
    }

    public void destroyAdView()
    {
        context.runOnUiQueueThread( () -> {

            ViewGroup parentView = (ViewGroup) adView.getParent();
            if ( parentView != null )
            {
                parentView.removeView( adView );
            }

            AppLovinMAXModule.d( "Ad Unit ID " + adView.getAdUnitId() + " MaxAdView is destroyed with id " + AppLovinMAXAdViewAd.this.hashCode() );

            adView.setListener( null );
            adView.setRevenueListener( null );
            adView.destroy();

            adView = null;
        } );
    }

    public void loadAd()
    {
        context.runOnUiQueueThread( () -> {

            adView.loadAd();
        } );
    }

    public void setPlacement(String placement)
    {
        context.runOnUiQueueThread( () -> {

            adView.setPlacement( placement );
        } );
    }

    public void setCustomData(String customData)
    {
        context.runOnUiQueueThread( () -> {

            adView.setCustomData( customData );
        } );
    }

    public void setAdaptiveBannerEnabled(boolean enabled)
    {
        context.runOnUiQueueThread( () -> {

            adView.setExtraParameter( "adaptive_banner", Boolean.toString( enabled ) );
        } );
    }

    public void setAutoRefresh(boolean autoRefresh)
    {
        this.autoRefresh = autoRefresh;

        context.runOnUiQueueThread( () -> {

            if ( adView.getVisibility() != View.VISIBLE ) return;

            if ( autoRefresh )
            {
                adView.startAutoRefresh();
            }
            else
            {
                adView.stopAutoRefresh();
            }
        } );
    }

    public void setExtraParameters(final ReadableMap extraParameters)
    {
        context.runOnUiQueueThread( () -> {

            if ( extraParameters != null )
            {
                Iterator<Map.Entry<String, Object>> iterator = extraParameters.getEntryIterator();
                while ( iterator.hasNext() )
                {
                    Map.Entry<String, Object> entry = iterator.next();
                    adView.setExtraParameter( entry.getKey(), (String) entry.getValue() );
                }
            }
        } );
    }

    public void setLocalExtraParameters(final ReadableMap localExtraParameters)
    {
        context.runOnUiQueueThread( () -> {

            if ( localExtraParameters != null )
            {
                Iterator<Map.Entry<String, Object>> iterator = localExtraParameters.getEntryIterator();
                while ( iterator.hasNext() )
                {
                    Map.Entry<String, Object> entry = iterator.next();
                    adView.setLocalExtraParameter( entry.getKey(), entry.getValue() );
                }
            }
        } );
    }

    public void attachView(ViewGroup view)
    {
        context.runOnUiQueueThread( () -> {

            adView.setVisibility( View.VISIBLE );

            if ( autoRefresh )
            {
                adView.startAutoRefresh();
            }

            view.addView( adView );
        } );
    }

    public void detachView()
    {
        context.runOnUiQueueThread( () -> {

            ViewGroup parentView = (ViewGroup) adView.getParent();
            if ( parentView != null )
            {
                parentView.removeView( adView );
            }

            adView.setVisibility( View.GONE );
            adView.stopAutoRefresh();
        } );
    }

    public void measureAndLayout(int x, int y, int width, int height)
    {
        context.runOnUiQueueThread( () -> {

            if ( adView == null ) return;

            adView.measure(
                    View.MeasureSpec.makeMeasureSpec( width, View.MeasureSpec.EXACTLY ),
                    View.MeasureSpec.makeMeasureSpec( height, View.MeasureSpec.EXACTLY )
            );

            adView.layout( x, y, width, height );
        } );
    }

    @Override
    public void onAdLoaded(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        adInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendLoadAdEvent( adInfo );
    }

    @Override
    public void onAdLoadFailed(final String adUnitId, final MaxError error)
    {
        WritableMap adLoadFailedInfo = AppLovinMAXModule.getInstance().getAdLoadFailedInfo( adUnitId, error );
        adLoadFailedInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendFailToLoadAdEvent( adLoadFailedInfo );
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, final MaxError error)
    {
        WritableMap adDisplayFailedInfo = AppLovinMAXModule.getInstance().getAdDisplayFailedInfo( ad, error );
        adDisplayFailedInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendFailToDisplayAEvent( adDisplayFailedInfo );
    }

    @Override
    public void onAdClicked(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        adInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendClickAdEvent( adInfo );
    }

    @Override
    public void onAdExpanded(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        adInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendExpandAdEvent( adInfo );
    }

    @Override
    public void onAdCollapsed(final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        adInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendCollapseAdEvent( adInfo );
    }

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        WritableMap adRevenueInfo = AppLovinMAXModule.getInstance().getAdRevenueInfo( ad );
        adRevenueInfo.putInt( "adViewAdId", hashCode() );
        managerRef.get().sendPayRevenueEvent( adRevenueInfo );
    }

    /// Deprecated Callbacks

    @Override
    public void onAdDisplayed(final MaxAd ad) { }

    @Override
    public void onAdHidden(final MaxAd ad) { }
}
