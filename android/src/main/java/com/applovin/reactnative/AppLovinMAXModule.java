package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
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

import com.applovin.impl.sdk.AppLovinSdkInitializationConfigurationImpl;
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
import com.applovin.sdk.AppLovinTargetingData;
import com.applovin.sdk.AppLovinTargetingData.AdContentRating;
import com.applovin.sdk.AppLovinTargetingData.Gender;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

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
public class AppLovinMAXModule
    extends ReactContextBaseJavaModule
    implements LifecycleEventListener,
    MaxAdListener, MaxAdViewAdListener, MaxRewardedAdListener, MaxAdRevenueListener
{
    private static final String SDK_TAG = "AppLovinSdk";
    private static final String TAG     = "AppLovinMAXModule";

    private static final String USER_GEOGRAPHY_GDPR    = "G";
    private static final String USER_GEOGRAPHY_OTHER   = "O";
    private static final String USER_GEOGRAPHY_UNKNOWN = "U";

    private static final String ON_BANNER_AD_LOADED_EVENT      = "OnBannerAdLoadedEvent";
    private static final String ON_BANNER_AD_LOAD_FAILED_EVENT = "OnBannerAdLoadFailedEvent";
    private static final String ON_BANNER_AD_CLICKED_EVENT     = "OnBannerAdClickedEvent";
    private static final String ON_BANNER_AD_COLLAPSED_EVENT   = "OnBannerAdCollapsedEvent";
    private static final String ON_BANNER_AD_EXPANDED_EVENT    = "OnBannerAdExpandedEvent";
    private static final String ON_BANNER_AD_REVENUE_PAID      = "OnBannerAdRevenuePaid";

    private static final String ON_MREC_AD_LOADED_EVENT      = "OnMRecAdLoadedEvent";
    private static final String ON_MREC_AD_LOAD_FAILED_EVENT = "OnMRecAdLoadFailedEvent";
    private static final String ON_MREC_AD_CLICKED_EVENT     = "OnMRecAdClickedEvent";
    private static final String ON_MREC_AD_COLLAPSED_EVENT   = "OnMRecAdCollapsedEvent";
    private static final String ON_MREC_AD_EXPANDED_EVENT    = "OnMRecAdExpandedEvent";
    private static final String ON_MREC_AD_REVENUE_PAID      = "OnMRecAdRevenuePaid";

    private static final String ON_INTERSTITIAL_LOADED_EVENT               = "OnInterstitialLoadedEvent";
    private static final String ON_INTERSTITIAL_LOAD_FAILED_EVENT          = "OnInterstitialLoadFailedEvent";
    private static final String ON_INTERSTITIAL_CLICKED_EVENT              = "OnInterstitialClickedEvent";
    private static final String ON_INTERSTITIAL_DISPLAYED_EVENT            = "OnInterstitialDisplayedEvent";
    private static final String ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT = "OnInterstitialAdFailedToDisplayEvent";
    private static final String ON_INTERSTITIAL_HIDDEN_EVENT               = "OnInterstitialHiddenEvent";
    private static final String ON_INTERSTITIAL_AD_REVENUE_PAID            = "OnInterstitialAdRevenuePaid";

    private static final String ON_REWARDED_AD_LOADED_EVENT            = "OnRewardedAdLoadedEvent";
    private static final String ON_REWARDED_AD_LOAD_FAILED_EVENT       = "OnRewardedAdLoadFailedEvent";
    private static final String ON_REWARDED_AD_CLICKED_EVENT           = "OnRewardedAdClickedEvent";
    private static final String ON_REWARDED_AD_DISPLAYED_EVENT         = "OnRewardedAdDisplayedEvent";
    private static final String ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT = "OnRewardedAdFailedToDisplayEvent";
    private static final String ON_REWARDED_AD_HIDDEN_EVENT            = "OnRewardedAdHiddenEvent";
    private static final String ON_REWARDED_AD_RECEIVED_REWARD_EVENT   = "OnRewardedAdReceivedRewardEvent";
    private static final String ON_REWARDED_AD_REVENUE_PAID            = "OnRewardedAdRevenuePaid";

    private static final String ON_APPOPEN_AD_LOADED_EVENT            = "OnAppOpenAdLoadedEvent";
    private static final String ON_APPOPEN_AD_LOAD_FAILED_EVENT       = "OnAppOpenAdLoadFailedEvent";
    private static final String ON_APPOPEN_AD_CLICKED_EVENT           = "OnAppOpenAdClickedEvent";
    private static final String ON_APPOPEN_AD_DISPLAYED_EVENT         = "OnAppOpenAdDisplayedEvent";
    private static final String ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT = "OnAppOpenAdFailedToDisplayEvent";
    private static final String ON_APPOPEN_AD_HIDDEN_EVENT            = "OnAppOpenAdHiddenEvent";
    private static final String ON_APPOPEN_AD_REVENUE_PAID            = "OnAppOpenAdRevenuePaid";

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

    public static  AppLovinMAXModule instance;
    @Nullable
    private static Activity          currentActivity;

    // Parent Fields
    private final AppLovinSdk                                    sdk;
    private final AppLovinTargetingData.Builder                  targetingDataBuilder;
    private final AppLovinSdkInitializationConfiguration.Builder initConfigurationBuilder;

    private boolean                  isPluginInitialized;
    private boolean                  isSdkInitialized;
    private AppLovinSdkConfiguration sdkConfiguration;

    private WindowManager windowManager;
    private int           lastRotation;

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

    public static AppLovinMAXModule getInstance()
    {
        return instance;
    }

    @NonNull
    public AppLovinSdk getSdk()
    {
        return sdk;
    }

    public boolean isInitialized()
    {
        return isPluginInitialized && isSdkInitialized;
    }

    public AppLovinMAXModule(final ReactApplicationContext reactContext)
    {
        super( reactContext );

        instance = this;
        currentActivity = reactContext.getCurrentActivity();

        sdk = AppLovinSdk.getInstance( reactContext );
        targetingDataBuilder = AppLovinTargetingData.builder();
        initConfigurationBuilder = AppLovinSdkInitializationConfiguration.builder( null, reactContext );

        // Listening to Lifecycle Events
        reactContext.addLifecycleEventListener( this );
    }

    @NonNull
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
            currentActivity = getReactApplicationContext().getCurrentActivity();
        }

        return currentActivity;
    }

    @ReactMethod
    public void isInitialized(final Promise promise)
    {
        promise.resolve( isInitialized() );
    }

    @ReactMethod
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
                promise.reject( new IllegalStateException( "Unable to initialize AppLovin SDK - no SDK key provided and not found in Android Manifest!" ) );
                return;
            }

            w( "\"applovin.sdk.key\" in Android Manifest is obsolete - set \"sdkKey\" programmatically" );
        }

        ( (AppLovinSdkInitializationConfigurationImpl.BuilderImpl) initConfigurationBuilder ).setSdkKey( sdkKeyToUse );

        initConfigurationBuilder.setPluginVersion( "React-Native-" + pluginVersion );
        initConfigurationBuilder.setMediationProvider( AppLovinMediationProvider.MAX );

        AppLovinTargetingData targetingData = targetingDataBuilder.build();
        initConfigurationBuilder.setTargetingData( targetingData );

        AppLovinSdkInitializationConfiguration initConfig = initConfigurationBuilder.build();

        // Initialize SDK
        sdk.initialize( initConfig, configuration -> {
            d( "SDK initialized" );

            sdkConfiguration = configuration;
            isSdkInitialized = true;

            windowManager = (WindowManager) getReactApplicationContext().getSystemService( Context.WINDOW_SERVICE );

            lastRotation = windowManager.getDefaultDisplay().getRotation();

            // Enable orientation change listener, so that the ad view positions can be updated when the device is rotated.
            new OrientationEventListener( getReactApplicationContext() )
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

    @ReactMethod
    public void isTablet(final Promise promise)
    {
        Activity currentActivity = maybeGetCurrentActivity();
        Context contextToUse = ( currentActivity != null ) ? currentActivity : getReactApplicationContext();
        promise.resolve( AppLovinSdkUtils.isTablet( contextToUse ) );
    }

    @ReactMethod
    public void showMediationDebugger()
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showMediationDebugger" );
            return;
        }

        sdk.showMediationDebugger();
    }

    @ReactMethod
    public void setHasUserConsent(final boolean hasUserConsent)
    {
        AppLovinPrivacySettings.setHasUserConsent( hasUserConsent, getReactApplicationContext() );
    }

    @ReactMethod
    public void hasUserConsent(final Promise promise)
    {
        promise.resolve( AppLovinPrivacySettings.hasUserConsent( getReactApplicationContext() ) );
    }

    @ReactMethod
    public void setIsAgeRestrictedUser(final boolean isAgeRestrictedUser)
    {
        AppLovinPrivacySettings.setIsAgeRestrictedUser( isAgeRestrictedUser, getReactApplicationContext() );
    }

    @ReactMethod
    public void isAgeRestrictedUser(final Promise promise)
    {
        promise.resolve( AppLovinPrivacySettings.isAgeRestrictedUser( getReactApplicationContext() ) );
    }

    @ReactMethod
    public void setDoNotSell(final boolean doNotSell)
    {
        AppLovinPrivacySettings.setDoNotSell( doNotSell, getReactApplicationContext() );
    }

    @ReactMethod
    public void isDoNotSell(final Promise promise)
    {
        promise.resolve( AppLovinPrivacySettings.isDoNotSell( getReactApplicationContext() ) );
    }

    @ReactMethod
    public void setUserId(final String userId)
    {
        sdk.getSettings().setUserIdentifier( userId );
    }

    @ReactMethod
    public void setMuted(final boolean muted)
    {
        sdk.getSettings().setMuted( muted );
    }

    @ReactMethod
    public void isMuted(final Promise promise)
    {
        promise.resolve( sdk.getSettings().isMuted() );
    }

    @ReactMethod
    public void setVerboseLogging(final boolean enabled)
    {
        sdk.getSettings().setVerboseLogging( enabled );
    }

    @ReactMethod
    public void setCreativeDebuggerEnabled(final boolean enabled)
    {
        sdk.getSettings().setCreativeDebuggerEnabled( enabled );
    }

    @ReactMethod
    public void setTestDeviceAdvertisingIds(final ReadableArray rawAdvertisingIds)
    {
        List<String> advertisingIds = new ArrayList<>( rawAdvertisingIds.size() );

        // Convert to String List
        for ( Object rawAdvertisingId : rawAdvertisingIds.toArrayList() )
        {
            advertisingIds.add( (String) rawAdvertisingId );
        }

        sdk.getSettings().setTestDeviceAdvertisingIds( advertisingIds );
    }

    @ReactMethod
    public void setExtraParameter(final String key, @Nullable final String value)
    {
        if ( TextUtils.isEmpty( key ) )
        {
            e( "ERROR: Failed to set extra parameter for null or empty key: " + key );
            return;
        }

        sdk.getSettings().setExtraParameter( key, value );
    }

    @ReactMethod
    public void setInitializationAdUnitIds(final ReadableArray rawAdUnitIds)
    {
        List<String> adUnitIds = new ArrayList<>( rawAdUnitIds.size() );

        // Convert to String List
        for ( Object adUnitId : rawAdUnitIds.toArrayList() )
        {
            adUnitIds.add( (String) adUnitId );
        }

        sdk.getSettings().setInitializationAdUnitIds( adUnitIds );
    }

    // MAX Terms and Privacy Policy Flow

    @ReactMethod
    public void setConsentFlowEnabled(final boolean enabled) { }

    @ReactMethod
    public void setTermsAndPrivacyPolicyFlowEnabled(final boolean enabled)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setEnabled( enabled );
    }

    @ReactMethod
    public void setPrivacyPolicyUrl(final String urlString)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setPrivacyPolicyUri( Uri.parse( urlString ) );
    }

    @ReactMethod
    public void setTermsOfServiceUrl(final String urlString)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setTermsOfServiceUri( Uri.parse( urlString ) );
    }

    @ReactMethod
    public void setConsentFlowDebugUserGeography(final String userGeography)
    {
        sdk.getSettings().getTermsAndPrivacyPolicyFlowSettings().setDebugUserGeography( getAppLovinConsentFlowUserGeography( userGeography ) );
    }

    @ReactMethod
    public void showCmpForExistingUser(final Promise promise)
    {
        if ( !isSdkInitialized )
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

    @ReactMethod
    public void hasSupportedCmp(final Promise promise)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showCmpForExistingUser", promise );
            return;
        }

        promise.resolve( sdk.getCmpService().hasSupportedCmp() );
    }

    // Data Passing

    @ReactMethod
    public void setTargetingDataYearOfBirth(final int numYearOfBirth)
    {
        Integer yearOfBirth = numYearOfBirth <= 0 ? null : numYearOfBirth;

        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setYearOfBirth( yearOfBirth );
        }
        else
        {
            targetingDataBuilder.setYearOfBirth( yearOfBirth );
        }
    }

    @ReactMethod
    public void getTargetingDataYearOfBirth(final Promise promise)
    {
        Integer yearOfBirth;

        if ( isSdkInitialized )
        {
            yearOfBirth = sdk.getTargetingData().getYearOfBirth();
        }
        else
        {
            yearOfBirth = targetingDataBuilder.getYearOfBirth();
        }

        promise.resolve( yearOfBirth != null ? yearOfBirth : 0 );
    }

    @ReactMethod
    public void setTargetingDataGender(@Nullable final String strGender)
    {
        Gender gender = getAppLovinGender( strGender );

        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setGender( gender );
        }
        else
        {
            targetingDataBuilder.setGender( gender );
        }
    }

    @ReactMethod
    public void getTargetingDataGender(final Promise promise)
    {
        Gender gender;

        if ( isSdkInitialized )
        {
            gender = sdk.getTargetingData().getGender();
        }
        else
        {
            gender = targetingDataBuilder.getGender();
        }

        promise.resolve( getRawAppLovinGender( gender ) );
    }

    @ReactMethod
    public void setTargetingDataMaximumAdContentRating(final int numMaximumAdContentRating)
    {
        AdContentRating maximumAdContentRating = getAppLovinAdContentRating( numMaximumAdContentRating );

        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setMaximumAdContentRating( maximumAdContentRating );
        }
        else
        {
            targetingDataBuilder.setMaximumAdContentRating( maximumAdContentRating );
        }
    }

    @ReactMethod
    public void getTargetingDataMaximumAdContentRating(final Promise promise)
    {
        AdContentRating adContentRating;

        if ( isSdkInitialized )
        {
            adContentRating = sdk.getTargetingData().getMaximumAdContentRating();
        }
        else
        {
            adContentRating = targetingDataBuilder.getMaximumAdContentRating();
        }

        promise.resolve( adContentRating == null ? 0 : adContentRating.ordinal() );
    }

    @ReactMethod
    public void setTargetingDataEmail(@Nullable final String email)
    {
        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setEmail( email );
        }
        else
        {
            targetingDataBuilder.setEmail( email );
        }
    }

    @ReactMethod
    public void getTargetingDataEmail(final Promise promise)
    {
        String email;

        if ( isSdkInitialized )
        {
            email = sdk.getTargetingData().getEmail();
        }
        else
        {
            email = targetingDataBuilder.getEmail();
        }

        promise.resolve( email );
    }

    @ReactMethod
    public void setTargetingDataPhoneNumber(@Nullable final String phoneNumber)
    {
        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setPhoneNumber( phoneNumber );
        }
        else
        {
            targetingDataBuilder.setPhoneNumber( phoneNumber );
        }
    }

    @ReactMethod
    public void getTargetingDataPhoneNumber(final Promise promise)
    {
        String phoneNumber;

        if ( isSdkInitialized )
        {
            phoneNumber = sdk.getTargetingData().getPhoneNumber();
        }
        else
        {
            phoneNumber = targetingDataBuilder.getPhoneNumber();
        }

        promise.resolve( phoneNumber );
    }

    @ReactMethod
    public void setTargetingDataKeywords(@Nullable final ReadableArray rawKeywords)
    {
        ArrayList keywords = Arguments.toList( rawKeywords );

        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setKeywords( keywords );
        }
        else
        {
            targetingDataBuilder.setKeywords( keywords );
        }
    }

    @ReactMethod
    public void getTargetingDataKeywords(final Promise promise)
    {
        List<String> keywords;

        if ( isSdkInitialized )
        {
            keywords = sdk.getTargetingData().getKeywords();
        }
        else
        {
            keywords = targetingDataBuilder.getKeywords();
        }

        if ( keywords == null || keywords.isEmpty() )
        {
            promise.resolve( null );
        }
        else
        {
            promise.resolve( Arguments.makeNativeArray( keywords ) );
        }
    }

    @ReactMethod
    public void setTargetingDataInterests(@Nullable final ReadableArray rawInterests)
    {
        ArrayList interests = Arguments.toList( rawInterests );

        if ( isSdkInitialized )
        {
            sdk.getTargetingData().setInterests( interests );
        }
        else
        {
            targetingDataBuilder.setInterests( interests );
        }
    }

    @ReactMethod
    public void getTargetingDataInterests(final Promise promise)
    {
        List<String> interests;

        if ( isSdkInitialized )
        {
            interests = sdk.getTargetingData().getInterests();
        }
        else
        {
            interests = targetingDataBuilder.getInterests();
        }

        if ( interests == null || interests.isEmpty() )
        {
            promise.resolve( null );
        }
        else
        {
            promise.resolve( Arguments.makeNativeArray( interests ) );
        }
    }

    @ReactMethod
    public void clearAllTargetingData()
    {
        if ( !isSdkInitialized )
        {
            targetingDataBuilder.setYearOfBirth( null );
            targetingDataBuilder.setGender( Gender.UNKNOWN );
            targetingDataBuilder.setMaximumAdContentRating( AdContentRating.NONE );
            targetingDataBuilder.setEmail( null );
            targetingDataBuilder.setPhoneNumber( null );
            targetingDataBuilder.setKeywords( null );
            targetingDataBuilder.setInterests( null );
            return;
        }

        sdk.getTargetingData().clearAll();
    }

    @ReactMethod
    public void setLocationCollectionEnabled(final boolean enabled)
    {
        sdk.getSettings().setLocationCollectionEnabled( enabled );
    }

    // EVENT TRACKING

    @ReactMethod
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

    @ReactMethod
    public void createBanner(final String adUnitId, final String bannerPosition)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "createBanner" );
            return;
        }

        createAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), bannerPosition, DEFAULT_AD_VIEW_OFFSET );
    }

    @ReactMethod // NOTE: No function overloading in JS so we need new method signature
    public void createBannerWithOffsets(final String adUnitId, final String bannerPosition, final float x, final float y)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "createBannerWithOffsets" );
            return;
        }

        createAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), bannerPosition, getOffsetPixels( x, y, getReactApplicationContext() ) );
    }

    @ReactMethod
    public void setBannerBackgroundColor(final String adUnitId, final String hexColorCode)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setBannerBackgroundColor" );
            return;
        }

        setAdViewBackgroundColor( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), hexColorCode );
    }

    @ReactMethod
    public void setBannerPlacement(final String adUnitId, final String placement)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setBannerPlacement" );
            return;
        }

        setAdViewPlacement( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), placement );
    }

    @ReactMethod
    public void setBannerCustomData(final String adUnitId, final String customData)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setBannerCustomData" );
            return;
        }

        setAdViewCustomData( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), customData );
    }

    @ReactMethod
    public void setBannerWidth(final String adUnitId, final int widthDp)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setBannerWidth" );
            return;
        }

        setAdViewWidth( adUnitId, widthDp, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void updateBannerPosition(final String adUnitId, final String bannerPosition)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "updateBannerPosition" );
            return;
        }

        updateAdViewPosition( adUnitId, bannerPosition, DEFAULT_AD_VIEW_OFFSET, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void updateBannerOffsets(final String adUnitId, final float x, final float y)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "updateBannerOffsets" );
            return;
        }

        updateAdViewPosition( adUnitId, adViewPositions.get( adUnitId ), getOffsetPixels( x, y, getReactApplicationContext() ), getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void setBannerExtraParameter(final String adUnitId, final String key, final String value)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setBannerExtraParameter" );
            return;
        }

        setAdViewExtraParameters( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), key, value );
    }

    @ReactMethod
    public void setBannerLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        setAdViewLocalExtraParameters( adUnitId, getDeviceSpecificBannerAdViewAdFormat(), entry.getKey(), entry.getValue() );
    }

    @ReactMethod
    public void startBannerAutoRefresh(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "startBannerAutoRefresh" );
            return;
        }

        startAutoRefresh( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void stopBannerAutoRefresh(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "stopBannerAutoRefresh" );
            return;
        }

        stopAutoRefresh( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void showBanner(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showBanner" );
            return;
        }

        showAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void hideBanner(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "hideBanner" );
            return;
        }

        hideAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void destroyBanner(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "destroyBanner" );
            return;
        }

        destroyAdView( adUnitId, getDeviceSpecificBannerAdViewAdFormat() );
    }

    @ReactMethod
    public void getAdaptiveBannerHeightForWidth(final float width, final Promise promise)
    {
        promise.resolve( getDeviceSpecificBannerAdViewAdFormat().getAdaptiveSize( (int) width, getReactApplicationContext() ).getHeight() );
    }

    // MRECS

    @ReactMethod
    public void createMRec(final String adUnitId, final String mrecPosition)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "createMRec" );
            return;
        }

        createAdView( adUnitId, MaxAdFormat.MREC, mrecPosition, DEFAULT_AD_VIEW_OFFSET );
    }

    @ReactMethod
    public void setMRecPlacement(final String adUnitId, final String placement)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setMRecPlacement" );
            return;
        }

        setAdViewPlacement( adUnitId, MaxAdFormat.MREC, placement );
    }

    @ReactMethod
    public void setMRecCustomData(final String adUnitId, final String customData)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setMRecCustomData" );
            return;
        }

        setAdViewCustomData( adUnitId, MaxAdFormat.MREC, customData );
    }

    @ReactMethod
    public void updateMRecPosition(final String adUnitId, final String mrecPosition)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "updateMRecPosition" );
            return;
        }

        updateAdViewPosition( adUnitId, mrecPosition, DEFAULT_AD_VIEW_OFFSET, MaxAdFormat.MREC );
    }

    @ReactMethod
    public void setMRecExtraParameter(final String adUnitId, final String key, final String value)
    {
        setAdViewExtraParameters( adUnitId, MaxAdFormat.MREC, key, value );
    }

    @ReactMethod
    public void setMRecLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        setAdViewLocalExtraParameters( adUnitId, MaxAdFormat.MREC, entry.getKey(), entry.getValue() );
    }

    @ReactMethod
    public void startMRecAutoRefresh(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "startMRecAutoRefresh" );
            return;
        }

        startAutoRefresh( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod
    public void stopMRecAutoRefresh(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "stopMRecAutoRefresh" );
            return;
        }

        stopAutoRefresh( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod
    public void showMRec(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showMRec" );
            return;
        }

        showAdView( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod
    public void hideMRec(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "hideMRec" );
            return;
        }

        hideAdView( adUnitId, MaxAdFormat.MREC );
    }

    @ReactMethod
    public void destroyMRec(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "destroyMRec" );
            return;
        }

        destroyAdView( adUnitId, MaxAdFormat.MREC );
    }

    // INTERSTITIALS

    @ReactMethod
    public void loadInterstitial(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "loadInterstitial" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "loadInterstitial" );
        if ( interstitial == null )
        {
            sendReactNativeEventForAdLoadFailed( ON_INTERSTITIAL_LOAD_FAILED_EVENT, adUnitId, null );
            return;
        }

        interstitial.loadAd();
    }

    @ReactMethod
    public void isInterstitialReady(final String adUnitId, final Promise promise)
    {
        if ( !isSdkInitialized )
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

    @ReactMethod
    public void showInterstitial(final String adUnitId, final String placement, final String customData)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showInterstitial" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "showInterstitial" );
        if ( interstitial == null )
        {
            sendReactNativeEvent( ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT, getAdUnitInfo( adUnitId ) );
            return;
        }

        interstitial.showAd( placement, customData );
    }

    @ReactMethod
    public void setInterstitialExtraParameter(final String adUnitId, final String key, final String value)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setInterstitialExtraParameter" );
            return;
        }

        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId, "setInterstitialExtraParameter" );
        if ( interstitial == null ) return;

        interstitial.setExtraParameter( key, value );
    }

    @ReactMethod
    public void setInterstitialLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        if ( !isSdkInitialized )
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

    @ReactMethod
    public void loadRewardedAd(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "loadRewardedAd" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "loadRewardedAd" );
        if ( rewardedAd == null )
        {
            sendReactNativeEventForAdLoadFailed( ON_REWARDED_AD_LOAD_FAILED_EVENT, adUnitId, null );
            return;
        }

        rewardedAd.loadAd();
    }

    @ReactMethod
    public void isRewardedAdReady(final String adUnitId, final Promise promise)
    {
        if ( !isSdkInitialized )
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

    @ReactMethod
    public void showRewardedAd(final String adUnitId, final String placement, final String customData)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showRewardedAd" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "showRewardedAd" );
        if ( rewardedAd == null )
        {
            sendReactNativeEvent( ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT, getAdUnitInfo( adUnitId ) );
            return;
        }

        rewardedAd.showAd( placement, customData );
    }

    @ReactMethod
    public void setRewardedAdExtraParameter(final String adUnitId, final String key, final String value)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setRewardedAdExtraParameter" );
            return;
        }

        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId, "setRewardedAdExtraParameter" );
        if ( rewardedAd == null ) return;

        rewardedAd.setExtraParameter( key, value );
    }

    @ReactMethod
    public void setRewardedAdLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        if ( !isSdkInitialized )
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

    @ReactMethod
    public void loadAppOpenAd(final String adUnitId)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "loadAppOpenAd" );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        appOpenAd.loadAd();
    }

    @ReactMethod
    public void isAppOpenAdReady(final String adUnitId, final Promise promise)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "isAppOpenAdReady" );
            promise.resolve( false );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        promise.resolve( appOpenAd.isReady() );
    }

    @ReactMethod
    public void showAppOpenAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "showAppOpenAd" );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        appOpenAd.showAd( placement, customData );
    }

    @ReactMethod
    public void setAppOpenAdExtraParameter(final String adUnitId, final String key, final String value)
    {
        if ( !isSdkInitialized )
        {
            logUninitializedAccessError( "setAppOpenAdExtraParameter" );
            return;
        }

        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        appOpenAd.setExtraParameter( key, value );
    }

    @ReactMethod
    public void setAppOpenAdLocalExtraParameter(final String adUnitId, final ReadableMap parameterMap)
    {
        MaxAppOpenAd appOpenAd = retrieveAppOpenAd( adUnitId );
        Map.Entry<String, Object> entry = parameterMap.getEntryIterator().next();
        appOpenAd.setLocalExtraParameter( entry.getKey(), entry.getValue() );
    }

    // AD CALLBACKS

    @Override
    public void onAdLoaded(MaxAd ad)
    {
        String name;
        MaxAdFormat adFormat = ad.getFormat();
        if ( adFormat.isAdViewAd() )
        {
            name = ( MaxAdFormat.MREC == adFormat ) ? ON_MREC_AD_LOADED_EVENT : ON_BANNER_AD_LOADED_EVENT;

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
            name = ON_INTERSTITIAL_LOADED_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = ON_REWARDED_AD_LOADED_EVENT;
        }
        else if ( MaxAdFormat.APP_OPEN == adFormat )
        {
            name = ON_APPOPEN_AD_LOADED_EVENT;
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
            name = ( MaxAdFormat.MREC == adViewAdFormats.get( adUnitId ) ) ? ON_MREC_AD_LOAD_FAILED_EVENT : ON_BANNER_AD_LOAD_FAILED_EVENT;
        }
        else if ( interstitials.containsKey( adUnitId ) )
        {
            name = ON_INTERSTITIAL_LOAD_FAILED_EVENT;
        }
        else if ( rewardedAds.containsKey( adUnitId ) )
        {
            name = ON_REWARDED_AD_LOAD_FAILED_EVENT;
        }
        else if ( appOpenAds.containsKey( adUnitId ) )
        {
            name = ON_APPOPEN_AD_LOAD_FAILED_EVENT;
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
            name = ON_BANNER_AD_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.MREC == adFormat )
        {
            name = ON_MREC_AD_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = ON_INTERSTITIAL_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = ON_REWARDED_AD_CLICKED_EVENT;
        }
        else if ( MaxAdFormat.APP_OPEN == adFormat )
        {
            name = ON_APPOPEN_AD_CLICKED_EVENT;
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
            name = ON_INTERSTITIAL_DISPLAYED_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = ON_REWARDED_AD_DISPLAYED_EVENT;
        }
        else // APP OPEN
        {
            name = ON_APPOPEN_AD_DISPLAYED_EVENT;
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
            name = ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT;
        }
        else // APP OPEN
        {
            name = ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT;
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
            name = ON_INTERSTITIAL_HIDDEN_EVENT;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = ON_REWARDED_AD_HIDDEN_EVENT;
        }
        else // APP OPEN
        {
            name = ON_APPOPEN_AD_HIDDEN_EVENT;
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

        sendReactNativeEvent( ( MaxAdFormat.MREC == adFormat ) ? ON_MREC_AD_EXPANDED_EVENT : ON_BANNER_AD_EXPANDED_EVENT, getAdInfo( ad ) );
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

        sendReactNativeEvent( ( MaxAdFormat.MREC == adFormat ) ? ON_MREC_AD_COLLAPSED_EVENT : ON_BANNER_AD_COLLAPSED_EVENT, getAdInfo( ad ) );
    }

    @Override
    public void onAdRevenuePaid(final MaxAd ad)
    {
        final MaxAdFormat adFormat = ad.getFormat();
        final String name;
        if ( MaxAdFormat.BANNER == adFormat || MaxAdFormat.LEADER == adFormat )
        {
            name = ON_BANNER_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.MREC == adFormat )
        {
            name = ON_MREC_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.INTERSTITIAL == adFormat )
        {
            name = ON_INTERSTITIAL_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.REWARDED == adFormat )
        {
            name = ON_REWARDED_AD_REVENUE_PAID;
        }
        else if ( MaxAdFormat.APP_OPEN == adFormat )
        {
            name = ON_APPOPEN_AD_REVENUE_PAID;
        }
        else
        {
            logInvalidAdFormat( adFormat );
            return;
        }

        sendReactNativeEvent( name, getAdRevenueInfo( ad ) );
    }

    @Override
    public void onRewardedVideoCompleted(@NonNull final MaxAd ad)
    {
        // This event is not forwarded
    }

    @Override
    public void onRewardedVideoStarted(@NonNull final MaxAd ad)
    {
        // This event is not forwarded
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
        sendReactNativeEvent( "OnRewardedAdReceivedRewardEvent", params );
    }

    // INTERNAL METHODS

    private void createAdView(final String adUnitId, final MaxAdFormat adFormat, final String adViewPosition, final Point adViewOffsetPixels)
    {
        // Run on main thread to ensure there are no concurrency issues with other ad view methods
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

            d( "Setting placement \"" + placement + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat, "", DEFAULT_AD_VIEW_OFFSET );
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
        getReactApplicationContext().runOnUiQueueThread( () -> {

            d( "Setting custom data \"" + customData + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

            final MaxAdView adView = retrieveAdView( adUnitId, adFormat, "", DEFAULT_AD_VIEW_OFFSET );
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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
        getReactApplicationContext().runOnUiQueueThread( () -> {

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
                final RelativeLayout relativeLayout = new RelativeLayout( getReactApplicationContext() );
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
        return retrieveAdView( adUnitId, adFormat, null, DEFAULT_AD_VIEW_OFFSET );
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat, String adViewPosition, Point adViewOffsetPixels)
    {
        MaxAdView result = adViews.get( adUnitId );
        if ( result == null && adViewPosition != null && adViewOffsetPixels != null )
        {
            result = new MaxAdView( adUnitId, adFormat, sdk, getReactApplicationContext() );
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
            adViewWidthDp = AppLovinSdkUtils.pxToDp( getReactApplicationContext(), adViewWidthPx );
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
            adViewHeightDp = adFormat.getAdaptiveSize( adViewWidthDp, getReactApplicationContext() ).getHeight();
        }
        else
        {
            adViewHeightDp = adFormat.getSize().getHeight();
        }

        final int widthPx = AppLovinSdkUtils.dpToPx( getReactApplicationContext(), adViewWidthDp );
        final int heightPx = AppLovinSdkUtils.dpToPx( getReactApplicationContext(), adViewHeightDp );

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
        return getDeviceSpecificBannerAdViewAdFormat( getReactApplicationContext() );
    }

    public static MaxAdFormat getDeviceSpecificBannerAdViewAdFormat(final Context context)
    {
        return AppLovinSdkUtils.isTablet( context ) ? MaxAdFormat.LEADER : MaxAdFormat.BANNER;
    }

    private static Point getOffsetPixels(final float xDp, final float yDp, final Context context)
    {
        return new Point( AppLovinSdkUtils.dpToPx( context, (int) xDp ), AppLovinSdkUtils.dpToPx( context, (int) yDp ) );
    }

    private static Gender getAppLovinGender(@Nullable final String gender)
    {
        if ( gender != null )
        {
            if ( "F".equalsIgnoreCase( gender ) )
            {
                return Gender.FEMALE;
            }
            else if ( "M".equalsIgnoreCase( gender ) )
            {
                return Gender.MALE;
            }
            else if ( "O".equalsIgnoreCase( gender ) )
            {
                return Gender.OTHER;
            }
        }

        return Gender.UNKNOWN;
    }

    private static String getRawAppLovinGender(final Gender gender)
    {
        if ( gender == Gender.FEMALE )
        {
            return "F";
        }
        else if ( gender == Gender.MALE )
        {
            return "M";
        }
        else if ( gender == Gender.OTHER )
        {
            return "O";
        }

        return "U";
    }

    private static AdContentRating getAppLovinAdContentRating(final int maximumAdContentRating)
    {
        if ( maximumAdContentRating == 1 )
        {
            return AdContentRating.ALL_AUDIENCES;
        }
        else if ( maximumAdContentRating == 2 )
        {
            return AdContentRating.EVERYONE_OVER_TWELVE;
        }
        else if ( maximumAdContentRating == 3 )
        {
            return AdContentRating.MATURE_AUDIENCES;
        }

        return AdContentRating.NONE;
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
        adInfo.putString( "creativeId", AppLovinSdkUtils.isValidString( ad.getCreativeId() ) ? ad.getCreativeId() : "" );
        adInfo.putString( "networkName", ad.getNetworkName() );
        adInfo.putString( "placement", AppLovinSdkUtils.isValidString( ad.getPlacement() ) ? ad.getPlacement() : "" );
        adInfo.putDouble( "revenue", ad.getRevenue() );
        adInfo.putMap( "waterfall", createAdWaterfallInfo( ad.getWaterfall() ) );
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

    public WritableMap getAdRevenueInfo(final MaxAd ad)
    {
        WritableMap adInfo = getAdInfo( ad );
        adInfo.putString( "networkPlacement", ad.getNetworkPlacement() );
        adInfo.putString( "revenuePrecision", ad.getRevenuePrecision() );
        adInfo.putString( "countryCode", sdkConfiguration.getCountryCode() );
        return adInfo;
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
        if ( !isSdkInitialized )
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
        final Map<String, Object> constants = new HashMap<>();

        constants.put( "ON_MREC_AD_LOADED_EVENT", ON_MREC_AD_LOADED_EVENT );
        constants.put( "ON_MREC_AD_LOAD_FAILED_EVENT", ON_MREC_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_MREC_AD_CLICKED_EVENT", ON_MREC_AD_CLICKED_EVENT );
        constants.put( "ON_MREC_AD_COLLAPSED_EVENT", ON_MREC_AD_COLLAPSED_EVENT );
        constants.put( "ON_MREC_AD_EXPANDED_EVENT", ON_MREC_AD_EXPANDED_EVENT );
        constants.put( "ON_MREC_AD_REVENUE_PAID", ON_MREC_AD_REVENUE_PAID );

        constants.put( "ON_BANNER_AD_LOADED_EVENT", ON_BANNER_AD_LOADED_EVENT );
        constants.put( "ON_BANNER_AD_LOAD_FAILED_EVENT", ON_BANNER_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_BANNER_AD_CLICKED_EVENT", ON_BANNER_AD_CLICKED_EVENT );
        constants.put( "ON_BANNER_AD_COLLAPSED_EVENT", ON_BANNER_AD_COLLAPSED_EVENT );
        constants.put( "ON_BANNER_AD_EXPANDED_EVENT", ON_BANNER_AD_EXPANDED_EVENT );
        constants.put( "ON_BANNER_AD_REVENUE_PAID", ON_BANNER_AD_REVENUE_PAID );

        constants.put( "ON_INTERSTITIAL_LOADED_EVENT", ON_INTERSTITIAL_LOADED_EVENT );
        constants.put( "ON_INTERSTITIAL_LOAD_FAILED_EVENT", ON_INTERSTITIAL_LOAD_FAILED_EVENT );
        constants.put( "ON_INTERSTITIAL_CLICKED_EVENT", ON_INTERSTITIAL_CLICKED_EVENT );
        constants.put( "ON_INTERSTITIAL_DISPLAYED_EVENT", ON_INTERSTITIAL_DISPLAYED_EVENT );
        constants.put( "ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT", ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT );
        constants.put( "ON_INTERSTITIAL_HIDDEN_EVENT", ON_INTERSTITIAL_HIDDEN_EVENT );
        constants.put( "ON_INTERSTITIAL_AD_REVENUE_PAID", ON_INTERSTITIAL_AD_REVENUE_PAID );

        constants.put( "ON_REWARDED_AD_LOADED_EVENT", ON_REWARDED_AD_LOADED_EVENT );
        constants.put( "ON_REWARDED_AD_LOAD_FAILED_EVENT", ON_REWARDED_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_REWARDED_AD_CLICKED_EVENT", ON_REWARDED_AD_CLICKED_EVENT );
        constants.put( "ON_REWARDED_AD_DISPLAYED_EVENT", ON_REWARDED_AD_DISPLAYED_EVENT );
        constants.put( "ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT", ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT );
        constants.put( "ON_REWARDED_AD_HIDDEN_EVENT", ON_REWARDED_AD_HIDDEN_EVENT );
        constants.put( "ON_REWARDED_AD_RECEIVED_REWARD_EVENT", ON_REWARDED_AD_RECEIVED_REWARD_EVENT );
        constants.put( "ON_REWARDED_AD_REVENUE_PAID", ON_REWARDED_AD_REVENUE_PAID );

        constants.put( "ON_APPOPEN_AD_LOADED_EVENT", ON_APPOPEN_AD_LOADED_EVENT );
        constants.put( "ON_APPOPEN_AD_LOAD_FAILED_EVENT", ON_APPOPEN_AD_LOAD_FAILED_EVENT );
        constants.put( "ON_APPOPEN_AD_CLICKED_EVENT", ON_APPOPEN_AD_CLICKED_EVENT );
        constants.put( "ON_APPOPEN_AD_DISPLAYED_EVENT", ON_APPOPEN_AD_DISPLAYED_EVENT );
        constants.put( "ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT", ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT );
        constants.put( "ON_APPOPEN_AD_HIDDEN_EVENT", ON_APPOPEN_AD_HIDDEN_EVENT );
        constants.put( "ON_APPOPEN_AD_REVENUE_PAID", ON_APPOPEN_AD_REVENUE_PAID );

        constants.put( "TOP_CENTER_POSITION", TOP_CENTER );
        constants.put( "TOP_LEFT_POSITION", TOP_LEFT );
        constants.put( "TOP_RIGHT_POSITION", TOP_RIGHT );
        constants.put( "CENTERED_POSITION", CENTERED );
        constants.put( "CENTER_LEFT_POSITION", CENTER_LEFT );
        constants.put( "CENTER_RIGHT_POSITION", CENTER_RIGHT );
        constants.put( "BOTTOM_LEFT_POSITION", BOTTOM_LEFT );
        constants.put( "BOTTOM_CENTER_POSITION", BOTTOM_CENTER );
        constants.put( "BOTTOM_RIGHT_POSITION", BOTTOM_RIGHT );

        constants.put( "BANNER_AD_FORMAT_LABEL", MaxAdFormat.BANNER.getLabel() );
        constants.put( "MREC_AD_FORMAT_LABEL", MaxAdFormat.MREC.getLabel() );

        return constants;
    }
}
