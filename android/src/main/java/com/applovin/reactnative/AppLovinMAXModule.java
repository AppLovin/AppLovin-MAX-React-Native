package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Rect;
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
import com.applovin.mediation.MaxAdWaterfallInfo;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.MaxErrorCode;
import com.applovin.mediation.MaxMediatedNetworkInfo;
import com.applovin.mediation.MaxNetworkResponseInfo;
import com.applovin.mediation.MaxReward;
import com.applovin.mediation.MaxRewardedAdListener;
import com.applovin.mediation.ads.MaxAdView;
import com.applovin.mediation.ads.MaxInterstitialAd;
import com.applovin.mediation.ads.MaxRewardedAd;
import com.applovin.sdk.AppLovinAdContentRating;
import com.applovin.sdk.AppLovinGender;
import com.applovin.sdk.AppLovinMediationProvider;
import com.applovin.sdk.AppLovinPrivacySettings;
import com.applovin.sdk.AppLovinSdk;
import com.applovin.sdk.AppLovinSdkConfiguration;
import com.applovin.sdk.AppLovinSdkSettings;
import com.applovin.sdk.AppLovinSdkUtils;
import com.applovin.sdk.AppLovinUserService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import androidx.annotation.Nullable;

import static com.applovin.sdk.AppLovinSdkUtils.runOnUiThreadDelayed;
import static com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

/**
 * Created by Thomas So on July 11 2020
 */
