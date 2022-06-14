import AppLovinMAX from "./index.js";

let UserSegment = {

  set name(value) {
    AppLovinMAX.setUserSegment(value);
  },
};

export {
  UserSegment,
};
