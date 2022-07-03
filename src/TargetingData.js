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

let TargetingData = {

  set yearOfBirth(value) {
    AppLovinMAX.setTargetingDataYearOfBirth(value);
  },

  set gender(value) {
    if ( value === UserGender.Unknown ||
         value === UserGender.Female ||
         value === UserGender.Male ||
         value === UserGender.Other ) {
      AppLovinMAX.setTargetingDataGender(value);
    }
  },

  set maximumAdContentRating(value) {
    if ( value === AdContentRating.None ||
         value === AdContentRating.AllAudiences ||
         value === AdContentRating.EveryoneOverTwelve ||
         value === AdContentRating.MatureAudiences ) {
      AppLovinMAX.setTargetingDataMaximumAdContentRating(value);
    }
  },

  set email(value) {
    AppLovinMAX.setTargetingDataEmail(value);
  },

  set phoneNumber(value) {
    AppLovinMAX.setTargetingDataPhoneNumber(value);
  },

  set keywords(value) {
    AppLovinMAX.setTargetingDataKeywords(value);
  },

  set interests(value) {
    AppLovinMAX.setTargetingDataInterests(value);
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
