import { NativeModules } from "react-native";
import type { PrivacyInterface } from "./types/Privacy";

const { AppLovinMAX } = NativeModules;

export const Privacy: PrivacyInterface = AppLovinMAX;
