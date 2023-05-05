"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAppLovinMAXAndroid_1 = require("./withAppLovinMAXAndroid");
const withAppLovinMAXiOS_1 = require("./withAppLovinMAXiOS");
const pkg = require('react-native-applovin-max/package.json');
const withAppLovinMAX = (config, props) => {
    if (props.android) {
        config = (0, withAppLovinMAXAndroid_1.withAppLovinMAXManifest)(config, props.android);
        config = (0, withAppLovinMAXAndroid_1.withAppLovinMAXBuildGradle)(config, props.android);
    }
    if (props.ios) {
        config = (0, withAppLovinMAXiOS_1.withAppLovinMAXInfoPlist)(config, props.ios);
        config = (0, withAppLovinMAXiOS_1.withAppLovinMAXPodFile)(config, props.ios);
    }
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withAppLovinMAX, pkg.name, pkg.version);
