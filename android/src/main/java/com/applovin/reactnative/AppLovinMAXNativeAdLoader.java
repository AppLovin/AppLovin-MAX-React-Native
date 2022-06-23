package com.applovin.reactnative;

import android.content.Context;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.nativeAds.MaxNativeAdListener;
import com.applovin.mediation.nativeAds.MaxNativeAdLoader;
import com.applovin.mediation.nativeAds.MaxNativeAdView;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdLoader
{
    interface Listener
    {
        void onAdLoaded(MaxAd ad);
    }

    private static final int MAX_PRELOADED_ADS = 2;

    private static AppLovinMAXNativeAdLoader instance;

    Map<String, List<MaxAd>>       nativeAds;
    Map<String, MaxNativeAdLoader> loaders;

    public String errorAdUnitId;

    public static AppLovinMAXNativeAdLoader getInstance()
    {
        if ( instance == null )
        {
            instance = new AppLovinMAXNativeAdLoader();
        }
        return instance;
    }

    private AppLovinMAXNativeAdLoader()
    {
        nativeAds = new HashMap<String, List<MaxAd>>();
        loaders = new HashMap<String, MaxNativeAdLoader>();
    }

    MaxNativeAdLoader getNativeAdLoader(Context context, String adUnitId)
    {
        MaxNativeAdLoader loader = loaders.get( adUnitId );
        if ( loader == null )
        {
            loader = new MaxNativeAdLoader( adUnitId, AppLovinMAXModule.getInstance().getSdk(), context );
            loaders.put( adUnitId, loader );
        }
        return loader;
    }

    MaxAd getNativeAd(Context context, String adUnitId, String placement, String customData, Map extraParameter, Listener listener)
    {
        List<MaxAd> queue = nativeAds.get( adUnitId );
        if ( queue != null && queue.size() > 0 )
        {
            MaxAd ad = queue.get( 0 );
            if ( ad != null )
            {
                queue.remove( 0 );
            }
            return ad;
        }

        load( context, adUnitId, placement, customData, extraParameter, listener );

        return null;
    }

    void load(Context context, String adUnitId, String placement, String customData, Map<String, Object> extraParameter, Listener listener)
    {
        MaxNativeAdLoader loader = getNativeAdLoader( context, adUnitId );
        loader.setRevenueListener( AppLovinMAXModule.getInstance() );
        loader.setNativeAdListener( new NativeAdListener( adUnitId, listener ) );
        loader.setPlacement( placement );
        loader.setCustomData( customData );
        if ( extraParameter != null )
        {
            for ( Map.Entry<String, Object> entry : extraParameter.entrySet() )
            {
                Object value = entry.getValue();
                if ( value instanceof String )
                {
                    loader.setExtraParameter( entry.getKey(), (String) value );
                }
            }
        }
        loader.loadAd();
    }

    void preLoadAd(Context context, String adUnitId, String placement, String customData, Map extraParameter)
    {
        List<MaxAd> list = nativeAds.get( adUnitId );
        if ( list != null && list.size() > MAX_PRELOADED_ADS )
        {
            return;
        }
        load( context, adUnitId, placement, customData, extraParameter, null );
    }

    class NativeAdListener
            extends MaxNativeAdListener
    {
        String   adUnitId;
        Listener listener;

        NativeAdListener(String adUnitId, Listener listener)
        {
            this.adUnitId = adUnitId;
            this.listener = listener;
        }

        @Override
        public void onNativeAdLoaded(@Nullable final MaxNativeAdView nativeAdView, final MaxAd ad)
        {
            AppLovinMAXModule.getInstance().onAdLoaded( ad );

            if ( listener == null )
            {
                List<MaxAd> queue = nativeAds.get( ad.getAdUnitId() );
                if ( queue == null )
                {
                    queue = new LinkedList<MaxAd>();
                    nativeAds.put( ad.getAdUnitId(), queue );
                }
                queue.add( ad );
            }
            else
            {
                listener.onAdLoaded( ad );
            }
        }

        @Override
        public void onNativeAdLoadFailed(final String s, final MaxError error)
        {
            errorAdUnitId = adUnitId;
            AppLovinMAXModule.getInstance().onAdLoadFailed( adUnitId, error );
            // TODO: should retry
        }

        @Override
        public void onNativeAdClicked(final MaxAd ad)
        {
            AppLovinMAXModule.getInstance().onAdClicked( ad );
        }
    }

    void destroyAd(String adUnitId, MaxAd ad)
    {
        MaxNativeAdLoader loader = loaders.get( adUnitId );
        loader.destroy( ad );
    }
}
