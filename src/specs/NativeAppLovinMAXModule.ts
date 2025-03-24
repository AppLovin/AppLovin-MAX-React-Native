import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';
import type { Configuration } from '../types';
import type { CMPError } from '../types';
import type { AdViewId } from '../types';

/**
 * Native TurboModule interface for AppLovin MAX.
 * Defines all methods and constants exposed to JavaScript.
 */
export interface Spec extends TurboModule {
    /**
     * Returns all supported event constants and SDK error codes.
     */
    readonly getConstants: () => {
        // Interstitial ad events
        ON_INTERSTITIAL_LOADED_EVENT: string;
        ON_INTERSTITIAL_LOAD_FAILED_EVENT: string;
        ON_INTERSTITIAL_CLICKED_EVENT: string;
        ON_INTERSTITIAL_DISPLAYED_EVENT: string;
        ON_INTERSTITIAL_AD_FAILED_TO_DISPLAY_EVENT: string;
        ON_INTERSTITIAL_HIDDEN_EVENT: string;
        ON_INTERSTITIAL_AD_REVENUE_PAID: string;

        // Rewarded ad events
        ON_REWARDED_AD_LOADED_EVENT: string;
        ON_REWARDED_AD_LOAD_FAILED_EVENT: string;
        ON_REWARDED_AD_CLICKED_EVENT: string;
        ON_REWARDED_AD_DISPLAYED_EVENT: string;
        ON_REWARDED_AD_FAILED_TO_DISPLAY_EVENT: string;
        ON_REWARDED_AD_HIDDEN_EVENT: string;
        ON_REWARDED_AD_RECEIVED_REWARD_EVENT: string;
        ON_REWARDED_AD_REVENUE_PAID: string;

        // Banner ad events
        ON_BANNER_AD_LOADED_EVENT: string;
        ON_BANNER_AD_LOAD_FAILED_EVENT: string;
        ON_BANNER_AD_CLICKED_EVENT: string;
        ON_BANNER_AD_COLLAPSED_EVENT: string;
        ON_BANNER_AD_EXPANDED_EVENT: string;
        ON_BANNER_AD_REVENUE_PAID: string;

        // MREC ad events
        ON_MREC_AD_LOADED_EVENT: string;
        ON_MREC_AD_LOAD_FAILED_EVENT: string;
        ON_MREC_AD_CLICKED_EVENT: string;
        ON_MREC_AD_COLLAPSED_EVENT: string;
        ON_MREC_AD_EXPANDED_EVENT: string;
        ON_MREC_AD_REVENUE_PAID: string;

        // App Open ad events
        ON_APPOPEN_AD_LOADED_EVENT: string;
        ON_APPOPEN_AD_LOAD_FAILED_EVENT: string;
        ON_APPOPEN_AD_CLICKED_EVENT: string;
        ON_APPOPEN_AD_DISPLAYED_EVENT: string;
        ON_APPOPEN_AD_FAILED_TO_DISPLAY_EVENT: string;
        ON_APPOPEN_AD_HIDDEN_EVENT: string;
        ON_APPOPEN_AD_REVENUE_PAID: string;

        // Native UI component ad events
        ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOADED_EVENT: string;
        ON_NATIVE_UI_COMPONENT_ADVIEW_AD_LOAD_FAILED_EVENT: string;

        // Error codes
        MAX_ERROR_CODE_UNSPECIFIED: number;
        MAX_ERROR_CODE_NO_FILL: number;
        MAX_ERROR_CODE_AD_LOAD_FAILED: number;
        MAX_ERROR_CODE_AD_DISPLAY_FAILED: number;
        MAX_ERROR_CODE_NETWORK_ERROR: number;
        MAX_ERROR_CODE_NETWORK_TIMEOUT: number;
        MAX_ERROR_CODE_NO_NETWORK: number;
        MAX_ERROR_CODE_FULLSCREEN_AD_ALREADY_SHOWING: number;
        MAX_ERROR_CODE_FULLSCREEN_AD_NOT_READY: number;
        MAX_ERROR_CODE_FULLSCREEN_AD_INVALID_VIEW_CONTROLLER: number;
        MAX_ERROR_CODE_DONT_KEEP_ACTIVITIES_ENABLED: number;
        MAX_ERROR_CODE_INVALID_AD_UNIT_ID: number;
    };

    // ─────────────────────────────────────────────────────────
    // SDK Initialization & Configuration
    // ─────────────────────────────────────────────────────────

    isInitialized(): Promise<boolean>;
    initialize(pluginVersion: string, sdkKey: string): Promise<Configuration>;
    isTablet(): Promise<boolean>;
    showMediationDebugger(): void;

    // ─────────────────────────────────────────────────────────
    // Privacy & Consent APIs
    // ─────────────────────────────────────────────────────────

    setHasUserConsent(hasUserConsent: boolean): void;
    hasUserConsent(): Promise<boolean>;

    setDoNotSell(doNotSell: boolean): void;
    isDoNotSell(): Promise<boolean>;

    // ─────────────────────────────────────────────────────────
    // User & Debug Settings
    // ─────────────────────────────────────────────────────────

    setUserId(userId: string): void;
    setMuted(muted: boolean): void;
    isMuted(): Promise<boolean>;
    setVerboseLogging(enabled: boolean): void;
    setCreativeDebuggerEnabled(enabled: boolean): void;
    setTestDeviceAdvertisingIds(ids: string[]): void;

