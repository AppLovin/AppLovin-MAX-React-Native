export type PrivacyType = {
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
     * Sets whether or not the user opted out of the sale of their personal information.
     *
     * @param doNotSell true if the user opted out of the sale of their personal information.
     */
    setDoNotSell(doNotSell: boolean): void;

    /**
     * Checks if the user opted out of the sale of their personal information.
     */
    isDoNotSell(): Promise<boolean>;
};
