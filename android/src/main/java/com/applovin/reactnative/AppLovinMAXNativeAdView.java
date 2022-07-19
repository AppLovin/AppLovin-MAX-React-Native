package com.applovin.reactnative;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.nativeAds.MaxNativeAd;
import com.applovin.mediation.nativeAds.MaxNativeAdListener;
import com.applovin.mediation.nativeAds.MaxNativeAdLoader;
import com.applovin.mediation.nativeAds.MaxNativeAdView;
import com.applovin.mediation.nativeAds.MaxNativeAdViewBinder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.Map;

import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdView
        extends ReactViewGroup
{
    // Ad unit-id for the current error
    static String errorAdUnitId;

    private final ReactContext reactContext;

    private MaxNativeAdLoader nativeAdLoader;
    private MaxNativeAdView   nativeAdView;
    private MaxAd             nativeAd;
    private boolean           loadingAd;

    private String              adUnitId;
    private String              placement;
    private String              customData;
    private Map<String, Object> extraParameters;

    public AppLovinMAXNativeAdView(final ReactContext context)
    {
        super( context );
        reactContext = context;
        loadingAd = false;
    }

    void setAdUnitId(final String value)
    {
        if ( loadingAd ) return;

        AppLovinMAXModule.d( "NativeAdView: setAdUnitId: " + value );

        adUnitId = value;
        loadingAd = true;
        loadAd();
    }

    void setPlacement(@Nullable final String value)
    {
        placement = value;
    }

    void setCustomData(@Nullable final String value)
    {
        customData = value;
    }

    void setExtraParameter(@Nullable final ReadableMap readableMap)
    {
        if ( readableMap != null )
        {
            extraParameters = readableMap.toHashMap();
        }
    }

    void setMediaView(final int tag)
    {
        if ( nativeAd == null ) return;

        View view = getNativeView( tag );

        if ( view instanceof ViewGroup )
        {
            AppLovinMAXModule.d( "NativeAdView: setMediaView: " + adUnitId );

            if ( nativeAd.getNativeAd() != null )
            {
                addStretchView( nativeAd.getNativeAd().getMediaView(), (ViewGroup) view );
            }
        }
    }

    void setOptionsView(final int tag)
    {
        if ( nativeAd == null ) return;

        View view = getNativeView( tag );

        if ( view instanceof ViewGroup )
        {
            AppLovinMAXModule.d( "NativeAdView: setOptionsView: " + adUnitId );

            if ( nativeAd.getNativeAd() != null )
            {
                addStretchView( nativeAd.getNativeAd().getMediaView(), (ViewGroup) view );
            }
        }
    }

    void setIconImage(final int tag)
    {
        if ( nativeAd == null ) return;

        View view = getNativeView( tag );

        if ( view instanceof ImageView )
        {
            AppLovinMAXModule.d( "NativeAdView: setImageView: " + adUnitId );

            if ( nativeAd.getNativeAd() != null )
            {
                setImageView( nativeAd.getNativeAd().getIcon().getDrawable(), (ImageView) view );
            }
        }
    }

    void loadAd()
    {
        load( adUnitId, placement, customData, extraParameters, reactContext );
    }

    void destroyAd(boolean destroyLoader)
    {
        AppLovinMAXModule.d( "NativeAdView: destroyAd " + ( destroyLoader ? "with loader" : "" ) );

        if ( nativeAd != null )
        {
            nativeAdLoader.destroy( nativeAd );
        }

        if ( destroyLoader )
        {
            nativeAdLoader.destroy();
        }

        if ( nativeAdView != null )
        {
            ViewGroup view = (ViewGroup) nativeAdView.getParent();
            if ( view != null )
            {
                view.removeView( nativeAdView );
            }

            nativeAdView.recycle();
        }
    }

    void load(String adUnitId, String placement, String customData, Map<String, Object> extraParameters, Context context)
    {
        nativeAdLoader = new MaxNativeAdLoader( adUnitId, AppLovinMAXModule.getInstance().getSdk(), context );
        nativeAdLoader.setRevenueListener( AppLovinMAXModule.getInstance() );
        nativeAdLoader.setNativeAdListener( new NativeAdListener() );
        nativeAdLoader.setPlacement( placement );
        nativeAdLoader.setCustomData( customData );
        if ( extraParameters != null )
        {
            for ( Map.Entry<String, Object> entry : extraParameters.entrySet() )
            {
                Object value = entry.getValue();
                if ( value instanceof String )
                {
                    nativeAdLoader.setExtraParameter( entry.getKey(), (String) value );
                }
            }
        }
        nativeAdLoader.loadAd( createNativeAdView( context ) );
    }

    class NativeAdListener
            extends MaxNativeAdListener
    {
        @Override
        public void onNativeAdLoaded(@Nullable final MaxNativeAdView nativeAdView, final MaxAd ad)
        {
            AppLovinMAXModule.d( "NativeAdView: onAdLoaded: " + ad.hashCode() );

            AppLovinMAXModule.getInstance().onAdLoaded( ad );

            destroyAd( false );

            AppLovinMAXNativeAdView.this.nativeAdView = nativeAdView;

            sendNativeAd( ad );

            loadingAd = false;
        }

        @Override
        public void onNativeAdLoadFailed(final String adUnitId, final MaxError error)
        {
            AppLovinMAXNativeAdView.errorAdUnitId = adUnitId;
            AppLovinMAXModule.getInstance().onAdLoadFailed( adUnitId, error );
            AppLovinMAXNativeAdView.errorAdUnitId = "";

            loadingAd = false;
        }

        @Override
        public void onNativeAdClicked(final MaxAd ad)
        {
            AppLovinMAXModule.getInstance().onAdClicked( ad );
        }
    }

    void sendNativeAd(MaxAd ad)
    {
        // keep currentAd to destroy
        nativeAd = ad;

        MaxNativeAd nativeAd = this.nativeAd.getNativeAd();

        if ( nativeAd == null ) return;

        this.addView( nativeAdView );

        WritableMap event = Arguments.createMap();
        event.putString( "title", nativeAd.getTitle() );
        event.putString( "advertiser", nativeAd.getAdvertiser() );
        event.putString( "body", nativeAd.getBody() );
        event.putString( "callToAction", nativeAd.getCallToAction() );

        float aspectRatio = nativeAd.getMediaContentAspectRatio();
        if ( !Float.isNaN( aspectRatio ) )
        {
            event.putDouble( "mediaContentAspectRatio", aspectRatio );
        }

        MaxNativeAd.MaxNativeAdImage icon = nativeAd.getIcon();
        if ( icon.getUri() != null )
        {
            event.putString( "icon", icon.getUri().toString() );
        }
        else if ( icon.getDrawable() != null )
        {
            event.putBoolean( "image", true );
        }

        //AppLovinMAXModule.d( "NativeAd: sending a native ad to JavaScript: " + event );

        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onNativeAdLoaded", event );
    }

    void addStretchView(View view, ViewGroup toItem)
    {
        if ( view == null || toItem == null ) return;

        toItem.removeAllViews();

        view.measure(
                MeasureSpec.makeMeasureSpec( toItem.getWidth(), MeasureSpec.EXACTLY ),
                MeasureSpec.makeMeasureSpec( toItem.getHeight(), MeasureSpec.EXACTLY )
        );

        view.layout( toItem.getLeft(), 0, toItem.getRight(), toItem.getBottom() - toItem.getTop() );

        toItem.addView( view );
    }

    void setImageView(Drawable drawable, ImageView imageView)
    {
        if ( imageView == null || drawable == null ) return;

        // FIXME: this is deprecated
        imageView.setImageDrawable( drawable );
    }

    void performCallToAction()
    {
        if ( nativeAdView != null )
        {
            Button button = nativeAdView.getCallToActionButton();
            if ( button != null )
            {
                button.performClick();
            }
        }
    }

    // Create MaxNativeAdView for passing to the loader.  This
    // MaxNativeAdView won't become visible but attached to the parent
    // view for generating a revenue event, also used to invoke an
    // event of the CTA buttion
    // Note: this will be called from non-UI thread but none of the
    // views are attached to the view tree
    @SuppressLint("ResourceType")
    MaxNativeAdView createNativeAdView(Context context)
    {
        FrameLayout frameLayout = new FrameLayout( context );
        FrameLayout.LayoutParams layoutparams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER_HORIZONTAL | Gravity.CENTER_VERTICAL );
        frameLayout.setLayoutParams( layoutparams );
        frameLayout.setVisibility( View.GONE );

        Button callActionButton = new Button( context );
        if ( Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1 )
        {
            callActionButton.setId( View.generateViewId() );
        }
        else
        {
            callActionButton.setId( 9007 );
        }
        callActionButton.setLayoutParams( new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT ) );

        frameLayout.addView( callActionButton );

        MaxNativeAdViewBinder binder = new MaxNativeAdViewBinder.Builder( frameLayout )
                .setCallToActionButtonId( callActionButton.getId() )
                .build();

        return new MaxNativeAdView( binder, context );
    }

    View getNativeView(int tag)
    {
        return findViewById( tag );
    }
}
