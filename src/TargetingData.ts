import { NativeModules } from "react-native";

const { AppLovinMAX } = NativeModules;

type TargetingDataNativeModules = {
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

const nativeTd: TargetingDataNativeModules = AppLovinMAX;

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

export const TargetingData = {

    /**
     *  Sets the year of birth of the user.  Sets 0 to clear this value.
     */
    set yearOfBirth(value: number) {
        nativeTd.setTargetingDataYearOfBirth(value);
    },

    /**
     *  Gets the year of birth of the user.
     */
    get yearOfBirth(): Promise<number> {
        return nativeTd.getTargetingDataYearOfBirth();
    },

    /**
     * Sets the gender of the user.  Sets {UserGender.Unknown} to clear this value.
     */
    set gender(value: UserGender) {
        if (value === UserGender.Unknown ||
            value === UserGender.Female ||
            value === UserGender.Male ||
            value === UserGender.Other) {
            nativeTd.setTargetingDataGender(value);
        }
    },

    /**
     * Gets the gender of the user.
     */
    get gender(): Promise<UserGender> {
        return nativeTd.getTargetingDataGender().then((value: string) => {
            return value as UserGender;
        });
    },

    /**
     * Sets the maximum ad content rating shown to the user.  Sets {AdContentRating.None} to clear this value.
     */
    set maximumAdContentRating(value: AdContentRating) {
        if (value === AdContentRating.None ||
            value === AdContentRating.AllAudiences ||
            value === AdContentRating.EveryoneOverTwelve ||
            value === AdContentRating.MatureAudiences) {
            nativeTd.setTargetingDataMaximumAdContentRating(value);
        }
    },

    /**
     * Gets the maximum ad content rating shown to the user.
     */
    get maximumAdContentRating(): Promise<AdContentRating> {
        return nativeTd.getTargetingDataMaximumAdContentRating().then((value: number) => {
            return value as AdContentRating;
        });
    },

    /**
     * Sets the email of the user.  Sets null to clear this value.
     */
    set email(value: string | null) {
        nativeTd.setTargetingDataEmail(value);
    },

    /**
     * Gets the email of the user.
     */
    get email(): Promise<string | null> {
        return nativeTd.getTargetingDataEmail();
    },

    /**
     * Sets the phone number of the user.  Sets null to clear this value.
     */
    set phoneNumber(value: string | null) {
        nativeTd.setTargetingDataPhoneNumber(value);
    },

    /**
     * Gets the phone number of the user.
     */
    get phoneNumber(): Promise<string | null> {
        return nativeTd.getTargetingDataPhoneNumber();
    },

    /**
     * Sets the keywords describing the application.  Sets null to clear this value.
     */
    set keywords(value: string[] | null) {
        nativeTd.setTargetingDataKeywords(value);
    },

    /**
     * Gets the keywords describing the application.
     */
    get keywords(): Promise<string[] | null> {
        return nativeTd.getTargetingDataKeywords();
    },

    /**
     * Sets the interests of the user.  Sets null to clear this value.
     */
    set interests(value: string[] | null) {
        nativeTd.setTargetingDataInterests(value);
    },

    /**
     * Gets the interests of the user.
     */
    get interests(): Promise<string[] | null> {
        return nativeTd.getTargetingDataInterests();
    },

    /**
     *  Clear all saved data from this class.
     */
    clearAll(): void {
        nativeTd.clearAllTargetingData();
    },
}
