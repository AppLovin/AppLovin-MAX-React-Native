import { NativeModules } from "react-native";
import type { Configuration, AppLovinMAXInterface } from "./types/AppLovinMAX";

const NativeAppLovinMAX = NativeModules.AppLovinMAX;

const VERSION = "6.0.0";

const initialize = async (
    sdkKey: string
): Promise<Configuration> => {
    return NativeAppLovinMAX.initialize(VERSION, sdkKey);
}

interface NativeAppLovinMAX extends Omit<AppLovinMAXInterface, | 'initialize'> { }

const nativeMethods: NativeAppLovinMAX = NativeAppLovinMAX;

export const AppLovinMAX: AppLovinMAXInterface = {
    ...nativeMethods,
    initialize,
}

export default AppLovinMAX;
