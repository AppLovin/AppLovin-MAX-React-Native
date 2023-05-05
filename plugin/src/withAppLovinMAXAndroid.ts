import {
    AndroidConfig,
    ConfigPlugin,
    withAndroidManifest,
    withAppBuildGradle,
    withProjectBuildGradle
} from '@expo/config-plugins';

const {
    getMainApplicationOrThrow,
    addMetaDataItemToMainApplication,
    removeMetaDataItemFromMainApplication,
} = AndroidConfig.Manifest;

export const withAppLovinMAXManifest: ConfigPlugin = (config, props) => {
    return withAndroidManifest(config, (config) => {
        config.modResults = setAppLovinMAXConfig(config.modResults, props);
        return config;
    });
};

const setAppLovinMAXConfig = (androidManifest: AndroidConfig.Manifest.AndroidManifest, props: any) => {
    if (!props.metaDataMainApplication) return androidManifest;

    let mainApplication = getMainApplicationOrThrow(androidManifest);

    for (const item of props.metaDataMainApplication) {
        addMetaDataItemToMainApplication(
            mainApplication,
            item.name,
            item.value
        );
    }

    return androidManifest;
};

const setAppLovinQualityServiceDependency = (rootBuildGradle: string, props: any) => {
    const appLovinRepositories = `maven { url 'https://artifacts.applovin.com/android' }`;
    const appLovinDependencies = `classpath ('com.applovin.quality:AppLovinQualityServiceGradlePlugin:+')`;

    if (!rootBuildGradle.includes(appLovinRepositories)) {
        rootBuildGradle = rootBuildGradle.replace(
            /repositories\s?{/,
            `repositories { \n        ${appLovinRepositories}`
        );
    }

    if (!rootBuildGradle.includes(appLovinDependencies)) {
        rootBuildGradle = rootBuildGradle.replace(
            /dependencies\s?{/,
            `dependencies { \n        ${appLovinDependencies}`
        );
    }

    return rootBuildGradle;
};

const setAppLovinRepositories = (rootBuildGradle: string, props: any) => {
    if (!props.dependencies) return rootBuildGradle;

    let repositories = [];

    // check duplicates
    for (const item of props.dependencies) {
        if (!item.repository) continue;
        if (!rootBuildGradle.includes(item.repository)) {
            repositories.push(item.repository)
        }
    }

    let str = '\n';
    for (const item of repositories) {
        str += '        ' + item + '\n';
    }

    rootBuildGradle = rootBuildGradle.replace(
        /allprojects *{\n.*repositories\s?{/,
        `allprojects {\n    repositories {\n${str}`
    );

    return rootBuildGradle;
}

const setAppLovinDependencies = (appBuildGradle: string, props: any) => {
    if (!props.dependencies) return appBuildGradle;

    let implementations = [];

    // check duplicates
    for (const item of props.dependencies) {
        if (!appBuildGradle.includes(item.dependency)) {
            implementations.push(item.dependency);
        }
    }

    // add the applovin sdk
    implementations.push("implementation (\"com.applovin:applovin-sdk:+\")");

    let str = '\n';
    for (const item of implementations) {
        str += '    ' + item + '\n';
    }

    appBuildGradle = appBuildGradle.replace(
        /dependencies\s?{/,
        `dependencies { ${str}`
    );

    return appBuildGradle;
};

const setAppLovinQualityServicePluginAndAPIKey = (appBuildGradle: string, props: any) => {
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

export const withAppLovinMAXBuildGradle: ConfigPlugin = (config, props) => {

    // root build gradle
    config = withProjectBuildGradle(config, (config) => {
        config.modResults.contents = setAppLovinQualityServiceDependency(config.modResults.contents, props);
        config.modResults.contents = setAppLovinRepositories(config.modResults.contents, props);
        return config;
    });

    // app build gradle
    config = withAppBuildGradle(config, (config) => {
        config.modResults.contents = setAppLovinQualityServicePluginAndAPIKey(config.modResults.contents, props);
        config.modResults.contents = setAppLovinDependencies(config.modResults.contents, props);
        return config;
    });

    return config;
};
