"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAppLovinMAXPodFile = exports.withAppLovinMAXInfoPlist = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const path_1 = require("path");
const fs_1 = require("fs");
const withAppLovinMAXInfoPlist = (config, props) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults = setAppLovinMAXConfig(config.modResults, props);
        config.modResults = setSKAdNetworkIdentifiers(config.modResults, props);
        return config;
    });
};
exports.withAppLovinMAXInfoPlist = withAppLovinMAXInfoPlist;
const setAppLovinMAXConfig = (infoPlist, props) => {
    if (!props.infoPlist)
        return infoPlist;
    for (const item of props.infoPlist) {
        infoPlist[item.key] = item.value;
    }
    return infoPlist;
};
const setSKAdNetworkIdentifiers = (infoPlist, props) => {
    if (!props.skAdNetworkIdFile)
        return infoPlist;
    let skAdNetworkIdContent;
    // console.log("Loading SKAdNetworkIds from " + props.skAdNetworkIdFile);
    try {
        skAdNetworkIdContent = (0, fs_1.readFileSync)(props.skAdNetworkIdFile, 'utf-8');
    }
    catch (err) {
        console.error("Can't read " + props.skAdNetworkIdFile + " for SKAdNetworkIds");
        return infoPlist;
    }
    // Use regexp to find a list of SKAdNetwork strings instead of using a DOM parser since there is
    // no standard DOM parser in Node.js.
    const regexp = new RegExp("<string>(.*?)</string>", "g");
    const matchedStringList = skAdNetworkIdContent.match(regexp);
    if (!matchedStringList) {
        console.error("SKAdNetworkIdentifier not found in " + props.skAdNetworkIdFile);
        return infoPlist;
    }
    // extract a string from the tagged string
    const skAdNetworkIdList = matchedStringList.map(s => s.replace(/<string>|<\/string>/g, ""));
    if (!skAdNetworkIdList) {
        console.error("SKAdNetworkIdentifier not found in " + props.skAdNetworkIdFile);
        return infoPlist;
    }
    if (!Array.isArray(infoPlist.SKAdNetworkItems)) {
        infoPlist.SKAdNetworkItems = [];
    }
    // Get ids
    let existingIds = infoPlist.SKAdNetworkItems.map((item) => item?.SKAdNetworkIdentifier ?? null).filter(Boolean);
    // remove duplicates
    existingIds = [...new Set(existingIds)];
    for (let i = 0; i < skAdNetworkIdList.length; i++) {
        const skAdNetworkId = skAdNetworkIdList[i];
        if (!existingIds.includes(skAdNetworkId)) {
            infoPlist.SKAdNetworkItems.push({
                SKAdNetworkIdentifier: skAdNetworkId,
            });
        }
    }
    return infoPlist;
};
const updatePodfileContentsWithDependencies = (contents, props) => {
    if (!props.dependencies)
        return contents;
    const patchKey = "post_install";
    const slicedContent = contents.split(patchKey);
    slicedContent[0] += '\n';
    slicedContent[0] += "  pod 'AppLovinSDK'\n";
    slicedContent[0] += '\n';
    for (const item of props.dependencies) {
        slicedContent[0] += "  " + item + "\n";
    }
    slicedContent[0] += '\n';
    return slicedContent.join(patchKey);
};
const withAppLovinMAXPodFile = (config, props) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        async (c) => {
            const { platformProjectRoot } = c.modRequest;
            const podfile = (0, path_1.resolve)(platformProjectRoot, 'Podfile');
            const contents = (0, fs_1.readFileSync)(podfile, 'utf-8');
            const updatedContents = updatePodfileContentsWithDependencies(contents, props);
            (0, fs_1.writeFileSync)(podfile, updatedContents);
            return c;
        }
    ]);
};
exports.withAppLovinMAXPodFile = withAppLovinMAXPodFile;
