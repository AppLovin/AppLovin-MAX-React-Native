import { createRunOncePlugin } from '@expo/config-plugins';
import type { ConfigPlugin } from '@expo/config-plugins';
import type { PluginProps } from './PluginProps';
import { withAppLovinMAXManifest, withAppLovinMAXBuildGradle } from './withAppLovinMAXAndroid';
import { withAppLovinMAXInfoPlist, withAppLovinMAXPodFile } from './withAppLovinMAXiOS';

const pkg = require('react-native-applovin-max/package.json');

const withAppLovinMAX: ConfigPlugin<PluginProps> = (config, props) => {
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
