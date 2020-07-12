package com.applovin.reactnative;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Rect;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.OrientationEventListener;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdFormat;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxAdViewAdListener;
import com.applovin.mediation.MaxReward;
import com.applovin.mediation.MaxRewardedAdListener;
import com.applovin.mediation.ads.MaxAdView;
import com.applovin.mediation.ads.MaxInterstitialAd;
import com.applovin.mediation.ads.MaxRewardedAd;
import com.applovin.sdk.AppLovinPrivacySettings;
import com.applovin.sdk.AppLovinSdk;
import com.applovin.sdk.AppLovinSdkConfiguration;
import com.applovin.sdk.AppLovinSdkSettings;
import com.applovin.sdk.AppLovinSdkUtils;
import com.applovin.sdk.AppLovinVariableService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;

import androidx.annotation.NonNull;

/**
 * Created by Thomas So on July 11 2020
 */
public class AppLovinMAXModule
  extends ReactContextBaseJavaModule implements MaxAdListener, MaxAdViewAdListener, MaxRewardedAdListener, AppLovinVariableService.OnVariablesUpdateListener
{
   private static boolean           sIsPluginInitialized = false;
    private static boolean           sIsSdkInitialized    = false;

    private static String                   sSdkKey;
    private static AppLovinSdkConfiguration sSdkConfiguration;

    // Store these values if pub attempts to set it before calling initializeSdk()
    private static String       sUserIdToSet;
    private static List<String> sTestDeviceAdvertisingIds;
    private static Boolean      sVerboseLogging;

  public AppLovinMAXModule(@NonNull final ReactApplicationContext reactContext)
  {
    super( reactContext );
  }

  @Override
  @NonNull public String getName()
  {
    return "AppLovinMAX";
  }

  //    // Example method
  //    // See https://facebook.github.io/react-native/docs/native-modules-android
  //    @ReactMethod
  //    fun multiply(a: Int, b: Int, promise: Promise) {
  //
  //      promise.resolve(a * b)
  //
  //    }

  private static final String SDK_TAG = "AppLovinSdk";
    private static final String TAG     = "MaxUnityAdManager";
    private static final String VERSION = BuildConfig.VERSION_NAME;

    private static final String SERIALIZED_KEY_VALUE_SEPARATOR      = String.valueOf( (char) 28 );
    private static final String SERIALIZED_KEY_VALUE_PAIR_SEPARATOR = String.valueOf( (char) 29 );

    private static final ScheduledThreadPoolExecutor sThreadPoolExecutor = new ScheduledThreadPoolExecutor( 3, new SdkThreadFactory() );

    private static MaxUnityAdManager       instance;
    private static WeakReference<Activity> currentActivity;

    public interface Listener
    {
        void onSdkInitializationComplete(AppLovinSdkConfiguration appLovinSdkConfiguration);
    }

    private       AppLovinSdk                    sdk;
    private final Map<String, MaxInterstitialAd> mInterstitials;
    private final Map<String, MaxRewardedAd> mRewardedAds;
    private final Map<String, MaxAdView>     mAdViews;
    private final Map<String, MaxAdFormat>   mAdViewAdFormats;
    private final Map<String, String>            mAdViewPositions;
    private final Map<String, MaxAdFormat> mVerticalAdViewFormats;
    private final List<String>             mAdUnitIdsToShowAfterCreate;

    private final Map<String, MaxAd> mAdInfoMap;
    private final Object             mAdInfoMapLock;

    /**
     * This constructor is used in Unity. Unity will provide the current activity.
     */
    public MaxUnityAdManager()
    {
        this( null );
    }

    /**
     * This constructor is used outside of Unity.
     *
     * @param currentActivity Activity to use outside of Unity.
     */
    private MaxUnityAdManager(final Activity currentActivity)
    {
        MaxUnityAdManager.currentActivity = new WeakReference<>( currentActivity );

        mInterstitials = new HashMap<>( 2 );
        mRewardedAds = new HashMap<>( 2 );
        mAdViews = new HashMap<>( 2 );
        mAdViewAdFormats = new HashMap<>( 2 );
        mAdViewPositions = new HashMap<>( 2 );
        mAdInfoMap = new HashMap<>();
        mAdInfoMapLock = new Object();
        mVerticalAdViewFormats = new HashMap<>( 2 );
        mAdUnitIdsToShowAfterCreate = new ArrayList<>( 2 );

        // Enable orientation change listener, so that the position can be updated for vertical banners.
        new OrientationEventListener( getCurrentActivity() )
        {
            @Override
            public void onOrientationChanged(final int orientation)
            {
                for ( final Map.Entry<String, MaxAdFormat> adUnitFormats : mVerticalAdViewFormats.entrySet() )
                {
                    positionAdView( adUnitFormats.getKey(), adUnitFormats.getValue() );
                }
            }
        }.enable();
    }

    public static boolean isInitialized()
    {
        return sIsPluginInitialized && sIsSdkInitialized;
    }

    public static void setUserId(String userId)
    {
        if ( sSdk != null )
        {
            sSdk.setUserIdentifier( userId );
            sUserIdToSet = null;
        }
        else
        {
            sUserIdToSet = userId;
        }
    }

    public static void showMediationDebugger()
    {
        if ( sSdk == null )
        {
            Log.d("[" + TAG + "]", "Failed to show mediation debugger - please ensure the AppLovin MAX Unity Plugin has been initialized by calling 'MaxSdk.InitializeSdk();'!" );
            return;
        }

        sSdk.showMediationDebugger();
    }

    public static int getConsentDialogState()
    {
        if ( !isPluginInitialized() ) return ConsentDialogState.UNKNOWN.ordinal();

        return sSdkConfiguration.getConsentDialogState().ordinal();
    }

    public static void setHasUserConsent(boolean hasUserConsent)
    {
        AppLovinPrivacySettings.setHasUserConsent( hasUserConsent, Utils.getCurrentActivity() );
    }

    public static boolean hasUserConsent()
    {
        return AppLovinPrivacySettings.hasUserConsent( Utils.getCurrentActivity() );
    }

    public static void setIsAgeRestrictedUser(boolean isAgeRestrictedUser)
    {
        AppLovinPrivacySettings.setIsAgeRestrictedUser( isAgeRestrictedUser, Utils.getCurrentActivity() );
    }

    public static boolean isAgeRestrictedUser()
    {
        return AppLovinPrivacySettings.isAgeRestrictedUser( Utils.getCurrentActivity() );
    }

    public static void setDoNotSell(final boolean doNotSell)
    {
        AppLovinPrivacySettings.setDoNotSell( doNotSell, Utils.getCurrentActivity() );
    }

    public static boolean isDoNotSell()
    {
        return AppLovinPrivacySettings.isDoNotSell( Utils.getCurrentActivity() );
    }

    public static void setVerboseLogging(final boolean enabled)
    {
        if ( sSdk != null )
        {
            sSdk.getSettings().setVerboseLogging( enabled );
            sVerboseLogging = null;
        }
        else
        {
            sVerboseLogging = enabled;
        }
    }

    public static void setTestDeviceAdvertisingIds(final String[] advertisingIds)
    {
        if ( sSdk != null )
        {
            sSdk.getSettings().setTestDeviceAdvertisingIds( Arrays.asList( advertisingIds ) );
            sTestDeviceAdvertisingIds = null;
        }
        else
        {
            sTestDeviceAdvertisingIds = Arrays.asList( advertisingIds );
        }
    }


    /**
     * Creates an instance of {@link MaxUnityAdManager} if needed and returns the singleton instance.
     */
    public static MaxUnityAdManager getInstance(final Activity currentActivity)
    {
        if ( instance == null )
        {
            instance = new MaxUnityAdManager( currentActivity );
        }
        else
        {
            MaxUnityAdManager.currentActivity = new WeakReference<>( currentActivity );
        }

        return instance;
    }

    public AppLovinSdk initializeSdkWithCompletionHandler(final String sdkKey, final String serializedMetaData, final Listener listener)
    {
        final Activity currentActivity = getCurrentActivity();
        sdk = AppLovinSdk.getInstance( sdkKey, generateSdkSettings( serializedMetaData, currentActivity ), currentActivity );
        sdk.getVariableService().setOnVariablesUpdateListener( this );
        sdk.setPluginVersion( "Max-Unity-" + VERSION );
        sdk.setMediationProvider( "max" );
        sdk.initializeSdk( new AppLovinSdk.SdkInitializationListener()
        {
            @Override
            public void onSdkInitialized(final AppLovinSdkConfiguration config)
            {
                listener.onSdkInitializationComplete( config );

                final Map<String, String> args = new HashMap<>( 2 );
                args.put( "name", "OnSdkInitializedEvent" );
                args.put( "consentDialogState", Integer.toString( config.getConsentDialogState().ordinal() ) );
                forwardUnityEventWithArgs( args );
            }
        } );

        return sdk;
    }

    // BANNERS

    public void createBanner(final String adUnitId, final String bannerPosition)
    {
        createAdView( adUnitId, getDeviceSpecificAdViewAdFormat(), bannerPosition );
    }

    public void setBannerPlacement(final String adUnitId, final String placement)
    {
        setAdViewPlacement( adUnitId, getDeviceSpecificAdViewAdFormat(), placement );
    }

    public void updateBannerPosition(final String adUnitId, final String bannerPosition)
    {
        updateAdViewPosition( adUnitId, bannerPosition, getDeviceSpecificAdViewAdFormat() );
    }

    public void showBanner(final String adUnitId)
    {
        showAdView( adUnitId, getDeviceSpecificAdViewAdFormat() );
    }

    public void hideBanner(final String adUnitId)
    {
        hideAdView( adUnitId, getDeviceSpecificAdViewAdFormat() );
    }

    public void destroyBanner(final String adUnitId)
    {
        destroyAdView( adUnitId, getDeviceSpecificAdViewAdFormat() );
    }

    public void setBannerBackgroundColor(final String adUnitId, final String hexColorCode)
    {
        setAdViewBackgroundColor( adUnitId, getDeviceSpecificAdViewAdFormat(), hexColorCode );
    }

    public void setBannerExtraParameter(final String adUnitId, final String key, final String value)
    {
        setAdViewExtraParameters( adUnitId, getDeviceSpecificAdViewAdFormat(), value, key );
    }

    // MRECS

    public void createMRec(final String adUnitId, final String mrecPosition)
    {
        createAdView( adUnitId, MaxAdFormat.MREC, mrecPosition );
    }

    public void setMRecPlacement(final String adUnitId, final String placement)
    {
        setAdViewPlacement( adUnitId, MaxAdFormat.MREC, placement );
    }

    public void updateMRecPosition(final String adUnitId, final String mrecPosition)
    {
        updateAdViewPosition( adUnitId, mrecPosition, MaxAdFormat.MREC );
    }

    public void showMRec(final String adUnitId)
    {
        showAdView( adUnitId, MaxAdFormat.MREC );
    }

    public void hideMRec(final String adUnitId)
    {
        hideAdView( adUnitId, MaxAdFormat.MREC );
    }

    public void destroyMRec(final String adUnitId)
    {
        destroyAdView( adUnitId, MaxAdFormat.MREC );
    }

    // INTERSTITIALS

    public void loadInterstitial(String adUnitId)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        interstitial.loadAd();
    }

    public boolean isInterstitialReady(String adUnitId)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        return interstitial.isReady();
    }

    public void showInterstitial(String adUnitId, String placement)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        interstitial.showAd( placement );
    }

    public void setInterstitialExtraParameter(String adUnitId, String key, String value)
    {
        MaxInterstitialAd interstitial = retrieveInterstitial( adUnitId );
        interstitial.setExtraParameter( key, value );
    }

    // REWARDED

    public void loadRewardedAd(String adUnitId)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        rewardedAd.loadAd();
    }

    public boolean isRewardedAdReady(String adUnitId)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        return rewardedAd.isReady();
    }

    public void showRewardedAd(String adUnitId, String placement)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        rewardedAd.showAd( placement );
    }

    public void setRewardedAdExtraParameter(String adUnitId, String key, String value)
    {
        MaxRewardedAd rewardedAd = retrieveRewardedAd( adUnitId );
        rewardedAd.setExtraParameter( key, value );
    }

    // EVENT TRACKING

    public void trackEvent(final String event, final String parameters)
    {
        if ( sdk == null ) return;

        final Map<String, String> deserialized = deserializeParameters( parameters );
        sdk.getEventService().trackEvent( event, deserialized );
    }

    // VARIABLE SERVICE

    /**
     * @deprecated This API has been deprecated. Please use our SDK's initialization callback to retrieve variables instead.
     */
    @Deprecated
    public void loadVariables()
    {
        sdk.getVariableService().loadVariables();
    }

    @Override
    public void onVariablesUpdate(final Bundle variables)
    {
        final Map<String, String> args = new HashMap<>( 1 );
        args.put( "name", "OnVariablesUpdatedEvent" );
        forwardUnityEventWithArgs( args );
    }

    // AD INFO

    public String getAdInfo(final String adUnitId)
    {
        if ( TextUtils.isEmpty( adUnitId ) ) return "";

        final MaxAd ad;
        synchronized ( mAdInfoMapLock )
        {
            ad = mAdInfoMap.get( adUnitId );
        }

        if ( ad == null ) return "";

        Map<String, String> adInfo = new HashMap<>( 2 );
        adInfo.put( "adUnitId", adUnitId );
        adInfo.put( "networkName", ad.getNetworkName() );
        return propsStrFromDictionary( adInfo );
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
            positionAdView( ad );

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

        synchronized ( mAdInfoMapLock )
        {
            mAdInfoMap.put( ad.getAdUnitId(), ad );
        }

        final Map<String, String> args = new HashMap<>( 2 );
        args.put( "name", name );
        args.put( "adUnitId", ad.getAdUnitId() );
        forwardUnityEventWithArgs( args );
    }

    @Override
    public void onAdLoadFailed(String adUnitId, final int errorCode)
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

        synchronized ( mAdInfoMapLock )
        {
            mAdInfoMap.remove( adUnitId );
        }

        final Map<String, String> args = new HashMap<>( 3 );
        args.put( "name", name );
        args.put( "adUnitId", adUnitId );
        args.put( "errorCode", Integer.toString( errorCode ) );
        forwardUnityEventWithArgs( args );
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

        final Map<String, String> args = new HashMap<>( 2 );
        args.put( "name", name );
        args.put( "adUnitId", ad.getAdUnitId() );
        forwardUnityEventWithArgs( args );
    }

    @Override
    public void onAdDisplayed(final MaxAd ad)
    {
        // BMLs do not support [DISPLAY] events in Unity
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

        final Map<String, String> args = new HashMap<>( 2 );
        args.put( "name", name );
        args.put( "adUnitId", ad.getAdUnitId() );
        forwardUnityEventWithArgs( args );
    }

    @Override
    public void onAdDisplayFailed(final MaxAd ad, final int errorCode)
    {
        // BMLs do not support [DISPLAY] events in Unity
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

        final Map<String, String> args = new HashMap<>( 3 );
        args.put( "name", name );
        args.put( "adUnitId", ad.getAdUnitId() );
        args.put( "errorCode", Integer.toString( errorCode ) );
        forwardUnityEventWithArgs( args );
    }

    @Override
    public void onAdHidden(final MaxAd ad)
    {
        // BMLs do not support [HIDDEN] events in Unity
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

        final Map<String, String> args = new HashMap<>( 2 );
        args.put( "name", name );
        args.put( "adUnitId", ad.getAdUnitId() );
        forwardUnityEventWithArgs( args );
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

        final Map<String, String> args = new HashMap<>( 2 );
        args.put( "name", ( MaxAdFormat.MREC == adFormat ) ? "OnMRecAdCollapsedEvent" : "OnBannerAdCollapsedEvent" );
        args.put( "adUnitId", ad.getAdUnitId() );
        forwardUnityEventWithArgs( args );
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

        final Map<String, String> args = new HashMap<>( 2 );
        args.put( "name", ( MaxAdFormat.MREC == adFormat ) ? "OnMrecAdCollapsedEvent" : "OnBannerAdExpandedEvent" );
        args.put( "adUnitId", ad.getAdUnitId() );
        forwardUnityEventWithArgs( args );
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
        final int rewardAmountInt = reward != null ? reward.getAmount() : 0;
        final String rewardAmount = Integer.toString( rewardAmountInt );

        final Map<String, String> args = new HashMap<>( 4 );
        args.put( "name", "OnRewardedAdReceivedRewardEvent" );
        args.put( "adUnitId", ad.getAdUnitId() );
        args.put( "rewardLabel", rewardLabel );
        args.put( "rewardAmount", rewardAmount );
        forwardUnityEventWithArgs( args );
    }

    // INTERNAL METHODS

    private void createAdView(final String adUnitId, final MaxAdFormat adFormat, final String adViewPosition)
    {
        // Run on main thread to ensure there are no concurrency issues with other ad view methods
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
        {
            @Override
            public void run()
            {
                d( "Creating " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\" and position: \"" + adViewPosition + "\"" );

                // Retrieve ad view from the map
                final MaxAdView adView = retrieveAdView( adUnitId, adFormat, adViewPosition );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setVisibility( View.GONE );

                if ( adView.getParent() == null )
                {
                    final Activity currentActivity = getCurrentActivity();
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
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
        {
            @Override
            public void run()
            {
                d( "Setting placement \"" + placement + "\" for " + adFormat.getLabel() + " with ad unit id \"" + adUnitId + "\"" );

                final MaxAdView adView = retrieveAdView( adUnitId, adFormat );
                if ( adView == null )
                {
                    e( adFormat.getLabel() + " does not exist" );
                    return;
                }

                adView.setPlacement( placement );
            }
        } );
    }

    private void updateAdViewPosition(final String adUnitId, final String adViewPosition, final MaxAdFormat adFormat)
    {
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
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

                // Check if the previous position is same as the new position. If so, no need to update the position again.
                final String previousPosition = mAdViewPositions.get( adUnitId );
                if ( adViewPosition == null || adViewPosition.equals( previousPosition ) ) return;

                mAdViewPositions.put( adUnitId, adViewPosition );
                positionAdView( adUnitId, adFormat );
            }
        } );
    }

    private void showAdView(final String adUnitId, final MaxAdFormat adFormat)
    {
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
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
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
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
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
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
                adView.destroy();

                mAdViews.remove( adUnitId );
                mAdViewAdFormats.remove( adUnitId );
                mAdViewPositions.remove( adUnitId );
                mVerticalAdViewFormats.remove( adUnitId );
            }
        } );
    }

    private void setAdViewBackgroundColor(final String adUnitId, final MaxAdFormat adFormat, final String hexColorCode)
    {
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
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

    private void setAdViewExtraParameters(final String adUnitId, final MaxAdFormat adFormat, final String value, final String key)
    {
        Utils.runSafelyOnUiThread( getCurrentActivity(), new Runnable()
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
                        forcedAdFormat = getDeviceSpecificAdViewAdFormat();
                    }

                    mAdViewAdFormats.put( adUnitId, forcedAdFormat );
                    positionAdView( adUnitId, forcedAdFormat );
                }
            }
        } );
    }

    private void logInvalidAdFormat(MaxAdFormat adFormat)
    {
        logStackTrace( new IllegalStateException( "invalid ad format: " + adFormat ) );
    }

    private void logStackTrace(Exception e)
    {
        e( Log.getStackTraceString( e ) );
    }

    private void d(final String message)
    {
        final String fullMessage = "[" + TAG + "] " + message;
        Log.d( SDK_TAG, fullMessage );
    }

    private void e(final String message)
    {
        final String fullMessage = "[" + TAG + "] " + message;
        Log.e( SDK_TAG, fullMessage );
    }

    private MaxInterstitialAd retrieveInterstitial(String adUnitId)
    {
        MaxInterstitialAd result = mInterstitials.get( adUnitId );
        if ( result == null )
        {
            result = new MaxInterstitialAd( adUnitId, sdk, getCurrentActivity() );
            result.setListener( this );

            mInterstitials.put( adUnitId, result );
        }

        return result;
    }

    private MaxRewardedAd retrieveRewardedAd(String adUnitId)
    {
        MaxRewardedAd result = mRewardedAds.get( adUnitId );
        if ( result == null )
        {
            result = MaxRewardedAd.getInstance( adUnitId, sdk, getCurrentActivity() );
            result.setListener( this );

            mRewardedAds.put( adUnitId, result );
        }

        return result;
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat)
    {
        return retrieveAdView( adUnitId, adFormat, null );
    }

    private MaxAdView retrieveAdView(String adUnitId, MaxAdFormat adFormat, String adViewPosition)
    {
        MaxAdView result = mAdViews.get( adUnitId );
        if ( result == null && adViewPosition != null )
        {
            result = new MaxAdView( adUnitId, adFormat, sdk, getCurrentActivity() );
            result.setListener( this );

            mAdViews.put( adUnitId, result );
            mAdViewPositions.put( adUnitId, adViewPosition );
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

        final String adViewPosition = mAdViewPositions.get( adUnitId );
        final RelativeLayout relativeLayout = (RelativeLayout) adView.getParent();

        // Size the ad
        final AdViewSize adViewSize = getAdViewSize( adFormat );
        final int width = AppLovinSdkUtils.dpToPx( getCurrentActivity(), adViewSize.mWidthDp );
        final int height = AppLovinSdkUtils.dpToPx( getCurrentActivity(), adViewSize.mHeightDp );

        final RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) adView.getLayoutParams();
        params.height = height;
        adView.setLayoutParams( params );

        // Parse gravity
        int gravity = 0;

        // Reset rotation, translation and margins so that the banner can be positioned again
        adView.setRotation( 0 );
        adView.setTranslationX( 0 );
        params.setMargins( 0, 0, 0, 0 );
        mVerticalAdViewFormats.remove( adUnitId );

        if ( "Centered".equalsIgnoreCase( adViewPosition ) )
        {
            gravity = Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL;
        }
        else
        {
            // Figure out vertical params
            if ( adViewPosition.contains( "Top" ) )
            {
                gravity = Gravity.TOP;
            }
            else if ( adViewPosition.contains( "Bottom" ) )
            {
                gravity = Gravity.BOTTOM;
            }

            // Figure out horizontal params
            if ( adViewPosition.contains( "Center" ) )
            {
                gravity |= Gravity.CENTER_HORIZONTAL;
                params.width = ( MaxAdFormat.MREC == adFormat ) ? width : RelativeLayout.LayoutParams.MATCH_PARENT; // Stretch width if banner

                // Check if the publisher wants the ad view to be vertical and update the position accordingly ('CenterLeft' or 'CenterRight').
                final boolean containsLeft = adViewPosition.contains( "Left" );
                final boolean containsRight = adViewPosition.contains( "Right" );
                if ( containsLeft || containsRight )
                {
                    // First, center the ad view in the view.
                    gravity |= Gravity.CENTER_VERTICAL;

                    // For banners, set the width to the height of the screen to span the ad across the screen after it is rotated.
                    // Android by default clips a view bounds if it goes over the size of the screen. We can overcome it by setting negative margins to match our required size.
                    if ( MaxAdFormat.MREC == adFormat )
                    {
                        gravity |= adViewPosition.contains( "Left" ) ? Gravity.LEFT : Gravity.RIGHT;
                    }
                    else
                    {
                        /* Align the center of the view such that when rotated it snaps into place.
                         *
                         *                  +---+---+-------+
                         *                  |   |           |
                         *                  |   |           |
                         *                  |   |           |
                         *                  |   |           |
                         *                  |   |           |
                         *                  |   |           |
                         *    +-------------+---+-----------+--+
                         *    |             | + |   +       |  |
                         *    +-------------+---+-----------+--+
                         *                  |   |           |
                         *                  | ^ |   ^       |
                         *                  | +-----+       |
                         *                  Translation     |
                         *                  |   |           |
                         *                  |   |           |
                         *                  +---+-----------+
                         */
                        final Rect windowRect = new Rect();
                        relativeLayout.getWindowVisibleDisplayFrame( windowRect );

                        final int windowWidth = windowRect.width();
                        final int windowHeight = windowRect.height();
                        final int longSide = Math.max( windowWidth, windowHeight );
                        final int shortSide = Math.min( windowWidth, windowHeight );
                        final int margin = ( longSide - shortSide ) / 2;
                        params.setMargins( -margin, 0, -margin, 0 );

                        // The view is now at the center of the screen and so is it's pivot point. Move its center such that when rotated, it snaps into the vertical position we need.
                        final int translationRaw = ( windowWidth / 2 ) - ( height / 2 );
                        final int translationX = containsLeft ? -translationRaw : translationRaw;
                        adView.setTranslationX( translationX );

                        // We have the view's center in the correct position. Now rotate it to snap into place.
                        adView.setRotation( 270 );

                        // Store the ad view with format, so that it can be updated when the orientation changes.
                        mVerticalAdViewFormats.put( adUnitId, adFormat );
                    }

                    // Hack alert: For the rotation and translation to be applied correctly, need to set the background color (Unity only, similar to what we do in Cross Promo).
                    relativeLayout.setBackgroundColor( Color.TRANSPARENT );
                }
            }
            else
            {
                params.width = width;

                if ( adViewPosition.contains( "Left" ) )
                {
                    gravity |= Gravity.LEFT;
                }
                else if ( adViewPosition.contains( "Right" ) )
                {
                    gravity |= Gravity.RIGHT;
                }
            }
        }

        relativeLayout.setGravity( gravity );
    }

    private static void forwardUnityEventWithArgs(final Map<String, String> args)
    {
        // Send message in bg thread to avoid ANRs
        sThreadPoolExecutor.execute( new Runnable()
        {
            @Override
            public void run()
            {
                final String serializedParameters = propsStrFromDictionary( args );
                UnityPlayer.UnitySendMessage( "MaxSdkCallbacks", "ForwardEvent", serializedParameters );
            }
        } );
    }

    private static String propsStrFromDictionary(Map<String, String> map)
    {
        final StringBuilder stringBuilder = new StringBuilder( 64 );
        for ( Map.Entry<String, String> entry : map.entrySet() )
        {
            stringBuilder.append( entry.getKey() );
            stringBuilder.append( "=" );
            stringBuilder.append( entry.getValue() );
            stringBuilder.append( "\n" );
        }

        return stringBuilder.toString();
    }

    private static Map<String, String> deserializeParameters(final String serialized)
    {
        if ( !TextUtils.isEmpty( serialized ) )
        {
            final String[] keyValuePairs = serialized.split( SERIALIZED_KEY_VALUE_PAIR_SEPARATOR ); // ["key-1<FS>value-1", "key-2<FS>value-2", "key-3<FS>value-3"]
            final Map<String, String> deserialized = new HashMap<>( keyValuePairs.length );

            for ( final String keyValuePair : keyValuePairs )
            {
                final String[] splitPair = keyValuePair.split( SERIALIZED_KEY_VALUE_SEPARATOR );
                if ( splitPair.length == 2 )
                {
                    String key = splitPair[0];
                    String value = splitPair[1];

                    // Store in deserialized map
                    deserialized.put( key, value );
                }
            }

            return deserialized;
        }
        else
        {
            return Collections.emptyMap();
        }
    }

    private MaxAdFormat getDeviceSpecificAdViewAdFormat()
    {
        return AppLovinSdkUtils.isTablet( getCurrentActivity() ) ? MaxAdFormat.LEADER : MaxAdFormat.BANNER;
    }

    private static AppLovinSdkSettings generateSdkSettings(final String serializedMetaData, final Context context)
    {
        final AppLovinSdkSettings settings = new AppLovinSdkSettings( context );
        final Map<String, String> unityMetaDataMap = deserializeParameters( serializedMetaData );

        if ( AppLovinSdk.VERSION_CODE >= 91201 )
        {
            // Set the meta data to settings.
            try
            {

                final Field metaDataField = AppLovinSdkSettings.class.getDeclaredField( "metaData" );
                metaDataField.setAccessible( true );
                final Map<String, String> metaDataMap = (Map<String, String>) metaDataField.get( settings );
                for ( final Map.Entry<String, String> metaDataEntry : unityMetaDataMap.entrySet() )
                {
                    metaDataMap.put( metaDataEntry.getKey(), metaDataEntry.getValue() );
                }
            }
            catch ( Exception ignored ) {}
        }

        return settings;
    }

    private static class AdViewSize
    {
        private final int mWidthDp;
        private final int mHeightDp;

        private AdViewSize(final int widthDp, final int heightDp)
        {
            mWidthDp = widthDp;
            mHeightDp = heightDp;
        }
    }

    private AdViewSize getAdViewSize(MaxAdFormat format)
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

    private Activity getCurrentActivity()
    {
        return BuildConfig.IS_TEST_APP ? currentActivity.get() : Utils.getCurrentActivity();
    }

    private static class SdkThreadFactory
            implements ThreadFactory
    {
        @Override
        public Thread newThread(Runnable r)
        {
            final Thread result = new Thread( r, "AppLovinSdk:Max-Unity-Plugin:shared" );
            result.setDaemon( true );
            result.setPriority( Thread.MAX_PRIORITY );
            result.setUncaughtExceptionHandler( new Thread.UncaughtExceptionHandler()
            {
                public void uncaughtException(Thread thread, Throwable th)
                {
                    Log.e( TAG, "Caught unhandled exception", th );
                }
            } );

            return result;
        }
    }
}
