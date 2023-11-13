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
     * Enables the MAX Terms Flow.
     *
     * @param enabled true to enable the MAX Terms Flow.
     */
    setConsentFlowEnabled(enabled: boolean): Promise<void>;

    /**
     * The URL of your company’s privacy policy, as a string. This is required in order to enable
     * the Terms Flow.
     * 
     * @param urlString The URL string to point your company’s privacy policy.
     */
    setPrivacyPolicyUrl(urlString: string): Promise<void>;

    /**
     * The URL of your company’s terms of service, as a string. This is optional; you can enable 
     * the Terms Flow with or without it.
     * 
     * @param urlString The URL string to point your company’s terms of service. 
     */
    setTermsOfServiceUrl(urlString: string): Promise<void>;
};
