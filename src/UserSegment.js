import { NativeModules } from "react-native";

const { AppLovinMAX } = NativeModules;

let UserSegment = {

  set name(value) {
    AppLovinMAX.setUserSegment(value);
  },
};

export {
  UserSegment,
};
