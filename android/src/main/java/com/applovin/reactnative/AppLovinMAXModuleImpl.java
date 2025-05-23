package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.OrientationEventListener;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdRevenueListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxAdViewConfiguration;
import com.applovin.mediation.MaxAdWaterfallInfo;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.MaxErrorCode;
import com.applovin.mediation.MaxMediatedNetworkInfo;
import com.applovin.mediation.MaxNetworkResponseInfo;
import com.applovin.mediation.MaxReward;
import com.applovin.mediation.MaxRewardedAdListener;
import com.applovin.mediation.MaxSegment;
import com.applovin.mediation.MaxSegmentCollection;
import com.applovin.mediation.adapter.MaxAdapterError;
import com.applovin.mediation.ads.MaxAdView;
import com.applovin.mediation.ads.MaxAppOpenAd;
import com.applovin.mediation.ads.MaxInterstitialAd;
import com.applovin.mediation.ads.MaxRewardedAd;
import com.applovin.sdk.AppLovinCmpError;
import com.applovin.sdk.AppLovinMediationProvider;
import com.applovin.sdk.AppLovinPrivacySettings;
import com.applovin.sdk.AppLovinSdk;
import com.applovin.sdk.AppLovinSdkConfiguration;
import com.applovin.sdk.AppLovinSdkConfiguration.ConsentFlowUserGeography;
import com.applovin.sdk.AppLovinSdkInitializationConfiguration;
import com.applovin.sdk.AppLovinSdkUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import static com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

/**
 * Created by Thomas So on July 11 2020
 */
