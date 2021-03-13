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
    private String adID;
    private MaxAdFormat adFormat;

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



    public void maybeAttachAdView(final String adUnitId, final MaxAdFormat maxAdFormat) {


        //destroy oldview
        final MaxAdView oldView = (MaxAdView) getChildAt(0);

        if (oldView != null) {
            oldView.destroy();
        }

        if (!TextUtils.isEmpty(adUnitId) && maxAdFormat != null) {
           final MaxAdView adView = new MaxAdView(adUnitId, maxAdFormat,reactContext.getCurrentActivity());

           ViewParent parent = adView.getParent();
           if (parent instanceof ViewGroup) {
               ((ViewGroup) parent).removeView(adView);
           }

           addView(adView);
           createAdViewIfCan();
        }
    }

    private void createAdViewIfCan() {
        final MaxAdView adView = (MaxAdView) getChildAt(0);
        adView.loadAd();
        createEvent();
    }

    private void createEvent() {
        final MaxAdView adView = (MaxAdView) getChildAt(0);
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

//                AppLovinMAXModule.AdViewSize adViewSize = AppLovinMAXModule.getAdViewSize( adFormat );
                int widthPx = AppLovinSdkUtils.dpToPx( reactContext, ad.getFormat().getSize().getWidth() );
                int heightPx = AppLovinSdkUtils.dpToPx( reactContext, ad.getFormat().getSize().getHeight() );
                ViewGroup.LayoutParams layoutParams = adView.getLayoutParams();
                layoutParams.width = widthPx;
                layoutParams.height = heightPx;
                adView.setGravity( Gravity.CENTER );
            }

            @Override
            public void onAdLoadFailed(String adUnitId, int errorCode) {
                AppLovinMAXModule.e("onAdLoadFailed");
            }

            @Override
            public void onAdDisplayed(MaxAd ad) {
                AppLovinMAXModule.e("onAdLoadFailed");
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
    }

    public void setAdID(final String adUnitId) {
        final MaxAdView oldView = (MaxAdView) getChildAt(0);
        oldView.removeAllViews();
        createAdViewIfCan();
    }

    public void setAdFormat(final MaxAdFormat ad) {
        final MaxAdView oldView = (MaxAdView) getChildAt(0);
        oldView.removeAllViews();
        createAdViewIfCan();
    }
}
