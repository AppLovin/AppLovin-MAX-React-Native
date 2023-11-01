package com.applovin.reactnative;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;

import java.lang.ref.WeakReference;

class AppLovinMAXAdView
        extends ReactViewGroup
{
    private final WeakReference<AppLovinMAXAdViewAdManager> managerRef;

    private Integer adViewAdId;

    public AppLovinMAXAdView(final Context context, final AppLovinMAXAdViewAdManager manager)
    {
        super( context );
        managerRef = new WeakReference<>( manager );
    }

    public void attachAdView(final int adViewAdId)
    {
        this.adViewAdId = adViewAdId;

        AppLovinMAXAdViewAd adViewAd = managerRef.get().getAdViewAd( adViewAdId );
        if ( adViewAd != null )
        {
            adViewAd.attachView( this );
        }
        else
        {
            AppLovinMAXModule.e( "Cannot find AdViewAd with id " + adViewAdId + " for adding to AdView." );
        }
    }

    public void detachAdView()
    {
        AppLovinMAXAdViewAd adViewAd = managerRef.get().getAdViewAd( adViewAdId );
        if ( adViewAd != null )
        {
            adViewAd.detachView();
        }
    }

    @Override
    public void requestLayout()
    {
        super.requestLayout();

        if ( adViewAdId == null ) return;

        AppLovinMAXAdViewAd adViewAd = managerRef.get().getAdViewAd( adViewAdId );
        if ( adViewAd != null )
        {
            adViewAd.measureAndLayout( 0, 0, getWidth(), getHeight() );
        }
    }
}
