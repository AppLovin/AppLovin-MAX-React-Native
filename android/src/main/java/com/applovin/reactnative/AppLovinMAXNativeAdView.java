package com.applovin.reactnative;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class AppLovinMAXNativeAdView
    extends ReactViewGroup
    implements MaxAdRevenueListener, View.OnLayoutChangeListener, ViewGroup.OnHierarchyChangeListener
{
    private static final int TITLE_LABEL_TAG          = 1;
    private static final int MEDIA_VIEW_CONTAINER_TAG = 2;
    private static final int ICON_VIEW_TAG            = 3;
    private static final int BODY_VIEW_TAG            = 4;
    private static final int CALL_TO_ACTION_VIEW_TAG  = 5;
    private static final int ADVERTISER_VIEW_TAG      = 8;

    private final ReactContext       reactContext;
    private final int                surfaceId;
    @Nullable
    private       MaxNativeAdLoader  adLoader;
    @Nullable
    private       MaxAd              nativeAd;
    private final AtomicBoolean      isLoading             = new AtomicBoolean(); // Guard against repeated ad loads
    private final AtomicBoolean      isAdUnitIdSet         = new AtomicBoolean();
    private final Handler            renderNativeAdHandler = new Handler( Looper.getMainLooper() );
    private final RenderNativeAdTask renderNativeAdTask    = new RenderNativeAdTask( this );

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
        surfaceId = UIManagerHelper.getSurfaceId( context );
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

        isAdUnitIdSet.set( true );
    }

    public void setPlacement(@Nullable final String value)
    {
        placement = value;
    }

    public void setCustomData(@Nullable final String value)
    {
        customData = value;
    }

    public void setExtraParameters(@Nullable final ReadableArray extraParameters)
    {
        this.extraParameters = AppLovinMAXUtils.convertReadbleArrayToHashMap( extraParameters );
    }

    public void setLocalExtraParameters(@Nullable final ReadableArray localExtraParameters)
    {
        Map<String, Object> localExtraParametersMap = AppLovinMAXUtils.convertReadbleArrayToHashMap( localExtraParameters );

        if ( localExtraParametersMap == null ) return;

        // Accumulate the result since this function may be called multiple times
        // to handle different value types, including string, number, boolean, and null.
        if ( this.localExtraParameters != null )
        {
            this.localExtraParameters.putAll( localExtraParametersMap );
        }
        else
        {
            this.localExtraParameters = localExtraParametersMap;
        }
    }

    public void loadAd()
    {
        if ( AppLovinMAXModuleImpl.getInstance().getSdk() == null )
        {
            AppLovinMAXModuleImpl.logUninitializedAccessError( "AppLovinMAXNativeAdView.loadAd" );
            return;
        }

        if ( isLoading.compareAndSet( false, true ) )
        {
            AppLovinMAXModuleImpl.d( "Loading a native ad for Ad Unit ID: " + adUnitId + "..." );

            if ( adLoader == null || !adUnitId.equals( adLoader.getAdUnitId() ) )
            {
                adLoader = new MaxNativeAdLoader( adUnitId, AppLovinMAXModuleImpl.getInstance().getSdk(), reactContext );
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
            AppLovinMAXModuleImpl.e( "Ignoring request to load native ad for Ad Unit ID " + adUnitId + ", another ad load in progress" );
        }
    }

    public void updateAssetView(final int assetViewTag, final String assetViewName)
    {
        if ( "TitleView".equals( assetViewName ) )
        {
            setTitleView( assetViewTag );
        }
        else if ( "AdvertiserView".equals( assetViewName ) )
        {
            setAdvertiserView( assetViewTag );
        }
        else if ( "BodyView".equals( assetViewName ) )
        {
            setBodyView( assetViewTag );
        }
        else if ( "CallToActionView".equals( assetViewName ) )
        {
            setCallToActionView( assetViewTag );
        }
        else if ( "IconView".equals( assetViewName ) )
        {
            setIconView( assetViewTag );
        }
        else if ( "OptionsView".equals( assetViewName ) )
        {
            setOptionsView( assetViewTag );
        }
        else if ( "MediaView".equals( assetViewName ) )
        {
            setMediaView( assetViewTag );
        }
    }

    public void renderNativeAd()
    {
        // Renders the ad only after the last asset view is set
        renderNativeAdHandler.removeCallbacksAndMessages( null );
        renderNativeAdHandler.postDelayed( renderNativeAdTask, 50 );
    }

    /// Ad Loader Listener

    private class NativeAdListener
        extends MaxNativeAdListener
    {
        @Override
        public void onNativeAdLoaded(@Nullable final MaxNativeAdView nativeAdView, @NonNull final MaxAd ad)
        {
            AppLovinMAXModuleImpl.d( "Native ad loaded: " + ad );

            // Log a warning if it is a template native ad returned - as our plugin will be responsible for re-rendering the native ad's assets
            if ( nativeAdView != null )
            {
                isLoading.set( false );

                AppLovinMAXModuleImpl.e( "Native ad is of template type, failing ad load..." );

                WritableMap loadFailedInfo = AppLovinMAXModuleImpl.getInstance().getAdLoadFailedInfo( adUnitId, null );
                reactContext.getJSModule( RCTEventEmitter.class ).receiveEvent( getId(), AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT, loadFailedInfo );

                return;
            }

            maybeDestroyCurrentAd();

            nativeAd = ad;

            // Notify `AppLovinNativeAdView.js`
            sendAdLoadedReactNativeEventForAd( ad.getNativeAd() );

            isLoading.set( false );
        }

        @Override
        public void onNativeAdLoadFailed(@NonNull final String adUnitId, @NonNull final MaxError error)
        {
            isLoading.set( false );

            AppLovinMAXModuleImpl.e( "Failed to load native ad for Ad Unit ID " + adUnitId + " with error: " + error );

            WritableMap loadFailedInfo = AppLovinMAXModuleImpl.getInstance().getAdLoadFailedInfo( adUnitId, error );
            AppLovinMAXModuleImpl.getInstance().sendReactNativeViewEvent( surfaceId, getId(), AppLovinMAXAdEvents.ON_AD_LOAD_FAILED_EVENT, loadFailedInfo );
        }

        @Override
        public void onNativeAdClicked(@NonNull final MaxAd ad)
        {
            WritableMap adInfo = AppLovinMAXModuleImpl.getInstance().getAdInfo( ad );
            AppLovinMAXModuleImpl.getInstance().sendReactNativeViewEvent( surfaceId, getId(), AppLovinMAXAdEvents.ON_AD_CLICKED_EVENT, adInfo );
        }
    }

    /// Ad Revenue Listener

    @Override
    public void onAdRevenuePaid(@NonNull final MaxAd ad)
    {
        WritableMap adInfo = AppLovinMAXModuleImpl.getInstance().getAdInfo( ad );
        AppLovinMAXModuleImpl.getInstance().sendReactNativeViewEvent( surfaceId, getId(), AppLovinMAXAdEvents.ON_AD_REVENUE_PAID_EVENT, adInfo );
    }

    /// Native Ad Component Methods

    public void setTitleView(final int tag)
    {
        if ( nativeAd.getNativeAd().getTitle() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModuleImpl.e( "Cannot find a title view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );
        view.setTag( TITLE_LABEL_TAG );
        clickableViews.add( view );
    }

    public void setAdvertiserView(final int tag)
    {
        if ( nativeAd.getNativeAd().getAdvertiser() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModuleImpl.e( "Cannot find an advertiser view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );
        view.setTag( ADVERTISER_VIEW_TAG );
        clickableViews.add( view );
    }

    public void setBodyView(final int tag)
    {
        if ( nativeAd.getNativeAd().getBody() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModuleImpl.e( "Cannot find a body view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );
        view.setTag( BODY_VIEW_TAG );
        clickableViews.add( view );
    }

    public void setCallToActionView(final int tag)
    {
        if ( nativeAd.getNativeAd().getCallToAction() == null ) return;

        View view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModuleImpl.e( "Cannot find a callToAction view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );

        // Some adapters, like Google, expect a Button widget for CTA to be clickable
        if ( view instanceof ViewGroup )
        {
            if ( view.findViewById( CALL_TO_ACTION_VIEW_TAG ) == null )
            {
                Button button = new Button( reactContext );
                button.setAlpha( 0 );
                ( (ViewGroup) view ).addView( button );
                sizeToFit( button, view );

                button.setTag( CALL_TO_ACTION_VIEW_TAG );
                clickableViews.add( button );
            }
        }
        else
        {
            view.setTag( CALL_TO_ACTION_VIEW_TAG );
            clickableViews.add( view );
        }
    }

    public void setIconView(final int tag)
    {
        ImageView view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModuleImpl.e( "Cannot find an icon image with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.setClickable( true );
        view.setTag( ICON_VIEW_TAG );
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
            AppLovinMAXModuleImpl.e( "Cannot find an options view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        view.addOnLayoutChangeListener( this );

        ViewGroup optionsViewParent = (ViewGroup) optionsView.getParent();
        if ( optionsViewParent == null )
        {
            view.addView( optionsView );
        }
        else if ( optionsViewParent != view )
        {
            optionsViewParent.removeView( optionsView );
            view.addView( optionsView );
        }

        sizeToFit( optionsView, view );
    }

    public void setMediaView(final int tag)
    {
        mediaView = nativeAd.getNativeAd().getMediaView();
        if ( mediaView == null ) return;

        ViewGroup view = findViewById( tag );
        if ( view == null )
        {
            AppLovinMAXModuleImpl.e( "Cannot find a media view with tag \"" + tag + "\" for " + adUnitId );
            return;
        }

        mediaView.setTag( MEDIA_VIEW_CONTAINER_TAG );
        clickableViews.add( mediaView );

        view.addOnLayoutChangeListener( this );

        ViewGroup mediaViewParent = (ViewGroup) mediaView.getParent();
        if ( mediaViewParent == null )
        {
            view.addView( mediaView );
        }
        else if ( mediaViewParent != view )
        {
            mediaViewParent.removeView( mediaView );
            view.addView( mediaView );
        }

        sizeToFit( mediaView, view );

        // Resize the child of `mediaView` for the networks, especially for InMobi, where the actual
        // media view is added in `MaxNativeAdLoader.b()` after `mediaView` is sized so that it has
        // to be resized when the network's media view is added.
        if ( mediaView instanceof ViewGroup )
        {
            ( (ViewGroup) mediaView ).setOnHierarchyChangeListener( this );
        }
    }

    static class RenderNativeAdTask
        implements Runnable
    {
        private final AppLovinMAXNativeAdView nativeAdView;

        RenderNativeAdTask(AppLovinMAXNativeAdView nativeAdView) { this.nativeAdView = nativeAdView; }

        @Override
        public void run()
        {
            if ( nativeAdView.adLoader == null ) return;

            nativeAdView.adLoader.a( nativeAdView.clickableViews, nativeAdView, nativeAdView.nativeAd );
            nativeAdView.adLoader.b( nativeAdView.nativeAd );

            // LINE needs to be sized a while after its mediaView is attached to the React Native
            if ( nativeAdView.mediaView != null && nativeAdView.mediaView.getParent() != null )
            {
                nativeAdView.renderNativeAdHandler.postDelayed( () -> sizeToFit( nativeAdView.mediaView, (View) nativeAdView.mediaView.getParent() ), 500 );
            }
        }
    }

    /**
     * Invoked via ViewManager.onAfterUpdateTransaction():
     * 1. after all the JavaScript properties are set when mounting NativeAdView
     * 2. every time one of the asset views is mounted, following the 1st event
     */
    public void onSetProps()
    {
        if ( isAdUnitIdSet.compareAndSet( true, false ) )
        {
            loadAd();
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
        if ( view != null && parentView != null )
        {
            view.measure( MeasureSpec.makeMeasureSpec( parentView.getWidth(), MeasureSpec.EXACTLY ),
                          MeasureSpec.makeMeasureSpec( parentView.getHeight(), MeasureSpec.EXACTLY ) );
            view.layout( 0, 0, parentView.getWidth(), parentView.getHeight() );
        }
    }

    /// Utility Methods

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
            nativeAdInfo.putDouble( "starRating", ad.getStarRating() );
        }

        // The aspect ratio can be 0.0f when it is not provided by the network.
        float aspectRatio = ad.getMediaContentAspectRatio();
        if ( aspectRatio > 0 )
        {
            nativeAdInfo.putDouble( "mediaContentAspectRatio", aspectRatio );
        }

        nativeAdInfo.putBoolean( "isIconImageAvailable", ( ad.getIcon() != null || ad.getIconView() != null ) );
        nativeAdInfo.putBoolean( "isOptionsViewAvailable", ( ad.getOptionsView() != null ) );
        nativeAdInfo.putBoolean( "isMediaViewAvailable", ( ad.getMediaView() != null ) );

        // 2. NativeAd for `AppLovinNativeAdView.js` to render the views

        WritableMap jsNativeAd = Arguments.createMap();
        jsNativeAd.putString( "title", ad.getTitle() );
        jsNativeAd.putString( "advertiser", ad.getAdvertiser() );
        jsNativeAd.putString( "body", ad.getBody() );
        jsNativeAd.putString( "callToAction", ad.getCallToAction() );

        if ( ad.getStarRating() != null )
        {
            jsNativeAd.putDouble( "starRating", ad.getStarRating() );
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

        WritableMap adInfo = AppLovinMAXModuleImpl.getInstance().getAdInfo( nativeAd );
        adInfo.putMap( "nativeAd", nativeAdInfo );
        adInfo.putMap( "nativeAdImpl", jsNativeAd );

        // Send to `AppLovinNativeAdView.js`
        AppLovinMAXModuleImpl.getInstance().sendReactNativeViewEvent( surfaceId, getId(), AppLovinMAXAdEvents.ON_AD_LOADED_EVENT, adInfo );
    }

    private void maybeDestroyCurrentAd()
    {
        if ( nativeAd != null )
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

            adLoader.destroy( nativeAd );

            nativeAd = null;
        }

        clickableViews.clear();
    }
}