public class AppLovinMAXModuleImpl
    implements LifecycleEventListener,
    MaxAdListener, MaxAdViewAdListener, MaxRewardedAdListener, MaxAdRevenueListener
{
    private static final String SDK_TAG        = "AppLovinSdk";
    private static final String TAG            = "AppLovinMAXModule";
    private static final String PLUGIN_VERSION = "9.2.0";

    private static final String USER_GEOGRAPHY_GDPR    = "G";
    private static final String USER_GEOGRAPHY_OTHER   = "O";
    private static final String USER_GEOGRAPHY_UNKNOWN = "U";

    private static final String TOP_CENTER    = "top_center";
    private static final String TOP_LEFT      = "top_left";
    private static final String TOP_RIGHT     = "top_right";
    private static final String CENTERED      = "centered";
    private static final String CENTER_LEFT   = "center_left";
    private static final String CENTER_RIGHT  = "center_right";
    private static final String BOTTOM_LEFT   = "bottom_left";
    private static final String BOTTOM_CENTER = "bottom_center";
    private static final String BOTTOM_RIGHT  = "bottom_right";

    private static final Point DEFAULT_AD_VIEW_OFFSET = new Point( 0, 0 );

    private static final Map<String, String> ALCompatibleNativeSdkVersions = new HashMap<>();

    static
    {
        ALCompatibleNativeSdkVersions.put( "9.2.0", "13.3.0" );
        ALCompatibleNativeSdkVersions.put( "9.1.0", "13.2.0" );
        ALCompatibleNativeSdkVersions.put( "9.0.0", "13.0.1" );
        ALCompatibleNativeSdkVersions.put( "8.2.0", "13.0.1" );
        ALCompatibleNativeSdkVersions.put( "8.1.1", "13.0.1" );
        ALCompatibleNativeSdkVersions.put( "8.1.0", "13.0.1" );
        ALCompatibleNativeSdkVersions.put( "8.0.5", "13.0.1" );
        ALCompatibleNativeSdkVersions.put( "8.0.4", "13.0.0" );
        ALCompatibleNativeSdkVersions.put( "8.0.3", "13.0.0" );
        ALCompatibleNativeSdkVersions.put( "8.0.2", "13.0.0" );
        ALCompatibleNativeSdkVersions.put( "8.0.1", "13.0.0" );
        ALCompatibleNativeSdkVersions.put( "8.0.0", "13.0.0" );
    }

    public static final String NAME = "AppLovinMAX";

    public static  AppLovinMAXModuleImpl instance;
    @Nullable
    private static Activity              currentActivity;

    // Parent Fields
    private final AppLovinSdk              sdk;
    private final ReactApplicationContext  reactContext;
    private       boolean                  isPluginInitialized;
    private       boolean                  isSdkInitialized;
    private       AppLovinSdkConfiguration sdkConfiguration;

    private WindowManager windowManager;
    private int           lastRotation;

    // Store these values if pub attempts to set it before initializing
    private       List<String>                 initializationAdUnitIdsToSet;
    private       List<String>                 testDeviceAdvertisingIdsToSet;
    private final MaxSegmentCollection.Builder segmentCollectionBuilder = MaxSegmentCollection.builder();

    // Fullscreen Ad Fields
    private final Map<String, MaxInterstitialAd> interstitials = new HashMap<>( 2 );
    private final Map<String, MaxRewardedAd>     rewardedAds   = new HashMap<>( 2 );
    private final Map<String, MaxAppOpenAd>      appOpenAds    = new HashMap<>( 2 );

    // Banner Fields
    private final Map<String, MaxAdView>   adViews                         = new HashMap<>( 2 );
    private final Map<String, MaxAdFormat> adViewAdFormats                 = new HashMap<>( 2 );
    private final Map<String, String>      adViewPositions                 = new HashMap<>( 2 );
    private final Map<String, Point>       adViewOffsets                   = new HashMap<>( 2 );
    private final Map<String, Integer>     adViewWidths                    = new HashMap<>( 2 );
    private final List<String>             adUnitIdsToShowAfterCreate      = new ArrayList<>( 2 );
    private final Set<String>              disabledAdaptiveBannerAdUnitIds = new HashSet<>( 2 );

    public static AppLovinMAXModuleImpl getInstance()
    {
        return instance;
    }

    public AppLovinSdk getSdk()
    {
        return sdk;
    }

    public AppLovinMAXModuleImpl(final ReactApplicationContext reactApplicationContext)
    {
        reactContext = reactApplicationContext;

        // Check that plugin version is compatible with native SDK version
        String minCompatibleNativeSdkVersion = ALCompatibleNativeSdkVersions.get( PLUGIN_VERSION );
        boolean isCompatible = isInclusiveVersion( AppLovinSdk.VERSION, minCompatibleNativeSdkVersion, null );
        if ( !isCompatible )
        {
            throw new RuntimeException( "Incompatible native SDK version " + AppLovinSdk.VERSION + " found for plugin " + PLUGIN_VERSION );
        }

        instance = this;
        currentActivity = reactContext.getCurrentActivity();

        sdk = AppLovinSdk.getInstance( reactContext );

        // Listening to Lifecycle Events
        reactContext.addLifecycleEventListener( this );
    }

    @Nullable
    private Activity maybeGetCurrentActivity()
    {
        // React Native has a bug where `getCurrentActivity()` returns null: https://github.com/facebook/react-native/issues/18345
        // To alleviate the issue - we will store as a static reference (WeakReference unfortunately did not suffice)
        if ( reactContext.hasCurrentActivity() )
        {
            currentActivity = reactContext.getCurrentActivity();
        }

        return currentActivity;
    }

    public void isInitialized(final Promise promise)
    {
        promise.resolve( isPluginInitialized && isSdkInitialized );
    }

    public void initialize(final String pluginVersion, final String sdkKey, final Promise promise)
    {
        // Guard against running init logic multiple times
        if ( isPluginInitialized )
        {
            promise.resolve( getInitializationMessage() );
            return;
        }

        isPluginInitialized = true;

        d( "Initializing AppLovin MAX React Native v" + pluginVersion + "..." );

        if ( TextUtils.isEmpty( sdkKey ) )
        {
            promise.reject( new IllegalStateException( "Unable to initialize AppLovin SDK - no SDK key provided!" ) );
            return;
        }

        AppLovinSdkInitializationConfiguration.Builder initConfigBuidler = AppLovinSdkInitializationConfiguration.builder( sdkKey, reactContext );
        initConfigBuidler.setPluginVersion( "React-Native-" + pluginVersion );
        initConfigBuidler.setMediationProvider( AppLovinMediationProvider.MAX );
        initConfigBuidler.setSegmentCollection( segmentCollectionBuilder.build() );
        if ( initializationAdUnitIdsToSet != null )
        {
            initConfigBuidler.setAdUnitIds( initializationAdUnitIdsToSet );
            initializationAdUnitIdsToSet = null;
        }
        if ( testDeviceAdvertisingIdsToSet != null )
        {
            initConfigBuidler.setTestDeviceAdvertisingIds( testDeviceAdvertisingIdsToSet );
            testDeviceAdvertisingIdsToSet = null;
        }

        // Initialize SDK
        sdk.initialize( initConfigBuidler.build(), appLovinSdkConfiguration -> {
            d( "SDK initialized" );

            sdkConfiguration = appLovinSdkConfiguration;
            isSdkInitialized = true;

            windowManager = (WindowManager) reactContext.getSystemService( Context.WINDOW_SERVICE );

            lastRotation = windowManager.getDefaultDisplay().getRotation();

            // Enable orientation change listener, so that the ad view positions can be updated when the device is rotated.
            new OrientationEventListener( reactContext )
            {
                @Override
                public void onOrientationChanged(final int orientation)
                {
                    int newRotation = windowManager.getDefaultDisplay().getRotation();
                    if ( newRotation != lastRotation )
                    {
                        lastRotation = newRotation;
                        for ( final Map.Entry<String, MaxAdFormat> adUnitFormats : adViewAdFormats.entrySet() )
                        {
                            positionAdView( adUnitFormats.getKey(), adUnitFormats.getValue() );
                        }
                    }
                }
            }.enable();

            promise.resolve( getInitializationMessage() );
        } );
    }

    private WritableMap getInitializationMessage()
    {
        WritableMap message = Arguments.createMap();

        if ( sdkConfiguration != null )
        {
            message.putString( "countryCode", sdkConfiguration.getCountryCode() );
            message.putString( "consentFlowUserGeography", getRawAppLovinConsentFlowUserGeography( sdkConfiguration.getConsentFlowUserGeography() ) );
            message.putBoolean( "isTestModeEnabled", sdkConfiguration.isTestModeEnabled() );
        }

        return message;
    }

    // General Public API

    public void isTablet(final Promise promise)
    {
        Activity currentActivity = maybeGetCurrentActivity();
        Context contextToUse = ( currentActivity != null ) ? currentActivity : reactContext;
        promise.resolve( AppLovinSdkUtils.isTablet( contextToUse ) );
    }

    public void showMediationDebugger()
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showMediationDebugger" );
            return;
        }

        sdk.showMediationDebugger();
    }

    public void setHasUserConsent(final boolean hasUserConsent)
    {
        AppLovinPrivacySettings.setHasUserConsent( hasUserConsent, reactContext );
    }

    public void hasUserConsent(final Promise promise)
    {
        promise.resolve( AppLovinPrivacySettings.hasUserConsent( reactContext ) );
    }

    public void setDoNotSell(final boolean doNotSell)
    {
        AppLovinPrivacySettings.setDoNotSell( doNotSell, reactContext );
    }

    public void isDoNotSell(final Promise promise)
    {
        promise.resolve( AppLovinPrivacySettings.isDoNotSell( reactContext ) );
    }

    public void setUserId(final String userId)
    {
        sdk.getSettings().setUserIdentifier( userId );
    }

    public void setMuted(final boolean muted)
    {
        sdk.getSettings().setMuted( muted );
    }

    public void isMuted(final Promise promise)
    {
        promise.resolve( sdk.getSettings().isMuted() );
    }

    public void setVerboseLogging(final boolean enabled)
    {
        sdk.getSettings().setVerboseLogging( enabled );
    }

    public void setCreativeDebuggerEnabled(final boolean enabled)
    {
        sdk.getSettings().setCreativeDebuggerEnabled( enabled );
    }

    public void setTestDeviceAdvertisingIds(final ReadableArray rawAdvertisingIds)
    {
        List<String> advertisingIds = new ArrayList<>( rawAdvertisingIds.size() );

        // Convert to String List
        for ( Object rawAdvertisingId : rawAdvertisingIds.toArrayList() )
        {
            advertisingIds.add( (String) rawAdvertisingId );
        }

        testDeviceAdvertisingIdsToSet = advertisingIds;
    }

    public void setExtraParameter(final String key, @Nullable final String value)
    {
        if ( TextUtils.isEmpty( key ) )
        {
            e( "ERROR: Failed to set extra parameter for null or empty key: " + key );
            return;
        }

        sdk.getSettings().setExtraParameter( key, value );
    }

    public void setInitializationAdUnitIds(final ReadableArray rawAdUnitIds)
    {
        initializationAdUnitIdsToSet = new ArrayList<>( rawAdUnitIds.size() );

        // Convert to String List
        for ( Object adUnitId : rawAdUnitIds.toArrayList() )
        {
            initializationAdUnitIdsToSet.add( (String) adUnitId );
        }
    }

    // MAX Terms and Privacy Policy Flow

    public void setTermsAndPrivacyPolicyFlowEnabled(final boolean enabled)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setEnabled( enabled );
    }

    public void setPrivacyPolicyUrl(final String urlString)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setPrivacyPolicyUri( Uri.parse( urlString ) );
    }

    public void setTermsOfServiceUrl(final String urlString)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setTermsOfServiceUri( Uri.parse( urlString ) );
    }

    public void setConsentFlowDebugUserGeography(final String userGeography)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setDebugUserGeography( getAppLovinConsentFlowUserGeography( userGeography ) );
    }

    public void showCmpForExistingUser(final Promise promise)
    {
        if ( !isPluginInitialized )
        {
            logUninitializedAccessError( "showCmpForExistingUser", promise );
            return;
        }

        Activity currentActivity = maybeGetCurrentActivity();
        if ( currentActivity == null )
        {
            promise.reject( new IllegalStateException( "ERROR: Failed to execute showCmpForExistingUser() - unable to get current Activity." ) );
            return;
        }

        sdk.getCmpService().showCmpForExistingUser( currentActivity, (@Nullable final AppLovinCmpError error) -> {

            if ( error == null )
            {
                promise.resolve( null );
                return;
            }

            WritableMap params = Arguments.createMap();
            params.putInt( "code", error.getCode().getValue() );
            params.putString( "message", error.getMessage() );
            params.putInt( "cmpCode", error.getCmpCode() );
            params.putString( "cmpMessage", error.getCmpMessage() );
            promise.resolve( params );
        } );
    }

    public void hasSupportedCmp(final Promise promise)
    {
        if ( !isPluginInitialized )
        {
            logUninitializedAccessError( "showCmpForExistingUser", promise );
            return;
        }

        promise.resolve( sdk.getCmpService().hasSupportedCmp() );
    }

    // Segment Targeting

    public void addSegment(final int key, final ReadableArray values, final Promise promise)
    {
        if ( isPluginInitialized )
        {
            promise.reject( new IllegalStateException( "A segment must be added before calling 'AppLovinMAX.initialize(...);'" ) );
            return;
        }

        List<Integer> integerArray = new ArrayList<>( values.size() );

        for ( Object object : values.toArrayList() )
        {
            if ( object instanceof Number )
            {
                integerArray.add( ( (Number) object ).intValue() );
            }
            else
            {
                break;
            }
        }

        if ( values.size() != integerArray.size() )
        {
            promise.reject( new IllegalStateException( "Value for key " + key + " is not an array of integers." ) );
            return;
        }

        segmentCollectionBuilder.addSegment( new MaxSegment( key, integerArray ) );

        promise.resolve( null );
    }

    public void getSegments(final Promise promise)
    {
        if ( !isSdkInitialized )
        {
            promise.reject( new IllegalStateException( "Segments cannot be retrieved before calling 'AppLovinMAX.initialize(...).'" ) );
            return;
        }

        List<MaxSegment> segments = sdk.getSegmentCollection().getSegments();

        if ( segments.isEmpty() )
        {
            promise.resolve( null );
            return;
        }

        Bundle bundle = new Bundle();

        for ( MaxSegment segment : segments )
        {
            // JavaScript can't have integer as a key.
            bundle.putIntegerArrayList( String.valueOf( segment.getKey() ), (ArrayList<Integer>) segment.getValues() );
        }

        promise.resolve( Arguments.fromBundle( bundle ) );
    }

    // EVENT TRACKING

    public void trackEvent(final String event, final ReadableMap parameters)
    {
        // Convert Map<String, Object> type of `parameters.toHashMap()` to Map<String, String>
        Map<String, String> parametersToUse = new HashMap<>();
        if ( parameters != null )
        {
            Map<String, Object> parametersHashMap = parameters.toHashMap();
            for ( String key : parametersHashMap.keySet() )
            {
                parametersToUse.put( key, String.valueOf( parametersHashMap.get( key ) ) );
            }
        }

        sdk.getEventService().trackEvent( event, parametersToUse );
    }

    // BANNERS

    public void createBanner(final String adUnitId, final String bannerPosition, final boolean isAdaptive)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "createBanner" );
            return;
        }

        createAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), bannerPosition, DEFAULT_AD_VIEW_OFFSET, isAdaptive );
    }

    // NOTE: No function overloading in JS so we need new method signature
    public void createBannerWithOffsets(final String adUnitId, final String bannerPosition, final float x, final float y, final boolean isAdaptive)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "createBannerWithOffsets" );
            return;
        }

        createAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), bannerPosition, getOffsetPixels( x, y, reactContext ), isAdaptive );
    }

    public void setBannerBackgroundColor(final String adUnitId, final String hexColorCode)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setBannerBackgroundColor" );
            return;
        }

        setAdViewBackgroundColor( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), hexColorCode );
    }

    public void setBannerPlacement(final String adUnitId, final String placement)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setBannerPlacement" );
            return;
        }

        setAdViewPlacement( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), placement );
    }

    public void setBannerCustomData(final String adUnitId, final String customData)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setBannerCustomData" );
            return;
        }

        setAdViewCustomData( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), customData );
    }

    public void setBannerWidth(final String adUnitId, final int widthDp)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setBannerWidth" );
            return;
        }

        setAdViewWidth( adUnitId, widthDp, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void updateBannerPosition(final String adUnitId, final String bannerPosition)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "updateBannerPosition" );
            return;
        }

        updateAdViewPosition( adUnitId, bannerPosition, DEFAULT_AD_VIEW_OFFSET, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void updateBannerOffsets(final String adUnitId, final float x, final float y)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "updateBannerOffsets" );
            return;
        }

        updateAdViewPosition( adUnitId, adViewPositions.get( adUnitId ), getOffsetPixels( x, y, reactContext ), getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void setBannerExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setBannerExtraParameter" );
            return;
        }

        setAdViewExtraParameters( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), key, value );
    }

    public void setBannerLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        setAdViewLocalExtraParameters( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), entry.getKey(), entry.getValue() );
    }

    public void startBannerAutoRefresh(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "startBannerAutoRefresh" );
            return;
        }

        startAutoRefresh( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void stopBannerAutoRefresh(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "stopBannerAutoRefresh" );
            return;
        }

        stopAutoRefresh( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void showBanner(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showBanner" );
            return;
        }

        showAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void hideBanner(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "hideBanner" );
            return;
        }

        hideAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void destroyBanner(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "destroyBanner" );
            return;
        }

        destroyAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    public void getAdaptiveBannerHeightForWidth(final float width, final Promise promise)
    {
        promise.resolve( getDeviceSpecificBannerAdViewAdFormat().getAdaptiveSize( (int) width, reactContext ).getHeight() );
    }

    // MRECS

    public void createMRec(final String adUnitId, final String mrecPosition)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "createMRec" );
            return;
        }

        createAdView( adUnitId, MaxAdFormat.MREC, mrecPosition, DEFAULT_AD_VIEW_OFFSET, false );
    }

    public void setMRecPlacement(final String adUnitId, @Nullable final String placement)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setMRecPlacement" );
            return;
        }

        setAdViewPlacement( adUnitId, MaxAdFormat.MREC, placement );
    }

    public void setMRecCustomData(final String adUnitId, @Nullable final String customData)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setMRecCustomData" );
            return;
        }

        setAdViewCustomData( adUnitId, MaxAdFormat.MREC, customData );
    }

    public void updateMRecPosition(final String adUnitId, final String mrecPosition)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "updateMRecPosition" );
            return;
        }

        updateAdViewPosition( adUnitId, mrecPosition, DEFAULT_AD_VIEW_OFFSET, MaxAdFormat.MREC );
    }

    public void setMRecExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        setAdViewExtraParameters( adUnitId, MaxAdFormat.MREC, key, value );
    }

    public void setMRecLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        setAdViewLocalExtraParameters( adUnitId, MaxAdFormat.MREC, entry.getKey(), entry.getValue() );
    }

    public void startMRecAutoRefresh(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "startMRecAutoRefresh" );
            return;
        }

        startAutoRefresh( adUnitId, MaxAdFormat.MREC );
    }

    public void stopMRecAutoRefresh(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "stopMRecAutoRefresh" );
            return;
        }

        stopAutoRefresh( adUnitId, MaxAdFormat.MREC );
    }

    public void showMRec(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showMRec" );
            return;
        }

        showAdView( adUnitId, MaxAdFormat.MREC );
    }

    public void hideMRec(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "hideMRec" );
            return;
        }

        hideAdView( adUnitId, MaxAdFormat.MREC );
    }

    public void destroyMRec(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "destroyMRec" );
            return;
        }

        destroyAdView( adUnitId, MaxAdFormat.MREC );
    }

    // INTERSTITIALS

    public void loadInterstitial(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "loadInterstitial" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "loadInterstitial" );
        if ( interstitial == null )
        {
            sendReactNativeEventForAdLoadFailed( AppLovinMAXAdEvents.ON_INTERSTITIAL_LOAD_FAILED_EVENT, adUnitId, null );
            return;
        }

        interstitial.loadAd();
    }

    public void isInterstitialReady(final String adUnitId, final Promise promise)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "isInterstitialReady" );
            promise.resolve( false );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "isInterstitialReady" );
        if ( interstitial == null )
        {
            promise.resolve( false );
            return;
        }

        promise.resolve( interstitial.isReady() );
    }

    public void showInterstitial(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showInterstitial" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "showInterstitial" );
        if ( interstitial == null )
        {
            sendReactNativeEvent( AppLovinMAXAdEvents.ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT, getAdUnitInfo( adUnitId ) );
            return;
        }

        interstitial.showAd( placement, customData );
    }

    public void setInterstitialExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setInterstitialExtraParameter" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "setInterstitialExtraParameter" );
        if ( interstitial == null ) return;

        interstitial.setExtraParameter( key, value );
    }

    public void setInterstitialLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setInterstitialLocalExtraParameter" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "setInterstitialLocalExtraParameter" );
        if ( interstitial == null ) return;

        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        interstitial.setLocalExtraParameter( entry.getKey(), entry.getValue() );
    }

    // REWARDED

    public void loadRewardedAd(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "loadRewardedAd" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "loadRewardedAd" );
        if ( rewardedAd == null )
        {
            sendReactNativeEventForAdLoadFailed( AppLovinMAXAdEvents.ON_REWARDED_AD_LOAD_FAILED_EVENT, adUnitId, null );
            return;
        }

        rewardedAd.loadAd();
    }

    public void isRewardedAdReady(final String adUnitId, final Promise promise)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "isRewardedAdReady" );
            promise.resolve( false );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "isRewardedAdReady" );
        if ( rewardedAd == null )
        {
            promise.resolve( false );
            return;
        }

        promise.resolve( rewardedAd.isReady() );
    }

    public void showRewardedAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showRewardedAd" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "showRewardedAd" );
        if ( rewardedAd == null )
        {
            sendReactNativeEvent( AppLovinMAXAdEvents.ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT, getAdUnitInfo( adUnitId ) );
            return;
        }

        rewardedAd.showAd( placement, customData );
    }

    public void setRewardedAdExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setRewardedAdExtraParameter" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "setRewardedAdExtraParameter" );
        if ( rewardedAd == null ) return;

        rewardedAd.setExtraParameter( key, value );
    }

    public void setRewardedAdLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setRewardedAdLocalExtraParameter" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "setRewardedAdLocalExtraParameter" );
        if ( rewardedAd == null ) return;

        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        rewardedAd.setLocalExtraParameter( entry.getKey(), entry.getValue() );
    }

    // APP OPEN AD

    public void loadAppOpenAd(final String adUnitId)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "loadAppOpenAd" );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        appOpenAd.loadAd();
    }

    public void isAppOpenAdReady(final String adUnitId, final Promise promise)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "isAppOpenAdReady" );
            promise.resolve( false );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        promise.resolve( appOpenAd.isReady() );
    }

    public void showAppOpenAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showAppOpenAd" );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        appOpenAd.showAd( placement, customData );
    }

    public void setAppOpenAdExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setAppOpenAdExtraParameter" );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        appOpenAd.setExtraParameter( key, value );
    }

    public void setAppOpenAdLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        appOpenAd.setLocalExtraParameter( entry.getKey(), entry.getValue() );
    }

    // ADVIEW PRELOADING

    public void preloadNativeUIComponentAdView(final String adUnitId, final String adFormatStr, final boolean isAdaptive, @Nullable final String placement, @Nullable final String customData, @Nullable final ReadableMap extraParameterMap, @Nullable final ReadableMap localExtraParameterMap, final Promise promise)
    {
        MaxAdFormat adFormat;

        if ( "BANNER".equalsIgnoreCase( adFormatStr ) )
        {
            adFormat = getDeviceSpecificBannerAdViewAdFormat();
        }
        else if ( "MREC".equalsIgnoreCase( adFormatStr ) )
        {
            adFormat = MaxAdFormat.MREC;
        }
        else
        {
            promise.reject( new IllegalStateException( "invalid ad format: " + adFormatStr ) );
            return;
        }

        final MaxAdFormat finalAdFormat = adFormat;
        final Map<String, Object> extraParameters = ( extraParameterMap != null ) ? extraParameterMap.toHashMap() : null;
        final Map<String, Object> localExtraParameters = ( localExtraParameterMap != null ) ? localExtraParameterMap.toHashMap() : null;

        reactContext.runOnUiQueueThread( () -> AppLovinMAXAdView.preloadNativeUIComponentAdView( adUnitId,
                                                                                                 finalAdFormat,
                                                                                                 isAdaptive,
                                                                                                 placement,
                                                                                                 customData,
                                                                                                 extraParameters,
                                                                                                 localExtraParameters,
                                                                                                 promise,
                                                                                                 reactContext ) );
    }


    public void destroyNativeUIComponentAdView(final int adViewId, final Promise promise)
    {
        reactContext.runOnUiQueueThread( () -> AppLovinMAXAdView.destroyNativeUIComponentAdView( adViewId, promise ) );
    }

    // AD CALLBACKS

    @Override
    public void onAdLoaded(MaxAd ad)
    {
        String name;
        MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat.isAdViewAd() )
        {
            name = ( MaxAdFormat.MREC == adFormat ) ? AppLovinMAXAdEvents.ON_MREC_AD_LOADED_EVENT : AppLovinMAXAdEvents.ON_BANNER_AD_LOADED_EVENT;

            String adViewPosition = adViewPositions.get( ad.getAdUnitId() );
            if ( AppLovinSdkUtils.isValidString( adViewPosition ) )
            {
                // Only position ad if not native UI component
                positionAdView( ad );
            }

            // Do not auto-refresh by default if the ad view is not showing yet (e.g. first load during app launch and publisher does not automatically show banner upon load success)
            // We will resume auto-refresh in {@link #showBanner(String)}.
            MaxAdView adView = retrieveAdView( ad.getAdUnitId(), adFormat );
            if ( adView != null && adView.getVisibility() != View.VISIBLE )
            {
                adView.stopAutoRefresh();
            }
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_LOADED_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_LOADED_EVENT;
        }
        else if ( MaxAdFormat.APP_OPEN == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_LOADED_EVENT;
        }
        else
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdLoadFailed(@NonNull final String adUnitId, @NonNull final MaxError error)
    {
        if ( TextUtils.isEmpty( adUnitId ) )
        {
            logStackTrace( new IllegalArgumentException( "adUnitId cannot be null" ) );
            return;
        }

        String name;
        if ( adViews.containsKey( adUnitId ) )
        {
            name = ( MaxAdFormat.MREC == adViewAdFormats.get( adUnitId ) ) ? AppLovinMAXAdEvents.ON_MREC_AD_LOAD_FAILED_EVENT : AppLovinMAXAdEvents.ON_BANNER_AD_LOAD_FAILED_EVENT;
        }
        else if ( interstitials.containsKey( adUnitId ) )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_LOAD_FAILED_EVENT;
        }
        else if ( rewardedAds.containsKey( adUnitId ) )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_LOAD_FAILED_EVENT;
        }
        else if ( appOpenAds.containsKey( adUnitId ) )
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_LOAD_FAILED_EVENT;
        }
        else
        {
            logStackTrace( new IllegalStateException( "invalid adUnitId: " + adUnitId ) );
            return;
        }

        sendReactNativeEventForAdLoadFailed( name, adUnitId, error );
    }

    private void sendReactNativeEventForAdLoadFailed(final String name, final String adUnitId, @Nullable final MaxError error)
    {
        sendReactNativeEvent( name, getAdLoadFailedInfo( adUnitId, error ) );
    }

    @Override
    public void onAdClicked(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        final String name;
        if ( MaxAdFormat.BANNER == adFormat || MaxAdFormat.LEADER == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_BANNER_AD_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.MREC == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_MREC_AD_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.APP_OPEN == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_CLICKED_EVENT;
        }
        else
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdDisplayed(final MaxAd ad)
    {
        // BMLs do not support [DISPLAY] events
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.INTERSTITIAL && adFormat != MaxAdFormat.REWARDED && adFormat != MaxAdFormat.APP_OPEN ) return;

        final String name;
        if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_DISPLAYED_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_DISPLAYED_EVENT;
        }
        else // APP OPEN
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_DISPLAYED_EVENT;
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, @NonNull final MaxError error)
    {
        // BMLs do not support [DISPLAY] events
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.INTERSTITIAL && adFormat != MaxAdFormat.REWARDED && adFormat != MaxAdFormat.APP_OPEN ) return;

        final String name;
        if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT;
        }
        else // APP OPEN
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT;
        }

        sendReactNativeEvent( name, getAdDisplayFailedInfo( ad, error ) );
    }

    @Override
    public void onAdHidden(final MaxAd ad)
    {
        // BMLs do not support [HIDDEN] events
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.INTERSTITIAL && adFormat != MaxAdFormat.REWARDED && adFormat != MaxAdFormat.APP_OPEN ) return;

        String name;
        if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_HIDDEN_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_HIDDEN_EVENT;
        }
        else // APP OPEN
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_HIDDEN_EVENT;
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdExpanded(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        if ( !adFormat.isAdViewAd() )
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( ( MaxAdFormat.MREC == adFormat ) ? AppLovinMAXAdEvents.ON_MREC_AD_EXPANDED_EVENT : AppLovinMAXAdEvents.ON_BANNER_AD_EXPANDED_EVENT, getAdInfo( ad ) );
    }

    @Override
    public void onAdCollapsed(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        if ( !adFormat.isAdViewAd() )
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( ( MaxAdFormat.MREC == adFormat ) ? AppLovinMAXAdEvents.ON_MREC_AD_COLLAPSED_EVENT : AppLovinMAXAdEvents.ON_BANNER_AD_COLLAPSED_EVENT, getAdInfo( ad ) );
    }

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        final String name;
        if ( MaxAdFormat.BANNER == adFormat || MaxAdFormat.LEADER == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_BANNER_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.MREC == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_MREC_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_INTERSTITIAL_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_REWARDED_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.APP_OPEN == adFormat )
        {
            name = AppLovinMAXAdEvents.ON_APPOPEN_AD_REVENUE_PAID;
        }
        else
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onUserRewarded(final MaxAd ad, @NonNull final MaxReward reward)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.REWARDED )
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        final String rewardLabel = reward.getLabel();
        final int rewardAmount = reward.getAmount();

        WritableMap params = getAdInfo( ad );
        params.putString( "rewardLabel", rewardLabel );
        params.putInt( "rewardAmount", rewardAmount );
        sendReactNativeEvent( AppLovinMAXAdEvents.ON_REWARDED_AD_RECEIVED_REWARD_EVENT, params );
    }

    // INTERNAL METHODS

    private void createAdView(final String adUnitId, final MaxAdFormat adFormat, final String adViewPosition, final Point adViewOffsetPixels, final boolean isAdaptive)
    {
        // Run on main thread to ensure there are no concurrency issues with other ad view methods
        reactContext.runOnUiQueueThread( () -> {

            d( "Creating " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\", position: \"" + adViewPosition + "\", and offset: " + adViewOffsetPixels );

            // Retrieve ad view from the map
            final MaxAdView adView = retrieveAdView( adUnitId, adFormat, adViewPosition, adViewOffsetPixels, isAdaptive );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setVisibility( View.GONE );

            if ( adView.getParent() == null )
            {
                maybeAttachToCurrentActivity( adView );

                // Position ad view immediately so if publisher sets color before ad loads, it will not be the size of the screen
                adViewAdFormats.put( adUnitId, adFormat );
                positionAdView( adUnitId, adFormat );
            }

            adView.loadAd();

            // The publisher may have requested to show the banner before it was created. Now that the banner is created, show it.
            if ( adUnitIdsToShowAfterCreate.contains( adUnitId ) )
            {
                showAdView( adUnitId, adFormat );
                adUnitIdsToShowAfterCreate.remove( adUnitId );
            }
        } );
    }

    private void setAdViewPlacement(final String adUnitId, final MaxAdFormat adFormat, final String placement)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Setting placement \"" + placement + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat, "", DEFAULT_AD_VIEW_OFFSET, true );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setPlacement( placement );
        } );
    }

    private void setAdViewCustomData(final String adUnitId, final MaxAdFormat adFormat, final String customData)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Setting custom data \"" + customData + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat, "", DEFAULT_AD_VIEW_OFFSET, true );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setCustomData( customData );
        } );
    }

    private void setAdViewWidth(final String adUnitId, final int widthDp, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Setting width " + widthDp + " for \"" + adFormat + "\" with ad unit identifier \"" + adUnitId + "\"" );

            int minWidthDp = adFormat.getSize().getWidth();
            if ( widthDp < minWidthDp )
            {
                e( "The provided width: " + widthDp + "dp is smaller than the minimum required width: " + minWidthDp + "dp for ad format: " + adFormat + ". Please set the width higher than the minimum required." );
            }

            adViewWidths.put( adUnitId, widthDp );
            positionAdView( adUnitId, adFormat );
        } );
    }

    private void updateAdViewPosition(final String adUnitId, final String adViewPosition, final Point offsetPixels, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Updating " + adFormat.getLabel() + " position to \"" + adViewPosition + "\" for ad unit id \"" + adUnitId + "\"" );

            // Retrieve ad view from the map
            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adViewPositions.put( adUnitId, adViewPosition );
            adViewOffsets.put( adUnitId, offsetPixels );
            positionAdView( adUnitId, adFormat );
        } );
    }

    private void showAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Showing " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist for ad unit id " + adUnitId );

                // The adView has not yet been created. Store the ad unit ID, so that it can be displayed once the banner has been created.
                adUnitIdsToShowAfterCreate.add( adUnitId );
                return;
            }

            maybeAttachToCurrentActivity( adView );

            adView.setVisibility( View.VISIBLE );
            adView.startAutoRefresh();
        } );
    }

    private void hideAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Hiding " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );
            adUnitIdsToShowAfterCreate.remove( adUnitId );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setVisibility( View.GONE );
            adView.stopAutoRefresh();
        } );
    }

    private void destroyAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Destroying " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            final ViewParent parent = adView.getParent();
            if ( parent instanceof ViewGroup )
            {
                ( (ViewGroup) parent ).removeView( adView );
            }

            adView.setListener( null );
            adView.setRevenueListener( null );
            adView.destroy();

            adViews.remove( adUnitId );
            adViewAdFormats.remove( adUnitId );
            adViewPositions.remove( adUnitId );
            adViewOffsets.remove( adUnitId );
            adViewWidths.remove( adUnitId );
        } );
    }

    private void setAdViewBackgroundColor(final String adUnitId, final MaxAdFormat adFormat, final String hexColorCode)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Setting " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\" to color: " + hexColorCode );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setBackgroundColor( Color.parseColor( hexColorCode ) );
        } );
    }

    private void setAdViewExtraParameters(final String adUnitId, final MaxAdFormat adFormat, final String key, final String value)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Setting " + adFormat.getLabel() + " extra with key: \"" + key + "\" value: " + value );

            // Retrieve ad view from the map
            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setExtraParameter( key, value );

            // Handle local changes as needed
            if ( "force_banner".equalsIgnoreCase( key ) && MaxAdFormat.MREC != adFormat )
            {
                final MaxAdFormat forcedAdFormat;

                boolean shouldForceBanner = Boolean.parseBoolean( value );
                if ( shouldForceBanner )
                {
                    forcedAdFormat = MaxAdFormat.BANNER;
                }
                else
                {
                    forcedAdFormat = getDeviceSpecificBannerAdViewAdFormat();
                }

                adViewAdFormats.put( adUnitId, forcedAdFormat );
                positionAdView( adUnitId, forcedAdFormat );
            }
            else if ( "adaptive_banner".equalsIgnoreCase( key ) )
            {
                e( "Setting adaptive banners via extra parameters is deprecated and will be removed in a future plugin version. Please use the BannerAd.createAd(adUnitId: string, position: AdViewPosition, xOffset: number, yOffset: number, isAdaptive: boolean) API to properly configure adaptive banners." );

                boolean useAdaptiveBannerAdSize = Boolean.parseBoolean( value );
                if ( useAdaptiveBannerAdSize )
                {
                    disabledAdaptiveBannerAdUnitIds.remove( adUnitId );
                }
                else
                {
                    disabledAdaptiveBannerAdUnitIds.add( adUnitId );
                }

                positionAdView( adUnitId, adFormat );
            }
        } );
    }

    private void setAdViewLocalExtraParameters(final String adUnitId, final MaxAdFormat adFormat, final String key, final Object value)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Setting " + adFormat.getLabel() + " local extra with key: \"" + key + "\" value: " + value );

            // Retrieve ad view from the map
            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.setLocalExtraParameter( key, value );
        } );
    }

    private void startAutoRefresh(final String adUnitId, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Starting auto refresh " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.startAutoRefresh();
        } );
    }

    private void stopAutoRefresh(final String adUnitId, final MaxAdFormat adFormat)
    {
        reactContext.runOnUiQueueThread( () -> {

            d( "Stopping auto refresh " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
            if ( adView == null )
            {
                e( adFormat.getLabel() + " does not exist" );
                return;
            }

            adView.stopAutoRefresh();
        } );
    }

    private void maybeAttachToCurrentActivity(final MaxAdView adView)
    {
        if ( adView.getParent() == null )
        {
            final Activity currentActivity = maybeGetCurrentActivity();
            if ( currentActivity != null )
            {
                final RelativeLayout relativeLayout = new RelativeLayout( reactContext );
                relativeLayout.addView( adView );

                currentActivity.addContentView( relativeLayout, new LinearLayout.LayoutParams( LinearLayout.LayoutParams.MATCH_PARENT,
                                                                                               LinearLayout.LayoutParams.MATCH_PARENT ) );
            }
        }
    }

    @Nullable
    private MaxInterstitialAd retrieveInterstitial(final String adUnitId, final String callingMethod)
    {
        Activity currentActivity = maybeGetCurrentActivity();
        if ( currentActivity == null )
        {
            e( "Unable to get current Activity, returning null interstitial for " + callingMethod + "()" );
            return null;
        }

        MaxInterstitialAd result = interstitials.get( adUnitId );
        if ( result == null )
        {
            result = new MaxInterstitialAd( adUnitId, sdk, currentActivity );
            result.setListener( this );
            result.setRevenueListener( this );

            interstitials.put( adUnitId, result );
        }

        return result;
    }

    @Nullable
    private MaxRewardedAd retrieveRewardedAd(final String adUnitId, final String callingMethod)
    {
        Activity currentActivity = maybeGetCurrentActivity();
        if ( currentActivity == null )
        {
            e( "Unable to get current Activity, returning null rewarded ad for " + callingMethod + "()" );
            return null;
        }

        MaxRewardedAd result = rewardedAds.get( adUnitId );
        if ( result == null )
        {
            result = MaxRewardedAd.getInstance( adUnitId, sdk, currentActivity );
            result.setListener( this );
            result.setRevenueListener( this );

            rewardedAds.put( adUnitId, result );
        }

        return result;
    }

    private MaxAppOpenAd retrieveAppOpenAd(final String adUnitId)
    {
        MaxAppOpenAd result = appOpenAds.get( adUnitId );
        if ( result == null )
        {
            result = new MaxAppOpenAd( adUnitId, sdk );
            result.setListener( this );
            result.setRevenueListener( this );

            appOpenAds.put( adUnitId, result );
        }

        return result;
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat)
    {
        return retrieveAdView( adUnitId, adFormat, null, DEFAULT_AD_VIEW_OFFSET, true );
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat, String adViewPosition, Point adViewOffsetPixels, final boolean isAdaptive)
    {
        MaxAdView result = adViews.get( adUnitId );
        if ( result == null && adViewPosition != null && adViewOffsetPixels != null )
        {
            MaxAdViewConfiguration.Builder builder = MaxAdViewConfiguration.builder();

            // Set adaptive type only for banner ads. If adaptive is enabled, use ANCHORED; otherwise, fall back to NONE.
            if ( adFormat.isBannerOrLeaderAd() )
            {
                if ( isAdaptive )
                {
                    builder.setAdaptiveType( MaxAdViewConfiguration.AdaptiveType.ANCHORED );
                }
                else
                {
                    builder.setAdaptiveType( MaxAdViewConfiguration.AdaptiveType.NONE );
                    disabledAdaptiveBannerAdUnitIds.add( adUnitId );
                }
            }

            result = new MaxAdView( adUnitId, adFormat, builder.build() );
            result.setListener( this );
            result.setRevenueListener( this );

            // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
            result.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );

            adViews.put( adUnitId, result );
            adViewPositions.put( adUnitId, adViewPosition );
            adViewOffsets.put( adUnitId, adViewOffsetPixels );
        }

        return result;
    }

    private void positionAdView(MaxAd ad)
    {
        positionAdView( ad.getAdUnitId(), ad.getFormat() );
    }

    private void positionAdView(String adUnitId, MaxAdFormat adFormat)
    {
        final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
        if ( adView == null )
        {
            e( adFormat.getLabel() + " does not exist" );
            return;
        }

        final RelativeLayout relativeLayout = (RelativeLayout) adView.getParent();
        if ( relativeLayout == null )
        {
            e( adFormat.getLabel() + "'s parent does not exist" );
            return;
        }

        final Rect windowRect = new Rect();
        relativeLayout.getWindowVisibleDisplayFrame( windowRect );

        final String adViewPosition = adViewPositions.get( adUnitId );
        final Point adViewOffset = adViewOffsets.get( adUnitId );
        final boolean isAdaptiveBannerDisabled = disabledAdaptiveBannerAdUnitIds.contains( adUnitId );
        final boolean isWidthDpOverridden = adViewWidths.containsKey( adUnitId );

        //
        // Determine ad width
        //
        final int adViewWidthDp;

        // Check if publisher has overridden width as dp
        if ( isWidthDpOverridden )
        {
            adViewWidthDp = adViewWidths.get( adUnitId );
        }
        // Top center / bottom center stretches full screen
        else if ( TOP_CENTER.equalsIgnoreCase( adViewPosition ) || BOTTOM_CENTER.equalsIgnoreCase( adViewPosition ) )
        {
            int adViewWidthPx = windowRect.width();
            adViewWidthDp = AppLovinSdkUtils.pxToDp( reactContext, adViewWidthPx );
        }
        // Else use standard widths of 320, 728, or 300
        else
        {
            adViewWidthDp = adFormat.getSize().getWidth();
        }

        //
        // Determine ad height
        //
        final int adViewHeightDp;

        if ( ( adFormat == MaxAdFormat.BANNER || adFormat == MaxAdFormat.LEADER ) && !isAdaptiveBannerDisabled )
        {
            adViewHeightDp = adFormat.getAdaptiveSize( adViewWidthDp, reactContext ).getHeight();
        }
        else
        {
            adViewHeightDp = adFormat.getSize().getHeight();
        }

        final int widthPx = AppLovinSdkUtils.dpToPx( reactContext, adViewWidthDp );
        final int heightPx = AppLovinSdkUtils.dpToPx( reactContext, adViewHeightDp );

        final RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) adView.getLayoutParams();
        params.height = heightPx;
        adView.setLayoutParams( params );

        // Parse gravity
        int gravity = 0;

        // Reset rotation, translation and margins so that the banner can be positioned again
        adView.setRotation( 0 );
        adView.setTranslationX( 0 );
        params.setMargins( 0, 0, 0, 0 );

        if ( CENTERED.equalsIgnoreCase( adViewPosition ) )
        {
            gravity = Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL;

            if ( MaxAdFormat.MREC == adFormat || isWidthDpOverridden )
            {
                params.width = widthPx;
            }
            else
            {
                params.width = RelativeLayout.LayoutParams.MATCH_PARENT;
            }
        }
        else
        {
            // Figure out vertical params
            if ( adViewPosition.contains( "top" ) )
            {
                gravity = Gravity.TOP;
            }
            else if ( adViewPosition.contains( "bottom" ) )
            {
                gravity = Gravity.BOTTOM;
            }

            // Figure out horizontal params
            if ( adViewPosition.contains( "center" ) )
            {
                gravity |= Gravity.CENTER_HORIZONTAL;

                if ( MaxAdFormat.MREC == adFormat || isWidthDpOverridden )
                {
                    params.width = widthPx;
                }
                else
                {
                    params.width = RelativeLayout.LayoutParams.MATCH_PARENT;
                }
            }
            else
            {
                params.width = widthPx;

                if ( adViewPosition.contains( "left" ) )
                {
                    gravity |= Gravity.LEFT;
                }
                else if ( adViewPosition.contains( "right" ) )
                {
                    gravity |= Gravity.RIGHT;
                }
            }
        }

        relativeLayout.setGravity( gravity );
        relativeLayout.setPadding( adViewOffset.x, adViewOffset.y, adViewOffset.x, adViewOffset.y );
    }

    // Utility Methods

    private void logInvalidAdFormat(MaxAdFormat adFormat)
    {
        logStackTrace( new IllegalStateException( "invalid ad format: " + adFormat ) );
    }

    private void logStackTrace(Exception e)
    {
        e( Log.getStackTraceString( e ) );
    }

    public static void logUninitializedAccessError(final String callingMethod)
    {
        logUninitializedAccessError( callingMethod, null );
    }

    public static void logUninitializedAccessError(final String callingMethod, @Nullable final Promise promise)
    {
        String message = "ERROR: Failed to execute " + callingMethod + "() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!";

        if ( promise == null )
        {
            e( message );
            return;
        }

        promise.reject( new IllegalStateException( message ) );
    }

    public static void d(final String message)
    {
        final String fullMessage = "[" + TAG + "] " + message;
        Log.d( SDK_TAG, fullMessage );
    }

    public static void w(final String message)
    {
        final String fullMessage = "[" + TAG + "] " + message;
        Log.w( SDK_TAG, fullMessage );
    }

    public static void e(final String message)
    {
        final String fullMessage = "[" + TAG + "] " + message;
        Log.e( SDK_TAG, fullMessage );
    }

    private MaxAdFormat getDeviceSpecificBannerAdViewAdFormat()
    {
        return getDeviceSpecificBannerAdViewAdFormat( reactContext );
    }

    public static MaxAdFormat getDeviceSpecificBannerAdViewAdFormat(final Context context)
    {
        return AppLovinSdkUtils.isTablet( context ) ? MaxAdFormat.LEADER : MaxAdFormat.BANNER;
    }

    private static Point getOffsetPixels(final float xDp, final float yDp, final Context context)
    {
        return new Point( AppLovinSdkUtils.dpToPx( context, (int) xDp ), AppLovinSdkUtils.dpToPx( context, (int) yDp ) );
    }

    private static ConsentFlowUserGeography getAppLovinConsentFlowUserGeography(final String userGeography)
    {
        if ( USER_GEOGRAPHY_GDPR.equalsIgnoreCase( userGeography ) )
        {
            return ConsentFlowUserGeography.GDPR;
        }
        else if ( USER_GEOGRAPHY_OTHER.equalsIgnoreCase( userGeography ) )
        {
            return ConsentFlowUserGeography.OTHER;
        }

        return ConsentFlowUserGeography.UNKNOWN;
    }

    private static String getRawAppLovinConsentFlowUserGeography(final ConsentFlowUserGeography userGeography)
    {
        if ( ConsentFlowUserGeography.GDPR == userGeography )
        {
            return USER_GEOGRAPHY_GDPR;
        }
        else if ( ConsentFlowUserGeography.OTHER == userGeography )
        {
            return USER_GEOGRAPHY_OTHER;
        }

        return USER_GEOGRAPHY_UNKNOWN;
    }

    // AD INFO

    public WritableMap getAdInfo(final MaxAd ad)
    {
        WritableMap adInfo = Arguments.createMap();
        adInfo.putString( "adUnitId", ad.getAdUnitId() );
        adInfo.putString( "adFormat", ad.getFormat().getLabel() );
        adInfo.putString( "networkName", ad.getNetworkName() );
        adInfo.putString( "networkPlacement", ad.getNetworkPlacement() );

        adInfo.putString( "creativeId", AppLovinSdkUtils.isValidString( ad.getCreativeId() ) ? ad.getCreativeId() : "" );
        adInfo.putString( "placement", AppLovinSdkUtils.isValidString( ad.getPlacement() ) ? ad.getPlacement() : "" );
        adInfo.putDouble( "revenue", ad.getRevenue() );
        adInfo.putString( "revenuePrecision", ad.getRevenuePrecision() );
        adInfo.putMap( "waterfall", createAdWaterfallInfo( ad.getWaterfall() ) );
        adInfo.putDouble( "latencyMillis", ad.getRequestLatencyMillis() );
        adInfo.putString( "dspName", AppLovinSdkUtils.isValidString( ad.getDspName() ) ? ad.getDspName() : "" );

        WritableMap sizeObject = Arguments.createMap();
        sizeObject.putInt( "width", ad.getSize().getWidth() );
        sizeObject.putInt( "height", ad.getSize().getHeight() );
        adInfo.putMap( "size", sizeObject );

        return adInfo;
    }

    public WritableMap getAdLoadFailedInfo(final String adUnitId, @Nullable final MaxError error)
    {
        WritableMap errInfo = Arguments.createMap();
        errInfo.putString( "adUnitId", adUnitId );

        if ( error != null )
        {
            errInfo.putInt( "code", error.getCode() );
            errInfo.putString( "message", error.getMessage() );
            errInfo.putInt( "mediatedNetworkErrorCode", error.getMediatedNetworkErrorCode() );
            errInfo.putString( "mediatedNetworkErrorMessage", error.getMediatedNetworkErrorMessage() );
            errInfo.putString( "adLoadFailureInfo", error.getAdLoadFailureInfo() );
            errInfo.putMap( "waterfall", createAdWaterfallInfo( error.getWaterfall() ) );
        }
        else
        {
            errInfo.putInt( "code", MaxErrorCode.UNSPECIFIED );
        }

        return errInfo;
    }

    public WritableMap getAdDisplayFailedInfo(final MaxAd ad, final MaxError error)
    {
        WritableMap info = getAdInfo( ad );
        info.putInt( "code", error.getCode() );
        info.putString( "message", error.getMessage() );
        info.putInt( "mediatedNetworkErrorCode", error.getMediatedNetworkErrorCode() );
        info.putString( "mediatedNetworkErrorMessage", error.getMediatedNetworkErrorMessage() );
        return info;
    }

    private WritableMap getAdUnitInfo(final String adUnitId)
    {
        WritableMap info = Arguments.createMap();
        info.putString( "adUnitId", adUnitId );
        return info;
    }

    // AD WATERFALL INFO

    private WritableMap createAdWaterfallInfo(final MaxAdWaterfallInfo waterfallInfo)
    {
        WritableMap waterfallInfoObject = Arguments.createMap();
        if ( waterfallInfo == null ) return waterfallInfoObject;

        waterfallInfoObject.putString( "name", waterfallInfo.getName() );
        waterfallInfoObject.putString( "testName", waterfallInfo.getTestName() );

        WritableArray networkResponsesArray = Arguments.createArray();
        for ( MaxNetworkResponseInfo response : waterfallInfo.getNetworkResponses() )
        {
            networkResponsesArray.pushMap( createNetworkResponseInfo( response ) );
        }
        waterfallInfoObject.putArray( "networkResponses", networkResponsesArray );

        waterfallInfoObject.putDouble( "latencyMillis", waterfallInfo.getLatencyMillis() );

        return waterfallInfoObject;
    }

    private WritableMap createNetworkResponseInfo(final MaxNetworkResponseInfo response)
    {
        WritableMap networkResponseObject = Arguments.createMap();
        networkResponseObject.putInt( "adLoadState", response.getAdLoadState().ordinal() );

        MaxMediatedNetworkInfo mediatedNetworkInfo = response.getMediatedNetwork();
        if ( mediatedNetworkInfo != null )
        {
            WritableMap networkInfoObject = Arguments.createMap();
            networkInfoObject.putString( "name", mediatedNetworkInfo.getName() );
            networkInfoObject.putString( "adapterClassName", mediatedNetworkInfo.getAdapterClassName() );
            networkInfoObject.putString( "adapterVersion", mediatedNetworkInfo.getAdapterVersion() );
            networkInfoObject.putString( "sdkVersion", mediatedNetworkInfo.getSdkVersion() );

            networkResponseObject.putMap( "mediatedNetwork", networkInfoObject );
        }

        Bundle credentialBundle = response.getCredentials();
        WritableMap credentials = Arguments.createMap();
        for ( String key : credentialBundle.keySet() )
        {
            Object obj = credentialBundle.get( key );
            if ( obj instanceof String )
            {
                credentials.putString( key, (String) obj );
            }
        }
        networkResponseObject.putMap( "credentials", credentials );

        MaxError error = response.getError();
        if ( error != null )
        {
            WritableMap errorObject = Arguments.createMap();
            errorObject.putString( "message", error.getMessage() );
            errorObject.putString( "adLoadFailureInfo", error.getAdLoadFailureInfo() );
            errorObject.putInt( "code", error.getCode() );

            networkResponseObject.putMap( "error", errorObject );
        }

        networkResponseObject.putDouble( "latencyMillis", response.getLatencyMillis() );

        return networkResponseObject;
    }

    // Amazon

    @SuppressWarnings("unused")
    public void setAmazonBannerResult(final Object result, final String adUnitId)
    {
        setAmazonResult( result, adUnitId, MaxAdFormat.BANNER );
    }

    @SuppressWarnings("unused")
    public void setAmazonMRecResult(final Object result, final String adUnitId)
    {
        setAmazonResult( result, adUnitId, MaxAdFormat.MREC );
    }

    @SuppressWarnings("unused")
    public void setAmazonInterstitialResult(final Object result, final String adUnitId)
    {
        setAmazonResult( result, adUnitId, MaxAdFormat.INTERSTITIAL );
    }

    @SuppressWarnings("unused")
    public void setAmazonRewardedResult(final Object result, final String adUnitId)
    {
        setAmazonResult( result, adUnitId, MaxAdFormat.REWARDED );
    }

    private void setAmazonResult(final Object result, final String adUnitId, final MaxAdFormat adFormat)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "Failed to set Amazon result - SDK not initialized: " + adUnitId );
            return;
        }

        if ( result == null )
        {
            e( "Failed to set Amazon result - null value" );
            return;
        }

        String key = getLocalExtraParameterKeyForAmazonResult( result );

        if ( adFormat == MaxAdFormat.INTERSTITIAL )
        {
            MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "setAmazonResult" );
            if ( interstitial == null )
            {
                e( "Failed to set Amazon result - unable to find interstitial" );
                return;
            }

            interstitial.setLocalExtraParameter( key, result );
        }
        else if ( adFormat == MaxAdFormat.REWARDED )
        {
            MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "setAmazonResult" );
            if ( rewardedAd == null )
            {
                e( "Failed to set Amazon result - unable to find rewarded ad" );
                return;
            }

            rewardedAd.setLocalExtraParameter( key, result );
        }
        else // MaxAdFormat.BANNER or MaxAdFormat.MREC
        {
            MaxAdView adView = AppLovinMAXAdView.getInstance( adUnitId );

            if ( adView == null )
            {
                adView = retrieveAdView( adUnitId, adFormat );
            }

            if ( adView != null )
            {
                adView.setLocalExtraParameter( key, result );
            }
            else
            {
                e( "Failed to set Amazon result - unable to find " + adFormat );
            }
        }
    }

    private String getLocalExtraParameterKeyForAmazonResult(final Object /* DTBAdResponse or AdError */ result)
    {
        String className = result.getClass().getSimpleName();
        return "DTBAdResponse".equalsIgnoreCase( className ) ? "amazon_ad_response" : "amazon_ad_error";
    }

    // Lifecycle Events

    @Override
    public void onHostResume() { }

    @Override
    public void onHostPause() { }

    @Override
    public void onHostDestroy()
    {
        // Make copy because `destroyAdView()` will remove from `adViews`
        List<MaxAdView> adViewList = new ArrayList<>( adViews.values() );
        for ( MaxAdView adView : adViewList )
        {
            destroyAdView( adView.getAdUnitId(), adView.getAdFormat() );
        }

        for ( MaxInterstitialAd interstitialAd : interstitials.values() )
        {
            interstitialAd.destroy();
        }
        interstitials.clear();

        for ( MaxRewardedAd rewardedAd : rewardedAds.values() )
        {
            rewardedAd.destroy();
        }
        rewardedAds.clear();
    }

    // React Native Bridge

    public void sendReactNativeEvent(final String name, @Nullable final WritableMap params)
    {
        reactContext
            .getJSModule( RCTDeviceEventEmitter.class )
            .emit( name, params );
    }

    public void sendReactNativeViewEvent(final int surfaceId, final int viewId, final String eventName, final WritableMap payload)
    {
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag( reactContext, viewId );
        if ( eventDispatcher != null )
        {
            eventDispatcher.dispatchEvent( new OnViewEvent( surfaceId, viewId, eventName, payload ) );
        }
    }

    private class OnViewEvent
        extends Event<OnViewEvent>
    {
        private final WritableMap payload;
        private final String      eventName;

        OnViewEvent(final int surfaceId, final int viewId, final String eventName, @Nullable final WritableMap payload)
        {
            super( surfaceId, viewId );
            this.eventName = eventName;
            this.payload = payload;
        }

        @Override
        public String getEventName()
        {
            return eventName;
        }

        @Nullable
        @Override
        protected WritableMap getEventData()
        {
            return payload;
        }
    }

    @Nullable
    public Map<String, Object> getConstants()
    {
        final Map<String, Object> constants = new HashMap<>();

        constants.put( "ON_MREC_AD_LOADED_EVENT", AppLovinMAXAdEvents.ON_MREC_AD_LOADED_EVENT );
        constants.put( "ON_MREC_AD_LOAD_FAILED_EVENT", AppLovinMAXAdEvents.ON_MREC_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_MREC_AD_CLICKED_EVENT", AppLovinMAXAdEvents.ON_MREC_AD_CLICKED_EVENT );
        constants.put( "ON_MREC_AD_COLLAPSED_EVENT", AppLovinMAXAdEvents.ON_MREC_AD_COLLAPSED_EVENT );
        constants.put( "ON_MREC_AD_EXPANDED_EVENT", AppLovinMAXAdEvents.ON_MREC_AD_EXPANDED_EVENT );
        constants.put( "ON_MREC_AD_REVENUE_PAID", AppLovinMAXAdEvents.ON_MREC_AD_REVENUE_PAID );

        constants.put( "ON_BANNER_AD_LOADED_EVENT", AppLovinMAXAdEvents.ON_BANNER_AD_LOADED_EVENT );
        constants.put( "ON_BANNER_AD_LOAD_FAILED_EVENT", AppLovinMAXAdEvents.ON_BANNER_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_BANNER_AD_CLICKED_EVENT", AppLovinMAXAdEvents.ON_BANNER_AD_CLICKED_EVENT );
        constants.put( "ON_BANNER_AD_COLLAPSED_EVENT", AppLovinMAXAdEvents.ON_BANNER_AD_COLLAPSED_EVENT );
        constants.put( "ON_BANNER_AD_EXPANDED_EVENT", AppLovinMAXAdEvents.ON_BANNER_AD_EXPANDED_EVENT );
        constants.put( "ON_BANNER_AD_REVENUE_PAID", AppLovinMAXAdEvents.ON_BANNER_AD_REVENUE_PAID );

        constants.put( "ON_INTERSTITIAL_LOADED_EVENT", AppLovinMAXAdEvents.ON_INTERSTITIAL_LOADED_EVENT );
        constants.put( "ON_INTERSTITIAL_LOAD_FAILED_EVENT", AppLovinMAXAdEvents.ON_INTERSTITIAL_LOAD_FAILED_EVENT );
        constants.put( "ON_INTERSTITIAL_CLICKED_EVENT", AppLovinMAXAdEvents.ON_INTERSTITIAL_CLICKED_EVENT );
        constants.put( "ON_INTERSTITIAL_DISPLAYED_EVENT", AppLovinMAXAdEvents.ON_INTERSTITIAL_DISPLAYED_EVENT );
        constants.put( "ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT", AppLovinMAXAdEvents.ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT );
        constants.put( "ON_INTERSTITIAL_HIDDEN_EVENT", AppLovinMAXAdEvents.ON_INTERSTITIAL_HIDDEN_EVENT );
        constants.put( "ON_INTERSTITIAL_AD_REVENUE_PAID", AppLovinMAXAdEvents.ON_INTERSTITIAL_AD_REVENUE_PAID );

        constants.put( "ON_REWARDED_AD_LOADED_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_LOADED_EVENT );
        constants.put( "ON_REWARDED_AD_LOAD_FAILED_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_REWARDED_AD_CLICKED_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_CLICKED_EVENT );
        constants.put( "ON_REWARDED_AD_DISPLAYED_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_DISPLAYED_EVENT );
        constants.put( "ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT );
        constants.put( "ON_REWARDED_AD_HIDDEN_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_HIDDEN_EVENT );
        constants.put( "ON_REWARDED_AD_RECEIVED_REWARD_EVENT", AppLovinMAXAdEvents.ON_REWARDED_AD_RECEIVED_REWARD_EVENT );
        constants.put( "ON_REWARDED_AD_REVENUE_PAID", AppLovinMAXAdEvents.ON_REWARDED_AD_REVENUE_PAID );

        constants.put( "ON_APPOPEN_AD_LOADED_EVENT", AppLovinMAXAdEvents.ON_APPOPEN_AD_LOADED_EVENT );
        constants.put( "ON_APPOPEN_AD_LOAD_FAILED_EVENT", AppLovinMAXAdEvents.ON_APPOPEN_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_APPOPEN_AD_CLICKED_EVENT", AppLovinMAXAdEvents.ON_APPOPEN_AD_CLICKED_EVENT );
        constants.put( "ON_APPOPEN_AD_DISPLAYED_EVENT", AppLovinMAXAdEvents.ON_APPOPEN_AD_DISPLAYED_EVENT );
        constants.put( "ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT", AppLovinMAXAdEvents.ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT );
        constants.put( "ON_APPOPEN_AD_HIDDEN_EVENT", AppLovinMAXAdEvents.ON_APPOPEN_AD_HIDDEN_EVENT );
        constants.put( "ON_APPOPEN_AD_REVENUE_PAID", AppLovinMAXAdEvents.ON_APPOPEN_AD_REVENUE_PAID );

        constants.put( "ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT", AppLovinMAXAdEvents.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT );
        constants.put( "ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT", AppLovinMAXAdEvents.ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT );

        constants.put( "MAX_ERROR_CODE_UNSPECIFIED", MaxErrorCode.UNSPECIFIED );
        constants.put( "MAX_ERROR_CODE_NO_FILL", MaxErrorCode.NO_FILL );
        constants.put( "MAX_ERROR_CODE_AD_LOAD_FAILED", MaxErrorCode.AD_LOAD_FAILED );
        constants.put( "MAX_ERROR_CODE_AD_DISPLAY_FAILED", MaxAdapterError.ERROR_CODE_AD_DISPLAY_FAILED );
        constants.put( "MAX_ERROR_CODE_NETWORK_ERROR", MaxErrorCode.NETWORK_ERROR );
        constants.put( "MAX_ERROR_CODE_NETWORK_TIMEOUT", MaxErrorCode.NETWORK_TIMEOUT );
        constants.put( "MAX_ERROR_CODE_NO_NETWORK", MaxErrorCode.NO_NETWORK );
        constants.put( "MAX_ERROR_CODE_FULLSCREEN_AD_ALREADY_SHOWING", MaxErrorCode.FULLSCREEN_AD_ALREADY_SHOWING );
        constants.put( "MAX_ERROR_CODE_FULLSCREEN_AD_NOT_READY", MaxErrorCode.FULLSCREEN_AD_NOT_READY );
        constants.put( "MAX_ERROR_CODE_DONT_KEEP_ACTIVITIES_ENABLED", MaxErrorCode.DONT_KEEP_ACTIVITIES_ENABLED );
        constants.put( "MAX_ERROR_CODE_INVALID_AD_UNIT_ID", MaxErrorCode.INVALID_AD_UNIT_ID );
        // iOS only
        constants.put( "MAX_ERROR_CODE_FULLSCREEN_AD_INVALID_VIEW_CONTROLLER", -25 );

        return constants;
    }

    //
    // Version Utils
    //

    private boolean isInclusiveVersion(final String version, @Nullable final String minVersion, @Nullable final String maxVersion)
    {
        if ( TextUtils.isEmpty( version ) ) return true;

        int versionCode = toVersionCode( version );

        // if version is less than the minimum version
        if ( !TextUtils.isEmpty( minVersion ) )
        {
            int minVersionCode = toVersionCode( minVersion );

            if ( versionCode < minVersionCode ) return false;
        }

        // if version is greater than the maximum version
        if ( !TextUtils.isEmpty( maxVersion ) )
        {
            int maxVersionCode = toVersionCode( maxVersion );

            if ( versionCode > maxVersionCode ) return false;
        }

        return true;
    }

    private static int toVersionCode(String versionString)
    {
        String[] versionNums = versionString.split( "\\." );

        int versionCode = 0;
        for ( String num : versionNums )
        {
            // Each number gets two digits in the version code.
            if ( num.length() > 2 )
            {
                w( "Version number components cannot be longer than two digits -> " + versionString );
                return versionCode;
            }

            versionCode *= 100;
            versionCode += Integer.parseInt( num );
        }

        return versionCode;
    }
}
