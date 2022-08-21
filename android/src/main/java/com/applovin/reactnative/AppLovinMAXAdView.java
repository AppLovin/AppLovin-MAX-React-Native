package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.ads.MaxAdView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

/**
 * Created by Thomas So on September 27 2020
 */
class AppLovinMAXAdView
        extends ReactViewGroup
{
    private final ThemedReactContext reactContext;

    private MaxAdView adView;
    private int       currentWidthPx;
    private int       currentHeightPx;

    private String      adUnitId;
    private MaxAdFormat adFormat;

    private String  placement;
    private String  customData;
    private Boolean adaptiveBannerEnabled;
    private Boolean autoRefresh;

    public AppLovinMAXAdView(final Context context)
    {
        super( context );
        this.reactContext = (ThemedReactContext) context;
    }

    void setPlacement(final String value)
    {
        placement = value;

        if ( adView != null )
        {
            adView.setPlacement( placement );
        }
    }

    void setCustomData(final String value)
    {
        customData = value;

        if ( adView != null )
        {
            adView.setCustomData( customData );
        }
    }

    void setAdaptiveBannerEnabled(final boolean enabled)
    {
        adaptiveBannerEnabled = enabled;

        if ( adView != null )
        {
            adView.setExtraParameter( "adaptive_banner", enabled ? "true" : "false" );
        }
    }

    void setAutoRefresh(final boolean enabled)
    {
        autoRefresh = enabled;

        if ( adView != null )
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
    }

    void setAdUnitId(final String value)
    {
        if ( adView != null ) return;

        adUnitId = value;

        attachAdView();
    }

    void setAdFormat(final String value)
    {
        if ( adView != null ) return;

        if ( "banner".equals( value ) )
        {
            adFormat = AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactContext );
        }
        else if ( "mrec".equals( value ) )
        {
            adFormat = MaxAdFormat.MREC;
        }

        attachAdView();
    }

    @Override
    public void requestLayout()
    {
        super.requestLayout();

        // https://stackoverflow.com/a/39838774/5477988
        // This is required to ensure ad refreshes render correctly in RN Android due to known issue where `getWidth()` and `getHeight()` return 0 on attach
        if ( adView != null )
        {
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

    public void attachAdView()
    {
        final Activity currentActivity = reactContext.getCurrentActivity();
        if ( currentActivity == null )
        {
            AppLovinMAXModule.e( "Unable to attach AdView - no current Activity found" );
            return;
        }

        // Run in next run loop when view is laid out and `getWidth()` / `getHeight()` has appropriate values
        post( new Runnable()
        {
            @Override
            public void run()
            {
                if ( adView != null ) return;

                // If ad unit id and format has been set - create and attach AdView
                if ( !TextUtils.isEmpty( adUnitId ) && adFormat != null )
                {
                    adView = new MaxAdView( adUnitId, adFormat, AppLovinMAXModule.getInstance().getSdk(), currentActivity );
                    adView.setListener( AppLovinMAXModule.getInstance() );
                    adView.setRevenueListener( AppLovinMAXModule.getInstance() );

                    if ( placement != null )
                    {
                        adView.setPlacement( placement );
                    }

                    if ( customData != null )
                    {
                        adView.setCustomData( customData );
                    }

                    if ( adaptiveBannerEnabled != null )
                    {
                        adView.setExtraParameter( "adaptive_banner", adaptiveBannerEnabled ? "true" : "false" );
                    }

                    // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
                    adView.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );

                    if ( autoRefresh != null )
                    {
                        if ( autoRefresh.booleanValue() )
                        {
                            adView.startAutoRefresh();
                        }
                        else
                        {
                            adView.stopAutoRefresh();
                        }
                    }

                    adView.loadAd();

                    currentWidthPx = getWidth();
                    currentHeightPx = getHeight();

                    addView( adView );
                }
            }
        } );
    }

    void destroy()
    {
        if ( adView != null )
        {
            removeView( adView );

            adView.setListener( null );
            adView.setRevenueListener( null );
            adView.destroy();
        }
    }
}
