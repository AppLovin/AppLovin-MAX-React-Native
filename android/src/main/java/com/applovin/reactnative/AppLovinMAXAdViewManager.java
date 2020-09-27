package com.applovin.reactnative;

import android.app.Activity;
import android.graphics.Color;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.ads.MaxAdView;
import com.applovin.sdk.AppLovinSdkUtils;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

import org.jetbrains.annotations.NotNull;

import androidx.annotation.Nullable;

/**
 * Created by Thomas So on September 26 2020
 */
class AppLovinMAXAdViewManager
        extends SimpleViewManager<ViewGroup>
{
    // Parent fields
    private ReactApplicationContext reactApplicationContext;

    // View fields
    private RelativeLayout containerLayout;
    private MaxAdView      adView;

    // Fields that need to be set before creating MaxAdView
    private String      adUnitId;
    private MaxAdFormat adFormat;

    public AppLovinMAXAdViewManager(final ReactApplicationContext reactApplicationContext)
    {
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public @NotNull String getName()
    {
        return "AppLovinMAXAdView";
    }

    @Override
    protected @NotNull ViewGroup createViewInstance(final ThemedReactContext reactContext)
    {
        Activity currentActivity = reactContext.getCurrentActivity();
        if ( currentActivity == null )
        {
            AppLovinMAXModule.e( "Unable to create AdView - no current Activity found" );
            return new ReactViewGroup( reactContext );
        }

        // NOTE: Do not set frame or backgroundColor as RN will overwrite the values set by your custom class in order to match your JavaScript component's layout props - hence wrapper
        containerLayout = new RelativeLayout( reactContext );
        return containerLayout;
    }

    @ReactProp(name = "adUnitId")
    public void setAdUnitId(final ViewGroup view, final @Nullable String adUnitId)
    {
        this.adUnitId = adUnitId;
        maybeAttachAdView( adUnitId, adFormat );
    }

    @ReactProp(name = "adFormat")
    public void setAdFormat(final ViewGroup view, final @Nullable String adFormatStr)
    {
        if ( "banner".equals( adFormatStr ) )
        {
            adFormat = AppLovinMAXModule.getDeviceSpecificBannerAdViewAdFormat( reactApplicationContext );
        }
        else if ( "mrec".equals( adFormatStr ) )
        {
            adFormat = MaxAdFormat.MREC;
        }

        maybeAttachAdView( adUnitId, adFormat );
    }

    private void maybeAttachAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        final Activity currentActivity = reactApplicationContext.getCurrentActivity();
        if ( currentActivity == null )
        {
            AppLovinMAXModule.e( "Unable to attach AdView - no current Activity found" );
            return;
        }

        // Run after delay to ensure SDK is attached to main module first
        //        AppLovinSdkUtils.runOnUiThreadDelayed( new Runnable()
        currentActivity.runOnUiThread( new Runnable()
        {
            @Override
            public void run()
            {
                // If ad unit id and format has been set - create and attach AdView
                if ( !TextUtils.isEmpty( adUnitId ) && adFormat != null )
                {
                    // Check if there's a previously-attached AdView
                    if ( adView != null )
                    {
                        ViewGroup parent = (ViewGroup) adView.getParent();
                        if ( parent != null )
                        {
                            parent.removeView( adView );
                        }

                        adView.stopAutoRefresh();
                        adView = null;
                    }

                    adView = AppLovinMAXModule.getInstance().retrieveAdView( adUnitId, adFormat, "" );

                    // Set the height of the banner ad based on the device type.
                    AppLovinMAXModule.AdViewSize adViewSize = AppLovinMAXModule.getAdViewSize( adFormat );
                    int widthPx = AppLovinSdkUtils.dpToPx( reactApplicationContext, adViewSize.widthDp );
                    int heightPx = AppLovinSdkUtils.dpToPx( reactApplicationContext, adViewSize.heightDp );

                    containerLayout.addView( adView );

                    RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) adView.getLayoutParams();
                    //                    RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams( 100, 100 );
                    layoutParams.addRule( RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE );
                    layoutParams.width = widthPx;
                    layoutParams.height = heightPx;
                    adView.setLayoutParams( layoutParams );

                    adView.loadAd();
                    adView.setBackgroundColor( Color.RED );

                    adView.measure( View.MeasureSpec.makeMeasureSpec( widthPx, View.MeasureSpec.EXACTLY ),
                                    View.MeasureSpec.makeMeasureSpec( heightPx, View.MeasureSpec.EXACTLY ) );
                    adView.layout( adView.getLeft(), adView.getTop(), adView.getRight(), adView.getBottom() );
                }
            }
        } );
        //        }, TimeUnit.SECONDS.toMillis( 1 ) );
    }
}
