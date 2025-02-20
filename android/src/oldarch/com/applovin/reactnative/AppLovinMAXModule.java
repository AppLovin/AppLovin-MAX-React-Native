package com.applovin.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class AppLovinMAXModule
    extends ReactContextBaseJavaModule
{
    final private AppLovinMAXModuleImpl impl;

    public AppLovinMAXModule(ReactApplicationContext context)
    {
        super( context );
        impl = new AppLovinMAXModuleImpl( context );
    }

    @Override
    @NonNull
    public String getName()
    {
        return AppLovinMAXModuleImpl.NAME;
    }

    @ReactMethod
    public void isInitialized(final Promise promise)
    {
        impl.isInitialized( promise );
    }

    @ReactMethod
    public void initialize(final String pluginVersion, final String sdkKey, final Promise promise)
    {
        impl.initialize( pluginVersion, sdkKey, promise );
    }

    @ReactMethod
    public void isTablet(final Promise promise)
    {
        impl.isTablet( promise );
    }

    @ReactMethod
    public void showMediationDebugger()
    {
        impl.showMediationDebugger();
    }

    @ReactMethod
    public void setHasUserConsent(final boolean hasUserConsent)
    {
        impl.setHasUserConsent( hasUserConsent );
    }

    @ReactMethod
    public void hasUserConsent(final Promise promise)
    {
        impl.hasUserConsent( promise );
    }

    @ReactMethod
    public void setDoNotSell(final boolean doNotSell)
    {
        impl.setDoNotSell( doNotSell );
    }

    @ReactMethod
    public void isDoNotSell(final Promise promise)
    {
        impl.isDoNotSell( promise );
    }

    @ReactMethod
    public void setUserId(final String userId)
    {
        impl.setUserId( userId );
    }

    @ReactMethod
    public void setMuted(final boolean muted)
    {
        impl.setMuted( muted );
    }

    @ReactMethod
    public void isMuted(final Promise promise)
    {
        impl.isMuted( promise );
    }

    @ReactMethod
    public void setVerboseLogging(final boolean enabled)
    {
        impl.setVerboseLogging( enabled );
    }

    @ReactMethod
    public void setCreativeDebuggerEnabled(final boolean enabled)
    {
        impl.setCreativeDebuggerEnabled( enabled );
    }

    @ReactMethod
    public void setTestDeviceAdvertisingIds(final ReadableArray ids)
    {
        impl.setTestDeviceAdvertisingIds( ids );
    }

    @ReactMethod
    public void setExtraParameter(final String key, @Nullable final String value)
    {
        impl.setExtraParameter( key, value );
    }

    @ReactMethod
    public void setInitializationAdUnitIds(final ReadableArray adUnitIds)
    {
        impl.setInitializationAdUnitIds( adUnitIds );
    }

    @ReactMethod
    public void setTermsAndPrivacyPolicyFlowEnabled(final boolean enabled)
    {
        impl.setTermsAndPrivacyPolicyFlowEnabled( enabled );
    }

    @ReactMethod
    public void setPrivacyPolicyUrl(final String url)
    {
        impl.setPrivacyPolicyUrl( url );
    }

    @ReactMethod
    public void setTermsOfServiceUrl(final String url)
    {
        impl.setTermsOfServiceUrl( url );
    }

    @ReactMethod
    public void setConsentFlowDebugUserGeography(final String userGeography)
    {
        impl.setConsentFlowDebugUserGeography( userGeography );
    }

    @ReactMethod
    public void showCmpForExistingUser(final Promise promise)
    {
        impl.showCmpForExistingUser( promise );
    }

    @ReactMethod
    public void hasSupportedCmp(final Promise promise)
    {
        impl.hasSupportedCmp( promise );
    }

    @ReactMethod
    public void addSegment(final double key, final ReadableArray values, final Promise promise)
    {
        impl.addSegment( (int) Math.round( key ), values, promise );
    }

    @ReactMethod
    public void getSegments(final Promise promise)
    {
        impl.getSegments( promise );
    }

    @ReactMethod
    public void createBanner(final String adUnitId, final String position)
    {
        impl.createBanner( adUnitId, position );
    }

    @ReactMethod
    public void createBannerWithOffsets(final String adUnitId, final String position, final double xOffset, final double yOffset)
    {
        impl.createBannerWithOffsets( adUnitId, position, (float) xOffset, (float) yOffset );
    }

    @ReactMethod
    public void setBannerBackgroundColor(final String adUnitId, final String hexColorCode)
    {
        impl.setBannerBackgroundColor( adUnitId, hexColorCode );
    }

    @ReactMethod
    public void setBannerPlacement(final String adUnitId, @Nullable final String placement)
    {
        impl.setBannerPlacement( adUnitId, placement );
    }

    @ReactMethod
    public void setBannerCustomData(final String adUnitId, @Nullable final String customData)
    {
        impl.setBannerCustomData( adUnitId, customData );
    }

    @ReactMethod
    public void setBannerWidth(final String adUnitId, final double width)
    {
        impl.setBannerWidth( adUnitId, (int) Math.round( width ) );
    }

    @ReactMethod
    public void updateBannerPosition(final String adUnitId, final String position)
    {
        impl.updateBannerPosition( adUnitId, position );
    }

    @ReactMethod
    public void updateBannerOffsets(final String adUnitId, final double xOffset, final double yOffset)
    {
        impl.updateBannerOffsets( adUnitId, (float) xOffset, (float) yOffset );
    }

    @ReactMethod
    public void setBannerExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setBannerExtraParameter( adUnitId, key, value );
    }

    @ReactMethod
    public void setBannerLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setBannerLocalExtraParameter( adUnitId, parameter );
    }

    @ReactMethod
    public void startBannerAutoRefresh(final String adUnitId)
    {
        impl.startBannerAutoRefresh( adUnitId );
    }

    @ReactMethod
    public void stopBannerAutoRefresh(final String adUnitId)
    {
        impl.stopBannerAutoRefresh( adUnitId );
    }

    @ReactMethod
    public void showBanner(final String adUnitId)
    {
        impl.showBanner( adUnitId );
    }

    @ReactMethod
    public void hideBanner(final String adUnitId)
    {
        impl.hideBanner( adUnitId );
    }

    @ReactMethod
    public void destroyBanner(final String adUnitId)
    {
        impl.destroyBanner( adUnitId );
    }

    @ReactMethod
    public void getAdaptiveBannerHeightForWidth(final double width, final Promise promise)
    {
        impl.getAdaptiveBannerHeightForWidth( (float) width, promise );
    }

    @ReactMethod
    public void createMRec(final String adUnitId, final String position)
    {
        impl.createMRec( adUnitId, position );
    }

    @ReactMethod
    public void setMRecPlacement(final String adUnitId, @Nullable final String placement)
    {
        impl.setMRecPlacement( adUnitId, placement );
    }

    @ReactMethod
    public void setMRecCustomData(final String adUnitId, @Nullable final String customData)
    {
        impl.setMRecCustomData( adUnitId, customData );
    }

    @ReactMethod
    public void updateMRecPosition(final String adUnitId, final String position)
    {
        impl.updateMRecPosition( adUnitId, position );
    }

    @ReactMethod
    public void setMRecExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setMRecExtraParameter( adUnitId, key, value );
    }

    @ReactMethod
    public void setMRecLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setMRecLocalExtraParameter( adUnitId, parameter );
    }

    @ReactMethod
    public void startMRecAutoRefresh(final String adUnitId)
    {
        impl.startMRecAutoRefresh( adUnitId );
    }

    @ReactMethod
    public void stopMRecAutoRefresh(final String adUnitId)
    {
        impl.stopMRecAutoRefresh( adUnitId );
    }

    @ReactMethod
    public void showMRec(final String adUnitId)
    {
        impl.showMRec( adUnitId );
    }

    @ReactMethod
    public void hideMRec(final String adUnitId)
    {
        impl.hideMRec( adUnitId );
    }

    @ReactMethod
    public void destroyMRec(final String adUnitId)
    {
        impl.destroyMRec( adUnitId );
    }

    @ReactMethod
    public void loadInterstitial(final String adUnitId)
    {
        impl.loadInterstitial( adUnitId );
    }

    @ReactMethod
    public void isInterstitialReady(final String adUnitId, final Promise promise)
    {
        impl.isInterstitialReady( adUnitId, promise );
    }

    @ReactMethod
    public void showInterstitial(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        impl.showInterstitial( adUnitId, placement, customData );
    }

    @ReactMethod
    public void setInterstitialExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setInterstitialExtraParameter( adUnitId, key, value );
    }

    @ReactMethod
    public void setInterstitialLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setInterstitialLocalExtraParameter( adUnitId, parameter );
    }

    @ReactMethod
    public void loadRewardedAd(final String adUnitId)
    {
        impl.loadRewardedAd( adUnitId );
    }

    @ReactMethod
    public void isRewardedAdReady(final String adUnitId, final Promise promise)
    {
        impl.isRewardedAdReady( adUnitId, promise );
    }

    @ReactMethod
    public void showRewardedAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        impl.showRewardedAd( adUnitId, placement, customData );
    }

    @ReactMethod
    public void setRewardedAdExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setRewardedAdExtraParameter( adUnitId, key, value );
    }

    @ReactMethod
    public void setRewardedAdLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setRewardedAdLocalExtraParameter( adUnitId, parameter );
    }

    @ReactMethod
    public void loadAppOpenAd(final String adUnitId)
    {
        impl.loadAppOpenAd( adUnitId );
    }

    @ReactMethod
    public void isAppOpenAdReady(final String adUnitId, final Promise promise)
    {
        impl.isAppOpenAdReady( adUnitId, promise );
    }

    @ReactMethod
    public void showAppOpenAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        impl.showAppOpenAd( adUnitId, placement, customData );
    }

    @ReactMethod
    public void setAppOpenAdExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setAppOpenAdExtraParameter( adUnitId, key, value );
    }

    @ReactMethod
    public void setAppOpenAdLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setAppOpenAdLocalExtraParameter( adUnitId, parameter );
    }

    @ReactMethod
    public void preloadNativeUIComponentAdView(final String adUnitId, final String adFormat, @Nullable final String placement, @Nullable final String customData, @Nullable final ReadableMap extraParameters, @Nullable final ReadableMap localExtraParameters, final Promise promise)
    {
        impl.preloadNativeUIComponentAdView( adUnitId, adFormat, placement, customData, extraParameters, localExtraParameters, promise );
    }

    @ReactMethod
    public void destroyNativeUIComponentAdView(final double adViewId, final Promise promise)
    {
        impl.destroyNativeUIComponentAdView( (int) Math.round( adViewId ), promise );
    }

    @ReactMethod
    public void addListener(String eventName) { }

    @ReactMethod
    public void removeListeners(Integer count) { }

    @Nullable
    @Override
    public Map<String, Object> getConstants()
    {
        return impl.getConstants();
    }
}
