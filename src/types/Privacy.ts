export type PrivacyType = {

    /**********************************************************************************/
    /* Privacy */
    /**********************************************************************************/

    /**
     * Show the user consent dialog to the user using one from AppLovin's SDK.
     */
    showConsentDialog(): Promise<void>;

    /**
     * Sets whether or not the user has provided consent for information-sharing with AppLovin.
     * 
     * @param hasUserConsent true if the user has provided consent for information sharing.
     */
    setHasUserConsent(hasUserConsent: boolean): void;

    /**
     * Checks if user has set consent for information sharing.
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
     * Sets whether or not the user has opted out of the sale of their personal information.
     * 
     * @param doNotSell true if the user has opted out of the sale of their personal information.
     */
    setDoNotSell(doNotSell: boolean): void;

    /**
     * Checks if the user has opted out of the sale of their personal information.
     */
    isDoNotSell(): Promise<boolean>;

    /**********************************************************************************/
    /* TERM FLow */
    /**********************************************************************************/

    /**
     * Enable the MAX Terms Flow.
     *
     * @param enabled Enable the MAX Terms Flow.
     */
    setConsentFlowEnabled(enabled: boolean): Promise<void>;

    /**
     * URL for your company’s privacy policy. This is required in order to enable the Terms Flow.
     * 
     * @param urlString The URL string to point your company’s privacy policy.
     */
    setPrivacyPolicyUrl(urlString: string): Promise<void>;

    /**
     * URL for your company’s terms of service. This is optional; you can enable the Terms Flow with
     * or without it.
     * 
     * @param urlString The URL string to point your company’s terms of service. 
     */
    setTermsOfServiceUrl(urlString: string): Promise<void>;
};
