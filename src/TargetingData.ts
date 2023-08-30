import { NativeModules } from "react-native";
import { UserGender, AdContentRating } from "./types/TargetingData";

const { AppLovinMAX } = NativeModules;

type TargetingDataNativeMethodType = {
    setTargetingDataYearOfBirth(value: number): void
    getTargetingDataYearOfBirth(): Promise<number>
    setTargetingDataGender(value: string): void
    getTargetingDataGender(): Promise<string>
    setTargetingDataMaximumAdContentRating(value: number): void
    getTargetingDataMaximumAdContentRating(): Promise<number>
    setTargetingDataEmail(value: string | null): void
    getTargetingDataEmail(): Promise<string | null>
    setTargetingDataPhoneNumber(value: string | null): void
    getTargetingDataPhoneNumber(): Promise<string | null>
    setTargetingDataKeywords(value: string[] | null): void
    getTargetingDataKeywords(): Promise<string[] | null>
    setTargetingDataInterests(value: string[] | null): void
    getTargetingDataInterests(): Promise<string[] | null>
    clearAllTargetingData(): Promise<void>
}

const nativeModule: TargetingDataNativeMethodType = AppLovinMAX;

export const TargetingData = {

    /**
     *  Sets the year of birth of the user.  Sets 0 to clear this value.
     */
    set yearOfBirth(value: number) {
        nativeModule.setTargetingDataYearOfBirth(value);
    },

    /**
     *  Gets the year of birth of the user.
     */
    get yearOfBirth(): Promise<number> {
        return nativeModule.getTargetingDataYearOfBirth();
    },

    /**
     * Sets the gender of the user.  Sets {UserGender.Unknown} to clear this value.
     */
    set gender(value: UserGender) {
        if (value === UserGender.Unknown ||
            value === UserGender.Female ||
            value === UserGender.Male ||
            value === UserGender.Other) {
            nativeModule.setTargetingDataGender(value);
        }
    },

    /**
     * Gets the gender of the user.
     */
    get gender(): Promise<UserGender> {
        return nativeModule.getTargetingDataGender().then((value: string) => {
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
            nativeModule.setTargetingDataMaximumAdContentRating(value);
        }
    },

    /**
     * Gets the maximum ad content rating shown to the user.
     */
    get maximumAdContentRating(): Promise<AdContentRating> {
        return nativeModule.getTargetingDataMaximumAdContentRating().then((value: number) => {
            return value as AdContentRating;
        });
    },

    /**
     * Sets the email of the user.  Sets null to clear this value.
     */
    set email(value: string | null) {
        nativeModule.setTargetingDataEmail(value);
    },

    /**
     * Gets the email of the user.
     */
    get email(): Promise<string | null> {
        return nativeModule.getTargetingDataEmail();
    },

    /**
     * Sets the phone number of the user.  Sets null to clear this value.
     */
    set phoneNumber(value: string | null) {
        nativeModule.setTargetingDataPhoneNumber(value);
    },

    /**
     * Gets the phone number of the user.
     */
    get phoneNumber(): Promise<string | null> {
        return nativeModule.getTargetingDataPhoneNumber();
    },

    /**
     * Sets the keywords describing the application.  Sets null to clear this value.
     */
    set keywords(value: string[] | null) {
        nativeModule.setTargetingDataKeywords(value);
    },

    /**
     * Gets the keywords describing the application.
     */
    get keywords(): Promise<string[] | null> {
        return nativeModule.getTargetingDataKeywords();
    },

    /**
     * Sets the interests of the user.  Sets null to clear this value.
     */
    set interests(value: string[] | null) {
        nativeModule.setTargetingDataInterests(value);
    },

    /**
     * Gets the interests of the user.
     */
    get interests(): Promise<string[] | null> {
        return nativeModule.getTargetingDataInterests();
    },

    /**
     *  Clear all saved data from this class.
     */
    clearAll(): void {
        nativeModule.clearAllTargetingData();
    },
}