public class AppLovinMAXModule
        extends ReactContextBaseJavaModule
        implements LifecycleEventListener,
        MaxAdListener, MaxAdViewAdListener, MaxRewardedAdListener, MaxAdRevenueListener
{
    private static final String SDK_TAG = "AppLovinSdk";
    private static final String TAG     = "AppLovinMAXModule";

    private static final Point DEFAULT_AD_VIEW_OFFSET = new Point( 0, 0 );

    public static  AppLovinMAXModule instance;
    private static Activity          sCurrentActivity;

    // Parent Fields
    private AppLovinSdk              sdk;
    private boolean                  isPluginInitialized;
    private boolean                  isSdkInitialized;
    private AppLovinSdkConfiguration sdkConfiguration;

    private WindowManager windowManager;
    private int           lastRotation;

    // Store these values if pub attempts to set it before initializing
    private       String              userIdToSet;
    private       List<String>        testDeviceAdvertisingIdsToSet;
    private       Boolean             verboseLoggingToSet;
    private       Boolean             creativeDebuggerEnabledToSet;
    private       Boolean             locationCollectionEnabledToSet;
    private final Map<String, String> extraParametersToSet = new HashMap<>( 8 );

    // Fullscreen Ad Fields
    private final Map<String, MaxInterstitialAd> mInterstitials = new HashMap<>( 2 );
    private final Map<String, MaxRewardedAd>     mRewardedAds   = new HashMap<>( 2 );

    // Banner Fields
    private final Map<String, MaxAdView>   mAdViews                         = new HashMap<>( 2 );
    private final Map<String, MaxAdFormat> mAdViewAdFormats                 = new HashMap<>( 2 );
    private final Map<String, String>      mAdViewPositions                 = new HashMap<>( 2 );
    private final Map<String, Point>       mAdViewOffsets                   = new HashMap<>( 2 );
    private final Map<String, Integer>     mAdViewWidths                    = new HashMap<>( 2 );
    private final List<String>             mAdUnitIdsToShowAfterCreate      = new ArrayList<>( 2 );
    private final Set<String>              mDisabledAdaptiveBannerAdUnitIds = new HashSet<>( 2 );

    // TODO: Remove when v11.0.0 SDKs are released
    public final static Map<String, MaxAdView> sAdViewsToRemove = Collections.synchronizedMap( new HashMap<>() );

    public static AppLovinMAXModule getInstance()
    {
        return instance;
    }

    public AppLovinSdk getSdk()
    {
        return sdk;
    }

    public AppLovinMAXModule(final ReactApplicationContext reactContext)
    {
        super( reactContext );

        instance = this;
        sCurrentActivity = reactContext.getCurrentActivity();

        // Listening to Lifecycle Events
        reactContext.addLifecycleEventListener( this );
    }

    @Override
    public String getName()
    {
        return "AppLovinMAX";
    }

    @Nullable
    private Activity maybeGetCurrentActivity()
    {
        // React Native has a bug where `getCurrentActivity()` returns null: https://github.com/facebook/react-native/issues/18345
        // To alleviate the issue - we will store as a static reference (WeakReference unfortunately did not suffice)
        if ( getReactApplicationContext().hasCurrentActivity() )
        {
            sCurrentActivity = getReactApplicationContext().getCurrentActivity();
        }

        return sCurrentActivity;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isInitialized()
    {
        return isPluginInitialized && isSdkInitialized;
    }

    @ReactMethod
    public void initialize(final String pluginVersion, final String sdkKey, final Callback callback)
    {
        // Check if Activity is available
        Activity currentActivity = maybeGetCurrentActivity();
        if ( currentActivity != null )
        {
            performInitialization( pluginVersion, sdkKey, currentActivity, callback );
        }
        else
        {
            w( "No current Activity found! Delaying initialization..." );

            runOnUiThreadDelayed( new Runnable()
            {
                @Override
                public void run()
                {
                    Context contextToUse = maybeGetCurrentActivity();
                    if ( contextToUse == null )
                    {
                        w( "Still unable to find current Activity - initializing SDK with application context" );
                        contextToUse = getReactApplicationContext();
                    }

                    performInitialization( pluginVersion, sdkKey, contextToUse, callback );
                }
            }, TimeUnit.SECONDS.toMillis( 3 ) );
        }
    }

    private void performInitialization(final String pluginVersion, final String sdkKey, final Context context, final Callback callback)
    {
        // Guard against running init logic multiple times
        if ( isPluginInitialized ) return;

        isPluginInitialized = true;

        d( "Initializing AppLovin MAX React Native v" + pluginVersion + "..." );

        // If SDK key passed in is empty, check Android Manifest
        String sdkKeyToUse = sdkKey;
        if ( TextUtils.isEmpty( sdkKey ) )
        {
            try
            {
                PackageManager packageManager = getReactApplicationContext().getPackageManager();
                String packageName = getReactApplicationContext().getPackageName();
                ApplicationInfo applicationInfo = packageManager.getApplicationInfo( packageName, PackageManager.GET_META_DATA );
                Bundle metaData = applicationInfo.metaData;

                sdkKeyToUse = metaData.getString( "applovin.sdk.key", "" );
            }
            catch ( Throwable th )
            {
                e( "Unable to retrieve SDK key from Android Manifest: " + th );
            }

            if ( TextUtils.isEmpty( sdkKeyToUse ) )
            {
                throw new IllegalStateException( "Unable to initialize AppLovin SDK - no SDK key provided and not found in Android Manifest!" );
            }
        }

        // Initialize SDK
        sdk = AppLovinSdk.getInstance( sdkKeyToUse, new AppLovinSdkSettings( getReactApplicationContext() ), context );
        sdk.setPluginVersion( "React-Native-" + pluginVersion );
        sdk.setMediationProvider( AppLovinMediationProvider.MAX );

        // Set user id if needed
        if ( !TextUtils.isEmpty( userIdToSet ) )
        {
            sdk.setUserIdentifier( userIdToSet );
            userIdToSet = null;
        }

        // Set test device ids if needed
        if ( testDeviceAdvertisingIdsToSet != null )
        {
            sdk.getSettings().setTestDeviceAdvertisingIds( testDeviceAdvertisingIdsToSet );
            testDeviceAdvertisingIdsToSet = null;
        }

        // Set verbose logging state if needed
        if ( verboseLoggingToSet != null )
        {
            sdk.getSettings().setVerboseLogging( verboseLoggingToSet );
            verboseLoggingToSet = null;
        }

        // Set creative debugger enabled if needed.
        if ( creativeDebuggerEnabledToSet != null )
        {
            sdk.getSettings().setCreativeDebuggerEnabled( creativeDebuggerEnabledToSet );
            creativeDebuggerEnabledToSet = null;
        }

        // Set location collection enabled if needed
        if ( locationCollectionEnabledToSet != null )
        {
            sdk.getSettings().setLocationCollectionEnabled( locationCollectionEnabledToSet );
            locationCollectionEnabledToSet = null;
        }

        setPendingExtraParametersIfNeeded( sdk.getSettings() );

        sdk.initializeSdk( new AppLovinSdk.SdkInitializationListener()
        {
            @Override
            public void onSdkInitialized(final AppLovinSdkConfiguration configuration)
            {
                d( "SDK initialized" );

                sdkConfiguration = configuration;
                isSdkInitialized = true;

                windowManager = (WindowManager) context.getSystemService( Context.WINDOW_SERVICE );

                lastRotation = windowManager.getDefaultDisplay().getRotation();

                // Enable orientation change listener, so that the ad view positions can be updated when the device is rotated.
                new OrientationEventListener( context )
                {
                    @Override
                    public void onOrientationChanged(final int orientation)
                    {
                        int newRotation = windowManager.getDefaultDisplay().getRotation();
                        if ( newRotation != lastRotation )
                        {
                            lastRotation = newRotation;
                            for ( final Map.Entry<String, MaxAdFormat> adUnitFormats : mAdViewAdFormats.entrySet() )
                            {
                                positionAdView( adUnitFormats.getKey(), adUnitFormats.getValue() );
                            }
                        }
                    }
                }.enable();

                WritableMap sdkConfiguration = Arguments.createMap();
                sdkConfiguration.putInt( "consentDialogState", configuration.getConsentDialogState().ordinal() );
                sdkConfiguration.putString( "countryCode", configuration.getCountryCode() );
                callback.invoke( sdkConfiguration );
            }
        } );
    }

    // General Public API

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isTablet()
    {
        Context contextToUse = ( maybeGetCurrentActivity() != null ) ? maybeGetCurrentActivity() : getReactApplicationContext();
        return AppLovinSdkUtils.isTablet( contextToUse );
    }

    @ReactMethod
    public void showMediationDebugger()
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showMediationDebugger" );
            return;
        }

        sdk.showMediationDebugger();
    }

    @ReactMethod()
    public void showConsentDialog(final Callback callback)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "showConsentDialog" );
            return;
        }

        sdk.getUserService().showConsentDialog( maybeGetCurrentActivity(), new AppLovinUserService.OnConsentDialogDismissListener()
        {
            @Override
            public void onDismiss()
            {
                callback.invoke();
            }
        } );
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int getConsentDialogState()
    {
        if ( !isInitialized() ) return AppLovinSdkConfiguration.ConsentDialogState.UNKNOWN.ordinal();

        return sdkConfiguration.getConsentDialogState().ordinal();
    }

    @ReactMethod()
    public void setHasUserConsent(boolean hasUserConsent)
    {
        AppLovinPrivacySettings.setHasUserConsent( hasUserConsent, maybeGetCurrentActivity() );
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean hasUserConsent()
    {
        return AppLovinPrivacySettings.hasUserConsent( maybeGetCurrentActivity() );
    }

    @ReactMethod()
    public void setIsAgeRestrictedUser(boolean isAgeRestrictedUser)
    {
        AppLovinPrivacySettings.setIsAgeRestrictedUser( isAgeRestrictedUser, maybeGetCurrentActivity() );
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isAgeRestrictedUser()
    {
        return AppLovinPrivacySettings.isAgeRestrictedUser( maybeGetCurrentActivity() );
    }

    @ReactMethod()
    public void setDoNotSell(final boolean doNotSell)
    {
        AppLovinPrivacySettings.setDoNotSell( doNotSell, maybeGetCurrentActivity() );
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isDoNotSell()
    {
        return AppLovinPrivacySettings.isDoNotSell( maybeGetCurrentActivity() );
    }

    @ReactMethod()
    public void setUserId(String userId)
    {
        if ( isPluginInitialized )
        {
            sdk.setUserIdentifier( userId );
            userIdToSet = null;
        }
        else
        {
            userIdToSet = userId;
        }
    }

    @ReactMethod()
    public void setMuted(final boolean muted)
    {
        if ( !isPluginInitialized ) return;

        sdk.getSettings().setMuted( muted );
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isMuted()
    {
        if ( !isPluginInitialized ) return false;

        return sdk.getSettings().isMuted();
    }

    @ReactMethod()
    public void setVerboseLogging(final boolean enabled)
    {
        if ( isPluginInitialized )
        {
            sdk.getSettings().setVerboseLogging( enabled );
            verboseLoggingToSet = null;
        }
        else
        {
            verboseLoggingToSet = enabled;
        }
    }

    @ReactMethod()
    public void setCreativeDebuggerEnabled(final boolean enabled)
    {
        if ( isPluginInitialized )
        {
            sdk.getSettings().setCreativeDebuggerEnabled( enabled );
            creativeDebuggerEnabledToSet = null;
        }
        else
        {
            creativeDebuggerEnabledToSet = enabled;
        }
    }

    @ReactMethod()
    public void setTestDeviceAdvertisingIds(final ReadableArray rawAdvertisingIds)
    {
        List<String> advertisingIds = new ArrayList<>( rawAdvertisingIds.size() );

        // Convert to String List
        for ( Object rawAdvertisingId : rawAdvertisingIds.toArrayList() )
        {
            advertisingIds.add( (String) rawAdvertisingId );
        }

        if ( isPluginInitialized )
        {
            sdk.getSettings().setTestDeviceAdvertisingIds( advertisingIds );
            testDeviceAdvertisingIdsToSet = null;
        }
        else
        {
            testDeviceAdvertisingIdsToSet = advertisingIds;
        }
    }

    @ReactMethod()
    public void setExtraParameter(final String key, @Nullable final String value)
    {
        if ( TextUtils.isEmpty( key ) )
        {
            e( "ERROR: Failed to set extra parameter for null or empty key: " + key );
            return;
        }

        if ( sdk != null )
        {
            AppLovinSdkSettings settings = sdk.getSettings();
            settings.setExtraParameter( key, value );
            setPendingExtraParametersIfNeeded( settings );
        }
        else
        {
            extraParametersToSet.put( key, value );
        }
    }

    @ReactMethod()
    public void setConsentFlowEnabled(final boolean enabled) {}

    @ReactMethod()
    public void setPrivacyPolicyUrl(final String urlString) {}

    @ReactMethod()
    public void setTermsOfServiceUrl(final String urlString) {}

    // Data Passing

    @ReactMethod()
    public void setTargetingDataYearOfBirth(final int yearOfBirth)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataYearOfBirth" );
            return;
        }

        sdk.getTargetingData().setYearOfBirth( yearOfBirth <= 0 ? null : yearOfBirth );
    }

    @ReactMethod()
    public void setTargetingDataGender(final String gender)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataGender" );
            return;
        }

        AppLovinGender alGender = AppLovinGender.UNKNOWN;

        if ( "F".equals( gender ) )
        {
            alGender = AppLovinGender.FEMALE;
        }
        else if ( "M".equals( gender ) )
        {
            alGender = AppLovinGender.MALE;
        }
        else if ( "O".equals( gender ) )
        {
            alGender = AppLovinGender.OTHER;
        }

        sdk.getTargetingData().setGender( alGender );
    }

    @ReactMethod()
    public void setTargetingDataMaximumAdContentRating(final int maximumAdContentRating)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataMaximumAdContentRating" );
            return;
        }

        AppLovinAdContentRating rating = AppLovinAdContentRating.NONE;

        if ( maximumAdContentRating == 1 )
        {
            rating = AppLovinAdContentRating.ALL_AUDIENCES;
        }
        else if ( maximumAdContentRating == 2 )
        {
            rating = AppLovinAdContentRating.EVERYONE_OVER_TWELVE;
        }
        else if ( maximumAdContentRating == 3 )
        {
            rating = AppLovinAdContentRating.MATURE_AUDIENCES;
        }

        sdk.getTargetingData().setMaximumAdContentRating( rating );
    }

    @ReactMethod()
    public void setTargetingDataEmail(final String email)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataEmail" );
            return;
        }

        sdk.getTargetingData().setEmail( email );
    }

    @ReactMethod()
    public void setTargetingDataPhoneNumber(final String phoneNumber)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataPhoneNumber" );
            return;
        }

        sdk.getTargetingData().setPhoneNumber( phoneNumber );
    }

    @ReactMethod()
    public void setTargetingDataKeywords(final ReadableArray rawKeywords)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataKeywords" );
            return;
        }

        List<String> keywords = null;

        if ( rawKeywords != null )
        {
            keywords = new ArrayList<>( rawKeywords.size() );
            for ( Object rawKeyword : rawKeywords.toArrayList() )
            {
                keywords.add( (String) rawKeyword );
            }
        }

        sdk.getTargetingData().setKeywords( keywords );
    }

    @ReactMethod()
    public void setTargetingDataInterests(final ReadableArray rawInterests)
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "setTargetingDataInterests" );
            return;
        }

        List<String> interests = null;

        if ( rawInterests != null )
        {
            interests = new ArrayList<>( rawInterests.size() );
            for ( Object rawInterest : rawInterests.toArrayList() )
            {
                interests.add( (String) rawInterest );
            }
        }

        sdk.getTargetingData().setInterests( interests );
    }

    @ReactMethod()
    public void clearAllTargetingData()
    {
        if ( sdk == null )
        {
            logUninitializedAccessError( "clearAllTargetingData" );
            return;
        }

        sdk.getTargetingData().clearAll();
    }

    @ReactMethod()
    public void setLocationCollectionEnabled(final boolean enabled)
    {
        if ( isPluginInitialized )
        {
            sdk.getSettings().setLocationCollectionEnabled( enabled );
            locationCollectionEnabledToSet = null;
        }
        else
        {
            locationCollectionEnabledToSet = enabled;
        }
    }

    // EVENT TRACKING

    @ReactMethod()
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

    @ReactMethod()
    public void createBanner(final String adUnitId, final String bannerPosition)
    {
        createAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), bannerPosition, DEFAULT_AD_VIEW_OFFSET );
    }

    @ReactMethod() // NOTE: No function overloading in JS so we need new method signature
    public void createBannerWithOffsets(final String adUnitId, final String bannerPosition, final float x, final float y)
    {
        createAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), bannerPosition, getOffsetPixels( x, y, getCurrentActivity() ) );
    }

    @ReactMethod()
    public void setBannerBackgroundColor(final String adUnitId, final String hexColorCode)
    {
        setAdViewBackgroundColor( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), hexColorCode );
    }

    @ReactMethod()
    public void setBannerPlacement(final String adUnitId, final String placement)
    {
        setAdViewPlacement( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), placement );
    }

    @ReactMethod()
    public void setBannerCustomData(final String adUnitId, final String customData)
    {
        setAdViewCustomData( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), customData );
    }

    @ReactMethod()
    public void setBannerWidth(final String adUnitId, final int widthDp)
    {
        setAdViewWidth( adUnitId, widthDp, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void updateBannerPosition(final String adUnitId, final String bannerPosition)
    {
        updateAdViewPosition( adUnitId, bannerPosition, DEFAULT_AD_VIEW_OFFSET, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void updateBannerOffsets(final String adUnitId, final float x, final float y)
    {
        updateAdViewPosition( adUnitId, mAdViewPositions.get( adUnitId ), getOffsetPixels( x, y, getCurrentActivity() ), getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void setBannerExtraParameter(final String adUnitId, final String key, final String value)
    {
        setAdViewExtraParameters( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), key, value );
    }

    @ReactMethod()
    public void startBannerAutoRefresh(final String adUnitId)
    {
        startAutoRefresh( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void stopBannerAutoRefresh(final String adUnitId)
    {
        stopAutoRefresh( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void showBanner(final String adUnitId)
    {
        showAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void hideBanner(final String adUnitId)
    {
        hideAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod()
    public void destroyBanner(final String adUnitId)
    {
        destroyAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public float getAdaptiveBannerHeightForWidth(final float width)
    {
        return getDeviceSpecificBannerAdViewAdFormat().getAdaptiveSize( (int) width, getCurrentActivity() ).getHeight();
    }

    // MRECS

    @ReactMethod()
    public void createMRec(final String adUnitId, final String mrecPosition)
    {
        createAdView( adUnitId, MaxAdFormat.MREC, mrecPosition, DEFAULT_AD_VIEW_OFFSET );
    }

    @ReactMethod()
    public void setMRecPlacement(final String adUnitId, final String placement)
    {
        setAdViewPlacement( adUnitId, MaxAdFormat.MREC, placement );
    }

    @ReactMethod()
    public void setMRecCustomData(final String adUnitId, final String customData)
    {
        setAdViewCustomData( adUnitId, MaxAdFormat.MREC, customData );
    }

    @ReactMethod()
    public void updateMRecPosition(final String adUnitId, final String mrecPosition)
    {
        updateAdViewPosition( adUnitId, mrecPosition, DEFAULT_AD_VIEW_OFFSET, MaxAdFormat.MREC );
    }

    @ReactMethod()
    public void startMRecAutoRefresh(final String adUnitId)
    {
        startAutoRefresh( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod()
    public void stopMRecAutoRefresh(final String adUnitId)
    {
        stopAutoRefresh( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod()
    public void showMRec(final String adUnitId)
    {
        showAdView( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod()
    public void hideMRec(final String adUnitId)
    {
        hideAdView( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod()
    public void destroyMRec(final String adUnitId)
    {
        destroyAdView( adUnitId, MaxAdFormat.MREC );
    }

    // INTERSTITIALS

    @ReactMethod()
    public void loadInterstitial(final String adUnitId)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        if ( interstitial == null )
        {
            sendReactNativeEventForAdLoadFailed( "OnInterstitialLoadFailedEvent", adUnitId, null );
            return;
        }

        interstitial.loadAd();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isInterstitialReady(final String adUnitId)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        return interstitial.isReady();
    }

    @ReactMethod()
    public void showInterstitial(final String adUnitId, final String placement, final String customData)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        interstitial.showAd( placement, customData );
    }

    @ReactMethod()
    public void setInterstitialExtraParameter(final String adUnitId, final String key, final String value)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        interstitial.setExtraParameter( key, value );
    }

    // REWARDED

    @ReactMethod()
    public void loadRewardedAd(final String adUnitId)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        if ( rewardedAd == null )
        {
            sendReactNativeEventForAdLoadFailed( "OnRewardedAdLoadFailedEvent", adUnitId, null );
            return;
        }

        rewardedAd.loadAd();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isRewardedAdReady(final String adUnitId)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        return rewardedAd.isReady();
    }

    @ReactMethod()
    public void showRewardedAd(final String adUnitId, final String placement, final String customData)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        rewardedAd.showAd( placement, customData );
    }

    @ReactMethod()
    public void setRewardedAdExtraParameter(final String adUnitId, final String key, final String value)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        rewardedAd.setExtraParameter( key, value );
    }

    // AD CALLBACKS

    @Override
    public void onAdLoaded(MaxAd ad)
    {
        String name;
        MaxAdFormat adFormat = ad.getFormat();
        if ( MaxAdFormat.BANNER == adFormat || MaxAdFormat.LEADER == adFormat || MaxAdFormat.MREC == adFormat )
        {
            name = ( MaxAdFormat.MREC == adFormat ) ? "OnMRecAdLoadedEvent" : "OnBannerAdLoadedEvent";

            String adViewPosition = mAdViewPositions.get( ad.getAdUnitId() );
            if ( !TextUtils.isEmpty( adViewPosition ) )
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
            name = "OnInterstitialLoadedEvent";
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = "OnRewardedAdLoadedEvent";
        }
        else
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdLoadFailed(final String adUnitId, final MaxError error)
    {
        if ( TextUtils.isEmpty( adUnitId ) )
        {
            logStackTrace( new IllegalArgumentException( "adUnitId cannot be null" ) );
            return;
        }

        String name;
        if ( mAdViews.containsKey( adUnitId ) )
        {
            name = ( MaxAdFormat.MREC == mAdViewAdFormats.get( adUnitId ) ) ? "OnMRecAdLoadFailedEvent" : "OnBannerAdLoadFailedEvent";
        }
        else if ( mInterstitials.containsKey( adUnitId ) )
        {
            name = "OnInterstitialLoadFailedEvent";
        }
        else if ( mRewardedAds.containsKey( adUnitId ) )
        {
            name = "OnRewardedAdLoadFailedEvent";
        }
        else
        {
            logStackTrace( new IllegalStateException( "invalid adUnitId: " + adUnitId ) );
            return;
        }

        sendReactNativeEventForAdLoadFailed( name, adUnitId, error );
    }

    private void sendReactNativeEventForAdLoadFailed(final String name, final String adUnitId, final @Nullable MaxError error)
    {
        WritableMap params = Arguments.createMap();
        params.putString( "adUnitId", adUnitId );

        if ( error != null )
        {
            params.putInt( "code", error.getCode() );
            params.putString( "message", error.getMessage() );
            params.putString( "adLoadFailureInfo", error.getAdLoadFailureInfo() );
            params.putMap( "waterfall", createAdWaterfallInfo( error.getWaterfall() ) );
        }
        else
        {
            params.putInt( "code", MaxErrorCode.UNSPECIFIED );
        }

        sendReactNativeEvent( name, params );
    }

    @Override
    public void onAdClicked(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        final String name;
        if ( MaxAdFormat.BANNER == adFormat || MaxAdFormat.LEADER == adFormat )
        {
            name = "OnBannerAdClickedEvent";
        }
        else if ( MaxAdFormat.MREC == adFormat )
        {
            name = "OnMRecAdClickedEvent";
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = "OnInterstitialClickedEvent";
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = "OnRewardedAdClickedEvent";
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
        if ( adFormat != MaxAdFormat.INTERSTITIAL && adFormat != MaxAdFormat.REWARDED ) return;

        final String name;
        if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = "OnInterstitialDisplayedEvent";
        }
        else // REWARDED
        {
            name = "OnRewardedAdDisplayedEvent";
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, final MaxError error)
    {
        // BMLs do not support [DISPLAY] events
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.INTERSTITIAL && adFormat != MaxAdFormat.REWARDED ) return;

        final String name;
        if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = "OnInterstitialAdFailedToDisplayEvent";
        }
        else // REWARDED
        {
            name = "OnRewardedAdFailedToDisplayEvent";
        }

        WritableMap params = getAdInfo( ad );
        params.putInt( "code", error.getCode() );
        params.putString( "message", error.getMessage() );

        sendReactNativeEvent( name, params );
    }

    @Override
    public void onAdHidden(final MaxAd ad)
    {
        // BMLs do not support [HIDDEN] events
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.INTERSTITIAL && adFormat != MaxAdFormat.REWARDED ) return;

        String name;
        if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = "OnInterstitialHiddenEvent";
        }
        else // REWARDED
        {
            name = "OnRewardedAdHiddenEvent";
        }

        sendReactNativeEvent( name, getAdInfo( ad ) );
    }

    @Override
    public void onAdExpanded(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.BANNER && adFormat != MaxAdFormat.LEADER && adFormat != MaxAdFormat.MREC )
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( ( MaxAdFormat.MREC == adFormat ) ? "OnMRecAdExpandedEvent" : "OnBannerAdExpandedEvent", getAdInfo( ad ) );
    }

    @Override
    public void onAdCollapsed(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.BANNER && adFormat != MaxAdFormat.LEADER && adFormat != MaxAdFormat.MREC )
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( ( MaxAdFormat.MREC == adFormat ) ? "OnMRecAdCollapsedEvent" : "OnBannerAdCollapsedEvent", getAdInfo( ad ) );
    }

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        final String name;
        if ( MaxAdFormat.BANNER == adFormat || MaxAdFormat.LEADER == adFormat )
        {
            name = "OnBannerAdRevenuePaid";
        }
        else if ( MaxAdFormat.MREC == adFormat )
        {
            name = "OnMRecAdRevenuePaid";
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = "OnInterstitialAdRevenuePaid";
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = "OnRewardedAdRevenuePaid";
        }
        else
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        WritableMap adInfo = getAdInfo( ad );
        adInfo.putString( "networkPlacement", ad.getNetworkPlacement() );
        adInfo.putString( "revenuePrecision", ad.getRevenuePrecision() );
        adInfo.putString( "countryCode", sdkConfiguration.getCountryCode() );

        sendReactNativeEvent( name, adInfo );
    }

    @Override
    public void onRewardedVideoCompleted(final MaxAd ad)
    {
        // This event is not forwarded
    }

    @Override
    public void onRewardedVideoStarted(final MaxAd ad)
    {
        // This event is not forwarded
    }

    @Override
    public void onUserRewarded(final MaxAd ad, final MaxReward reward)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat != MaxAdFormat.REWARDED )
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        final String rewardLabel = reward != null ? reward.getLabel() : "";
        final int rewardAmount = reward != null ? reward.getAmount() : 0;

        WritableMap params = getAdInfo( ad );
        params.putString( "rewardLabel", rewardLabel );
        params.putInt( "rewardAmount", rewardAmount );
        sendReactNativeEvent( "OnRewardedAdReceivedRewardEvent", params );
    }

    // INTERNAL METHODS

    private void createAdView(final String adUnitId, final MaxAdFormat adFormat, final String adViewPosition, final Point adViewOffsetPixels)
    {
        // Run on main thread to ensure there are no concurrency issues with other ad view methods
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Creating " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\", position: \"" + adViewPosition + "\", and offset: " + adViewOffsetPixels );

                // Retrieve ad view from the map
                final MaxAdView adView = retrieveAdView( adUnitId, adFormat, adViewPosition, adViewOffsetPixels );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setVisibility( View.GONE );

                if ( adView.getParent() == null )
                {
                    final Activity currentActivity = maybeGetCurrentActivity();
                    final RelativeLayout relativeLayout = new RelativeLayout( currentActivity );
                    currentActivity.addContentView( relativeLayout, new LinearLayout.LayoutParams( LinearLayout.LayoutParams.MATCH_PARENT,
                                                                                                   LinearLayout.LayoutParams.MATCH_PARENT ) );
                    relativeLayout.addView( adView );

                    // Position ad view immediately so if publisher sets color before ad loads, it will not be the size of the screen
                    mAdViewAdFormats.put( adUnitId, adFormat );
                    positionAdView( adUnitId, adFormat );
                }

                adView.loadAd();

                // The publisher may have requested to show the banner before it was created. Now that the banner is created, show it.
                if ( mAdUnitIdsToShowAfterCreate.contains( adUnitId ) )
                {
                    showAdView( adUnitId, adFormat );
                    mAdUnitIdsToShowAfterCreate.remove( adUnitId );
                }
            }
        } );
    }

    private void setAdViewPlacement(final String adUnitId, final MaxAdFormat adFormat, final String placement)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Setting placement \"" + placement + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat, "", DEFAULT_AD_VIEW_OFFSET );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setPlacement( placement );
            }
        } );
    }

    private void setAdViewCustomData(final String adUnitId, final MaxAdFormat adFormat, final String customData)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Setting custom data \"" + customData + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat, "", DEFAULT_AD_VIEW_OFFSET );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setCustomData( customData );
            }
        } );
    }

    private void setAdViewWidth(final String adUnitId, final int widthDp, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Setting width " + widthDp + " for \"" + adFormat + "\" with ad unit identifier \"" + adUnitId + "\"" );

                int minWidthDp = adFormat.getSize().getWidth();
                if ( widthDp < minWidthDp )
                {
                    e( "The provided width: " + widthDp + "dp is smaller than the minimum required width: " + minWidthDp + "dp for ad format: " + adFormat + ". Please set the width higher than the minimum required." );
                }

                mAdViewWidths.put( adUnitId, widthDp );
                positionAdView( adUnitId, adFormat );
            }
        } );
    }

    private void updateAdViewPosition(final String adUnitId, final String adViewPosition, final Point offsetPixels, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Updating " + adFormat.getLabel() + " position to \"" + adViewPosition + "\" for ad unit id \"" + adUnitId + "\"" );

                // Retrieve ad view from the map
                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                mAdViewPositions.put( adUnitId, adViewPosition );
                mAdViewOffsets.put( adUnitId, offsetPixels );
                positionAdView( adUnitId, adFormat );
            }
        } );
    }

    private void showAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Showing " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist for ad unit id " + adUnitId );

                    // The adView has not yet been created. Store the ad unit ID, so that it can be displayed once the banner has been created.
                    mAdUnitIdsToShowAfterCreate.add( adUnitId );
                    return;
                }

                adView.setVisibility( View.VISIBLE );
                adView.startAutoRefresh();
            }
        } );
    }

    private void hideAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Hiding " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );
                mAdUnitIdsToShowAfterCreate.remove( adUnitId );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setVisibility( View.GONE );
                adView.stopAutoRefresh();
            }
        } );
    }

    private void destroyAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
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

                mAdViews.remove( adUnitId );
                mAdViewAdFormats.remove( adUnitId );
                mAdViewPositions.remove( adUnitId );
                mAdViewOffsets.remove( adUnitId );
                mAdViewWidths.remove( adUnitId );
            }
        } );
    }

    private void setAdViewBackgroundColor(final String adUnitId, final MaxAdFormat adFormat, final String hexColorCode)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Setting " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\" to color: " + hexColorCode );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setBackgroundColor( Color.parseColor( hexColorCode ) );
            }
        } );
    }

    private void setAdViewExtraParameters(final String adUnitId, final MaxAdFormat adFormat, final String key, final String value)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
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

                    mAdViewAdFormats.put( adUnitId, forcedAdFormat );
                    positionAdView( adUnitId, forcedAdFormat );
                }
                else if ( "adaptive_banner".equalsIgnoreCase( key ) )
                {
                    boolean useAdaptiveBannerAdSize = Boolean.parseBoolean( value );
                    if ( useAdaptiveBannerAdSize )
                    {
                        mDisabledAdaptiveBannerAdUnitIds.remove( adUnitId );
                    }
                    else
                    {
                        mDisabledAdaptiveBannerAdUnitIds.add( adUnitId );
                    }

                    positionAdView( adUnitId, adFormat );
                }
            }
        } );
    }

    private void startAutoRefresh(final String adUnitId, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Starting auto refresh " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.startAutoRefresh();
            }
        } );
    }

    private void stopAutoRefresh(final String adUnitId, final MaxAdFormat adFormat)
    {
        getReactApplicationContext().runOnUiQueueThread( new Runnable()
        {
            @Override
            public void run()
            {
                d( "Stopping auto refresh " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.stopAutoRefresh();
            }
        } );
    }

    @Nullable
    private MaxInterstitialAd retrieveInterstitial(String adUnitId)
    {
        Activity currentActivity = maybeGetCurrentActivity();
        if ( currentActivity == null ) return null;

        MaxInterstitialAd result = mInterstitials.get( adUnitId );
        if ( result == null )
        {
            result = new MaxInterstitialAd( adUnitId, sdk, currentActivity );
            result.setListener( this );
            result.setRevenueListener( this );

            mInterstitials.put( adUnitId, result );
        }

        return result;
    }

    @Nullable
    private MaxRewardedAd retrieveRewardedAd(String adUnitId)
    {
        Activity currentActivity = maybeGetCurrentActivity();
        if ( currentActivity == null ) return null;

        MaxRewardedAd result = mRewardedAds.get( adUnitId );
        if ( result == null )
        {
            result = MaxRewardedAd.getInstance( adUnitId, sdk, currentActivity );
            result.setListener( this );
            result.setRevenueListener( this );

            mRewardedAds.put( adUnitId, result );
        }

        return result;
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat)
    {
        return retrieveAdView( adUnitId, adFormat, null, DEFAULT_AD_VIEW_OFFSET );
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat, String adViewPosition, Point adViewOffsetPixels)
    {
        MaxAdView result = mAdViews.get( adUnitId );
        if ( result == null && adViewPosition != null && adViewOffsetPixels != null )
        {
            result = new MaxAdView( adUnitId, adFormat, sdk, maybeGetCurrentActivity() );
            result.setListener( this );
            result.setRevenueListener( this );

            // Set this extra parameter to work around a SDK bug that ignores calls to stopAutoRefresh()
            result.setExtraParameter( "allow_pause_auto_refresh_immediately", "true" );

            mAdViews.put( adUnitId, result );
            mAdViewPositions.put( adUnitId, adViewPosition );
            mAdViewOffsets.put( adUnitId, adViewOffsetPixels );
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

        final ViewParent parent = adView.getParent();
        if ( !( parent instanceof RelativeLayout ) ) return;

        final RelativeLayout relativeLayout = (RelativeLayout) parent;
        final Rect windowRect = new Rect();
        relativeLayout.getWindowVisibleDisplayFrame( windowRect );

        final String adViewPosition = mAdViewPositions.get( adUnitId );
        final Point adViewOffset = mAdViewOffsets.get( adUnitId );
        final boolean isAdaptiveBannerDisabled = mDisabledAdaptiveBannerAdUnitIds.contains( adUnitId );
        final boolean isWidthDpOverridden = mAdViewWidths.containsKey( adUnitId );

        //
        // Determine ad width
        //
        final int adViewWidthDp;

        // Check if publisher has overridden width as dp
        if ( isWidthDpOverridden )
        {
            adViewWidthDp = mAdViewWidths.get( adUnitId );
        }
        // Top center / bottom center stretches full screen
        else if ( "top_center".equalsIgnoreCase( adViewPosition ) || "bottom_center".equalsIgnoreCase( adViewPosition ) )
        {
            int adViewWidthPx = windowRect.width();
            adViewWidthDp = AppLovinSdkUtils.pxToDp( getCurrentActivity(), adViewWidthPx );
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
            adViewHeightDp = adFormat.getAdaptiveSize( adViewWidthDp, getCurrentActivity() ).getHeight();
        }
        else
        {
            adViewHeightDp = adFormat.getSize().getHeight();
        }

        final int widthPx = AppLovinSdkUtils.dpToPx( getCurrentActivity(), adViewWidthDp );
        final int heightPx = AppLovinSdkUtils.dpToPx( getCurrentActivity(), adViewHeightDp );

        final RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) adView.getLayoutParams();
        params.height = heightPx;
        adView.setLayoutParams( params );

        // Parse gravity
        int gravity = 0;

        // Reset rotation, translation and margins so that the banner can be positioned again
        adView.setRotation( 0 );
        adView.setTranslationX( 0 );
        params.setMargins( 0, 0, 0, 0 );

        if ( "centered".equalsIgnoreCase( adViewPosition ) )
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

    private void setPendingExtraParametersIfNeeded(final AppLovinSdkSettings settings)
    {
        if ( extraParametersToSet.size() <= 0 ) return;

        for ( final String key : extraParametersToSet.keySet() )
        {
            settings.setExtraParameter( key, extraParametersToSet.get( key ) );
        }

        extraParametersToSet.clear();
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

    private static void logUninitializedAccessError(final String callingMethod)
    {
        e( "ERROR: Failed to execute " + callingMethod + "() - please ensure the AppLovin MAX React Native module has been initialized by calling 'AppLovinMAX.initialize(...);'!" );
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
        return getDeviceSpecificBannerAdViewAdFormat( getReactApplicationContext() );
    }

    public static MaxAdFormat getDeviceSpecificBannerAdViewAdFormat(final Context context)
    {
        return AppLovinSdkUtils.isTablet( context ) ? MaxAdFormat.LEADER : MaxAdFormat.BANNER;
    }

    protected static class AdViewSize
    {
        public final int widthDp;
        public final int heightDp;

        private AdViewSize(final int widthDp, final int heightDp)
        {
            this.widthDp = widthDp;
            this.heightDp = heightDp;
        }
    }

    public static AdViewSize getAdViewSize(final MaxAdFormat format)
    {
        if ( MaxAdFormat.LEADER == format )
        {
            return new AdViewSize( 728, 90 );
        }
        else if ( MaxAdFormat.BANNER == format )
        {
            return new AdViewSize( 320, 50 );
        }
        else if ( MaxAdFormat.MREC == format )
        {
            return new AdViewSize( 300, 250 );
        }
        else
        {
            throw new IllegalArgumentException( "Invalid ad format" );
        }
    }

    private static Point getOffsetPixels(final float xDp, final float yDp, final Context context)
    {
        return new Point( AppLovinSdkUtils.dpToPx( context, (int) xDp ), AppLovinSdkUtils.dpToPx( context, (int) yDp ) );
    }

    // AD INFO

    private WritableMap getAdInfo(final MaxAd ad)
    {
        WritableMap adInfo = Arguments.createMap();
        adInfo.putString( "adUnitId", ad.getAdUnitId() );
        adInfo.putString( "creativeId", !TextUtils.isEmpty( ad.getCreativeId() ) ? ad.getCreativeId() : "" );
        adInfo.putString( "networkName", ad.getNetworkName() );
        adInfo.putString( "placement", !TextUtils.isEmpty( ad.getPlacement() ) ? ad.getPlacement() : "" );
        adInfo.putDouble( "revenue", ad.getRevenue() );
        adInfo.putMap( "waterfall", createAdWaterfallInfo( ad.getWaterfall() ) );
        adInfo.putString( "dspName", !TextUtils.isEmpty( ad.getDspName() ) ? ad.getDspName() : "" );

        return adInfo;
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

    // Lifecycle Events

    @Override
    public void onHostResume() { }

    @Override
    public void onHostPause() { }

    @Override
    public void onHostDestroy()
    {
        // Make copy because `destroyAdView()` will remove from `mAdViews`
        List<MaxAdView> adViews = new ArrayList<>( mAdViews.values() );
        for ( MaxAdView adView : adViews )
        {
            destroyAdView( adView.getAdUnitId(), adView.getAdFormat() );
        }

        for ( MaxInterstitialAd interstitialAd : mInterstitials.values() )
        {
            interstitialAd.destroy();
        }
        mInterstitials.clear();

        for ( MaxRewardedAd rewardedAd : mRewardedAds.values() )
        {
            rewardedAd.destroy();
        }
        mRewardedAds.clear();
    }

    // Required methods introduced React Native 0.65
    //
    // Without these methods, the following warnings are generated.
    //
    // WARN new NativeEventEmitter() was called with a non-null argument without the required addListener method.
    // WARN new NativeEventEmitter() was called with a non-null argument without the required removeListeners method.
    @ReactMethod
    public void addListener(String eventName) { }

    @ReactMethod
    public void removeListeners(Integer count) { }

    // React Native Bridge

    private void sendReactNativeEvent(final String name, @Nullable final WritableMap params)
    {
        getReactApplicationContext()
                .getJSModule( RCTDeviceEventEmitter.class )
                .emit( name, params );
    }

    @Override
    @Nullable
    public Map<String, Object> getConstants()
    {
        return super.getConstants();
    }
}
