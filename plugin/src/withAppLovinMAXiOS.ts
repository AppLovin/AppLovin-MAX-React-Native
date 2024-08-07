import { withInfoPlist, withDangerousMod } from '@expo/config-plugins';
import type { ConfigPlugin, InfoPlist } from '@expo/config-plugins';
import type { iOSPluginProps } from './PluginProps';
import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';

export const withAppLovinMAXInfoPlist: ConfigPlugin<iOSPluginProps> = (config, props) => {
    return withInfoPlist(config, (conf) => {
        conf.modResults = addAppLovinMAXConfig(conf.modResults, props);
        conf.modResults = addSKAdNetworkIdentifiers(conf.modResults, props);
        return conf;
    });
};

const addAppLovinMAXConfig = (infoPlist: InfoPlist, props: iOSPluginProps) => {
    if (!props.infoPlist) return infoPlist;

    for (const item of props.infoPlist) {
        infoPlist[item.key] = item.value;
    }

    return infoPlist;
};

const addSKAdNetworkIdentifiers = (infoPlist: InfoPlist, props: iOSPluginProps) => {
    if (!props.skAdNetworkIdFile) return infoPlist;

    let skAdNetworkIdContent;

    // console.log("Loading SKAdNetworkIds from " + props.skAdNetworkIdFile);

    try {
        skAdNetworkIdContent = readFileSync(props.skAdNetworkIdFile, 'utf-8');
    } catch (err) {
        console.error("Can't find " + props.skAdNetworkIdFile);
        return infoPlist;
    }

    // Use regexp to find a list of SKAdNetwork strings instead of using a DOM parser since there is
    // no standard DOM parser in Node.js.
    const regexp = new RegExp('<string>(.*?)</string>', 'g');
    const matchedStringList = skAdNetworkIdContent.match(regexp);
    if (!matchedStringList) {
        console.error('SKAdNetworkIdentifier not found in ' + props.skAdNetworkIdFile);
        return infoPlist;
    }

    // extract a string from the tagged string
    const skAdNetworkIdList = matchedStringList.map((s) => s.replace(/<string>|<\/string>/g, ''));
    if (!skAdNetworkIdList) {
        console.error('SKAdNetworkIdentifier not found in ' + props.skAdNetworkIdFile);
        return infoPlist;
    }

    if (!Array.isArray(infoPlist.SKAdNetworkItems)) {
        infoPlist.SKAdNetworkItems = [];
    }

    // Get ids
    let existingIds = infoPlist.SKAdNetworkItems.map((item: any) => item?.SKAdNetworkIdentifier ?? null).filter(Boolean) as string[];
    // remove duplicates
    existingIds = [...new Set(existingIds)];

    for (let i = 0; i < skAdNetworkIdList.length; i++) {
        const skAdNetworkId = skAdNetworkIdList[i];
        if (skAdNetworkId && !existingIds.includes(skAdNetworkId)) {
            infoPlist.SKAdNetworkItems.push({
                SKAdNetworkIdentifier: skAdNetworkId,
            });
        }
    }

    return infoPlist;
};

const updatePodfileContentsWithDependencies = (contents: string, props: iOSPluginProps) => {
    if (!props.dependencies) return contents;

    const patchKey = 'post_install';
    const slicedContent = contents.split(patchKey);

    slicedContent[0] += '\n';
    for (const item of props.dependencies) {
        slicedContent[0] += "pod '" + item + "'\n";
    }
    slicedContent[0] += '\n';

    return slicedContent.join(patchKey);
};

export const withAppLovinMAXPodFile: ConfigPlugin<iOSPluginProps> = (config, props) => {
    return withDangerousMod(config, [
        'ios',
        async (c) => {
            const { platformProjectRoot } = c.modRequest;
            const podfile = resolve(platformProjectRoot, 'Podfile');
            const contents = readFileSync(podfile, 'utf-8');
            const updatedContents = updatePodfileContentsWithDependencies(contents, props);
            writeFileSync(podfile, updatedContents);
            return c;
        },
    ]);
};
