package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import com.applovin.mediation.MaxAdFormat;
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

    private MaxAdView adView;

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
        if (adView != null) {
            post(measureRunnable);
        }
    }

    public void maybeAttachAdView(final String adUnitId, final MaxAdFormat adFormat) {
        if (adView != null) {
            adView.destroy();
            removeAllViews();
            adView = null;
            createAdViewIfCan(adUnitId, adFormat);
        } else {
            removeAllViews();
            createAdViewIfCan(adUnitId, adFormat);
        }
    }

    private void createAdViewIfCan(final String adUnitId, final MaxAdFormat adFormat) {
        Activity currentActivity = reactContext.getCurrentActivity();
        if (currentActivity == null) {
            AppLovinMAXModule.e( "Unable to attach AdView - no current Activity found" );
            return;
        }

        if (!TextUtils.isEmpty( adUnitId ) && adFormat != null) {

            adView = AppLovinMAXModule.getInstance().retrieveAdView( adUnitId, adFormat, "" );
            adView.loadAd();

            ViewParent parent = adView.getParent();
            if (parent instanceof ViewGroup) {
                ((ViewGroup) parent).removeView(adView);
            }

            addView(adView);
            AppLovinMAXModule.AdViewSize adViewSize = AppLovinMAXModule.getAdViewSize( adFormat );
            int widthPx = AppLovinSdkUtils.dpToPx( reactContext, adViewSize.widthDp );
            int heightPx = AppLovinSdkUtils.dpToPx( reactContext, adViewSize.heightDp );

            ViewGroup.LayoutParams layoutParams = adView.getLayoutParams();
            layoutParams.width = widthPx;
            layoutParams.height = heightPx;
            adView.setGravity( Gravity.CENTER );

        } else {
            AppLovinMAXModule.e("required set unit & format");
            return;
        }
    }
}
