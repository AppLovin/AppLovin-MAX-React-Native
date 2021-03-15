package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.ads.MaxAdView;
import com.applovin.sdk.AppLovinMediationProvider;
import com.applovin.sdk.AppLovinSdk;
import com.applovin.sdk.AppLovinSdkSettings;
import com.applovin.sdk.AppLovinSdkUtils;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

/**
 * Created by Thomas So on September 27 2020
 */
class AppLovinMAXAdView
        extends ReactViewGroup
{
    private final ThemedReactContext reactContext;


    private final Runnable measureRunnable = () -> {
        for (int i = 0;i < getChildCount();i++) {
            View child = getChildAt(i);
            child.measure(
                    MeasureSpec.makeMeasureSpec(getMeasuredWidth(),MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(),MeasureSpec.EXACTLY)
            );
            child.layout(0,0,child.getMeasuredWidth(),child.getMeasuredHeight());
        }
    };


    public AppLovinMAXAdView(final Context context)
    {
        super( context );
        this.reactContext = (ThemedReactContext) context;
    }

    @Override
    public void requestLayout()
    {
        super.requestLayout();
        post(measureRunnable);
    }

    public void maybeAttachAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        AppLovinMAXModule.d("khalis");
        Activity currentActivity = reactContext.getCurrentActivity();
        if ( currentActivity == null )
        {
            AppLovinMAXModule.e( "Unable to attach AdView - no current Activity found" );
            return;
        }


        final MaxAdView oldview = (MaxAdView) getChildAt(0);
        removeAllViews();
        if (oldview != null) {
            oldview.destroy();
        }


        if (!TextUtils.isEmpty( adUnitId ) && adFormat != null ) {


            final MaxAdView adView = new MaxAdView(adUnitId, adFormat, AppLovinSdk.getInstance(reactContext.getApplicationContext()), currentActivity);
            AppLovinMAXModule.e("maxAdView");
            adView.setListener(new MaxAdViewAdListener() {
                @Override
                public void onAdExpanded(MaxAd ad) {
                    AppLovinMAXModule.e("onAdExpanded");
                }

                @Override
                public void onAdCollapsed(MaxAd ad) {
                    AppLovinMAXModule.e("onAdCollapsed");
                }

                @Override
                public void onAdLoaded(MaxAd ad) {
                    AppLovinMAXModule.e("onAdLoaded");
                }

                @Override
                public void onAdLoadFailed(String adUnitId, int errorCode) {
                    AppLovinMAXModule.e("onAdLoadFailed");
                }

                @Override
                public void onAdDisplayed(MaxAd ad) {
                    AppLovinMAXModule.e("onAdDisplayed");
                }

                @Override
                public void onAdHidden(MaxAd ad) {
                    AppLovinMAXModule.e("onAdHidden");
                }

                @Override
                public void onAdClicked(MaxAd ad) {
                    AppLovinMAXModule.e("onAdClicked");
                }

                @Override
                public void onAdDisplayFailed(MaxAd ad, int errorCode) {
                    AppLovinMAXModule.e("onAdDisplayFailed");
                }
            });

            ViewParent parent = adView.getParent();
            if (parent instanceof ViewGroup) {
                ((ViewGroup) parent).removeView(adView);
            }


            AppLovinMAXModule.AdViewSize adViewSize = AppLovinMAXModule.getAdViewSize(adFormat);
            int widthPx = AppLovinSdkUtils.dpToPx(reactContext, adViewSize.widthDp);
            int heightPx = AppLovinSdkUtils.dpToPx(reactContext, adViewSize.heightDp);

            adView.setLayoutParams(new FrameLayout.LayoutParams(widthPx, heightPx));
            addView(adView);
            adView.loadAd();
            requestLayout();


        }

//        currentActivity.runOnUiThread( new Runnable()
//        {
//            @Override
//            public void run()
//            {
//                // If ad unit id and format has been set - create and attach AdView
//                if ( !TextUtils.isEmpty( adUnitId ) && adFormat != null )
//                {
//
//                    final MaxAdView maxAdView = new MaxAdView(adUnitId,adFormat, currentActivity);
//                    maxAdView.loadAd();
//                    AppLovinMAXModule.e("maxAdView");
//
//                    // Handle fast refresh cases of re-adding adView
//                    ViewParent parent = maxAdView.getParent();
//                    if ( parent instanceof ViewGroup )
//                    {
//                        ( (ViewGroup) parent ).removeView( maxAdView );
//                    }
//
//                    addView( maxAdView );
//
//                    // Set the height of the banner ad based on the device type.
//                    AppLovinMAXModule.AdViewSize adViewSize = AppLovinMAXModule.getAdViewSize( adFormat );
//                    int widthPx = AppLovinSdkUtils.dpToPx( reactContext, adViewSize.widthDp );
//                    int heightPx = AppLovinSdkUtils.dpToPx( reactContext, adViewSize.heightDp );
//
//                    ViewGroup.LayoutParams layoutParams = maxAdView.getLayoutParams();
//                    layoutParams.width = widthPx;
//                    layoutParams.height = heightPx;
//                    maxAdView.setGravity( Gravity.CENTER );
//                }
//            }
//        } );
    }
}
