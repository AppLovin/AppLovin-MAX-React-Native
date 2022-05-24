import AppLovinMAX from "./index.js";

let UserSegment = {

  set name(value) {
    AppLovinMAX.setUserSegmentField(value);
  },
};

export {
  UserSegment,
};
