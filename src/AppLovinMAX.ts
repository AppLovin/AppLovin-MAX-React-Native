import { NativeModules } from "react-native";
import type { AppLovinMAXType } from "./types/AppLovinMAX";
import type { Configuration } from "./types/Configuration";

const NativeAppLovinMAX = NativeModules.AppLovinMAX;

const VERSION = "6.0.0";

const initialize = async (
    sdkKey: string
): Promise<Configuration> => {
    return NativeAppLovinMAX.initialize(VERSION, sdkKey);
}

type NativeAppLovinMAX = Omit<AppLovinMAXType, | 'initialize'>;

const nativeMethods: NativeAppLovinMAX = NativeAppLovinMAX;

export const AppLovinMAX: AppLovinMAXType = {
    ...nativeMethods,
    initialize,
}

export default AppLovinMAX;
