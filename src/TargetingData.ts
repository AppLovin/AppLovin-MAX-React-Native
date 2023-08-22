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

    set yearOfBirth(value: number) {
        nativeModule.setTargetingDataYearOfBirth(value);
    },

    get yearOfBirth(): Promise<number> {
        return nativeModule.getTargetingDataYearOfBirth();
    },

    set gender(value: UserGender) {
        if (value === UserGender.Unknown ||
            value === UserGender.Female ||
            value === UserGender.Male ||
            value === UserGender.Other) {
            nativeModule.setTargetingDataGender(value);
        }
    },

    get gender(): Promise<UserGender> {
        return nativeModule.getTargetingDataGender().then((value: string) => {
            return value as UserGender;
        });
    },

    set maximumAdContentRating(value: AdContentRating) {
        if (value === AdContentRating.None ||
            value === AdContentRating.AllAudiences ||
            value === AdContentRating.EveryoneOverTwelve ||
            value === AdContentRating.MatureAudiences) {
            nativeModule.setTargetingDataMaximumAdContentRating(value);
        }
    },

    get maximumAdContentRating(): Promise<AdContentRating> {
        return nativeModule.getTargetingDataMaximumAdContentRating().then((value: number) => {
            return value as AdContentRating;
        });
    },

    set email(value: string | null) {
        nativeModule.setTargetingDataEmail(value);
    },

    get email(): Promise<string | null> {
        return nativeModule.getTargetingDataEmail();
    },

    set phoneNumber(value: string | null) {
        nativeModule.setTargetingDataPhoneNumber(value);
    },

    get phoneNumber(): Promise<string | null> {
        return nativeModule.getTargetingDataPhoneNumber();
    },

    set keywords(value: string[] | null) {
        nativeModule.setTargetingDataKeywords(value);
    },

    get keywords(): Promise<string[] | null> {
        return nativeModule.getTargetingDataKeywords();
    },

    set interests(value: string[] | null) {
        nativeModule.setTargetingDataInterests(value);
    },

    get interests(): Promise<string[] | null> {
        return nativeModule.getTargetingDataInterests();
    },

    clearAll(): Promise<void> {
        return nativeModule.clearAllTargetingData();
    },
}
