package com.applovin.reactnative;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.nativeAds.MaxNativeAd;
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
    // Ad Unit ID that has an error from loading a native ad
    static String loadErrorAdUnitId;

    private final ReactContext              reactContext;
    private final AppLovinMaxNativeAdLoader nativeAdLoader;
    @Nullable
    private       MaxAd                     nativeAd;
    private       boolean                   isLoadingNativeAd;

    // Javascript properties
    private String              adUnitId;
    @Nullable
    private String              placement;
    @Nullable
    private String              customData;
    @Nullable
    private Map<String, Object> extraParameters;

    public AppLovinMAXNativeAdView(final Context context)
    {
        super( context );
        reactContext = (ReactContext) context;
        nativeAdLoader = new AppLovinMaxNativeAdLoader();
        isLoadingNativeAd = false;
    }

    public void destroy()
    {
        AppLovinMAXModule.e( "Destroy AppLovinMAXNativeAdView:" + this );

        destroyAd();

        nativeAdLoader.destroy();
    }

    public void setAdUnitId(final String value)
    {
        adUnitId = value;

        loadInitialNativeAd();
    }

    public void setPlacement(@Nullable final String value)
    {
        placement = value;
    }

    public void setCustomData(@Nullable final String value)
    {
        customData = value;
    }

    public void setExtraParameter(@Nullable final ReadableMap readableMap)
    {
        if ( readableMap != null )
        {
            extraParameters = readableMap.toHashMap();
        }
    }

    public void setMediaView(final int tag)
    {
        if ( nativeAd == null )
        {
            AppLovinMAXModule.e( "Attempting to set a media view without a MaxAd ad with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        if ( nativeAd.getNativeAd() == null )
        {
            AppLovinMAXModule.e( "Attempting to set a media view without a MaxNativeAd native ad with tag \"" + tag + "\" for " + nativeAd );
            return;
        }

        if ( nativeAd.getNativeAd().getMediaView() == null )
        {
            AppLovinMAXModule.e( "mediaView is not found in MaxNativeAd with tag \"" + tag + "\" for " + nativeAd.getNativeAd() );
            return;
        }

        View view = getNativeView( tag );
        if ( view instanceof ViewGroup )
        {
            addViewStretched( nativeAd.getNativeAd().getMediaView(), (ViewGroup) view );
        }
        else
        {
            AppLovinMAXModule.e( "Cannot find a media view with tag \"" + tag + "\" for " + adUnitId );
        }
    }

    public void setOptionsView(final int tag)
    {
        if ( nativeAd == null )
        {
            AppLovinMAXModule.e( "Attempting to set an options view without a MaxAd ad with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        if ( nativeAd.getNativeAd() == null )
        {
            AppLovinMAXModule.e( "Attempting to set an options view without a MaxNativeAd native ad with tag \"" + tag + "\" for " + nativeAd );
            return;
        }

        if ( nativeAd.getNativeAd().getOptionsView() == null )
        {
            AppLovinMAXModule.e( "optionsView is not found in MaxNativeAd with tag \"" + tag + "\" for " + nativeAd.getNativeAd() );
            return;
        }

        View view = getNativeView( tag );
        if ( view instanceof ViewGroup )
        {
            addViewStretched( nativeAd.getNativeAd().getOptionsView(), (ViewGroup) view );
        }
        else
        {
            AppLovinMAXModule.e( "Cannot find an options view with tag \"" + tag + "\" for " + adUnitId );
        }
    }

    public void setIconImage(final int tag)
    {
        if ( nativeAd == null )
        {
            AppLovinMAXModule.e( "Attempting to set an icon image without a MaxAd ad with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        if ( nativeAd.getNativeAd() == null )
        {
            AppLovinMAXModule.e( "Attempting to set an icon image without a MaxNativeAd native ad with tag \"" + tag + "\" for " + nativeAd );
            return;
        }

        if ( nativeAd.getNativeAd().getIcon() == null )
        {
            AppLovinMAXModule.e( "icon is not found in MaxNativeAd with tag \"" + tag + "\" for " + nativeAd.getNativeAd() );
            return;
        }

        if ( nativeAd.getNativeAd().getIcon().getDrawable() == null )
        {
            AppLovinMAXModule.e( "image is not found in the MaxNativeAd icon with tag \"" + tag + "\" for " + nativeAd.getNativeAd().getIcon() );
            return;
        }

        View view = getNativeView( tag );
        if ( view instanceof ImageView )
        {
            setImageView( nativeAd.getNativeAd().getIcon().getDrawable(), (ImageView) view );
        }
        else
        {
            AppLovinMAXModule.e( "Cannot find an icon image with tag \"" + tag + "\" for " + adUnitId );
        }
    }

    // Loads an initial native ad when this view is mounted
    private void loadInitialNativeAd()
    {
        if ( adUnitId == null )
        {
            AppLovinMAXModule.e( "Attempting to load a native ad without Ad Unit ID" );
            return;
        }

        // Run after 0.25 sec delay to allow all properties to set
        postDelayed( this::loadNativeAd, 250 );
    }

    // Loads a next native ad with the current properties when this is called by Javascript via the View Manager
    public void loadNativeAd()
    {
        if ( isLoadingNativeAd )
        {
            AppLovinMAXModule.e( "Attempting to load a native ad before completing previous loading: " + adUnitId );
            return;
        }

        isLoadingNativeAd = true;

        AppLovinMAXModule.d( "Loading a native ad for " + adUnitId );

        nativeAdLoader.load( adUnitId, placement, customData, extraParameters, reactContext, this );
    }

    public void onNativeAdLoaded(final MaxAd ad)
    {
        AppLovinMAXModule.d( "Loaded a native ad: +" + ad );

        // Destroy the current ad
        destroyAd();

        nativeAd = ad;

        // Send this native ad to Javascript
        sendNativeAd( ad );

        // Inform the app
        AppLovinMAXModule.getInstance().onAdLoaded( ad );

        // Adding nativeAdView will trigger a revenue event
        nativeAdLoader.addNativeAdView( this );

        isLoadingNativeAd = false;
    }

    public void onNativeAdLoadFailed(final MaxError error)
    {
        AppLovinMAXModule.d( "Failed to Load a native ad for " + adUnitId + " with error: " + error );

        // Inform the app
        loadErrorAdUnitId = adUnitId;
        AppLovinMAXModule.getInstance().onAdLoadFailed( adUnitId, error );
        loadErrorAdUnitId = "";

        isLoadingNativeAd = false;
    }

    private void sendNativeAd(final MaxAd ad)
    {
        MaxNativeAd nativeAd = ad.getNativeAd();

        if ( nativeAd == null )
        {
            AppLovinMAXModule.e( "MaxNativeAd not having a native ad: " + ad );
            return;
        }

        WritableMap jsNativeAd = Arguments.createMap();

        jsNativeAd.putString( "title", nativeAd.getTitle() );
        if ( nativeAd.getAdvertiser() != null )
        {
            jsNativeAd.putString( "advertiser", nativeAd.getAdvertiser() );
        }
        if ( nativeAd.getBody() != null )
        {
            jsNativeAd.putString( "body", nativeAd.getBody() );
        }
        if ( nativeAd.getCallToAction() != null )
        {
            jsNativeAd.putString( "callToAction", nativeAd.getCallToAction() );
        }

        MaxNativeAd.MaxNativeAdImage icon = nativeAd.getIcon();
        if ( icon != null )
        {
            if ( icon.getUri() != null )
            {
                jsNativeAd.putString( "icon", icon.getUri().toString() );
            }
            else if ( icon.getDrawable() != null )
            {
                jsNativeAd.putBoolean( "image", true );
            }
        }

        float aspectRatio = nativeAd.getMediaContentAspectRatio();
        if ( !Float.isNaN( aspectRatio ) )
        {
            jsNativeAd.putDouble( "mediaContentAspectRatio", aspectRatio );
        }

        // Sending jsNativeAd to Javascript as an event, then Javascript will render the views with jsNativeAd
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onNativeAdLoaded", jsNativeAd );
    }

    // Adds a view to a parent, and stretches it to the size of the parent
    private void addViewStretched(final View view, final ViewGroup parent)
    {
        // Remove view from the old parent first
        ViewGroup viewParent = (ViewGroup) view.getParent();
        if ( viewParent != null )
        {
            viewParent.removeView( view );
        }

        view.measure(
                MeasureSpec.makeMeasureSpec( parent.getWidth(), MeasureSpec.EXACTLY ),
                MeasureSpec.makeMeasureSpec( parent.getHeight(), MeasureSpec.EXACTLY )
        );

        view.layout( parent.getLeft(), 0, parent.getRight(), parent.getBottom() - parent.getTop() );

        parent.addView( view );
    }

    private void setImageView(final Drawable image, final ImageView view)
    {
        // FIXME: this is deprecated
        view.setImageDrawable( image );
    }

    public void performCallToAction()
    {
        nativeAdLoader.performCallToAction();
    }

    // Finds a native View from the specified tag (ref)
    private View getNativeView(final int tag)
    {
        return findViewById( tag );
    }

    private void destroyAd()
    {
        if ( nativeAd != null )
        {
            if ( nativeAd.getNativeAd() != null )
            {
                View view = nativeAd.getNativeAd().getMediaView();
                if ( view != null )
                {
                    ViewGroup parentView = (ViewGroup) view.getParent();
                    if ( parentView != null )
                    {
                        parentView.removeView( view );
                    }
                }

                view = nativeAd.getNativeAd().getOptionsView();
                if ( view != null )
                {
                    ViewGroup parentView = (ViewGroup) view.getParent();
                    if ( parentView != null )
                    {
                        parentView.removeView( view );
                    }
                }
            }

            nativeAdLoader.destroyAd( nativeAd );

            nativeAd = null;
        }
    }
}
