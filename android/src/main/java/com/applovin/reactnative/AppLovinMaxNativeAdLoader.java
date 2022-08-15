package com.applovin.reactnative;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Build;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.nativeAds.MaxNativeAdListener;
import com.applovin.mediation.nativeAds.MaxNativeAdLoader;
import com.applovin.mediation.nativeAds.MaxNativeAdView;
import com.applovin.mediation.nativeAds.MaxNativeAdViewBinder;

import java.util.Map;
import java.util.Random;

import androidx.annotation.Nullable;

class AppLovinMaxNativeAdLoader
{
    interface NativeAdLoaderListener
    {
        void onNativeAdLoaded(final MaxAd ad);

        void onNativeAdLoadFailed(final String adUnitId, final MaxError error);

        void onNativeAdClicked(final MaxAd ad);
    }

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

    public void load(final String adUnitId, @Nullable final String placement, @Nullable final String customData, @Nullable final Map<String, Object> extraParameter, final Context context, final NativeAdLoaderListener nativeAdLoaderListener)
    {
        if ( nativeAdLoader == null )
        {
            nativeAdLoader = new MaxNativeAdLoader( adUnitId, AppLovinMAXModule.getInstance().getSdk(), context );
            nativeAdLoader.setRevenueListener( AppLovinMAXModule.getInstance() );
            nativeAdLoader.setNativeAdListener( new NativeAdListener( nativeAdLoaderListener ) );
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

        nativeAdLoader.loadAd( createNativeAdView( context ) );
    }

    class NativeAdListener
            extends MaxNativeAdListener
    {
        final NativeAdLoaderListener nativeAdLoaderListener;

        NativeAdListener(final NativeAdLoaderListener nativeAdLoaderListener)
        {
            this.nativeAdLoaderListener = nativeAdLoaderListener;
        }

        @Override
        public void onNativeAdLoaded(@Nullable final MaxNativeAdView nativeAdView, final MaxAd ad)
        {
            destroyNativeAdView();

            AppLovinMaxNativeAdLoader.this.nativeAdView = nativeAdView;

            nativeAdLoaderListener.onNativeAdLoaded( ad );
        }

        @Override
        public void onNativeAdLoadFailed(final String adUnitId, final MaxError error)
        {
            nativeAdLoaderListener.onNativeAdLoadFailed( adUnitId, error );
        }

        @Override
        public void onNativeAdClicked(final MaxAd ad)
        {
            nativeAdLoaderListener.onNativeAdClicked( ad );
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
        if ( button != null )
        {
            button.performClick();
        }
        else
        {
            AppLovinMAXModule.e( "callToActionButton is not found in MaxNativeAdView: " + nativeAdView );
        }
    }

    public void addNativeAdView(final ViewGroup parent)
    {
        if ( nativeAdView == null )
        {
            AppLovinMAXModule.e( "Attempting to add a non-existing native ad view: " + this );
            return;
        }

        parent.addView( nativeAdView );
    }

    public void destroyAd(final MaxAd ad)
    {
        if ( nativeAdLoader != null )
        {
            nativeAdLoader.destroy( ad );
        }
        else
        {
            AppLovinMAXModule.e( "Attempting to destroy a MaxAd ad without nativeAdLoader: " + this );
        }
    }

    // Creates a MaxNativeAdView native ad view that won't be visible but used to generate a button
    // event and a revenue event
    @SuppressLint("ResourceType")
    private MaxNativeAdView createNativeAdView(final Context context)
    {
        FrameLayout frameLayout = new FrameLayout( context );
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER_HORIZONTAL | Gravity.CENTER_VERTICAL );
        frameLayout.setLayoutParams( layoutParams );
        frameLayout.setVisibility( View.GONE );

        Button callActionButton = new Button( context );
        if ( Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1 )
        {
            callActionButton.setId( View.generateViewId() );
        }
        else
        {
            Random rand = new Random();
            int min = 10000;
            int max = 100000;
            int randomId = rand.nextInt( ( max - min ) + 1 ) + min;
            callActionButton.setId( randomId );
        }
        callActionButton.setLayoutParams( new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT ) );

        frameLayout.addView( callActionButton );

        MaxNativeAdViewBinder binder = new MaxNativeAdViewBinder.Builder( frameLayout )
                .setCallToActionButtonId( callActionButton.getId() )
                .build();

        return new MaxNativeAdView( binder, context );
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
