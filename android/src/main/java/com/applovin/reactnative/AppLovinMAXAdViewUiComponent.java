package com.applovin.reactnative;

import android.view.View;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdRevenueListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

class AppLovinMAXAdViewUiComponent
    implements MaxAdListener, MaxAdViewAdListener, MaxAdRevenueListener
{
    private final ReactContext reactContext;
    private final MaxAdView    adView;

    @Nullable
    private AppLovinMAXAdView containerView;

    public AppLovinMAXAdViewUiComponent(final String adUnitId, final MaxAdFormat adFormat, final ReactContext context)
    {
        reactContext = context;

        adView = new MaxAdView( adUnitId, adFormat, AppLovinMAXModule.getInstance().getSdk(), context );
        adView.setListener( this );
        adView.setRevenueListener( this );
        adView.setExtraParameter( "adaptive_banner", "true" );

        // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
        adView.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );

        adView.stopAutoRefresh();
    }

    public MaxAdView getAdView()
    {
        return adView;
    }

    public String getAdUnitId()
    {
        return adView.getAdUnitId();
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

    public void setAutoRefreshEnabled(final boolean enabled)
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

    public boolean hasContainerView()
    {
        return containerView != null;
    }

    // AdView should have no parent when containerView is null, but it retains a parent even after
    // being removed from containerView when attached to react-native-screens views. This happens
    // because react-native-screens replaces the default UI manager with its own, which includes
    // caching for screen navigation.
    public boolean isAdViewAttached()
    {
        return containerView == null && adView.getParent() != null;
    }

    public void attachAdView(AppLovinMAXAdView view)
    {
        if ( isAdViewAttached() )
        {
            AppLovinMAXModule.e( "Cannot attach AdView because it already has an existing parent: " + adView );
            return;
        }

        containerView = view;
        containerView.addView( adView );
    }

    public void detachAdView()
    {
        if ( containerView != null )
        {
            containerView.removeView( adView );
            containerView = null;
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
        // This is required to ensure ad refreshes render correctly in RN Android due to known issue
        // where `getWidth()` and `getHeight()` return 0 on attach
        adView.measure(
            View.MeasureSpec.makeMeasureSpec( width, View.MeasureSpec.EXACTLY ),
            View.MeasureSpec.makeMeasureSpec( height, View.MeasureSpec.EXACTLY )
        );

        adView.layout( x, y, width, height );
    }

    @Override
    public void onAdLoaded(@NonNull final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
        adInfo.putInt( "adViewId", hashCode() );

        if ( AppLovinMAXAdView.hasPreloadedAdView( hashCode() ) )
        {
            // Copy the `adInfo` since sending the same map through the RN bridge more than once will result in `com.facebook.react.bridge.ObjectAlreadyConsumedException: Map already consumed`
            AppLovinMAXModule.getInstance().sendReactNativeEvent( AppLovinMAXAdEvents.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT, adInfo.copy() );
        }

        if ( containerView != null )
        {
            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_LOADED_EVENT, adInfo );
        }
    }

    @Override
    public void onAdLoadFailed(@NonNull final String adUnitId, @NonNull final MaxError error)
    {
        WritableMap adLoadFailedInfo = AppLovinMAXModule.getInstance().getAdLoadFailedInfo( adUnitId, error );
        adLoadFailedInfo.putInt( "adViewId", hashCode() );

        if ( AppLovinMAXAdView.hasPreloadedAdView( hashCode() ) )
        {
            // Copy the `adLoadFailedInfo` since sending the same map through the RN bridge more than once will result in `com.facebook.react.bridge.ObjectAlreadyConsumedException: Map already consumed`
            AppLovinMAXModule.getInstance().sendReactNativeEvent( AppLovinMAXAdEvents.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT, adLoadFailedInfo.copy() );
        }

        if ( containerView != null )
        {
            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT, adLoadFailedInfo );
        }
    }

    @Override
    public void onAdDisplayFailed(@NonNull final MaxAd ad, @NonNull final MaxError error)
    {
        if ( containerView != null )
        {
            WritableMap adDisplayFailedInfo = AppLovinMAXModule.getInstance().getAdDisplayFailedInfo( ad, error );
            adDisplayFailedInfo.putInt( "adViewId", hashCode() );

            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_DISPLAY_FAILED_EVENT, adDisplayFailedInfo );
        }
    }

    @Override
    public void onAdClicked(@NonNull final MaxAd ad)
    {
        if ( containerView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            adInfo.putInt( "adViewId", hashCode() );

            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_CLICKED_EVENT, adInfo );
        }
    }

    @Override
    public void onAdExpanded(@NonNull final MaxAd ad)
    {
        if ( containerView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            adInfo.putInt( "adViewId", hashCode() );

            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_EXPANDED_EVENT, adInfo );
        }
    }

    @Override
    public void onAdCollapsed(@NonNull final MaxAd ad)
    {
        if ( containerView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            adInfo.putInt( "adViewId", hashCode() );

            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_COLLAPSED_EVENT, adInfo );
        }
    }

    @Override
    public void onAdRevenuePaid(@NonNull final MaxAd ad)
    {
        if ( containerView != null )
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            adInfo.putInt( "adViewId", hashCode() );

            sendReactNativeCallbackEvent( AppLovinMAXAdEvents.ON_AD_REVENUE_PAID_EVENT, adInfo );
        }
    }

    /// Deprecated Callbacks

    @Override
    public void onAdDisplayed(@NonNull final MaxAd ad) { }

    @Override
    public void onAdHidden(@NonNull final MaxAd ad) { }

    /// Utilities

    private void sendReactNativeCallbackEvent(final String name, @Nullable final WritableMap params)
    {
        if ( containerView != null )
        {
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( containerView.getId(), name, params );
        }
    }
}
