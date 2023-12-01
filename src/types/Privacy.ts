import type { ConsentFlowUserGeography } from '../Privacy';

export type PrivacyType = {
    /**********************************************************************************/
    /* Privacy */
    /**********************************************************************************/

    /**
     * Sets whether or not the user provided consent for information-sharing with AppLovin.
     *
     * @param hasUserConsent true if the user provided consent for information sharing.
     */
    setHasUserConsent(hasUserConsent: boolean): void;

    /**
     * Checks if user set consent for information sharing.
     */
    hasUserConsent(): Promise<boolean>;

    /**
     * Marks the user as age-restricted (i.e. under 16).
     *
     * @param isAgeRestrictedUser true if the user is age restricted (i.e. under 16).
     */
    setIsAgeRestrictedUser(isAgeRestrictedUser: boolean): void;

    /**
     * Checks if the user is age-restricted.
     */
    isAgeRestrictedUser(): Promise<boolean>;

    /**
     * Sets whether or not the user opted out of the sale of their personal information.
     *
     * @param doNotSell true if the user opted out of the sale of their personal information.
     */
    setDoNotSell(doNotSell: boolean): void;

    /**
     * Checks if the user opted out of the sale of their personal information.
     */
    isDoNotSell(): Promise<boolean>;

    /**********************************************************************************/
    /* TERM FLow */
    /**********************************************************************************/

    /**
     * @deprecated Use {@link setTermsAndPrivacyPolicyFlowEnabled()} instead.
     *
     * Enables the MAX Terms Flow.
     *
     * @param enabled true to enable the MAX Terms Flow.
     */
    setConsentFlowEnabled(enabled: boolean): void;

    /**
     * Enables the MAX Terms and Privacy Policy Flow.
     *
     * @param enabled true to enable the MAX Terms and Privacy Policy Flow.
     */
    setTermsAndPrivacyPolicyFlowEnabled(enabled: boolean): void;

    /**
     * The URL of your company’s privacy policy, as a string. This is required in order to enable
     * the Terms Flow.
     *
     * @param urlString The URL string to point your company’s privacy policy.
     */
    setPrivacyPolicyUrl(urlString: string): void;

    /**
     * The URL of your company’s terms of service, as a string. This is optional; you can enable
     * the Terms Flow with or without it.
     *
     * @param urlString The URL string to point your company’s terms of service.
     */
    setTermsOfServiceUrl(urlString: string): void;

    /**
     * Set debug user geography. You may use this to test CMP flow by setting this to {@link ConsentFlowUserGeography.GDPR}.
     *
     * @note The debug geography is used only when the app is in debug mode.
     */
    setConsentFlowDebugUserGeography(userGeography: ConsentFlowUserGeography): void;
};
