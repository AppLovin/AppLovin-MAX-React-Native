package com.applovin.reactnative;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.nativeAds.MaxNativeAd;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.RootView;
import com.facebook.react.uimanager.RootViewUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.uimanager.util.ReactFindViewUtil;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.Map;

import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdView
        extends ReactViewGroup
        implements AppLovinMAXNativeAdLoader.Listener
{
    ReactContext reactContext;

    String adUnitId;
    String placement;
    String customData;
    Map    extraParameter;

    MaxAd currentAd;

    public AppLovinMAXNativeAdView(final Context context)
    {
        super( context );
        reactContext = (ReactContext) context;
    }

    void setAdUnitId(final String value)
    {
        if ( adUnitId != null && !value.equals( adUnitId ) )
        {
            destroyCurrentAd();
        }

        adUnitId = value;

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
        extraParameter = readableMap.toHashMap();
    }

    void setAdvertiser(final int id)
    {
        sendCurrentAd();
    }

    void setBody(final int id)
    {
        sendCurrentAd();
    }

    void setCallToAction(final int id)
    {
        sendCurrentAd();
    }

    void setIcon(final int id)
    {
        sendCurrentAd();
    }

    void setMedia(final int id)
    {
        sendCurrentAd();
    }

    void setOptions(final int id)
    {
        sendCurrentAd();
    }

    void setTitle(final int id)
    {
        sendCurrentAd();
    }

    void sendCurrentAd()
    {
        if ( currentAd != null )
        {
            convertNativeAd();
        }
    }

    void loadAd()
    {
        // returns an ad immediately if it is preloaded, otherwise loads on the fly and returns in the listener
        MaxAd ad = AppLovinMAXNativeAdLoader.getInstance().getNativeAd( reactContext, adUnitId, placement, customData, extraParameter, this );
        if ( ad != null )
        {
            AppLovinMAXModule.d( "ad loaded from cache" );
            destroyCurrentAd();
            currentAd = ad;
            convertNativeAd();
        }
    }

    public void onAdLoaded(MaxAd ad)
    {
        AppLovinMAXModule.d( "ad loaded from net" );
        destroyCurrentAd();
        currentAd = ad;
        convertNativeAd();
    }

    void convertNativeAd()
    {
        RootView rootView = RootViewUtil.getRootView( this );
        if ( rootView == null )
        {
            AppLovinMAXModule.e( "View not attached yet" );
            return;
        }

        MaxNativeAd nativeAd = currentAd.getNativeAd();
        if ( nativeAd == null )
        {
            AppLovinMAXModule.e( "Empty nativeAd from MaxNativeAd" );
            return;
        }

        WritableMap event = Arguments.createMap();
        event.putString( "title", nativeAd.getTitle() );
        event.putString( "advertiser", nativeAd.getAdvertiser() );
        event.putString( "body", nativeAd.getBody() );
        event.putString( "callToAction", nativeAd.getCallToAction() );
        event.putString( "aspectRatio", String.valueOf( nativeAd.getMediaContentAspectRatio() ) );

        MaxNativeAd.MaxNativeAdImage icon = nativeAd.getIcon();
        if ( icon.getUri() != null )
        {
            event.putString( "icon", icon.getUri().toString() );
        }
        else if ( icon.getDrawable() != null )
        {
            ReactImageView imageView = getImageView();
            if ( imageView != null )
            {
                // FIXME: this is deprecated
                imageView.setImageDrawable( icon.getDrawable() );
            }
        }

        addStretchView( nativeAd.getMediaView(), getMediaView() );

        addStretchView( nativeAd.getOptionsView(), getOptionsView() );

        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onNativeAdLoaded", event );
    }

    void addStretchView(View view, ViewGroup toItem)
    {
        if ( toItem == null ) return;

        toItem.removeAllViews();

        // toItem (ReactView) doesn't have a layout policy,
        // so it needs an exact size for the child to add
        if ( view != null )
        {
            view.measure(
                    MeasureSpec.makeMeasureSpec( toItem.getWidth(), MeasureSpec.EXACTLY ),
                    MeasureSpec.makeMeasureSpec( toItem.getHeight(), MeasureSpec.EXACTLY )
            );

            view.layout( toItem.getLeft(), 0, toItem.getRight(), toItem.getBottom() - toItem.getTop() );

            toItem.addView( view );
        }
    }

    void performCallToAction()
    {
        if ( currentAd != null )
        {
            // FIXME: mostly not working
            currentAd.getNativeAd().performClick();
        }
    }

    ReactViewGroup getMediaView()
    {
        RootView rootView = RootViewUtil.getRootView( this );
        if ( rootView == null )
        {
            return null;
        }
        return (ReactViewGroup) ReactFindViewUtil.findView( (View) rootView, "almMediaView" );
    }

    ReactViewGroup getOptionsView()
    {
        RootView rootView = RootViewUtil.getRootView( this );
        if ( rootView == null )
        {
            return null;
        }
        return (ReactViewGroup) ReactFindViewUtil.findView( (View) rootView, "almOptionsView" );
    }

    ReactImageView getImageView()
    {
        RootView rootView = RootViewUtil.getRootView( this );
        if ( rootView == null )
        {
            return null;
        }
        return (ReactImageView) ReactFindViewUtil.findView( (View) rootView, "almIconView" );
    }

    void destroyCurrentAd()
    {
        if ( adUnitId != null && currentAd != null )
        {
            AppLovinMAXNativeAdLoader.getInstance().destroyAd( adUnitId, currentAd );
        }
    }
}
