import { AndroidConfig, withAndroidManifest, withAppBuildGradle, withProjectBuildGradle } from '@expo/config-plugins';
import type { ConfigPlugin } from '@expo/config-plugins';
import type { AndroidPluginProps } from './PluginProps';

const { getMainApplicationOrThrow, addMetaDataItemToMainApplication } = AndroidConfig.Manifest;

const addAppLovinMAXMetadata = (androidManifest: AndroidConfig.Manifest.AndroidManifest, props: AndroidPluginProps) => {
    if (!props.metaDataManifest) return androidManifest;

    let mainApplication = getMainApplicationOrThrow(androidManifest);

    for (const item of props.metaDataManifest) {
        addMetaDataItemToMainApplication(mainApplication, item.name, item.value);
    }

    return androidManifest;
};

// Add metadata to <application/> in AndroidManifest.xml
export const withAppLovinMAXManifest: ConfigPlugin<AndroidPluginProps> = (config, props) => {
    return withAndroidManifest(config, (conf) => {
        conf.modResults = addAppLovinMAXMetadata(conf.modResults, props);
        return conf;
    });
};

// Add repositories and dependencies to root-level build.gradle for Ad Review
const addAppLovinQualityServiceDependency = (rootBuildGradle: string, _: AndroidPluginProps) => {
    const appLovinRepositories = `maven { url 'https://artifacts.applovin.com/android' }`;
    const appLovinDependencies = `classpath ('com.applovin.quality:AppLovinQualityServiceGradlePlugin:+')`;

    if (!rootBuildGradle.includes(appLovinRepositories)) {
        rootBuildGradle = rootBuildGradle.replace(/repositories\s?{/, `repositories { \n        ${appLovinRepositories}`);
    }

    if (!rootBuildGradle.includes(appLovinDependencies)) {
        rootBuildGradle = rootBuildGradle.replace(/dependencies\s?{/, `dependencies { \n        ${appLovinDependencies}`);
    }

    return rootBuildGradle;
};

// Add repositories for additional networks to root-level build.gradle
const addAppLovinRepositories = (rootBuildGradle: string, props: AndroidPluginProps) => {
    if (!props.dependencies) return rootBuildGradle;

    let repositories = [];

    // check duplicates
    for (const item of props.dependencies) {
        if (!item.repository) continue;
        if (!rootBuildGradle.includes(item.repository)) {
            repositories.push('maven { url "' + item.repository + '" }');
        }
    }

    let str = '\n';
    for (const item of repositories) {
        str += '        ' + item + '\n';
    }

    rootBuildGradle = rootBuildGradle.replace(/allprojects *{\n.*repositories\s?{/, `allprojects {\n    repositories {\n${str}`);

    return rootBuildGradle;
};

// Add dependencies for additional networks to app-level build.gradle
const addAppLovinDependencies = (appBuildGradle: string, props: AndroidPluginProps) => {
    if (!props.dependencies) return appBuildGradle;

    let implementations = [];

    // check duplicates
    for (const item of props.dependencies) {
        if (!appBuildGradle.includes(item.dependency)) {
            implementations.push('implementation ("' + item.dependency + '")');
        }
    }

    let str = '\n';
    for (const item of implementations) {
        str += '    ' + item + '\n';
    }

    appBuildGradle = appBuildGradle.replace(/dependencies\s?{/, `dependencies { ${str}`);

    return appBuildGradle;
};

// Add plugin and apiKeyfor to app-level build.gradle Ad Review
const addAppLovinQualityServicePluginAndAPIKey = (appBuildGradle: string, props: AndroidPluginProps) => {
    if (!props.adReviewKey) return appBuildGradle;

    const appLovinPlugin = `\napply plugin: "applovin-quality-service"`;
    const appLovinAPIKey = `\napplovin { apiKey "` + props.adReviewKey + `" }`;

    if (!appBuildGradle.includes(appLovinPlugin)) {
        appBuildGradle += appLovinPlugin;
    }

    if (!appBuildGradle.includes(appLovinAPIKey)) {
        appBuildGradle += appLovinAPIKey;
    }

    return appBuildGradle;
};

export const withAppLovinMAXBuildGradle: ConfigPlugin<AndroidPluginProps> = (config, props) => {
    // root-level build gradle
    config = withProjectBuildGradle(config, (conf) => {
        // Add repositories and dependencies for Ad Review
        conf.modResults.contents = addAppLovinQualityServiceDependency(conf.modResults.contents, props);
        // Add repositories for additional networks
        conf.modResults.contents = addAppLovinRepositories(conf.modResults.contents, props);
        return conf;
    });

    // app-level build gradle
    config = withAppBuildGradle(config, (conf) => {
        // Add plugin and apiKeyfor Ad Review
        conf.modResults.contents = addAppLovinQualityServicePluginAndAPIKey(conf.modResults.contents, props);
        // Add dependencies for additional networks
        conf.modResults.contents = addAppLovinDependencies(conf.modResults.contents, props);
        return conf;
    });

    return config;
};
