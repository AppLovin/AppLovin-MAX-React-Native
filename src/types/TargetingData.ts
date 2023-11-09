import type { AdContentRating, UserGender } from "src/TargetingData";

/**
 * Defines additional data for the publisher to send to AppLovin.
 *
 * @see {@link https://support.applovin.com/hc/en-us/articles/13964925614733-Data-and-Keyword-Passing}
 */
export type TargetingDataType = {

    /**
     * Sets the year of birth of the user. Set this to 0 to clear this value.
     */
    yearOfBirth: number | Promise<number>;

    /**
     * Sets the gender of the user. Set this to {@link UserGender.Unknown} to clear this value.
     */
    gender: UserGender | Promise<UserGender>;

    /**
     * Sets the maximum ad content rating shown to the user. The levels are based on IQG Media
     * Ratings: 1=All Audiences, 2=Everyone Over 12, 3=Mature Audiences.
     * Set this to {@link AdContentRating.None} to clear this value.
     */
    maximumAdContentRating: AdContentRating | Promise<AdContentRating>;

    /**
     * Sets the email of the user. Set this to null to clear this value.
     */
    email: string | null | Promise<string | null>;

    /**
     * Sets the phone number of the user. Set this to null to clear this value.
     */
    phoneNumber: string | null | Promise<string | null>;

    /**
     * Sets the keywords describing the application. Set this to null to clear this value.
     */
    keywords: string[] | null | Promise<string[] | null>;

    /**
     * Sets the interests of the user. Set this to null to clear this value.
     */
    interests: string[] | null | Promise<string[] | null>;

    /**
     * Clears all saved data from this class.
     */
    clearAll(): void;
};
