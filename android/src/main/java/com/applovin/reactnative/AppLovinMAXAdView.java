package com.applovin.reactnative;

import android.content.Context;
import android.view.View;

import com.facebook.react.views.view.ReactViewGroup;

/**
 * Created by Thomas So on September 27 2020
 */
class AppLovinMAXAdView
        extends ReactViewGroup
{
    private final Runnable measureAndLayout = new Runnable()
    {
        @Override
        public void run()
        {
            for ( int i = 0; i < getChildCount(); i++ )
            {
                View child = getChildAt( i );
                child.measure(
                        MeasureSpec.makeMeasureSpec( getMeasuredWidth(), MeasureSpec.EXACTLY ),
                        MeasureSpec.makeMeasureSpec( getMeasuredHeight(), MeasureSpec.EXACTLY )
                );
                child.layout( 0, 0, child.getMeasuredWidth(), child.getMeasuredHeight() );
            }
        }
    };

    public AppLovinMAXAdView(final Context context)
    {
        super( context );
    }

    @Override
    public void requestLayout()
    {
        super.requestLayout();
        post( measureAndLayout );
    }
}
