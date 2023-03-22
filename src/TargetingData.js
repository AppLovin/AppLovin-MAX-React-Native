import { NativeModules } from "react-native";

const { AppLovinMAX } = NativeModules;

const AdContentRating = {
  None:               0,
  AllAudiences:       1,
  EveryoneOverTwelve: 2,
  MatureAudiences:    3,
};

const UserGender = {
  Unknown: 'U',
  Female:  'F',
  Male:    'M',
  Other:   'O'
};

const TargetingData = {

  set yearOfBirth(value) {
    AppLovinMAX.setTargetingDataYearOfBirth(value ? value : 0);
  },

  get yearOfBirth() {
    return AppLovinMAX.getTargetingDataYearOfBirth();
  },

  set gender(value) {
    if ( !value ) {
      AppLovinMAX.setTargetingDataGender(UserGender.Unknown);
    } else if ( value === UserGender.Unknown ||
         value === UserGender.Female ||
         value === UserGender.Male ||
         value === UserGender.Other ) {
      AppLovinMAX.setTargetingDataGender(value);
    }
  },

  get gender() {
    return AppLovinMAX.getTargetingDataGender();
  },

  set maximumAdContentRating(value) {
    if ( !value ) {
      AppLovinMAX.setTargetingDataMaximumAdContentRating(AdContentRating.None);
    } else if ( value === AdContentRating.None ||
         value === AdContentRating.AllAudiences ||
         value === AdContentRating.EveryoneOverTwelve ||
         value === AdContentRating.MatureAudiences ) {
      AppLovinMAX.setTargetingDataMaximumAdContentRating(value);
    }
  },

  get maximumAdContentRating() {
    return AppLovinMAX.getTargetingDataMaximumAdContentRating();
  },

  set email(value) {
    AppLovinMAX.setTargetingDataEmail(value);
  },

  get email() {
    return AppLovinMAX.getTargetingDataEmail();
  },

  set phoneNumber(value) {
    AppLovinMAX.setTargetingDataPhoneNumber(value);
  },

  get phoneNumber() {
    return AppLovinMAX.getTargetingDataPhoneNumber();
  },

  set keywords(value) {
    AppLovinMAX.setTargetingDataKeywords(value);
  },

  get keywords() {
    return AppLovinMAX.getTargetingDataKeywords();
  },

  set interests(value) {
    AppLovinMAX.setTargetingDataInterests(value);
  },

  get interests() {
    return AppLovinMAX.getTargetingDataInterests();
  },

  clearAll() {
    AppLovinMAX.clearAllTargetingData();
  }
  
};

TargetingData.AdContentRating = AdContentRating;
TargetingData.UserGender = UserGender;

export {
  TargetingData,
  AdContentRating,
  UserGender
};
