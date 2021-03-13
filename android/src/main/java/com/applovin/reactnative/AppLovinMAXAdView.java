package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.ads.MaxAdView;
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

    public AppLovinMAXAdView(final Context context)
    {
        super( context );

        this.reactContext = (ThemedReactContext) context;
    }

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

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureRunnable);
    }

    public void maybeAttachAdView(final String adUnitId, final MaxAdFormat adFormat) {

        //destroy oldview
        final MaxAdView oldView = (MaxAdView) getChildAt(0);
        removeAllViews();
        if (oldView != null) {
            oldView.destroy();
        }

        createAdViewIfCan(adUnitId, adFormat);

//        AppLovinMAXModule.d("createAdViewIfCan");
//        if (adView == null) {
//            AppLovinMAXModule.d("createAdViewIfCan false");
//            removeAllViews();
//            createAdViewIfCan(adUnitId, adFormat);
//        } else {
//            AppLovinMAXModule.d("createAdViewIfCan true");
//            adView.destroy();
//            removeAllViews();
//            adView = null;
//            createAdViewIfCan(adUnitId, adFormat);
//            requestLayout();
//        }
    }

    private void createAdViewIfCan(final String adUnitId, final MaxAdFormat adFormat) {
        Activity currentActivity = reactContext.getCurrentActivity();
        AppLovinMAXModule.e("createAdViewIfCan");
        if (currentActivity == null) {
            AppLovinMAXModule.e( "Unable to attach AdView - no current Activity found" );
            return;
        }

        if (!TextUtils.isEmpty( adUnitId ) && adFormat != null) {
            MaxAdView maxAdView = AppLovinMAXModule.getInstance().retrieveAdView( adUnitId, adFormat, "" );
            addView(maxAdView);
            maxAdView.loadAd();
            createEvent(adFormat);
        }
    }

    private void createEvent(final MaxAdFormat adFormat) {
        final MaxAdView adView = (MaxAdView) getChildAt(0);
        adView.setListener(new MaxAdViewAdListener() {
            @Override
            public void onAdExpanded(MaxAd ad) {

            }

            @Override
            public void onAdCollapsed(MaxAd ad) {

            }

            @Override
            public void onAdLoaded(MaxAd ad) {
                AppLovinMAXModule.AdViewSize adViewSize = AppLovinMAXModule.getAdViewSize( adFormat );
                int widthPx = AppLovinSdkUtils.dpToPx( reactContext, adViewSize.widthDp );
                int heightPx = AppLovinSdkUtils.dpToPx( reactContext, adViewSize.heightDp );
                ViewGroup.LayoutParams layoutParams = adView.getLayoutParams();
                layoutParams.width = widthPx;
                layoutParams.height = heightPx;
                adView.setGravity( Gravity.CENTER );
            }

            @Override
            public void onAdLoadFailed(String adUnitId, int errorCode) {

            }

            @Override
            public void onAdDisplayed(MaxAd ad) {

            }

            @Override
            public void onAdHidden(MaxAd ad) {

            }

            @Override
            public void onAdClicked(MaxAd ad) {

            }

            @Override
            public void onAdDisplayFailed(MaxAd ad, int errorCode) {

            }
        });
    }
}
