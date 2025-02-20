package com.applovin.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

@ReactModule(name = AppLovinMAXModuleImpl.NAME)
public class AppLovinMAXModule
    extends NativeAppLovinMAXModuleSpec
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

    @Override
    public void isInitialized(final Promise promise)
    {
        impl.isInitialized( promise );
    }

    @Override
    public void initialize(final String pluginVersion, final String sdkKey, final Promise promise)
    {
        impl.initialize( pluginVersion, sdkKey, promise );
    }

    @Override
    public void isTablet(final Promise promise)
    {
        impl.isTablet( promise );
    }

    @Override
    public void showMediationDebugger()
    {
        impl.showMediationDebugger();
    }

    @Override
    public void setHasUserConsent(final boolean hasUserConsent)
    {
        impl.setHasUserConsent( hasUserConsent );
    }

    @Override
    public void hasUserConsent(final Promise promise)
    {
        impl.hasUserConsent( promise );
    }

    @Override
    public void setDoNotSell(final boolean doNotSell)
    {
        impl.setDoNotSell( doNotSell );
    }

    @Override
    public void isDoNotSell(final Promise promise)
    {
        impl.isDoNotSell( promise );
    }

    @Override
    public void setUserId(final String userId)
    {
        impl.setUserId( userId );
    }

    @Override
    public void setMuted(final boolean muted)
    {
        impl.setMuted( muted );
    }

    @Override
    public void isMuted(final Promise promise)
    {
        impl.isMuted( promise );
    }

    @Override
    public void setVerboseLogging(final boolean enabled)
    {
        impl.setVerboseLogging( enabled );
    }

    @Override
    public void setCreativeDebuggerEnabled(final boolean enabled)
    {
        impl.setCreativeDebuggerEnabled( enabled );
    }

    @Override
    public void setTestDeviceAdvertisingIds(final ReadableArray ids)
    {
        impl.setTestDeviceAdvertisingIds( ids );
    }

    @Override
    public void setExtraParameter(final String key, @Nullable final String value)
    {
        impl.setExtraParameter( key, value );
    }

    @Override
    public void setInitializationAdUnitIds(final ReadableArray adUnitIds)
    {
        impl.setInitializationAdUnitIds( adUnitIds );
    }

    @Override
    public void setTermsAndPrivacyPolicyFlowEnabled(final boolean enabled)
    {
        impl.setTermsAndPrivacyPolicyFlowEnabled( enabled );
    }

    @Override
    public void setPrivacyPolicyUrl(final String url)
    {
        impl.setPrivacyPolicyUrl( url );
    }

    @Override
    public void setTermsOfServiceUrl(final String url)
    {
        impl.setTermsOfServiceUrl( url );
    }

    @Override
    public void setConsentFlowDebugUserGeography(final String userGeography)
    {
        impl.setConsentFlowDebugUserGeography( userGeography );
    }

    @Override
    public void showCmpForExistingUser(final Promise promise)
    {
        impl.showCmpForExistingUser( promise );
    }

    @Override
    public void hasSupportedCmp(final Promise promise)
    {
        impl.hasSupportedCmp( promise );
    }

    @Override
    public void addSegment(final double key, final ReadableArray values, final Promise promise)
    {
        impl.addSegment( (int) Math.round( key ), values, promise );
    }

    @Override
    public void getSegments(final Promise promise)
    {
        impl.getSegments( promise );
    }

    @Override
    public void createBanner(final String adUnitId, final String position)
    {
        impl.createBanner( adUnitId, position );
    }

    @Override
    public void createBannerWithOffsets(final String adUnitId, final String position, final double xOffset, final double yOffset)
    {
        impl.createBannerWithOffsets( adUnitId, position, (float) xOffset, (float) yOffset );
    }

    @Override
    public void setBannerBackgroundColor(final String adUnitId, final String hexColorCode)
    {
        impl.setBannerBackgroundColor( adUnitId, hexColorCode );
    }

    @Override
    public void setBannerPlacement(final String adUnitId, @Nullable final String placement)
    {
        impl.setBannerPlacement( adUnitId, placement );
    }

    @Override
    public void setBannerCustomData(final String adUnitId, @Nullable final String customData)
    {
        impl.setBannerCustomData( adUnitId, customData );
    }

    @Override
    public void setBannerWidth(final String adUnitId, final double width)
    {
        impl.setBannerWidth( adUnitId, (int) Math.round( width ) );
    }

    @Override
    public void updateBannerPosition(final String adUnitId, final String position)
    {
        impl.updateBannerPosition( adUnitId, position );
    }

    @Override
    public void updateBannerOffsets(final String adUnitId, final double xOffset, final double yOffset)
    {
        impl.updateBannerOffsets( adUnitId, (float) xOffset, (float) yOffset );
    }

    @Override
    public void setBannerExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setBannerExtraParameter( adUnitId, key, value );
    }

    @Override
    public void setBannerLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setBannerLocalExtraParameter( adUnitId, parameter );
    }

    @Override
    public void startBannerAutoRefresh(final String adUnitId)
    {
        impl.startBannerAutoRefresh( adUnitId );
    }

    @Override
    public void stopBannerAutoRefresh(final String adUnitId)
    {
        impl.stopBannerAutoRefresh( adUnitId );
    }

    @Override
    public void showBanner(final String adUnitId)
    {
        impl.showBanner( adUnitId );
    }

    @Override
    public void hideBanner(final String adUnitId)
    {
        impl.hideBanner( adUnitId );
    }

    @Override
    public void destroyBanner(final String adUnitId)
    {
        impl.destroyBanner( adUnitId );
    }

    @Override
    public void getAdaptiveBannerHeightForWidth(final double width, final Promise promise)
    {
        impl.getAdaptiveBannerHeightForWidth( (float) width, promise );
    }

    @Override
    public void createMRec(final String adUnitId, final String position)
    {
        impl.createMRec( adUnitId, position );
    }

    @Override
    public void setMRecPlacement(final String adUnitId, @Nullable final String placement)
    {
        impl.setMRecPlacement( adUnitId, placement );
    }

    @Override
    public void setMRecCustomData(final String adUnitId, @Nullable final String customData)
    {
        impl.setMRecCustomData( adUnitId, customData );
    }

    @Override
    public void updateMRecPosition(final String adUnitId, final String position)
    {
        impl.updateMRecPosition( adUnitId, position );
    }

    @Override
    public void setMRecExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setMRecExtraParameter( adUnitId, key, value );
    }

    @Override
    public void setMRecLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setMRecLocalExtraParameter( adUnitId, parameter );
    }

    @Override
    public void startMRecAutoRefresh(final String adUnitId)
    {
        impl.startMRecAutoRefresh( adUnitId );
    }

    @Override
    public void stopMRecAutoRefresh(final String adUnitId)
    {
        impl.stopMRecAutoRefresh( adUnitId );
    }

    @Override
    public void showMRec(final String adUnitId)
    {
        impl.showMRec( adUnitId );
    }

    @Override
    public void hideMRec(final String adUnitId)
    {
        impl.hideMRec( adUnitId );
    }

    @Override
    public void destroyMRec(final String adUnitId)
    {
        impl.destroyMRec( adUnitId );
    }

    @Override
    public void loadInterstitial(final String adUnitId)
    {
        impl.loadInterstitial( adUnitId );
    }

    @Override
    public void isInterstitialReady(final String adUnitId, final Promise promise)
    {
        impl.isInterstitialReady( adUnitId, promise );
    }

    @Override
    public void showInterstitial(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        impl.showInterstitial( adUnitId, placement, customData );
    }

    @Override
    public void setInterstitialExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setInterstitialExtraParameter( adUnitId, key, value );
    }

    @Override
    public void setInterstitialLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setInterstitialLocalExtraParameter( adUnitId, parameter );
    }

    @Override
    public void loadRewardedAd(final String adUnitId)
    {
        impl.loadRewardedAd( adUnitId );
    }

    @Override
    public void isRewardedAdReady(final String adUnitId, final Promise promise)
    {
        impl.isRewardedAdReady( adUnitId, promise );
    }

    @Override
    public void showRewardedAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        impl.showRewardedAd( adUnitId, placement, customData );
    }

    @Override
    public void setRewardedAdExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setRewardedAdExtraParameter( adUnitId, key, value );
    }

    @Override
    public void setRewardedAdLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setRewardedAdLocalExtraParameter( adUnitId, parameter );
    }

    @Override
    public void loadAppOpenAd(final String adUnitId)
    {
        impl.loadAppOpenAd( adUnitId );
    }

    @Override
    public void isAppOpenAdReady(final String adUnitId, final Promise promise)
    {
        impl.isAppOpenAdReady( adUnitId, promise );
    }

    @Override
    public void showAppOpenAd(final String adUnitId, @Nullable final String placement, @Nullable final String customData)
    {
        impl.showAppOpenAd( adUnitId, placement, customData );
    }

    @Override
    public void setAppOpenAdExtraParameter(final String adUnitId, final String key, @Nullable final String value)
    {
        impl.setAppOpenAdExtraParameter( adUnitId, key, value );
    }

    @Override
    public void setAppOpenAdLocalExtraParameter(final String adUnitId, final ReadableMap parameter)
    {
        impl.setAppOpenAdLocalExtraParameter( adUnitId, parameter );
    }

    @Override
    public void preloadNativeUIComponentAdView(final String adUnitId, final String adFormat, @Nullable final String placement, @Nullable final String customData, @Nullable final ReadableMap extraParameters, @Nullable final ReadableMap localExtraParameters, final Promise promise)
    {
        impl.preloadNativeUIComponentAdView( adUnitId, adFormat, placement, customData, extraParameters, localExtraParameters, promise );
    }

    @Override
    public void destroyNativeUIComponentAdView(final double adViewId, final Promise promise)
    {
        impl.destroyNativeUIComponentAdView( (int) Math.round( adViewId ), promise );
    }

    @Override
    public void addListener(String eventName) { }

    @Override
    public void removeListeners(double count) { }

    @Nullable
    @Override
    public Map<String, Object> getTypedExportedConstants()
    {
        return impl.getConstants();
    }
}