    // ─────────────────────────────────────────────────────────
    // Extra Parameters
    // ─────────────────────────────────────────────────────────

    setExtraParameter(key: string, value: string | null): void;
    setInitializationAdUnitIds(adUnitIds: string[]): void;

    // ─────────────────────────────────────────────────────────
    // CMP (Consent Flow)
    // ─────────────────────────────────────────────────────────

    setTermsAndPrivacyPolicyFlowEnabled(enabled: boolean): void;
    setPrivacyPolicyUrl(url: string): void;
    setTermsOfServiceUrl(url: string): void;
    setConsentFlowDebugUserGeography(userGeography: string): void;
    showCmpForExistingUser(): Promise<CMPError | null>;
    hasSupportedCmp(): Promise<boolean>;

    // ─────────────────────────────────────────────────────────
    // Segments
    // ─────────────────────────────────────────────────────────

    addSegment(key: number, values: number[]): Promise<void>;
    getSegments(): Promise<{ [key: string]: number[] } | null>;

    // ─────────────────────────────────────────────────────────
    // Banner Ads
    // ─────────────────────────────────────────────────────────

    createBanner(adUnitId: string, position: string): void;
    createBannerWithOffsets(adUnitId: string, position: string, xOffset: number, yOffset: number): void;
    setBannerBackgroundColor(adUnitId: string, hexColorCode: string): void;
    setBannerPlacement(adUnitId: string, placement: string | null): void;
    setBannerCustomData(adUnitId: string, customData: string | null): void;
    setBannerWidth(adUnitId: string, width: number): void;
    updateBannerPosition(adUnitId: string, position: string): void;
    updateBannerOffsets(adUnitId: string, xOffset: number, yOffset: number): void;
    setBannerExtraParameter(adUnitId: string, key: string, value: string | null): void;
    setBannerLocalExtraParameter(adUnitId: string, parameters: UnsafeObject): void;
    startBannerAutoRefresh(adUnitId: string): void;
    stopBannerAutoRefresh(adUnitId: string): void;
    showBanner(adUnitId: string): void;
    hideBanner(adUnitId: string): void;
    destroyBanner(adUnitId: string): void;
    getAdaptiveBannerHeightForWidth(width: number): Promise<number>;

    // ─────────────────────────────────────────────────────────
    // MREC Ads
    // ─────────────────────────────────────────────────────────

    createMRec(adUnitId: string, position: string): void;
    setMRecPlacement(adUnitId: string, placement: string | null): void;
    setMRecCustomData(adUnitId: string, customData: string | null): void;
    updateMRecPosition(adUnitId: string, position: string): void;
    setMRecExtraParameter(adUnitId: string, key: string, value: string | null): void;
    setMRecLocalExtraParameter(adUnitId: string, parameters: UnsafeObject): void;
    startMRecAutoRefresh(adUnitId: string): void;
    stopMRecAutoRefresh(adUnitId: string): void;
    showMRec(adUnitId: string): void;
    hideMRec(adUnitId: string): void;
    destroyMRec(adUnitId: string): void;

    // ─────────────────────────────────────────────────────────
    // Interstitial Ads
    // ─────────────────────────────────────────────────────────

    loadInterstitial(adUnitId: string): void;
    isInterstitialReady(adUnitId: string): Promise<boolean>;
    showInterstitial(adUnitId: string, placement?: string | null, customData?: string | null): void;
    setInterstitialExtraParameter(adUnitId: string, key: string, value: string | null): void;
    setInterstitialLocalExtraParameter(adUnitId: string, parameters: UnsafeObject): void;

    // ─────────────────────────────────────────────────────────
    // Rewarded Ads
    // ─────────────────────────────────────────────────────────

    loadRewardedAd(adUnitId: string): void;
    isRewardedAdReady(adUnitId: string): Promise<boolean>;
    showRewardedAd(adUnitId: string, placement?: string | null, customData?: string | null): void;
    setRewardedAdExtraParameter(adUnitId: string, key: string, value: string | null): void;
    setRewardedAdLocalExtraParameter(adUnitId: string, parameters: UnsafeObject): void;

    // ─────────────────────────────────────────────────────────
    // App Open Ads
    // ─────────────────────────────────────────────────────────

    loadAppOpenAd(adUnitId: string): void;
    isAppOpenAdReady(adUnitId: string): Promise<boolean>;
    showAppOpenAd(adUnitId: string, placement?: string | null, customData?: string | null): void;
    setAppOpenAdExtraParameter(adUnitId: string, key: string, value: string | null): void;
    setAppOpenAdLocalExtraParameter(adUnitId: string, parameters: UnsafeObject): void;

    // ─────────────────────────────────────────────────────────
    // Native UI Component AdView (Preload/Destroy)
    // ─────────────────────────────────────────────────────────

    preloadNativeUIComponentAdView(
        adUnitId: string,
        adFormat: string,
        placement?: string | null,
        customData?: string | null,
        extraParameters?: UnsafeObject | null,
        localExtraParameters?: UnsafeObject | null
    ): Promise<AdViewId>;

    destroyNativeUIComponentAdView(adViewId: number): Promise<void>;

    // ─────────────────────────────────────────────────────────
    // TurboModule Listener Management
    // ─────────────────────────────────────────────────────────

    addListener(eventType: string): void;
    removeListeners(count: number): void;
}

/**
 * Enforces use of the native AppLovinMAX TurboModule.
 */
export default TurboModuleRegistry.getEnforcing<Spec>('AppLovinMAX');
