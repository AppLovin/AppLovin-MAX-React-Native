import { NativeModules } from "react-native";
import type { TargetingDataType } from "./types/TargetingData";

const { AppLovinMAX } = NativeModules;

type NativeTargetingDataType = {
    setTargetingDataYearOfBirth(value: number): void;
    getTargetingDataYearOfBirth(): Promise<number>;
    setTargetingDataGender(value: string): void;
    getTargetingDataGender(): Promise<string>;
    setTargetingDataMaximumAdContentRating(value: number): void;
    getTargetingDataMaximumAdContentRating(): Promise<number>;
    setTargetingDataEmail(value: string | null): void;
    getTargetingDataEmail(): Promise<string | null>;
    setTargetingDataPhoneNumber(value: string | null): void;
    getTargetingDataPhoneNumber(): Promise<string | null>;
    setTargetingDataKeywords(value: string[] | null): void;
    getTargetingDataKeywords(): Promise<string[] | null>;
    setTargetingDataInterests(value: string[] | null): void;
    getTargetingDataInterests(): Promise<string[] | null>;
    clearAllTargetingData(): void;
};

const nativeMethods: NativeTargetingDataType = AppLovinMAX;

/**
 * This enumeration represents content ratings for the ads shown to users.
 */
export enum AdContentRating {
    None = 0,
    AllAudiences = 1,
    EveryoneOverTwelve = 2,
    MatureAudiences = 3,
}

/**
 * This enumeration represents gender.
 */
export enum UserGender {
    Unknown = 'U',
    Female = 'F',
    Male = 'M',
    Other = 'O',
}

/**
 * Defines additional data for the publisher to send to AppLovin.
 *
 * @see {@link https://support.applovin.com/hc/en-us/articles/13964925614733-Data-and-Keyword-Passing}
 */
export const TargetingData: TargetingDataType = {

    /**
     *  Sets the year of birth of the user. Set this to 0 to clear this value.
     */
    set yearOfBirth(value: number | Promise<number>) {
        if (typeof value === 'number') {
            nativeMethods.setTargetingDataYearOfBirth(value);
        }
    },

    /**
     *  Gets the year of birth of the user.
     */
    get yearOfBirth(): number | Promise<number> {
        return nativeMethods.getTargetingDataYearOfBirth();
    },

    /**
     * Sets the gender of the user. Set this to {@link UserGender.Unknown} to clear this value.
     */
    set gender(value: UserGender | Promise<UserGender>) {
        if (value === UserGender.Unknown ||
            value === UserGender.Female ||
            value === UserGender.Male ||
            value === UserGender.Other) {
            nativeMethods.setTargetingDataGender(value);
        }
    },

    /**
     * Gets the gender of the user.
     */
    get gender(): UserGender | Promise<UserGender> {
        return nativeMethods.getTargetingDataGender().then((value: string) => {
            return value as UserGender;
        });
    },

    /**
     * Sets the maximum ad content rating shown to the user. The levels are based on IQG Media
     * Ratings: 1=All Audiences, 2=Everyone Over 12, 3=Mature Audiences.  
     * Set this to {@link AdContentRating.None} to clear this value.
     */
    set maximumAdContentRating(value: AdContentRating | Promise<AdContentRating>) {
        if (value === AdContentRating.None ||
            value === AdContentRating.AllAudiences ||
            value === AdContentRating.EveryoneOverTwelve ||
            value === AdContentRating.MatureAudiences) {
            nativeMethods.setTargetingDataMaximumAdContentRating(value);
        }
    },

    /**
     * Gets the maximum ad content rating shown to the user. The levels are based on IQG Media
     * Ratings: 1=All Audiences, 2=Everyone Over 12, 3=Mature Audiences.
     */
    get maximumAdContentRating(): AdContentRating | Promise<AdContentRating> {
        return nativeMethods.getTargetingDataMaximumAdContentRating().then((value: number) => {
            return value as AdContentRating;
        });
    },

    /**
     * Sets the email of the user. Set this to null to clear this value.
     */
    set email(value: string | null | Promise<string | null>) {
        if (value === null) {
            nativeMethods.setTargetingDataEmail(null);
        } else if (typeof value === 'string') {
            nativeMethods.setTargetingDataEmail(value as string);
        }
    },

    /**
     * Gets the email of the user.
     */
    get email(): string | null | Promise<string | null> {
        return nativeMethods.getTargetingDataEmail();
    },

    /**
     * Sets the phone number of the user. Set this to null to clear this value.
     */
    set phoneNumber(value: string | null | Promise<string | null>) {
        if (value === null) {
            nativeMethods.setTargetingDataPhoneNumber(null);
        } else if ( typeof value === 'string') {
            nativeMethods.setTargetingDataPhoneNumber(value as string);
        }
    },

    /**
     * Gets the phone number of the user.
     */
    get phoneNumber(): string | null | Promise<string | null> {
        return nativeMethods.getTargetingDataPhoneNumber();
    },

    /**
     * Sets the keywords describing the application. Set this to null to clear this value.
     */
    set keywords(value: string[] | null | Promise<string[]> | null) {
        if (value === null) {
            nativeMethods.setTargetingDataKeywords(null);
        } else if (isStringArray(value)) {
            nativeMethods.setTargetingDataKeywords(value as string[]);
        }
    },

    /**
     * Gets the keywords describing the application.
     */
    get keywords(): string[] | null | Promise<string[] | null> {
        return nativeMethods.getTargetingDataKeywords();
    },

    /**
     * Sets the interests of the user. Set this to null to clear this value.
     */
    set interests(value: string[] | null | Promise<string[] | null>) {
        if (value === null) {
            nativeMethods.setTargetingDataInterests(null);
        } else if (isStringArray(value)) {
            nativeMethods.setTargetingDataInterests(value as string[]);
        }
    },

    /**
     * Gets the interests of the user.
     */
    get interests(): string[] | null | Promise<string[] | null> {
        return nativeMethods.getTargetingDataInterests();
    },

    /**
     *  Clears all saved data from this class.
     */
    clearAll(): void {
        nativeMethods.clearAllTargetingData();
    },
}

const isStringArray = (strs: any): boolean => {
    return Array.isArray(strs) && strs.every((value) => typeof value === 'string')
}
