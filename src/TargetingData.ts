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

const TargetingDataNativeMethods: TargetingDataNativeMethodType = AppLovinMAX;

export const TargetingData = {

  set yearOfBirth(value: number) {
    TargetingDataNativeMethods.setTargetingDataYearOfBirth(value);
  },

  get yearOfBirth(): Promise<number> {
    return TargetingDataNativeMethods.getTargetingDataYearOfBirth();
  },

  set gender(value: UserGender) {
    if (value === UserGender.Unknown ||
      value === UserGender.Female ||
      value === UserGender.Male ||
      value === UserGender.Other) {
      TargetingDataNativeMethods.setTargetingDataGender(value);
    }
  },

  get gender(): Promise<UserGender> {
    return TargetingDataNativeMethods.getTargetingDataGender().then((value:string) => {
      return value as UserGender;
    });
  },

  set maximumAdContentRating(value: AdContentRating) {
    if (value === AdContentRating.None ||
      value === AdContentRating.AllAudiences ||
      value === AdContentRating.EveryoneOverTwelve ||
      value === AdContentRating.MatureAudiences) {
      TargetingDataNativeMethods.setTargetingDataMaximumAdContentRating(value);
    }
  },

  get maximumAdContentRating(): Promise<AdContentRating> {
    return TargetingDataNativeMethods.getTargetingDataMaximumAdContentRating().then((value:number) => {
      return value as AdContentRating;
    });
  },

  set email(value: string | null) {
    TargetingDataNativeMethods.setTargetingDataEmail(value);
  },

  get email(): Promise<string | null> {
    return TargetingDataNativeMethods.getTargetingDataEmail();
  },

  set phoneNumber(value: string | null) {
    TargetingDataNativeMethods.setTargetingDataPhoneNumber(value);
  },

  get phoneNumber(): Promise<string | null> {
    return TargetingDataNativeMethods.getTargetingDataPhoneNumber();
  },

  set keywords(value: string[] | null) {
    TargetingDataNativeMethods.setTargetingDataKeywords(value);
  },

  get keywords(): Promise<string[] | null> {
    return TargetingDataNativeMethods.getTargetingDataKeywords();
  },

  set interests(value: string[] | null) {
    TargetingDataNativeMethods.setTargetingDataInterests(value);
  },

  get interests(): Promise<string[] | null> {
    return TargetingDataNativeMethods.getTargetingDataInterests();
  },

  clearAll(): Promise<void> {
    return TargetingDataNativeMethods.clearAllTargetingData();
  },
}
