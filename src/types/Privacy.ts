/**
 * Provides methods to manage user privacy settings for AppLovin MAX.
 */
export type PrivacyType = {
    /**
     * Sets whether the user has granted consent for data collection and sharing.
     *
     * @param hasUserConsent - `true` if the user has provided consent.
     */
    setHasUserConsent(hasUserConsent: boolean): void;

    /**
     * Checks whether the user has granted consent for information sharing.
     *
     * @returns A promise that resolves to `true` if the user has granted consent.
     */
    hasUserConsent(): Promise<boolean>;

    /**
     * Sets whether the user has opted out of the sale of their personal information.
     *
     * @param doNotSell - `true` if the user opted out of personal data sale.
     */
    setDoNotSell(doNotSell: boolean): void;

    /**
     * Checks whether the user has opted out of the sale of their personal information.
     *
     * @returns A promise that resolves to `true` if the user has opted out.
     */
    isDoNotSell(): Promise<boolean>;
};
