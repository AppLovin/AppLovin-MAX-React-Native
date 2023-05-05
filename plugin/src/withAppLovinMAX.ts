import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';
import { withAppLovinMAXManifest, withAppLovinMAXBuildGradle } from './withAppLovinMAXAndroid';
import { withAppLovinMAXInfoPlist, withAppLovinMAXPodFile } from './withAppLovinMAXiOS';

const pkg = require('react-native-applovin-max/package.json');

const withAppLovinMAX: ConfigPlugin = (config, props: any) => {

    if (props.android) {
        config = withAppLovinMAXManifest(config, props.android);
        config = withAppLovinMAXBuildGradle(config, props.android);
    }

    if (props.ios) {
        config = withAppLovinMAXInfoPlist(config, props.ios);
        config = withAppLovinMAXPodFile(config, props.ios);
    }

    return config;
};

export default createRunOncePlugin(withAppLovinMAX, pkg.name, pkg.version);
