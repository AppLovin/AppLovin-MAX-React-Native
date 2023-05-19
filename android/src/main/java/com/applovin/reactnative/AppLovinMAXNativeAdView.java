package com.applovin.reactnative;

import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdRevenueListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.nativeAds.MaxNativeAd;
import com.applovin.mediation.nativeAds.MaxNativeAd.MaxNativeAdImage;
import com.applovin.mediation.nativeAds.MaxNativeAdListener;
import com.applovin.mediation.nativeAds.MaxNativeAdLoader;
import com.applovin.mediation.nativeAds.MaxNativeAdView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import androidx.annotation.Nullable;

import static com.applovin.sdk.AppLovinSdkUtils.runOnUiThreadDelayed;

public class AppLovinMAXNativeAdView
        extends ReactViewGroup
        implements MaxAdRevenueListener, View.OnLayoutChangeListener, ViewGroup.OnHierarchyChangeListener
{
    private final ReactContext      reactContext;
    @Nullable
    private       MaxNativeAdLoader adLoader;
    @Nullable
    private       MaxAd             nativeAd;
    private final AtomicBoolean     isLoading = new AtomicBoolean(); // Guard against repeated ad loads

    @Nullable
    private View mediaView;
    @Nullable
    private View optionsView;

    // JavaScript properties
    private String              adUnitId;
    @Nullable
    private String              placement;
    @Nullable
    private String              customData;
    @Nullable
    private Map<String, Object> extraParameters;
    @Nullable
    private Map<String, Object> localExtraParameters;

    // TODO: Allow publisher to select which views are clickable and which isn't via prop
    private final List<View> clickableViews = new ArrayList<>();

    public AppLovinMAXNativeAdView(final Context context)
    {
        super( context );
        reactContext = (ReactContext) context;
    }

    public void destroy()
    {
        maybeDestroyCurrentAd();

        if ( adLoader != null )
        {
            adLoader.destroy();
            adLoader = null;
        }
    }

    public void setAdUnitId(final String value)
    {
        if ( TextUtils.isEmpty( value ) ) return;

        adUnitId = value;

        // Explicitly invoke ad load now that Ad Unit ID is set, but do so after 0.25s to allow other props to set
        postDelayed( this::loadAd, 250 );
    }

    public void setPlacement(@Nullable final String value)
    {
        placement = value;
    }

    public void setCustomData(@Nullable final String value)
    {
        customData = value;
    }

    public void setExtraParameters(@Nullable final ReadableMap readableMap)
    {
        if ( readableMap != null )
        {
            extraParameters = readableMap.toHashMap();
        }
    }

    public void setLocalExtraParameters(@Nullable final ReadableMap readableMap)
    {
        if ( readableMap != null )
        {
            localExtraParameters = readableMap.toHashMap();
        }
    }

    public void loadAd()
    {
        if ( AppLovinMAXModule.getInstance().getSdk() == null )
        {
            AppLovinMAXModule.logUninitializedAccessError( "AppLovinMAXNativeAdView.loadAd" );
            return;
        }

        if ( isLoading.compareAndSet( false, true ) )
        {
            AppLovinMAXModule.d( "Loading a native ad for Ad Unit ID: " + adUnitId + "..." );

            if ( adLoader == null || !adUnitId.equals( adLoader.getAdUnitId() ) )
            {
                adLoader = new MaxNativeAdLoader( adUnitId, AppLovinMAXModule.getInstance().getSdk(), reactContext );
                adLoader.setRevenueListener( this );
                adLoader.setNativeAdListener( new NativeAdListener() );
            }

            adLoader.setPlacement( placement );
            adLoader.setCustomData( customData );

            if ( extraParameters != null )
            {
                for ( Map.Entry<String, Object> entry : extraParameters.entrySet() )
                {
                    adLoader.setExtraParameter( entry.getKey(), (String) entry.getValue() );
                }
            }

            if ( localExtraParameters != null )
            {
                for ( Map.Entry<String, Object> entry : localExtraParameters.entrySet() )
                {
                    adLoader.setLocalExtraParameter( entry.getKey(), entry.getValue() );
                }
            }

            adLoader.loadAd();
        }
        else
        {
            AppLovinMAXModule.e( "Ignoring request to load native ad for Ad Unit ID " + adUnitId + ", another ad load in progress" );
        }
    }

    /// Views to Replace

    public void setTitleView(final int tag)
    {
        if ( nativeAd.getNativeAd().getTitle() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find a title view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );

        clickableViews.add( view );
    }

    public void setAdvertiserView(final int tag)
    {
        if ( nativeAd.getNativeAd().getAdvertiser() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find an advertiser view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );

        clickableViews.add( view );
    }

    public void setBodyView(final int tag)
    {
        if ( nativeAd.getNativeAd().getBody() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find a body view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );

        clickableViews.add( view );
    }

    public void setCallToActionView(final int tag)
    {
        if ( nativeAd.getNativeAd().getCallToAction() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find a callToAction view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );

        clickableViews.add( view );
    }

    public void setIconView(final int tag)
    {
        ImageView view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find an icon image with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );
        clickableViews.add( view );

        MaxNativeAdImage icon = nativeAd.getNativeAd().getIcon();
        if ( icon != null )
        {
            // Check if "URL" was missing and therefore need to set the image data
            if ( icon.getUri() == null && icon.getDrawable() != null )
            {
                view.setImageDrawable( icon.getDrawable() );
            }
        }
    }

    public void setOptionsView(final int tag)
    {
        optionsView = nativeAd.getNativeAd().getOptionsView();
        if ( optionsView == null ) return;

        ViewGroup view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find an options view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.addOnLayoutChangeListener( this );
        view.addView( optionsView );

        sizeToFit( optionsView, view );
    }

    public void setMediaView(final int tag)
    {
        mediaView = nativeAd.getNativeAd().getMediaView();
        if ( mediaView == null ) return;

        ViewGroup view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModule.e( "Cannot find a media view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        clickableViews.add( view );

        view.addOnLayoutChangeListener( this );
        view.addView( mediaView );

        sizeToFit( mediaView, view );

        // Resize the child of `mediaView` for the networks, especially for InMobi, where the actual
        // media view is added in `MaxNativeAdLoader.b()` after `mediaView` is sized so that it has
        // to be resized when the network's media view is added.
        if ( mediaView instanceof ViewGroup )
        {
            ( (ViewGroup) mediaView ).setOnHierarchyChangeListener( this );
        }
    }

    @Override
    public void onLayoutChange(View view, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom)
    {
        if ( mediaView != null && view == mediaView.getParent() )
        {
            sizeToFit( mediaView, view );
        }
        else if ( optionsView != null && view == optionsView.getParent() )
        {
            sizeToFit( optionsView, view );
        }
    }

    @Override
    public void onChildViewAdded(final View parent, final View child)
    {
        parent.post( () -> sizeToFit( child, parent ) );
    }

    @Override
    public void onChildViewRemoved(final View parent, final View child) { }

    private static void sizeToFit(final @Nullable View view, final View parentView)
    {
        if ( view != null )
        {
            view.measure( MeasureSpec.makeMeasureSpec( parentView.getWidth(), MeasureSpec.EXACTLY ),
                          MeasureSpec.makeMeasureSpec( parentView.getHeight(), MeasureSpec.EXACTLY ) );
            view.layout( 0, 0, parentView.getWidth(), parentView.getHeight() );
        }
    }

    /// Ad Revenue Callback

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        WritableMap adRevenueInfo = AppLovinMAXModule.getInstance().getAdRevenueInfo( ad );
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdRevenuePaidEvent", adRevenueInfo );
    }

    /// Ad Loader Callback

    class NativeAdListener
            extends MaxNativeAdListener
    {
        @Override
        public void onNativeAdLoaded(@Nullable final MaxNativeAdView nativeAdView, final MaxAd ad)
        {
            AppLovinMAXModule.d( "Native ad loaded: " + ad );

            // Log a warning if it is a template native ad returned - as our plugin will be responsible for re-rendering the native ad's assets
            if ( nativeAdView != null )
            {
                isLoading.set( false );

                AppLovinMAXModule.e( "Native ad is of template type, failing ad load..." );
                WritableMap loadFailedInfo = AppLovinMAXModule.getInstance().getAdLoadFailedInfo( adUnitId, null );
                reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdLoadFailedEvent", loadFailedInfo );

                return;
            }

            maybeDestroyCurrentAd();

            nativeAd = ad;

            // Notify `AppLovinNativeAdView.js`
            sendAdLoadedReactNativeEventForAd( ad.getNativeAd() );

            // After notifying the RN layer - have slight delay to let views bind to this layer in `clickableViews` before registering
            runOnUiThreadDelayed( () -> {

                // Loader can be null when the user hides before the properties are fully set
                if ( adLoader != null )
                {
                    adLoader.a( clickableViews, AppLovinMAXNativeAdView.this, ad );
                    adLoader.b( ad );
                }

                // Reassure the size of `mediaView` and its children for the networks, such as
                // LINE, where the actual ad contents are loaded after `mediaView` is sized.
                if ( mediaView != null )
                {
                    sizeToFit( mediaView, (ReactViewGroup) mediaView.getParent() );
                }

                isLoading.set( false );
            }, 500L );
        }

        @Override
        public void onNativeAdLoadFailed(final String adUnitId, final MaxError error)
        {
            isLoading.set( false );

            AppLovinMAXModule.e( "Failed to load native ad for Ad Unit ID " + adUnitId + " with error: " + error );

            // Notify publisher
            WritableMap loadFailedInfo = AppLovinMAXModule.getInstance().getAdLoadFailedInfo( adUnitId, error );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdLoadFailedEvent", loadFailedInfo );
        }

        @Override
        public void onNativeAdClicked(final MaxAd ad)
        {
            WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( ad );
            reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdClickedEvent", adInfo );
        }
    }

    private void sendAdLoadedReactNativeEventForAd(final MaxNativeAd ad)
    {
        // 1. AdInfo for publisher to be notified via `onAdLoaded`

        WritableMap nativeAdInfo = Arguments.createMap();
        nativeAdInfo.putString( "title", ad.getTitle() );
        nativeAdInfo.putString( "advertiser", ad.getAdvertiser() );
        nativeAdInfo.putString( "body", ad.getBody() );
        nativeAdInfo.putString( "callToAction", ad.getCallToAction() );

        if ( ad.getStarRating() != null )
        {
            nativeAdInfo.putDouble( "starRating", ad.getStarRating().doubleValue() );
        }

        // The aspect ratio can be 0.0f when it is not provided by the network.
        float aspectRatio = ad.getMediaContentAspectRatio();
        if ( aspectRatio > 0 )
        {
            nativeAdInfo.putDouble( "mediaContentAspectRatio", aspectRatio );
        }

        nativeAdInfo.putBoolean( "isIconImageAvailable", ( ad.getIcon() != null ) );
        nativeAdInfo.putBoolean( "isOptionsViewAvailable", ( ad.getOptionsView() != null ) );
        nativeAdInfo.putBoolean( "isMediaViewAvailable", ( ad.getMediaView() != null ) );

        WritableMap adInfo = AppLovinMAXModule.getInstance().getAdInfo( nativeAd );
        adInfo.putMap( "nativeAd", nativeAdInfo );

        // 2. NativeAd for `AppLovinNativeAdView.js` to render the views

        WritableMap jsNativeAd = Arguments.createMap();
        jsNativeAd.putString( "title", ad.getTitle() );
        jsNativeAd.putString( "advertiser", ad.getAdvertiser() );
        jsNativeAd.putString( "body", ad.getBody() );
        jsNativeAd.putString( "callToAction", ad.getCallToAction() );

        if ( ad.getStarRating() != null )
        {
            jsNativeAd.putDouble( "starRating", ad.getStarRating().doubleValue() );
        }

        MaxNativeAdImage icon = ad.getIcon();
        if ( icon != null )
        {
            if ( icon.getUri() != null )
            {
                jsNativeAd.putString( "url", icon.getUri().toString() );
            }
            else if ( icon.getDrawable() != null )
            {
                jsNativeAd.putBoolean( "image", true );
            }
        }

        jsNativeAd.putBoolean( "isOptionsViewAvailable", ( ad.getOptionsView() != null ) );
        jsNativeAd.putBoolean( "isMediaViewAvailable", ( ad.getMediaView() != null ) );

        WritableMap arg = Arguments.createMap();
        arg.putMap( "adInfo", adInfo );
        arg.putMap( "nativeAd", jsNativeAd );

        // Send to `AppLovinNativeAdView.js`
        reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), "onAdLoadedEvent", arg );
    }

    private void maybeDestroyCurrentAd()
    {
        if ( nativeAd != null )
        {
            if ( nativeAd.getNativeAd() != null )
            {
                if ( mediaView != null )
                {
                    ViewGroup parentView = (ViewGroup) mediaView.getParent();
                    if ( parentView != null )
                    {
                        parentView.removeOnLayoutChangeListener( AppLovinMAXNativeAdView.this );
                        parentView.removeView( mediaView );
                    }
                }

                if ( optionsView != null )
                {
                    ViewGroup parentView = (ViewGroup) optionsView.getParent();
                    if ( parentView != null )
                    {
                        parentView.removeOnLayoutChangeListener( AppLovinMAXNativeAdView.this );
                        parentView.removeView( optionsView );
                    }
                }
            }

            adLoader.destroy( nativeAd );

            nativeAd = null;
        }

        clickableViews.clear();
    }
}
