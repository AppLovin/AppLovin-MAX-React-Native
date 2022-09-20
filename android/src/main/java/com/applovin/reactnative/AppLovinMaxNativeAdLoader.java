package com.applovin.reactnative;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.nativeAds.MaxNativeAdListener;
import com.applovin.mediation.nativeAds.MaxNativeAdLoader;
import com.applovin.mediation.nativeAds.MaxNativeAdView;

import java.util.Map;

import androidx.annotation.Nullable;

class AppLovinMaxNativeAdLoader
{
    @Nullable
    private MaxNativeAdLoader nativeAdLoader;
    @Nullable
    private MaxNativeAdView   nativeAdView;

    public void destroy()
    {
        destroyNativeAdView();

        // nativeAdLoader can be null when the native ad view is quickly unmounted before a native
        // ad is loaded.
        if ( nativeAdLoader == null )
        {
            AppLovinMAXModule.d( "nativeAdLoader not found to destroy: " + this );
            return;
        }

        nativeAdLoader.setRevenueListener( null );
        nativeAdLoader.setNativeAdListener( null );
        nativeAdLoader.destroy();
        nativeAdLoader = null;
    }

    public void load(final String adUnitId,
                     @Nullable final String placement,
                     @Nullable final String customData,
                     @Nullable final Map<String, Object> extraParameter,
                     final Context context,
                     final AppLovinMAXNativeAdView reactView)
    {
        if ( nativeAdLoader == null )
        {
            nativeAdLoader = new MaxNativeAdLoader( adUnitId, AppLovinMAXModule.getInstance().getSdk(), context );
            nativeAdLoader.setRevenueListener( AppLovinMAXModule.getInstance() );
            nativeAdLoader.setNativeAdListener( new NativeAdListener( reactView ) );
        }

        nativeAdLoader.setPlacement( placement );
        nativeAdLoader.setCustomData( customData );
        if ( extraParameter != null )
        {
            for ( Map.Entry<String, Object> entry : extraParameter.entrySet() )
            {
                Object value = entry.getValue();
                if ( value instanceof String )
                {
                    nativeAdLoader.setExtraParameter( entry.getKey(), (String) value );
                }
            }
        }

        nativeAdLoader.loadAd();
    }

    class NativeAdListener
            extends MaxNativeAdListener
    {
        final AppLovinMAXNativeAdView reactView;

        NativeAdListener(final AppLovinMAXNativeAdView reactView)
        {
            this.reactView = reactView;
        }

        @Override
        public void onNativeAdLoaded(@Nullable final MaxNativeAdView nativeAdView, final MaxAd ad)
        {
            destroyNativeAdView();

            AppLovinMaxNativeAdLoader.this.nativeAdView = nativeAdView;

            reactView.onNativeAdLoaded( ad );
        }

        @Override
        public void onNativeAdLoadFailed(final String adUnitId, final MaxError error)
        {
            reactView.onNativeAdLoadFailed( error );
        }

        @Override
        public void onNativeAdClicked(final MaxAd ad)
        {
            // Inform the app
            AppLovinMAXModule.getInstance().onAdClicked( ad );
        }
    }

    public void performCallToAction()
    {
        if ( nativeAdView == null )
        {
            AppLovinMAXModule.e( "Attempting to generate a CTA event without a native ad view: " + this );
            return;
        }

        Button button = nativeAdView.getCallToActionButton();
        if ( button == null )
        {
            AppLovinMAXModule.e( "callToActionButton is not found in MaxNativeAdView: " + nativeAdView );
            return;
        }

        button.performClick();
    }

    public void addNativeAdView(final ViewGroup parent)
    {
        if ( nativeAdView == null )
        {
            AppLovinMAXModule.e( "Attempting to add a non-existing native ad view: " + this );
            return;
        }

        nativeAdView.setVisibility( View.GONE );

        parent.addView( nativeAdView );
    }

    public void destroyAd(final MaxAd ad)
    {
        if ( nativeAdLoader == null )
        {
            AppLovinMAXModule.e( "Attempting to destroy a MaxAd ad without nativeAdLoader: " + this );
            return;
        }

        nativeAdLoader.destroy( ad );
    }

    private void destroyNativeAdView()
    {
        if ( nativeAdView != null )
        {
            ViewGroup view = (ViewGroup) nativeAdView.getParent();
            if ( view != null )
            {
                view.removeView( nativeAdView );
            }

            nativeAdView.recycle();
            nativeAdView = null;
        }
    }
}
